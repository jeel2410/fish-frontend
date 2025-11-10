import Link from "next/link";
import { notFound } from "next/navigation";
import { getLakeBySlug } from "@/lib/lakes";

type LakePageProps = {
  params: {
    slug: string;
  };
};

const buildHeroImage = (name: string, region?: string) => {
  const query = encodeURIComponent(`${region ?? ""} carp lake France ${name}`);
  return `https://source.unsplash.com/1200x600/?${query}`;
};

const formatList = (values: string[]) =>
  values.length > 0 ? values.join(", ") : "—";

const renderDescription = (description: string | null) => {
  if (!description) {
    return <p>No description available for this lake yet.</p>;
  }

  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => (
      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
    ));
};

const LakeDetailPage = ({ params }: LakePageProps) => {
  const lake = getLakeBySlug(params.slug);

  if (!lake) {
    notFound();
  }

  const heroImage = buildHeroImage(lake.name, lake.region);
  const lastUpdated = lake.scrapedDate
    ? lake.scrapedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;

  return (
    <main className="lake-detail">
      <div className="lake-detail__hero">
        <img
          src={heroImage}
          alt={`Scenic view representing ${lake.name}`}
          className="lake-detail__hero-image"
          loading="lazy"
        />
        <div className="lake-detail__hero-overlay">
          <Link href="/" className="link-button lake-detail__back">
            ← Back to all lakes
          </Link>
          <h1 className="lake-detail__title">{lake.name}</h1>
          <p className="lake-detail__subtitle">
            {lake.region ? `Region: ${lake.region}` : "Region unknown"}
          </p>
        </div>
      </div>

      <div className="lake-detail__content">
        <section className="lake-detail__section">
          <h2>Overview</h2>
          <div className="lake-detail__grid">
            <div>
              <span className="lake-detail__label">Lake size</span>
              <span>{formatList(lake.lakeSizes)}</span>
            </div>
            <div>
              <span className="lake-detail__label">Departments</span>
              <span>{formatList(lake.departments)}</span>
            </div>
            <div>
              <span className="lake-detail__label">Travel from Calais</span>
              <span>{formatList(lake.travelFromCalais)}</span>
            </div>
            <div>
              <span className="lake-detail__label">Travel from St Malo</span>
              <span>{formatList(lake.travelFromStMalo)}</span>
            </div>
            <div>
              <span className="lake-detail__label">Fish stocked</span>
              <span>{lake.fishStocked ?? "—"}</span>
            </div>
            <div>
              <span className="lake-detail__label">Last updated</span>
              <span>{lastUpdated ?? "—"}</span>
            </div>
          </div>
        </section>

        <section className="lake-detail__section">
          <h2>Description</h2>
          <div className="lake-detail__description">
            {renderDescription(lake.description)}
          </div>
        </section>

        {lake.tags.length > 0 ? (
          <section className="lake-detail__section">
            <h2>Tags</h2>
            <div className="entry-card__tags" aria-label="Tags for the lake">
              {lake.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

      </div>
    </main>
  );
};

export default LakeDetailPage;

