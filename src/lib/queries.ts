import { createClient } from "@/lib/supabase/server";
import type { Asset, AssetKind } from "@/lib/types";

/** Fetch all assets of a kind, newest first (public read via RLS). */
export async function getAssets(kind: AssetKind): Promise<Asset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("kind", kind)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as Asset[]) ?? [];
}
