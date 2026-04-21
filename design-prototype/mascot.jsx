// Virgo-themed mascot — a cute star-maiden hybrid named "Virg"
// Cute round creature with a star crown, big eyes, holding a `{` brace
// Drawn in a PostHog hedgehog-like hand-drawn low-poly style

function Mascot({ size = 140, pose = "wave", animated = true }) {
  // pose: "wave" | "think" | "code" | "sit" | "peek"
  const s = size / 140;
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} style={{ display: 'block' }}>
      {/* shadow */}
      <ellipse cx="70" cy="128" rx="38" ry="4" fill="rgba(0,0,0,0.15)" />

      {/* body — pill shape, creamy purple */}
      <g className={animated ? "wiggle" : ""} style={{ transformOrigin: '70px 85px' }}>
        {/* legs */}
        <rect x="52" y="108" width="10" height="14" rx="5" fill="#cfc2f1" stroke="#151415" strokeWidth="2.2" />
        <rect x="78" y="108" width="10" height="14" rx="5" fill="#cfc2f1" stroke="#151415" strokeWidth="2.2" />
        {/* shoes */}
        <ellipse cx="57" cy="122" rx="8" ry="3.5" fill="#151415" />
        <ellipse cx="83" cy="122" rx="8" ry="3.5" fill="#151415" />

        {/* body */}
        <path d="M32 78 Q32 48 70 48 Q108 48 108 78 L108 106 Q108 116 96 116 L44 116 Q32 116 32 106 Z"
              fill="#e5d7ff" stroke="#151415" strokeWidth="2.6" strokeLinejoin="round" />
        {/* belly patch */}
        <path d="M55 90 Q70 104 85 90 L85 112 Q70 116 55 112 Z" fill="#fdfcf5" stroke="#151415" strokeWidth="2" />

        {/* arms */}
        {pose === "wave" && (
          <>
            <path d="M34 80 Q22 72 26 58 Q28 54 32 56" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="26" cy="56" r="5" fill="#e5d7ff" stroke="#151415" strokeWidth="2.2" />
            <path d="M106 86 Q118 86 120 96" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="120" cy="96" r="5" fill="#e5d7ff" stroke="#151415" strokeWidth="2.2" />
          </>
        )}
        {pose === "think" && (
          <>
            <path d="M34 86 Q22 92 26 104" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="26" cy="104" r="5" fill="#e5d7ff" stroke="#151415" strokeWidth="2.2" />
            <path d="M106 82 Q118 72 112 60" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="112" cy="60" r="5" fill="#e5d7ff" stroke="#151415" strokeWidth="2.2" />
          </>
        )}
        {pose === "code" && (
          <>
            <path d="M36 84 Q46 96 56 92" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M104 84 Q94 96 84 92" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            {/* laptop */}
            <rect x="50" y="88" width="40" height="16" rx="2" fill="#151415" stroke="#151415" strokeWidth="2" />
            <rect x="52" y="90" width="36" height="10" fill="#b5f26a" />
            <text x="54" y="98" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#151415" fontWeight="700">{'go run.'}</text>
          </>
        )}
        {pose === "sit" && (
          <>
            <path d="M36 90 Q30 100 38 108" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M104 90 Q110 100 102 108" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}
        {pose === "peek" && (
          <>
            <path d="M50 84 Q56 100 70 100 Q84 100 90 84" fill="none" stroke="#151415" strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}

        {/* face — big anime eyes */}
        <ellipse cx="58" cy="74" rx="7" ry="8" fill="#fdfcf5" stroke="#151415" strokeWidth="2.2" />
        <ellipse cx="82" cy="74" rx="7" ry="8" fill="#fdfcf5" stroke="#151415" strokeWidth="2.2" />
        <circle cx="59" cy="76" r="3.2" fill="#151415" />
        <circle cx="83" cy="76" r="3.2" fill="#151415" />
        <circle cx="60.5" cy="74.5" r="1.1" fill="#fdfcf5" />
        <circle cx="84.5" cy="74.5" r="1.1" fill="#fdfcf5" />

        {/* blush */}
        <ellipse cx="48" cy="82" rx="3.5" ry="2" fill="#ef7065" opacity="0.6" />
        <ellipse cx="92" cy="82" rx="3.5" ry="2" fill="#ef7065" opacity="0.6" />

        {/* mouth */}
        <path d="M64 86 Q70 92 76 86" fill="none" stroke="#151415" strokeWidth="2" strokeLinecap="round" />

        {/* star crown */}
        <g transform="translate(70 32)">
          <path d="M0 -18 L4 -6 L16 -6 L6 2 L10 14 L0 6 L-10 14 L-6 2 L-16 -6 L-4 -6 Z"
                fill="#f5dc5a" stroke="#151415" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="-0.5" cy="-1" r="1.5" fill="#151415" />
        </g>
        {/* antenna wire */}
        <path d="M70 48 L70 42" stroke="#151415" strokeWidth="2" strokeLinecap="round" />

        {/* virgo symbol on belly */}
        <g transform="translate(70 102)" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#151415" textAnchor="middle">
          <text y="0">♍</text>
        </g>
      </g>

      {/* sparkles around */}
      <g opacity="0.8">
        <path d="M20 36 L22 40 L26 42 L22 44 L20 48 L18 44 L14 42 L18 40 Z" fill="#ef7065" stroke="#151415" strokeWidth="1.2" />
        <path d="M118 24 L119.5 27 L122.5 28.5 L119.5 30 L118 33 L116.5 30 L113.5 28.5 L116.5 27 Z" fill="#f5dc5a" stroke="#151415" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// Small logo mark — just the face / star
function MascotMark({ size = 36 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
      <rect x="2" y="2" width="36" height="36" rx="8" fill="#151415" />
      {/* star */}
      <path d="M20 8 L22 14 L28 14 L23 18 L25 24 L20 20 L15 24 L17 18 L12 14 L18 14 Z"
            fill="#f5dc5a" stroke="#f5dc5a" strokeWidth="1" strokeLinejoin="round" />
      {/* eyes */}
      <circle cx="16" cy="30" r="2" fill="#fdfcf5" />
      <circle cx="24" cy="30" r="2" fill="#fdfcf5" />
      <circle cx="16.5" cy="30.5" r="0.9" fill="#151415" />
      <circle cx="24.5" cy="30.5" r="0.9" fill="#151415" />
    </svg>
  );
}

// Hand-drawn squiggle underline
function Squiggle({ width = 120, color = "#ef7065", className = "" }) {
  return (
    <svg width={width} height="10" viewBox="0 0 120 10" className={className} style={{ display: 'block' }}>
      <path d="M2 6 Q10 1 20 6 T40 6 T60 6 T80 6 T100 6 T118 6" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// Hand-drawn arrow
function HandArrow({ size = 64, color = "#151415", dir = "right-down", className = "" }) {
  const paths = {
    "right-down": "M4 4 Q20 8 32 24 Q40 36 56 40",
    "right": "M4 20 Q20 20 40 18 Q48 18 56 16",
    "down-right": "M8 4 Q10 20 26 30 Q40 38 52 36",
  };
  const head = {
    "right-down": <path d="M50 34 L58 42 L48 44" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    "right": <path d="M50 12 L58 16 L50 22" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    "down-right": <path d="M46 30 L54 36 L46 42" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 64 48" className={className} style={{ display: 'block' }}>
      <path d={paths[dir]} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      {head[dir]}
    </svg>
  );
}

// Pixel star
function PixelStar({ size = 20, color = "#f5dc5a" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="4" y="0" width="2" height="2" fill={color} />
      <rect x="4" y="8" width="2" height="2" fill={color} />
      <rect x="0" y="4" width="2" height="2" fill={color} />
      <rect x="8" y="4" width="2" height="2" fill={color} />
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="2" width="2" height="2" fill={color} />
      <rect x="2" y="6" width="2" height="2" fill={color} />
      <rect x="6" y="6" width="2" height="2" fill={color} />
      <rect x="3" y="3" width="4" height="4" fill={color} />
    </svg>
  );
}

Object.assign(window, { Mascot, MascotMark, Squiggle, HandArrow, PixelStar });
