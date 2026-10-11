import type { ReactNode } from "react";
import type { IconName } from "./icon-names.ts";

const stroke = 1.75;

const glyphs: Record<IconName, ReactNode> = {
  film: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1.5" />
      <path d="M6 9h12M6 15h12M4 7.5v2M4 14.5v2M20 7.5v2M20 14.5v2" />
    </>
  ),
  screen: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-2-1.4-4.2-1.6-7-.2v13c2.8-1.4 5-1.2 7 .2 2-1.4 4.2-1.6 7-.2V5.8c-2.8-1.4-5-1.2-7 .2z" />
      <path d="M12 6.2v12.6" />
    </>
  ),
  note: (
    <>
      <path d="M9 17V7l10-2v10" />
      <circle cx="7" cy="17" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15" r="2.1" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  aside: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="1.5" />
    </>
  ),
  chat: (
    <path d="M5 16.2V7.8A2.3 2.3 0 0 1 7.3 5.5h9.4A2.3 2.3 0 0 1 19 7.8v5.2a2.3 2.3 0 0 1-2.3 2.3H9.2L5 19z" />
  ),
  check: <path d="M5 12.5 9.2 16.7 19 7.2" />,
  arrow: (
    <>
      <path d="M15 6 8 12l7 6" />
      <path d="M9 12h10" />
    </>
  ),
  stack: (
    <>
      <path d="M4 8.5 12 5l8 3.5-8 3.5z" />
      <path d="m4 12.5 8 3.5 8-3.5" />
      <path d="m4 16.5 8 3.5 8-3.5" />
    </>
  ),
  split: (
    <>
      <rect x="3" y="5" width="7.5" height="14" rx="1.5" />
      <rect x="13.5" y="5" width="7.5" height="14" rx="1.5" />
    </>
  ),
  bread: (
    <>
      <path d="M5 13c0-3.2 2.8-6 7-6s7 2.8 7 6v4.5H5V13z" />
      <path d="M5 14h14" />
    </>
  ),
  bowl: (
    <>
      <path d="M4 10h16l-1.6 6.2A4 4 0 0 1 14.5 20h-5a4 4 0 0 1-3.9-3.8L4 10z" />
      <path d="M8 10c.4-2 1.8-3.2 4-3.2" />
    </>
  ),
  cup: (
    <>
      <path d="M6 8h9v5.5A3.5 3.5 0 0 1 11.5 17h-2A3.5 3.5 0 0 1 6 13.5V8z" />
      <path d="M15 9h2a2.2 2.2 0 0 1 0 4.4H15" />
      <path d="M7 20h8" />
    </>
  ),
  chair: (
    <>
      <path d="M6 16c.4-4 2.4-7 5.6-7 2.6 0 4 1.6 5 3.4L19.5 15" />
      <path d="M5 15.5h13" />
      <path d="M8.5 15.5V20M15 15.5V20" />
    </>
  ),
  pause: <path d="M8 5v14M16 5v14" />,
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ width: "var(--lc-icon)", height: "var(--lc-icon)" }}
    >
      {glyphs[name]}
    </svg>
  );
}
