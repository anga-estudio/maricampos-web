import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { questionId } = await params;

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

  const updateData: Record<string, unknown> = {};
  if (question_text !== undefined) updateData.question_text = question_text;
  if (question_type !== undefined) updateData.question_type = question_type;
  if (help_text !== undefined) updateData.help_text = help_text;
  if (is_required !== undefined) updateData.is_required = is_required;
  if (is_inverted !== undefined) updateData.is_inverted = is_inverted;
  if (scale_min !== undefined) updateData.scale_min = scale_min;
  if (scale_max !== undefined) updateData.scale_max = scale_max;
  if (scale_min_label !== undefined) updateData.scale_min_label = scale_min_label;
  if (scale_max_label !== undefined) updateData.scale_max_label = scale_max_label;
  if (max_selections !== undefined) updateData.max_selections = max_selections;
  if (scoring_category !== undefined) updateData.scoring_category = scoring_category;
  if (order_index !== undefined) updateData.order_index = order_index;

  const { error } = await adminClient
    .from("form_questions")
    .update(updateData)
    .eq("id", questionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update options if provided
  if (options !== undefined && Array.isArray(options)) {
    // Delete existing options
    await adminClient.from("form_options").delete().eq("question_id", questionId);

    // Insert new options
    if (options.length > 0) {
      const optionsToInsert = options.map(
        (
          opt: { option_text: string; option_value?: string },
          index: number
        ) => ({
          question_id: questionId,
          option_text: opt.option_text,
          option_value: opt.option_value,
          order_index: index,
        })
      );

      const { error: optionsError } = await adminClient
        .from("form_options")
        .insert(optionsToInsert);

      if (optionsError) {
        return NextResponse.json(
          { error: optionsError.message },
          { status: 500 }
        );
      }
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
    .eq("id", questionId)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ question: fullQuestion });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { questionId } = await params;

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
    .from("form_questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
