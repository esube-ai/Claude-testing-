import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-ink-secondary">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
