import { createClient } from "./client";

export async function getContent<T = unknown>(
  site: string,
  key: string
): Promise<T | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("site", site)
    .eq("key", key)
    .single();

  return data?.value as T | null;
}

export async function getAllContent(
  site: string
): Promise<Record<string, unknown>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, value")
    .eq("site", site);

  if (!data) return {};

  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

export async function saveContent(
  site: string,
  key: string,
  value: unknown
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { site, key, value, updated_at: new Date().toISOString() },
      { onConflict: "site,key" }
    );

  return !error;
}
