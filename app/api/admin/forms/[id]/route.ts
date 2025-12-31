import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: template, error } = await adminClient
    .from("form_templates")
    .select(
      `
      *,
      sections:form_sections(
        *,
        questions:form_questions(
          *,
          options:form_options(*)
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!template) {
    return NextResponse.json(
      { error: "Form template not found" },
      { status: 404 }
    );
  }

  // Sort sections and questions by order_index
  if (template.sections) {
    template.sections.sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    );
    template.sections.forEach(
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

  return NextResponse.json({ form_template: template });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id } = await params;

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
  const { name, description, intro_title, intro_description, is_active } = body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (intro_title !== undefined) updateData.intro_title = intro_title;
  if (intro_description !== undefined)
    updateData.intro_description = intro_description;
  if (is_active !== undefined) updateData.is_active = is_active;

  const { data, error } = await adminClient
    .from("form_templates")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ form_template: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id } = await params;

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

  const { error } = await adminClient.from("form_templates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
