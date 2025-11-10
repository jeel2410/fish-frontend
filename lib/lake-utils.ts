import type { EnrichedLake, Lake } from "@/types/lake";

const TAG_LABELS = [
  "Region",
  "French Departments",
  "Lake Size",
  "Travel Time from Calais",
  "Travel Time from St Malo"
] as const;

const LABEL_SET = new Set(TAG_LABELS.map((label) => label.toLowerCase()));

const collectValues = (tags: unknown[], label: string) => {
  const values: string[] = [];
  const lowerLabel = label.toLowerCase();
  const startIndex = tags.findIndex(
    (tag) => typeof tag === "string" && tag.toLowerCase() === lowerLabel
  );

  if (startIndex === -1) {
    return values;
  }

  for (let index = startIndex + 1; index < tags.length; index += 1) {
    const candidate = tags[index];
    if (typeof candidate !== "string") {
      continue;
    }
    if (LABEL_SET.has(candidate.toLowerCase())) {
      break;
    }
    const trimmed = candidate.trim();
    if (trimmed.length > 0 && !values.includes(trimmed)) {
      values.push(trimmed);
    }
  }

  return values;
};

const parseDate = (raw: string | null | undefined) => {
  if (!raw) {
    return undefined;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const slugify = (input: string, fallback: string, index: number) => {
  const baseTarget = (input || fallback || "lake")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const base = baseTarget.length > 0 ? baseTarget : `lake`;
  return `${base}-${index}`;
};

export const normalizeLake = (entry: Lake, index: number): EnrichedLake => {
  const rawTags = Array.isArray(entry.tags) ? entry.tags : [];
  const sanitizedTags = rawTags
    .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    .map((tag) => tag.trim());

  const region = collectValues(sanitizedTags, "Region")[0];
  const departments = collectValues(sanitizedTags, "French Departments");
  const lakeSizes = collectValues(sanitizedTags, "Lake Size");
  const travelFromCalais = collectValues(sanitizedTags, "Travel Time from Calais");
  const travelFromStMalo = collectValues(sanitizedTags, "Travel Time from St Malo");

  return {
    ...entry,
    tags: sanitizedTags,
    region,
    departments,
    lakeSizes,
    travelFromCalais,
    travelFromStMalo,
    scrapedDate: parseDate(entry.scrapedAt),
    slug: slugify(entry.name ?? "", region ?? entry.name ?? "", index)
  };
};

export const normalizeLakes = (entries: Lake[]): EnrichedLake[] =>
  entries.map((entry, index) => normalizeLake(entry, index));

