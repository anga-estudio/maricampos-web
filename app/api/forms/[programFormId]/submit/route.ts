import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

interface Answer {
  question_id: string;
  answer_text?: string;
  answer_scale?: number;
  answer_options?: string[];
}

interface QuestionData {
  id: string;
  is_inverted: boolean;
  scoring_category: string | null;
  question_type: string;
}

// Calculate scores based on answers
function calculateScores(
  answers: Answer[],
  questions: QuestionData[]
): { noiseScore: number; powerScore: number } {
  const questionMap = new Map<string, QuestionData>();
  questions.forEach((q) => questionMap.set(q.id, q));

  let noiseTotal = 0;
  let noiseCount = 0;
  let powerTotal = 0;
  let powerCount = 0;

  answers.forEach((answer) => {
    const question = questionMap.get(answer.question_id);
    if (!question) return;

    // Only scale questions contribute to scores
    if (question.question_type !== "scale" || answer.answer_scale === undefined)
      return;

    let value = answer.answer_scale;

    // Invert if needed
    if (question.is_inverted) {
      value = 10 - value;
    }

    if (question.scoring_category === "ruido_mental") {
      noiseTotal += value;
      noiseCount++;
    } else if (question.scoring_category === "potencia") {
      // Potencia questions are NOT inverted in the final calculation
      // They measure positive attributes, so higher = better
      // But for the score, we want 0-100 where higher = more potential
      powerTotal += answer.answer_scale; // Use original value, not inverted
      powerCount++;
    }
  });

  // Calculate Noise Score: (sum / count) * 10 = 0-100
  const noiseScore = noiseCount > 0 ? (noiseTotal / noiseCount) * 10 : 0;

  // Calculate Power Score: sum * 2 = 0-100 (for 5 questions, each 0-10)
  const powerScore = powerCount > 0 ? powerTotal * 2 : 0;

  return {
    noiseScore: Math.round(noiseScore * 100) / 100,
    powerScore: Math.round(powerScore * 100) / 100,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ programFormId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { programFormId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the program form (using admin client to bypass RLS)
  const { data: programForm, error: programFormError } = await adminClient
    .from("program_forms")
    .select("*, program:programs(*)")
    .eq("id", programFormId)
    .single();

  if (programFormError || !programForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // Check if user is enrolled (using admin client to bypass RLS)
  const { data: enrollment } = await adminClient
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", programForm.program_id)
    .single();

  if (!enrollment) {
    return NextResponse.json(
      { error: "Você não está matriculado neste programa" },
      { status: 403 }
    );
  }

  // Check deadline
  if (programForm.available_until) {
    const deadline = new Date(programForm.available_until);
    if (new Date() > deadline) {
      return NextResponse.json(
        { error: "O prazo para preenchimento deste formulário expirou" },
        { status: 403 }
      );
    }
  }

  // Check if already submitted
  const { data: existingSubmission } = await adminClient
    .from("form_submissions")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .eq("program_form_id", programFormId)
    .single();

  if (existingSubmission?.completed_at) {
    return NextResponse.json(
      { error: "Você já preencheu este formulário" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { answers } = body as { answers: Answer[] };

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "Answers are required" },
      { status: 400 }
    );
  }

  // Get all questions for this form to calculate scores
  const { data: sections } = await adminClient
    .from("form_sections")
    .select("id")
    .eq("form_template_id", programForm.form_template_id);

  const sectionIds = sections?.map((s) => s.id) || [];

  const { data: questions } = await adminClient
    .from("form_questions")
    .select("id, is_inverted, scoring_category, question_type")
    .in("section_id", sectionIds);

  // Calculate scores
  const { noiseScore, powerScore } = calculateScores(
    answers,
    (questions as QuestionData[]) || []
  );

  // Create or update submission
  let submissionId: string;

  if (existingSubmission) {
    // Update existing submission
    const { data: updated, error: updateError } = await adminClient
      .from("form_submissions")
      .update({
        noise_score: noiseScore,
        power_score: powerScore,
        completed_at: new Date().toISOString(),
      })
      .eq("id", existingSubmission.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    submissionId = updated.id;

    // Delete existing answers
    await adminClient
      .from("form_answers")
      .delete()
      .eq("submission_id", submissionId);
  } else {
    // Create new submission
    const { data: newSubmission, error: insertError } = await adminClient
      .from("form_submissions")
      .insert({
        user_id: user.id,
        program_form_id: programFormId,
        noise_score: noiseScore,
        power_score: powerScore,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    submissionId = newSubmission.id;
  }

  // Insert answers
  const answersToInsert = answers.map((answer) => ({
    submission_id: submissionId,
    question_id: answer.question_id,
    answer_text: answer.answer_text || null,
    answer_scale: answer.answer_scale ?? null,
    answer_options: answer.answer_options || null,
  }));

  const { error: answersError } = await adminClient
    .from("form_answers")
    .insert(answersToInsert);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  // Get the final submission with answers
  const { data: finalSubmission } = await adminClient
    .from("form_submissions")
    .select(
      `
      *,
      answers:form_answers(*)
    `
    )
    .eq("id", submissionId)
    .single();

  return NextResponse.json({
    submission: finalSubmission,
    scores: {
      noise_score: noiseScore,
      power_score: powerScore,
    },
  });
}
