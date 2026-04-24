/* global React, localOf, clamp, lerp, smoothstep */

const { useEffect, useRef, useState, useMemo } = React;

/* Now scene: cam-driven piston. The belt from the gear train turns a cam that
   pushes a piston which "presses" against the device body. */
function CamPiston({ progress }) {
  const local = localOf(progress, 2);
  const tick = useRef(0);
  const [, setT] = useState(0);
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      const speed = 90 + 60 * (1 - Math.min(1, Math.abs(local)));
      tick.current += speed * dt;
      setT(tick.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [local]);

  const ang = (tick.current * Math.PI) / 180;
  const offset = Math.sin(ang) * 14; // piston travel

  return (
    <svg className="cam-svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
      <g className="mech-soft">
        <rect x="30" y="30" width="540" height="540" />
      </g>

      {/* cam at bottom */}
      <g transform={`translate(140 480)`}>
        <g transform={`rotate(${tick.current})`}>
          <ellipse cx="0" cy="0" rx="48" ry="36" fill="var(--ink)" />
          <circle r="6" fill="var(--accent)" />
        </g>
        <circle r="8" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.25" />
      </g>

      {/* piston pushing upward */}
      <g transform={`translate(140 ${400 - offset})`}>
        <rect x="-16" y="0" width="32" height="60" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
        <line x1="-16" y1="0" x2="16" y2="0" stroke="var(--ink)" strokeWidth="2" />
        <line x1="-10" y1="-30" x2="-10" y2="0" stroke="var(--ink)" strokeWidth="1" />
        <line x1="10" y1="-30" x2="10" y2="0" stroke="var(--ink)" strokeWidth="1" />
      </g>

      {/* guide rails */}
      <g className="mech-soft">
        <line x1="115" y1="350" x2="115" y2="470" />
        <line x1="165" y1="350" x2="165" y2="470" />
      </g>

      {/* drive belt coming in from the left */}
      <path d={`M 0 500 C 60 500 80 480 140 480`} className="mech-soft" />

      {/* spring above piston */}
      <path
        d={`M 140 ${360 - offset} q 10 -8 0 -16 q -10 -8 0 -16 q 10 -8 0 -16 q -10 -8 0 -16 q 10 -8 0 -16`}
        className="mech-stroke" />

      {/* indicator dial on the right */}
      <g transform="translate(480 140)">
        <circle r="56" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
        <circle r="44" fill="none" stroke="var(--rule-soft)" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="0" y1="-56" x2="0" y2="-48" transform={`rotate(${i * 30})`} stroke="var(--ink)" strokeWidth="1" />
        ))}
        <g transform={`rotate(${tick.current * 0.25})`}>
          <line x1="0" y1="0" x2="0" y2="-40" stroke="var(--accent)" strokeWidth="2" />
          <circle r="3" fill="var(--ink)" />
        </g>
        <text x="0" y="78" fontFamily="var(--f-mono)" fontSize="9" fill="var(--ink-3)" textAnchor="middle" letterSpacing="2">
          STROKE
        </text>
      </g>

      <text x="30" y="20" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2">
        FIG-03 · CAM/PISTON
      </text>
    </svg>
  );
}

function NowModal({ open, onClose }) {
  return (
    <div className={'modal-scrim' + (open ? ' open' : '')} onClick={onClose}>
      <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="modal">
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
          <span className="eyebrow">IN PROGRESS · STIK-ENOTE</span>
          <h3>A pocketable e-paper task tracker.</h3>
          <p>
            Clamshell device built around the PocketBeagle. Closed, only the
            low-power e-paper display stays alive, persisting your task list at
            near-zero current. Opening the lid trips a Hall-effect sensor that
            brings up a 240×320 TFT and a mini I²C keyboard for editing.
          </p>
          <div className="grid2">
            <div>
              <h4>Dual Display</h4>
              <p>GDEY0213B74 e-paper at rest; YT280S010 TFT when open.</p>
            </div>
            <div>
              <h4>Power Gating</h4>
              <p>Three BSS84 P-FETs high-side switch the 5V rail, TFT, and e-paper.</p>
            </div>
            <div>
              <h4>Lid Sensing</h4>
              <p>DRV5032 omnipolar Hall sensor replaces the original reed switch.</p>
            </div>
            <div>
              <h4>Level Shift</h4>
              <p>Pair of BSS138 N-FETs bridge 3.3V logic to the 5V CardKB.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneNow({ progress }) {
  const local = localOf(progress, 2);
  const press = clamp(1 - Math.abs(local), 0, 1);
  const [open, setOpen] = useState(false);

  return (
    <section className="scene now">
      <div className="sect-label">02 · NOW</div>
      <div className="frame">
        <div className="cam-col">
          <div className="device-stage">
            <CamPiston progress={progress} />
            <div className="device" style={{transform: `translate(-50%, calc(-50% - ${press * 6}px))`}}>
              <img src="images/stik-enote-render.png" alt="STIK-eNote render" />
            </div>
          </div>
        </div>
        <div className="text-col">
          <div className="status"><span className="blink" />In Progress · Mar 2026</div>
          <h2 className="display">STIK-eNote<span style={{color:'var(--accent)'}}>.</span></h2>
          <p className="sub"><em>A pocketable e-paper task tracker.</em></p>
          <p className="blurb">
            A distraction-free, always-in-your-pocket tool that shows your
            priorities at a glance — no phone, no laptop. Low-power e-paper at
            rest; TFT + keyboard on lid open.
          </p>
          <div className="pills">
            <span>PocketBeagle</span>
            <span>E-Paper</span>
            <span>KiCad</span>
            <span>P-FET Gating</span>
            <span>I²C</span>
          </div>
          <button className="expand" onClick={() => setOpen(true)}>
            <span>Inspect project</span>
            <span className="plus" />
          </button>
        </div>
      </div>
      <NowModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

window.SceneNow = SceneNow;
