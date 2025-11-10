"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { EnrichedLake } from "@/types/lake";

type Props = {
  entries: EnrichedLake[];
};

const DataExplorer = ({ entries }: Props) => {
  const sortedEntries = useMemo(() => {
    const cloned = [...entries];
    cloned.sort((a, b) => {
      const nameA = typeof a.name === "string" ? a.name : "";
      const nameB = typeof b.name === "string" ? b.name : "";
      return nameA.localeCompare(nameB);
    });
    return cloned;
  }, [entries]);

  const uniqueRegions = useMemo(() => {
    const regions = new Set<string>();
    entries.forEach((entry) => {
      if (typeof entry.region === "string" && entry.region.trim()) {
        regions.add(entry.region);
      }
    });
    return regions.size;
  }, [entries]);

  const uniqueLakeSizes = useMemo(() => {
    const lakeSizes = new Set<string>();
    entries.forEach((entry) => {
      entry.lakeSizes.forEach((size) => {
        if (size.trim()) {
          lakeSizes.add(size);
        }
      });
    });
    return lakeSizes.size;
  }, [entries]);

  const latestEntry = useMemo(() => {
    return entries.reduce<Date | undefined>((latest, entry) => {
      if (!entry.scrapedDate) return latest;
      if (!latest || entry.scrapedDate > latest) {
        return entry.scrapedDate;
      }
      return latest;
    }, undefined);
  }, [entries]);

  return (
    <section>
      <div className="stats">
        <div className="stats__card">
          <span className="stats__value">{entries.length}</span>
          <span className="stats__label">Total listings</span>
        </div>
        <div className="stats__card">
          <span className="stats__value">{uniqueRegions}</span>
          <span className="stats__label">Regions covered</span>
        </div>
        <div className="stats__card">
          <span className="stats__value">{uniqueLakeSizes}</span>
          <span className="stats__label">Lake size categories</span>
        </div>
        {latestEntry ? (
          <div className="stats__card">
            <span className="stats__value">
              {latestEntry.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </span>
            <span className="stats__label">Latest scrape date</span>
          </div>
        ) : null}
      </div>

      <div className="table-wrapper">
        <table className="lakes-table">
          <thead>
            <tr>
              <th scope="col">Lake</th>
              <th scope="col">Region</th>
              <th scope="col">Lake size</th>
              <th scope="col">Travel (Calais)</th>
              <th scope="col">Fish stocked</th>
              <th scope="col">Updated</th>
              <th scope="col" className="lakes-table__actions" />
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.slug}>
                <td data-heading="Lake">
                  <Link
                    href={`/lakes/${entry.slug}`}
                    className="lakes-table__name"
                  >
                    {entry.name}
                  </Link>
                </td>
                <td data-heading="Region">{entry.region ?? "—"}</td>
                <td data-heading="Lake size">
                  {entry.lakeSizes.length > 0
                    ? entry.lakeSizes.join(", ")
                    : "—"}
                </td>
                <td data-heading="Travel (Calais)">
                  {entry.travelFromCalais.length > 0
                    ? entry.travelFromCalais.join(", ")
                    : "—"}
                </td>
                <td data-heading="Fish stocked">
                  {entry.fishStocked ?? "—"}
                </td>
                <td data-heading="Updated">
                  {entry.scrapedDate
                    ? entry.scrapedDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                    : "—"}
                </td>
                <td className="lakes-table__actions">
                  <Link
                    href={`/lakes/${entry.slug}`}
                    className="link-button"
                    style={{ padding: "0.4rem 0.75rem" }}
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataExplorer;

