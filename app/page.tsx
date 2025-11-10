import DataExplorer from "@/components/DataExplorer";
import { lakes } from "@/lib/lakes";

const HomePage = () => {
  return (
    <main className="container">
      <div className="page-header">
        <h1 className="page-header__title">French Carp Lakes Explorer</h1>
        <p className="page-header__subtitle">
          Dive into a curated dataset of carp fishing lakes scraped from
          CarpView. Filter by region, lake size, or simply search to uncover the
          venues, facilities and travel details that matter to your next
          session.
        </p>
      </div>

      <DataExplorer entries={lakes} />
    </main>
  );
};

export default HomePage;

