// Tweaks panel — PostHog-style toggles
function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: 'var(--paper)', border: '2px solid var(--line)',
      borderRadius: 8, boxShadow: '6px 6px 0 var(--line)',
      padding: 16, width: 260, fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1.5px dashed var(--line)' }}>
        <strong style={{ fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>✦ Tweaks</strong>
        <span style={{ fontSize: 10, color: 'var(--mute)' }}>live</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--mute)', marginBottom: 6 }}>Nav variant</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['A', 'B', 'C'].map(v => (
            <button key={v} onClick={() => setTweaks({ ...tweaks, variant: v })}
              style={{
                flex: 1, padding: '6px', fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                background: tweaks.variant === v ? 'var(--yellow)' : 'var(--cream-warm)',
                border: '1.5px solid var(--line)', borderRadius: 4, cursor: 'pointer',
                boxShadow: tweaks.variant === v ? '2px 2px 0 var(--line)' : 'none',
              }}>{v}</button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--mute)', marginTop: 4 }}>A: browser tabs · B: pill nav · C: terminal</div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}>
        <input type="checkbox" checked={tweaks.scanlines} onChange={e => setTweaks({ ...tweaks, scanlines: e.target.checked })} />
        paper grain overlay
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}>
        <input type="checkbox" checked={tweaks.mascotEnabled} onChange={e => setTweaks({ ...tweaks, mascotEnabled: e.target.checked })} />
        show Virg mascot
      </label>
    </div>
  );
}
Object.assign(window, { TweaksPanel });
