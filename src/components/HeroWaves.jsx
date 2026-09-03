/**
 * The gold silk ribbons behind the hero. Purely decorative, so it is hidden
 * from assistive tech; `data-depth` marks it as a parallax layer for
 * useWaveParallax in Hero.jsx.
 */
export default function HeroWaves() {
  return (
    <svg
      className="hero-waves"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      data-depth="1.3"
    >
      <defs>
        <linearGradient id="silkA" x1="0.15" y1="1" x2="0.75" y2="0">
          <stop offset="0" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d4af37" stopOpacity="0.04" />
          <stop offset="0.82" stopColor="#e6c65c" stopOpacity="0.085" />
          <stop offset="1" stopColor="#f4e3a1" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="silkB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e3a1" stopOpacity="0.10" />
          <stop offset="0.5" stopColor="#d4af37" stopOpacity="0.05" />
          <stop offset="1" stopColor="#b8962e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="silkC" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8962e" stopOpacity="0" />
          <stop offset="0.55" stopColor="#d4af37" stopOpacity="0.04" />
          <stop offset="1" stopColor="#e6c65c" stopOpacity="0.09" />
        </linearGradient>
        <radialGradient id="crestGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e6c65c" stopOpacity="0.08" />
          <stop offset="1" stopColor="#e6c65c" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <ellipse cx="1180" cy="400" rx="320" ry="170" fill="url(#crestGlow)" filter="url(#softBlur)" />

      {/* Back ribbon: a wide, faint band */}
      <g className="wave wave-back">
        <path
          fill="url(#silkC)"
          d="M -60 490 C 340 465, 700 405, 980 330 C 1160 282, 1330 258, 1500 245
             L 1500 380 C 1300 398, 1080 440, 860 505 C 600 580, 260 612, -60 620 Z"
        />
        <path className="wave-line thin" d="M -60 490 C 340 465, 700 405, 980 330 C 1160 282, 1330 258, 1500 245" />
      </g>

      {/* Main ribbon: rises, crests, then folds back down */}
      <g className="wave wave-mid">
        <path
          fill="url(#silkA)"
          d="M -60 640 C 320 610, 620 560, 850 480 C 1030 418, 1140 360, 1210 300 C 1272 352, 1375 428, 1500 470
             L 1500 585 C 1355 540, 1240 475, 1170 420 C 1085 480, 900 555, 700 600 C 460 652, 160 675, -60 685 Z"
        />
        {/* Inner face of the fold */}
        <path
          fill="url(#silkB)"
          opacity="0.7"
          d="M 1210 300 C 1272 352, 1375 428, 1500 470 L 1500 585 C 1355 540, 1240 475, 1170 420 C 1185 380, 1198 340, 1210 300 Z"
        />
        <path className="wave-line bright" d="M -60 640 C 320 610, 620 560, 850 480 C 1030 418, 1140 360, 1210 300 C 1272 352, 1375 428, 1500 470" />
        <path className="wave-line soft" d="M -60 616 C 324 586, 626 536, 856 457 C 1035 396, 1146 342, 1212 284" />
        <path className="wave-line thin" d="M -60 685 C 160 675, 460 652, 700 600 C 900 555, 1085 480, 1170 420 C 1240 475, 1355 540, 1500 585" />
        <path className="wave-glint" pathLength="1" d="M -60 640 C 320 610, 620 560, 850 480 C 1030 418, 1140 360, 1210 300 C 1272 352, 1375 428, 1500 470" />
      </g>

      {/* Front ribbon: a low, thin band */}
      <g className="wave wave-front">
        <path
          fill="url(#silkC)"
          opacity="0.85"
          d="M -60 740 C 320 680, 700 730, 1000 690 C 1220 660, 1390 618, 1500 592
             L 1500 668 C 1330 700, 1150 730, 950 745 C 650 768, 260 775, -60 790 Z"
        />
        <path className="wave-line soft" d="M -60 740 C 320 680, 700 730, 1000 690 C 1220 660, 1390 618, 1500 592" />
        <path className="wave-glint delay" pathLength="1" d="M -60 740 C 320 680, 700 730, 1000 690 C 1220 660, 1390 618, 1500 592" />
      </g>
    </svg>
  )
}
