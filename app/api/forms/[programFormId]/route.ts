import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Get form details for user to fill
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

  // Get the program form with template and all questions (using admin client to bypass RLS)
  const { data: programForm, error: programFormError } = await adminClient
    .from("program_forms")
    .select(
      `
      *,
      program:programs(*),
      form_template:form_templates(
        *,
        sections:form_sections(
          *,
          questions:form_questions(
            *,
            options:form_options(*)
          )
        )
      )
    `
    )
    .eq("id", programFormId)
    .single();

  if (programFormError || !programForm) {
    return NextResponse.json(
      { error: "Form not found" },
      { status: 404 }
    );
  }

  // Check if user is enrolled in the program (using admin client to bypass RLS)
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

  // Check if form is still available
  if (programForm.available_until) {
    const deadline = new Date(programForm.available_until);
    if (new Date() > deadline) {
      return NextResponse.json(
        { error: "O prazo para preenchimento deste formulário expirou" },
        { status: 403 }
      );
    }
  }

  // Check if user already submitted
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

  // Sort sections and questions
  if (programForm.form_template?.sections) {
    programForm.form_template.sections.sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    );
    programForm.form_template.sections.forEach(
      (section: {
        questions: { order_index: number; options: { order_index: number }[] }[];
      }) => {
        if (section.questions) {
          section.questions.sort((a, b) => a.order_index - b.order_index);
          section.questions.forEach((question) => {
            if (question.options) {
              question.options.sort((a, b) => a.order_index - b.order_index);
            }
          });
        }
      }
    );
  }

  return NextResponse.json({
    program_form: programForm,
    existing_submission: existingSubmission,
  });
}
