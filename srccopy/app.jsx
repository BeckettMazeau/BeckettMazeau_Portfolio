/* global React, ReactDOM,
   useWeightedPager, clamp,
   SceneHero, SceneAbout, SceneNow, SceneProjects, SceneUpdates, SceneContact,
   TweaksPanel, TweakSection, TweakRadio, TweakColor, useTweaks */

const { useEffect, useRef, useState } = React;

// ── Palette definitions ────────────────────────────────────────
const PALETTES = {
  paper: {
    '--bg':        '#f3f1ea',
    '--bg-2':      '#ebe8de',
    '--ink':       '#1b1b1a',
    '--ink-2':     '#3a3937',
    '--ink-3':     '#6b6a66',
    '--rule':      '#1b1b1a',
    '--rule-soft': 'rgba(27,27,26,.22)',
    '--grid':      'rgba(27,27,26,.06)',
    '--paper':     '#f3f1ea',
  },
  cream: {
    '--bg':        '#f4ecd8',
    '--bg-2':      '#ebe2cb',
    '--ink':       '#20181a',
    '--ink-2':     '#3a3028',
    '--ink-3':     '#726654',
    '--rule':      '#20181a',
    '--rule-soft': 'rgba(32,24,26,.22)',
    '--grid':      'rgba(32,24,26,.05)',
    '--paper':     '#f4ecd8',
  },
  dark: {
    '--bg':        '#141414',
    '--bg-2':      '#1b1b1b',
    '--ink':       '#ece6d3',
    '--ink-2':     '#b7b2a2',
    '--ink-3':     '#83806f',
    '--rule':      '#ece6d3',
    '--rule-soft': 'rgba(236,230,211,.22)',
    '--grid':      'rgba(236,230,211,.05)',
    '--paper':     '#141414',
  },
  cyan: {
    '--bg':        '#f1f3f3',
    '--bg-2':      '#e4eaea',
    '--ink':       '#12202a',
    '--ink-2':     '#2b3a44',
    '--ink-3':     '#607078',
    '--rule':      '#12202a',
    '--rule-soft': 'rgba(18,32,42,.2)',
    '--grid':      'rgba(18,32,42,.05)',
    '--paper':     '#f1f3f3',
  },
};

function applyPalette(name, accent, headlineFont) {
  const p = PALETTES[name] || PALETTES.paper;
  const r = document.documentElement;
  Object.entries(p).forEach(([k, v]) => r.style.setProperty(k, v));
  r.style.setProperty('--accent', accent || '#e32424');
  const fMap = {
    grotesk: `'Space Grotesk', system-ui, sans-serif`,
    dotmatrix: `'DSEG14 Classic', 'JetBrains Mono', monospace`,
    mono: `'JetBrains Mono', ui-monospace, monospace`,
  };
  r.style.setProperty('--f-head', fMap[headlineFont] || fMap.grotesk);
}

const SECTIONS = [
  { id: 0, name: 'Home' },
  { id: 1, name: 'About' },
  { id: 2, name: 'Now' },
  { id: 3, name: 'Work' },
  { id: 4, name: 'Updates' },
  { id: 5, name: 'Contact' },
];

function Chrome({ current, goTo }) {
  const [clock, setClock] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setClock(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="chrome">
      <div className="brand">
        <span className="dot" />
        <span>Beckett Mazeau</span>
        <span style={{color:'var(--ink-3)', fontWeight:400}}>— Mechatronics</span>
      </div>
      <nav>
        {SECTIONS.map(s => (
          <button key={s.id}
                  aria-current={current === s.id}
                  onClick={() => goTo(s.id)}>
            {String(s.id).padStart(2,'0')} · {s.name}
          </button>
        ))}
      </nav>
      <div className="sys">
        <span className="dim">HOU</span>
        <span>{clock}</span>
        <span className="dim">·</span>
        <span style={{color:'var(--accent)'}}>●</span>
      </div>
    </header>
  );
}

function Rail({ current, goTo }) {
  return (
    <div className="rail" aria-hidden="false">
      {SECTIONS.map(s => (
        <div key={s.id}
             className="tick"
             aria-current={current === s.id}
             onClick={() => goTo(s.id)}>
          <span className="lbl">{s.name}</span>
          <span className="bar" />
        </div>
      ))}
    </div>
  );
}

function WeightBar({ progress, total }) {
  const pct = (progress / (total - 1)) * 100;
  return (
    <div className="weight">
      <div className="fill" style={{height: `${pct}%`}} />
    </div>
  );
}

function Grain() { return <div className="grain" aria-hidden="true" />; }

// ── Tweaks ─────────────────────────────────────────────────────
function AppTweaks() {
  const defaults = window.__TWEAKS__ || { palette: 'paper', accent: '#e32424', headlineFont: 'grotesk' };
  const [t, setTweak] = useTweaks(defaults);
  useEffect(() => {
    applyPalette(t.palette, t.accent, t.headlineFont);
  }, [t.palette, t.accent, t.headlineFont]);
  return (
    <TweaksPanel>
      <TweakSection label="Palette" />
      <TweakRadio label="Scheme" value={t.palette}
                  options={['paper', 'cream', 'dark', 'cyan']}
                  onChange={(v) => setTweak('palette', v)} />
      <TweakColor label="Accent" value={t.accent}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Typography" />
      <TweakRadio label="Headline"
                  value={t.headlineFont}
                  options={['grotesk', 'dotmatrix', 'mono']}
                  onChange={(v) => setTweak('headlineFont', v)} />
    </TweaksPanel>
  );
}

// ── App ────────────────────────────────────────────────────────
function App() {
  const total = SECTIONS.length;
  const { progress, goTo } = useWeightedPager(total);
  const current = Math.round(progress);

  // Apply initial palette synchronously so first paint is correct
  useEffect(() => {
    const t = window.__TWEAKS__ || {};
    applyPalette(t.palette, t.accent, t.headlineFont);
  }, []);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const translate = `translate3d(0, ${-progress * vh}px, 0)`;

  // Re-render on resize (so translate recalcs)
  const [, bump] = useState(0);
  useEffect(() => {
    const onR = () => bump(x => x + 1);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  return (
    <div className="app">
      <Chrome current={current} goTo={goTo} />
      <Rail current={current} goTo={goTo} />
      <WeightBar progress={progress} total={total} />
      <div className="stage" style={{transform: translate}}>
        <SceneHero progress={progress} />
        <SceneAbout progress={progress} />
        <SceneNow progress={progress} />
        <SceneProjects progress={progress} />
        <SceneUpdates progress={progress} />
        <SceneContact progress={progress} />
      </div>
      <Grain />
      <AppTweaks />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(<App />);
