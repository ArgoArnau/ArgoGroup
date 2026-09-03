// The 24x24 line icons the design system was drawn against (2px stroke).
// Kept apart from icons.jsx so that file exports components only.
export const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const box = { viewBox: '0 0 24 24' }

export const icons = {
  target: (
    <svg {...box} {...stroke}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  sliders: (
    <svg {...box} {...stroke}>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  trending: (
    <svg {...box} {...stroke}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  cpu: (
    <svg {...box} {...stroke}>
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  database: (
    <svg {...box} {...stroke}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  workflow: (
    <svg {...box} {...stroke}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4a2 2 0 0 1 2 2V14" /><path d="M14 17.5h-4a2 2 0 0 1-2-2V10" />
    </svg>
  ),
  chart: (
    <svg {...box} {...stroke}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  gem: (
    <svg {...box} {...stroke}>
      <polygon points="6 3 18 3 22 9 12 22 2 9" /><polyline points="2 9 22 9" /><polyline points="12 22 8 9 12 3 16 9" />
    </svg>
  ),
  layers: (
    <svg {...box} {...stroke}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  monitor: (
    <svg {...box} {...stroke}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  sparkles: (
    <svg {...box} {...stroke}>
      <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.9z" />
      <path d="M19 15l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z" />
    </svg>
  ),
  zap: (
    <svg {...box} {...stroke}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  bulb: (
    <svg {...box} {...stroke}>
      <path d="M9 18h6" /><path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  eye: (
    <svg {...box} {...stroke}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  building: (
    <svg {...box} {...stroke}>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="7" x2="10" y2="7" /><line x1="14" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="10" y2="11" /><line x1="14" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="10" y2="15" /><line x1="14" y1="15" x2="15" y2="15" />
      <path d="M10 22v-3h4v3" />
    </svg>
  ),
}
