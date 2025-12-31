import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id: program_id } = await params;

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
  const { form_template_id, available_until, is_required } = body;

  if (!form_template_id) {
    return NextResponse.json(
      { error: "Form template ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await adminClient
    .from("program_forms")
    .insert({
      program_id,
      form_template_id,
      available_until,
      is_required: is_required ?? false,
    })
    .select(
      `
      *,
      form_template:form_templates(*)
    `
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Este formulário já está associado a este programa" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ program_form: data });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id: program_id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: programForms, error } = await adminClient
    .from("program_forms")
    .select(
      `
      *,
      form_template:form_templates(*)
    `
    )
    .eq("program_id", program_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ program_forms: programForms });
}
