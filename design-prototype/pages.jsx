// Pages — Home, Posts list, Post detail, About, Tags, Now

// ───────────────────────── HOME ─────────────────────────
function HomePage({ onNav, variant }) {
  const pinned = POSTS.filter(p => p.pinned);
  const recent = POSTS.slice(0, 5);
  const isTerm = variant === "C";

  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 1240, margin: '0 auto' }}>
      {/* HERO — terminal-ish with big headline */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center', marginBottom: 72 }}>
        <div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--coral)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--coral)', animation: 'pulse-dot 1.6s ease-in-out infinite' }} />
            ~/blog $ whoami<span className="cursor-blink"></span>
          </div>
          <h1 className="display" style={{ fontSize: 88, margin: '0 0 8px', position: 'relative' }}>
            Hi, I'm <span style={{ background: 'var(--yellow)', padding: '0 12px', display: 'inline-block', transform: 'rotate(-1deg)', border: '2px solid var(--line)', borderRadius: 8, boxShadow: '5px 5px 0 var(--line)' }}>Billy</span>
            <br/>
            <span style={{ fontSize: 52 }}>a backend </span>
            <span className="mono" style={{ fontSize: 40, color: 'var(--coral)', fontWeight: 700 }}>{'{ gopher }'}</span>
          </h1>
          <div style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 580, marginTop: 20 }}>
            写 <span style={{ background: 'var(--mint)', padding: '1px 6px', borderRadius: 3 }}>Go</span>、调 <span style={{ background: 'var(--lavender)', padding: '1px 6px', borderRadius: 3 }}>Claude</span>、
            造 <span style={{ background: 'var(--peach)', padding: '1px 6px', borderRadius: 3 }}>MCP</span> — 一个相信 <em>good code is self-documenting but I comment anyway</em> 的后端开发者。
            这里是我的 <u style={{ textDecorationStyle: 'wavy', textDecorationColor: 'var(--coral)' }}>实验室笔记</u>。
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, alignItems: 'center' }}>
            <CTAButton color="var(--yellow)" size="lg" icon="→" onClick={() => onNav('/posts')}>读读最近的文章</CTAButton>
            <CTAButton color="var(--paper)" size="lg" onClick={() => onNav('/about')}>关于我</CTAButton>
            <Squiggle width={60} />
          </div>
          {/* proof stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <span><strong style={{ fontSize: 20, color: 'var(--coral)' }}>{POSTS.length}</strong> posts</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ fontSize: 20, color: 'var(--coral)' }}>{TAGS.length}</strong> tags</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ fontSize: 20, color: 'var(--coral)' }}>2025</strong> since</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>📍 中国</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, right: 20, transform: 'rotate(8deg)', zIndex: 3 }}>
            <Mascot size={180} pose="wave" />
          </div>
          {/* terminal card */}
          <div className="brutal" style={{ background: 'var(--ink)', color: 'var(--cream-warm)', padding: 0, overflow: 'hidden', marginTop: 60 }}>
            <div style={{ background: '#222', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '2px solid var(--line)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ef7065' }}/>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#f5dc5a' }}/>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#a9e6c9' }}/>
              <span className="mono" style={{ marginLeft: 10, fontSize: 11, color: '#888' }}>billy@mbp-m3 ~ %</span>
            </div>
            <div className="mono" style={{ padding: '18px 20px', fontSize: 13, lineHeight: 1.7 }}>
              <div><span style={{ color: '#f5dc5a' }}>$</span> cat about.yml</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ color: '#cfc2f1' }}>name</span>:  Billy<br/>
                <span style={{ color: '#cfc2f1' }}>role</span>:  Backend Developer<br/>
                <span style={{ color: '#cfc2f1' }}>stack</span>: [<span style={{ color: '#a9e6c9' }}>Go</span>, <span style={{ color: '#a9e6c9' }}>Python</span>, <span style={{ color: '#a9e6c9' }}>Swift</span>]<br/>
                <span style={{ color: '#cfc2f1' }}>focus</span>: cloud-native + AI tooling<br/>
                <span style={{ color: '#cfc2f1' }}>email</span>: billychen826@gmail.com<br/>
                <span style={{ color: '#cfc2f1' }}>sign</span>:  <span style={{ color: '#f5dc5a' }}>♍</span> virgo · v0.1<br/>
              </div>
              <div style={{ marginTop: 12 }}><span style={{ color: '#f5dc5a' }}>$</span> <span className="cursor-blink"></span></div>
            </div>
          </div>
          {/* sticky note */}
          <div style={{ position: 'absolute', bottom: -28, left: -20, transform: 'rotate(-4deg)', background: 'var(--yellow)', border: '2px solid var(--line)', borderRadius: 4, padding: '10px 14px', boxShadow: '4px 4px 0 var(--line)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, maxWidth: 200 }}>
            ✦ "可用 <u>⌘K</u> 快速搜索"
          </div>
        </div>
      </section>

      {/* FEATURED / PINNED POSTS */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeader kicker="// featured" title="置顶" tail="pinned for a reason" color="var(--coral)"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 30 }}>
          {pinned.map((p, i) => <FeaturedCard key={p.slug} post={p} onNav={onNav} tilt={i === 0 ? -0.8 : 0.8} />)}
        </div>
      </section>

      {/* RECENT POSTS — terminal list */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeader kicker="$ ls -lt posts/" title="最新文章" tail="recent" color="var(--yellow)"/>
        <div className="brutal" style={{ padding: 0, overflow: 'hidden', marginTop: 30 }}>
          {recent.map((p, i) => <TerminalPostRow key={p.slug} post={p} onNav={onNav} index={i+1} />)}
          <div style={{ padding: '14px 20px', background: 'var(--cream-warm)', borderTop: '2px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <span style={{ color: 'var(--mute)' }}>—— showing {recent.length} of {POSTS.length} ——</span>
            <button onClick={() => onNav('/posts')} style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 4, padding: '6px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>view all ↗</button>
          </div>
        </div>
      </section>

      {/* NOW / STACK row */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, marginBottom: 80 }}>
        {/* NOW */}
        <div className="brutal" style={{ padding: 28, background: 'var(--mint)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -14, left: 20, background: 'var(--ink)', color: 'var(--mint)', padding: '4px 12px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
            /now · updated today
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
            <h3 className="display" style={{ fontSize: 36, margin: 0 }}>What I'm up to</h3>
            <span className="mono" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>// 此刻</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {NOW_ITEMS.map(n => (
              <div key={n.tag} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1.5px dashed rgba(0,0,0,0.2)' }}>
                <div className="mono" style={{ minWidth: 80, fontSize: 12, fontWeight: 700, background: 'var(--ink)', color: 'var(--mint)', padding: '3px 8px', borderRadius: 3 }}>{n.label}</div>
                <div style={{ fontSize: 15, lineHeight: 1.4 }}>{n.text}</div>
              </div>
            ))}
          </div>
        </div>
        {/* STACK */}
        <div className="brutal" style={{ padding: 28, background: 'var(--paper)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
            <h3 className="display" style={{ fontSize: 32, margin: 0 }}>Stack</h3>
            <span className="mono" style={{ fontSize: 12, color: 'var(--mute)' }}>// tools I reach for</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {STACK.map(t => (
              <div key={t.name} title={t.name} style={{ aspectRatio: '1', background: 'var(--cream-warm)', border: '1.5px solid var(--line)', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'default', transition: 'transform 0.15s' }}
                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) rotate(-3deg)'}
                   onMouseLeave={e => e.currentTarget.style.transform = ''}>
                <div style={{ width: 26, height: 26, borderRadius: 13, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 800, border: '1.5px solid var(--line)' }}>{t.glyph}</div>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GITHUB HEATMAP */}
      <section style={{ marginBottom: 80 }}>
        <SectionHeader kicker="// github.com/virgoC0der" title="过去一年" tail="contributions" color="var(--lime)"/>
        <div className="brutal" style={{ padding: 28, marginTop: 30, background: 'var(--paper)' }}>
          <GitHubHeatmap />
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
            <span><strong style={{ fontSize: 18 }}>743</strong> contributions in the last year</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mute)' }}>
              Less
              {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 12, height: 12, background: heatColor(i), border: '1px solid rgba(0,0,0,0.15)', borderRadius: 2 }}/>)}
              More
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function heatColor(level) {
  return ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'][level];
}

function GitHubHeatmap() {
  // 53 weeks × 7 days, seeded pseudo-random
  const weeks = 53;
  const days = 7;
  const cells = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const seed = (w * 7 + d) * 31;
      const r = (Math.sin(seed) * 10000) % 1;
      const level = Math.abs(r) < 0.4 ? 0 : Math.abs(r) < 0.65 ? 1 : Math.abs(r) < 0.85 ? 2 : Math.abs(r) < 0.95 ? 3 : 4;
      cells.push({ w, d, level });
    }
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ position: 'relative', width: weeks * 13 + 30, paddingLeft: 30 }}>
        <div style={{ display: 'flex', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--mute)', marginBottom: 4, marginLeft: 0 }}>
          {months.map((m, i) => <span key={m} style={{ width: 13 * 4.4, flexShrink: 0 }}>{m}</span>)}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: days * 13, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--mute)' }}>
          <span>Mon</span><span>Wed</span><span>Fri</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks}, 11px)`, gridTemplateRows: `repeat(${days}, 11px)`, gridAutoFlow: 'column', gap: 2 }}>
          {cells.map((c, i) => (
            <div key={i} title={`${c.level} commits`} style={{ width: 11, height: 11, background: heatColor(c.level), borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, tail, color = "var(--yellow)" }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 12, borderBottom: '2px dashed var(--line)' }}>
      <div style={{ flex: '0 0 auto' }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 4 }}>{kicker}</div>
        <h2 className="display" style={{ fontSize: 44, margin: 0, display: 'inline-flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ background: color, padding: '0 10px', borderRadius: 4, border: '2px solid var(--line)', boxShadow: '3px 3px 0 var(--line)', display: 'inline-block', transform: 'rotate(-1deg)' }}>{title}</span>
        </h2>
      </div>
      {tail && <span className="mono" style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 10, marginLeft: 'auto' }}>// {tail}</span>}
    </div>
  );
}

function FeaturedCard({ post, onNav, tilt = 0 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article onClick={() => onNav('/posts/' + post.slug)}
             onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
             style={{
               background: 'var(--paper)', border: '2px solid var(--line)', borderRadius: 8,
               boxShadow: hover ? '3px 3px 0 var(--line)' : '8px 8px 0 var(--line)',
               transform: `rotate(${tilt}deg) translate(${hover ? '5px, 5px' : '0, 0'})`,
               transition: 'all 0.15s', cursor: 'pointer', overflow: 'hidden'
             }}>
      <CoverArt kind={post.cover} color={post.color} height={180} />
      <div style={{ borderTop: '2px solid var(--line)', padding: '20px 24px 22px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <Chip color="var(--ink)" size="sm"><span style={{ color: 'var(--yellow)' }}>★ PINNED</span></Chip>
          <Chip color={post.color} size="sm">{post.category}</Chip>
        </div>
        <h3 className="display" style={{ fontSize: 26, margin: '0 0 6px', lineHeight: 1.15 }}>{post.title}</h3>
        <div className="mono" style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 10 }}>{post.title_en}</div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 14px' }}>{post.description}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--mute)' }}>
          <span>{post.date}</span><span>·</span><span>{post.readTime} min read</span>
          <span style={{ marginLeft: 'auto' }}>Read {hover ? '→' : '↗'}</span>
        </div>
      </div>
    </article>
  );
}

function TerminalPostRow({ post, onNav, index }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={() => onNav('/posts/' + post.slug)}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
         style={{ display: 'grid', gridTemplateColumns: '40px 100px 1fr auto auto', gap: 16, alignItems: 'center',
                 padding: '14px 20px',
                 background: hover ? post.color : (index % 2 === 0 ? 'var(--paper)' : 'var(--cream-warm)'),
                 borderBottom: '1.5px dashed rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'background 0.12s',
                 fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <span style={{ color: 'var(--coral)', fontWeight: 700 }}>$</span>
      <span style={{ color: 'var(--mute)' }}>{post.date}</span>
      <span style={{ fontWeight: 600 }}>{post.title}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {post.tags.slice(0, 2).map(t => <span key={t} style={{ fontSize: 10, background: 'rgba(0,0,0,0.08)', padding: '2px 6px', borderRadius: 3 }}>#{t}</span>)}
      </div>
      <span style={{ color: 'var(--mute)' }}>{post.readTime}m {hover ? '→' : ''}</span>
    </div>
  );
}

// ───────────────────────── POSTS LIST ─────────────────────────
function PostsPage({ onNav, variant }) {
  const [filter, setFilter] = React.useState(null);
  const [view, setView] = React.useState('cards'); // 'cards' | 'list'
  const visible = filter ? POSTS.filter(p => p.tags.includes(filter) || p.category === filter) : POSTS;

  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 13, color: 'var(--coral)', marginBottom: 12 }}>~/posts $ ls -la | wc -l → <strong>{POSTS.length}</strong></div>
        <h1 className="display" style={{ fontSize: 84, margin: 0, lineHeight: 1 }}>
          All <span style={{ background: 'var(--coral-soft)', padding: '0 16px', border: '2px solid var(--line)', borderRadius: 10, boxShadow: '6px 6px 0 var(--line)', display: 'inline-block', transform: 'rotate(-1.5deg)' }}>posts</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 620, marginTop: 18 }}>
          七篇关于 Go、AI 基础设施、MCP 和小型工具的文章 — 都是我踩过的坑和学到的事。
        </p>
      </div>

      {/* filters bar */}
      <div className="brutal" style={{ padding: '16px 20px', marginBottom: 28, background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--mute)', marginRight: 4 }}>filter:</span>
        <button onClick={() => setFilter(null)} style={chipBtnStyle(!filter, 'var(--yellow)')}>all · {POSTS.length}</button>
        {CATEGORIES.map(c => (
          <button key={c.name} onClick={() => setFilter(c.name)} style={chipBtnStyle(filter === c.name, 'var(--mint)')}>{c.icon} {c.name} · {c.count}</button>
        ))}
        <span style={{ flexBasis: '100%', height: 0 }} />
        <span style={{ display: 'flex', gap: 4, border: '1.5px solid var(--line)', borderRadius: 4, padding: 2, marginLeft: 'auto' }}>
          <button onClick={() => setView('cards')} style={{ background: view === 'cards' ? 'var(--ink)' : 'transparent', color: view === 'cards' ? 'var(--paper)' : 'var(--ink)', border: 'none', borderRadius: 3, padding: '4px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>▦ cards</button>
          <button onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--ink)' : 'transparent', color: view === 'list' ? 'var(--paper)' : 'var(--ink)', border: 'none', borderRadius: 3, padding: '4px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>≡ list</button>
        </span>
      </div>

      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 60 }}>
          {visible.map((p, i) => <PostCard key={p.slug} post={p} onNav={onNav} tilt={((i % 3) - 1) * 0.6} />)}
        </div>
      ) : (
        <div className="brutal" style={{ padding: 0, overflow: 'hidden', marginBottom: 60 }}>
          {visible.map((p, i) => <TerminalPostRow key={p.slug} post={p} onNav={onNav} index={i+1} />)}
        </div>
      )}
    </div>
  );
}

function chipBtnStyle(active, color) {
  return {
    background: active ? color : 'var(--cream-warm)',
    border: '1.5px solid var(--line)',
    borderRadius: 4,
    padding: '5px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, fontSize: 12,
    cursor: 'pointer',
    boxShadow: active ? '2px 2px 0 var(--line)' : 'none',
    transform: active ? 'translate(-1px, -1px)' : 'none',
  };
}

function PostCard({ post, onNav, tilt = 0 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article onClick={() => onNav('/posts/' + post.slug)}
             onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
             style={{ background: 'var(--paper)', border: '2px solid var(--line)', borderRadius: 8,
                      boxShadow: hover ? '3px 3px 0 var(--line)' : '6px 6px 0 var(--line)',
                      transform: `rotate(${tilt}deg) translate(${hover ? '3px, 3px' : '0, 0'})`,
                      transition: 'all 0.12s', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <CoverArt kind={post.cover} color={post.color} height={140} />
      <div style={{ borderTop: '2px solid var(--line)', padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--mute)', marginBottom: 6 }}>{post.date} · {post.readTime}m</div>
        <h3 className="display" style={{ fontSize: 20, margin: '0 0 6px', lineHeight: 1.2 }}>{post.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 12px', flex: 1 }}>{post.description}</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {post.tags.slice(0, 3).map(t => <Chip key={t} color="var(--cream-warm)" size="sm">#{t}</Chip>)}
        </div>
      </div>
    </article>
  );
}

// ───────────────────────── POST DETAIL ─────────────────────────
function PostDetailPage({ slug, onNav }) {
  const post = POSTS.find(p => p.slug === slug) || POSTS[0];
  const [toc, setToc] = React.useState('intro');

  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 1240, margin: '0 auto' }}>
      <div className="mono" style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 16 }}>
        <span onClick={() => onNav('/')} style={{ cursor: 'pointer' }}>~</span> / <span onClick={() => onNav('/posts')} style={{ cursor: 'pointer' }}>posts</span> / <strong>{slug}.md</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 220px', gap: 32, alignItems: 'flex-start' }}>
        {/* LEFT — TOC */}
        <aside style={{ position: 'sticky', top: 20 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>◊ table of contents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '2px solid var(--line)', paddingLeft: 12 }}>
            {[
              { id: 'intro', t: '引言' },
              { id: 'why', t: 'Why MCP' },
              { id: 'setup', t: '环境准备' },
              { id: 'server', t: '实现 server' },
              { id: 'claude', t: '接入 Claude Desktop' },
              { id: 'security', t: '安全最佳实践' },
              { id: 'close', t: '结语' },
            ].map(item => (
              <a key={item.id} onClick={() => setToc(item.id)} style={{
                padding: '4px 8px', fontSize: 13, cursor: 'pointer',
                background: toc === item.id ? 'var(--yellow)' : 'transparent',
                borderRadius: 3, color: toc === item.id ? 'var(--ink)' : 'var(--ink-soft)',
                fontWeight: toc === item.id ? 600 : 400,
                marginLeft: toc === item.id ? -2 : 0,
                borderLeft: toc === item.id ? '3px solid var(--coral)' : 'none',
              }}>{item.t}</a>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 14, background: 'var(--mint)', border: '2px solid var(--line)', borderRadius: 4, boxShadow: '3px 3px 0 var(--line)' }}>
            <div className="mono" style={{ fontSize: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>✦ share</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={{ flex: 1, background: 'var(--paper)', border: '1.5px solid var(--line)', borderRadius: 3, padding: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>X</button>
              <button style={{ flex: 1, background: 'var(--paper)', border: '1.5px solid var(--line)', borderRadius: 3, padding: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>🔗</button>
              <button style={{ flex: 1, background: 'var(--paper)', border: '1.5px solid var(--line)', borderRadius: 3, padding: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>✎</button>
            </div>
          </div>
        </aside>

        {/* MAIN ARTICLE */}
        <article>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <Chip color={post.color} size="md">{post.category}</Chip>
            {post.tags.map(t => <Chip key={t} color="var(--cream-warm)" size="md">#{t}</Chip>)}
          </div>
          <h1 className="display" style={{ fontSize: 42, lineHeight: 1.08, margin: '0 0 12px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{post.title}</h1>
          <div className="mono" style={{ fontSize: 14, color: 'var(--mute)', marginBottom: 6 }}>{post.title_en}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 28px', paddingBottom: 16, borderBottom: '2px dashed var(--line)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MascotMark size={28} />
              <div>
                <strong>Billy</strong>
                <span style={{ color: 'var(--mute)', marginLeft: 6 }}>@virgoC0der</span>
              </div>
            </div>
            <span style={{ color: 'var(--mute)' }}>·</span>
            <span>{post.date}</span>
            <span style={{ color: 'var(--mute)' }}>·</span>
            <span>{post.readTime} min read</span>
            <span style={{ color: 'var(--mute)' }}>·</span>
            <span>2,134 views</span>
          </div>

          {/* cover */}
          <div style={{ marginBottom: 28, border: '2px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: '5px 5px 0 var(--line)' }}>
            <CoverArt kind={post.cover} color={post.color} height={240} />
          </div>

          {/* body */}
          <div style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
            <p>人工智能助手如 Claude 已经成为我们日常工作的重要工具，但其能力往往受限于预设功能。通过 <strong>Model Context Protocol (MCP)</strong>，我们可以显著扩展 AI 助手的能力边界，让它能够：</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>调用外部工具和 API</li>
              <li>访问本地系统资源</li>
              <li>执行特定的计算任务</li>
              <li>获取和处理实时数据</li>
            </ul>

            <h2 className="display" style={{ fontSize: 32, margin: '40px 0 16px', color: 'var(--ink)', position: 'relative', display: 'inline-block' }}>
              <span style={{ background: 'var(--yellow)', padding: '0 8px', border: '2px solid var(--line)', borderRadius: 4, boxShadow: '3px 3px 0 var(--line)' }}># Why MCP</span>
            </h2>
            <p>我选择 <code style={codeInline}>go-mcp</code> 作为参考实现 — 它完整覆盖了 MCP 规范，支持 HTTP 和 stdio 两种传输方式，并且类型定义非常清晰。</p>

            {/* code block */}
            <div style={{ margin: '28px 0', background: 'var(--ink)', border: '2px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: '5px 5px 0 var(--line)' }}>
              <div style={{ background: '#222', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #444', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#aaa' }}>
                <span style={{ background: 'var(--coral)', color: 'var(--ink)', padding: '1px 6px', borderRadius: 3, fontWeight: 700 }}>go</span>
                <span>server.go</span>
                <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>📋 copy</span>
              </div>
              <pre style={{ margin: 0, padding: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.65, color: '#eee', overflow: 'auto' }}>
<span style={{ color: '#cfc2f1' }}>package</span> <span style={{ color: '#a9e6c9' }}>main</span>

<span style={{ color: '#cfc2f1' }}>import</span> (
  <span style={{ color: '#f5dc5a' }}>"context"</span>
  <span style={{ color: '#f5dc5a' }}>"github.com/virgoC0der/go-mcp"</span>
)

<span style={{ color: '#cfc2f1' }}>type</span> <span style={{ color: '#a9e6c9' }}>Server</span> <span style={{ color: '#cfc2f1' }}>struct</span> {'{ '}prompts []Prompt{' }'}

<span style={{ color: '#cfc2f1' }}>func</span> (s *Server) <span style={{ color: '#a9e6c9' }}>CallTool</span>(
  ctx context.Context, name <span style={{ color: '#a9e6c9' }}>string</span>, args <span style={{ color: '#a9e6c9' }}>map</span>[<span style={{ color: '#a9e6c9' }}>string</span>]<span style={{ color: '#a9e6c9' }}>any</span>,
) (*ToolResult, <span style={{ color: '#a9e6c9' }}>error</span>) {'{'}
  <span style={{ color: '#888' }}>// dispatch to the right tool handler...</span>
  <span style={{ color: '#cfc2f1' }}>return</span> &ToolResult{'{ '}Text: <span style={{ color: '#f5dc5a' }}>"opened Safari ✓"</span>{' }'}, <span style={{ color: '#cfc2f1' }}>nil</span>
{'}'}
              </pre>
            </div>

            <p>实现 <code style={codeInline}>Server</code> 接口后，只需要将它同时挂到 <code style={codeInline}>httpServer</code> 和 <code style={codeInline}>stdioServer</code> — Claude Desktop 会通过 stdio 直接拉起子进程。</p>

            {/* callout */}
            <div style={{ margin: '32px 0', padding: '18px 20px', background: 'var(--lavender)', border: '2px solid var(--line)', borderRadius: 8, boxShadow: '4px 4px 0 var(--line)', display: 'flex', gap: 14 }}>
              <div style={{ flexShrink: 0 }}><Mascot size={60} pose="think" animated={false} /></div>
              <div>
                <div className="mono" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>✦ Virg's tip</div>
                <div style={{ fontSize: 15, lineHeight: 1.55 }}>如果你只为 Claude Desktop 用，stdio 就够了 — 不需要常驻 HTTP 服务，资源占用也更低。</div>
              </div>
            </div>

            <h2 className="display" style={{ fontSize: 32, margin: '40px 0 16px' }}>
              <span style={{ background: 'var(--mint)', padding: '0 8px', border: '2px solid var(--line)', borderRadius: 4, boxShadow: '3px 3px 0 var(--line)' }}># 接入 Claude Desktop</span>
            </h2>
            <p>打开 Claude Desktop 的 <em>Settings → Developer → Edit Config</em>，把你的可执行文件配进 <code style={codeInline}>mcpServers</code>。保存、重启 — Claude 会列出你新工具。</p>
          </div>

          {/* post footer */}
          <div style={{ marginTop: 60, padding: '24px 28px', background: 'var(--yellow)', border: '2px solid var(--line)', borderRadius: 8, boxShadow: '6px 6px 0 var(--line)', display: 'flex', gap: 20, alignItems: 'center' }}>
            <Mascot size={90} pose="code" animated={false} />
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 22, marginBottom: 4 }}>觉得这篇有用？</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 10 }}>订阅 RSS 或去 GitHub 给 <code>go-mcp</code> 点个 ⭐</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <CTAButton color="var(--ink)" size="md" icon="↗"><span style={{ color: 'var(--yellow)' }}>GitHub ⭐</span></CTAButton>
                <CTAButton color="var(--paper)" size="md" icon="↗">RSS 订阅</CTAButton>
              </div>
            </div>
          </div>

          {/* prev / next */}
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="brutal" style={{ padding: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--mute)' }}>← prev</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Go i18n 本地化深潜</div>
            </div>
            <div className="brutal" style={{ padding: 16, textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--mute)' }}>next →</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>给 Go 服务打 12MB Docker 镜像</div>
            </div>
          </div>
        </article>

        {/* RIGHT — meta */}
        <aside style={{ position: 'sticky', top: 20 }}>
          <div className="brutal" style={{ padding: 18, background: 'var(--paper)' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>◊ front matter</div>
            <div className="mono" style={{ fontSize: 12, lineHeight: 1.7 }}>
              <div><span style={{ color: 'var(--coral)' }}>title:</span> {post.slug}</div>
              <div><span style={{ color: 'var(--coral)' }}>date:</span> {post.date}</div>
              <div><span style={{ color: 'var(--coral)' }}>author:</span> Billy</div>
              <div><span style={{ color: 'var(--coral)' }}>words:</span> ~4.2k</div>
              <div><span style={{ color: 'var(--coral)' }}>tags:</span></div>
              <div style={{ paddingLeft: 12 }}>
                {post.tags.map(t => <div key={t}>- {t}</div>)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: 'var(--coral)', border: '2px solid var(--line)', borderRadius: 4, boxShadow: '3px 3px 0 var(--line)', transform: 'rotate(2deg)' }}>
            <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, color: 'var(--paper)' }}>✦ reading</div>
            <div style={{ fontSize: 13, color: 'var(--paper)', lineHeight: 1.5 }}>当前进度 — 翻到 38%，还需 ~9 分钟</div>
            <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.3)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '38%', height: '100%', background: 'var(--paper)' }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
const codeInline = { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88em', background: 'var(--cream-warm)', border: '1px solid rgba(0,0,0,0.12)', padding: '1px 6px', borderRadius: 3 };

// ───────────────────────── ABOUT ─────────────────────────
function AboutPage({ onNav }) {
  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 1040, margin: '0 auto' }}>
      <div className="mono" style={{ fontSize: 13, color: 'var(--coral)', marginBottom: 12 }}>~/about $ cat README.md</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 40, alignItems: 'flex-start', marginBottom: 60 }}>
        <div>
          <h1 className="display" style={{ fontSize: 84, margin: 0, lineHeight: 1 }}>
            👋 Hello,<br/>I'm <span style={{ background: 'var(--yellow)', padding: '0 14px', border: '2px solid var(--line)', borderRadius: 10, boxShadow: '6px 6px 0 var(--line)', display: 'inline-block', transform: 'rotate(-1deg)' }}>Billy</span>.
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 24 }}>
            后端开发者，专注于可扩展系统和云原生应用。
            平时在 Go 里打滚，偶尔写 Python 和 Swift，沉迷于把 AI 工具塞到工作流的每个缝隙里。
          </p>
          <div style={{ marginTop: 28, display: 'flex', gap: 14, alignItems: 'center' }}>
            <CTAButton color="var(--yellow)" size="md" icon="↗">GitHub</CTAButton>
            <CTAButton color="var(--mint)" size="md" icon="✉">Email</CTAButton>
            <Squiggle width={50} />
            <span className="mono" style={{ fontSize: 13, color: 'var(--mute)' }}>@virgoC0der</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--coral-soft)', border: '2px solid var(--line)', borderRadius: 12, padding: 20, boxShadow: '6px 6px 0 var(--line)', transform: 'rotate(3deg)' }}>
            <Mascot size={200} pose="wave" />
            <div className="mono" style={{ fontSize: 11, textAlign: 'center', marginTop: 8, fontWeight: 700 }}>Virg · my mascot ♍</div>
          </div>
        </div>
      </div>

      {/* Grid of modular cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, marginBottom: 60 }}>
        <div className="brutal" style={{ gridColumn: 'span 3', padding: 24, background: 'var(--lavender)' }}>
          <div className="mono" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>◊ What I do</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 14 }}>
            <div><strong>Languages</strong><br/><span style={{ color: 'var(--ink-soft)' }}>Go, Python, Swift, React</span></div>
            <div><strong>Databases</strong><br/><span style={{ color: 'var(--ink-soft)' }}>MySQL, Postgres, MongoDB, Redis, Spanner</span></div>
            <div><strong>Cloud</strong><br/><span style={{ color: 'var(--ink-soft)' }}>GCP, AWS</span></div>
            <div><strong>DevOps</strong><br/><span style={{ color: 'var(--ink-soft)' }}>Docker, Kubernetes, CI/CD</span></div>
          </div>
        </div>
        <div className="brutal" style={{ gridColumn: 'span 3', padding: 24, background: 'var(--mint)' }}>
          <div className="mono" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>🎯 Ask me about</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.8 }}>
            <li>后端开发 & API 设计</li>
            <li>微服务架构</li>
            <li>云原生 & 分布式系统</li>
            <li>MCP 工具开发</li>
          </ul>
        </div>

        <div className="brutal" style={{ gridColumn: 'span 2', padding: 22, background: 'var(--yellow)' }}>
          <div style={{ fontSize: 40, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, lineHeight: 1 }}>2025</div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>博客创立</div>
        </div>
        <div className="brutal" style={{ gridColumn: 'span 2', padding: 22, background: 'var(--peach)' }}>
          <div style={{ fontSize: 40, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, lineHeight: 1 }}>{POSTS.length}</div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>文章已发表</div>
        </div>
        <div className="brutal" style={{ gridColumn: 'span 2', padding: 22, background: 'var(--lime)' }}>
          <div style={{ fontSize: 40, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, lineHeight: 1 }}>♍</div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>处女座 · 9月</div>
        </div>

        <div className="brutal" style={{ gridColumn: 'span 6', padding: '22px 28px', background: 'var(--cream-warm)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 40 }}>💡</span>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 22, marginBottom: 4 }}>Fun fact</div>
            <div style={{ fontSize: 15, color: 'var(--ink-soft)', fontStyle: 'italic' }}>I believe good code is self-documenting... but I comment anyway! 🚀</div>
          </div>
        </div>
      </div>

      {/* quote */}
      <div style={{ textAlign: 'center', padding: '40px 20px', margin: '20px 0 60px', borderTop: '2px dashed var(--line)', borderBottom: '2px dashed var(--line)' }}>
        <div style={{ fontSize: 26, fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, maxWidth: 660, margin: '0 auto', lineHeight: 1.3 }}>
          "First, solve the problem.<br/>Then, write the code."
        </div>
        <div className="mono" style={{ fontSize: 13, color: 'var(--mute)', marginTop: 12 }}>— John Johnson</div>
      </div>
    </div>
  );
}

// ───────────────────────── TAGS ─────────────────────────
function TagsPage({ onNav }) {
  const [active, setActive] = React.useState('Go');
  const matching = POSTS.filter(p => p.tags.includes(active));

  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 1240, margin: '0 auto' }}>
      <div className="mono" style={{ fontSize: 13, color: 'var(--coral)', marginBottom: 12 }}>~/tags $ grep -r ./posts</div>
      <h1 className="display" style={{ fontSize: 84, margin: 0 }}>
        Tag <span style={{ background: 'var(--mint)', padding: '0 14px', border: '2px solid var(--line)', borderRadius: 10, boxShadow: '6px 6px 0 var(--line)', display: 'inline-block', transform: 'rotate(-1.5deg)' }}>cloud</span>
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 620, marginTop: 18, marginBottom: 36 }}>
        字号越大 = 文章越多。点一下就能看这个 tag 下所有文章。
      </p>

      {/* Tag cloud */}
      <div className="brutal" style={{ padding: 36, marginBottom: 30, background: 'var(--paper)', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        {TAGS.map(t => {
          const size = 14 + t.count * 6;
          const isActive = active === t.name;
          return (
            <button key={t.name} onClick={() => setActive(t.name)}
              style={{
                background: isActive ? t.color : 'var(--cream-warm)',
                border: '2px solid var(--line)', borderRadius: 6,
                padding: `${Math.max(4, t.count*2)}px ${12 + t.count*2}px`,
                fontSize: size, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                cursor: 'pointer', color: 'var(--ink)',
                boxShadow: isActive ? '4px 4px 0 var(--line)' : '2px 2px 0 var(--line)',
                transform: `rotate(${((t.name.charCodeAt(0) % 5) - 2)}deg) translate(${isActive ? '-2px, -2px' : '0, 0'})`,
                transition: 'all 0.12s'
              }}>
              #{t.name}<sup style={{ fontSize: '0.55em', marginLeft: 4, opacity: 0.6 }}>{t.count}</sup>
            </button>
          );
        })}
      </div>

      {/* selected tag posts */}
      <div style={{ marginBottom: 50 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
          <div className="mono" style={{ fontSize: 13, color: 'var(--mute)' }}>$ posts filter=</div>
          <div className="display" style={{ fontSize: 32, background: TAGS.find(t => t.name === active)?.color, padding: '0 10px', border: '2px solid var(--line)', borderRadius: 6 }}>#{active}</div>
          <span className="mono" style={{ fontSize: 13, color: 'var(--mute)' }}>→ {matching.length} results</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {matching.map((p, i) => <PostCard key={p.slug} post={p} onNav={onNav} tilt={((i % 3) - 1) * 0.5} />)}
        </div>
      </div>

      {/* categories row */}
      <div style={{ marginBottom: 60 }}>
        <SectionHeader kicker="// categories" title="按分类浏览" color="var(--peach)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 24 }}>
          {CATEGORIES.map((c, i) => (
            <div key={c.name} className="brutal" style={{ padding: 24, background: ['var(--yellow)', 'var(--mint)', 'var(--lavender)', 'var(--coral-soft)'][i % 4], cursor: 'pointer' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{c.icon}</div>
              <div className="display" style={{ fontSize: 24 }}>{c.name}</div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{c.count} post{c.count > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── NOW ─────────────────────────
function NowPage({ onNav }) {
  return (
    <div style={{ padding: '40px 40px 0', maxWidth: 840, margin: '0 auto' }}>
      <div className="mono" style={{ fontSize: 13, color: 'var(--coral)', marginBottom: 12 }}>~/now $ date && cat status.yml</div>
      <h1 className="display" style={{ fontSize: 72, margin: 0, lineHeight: 1 }}>
        /<span style={{ background: 'var(--lavender)', padding: '0 14px', border: '2px solid var(--line)', borderRadius: 10, boxShadow: '6px 6px 0 var(--line)', display: 'inline-block', transform: 'rotate(-1deg)' }}>now</span>
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-soft)', marginTop: 18, maxWidth: 560 }}>
        灵感来自 <a href="#" style={{ color: 'var(--coral)' }}>Derek Sivers' /now page</a> — 这页回答一个问题：<em>Billy 现在到底在搞什么</em>。
      </p>
      <div className="mono" style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Last updated: 2025-04-20 · 上海</div>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {NOW_ITEMS.map((n, i) => (
          <div key={n.tag} className="brutal" style={{ padding: 24, background: ['var(--yellow)', 'var(--mint)', 'var(--lavender)', 'var(--peach)'][i % 4], display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div className="mono" style={{ minWidth: 100, fontSize: 12, fontWeight: 700, background: 'var(--ink)', color: 'var(--paper)', padding: '6px 10px', borderRadius: 4, textAlign: 'center' }}>{n.label}</div>
            <div style={{ flex: 1, fontSize: 17, lineHeight: 1.5 }}>{n.text}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, padding: 24, background: 'var(--cream-warm)', border: '2px dashed var(--line)', borderRadius: 8, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
        如果你也在写 Go 工具 / MCP server / 自用 CLI，<a href="#" style={{ color: 'var(--coral)', fontWeight: 600 }}>给我发邮件</a> — 我很乐意聊聊。
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, PostsPage, PostDetailPage, AboutPage, TagsPage, NowPage });
