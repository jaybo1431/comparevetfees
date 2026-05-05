/**
 * Seed Supabase with practice data from static file.
 *
 * Usage: npx tsx scripts/seed-practices.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in .env.local (loaded via dotenv below).
 */

import { createClient } from "@supabase/supabase-js";
import { practices, PRICE_KEYS } from "../src/data/practices";
import type { PriceKey } from "../src/data/practices";

// Load .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  console.log(`Seeding ${practices.length} practices...`);

  // De-duplicate by slug (practices.ts has duplicate "pet-health-partnership-upton")
  const seen = new Set<string>();
  const uniquePractices = practices.filter((p) => {
    if (seen.has(p.slug)) {
      console.warn(`  Skipping duplicate slug: ${p.slug}`);
      return false;
    }
    seen.add(p.slug);
    return true;
  });

  console.log(`  ${uniquePractices.length} unique practices after de-duplication`);

  for (const p of uniquePractices) {
    // Upsert practice
    const { data: practice, error: practiceError } = await supabase
      .from("practices")
      .upsert(
        {
          slug: p.slug,
          name: p.name,
          address: p.address,
          town: p.town,
          county: p.county,
          postcode: p.postcode,
          phone: p.phone,
          email: p.email || null,
          website: p.website || null,
          rating: p.rating,
          review_count: p.reviewCount,
          transparency_score: p.transparencyScore,
          is_independent: p.isIndependent,
          parent_group: p.parentGroup || null,
          opening_since: p.openingSince,
          lat: p.lat,
          lng: p.lng,
          features: p.features,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (practiceError) {
      console.error(`  Failed to upsert ${p.slug}:`, practiceError.message);
      continue;
    }

    console.log(`  ${p.name} → ${practice.id}`);

    // Insert prices
    const priceRows: Array<{
      practice_id: string;
      procedure_key: string;
      price: number;
      notes: string | null;
      effective_from: string;
    }> = [];

    for (const key of PRICE_KEYS) {
      const price = p.prices[key as PriceKey];
      if (price === undefined) continue;

      const notesKey = `${key}Notes` as keyof typeof p.prices;
      const notes = p.prices[notesKey];

      priceRows.push({
        practice_id: practice.id,
        procedure_key: key,
        price,
        notes: typeof notes === "string" ? notes : null,
        effective_from: "2026-04-01",
      });
    }

    if (priceRows.length > 0) {
      const { error: pricesError } = await supabase
        .from("prices")
        .upsert(priceRows, {
          onConflict: "practice_id,procedure_key,effective_from",
        });

      if (pricesError) {
        console.error(`  Failed to insert prices for ${p.slug}:`, pricesError.message);
      }
    }
  }

  console.log("\nDone! Seeded practices and prices.");
}

seed().catch(console.error);
