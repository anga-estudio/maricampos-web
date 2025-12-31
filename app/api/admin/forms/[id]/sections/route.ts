import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id: form_template_id } = await params;

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
  const { title, description, order_index } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Get the max order_index if not provided
  let finalOrderIndex = order_index;
  if (finalOrderIndex === undefined) {
    const { data: maxSection } = await adminClient
      .from("form_sections")
      .select("order_index")
      .eq("form_template_id", form_template_id)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    finalOrderIndex = maxSection ? maxSection.order_index + 1 : 0;
  }

  const { data, error } = await adminClient
    .from("form_sections")
    .insert({
      form_template_id,
      title,
      description,
      order_index: finalOrderIndex,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ section: data });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { id: form_template_id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sections, error } = await adminClient
    .from("form_sections")
    .select("*")
    .eq("form_template_id", form_template_id)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sections });
}
