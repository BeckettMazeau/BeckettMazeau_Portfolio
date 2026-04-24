const UPDATES = [
  { date: '2026-04-18', tag: 'BUILD', body: 'STIK-eNote shell revision 4 finished. Adjusted the hinge tolerance by 0.15mm for a better snap.' },
  { date: '2026-04-10', tag: 'CODE', body: 'Ported the menu system to LVGL 9.2. Memory footprint dropped by 40KB.' },
  { date: '2026-03-22', tag: 'DESIGN', body: 'Initial sketches for the rotary indexer. Thinking of using a Geneva drive instead of a stepper.' },
  { date: '2026-03-15', tag: 'BUILD', body: 'Lathe maintenance day. Cleaned the ways and trued the chuck.' },
  { date: '2026-02-28', tag: 'NOTE', body: 'Always order 10% more M2 screws than you think you need.' },
  { date: '2026-02-14', tag: 'DESIGN', body: 'Refining the sun-tracking array geometry to minimize wind load.' }
];

const SceneUpdates = ({ progress }) => {
  const p = window.clamp(progress - 4, -1, 1);
  const opacity = 1 - Math.abs(p);
  const translateY = p * 100;

  // Basic representation, the 3D marble track is highly complex for a simple handoff.
  // We'll use CSS/HTML for the feed and a simpler visual representation or 2D overlay for the marble track if 3D is too much JSX.
  // The spec says "3D/2D hybrid". Let's do a 2D SVG version for the solenoid + track since we don't have a physics engine.

  const [marbles, setMarbles] = React.useState([]);

  React.useEffect(() => {
    // A simplified marble dropper logic based on progress + idle
    let lastFireProgress = 0;

    const interval = setInterval(() => {
      // Fire every 4s idle
      setMarbles(m => [...m, { id: Date.now(), y: 0, x: 50, state: 'falling' }].slice(-10));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="scene" id="scene-04" style={{ opacity, transform: `translate3d(0, ${translateY}vh, 0)` }}>
      <div className="split-layout">
        <div className="split-left" style={{ paddingRight: 60 }}>
          <h2 className="scene-heading" style={{ fontSize: 64 }}>FIELD NOTES</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40, maxHeight: '60vh', overflow: 'hidden' }}>
            {UPDATES.map(u => (
              <div key={u.date} style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--steel-dark)', paddingBottom: 16 }}>
                <div style={{ fontFamily: 'var(--f-dot)', fontSize: 12, color: 'var(--ink-mute)', width: 100, flexShrink: 0 }}>
                  {u.date}
                </div>
                <div style={{ flex: 1, fontFamily: 'var(--f-body)', fontSize: 14, color: 'var(--ink)' }}>
                  {u.body}
                </div>
                <div className="s-brass" style={{ height: 'fit-content', padding: '2px 8px', fontSize: 10, fontFamily: 'var(--f-mono)', color: '#000', fontWeight: 'bold' }}>
                  {u.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="split-right" style={{ position: 'relative' }}>
          {/* Hybrid 2D/3D - We'll use an SVG overlay for the track for simplicity and reliability without a physics engine */}
          <div style={{ position: 'absolute', top: '10%', left: 0, width: '100%', height: '80%' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid meet">
              {/* Solenoid */}
              <g transform="translate(200, 50)">
                <rect x="-30" y="0" width="60" height="80" fill="#3C4046" stroke="#14161A" strokeWidth="2" />
                <rect x="-25" y="10" width="50" height="60" fill="#B36A3A" /> {/* Coil */}
                {/* Plunger */}
                <rect x="-8" y="40" width="16" height="60" fill="#8A8F97" />
              </g>

              {/* Lever */}
              <line x1="150" y1="120" x2="300" y2="140" stroke="#8A8F97" strokeWidth="6" />
              <circle cx="225" cy="130" r="4" fill="#000" />

              {/* Track */}
              <path d="M 50 160 L 350 240 L 50 320 L 350 400 L 50 480" fill="none" stroke="#7A5E1F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

              {/* Fake Marbles */}
              <circle cx="150" cy="186" r="10" fill="#8A8F97" />
              <circle cx="250" cy="213" r="10" fill="#8A8F97" />
              <circle cx="200" cy="280" r="10" fill="#8A8F97" />

              {/* Tag Queue */}
              <g transform="translate(50, 520)">
                <rect x="-20" y="0" width="40" height="100" fill="#14161A" stroke="#3C4046" strokeWidth="2" />
                <rect x="-18" y="80" width="36" height="6" fill="#C8A24A" />
                <rect x="-18" y="72" width="36" height="6" fill="#C8A24A" />
                <rect x="-18" y="64" width="36" height="6" fill="#C8A24A" />
                <rect x="-18" y="56" width="36" height="6" fill="#C8A24A" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

window.SceneUpdates = SceneUpdates;
