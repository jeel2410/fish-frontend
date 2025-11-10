import data from "@/data.json";
import { normalizeLakes } from "@/lib/lake-utils";
import type { EnrichedLake, Lake } from "@/types/lake";

const rawLakes = data as Lake[];

export const lakes: EnrichedLake[] = normalizeLakes(rawLakes);

export const getLakeBySlug = (slug: string): EnrichedLake | undefined =>
  lakes.find((lake) => lake.slug === slug);

