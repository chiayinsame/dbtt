// Clean stroke-based SVG icons — 24×24 grid, strokeWidth 1.75
// Usage: <IcSearch s={20} c="#fff" />

const S = ({w=20, c="currentColor", children, fill=false}) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill={fill?c:"none"} stroke={fill?"none":c}
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    style={{display:"block",flexShrink:0}}>
    {children}
  </svg>
);

// Navigation
export const IcMap = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
  <line x1="9" y1="3" x2="9" y2="18"/>
  <line x1="15" y1="6" x2="15" y2="21"/>
</S>;

export const IcSearch = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
</S>;

export const IcDumbbell = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M6.5 6.5v11M17.5 6.5v11"/>
  <line x1="6.5" y1="12" x2="17.5" y2="12"/>
  <rect x="3" y="8.5" width="3.5" height="7" rx="1"/>
  <rect x="17.5" y="8.5" width="3.5" height="7" rx="1"/>
</S>;

export const IcCalendar = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <rect x="3" y="4" width="18" height="18" rx="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</S>;

export const IcUsers = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</S>;

export const IcUser = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</S>;

// Map controls
export const IcMenu = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="3" y1="12" x2="21" y2="12"/>
  <line x1="3" y1="18" x2="21" y2="18"/>
</S>;

export const IcCrosshair = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <circle cx="12" cy="12" r="9"/>
  <line x1="12" y1="3" x2="12" y2="7"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
  <line x1="3" y1="12" x2="7" y2="12"/>
  <line x1="17" y1="12" x2="21" y2="12"/>
  <circle cx="12" cy="12" r="2"/>
</S>;

export const IcCompass = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <circle cx="12" cy="12" r="10"/>
  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
</S>;

export const IcBolt = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</S>;

// UI
export const IcX = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</S>;

export const IcBell = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
</S>;

export const IcSettings = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <line x1="4" y1="6" x2="20" y2="6"/>
  <line x1="4" y1="12" x2="20" y2="12"/>
  <line x1="4" y1="18" x2="20" y2="18"/>
  <circle cx="8" cy="6" r="2.25" fill="currentColor" stroke="none"/>
  <circle cx="16" cy="12" r="2.25" fill="currentColor" stroke="none"/>
  <circle cx="10" cy="18" r="2.25" fill="currentColor" stroke="none"/>
</S>;

export const IcCamera = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
  <circle cx="12" cy="13" r="4"/>
</S>;

export const IcMegaphone = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M3 11v2a8 8 0 0 0 8 8h1"/>
  <path d="M11 5H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6l8 5V0l-8 5z"/>
</S>;

// Filled person silhouette for player count
export const IcPerson = ({s=14,c="currentColor"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none" style={{display:"block",flexShrink:0}}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

// Matchmaking / Find Players
export const IcTarget = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <circle cx="12" cy="12" r="10"/>
  <circle cx="12" cy="12" r="5"/>
  <circle cx="12" cy="12" r="1" fill={c} stroke="none"/>
</S>;

// Ticket icon for events
export const IcTicket = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
  <line x1="9" y1="9" x2="15" y2="15"/>
  <line x1="15" y1="9" x2="9" y2="15"/>
</S>;

// Classes / graduation cap
export const IcGrad = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M22 10l-10-5L2 10l10 5 10-5z"/>
  <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5"/>
  <line x1="22" y1="10" x2="22" y2="16"/>
</S>;

// Play / video icon for lessons
export const IcPlay = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <circle cx="12" cy="12" r="10"/>
  <polygon points="10 8 16 12 10 16 10 8" fill={c} stroke="none"/>
</S>;

// Locker / lock icon for equipment rentals
export const IcLocker = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <rect x="5" y="11" width="14" height="10" rx="2"/>
  <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  <circle cx="12" cy="16" r="1" fill={c} stroke="none"/>
</S>;

// Trophy / leaderboard icon
export const IcTrophy = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <path d="M8 21h8M12 17v4"/>
  <path d="M7 3h10l-1.5 9h-7L7 3z"/>
  <path d="M6 3H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4"/>
  <path d="M18 3h2a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4"/>
  <line x1="9" y1="21" x2="15" y2="21"/>
</S>;

// QR code icon for scanning
export const IcQR = ({s=20,c="currentColor"}) => <S w={s} c={c}>
  <rect x="3" y="3" width="7" height="7" rx="1"/>
  <rect x="14" y="3" width="7" height="7" rx="1"/>
  <rect x="3" y="14" width="7" height="7" rx="1"/>
  <rect x="5" y="5" width="3" height="3" fill={c} stroke="none"/>
  <rect x="16" y="5" width="3" height="3" fill={c} stroke="none"/>
  <rect x="5" y="16" width="3" height="3" fill={c} stroke="none"/>
  <line x1="14" y1="14" x2="14" y2="14"/>
  <rect x="14" y="14" width="3" height="3" fill={c} stroke="none"/>
  <rect x="18" y="18" width="3" height="3" fill={c} stroke="none"/>
  <rect x="18" y="14" width="3" height="3" fill={c} stroke="none"/>
  <rect x="14" y="18" width="3" height="3" fill={c} stroke="none"/>
</S>;
