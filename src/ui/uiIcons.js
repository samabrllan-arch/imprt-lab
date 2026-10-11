/** Iconos SVG de trazo (currentColor) para menús y modales: nítidos en cualquier navegador, sin emojis. */
const svg = (body, size = 18) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = {
  user: (s) => svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>', s),
  box: (s) => svg('<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>', s),
  shield: (s) => svg('<path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', s),
  scale: (s) => svg('<path d="M12 3v18"/><path d="M6 21h12"/><path d="M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0L5 7z"/><path d="M19 7l-3 7a3 3 0 006 0l-3-7z"/>', s),
  logout: (s) => svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>', s),
  chevron: (s) => svg('<path d="M6 9l6 6 6-6"/>', s),
  check: (s) => svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', s),
  cross: (s) => svg('<path d="M6 6l12 12M18 6L6 18"/>', s),
  save: (s) => svg('<path d="M5 3h11l4 4v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M8 3v5h7V3"/><path d="M8 21v-7h8v7"/>', s),
  shirt: (s) => svg('<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 01-8 0z"/>', s),
  palette: (s) => svg('<path d="M12 3a9 9 0 100 18 2 2 0 002-2c0-1.2-.8-1.6-.8-2.6 0-1 .8-1.4 1.8-1.4H17a4 4 0 004-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>', s),
  download: (s) => svg('<path d="M12 4v11"/><path d="M7.5 11L12 15.5 16.5 11"/><path d="M4 19h16"/>', s),
  upload: (s) => svg('<path d="M12 15V4"/><path d="M7.5 8L12 3.5 16.5 8"/><path d="M4 19h16"/>', s),
  trash: (s) => svg('<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>', s),
  lock: (s) => svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>', s),
  globe: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>', s),
  vault: (s) => svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5V6M12 18v-2.5M8.5 12H6M18 12h-2.5"/>', s),
  alert: (s) => svg('<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5"/><path d="M12 18h.01"/>', s)
};
