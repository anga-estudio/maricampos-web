import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; formId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { formId } = await params;

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
  const { available_until, is_required } = body;

  const updateData: Record<string, unknown> = {};
  if (available_until !== undefined) updateData.available_until = available_until;
  if (is_required !== undefined) updateData.is_required = is_required;

  const { data, error } = await adminClient
    .from("program_forms")
    .update(updateData)
    .eq("id", formId)
    .select(
      `
      *,
      form_template:form_templates(*)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ program_form: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; formId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { formId } = await params;

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

  const { error } = await adminClient
    .from("program_forms")
    .delete()
    .eq("id", formId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
