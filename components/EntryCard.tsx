"use client";

import { useMemo, useState } from "react";
import type { EnrichedLake } from "@/types/lake";

type Props = {
  entry: EnrichedLake;
};

const formatDateTime = (value?: Date) => {
  if (!value) return undefined;
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(value);
  } catch {
    return value.toISOString();
  }
};

const createAttributeSummary = (entry: EnrichedLake) => {
  const summary: Array<{ label: string; values: string[] }> = [];

  if (entry.region) {
    summary.push({ label: "Region", values: [entry.region] });
  }
  if (entry.departments.length > 0) {
    summary.push({ label: "Departments", values: entry.departments });
  }
  if (entry.lakeSizes.length > 0) {
    summary.push({ label: "Lake size", values: entry.lakeSizes });
  }
  if (entry.travelFromCalais.length > 0) {
    summary.push({
      label: "From Calais",
      values: entry.travelFromCalais
    });
  }
  if (entry.travelFromStMalo.length > 0) {
    summary.push({
      label: "From St Malo",
      values: entry.travelFromStMalo
    });
  }

  return summary;
};

const RAW_LABELS = new Set(
  [
    "Region",
    "French Departments",
    "Lake Size",
    "Travel Time from Calais",
    "Travel Time from St Malo"
  ].map((label) => label.toLowerCase())
);

const EntryCard = ({ entry }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const description = entry.description?.trim();
  const hasLongDescription = (description?.length ?? 0) > 420;
  const visibleDescription = useMemo(() => {
    if (!description) return "No description provided.";
    if (!expanded && hasLongDescription) {
      return `${description.slice(0, 380)}…`;
    }
    return description;
  }, [description, expanded, hasLongDescription]);

  const attributeSummary = useMemo(() => createAttributeSummary(entry), [entry]);

  const formattedScrapeDate = formatDateTime(entry.scrapedDate);

  const rawTagChips = useMemo(() => {
    if (!entry.tags?.length) return null;

    const distinct = Array.from(
      new Set(entry.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0))
    );
    const cleaned = distinct.filter(
      (tag) => !RAW_LABELS.has(tag.toLowerCase())
    );
    if (cleaned.length === 0) return null;

    const visible = cleaned.slice(0, 9);
    const remaining = cleaned.length - visible.length;

    return (
      <>
        {visible.map((tag) => (
          <span key={tag} className="tag" style={{ opacity: 0.7 }}>
            {tag}
          </span>
        ))}
        {remaining > 0 ? (
          <span className="tag" style={{ opacity: 0.6 }}>
            +{remaining} more
          </span>
        ) : null}
      </>
    );
  }, [entry.tags]);

  return (
    <article className="entry-card" aria-label={entry.name}>
      <header className="entry-card__header">
        <h2 className="entry-card__title">{entry.name}</h2>
        <div className="entry-card__meta">
          {entry.fishStocked ? (
            <span>Stock: {entry.fishStocked}</span>
          ) : null}
          {formattedScrapeDate ? (
            <span>Updated {formattedScrapeDate}</span>
          ) : null}
        </div>
      </header>

      <p className="entry-card__description">
        {visibleDescription}
        {hasLongDescription ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="link-button"
            style={{
              marginTop: "0.75rem",
              paddingInline: "0.65rem",
              fontSize: "0.8rem"
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        ) : null}
      </p>

      {attributeSummary.length > 0 ? (
        <div className="entry-card__tags">
          {attributeSummary.map((attribute) =>
            attribute.values.map((value) => (
              <span key={`${attribute.label}-${value}`} className="tag">
                {attribute.label}: {value}
              </span>
            ))
          )}
        </div>
      ) : null}

      {rawTagChips ? (
        <div className="entry-card__tags" aria-label="Raw tags">
          {rawTagChips}
        </div>
      ) : null}

      <div className="entry-card__links">
        {entry.websiteUrl ? (
          <a
            className="link-button"
            href={entry.websiteUrl.startsWith("http") ? entry.websiteUrl : `https://${entry.websiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website
          </a>
        ) : null}
        {entry.listingPage ? (
          <a
            className="link-button"
            href={entry.listingPage}
            target="_blank"
            rel="noopener noreferrer"
          >
            Listing
          </a>
        ) : null}
        {entry.url ? (
          <a
            className="link-button"
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        ) : null}
        {entry.email ? (
          <a className="link-button" href={`mailto:${entry.email}`}>
            Email
          </a>
        ) : null}
      </div>

      {(entry.contact || entry.website) && (
        <div className="entry-card__meta">
          {entry.contact ? <span>Contact: {entry.contact}</span> : null}
          {entry.website && !entry.websiteUrl ? (
            <span>Website: {entry.website}</span>
          ) : null}
        </div>
      )}
    </article>
  );
};

export default EntryCard;

