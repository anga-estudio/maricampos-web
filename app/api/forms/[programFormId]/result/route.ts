import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Get submission result for a user
export async function GET(
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

  // Get submission with answers (using admin client to bypass RLS)
  const { data: submission, error } = await adminClient
    .from("form_submissions")
    .select(
      `
      *,
      answers:form_answers(
        *,
        question:form_questions(
          *,
          options:form_options(*),
          section:form_sections(*)
        )
      ),
      program_form:program_forms(
        *,
        program:programs(*),
        form_template:form_templates(*)
      )
    `
    )
    .eq("user_id", user.id)
    .eq("program_form_id", programFormId)
    .single();

  if (error || !submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  if (!submission.completed_at) {
    return NextResponse.json(
      { error: "Form not completed yet" },
      { status: 400 }
    );
  }

  // Generate interpretation based on scores
  const noiseScore = submission.noise_score || 0;
  const powerScore = submission.power_score || 0;

  let noiseInterpretation = "";
  let recommendation = "";

  if (noiseScore <= 20) {
    noiseInterpretation = "Mente mais calma e regulada";
  } else if (noiseScore <= 40) {
    noiseInterpretation = "Ruído moderado, com bons recursos";
  } else if (noiseScore <= 60) {
    noiseInterpretation = "Ruído alto, atenção e energia bem drenadas";
  } else if (noiseScore <= 80) {
    noiseInterpretation = "Sobrecarga, piloto automático dominando";
  } else {
    noiseInterpretation = "Alerta máximo, urgência de reorganização interna";
  }

  // Generate recommendation based on both scores
  if (noiseScore > 50 && powerScore > 50) {
    recommendation =
      "Você está potente mas desregulado: o Silencie vai organizar energia e foco.";
  } else if (noiseScore > 50 && powerScore <= 50) {
    recommendation =
      "Se o Ruído estiver alto, sua prioridade é: pausar, regular e criar espaço entre estímulo e resposta.";
  } else if (noiseScore <= 50 && powerScore <= 50) {
    recommendation =
      "Se a Potência estiver baixa, sua prioridade é: consistência pequena e diária, mesmo com mente imperfeita.";
  } else {
    recommendation =
      "Você está em terreno fértil: o Silencie aprofunda presença e refinamento.";
  }

  return NextResponse.json({
    submission,
    interpretation: {
      noise_level: noiseInterpretation,
      recommendation,
    },
  });
}
