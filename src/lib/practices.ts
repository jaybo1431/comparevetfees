/**
 * Data access layer for practices.
 *
 * Fetches from Supabase, falls back to static data on error.
 * Returns the same Practice interface so all existing components work unchanged.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import {
  practices as staticPractices,
  getPracticeBySlug as staticGetPracticeBySlug,
  getPracticesByTown as staticGetPracticesByTown,
  getAveragePrice as staticGetAveragePrice,
  searchPractices as staticSearchPractices,
  getTowns as staticGetTowns,
  type Practice,
  type PriceList,
  type PriceKey,
  PRICE_KEYS,
} from "@/data/practices";

// Re-export types so consumers can import from this module
export type { Practice, PriceList, PriceKey };
export { PRICE_KEYS };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface DbPractice {
  id: string;
  slug: string;
  name: string;
  address: string;
  town: string;
  county: string;
  postcode: string;
  phone: string;
  email: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  transparency_score: number;
  is_independent: boolean;
  parent_group: string | null;
  opening_since: number | null;
  lat: number | null;
  lng: number | null;
  features: string[];
}

interface DbPrice {
  procedure_key: string;
  price: number;
  notes: string | null;
}

/** Convert DB rows into the Practice interface shape that all components expect. */
function toFrontendPractice(
  row: DbPractice,
  priceRows: DbPrice[]
): Practice {
  const prices: Record<string, number | string | undefined> = {};

  for (const pr of priceRows) {
    prices[pr.procedure_key] = pr.price;
    if (pr.notes) {
      prices[`${pr.procedure_key}Notes`] = pr.notes;
    }
  }

  return {
    slug: row.slug,
    name: row.name,
    address: row.address,
    town: row.town,
    county: row.county,
    postcode: row.postcode,
    phone: row.phone,
    email: row.email ?? undefined,
    website: row.website ?? "",
    rating: Number(row.rating),
    reviewCount: row.review_count,
    transparencyScore: row.transparency_score,
    isIndependent: row.is_independent,
    parentGroup: row.parent_group ?? undefined,
    openingSince: row.opening_since ?? 2000,
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    features: row.features ?? [],
    prices: prices as unknown as PriceList,
  };
}

// ---------------------------------------------------------------------------
// Public API — each function tries Supabase, falls back to static
// ---------------------------------------------------------------------------

export async function getAllPractices(): Promise<Practice[]> {
  try {
    const supabase = createAdminClient();

    const { data: practiceRows, error } = await supabase
      .from("practices")
      .select("*")
      .eq("is_published", true)
      .order("name");

    if (error || !practiceRows) throw error;

    // Fetch all current prices in one query
    const { data: priceRows } = await supabase
      .from("current_prices")
      .select("practice_id, procedure_key, price, notes");

    const priceMap = new Map<string, DbPrice[]>();
    for (const pr of priceRows ?? []) {
      const list = priceMap.get(pr.practice_id) ?? [];
      list.push(pr as DbPrice);
      priceMap.set(pr.practice_id, list);
    }

    return practiceRows.map((row) =>
      toFrontendPractice(row as DbPractice, priceMap.get(row.id) ?? [])
    );
  } catch (e) {
    console.warn("Supabase fetch failed, using static data:", e);
    return staticPractices;
  }
}

export async function getPracticeBySlug(
  slug: string
): Promise<Practice | undefined> {
  try {
    const supabase = createAdminClient();

    const { data: row, error } = await supabase
      .from("practices")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !row) throw error;

    const { data: priceRows } = await supabase
      .from("current_prices")
      .select("procedure_key, price, notes")
      .eq("practice_id", row.id);

    return toFrontendPractice(row as DbPractice, (priceRows ?? []) as DbPrice[]);
  } catch {
    return staticGetPracticeBySlug(slug);
  }
}

export async function getPracticesByTown(town: string): Promise<Practice[]> {
  try {
    const supabase = createAdminClient();

    const { data: practiceRows, error } = await supabase
      .from("practices")
      .select("*")
      .ilike("town", town)
      .eq("is_published", true)
      .order("name");

    if (error || !practiceRows) throw error;

    const ids = practiceRows.map((r) => r.id);
    const { data: priceRows } = await supabase
      .from("current_prices")
      .select("practice_id, procedure_key, price, notes")
      .in("practice_id", ids);

    const priceMap = new Map<string, DbPrice[]>();
    for (const pr of priceRows ?? []) {
      const list = priceMap.get(pr.practice_id) ?? [];
      list.push(pr as DbPrice);
      priceMap.set(pr.practice_id, list);
    }

    return practiceRows.map((row) =>
      toFrontendPractice(row as DbPractice, priceMap.get(row.id) ?? [])
    );
  } catch {
    return staticGetPracticesByTown(town);
  }
}

export async function getAveragePrice(key: PriceKey): Promise<number> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("current_prices")
      .select("price")
      .eq("procedure_key", key);

    if (error || !data || data.length === 0) throw error;

    const sum = data.reduce((acc, r) => acc + Number(r.price), 0);
    return Math.round(sum / data.length);
  } catch {
    return staticGetAveragePrice(key);
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("practices")
      .select("slug")
      .eq("is_published", true);

    if (error || !data) throw error;
    return data.map((r) => r.slug);
  } catch {
    return staticPractices.map((p) => p.slug);
  }
}

export async function getTowns(): Promise<string[]> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("practices")
      .select("town")
      .eq("is_published", true);

    if (error || !data) throw error;

    const towns = [...new Set(data.map((r) => r.town))];
    return towns.sort();
  } catch {
    return staticGetTowns();
  }
}

/** Client-side search — uses static data (no Supabase round-trip needed). */
export function searchPractices(query: string): Practice[] {
  return staticSearchPractices(query);
}

/** Look up practice UUID by slug — used by API routes to insert leads. */
export async function getPracticeIdBySlug(
  slug: string
): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("practices")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return data.id;
  } catch {
    return null;
  }
}
