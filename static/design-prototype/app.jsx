// App root — routing + tweak mode + mounts everything

function App() {
  const [route, setRoute] = React.useState(() => localStorage.getItem('blog.route') || '/');
  const [tweaks, setTweaks] = React.useState(() => {
    try { return { ...window.__TWEAKS, ...(JSON.parse(localStorage.getItem('blog.tweaks') || '{}')) }; }
    catch { return window.__TWEAKS; }
  });
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => { localStorage.setItem('blog.route', route); window.scrollTo(0, 0); }, [route]);
  React.useEffect(() => { localStorage.setItem('blog.tweaks', JSON.stringify(tweaks)); }, [tweaks]);

  // Tweak mode protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweaks = (next) => {
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  const onNav = (path) => setRoute(path);

  // route dispatch
  let page;
  if (route === '/' || route === '') page = <HomePage onNav={onNav} variant={tweaks.variant} />;
  else if (route === '/posts') page = <PostsPage onNav={onNav} variant={tweaks.variant} />;
  else if (route.startsWith('/posts/')) page = <PostDetailPage slug={route.replace('/posts/', '')} onNav={onNav} />;
  else if (route === '/about') page = <AboutPage onNav={onNav} />;
  else if (route === '/tags') page = <TagsPage onNav={onNav} />;
  else if (route === '/now') page = <NowPage onNav={onNav} />;
  else page = <HomePage onNav={onNav} variant={tweaks.variant} />;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* paper grain toggled by tweaks */}
      {!tweaks.scanlines && <style>{`body::before{display:none!important}`}</style>}

      <TopBar route={route} onNav={onNav} variant={tweaks.variant} />
      <main style={{ paddingBottom: 40 }}>
        {page}
      </main>
      <Footer variant={tweaks.variant} onNav={onNav} />

      <TweaksPanel tweaks={tweaks} setTweaks={updateTweaks} visible={editMode} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
