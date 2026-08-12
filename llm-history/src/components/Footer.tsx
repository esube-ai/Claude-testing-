import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          History of LLMs — an independent, community-style reference tracking large
          language models from the 2017 Transformer paper onward.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/timeline" className="hover:text-ink-secondary">
            Timeline
          </Link>
          <Link to="/models" className="hover:text-ink-secondary">
            All models
          </Link>
          <Link to="/growth" className="hover:text-ink-secondary">
            Growth charts
          </Link>
          <Link to="/about" className="hover:text-ink-secondary">
            About &amp; sources
          </Link>
        </div>
      </div>
    </footer>
  );
}
