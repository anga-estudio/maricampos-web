import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import FormFiller from "./components/form-filler";

interface FormPageProps {
  params: Promise<{ programFormId: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { programFormId } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/authentication/sign-in");
  }

  // Get the program form with all details (using admin client to bypass RLS)
  const { data: programForm, error } = await adminClient
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

  if (error || !programForm) {
    notFound();
  }

  // Check if user is enrolled
  const { data: enrollment } = await adminClient
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", programForm.program_id)
    .single();

  if (!enrollment) {
    redirect("/home");
  }

  // Check deadline
  if (programForm.available_until) {
    const deadline = new Date(programForm.available_until);
    if (new Date() > deadline) {
      redirect(`/forms/${programFormId}/expired`);
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
    redirect(`/forms/${programFormId}/result`);
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

  return (
    <FormFiller
      programForm={programForm}
      programFormId={programFormId}
    />
  );
}
