const shared = { width: 16, height: 16, viewBox: "0 0 16 16", "aria-hidden": true, focusable: false };

export default function LinkIcon({ name }) {
  if (name === "GitHub") {
    // GitHub mark from Primer Octicons (MIT): https://github.com/primer/octicons
    return <svg {...shared} fill="currentColor"><path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"/></svg>;
  }

  if (name === "Instagram") {
    return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="13" height="13" rx="3.6"/><circle cx="8" cy="8" r="3"/><circle cx="11.8" cy="4.2" r=".9" fill="currentColor" stroke="none"/></svg>;
  }

  if (name === "Playground") {
    return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1.4" y="2" width="13.2" height="12" rx="1.8"/><path d="m4.3 6 2.2 2-2.2 2M8.4 10.5h3.1"/></svg>;
  }

  if (name === "Résumé") {
    return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 1.4h6l3 3v10.2h-9z"/><path d="M9.5 1.5v3h3M5.7 7.3h4.6M5.7 9.8h4.6M5.7 12.3h3.1"/></svg>;
  }

  return null;
}
