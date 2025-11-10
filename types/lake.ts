export type Lake = {
  name: string;
  website: string | null;
  websiteUrl: string | null;
  email: string | null;
  contact: string | null;
  fishStocked: string | null;
  description: string | null;
  tags?: Array<string | null>;
  url: string | null;
  listingPage: string | null;
  scrapedAt: string | null;
};

export type EnrichedLake = Omit<Lake, "tags"> & {
  tags: string[];
  slug: string;
  region?: string;
  departments: string[];
  lakeSizes: string[];
  travelFromCalais: string[];
  travelFromStMalo: string[];
  scrapedDate?: Date;
};

