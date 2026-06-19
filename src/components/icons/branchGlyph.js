import React from 'react';

/**
 * Firma "árbol de la vida" (UX investigation §6): a small dichotomous-branch
 * glyph that encodes real hierarchy. Used as the section-divider / summary marker
 * in the sidebar instead of a flat `divider`. Inherits color via `currentColor`.
 */
const BranchGlyph = ({ className }) => {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 7h4M5 7c2.5 0 2.5-5 4-5h4M5 7c2.5 0 2.5 5 4 5h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="13.5" cy="2" r="1.4" fill="currentColor" />
      <circle cx="13.5" cy="12" r="1.4" fill="currentColor" />
      <circle cx="1" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
};

export default BranchGlyph;
