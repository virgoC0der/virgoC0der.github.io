// Shell — tab-style navigation (browser-tab metaphor) + terminal header
// Used by all pages. Nav is a row of pill "tabs" with colored underline.

const NAV = [
  { id: "home", label: "~", labelZh: "首页", path: "/" },
  { id: "posts", label: "posts", labelZh: "文章", path: "/posts" },
  { id: "tags", label: "tags", labelZh: "标签", path: "/tags" },
  { id: "about", label: "about", labelZh: "关于", path: "/about" },
  { id: "now", label: "now", labelZh: "此刻", path: "/now" },
];

const TAB_COLORS = ["var(--yellow)", "var(--coral-soft)", "var(--mint)", "var(--lavender)", "var(--peach)"];

function TopBar({ route, onNav, variant }) {
  if (variant === "B") return <TopBarB route={route} onNav={onNav} />;
  if (variant === "C") return <TopBarC route={route} onNav={onNav} />;
  return <TopBarA route={route} onNav={onNav} />;
}

// Variant A — browser tabs, playful
function TopBarA({ route, onNav }) {
  return (
    <div style={{ padding: "20px 40px 0", background: "var(--cream)" }}>
      {/* url bar strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ef7065', border: '1.5px solid var(--line)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#f5dc5a', border: '1.5px solid var(--line)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#a9e6c9', border: '1.5px solid var(--line)' }} />
        </div>
        <div style={{ flex: 1, background: 'var(--paper)', border: '2px solid var(--line)', borderRadius: 20, padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--mute)' }}>https://</span>
          <span style={{ fontWeight: 600 }}>billy.dev</span>
          <span style={{ color: 'var(--mute)' }}>{route === "/" ? "" : route}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--mute)', fontSize: 11 }}>⌘K</span>
        </div>
      </div>
      {/* tabs */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: -2, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20, paddingBottom: 10 }}>
          <MascotMark size={32} />
          <div>
            <div className="display" style={{ fontSize: 18, lineHeight: 1 }}>Billy's Blog</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--mute)' }}>@virgoC0der</div>
          </div>
        </div>
        {NAV.map((n, i) => {
          const active = (route === "/" && n.id === "home") || route.startsWith(n.path) && n.path !== "/";
          return (
            <button key={n.id} onClick={() => onNav(n.path)}
              style={{
                background: active ? TAB_COLORS[i] : 'var(--paper)',
                border: '2px solid var(--line)',
                borderBottom: active ? '2px solid transparent' : '2px solid var(--line)',
                borderRadius: '10px 10px 0 0',
                padding: '10px 18px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                color: 'var(--ink)',
                position: 'relative',
                marginBottom: active ? -2 : 0,
                transform: active ? 'translateY(0)' : 'translateY(2px)',
              }}>
              <span style={{ color: 'var(--mute)', marginRight: 6 }}>/</span>{n.label}
              {active && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: TAB_COLORS[i] }} />}
            </button>
          );
        })}
        <div style={{ flex: 1, borderBottom: '2px solid var(--line)' }} />
        <button style={{ background: 'var(--ink)', color: 'var(--paper)', border: '2px solid var(--line)', borderBottom: 'none', borderRadius: '10px 10px 0 0', padding: '10px 18px 12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          RSS ↗
        </button>
      </div>
    </div>
  );
}

// Variant B — minimal horizontal with heavy bottom border
function TopBarB({ route, onNav }) {
  return (
    <div style={{ padding: "24px 40px", background: "var(--paper)", borderBottom: '2px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => onNav("/")}>
          <MascotMark size={36} />
          <div>
            <div className="display" style={{ fontSize: 20, lineHeight: 1 }}>Billy's Blog</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--mute)' }}>backend · go · ai</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', alignItems: 'center' }}>
          {NAV.map((n, i) => {
            const active = (route === "/" && n.id === "home") || (route.startsWith(n.path) && n.path !== "/");
            return (
              <button key={n.id} onClick={() => onNav(n.path)} style={{
                background: active ? TAB_COLORS[i] : 'transparent',
                border: active ? '2px solid var(--line)' : '2px solid transparent',
                borderRadius: 20,
                padding: '6px 14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: active ? '3px 3px 0 var(--line)' : 'none',
              }}>
                {n.label}
              </button>
            );
          })}
          <button style={{ background: 'var(--ink)', color: 'var(--yellow)', border: '2px solid var(--line)', borderRadius: 20, padding: '6px 14px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--line)', marginLeft: 8 }}>
            RSS ↗
          </button>
        </div>
      </div>
    </div>
  );
}

// Variant C — terminal / pure-mono
function TopBarC({ route, onNav }) {
  return (
    <div style={{ padding: "0", background: "var(--ink)", color: "var(--cream-warm)", fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ padding: "10px 40px", display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #333', fontSize: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#ef7065' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#f5dc5a' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#a9e6c9' }} />
        </div>
        <span style={{ color: '#888' }}>— billy@blog:{route === "/" ? "~" : "~" + route} —</span>
        <span style={{ marginLeft: 'auto', color: '#888' }}>utf-8 · zsh</span>
      </div>
      <div style={{ padding: "20px 40px 18px", display: 'flex', alignItems: 'center', gap: 20 }}>
        <div onClick={() => onNav("/")} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <span style={{ color: 'var(--yellow)', fontSize: 20, fontWeight: 700 }}>$</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>billy<span style={{ color: 'var(--yellow)' }}>.</span>blog</span>
        </div>
        <div style={{ display: 'flex', gap: 2, marginLeft: 24 }}>
          {NAV.map((n, i) => {
            const active = (route === "/" && n.id === "home") || (route.startsWith(n.path) && n.path !== "/");
            return (
              <button key={n.id} onClick={() => onNav(n.path)} style={{
                background: active ? TAB_COLORS[i] : 'transparent',
                color: active ? 'var(--ink)' : '#ccc',
                border: 'none',
                padding: '6px 12px',
                fontFamily: 'inherit',
                fontWeight: active ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                borderRadius: 3,
              }}>
                <span style={{ opacity: 0.6, marginRight: 4 }}>/</span>{n.label}
              </button>
            );
          })}
        </div>
        <span style={{ marginLeft: 'auto', color: '#888', fontSize: 12 }}>▊</span>
      </div>
    </div>
  );
}

// Footer
function Footer({ variant, onNav }) {
  return (
    <footer style={{ marginTop: 80, borderTop: '2px solid var(--line)', background: variant === "C" ? 'var(--ink)' : 'var(--paper)', color: variant === "C" ? 'var(--cream-warm)' : 'var(--ink)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Mascot size={56} pose="wave" animated={false} />
            <div>
              <div className="display" style={{ fontSize: 24 }}>Billy's Blog</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.7 }}>built with Hugo · hosted on GitHub Pages</div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.8 }}>
            <span style={{ color: 'var(--coral)' }}>// </span>
            "First, solve the problem. Then, write the code."<br/>
            <span style={{ opacity: 0.5 }}>— John Johnson</span>
          </div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Pages</div>
          {NAV.map(n => <div key={n.id} onClick={() => onNav(n.path)} style={{ cursor: 'pointer', padding: '3px 0', fontSize: 14 }}>/{n.label}</div>)}
        </div>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Elsewhere</div>
          <div style={{ fontSize: 14, padding: '3px 0' }}>GitHub ↗</div>
          <div style={{ fontSize: 14, padding: '3px 0' }}>Email ↗</div>
          <div style={{ fontSize: 14, padding: '3px 0' }}>RSS ↗</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Colophon</div>
          <div style={{ fontSize: 13, padding: '3px 0', opacity: 0.8 }}>Inter + Fraunces + JetBrains Mono</div>
          <div style={{ fontSize: 13, padding: '3px 0', opacity: 0.8 }}>© 2025 Billy (@virgoC0der)</div>
        </div>
      </div>
      <div style={{ background: 'var(--yellow)', color: 'var(--ink)', borderTop: '2px solid var(--line)', padding: '10px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
          <span>✦ made with ♥ and too much coffee · Billy ·  ♍ virgo edition</span>
          <span>v0.3.1 · commit a7f3c2</span>
      </div>
    </footer>
  );
}

// Reusable chip / tag
function Chip({ children, color = "var(--yellow)", size = "md", filled = true }) {
  const pad = size === "sm" ? "2px 8px" : size === "lg" ? "6px 14px" : "4px 10px";
  const fs = size === "sm" ? 11 : size === "lg" ? 13 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: filled ? color : 'transparent',
      border: '1.5px solid var(--line)',
      borderRadius: 4,
      padding: pad,
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600, fontSize: fs,
      color: 'var(--ink)',
    }}>{children}</span>
  );
}

// Reusable CTA button
function CTAButton({ children, color = "var(--yellow)", size = "md", onClick, icon }) {
  const pad = size === "lg" ? "12px 22px" : size === "md" ? "9px 18px" : "6px 14px";
  const fs = size === "lg" ? 15 : size === "md" ? 14 : 12;
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: color, border: '2px solid var(--line)',
        borderRadius: 6, padding: pad,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700, fontSize: fs,
        cursor: 'pointer',
        boxShadow: hover ? '2px 2px 0 var(--line)' : '5px 5px 0 var(--line)',
        transform: hover ? 'translate(3px, 3px)' : 'translate(0, 0)',
        transition: 'all 0.1s ease',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        color: 'var(--ink)',
      }}>
      {children}{icon && <span>{icon}</span>}
    </button>
  );
}

// Cover art SVG previews — hand-drawn style per post type
function CoverArt({ kind, color = "var(--yellow)", width = "100%", height = 140 }) {
  const covers = {
    terminal: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <rect x="24" y="22" width="192" height="96" rx="6" fill="var(--ink)" stroke="var(--line)" strokeWidth="2"/>
        <rect x="24" y="22" width="192" height="14" fill="#2a2a2a" stroke="var(--line)" strokeWidth="2"/>
        <circle cx="32" cy="29" r="2.5" fill="#ef7065"/><circle cx="40" cy="29" r="2.5" fill="#f5dc5a"/><circle cx="48" cy="29" r="2.5" fill="#a9e6c9"/>
        <text x="32" y="56" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#a9e6c9" fontWeight="700">$ hugo new posts/i18n.md</text>
        <text x="32" y="72" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#cfc2f1">→ translating 7 locales...</text>
        <text x="32" y="88" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f5dc5a">✓ zh-CN en de fr ja</text>
        <text x="32" y="104" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#fdfcf5">▊</text>
      </svg>
    ),
    mcp: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <circle cx="60" cy="70" r="24" fill="var(--coral)" stroke="var(--line)" strokeWidth="2"/>
        <circle cx="180" cy="70" r="24" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <text x="60" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="var(--paper)">Go</text>
        <text x="180" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="var(--ink)">Claude</text>
        <path d="M84 70 L156 70" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="150,65 160,70 150,75" fill="var(--line)"/>
        <text x="120" y="56" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="var(--ink)">MCP</text>
        <rect x="100" y="86" width="40" height="12" rx="3" fill="var(--yellow)" stroke="var(--line)" strokeWidth="1.5"/>
        <text x="120" y="95" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fontWeight="700">stdio+http</text>
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <circle cx="120" cy="70" r="40" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <ellipse cx="120" cy="70" rx="40" ry="16" fill="none" stroke="var(--line)" strokeWidth="1.5"/>
        <ellipse cx="120" cy="70" rx="16" ry="40" fill="none" stroke="var(--line)" strokeWidth="1.5"/>
        <path d="M80 70 Q100 50 120 70 Q140 90 160 70" fill="none" stroke="var(--line)" strokeWidth="1.5"/>
        <text x="60" y="30" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">你好</text>
        <text x="170" y="40" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">Hi</text>
        <text x="40" y="120" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">Hola</text>
        <text x="180" y="120" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">こんにちは</text>
      </svg>
    ),
    docker: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <rect x="40" y="50" width="30" height="30" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <rect x="72" y="50" width="30" height="30" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <rect x="104" y="50" width="30" height="30" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <rect x="56" y="18" width="30" height="30" fill="var(--yellow)" stroke="var(--line)" strokeWidth="2"/>
        <rect x="88" y="18" width="30" height="30" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <path d="M150 58 Q170 50 190 58 Q210 66 200 80 Q180 90 150 80 Z" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <text x="120" y="120" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700" textAnchor="middle">12MB ✦</text>
      </svg>
    ),
    gopher: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <ellipse cx="120" cy="100" rx="60" ry="8" fill="rgba(0,0,0,0.1)"/>
        <path d="M70 90 Q70 40 120 40 Q170 40 170 90 Q170 115 120 115 Q70 115 70 90 Z" fill="#4ecbc4" stroke="var(--line)" strokeWidth="2.5"/>
        <circle cx="95" cy="70" r="10" fill="white" stroke="var(--line)" strokeWidth="2"/>
        <circle cx="145" cy="70" r="10" fill="white" stroke="var(--line)" strokeWidth="2"/>
        <circle cx="97" cy="72" r="4" fill="var(--line)"/><circle cx="147" cy="72" r="4" fill="var(--line)"/>
        <ellipse cx="120" cy="88" rx="6" ry="4" fill="var(--line)"/>
        <path d="M80 60 L72 48 L88 54 Z" fill="#4ecbc4" stroke="var(--line)" strokeWidth="2"/>
        <path d="M160 60 L168 48 L152 54 Z" fill="#4ecbc4" stroke="var(--line)" strokeWidth="2"/>
      </svg>
    ),
    automation: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <rect x="30" y="40" width="54" height="60" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
        <text x="57" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">.md</text>
        <rect x="94" y="40" width="54" height="60" rx="4" fill="var(--ink)" stroke="var(--line)" strokeWidth="2"/>
        <text x="121" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="var(--yellow)">git</text>
        <rect x="158" y="40" width="54" height="60" rx="4" fill="var(--lime)" stroke="var(--line)" strokeWidth="2"/>
        <text x="185" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">✓ live</text>
        <path d="M84 70 L94 70 M148 70 L158 70" stroke="var(--line)" strokeWidth="2"/>
        <polygon points="90,66 96,70 90,74" fill="var(--line)"/>
        <polygon points="154,66 160,70 154,74" fill="var(--line)"/>
      </svg>
    ),
    llm: (
      <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" style={{ width, height, display: 'block', background: color }}>
        <rect x="60" y="30" width="120" height="80" rx="8" fill="var(--paper)" stroke="var(--line)" strokeWidth="2.5"/>
        <circle cx="120" cy="70" r="18" fill="var(--coral)" stroke="var(--line)" strokeWidth="2"/>
        <text x="120" y="75" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="800" fill="var(--paper)">ƛ</text>
        <circle cx="80" cy="50" r="3" fill="var(--line)"/>
        <circle cx="90" cy="50" r="3" fill="var(--line)"/>
        <rect x="70" y="116" width="100" height="8" rx="2" fill="var(--line)"/>
        <text x="120" y="125" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="var(--paper)">Mac mini</text>
      </svg>
    ),
  };
  return covers[kind] || covers.terminal;
}

Object.assign(window, { TopBar, Footer, Chip, CTAButton, CoverArt, NAV });
