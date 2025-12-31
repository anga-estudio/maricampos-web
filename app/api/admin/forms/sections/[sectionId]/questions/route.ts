import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { QuestionType } from "@/lib/types/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { sectionId: section_id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    question_text,
    question_type,
    help_text,
    is_required,
    is_inverted,
    scale_min,
    scale_max,
    scale_min_label,
    scale_max_label,
    max_selections,
    scoring_category,
    order_index,
    options,
  } = body;

  if (!question_text || !question_type) {
    return NextResponse.json(
      { error: "Question text and type are required" },
      { status: 400 }
    );
  }

  // Get the max order_index if not provided
  let finalOrderIndex = order_index;
  if (finalOrderIndex === undefined) {
    const { data: maxQuestion } = await adminClient
      .from("form_questions")
      .select("order_index")
      .eq("section_id", section_id)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    finalOrderIndex = maxQuestion ? maxQuestion.order_index + 1 : 0;
  }

  const { data: question, error: questionError } = await adminClient
    .from("form_questions")
    .insert({
      section_id,
      question_text,
      question_type: question_type as QuestionType,
      help_text,
      is_required: is_required ?? true,
      is_inverted: is_inverted ?? false,
      scale_min,
      scale_max,
      scale_min_label,
      scale_max_label,
      max_selections,
      scoring_category,
      order_index: finalOrderIndex,
    })
    .select()
    .single();

  if (questionError) {
    return NextResponse.json({ error: questionError.message }, { status: 500 });
  }

  // Insert options if provided
  if (
    options &&
    Array.isArray(options) &&
    options.length > 0 &&
    (question_type === "single_choice" || question_type === "multiple_choice")
  ) {
    const optionsToInsert = options.map(
      (
        opt: { option_text: string; option_value?: string },
        index: number
      ) => ({
        question_id: question.id,
        option_text: opt.option_text,
        option_value: opt.option_value,
        order_index: index,
      })
    );

    const { error: optionsError } = await adminClient
      .from("form_options")
      .insert(optionsToInsert);

    if (optionsError) {
      // Rollback question creation
      await adminClient.from("form_questions").delete().eq("id", question.id);
      return NextResponse.json({ error: optionsError.message }, { status: 500 });
    }
  }

  // Fetch the complete question with options
  const { data: fullQuestion, error: fetchError } = await adminClient
    .from("form_questions")
    .select(
      `
      *,
      options:form_options(*)
    `
    )
    .eq("id", question.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ question: fullQuestion });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { sectionId: section_id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: questions, error } = await adminClient
    .from("form_questions")
    .select(
      `
      *,
      options:form_options(*)
    `
    )
    .eq("section_id", section_id)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ questions });
}
