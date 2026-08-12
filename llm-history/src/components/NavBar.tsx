import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { to: "/timeline", label: "Timeline" },
  { to: "/models", label: "Models" },
  { to: "/growth", label: "Growth" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-ink" : "text-ink-secondary hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-2 text-ink" aria-label="History of LLMs home">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0b0b0b" />
            <circle cx="8" cy="22" r="3" fill="var(--series-1)" />
            <circle cx="16" cy="10" r="3" fill="var(--series-3)" />
            <circle cx="24" cy="16" r="3" fill="var(--series-7)" />
            <path d="M10.4 20.2 14 12.6M18.4 11.3 21.8 14.6" stroke="#c3c2b7" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="text-base font-semibold tracking-tight whitespace-nowrap">
            History of LLMs
          </span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-hairline bg-surface px-4 pb-4 md:hidden"
          aria-label="Primary mobile"
        >
          <ul className="flex flex-col divide-y divide-hairline">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-3 text-base font-medium ${
                      isActive ? "text-accent" : "text-ink-secondary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
