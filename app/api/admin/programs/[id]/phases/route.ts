import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: programId } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

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
  const { name, description, start_date, end_date, order_index } = body;

  if (!name || !start_date || !end_date) {
    return NextResponse.json(
      { error: "Name, start date, and end date are required" },
      { status: 400 }
    );
  }

  // Get the max order_index if not provided
  let finalOrderIndex = order_index;
  if (finalOrderIndex === undefined) {
    const { data: maxPhase } = await adminClient
      .from("phases")
      .select("order_index")
      .eq("program_id", programId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    finalOrderIndex = maxPhase ? maxPhase.order_index + 1 : 0;
  }

  const { data, error } = await adminClient
    .from("phases")
    .insert({
      program_id: programId,
      name,
      description,
      start_date,
      end_date,
      order_index: finalOrderIndex,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ phase: data });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: programId } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: phases, error } = await adminClient
    .from("phases")
    .select("*")
    .eq("program_id", programId)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ phases });
}
