/* global React, localOf, clamp, smoothstep */

const { useEffect, useRef, useState } = React;

const UPDATES = [
  { date: '03.26.26', tag: 'BUILD', body: 'STIK-eNote V2 schematic broken out into six functional sheets. Net names replace rat-nest wiring.' },
  { date: '03.12.26', tag: 'NOTE', body: 'Switched lid detection from reed switch to DRV5032 Hall sensor. No more contact bounce on wake.' },
  { date: '02.28.26', tag: 'DESIGN', body: 'Added I²C level shifter pair (BSS138) so 3.3V PocketBeagle can talk to 5V CardKB without damage.' },
  { date: '02.14.26', tag: 'TEST', body: 'Boost converter ripple under 30 mV across the 5V rail. Quiet enough for analog neighbors.' },
  { date: '01.30.26', tag: 'IDEA', body: 'Exploring a low-profile rotary indexer for the next project — detent spring + cam profile sketches started.' },
];

function Solenoid({ progress }) {
  // a simple solenoid drops a little cube each time a new update "arrives"
  const local = localOf(progress, 4);
  const tick = useRef(0);
  const [, setT] = useState(0);
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      tick.current += dt;
      setT(tick.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const phase = (tick.current % 2); // 0..2s cycle
  const push = phase < 0.25 ? phase / 0.25 : phase < 0.6 ? 1 - (phase - 0.25) / 0.35 : 0;
  const plungerY = 80 - push * 32;

  return (
    <svg viewBox="0 0 480 480" preserveAspectRatio="xMidYMid meet" style={{width:'100%', height:'100%'}}>
      <g className="mech-soft">
        <rect x="20" y="20" width="440" height="440" />
      </g>
      {/* solenoid body */}
      <g transform="translate(240 120)">
        <rect x="-48" y="-40" width="96" height="80" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
        {/* windings */}
        {[...Array(8)].map((_, i) => (
          <line key={i} x1="-48" y1={-30 + i*8} x2="48" y2={-30 + i*8} stroke="var(--ink)" strokeWidth=".8" />
        ))}
        {/* plunger */}
        <rect x="-8" y={plungerY - 120} width="16" height="80" fill="var(--ink)" />
        <rect x="-12" y={plungerY - 44} width="24" height="8" fill="var(--accent)" />
        {/* leads */}
        <path d="M -70 -40 L -80 -10 L -80 40" stroke="var(--ink)" fill="none" strokeWidth="1" />
        <path d="M 70 -40 L 80 -10 L 80 40" stroke="var(--ink)" fill="none" strokeWidth="1" />
        <text x="0" y="56" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle" letterSpacing="2">COIL · 12V</text>
      </g>

      {/* ball track that accepts the stamped note and rolls down to feed queue */}
      <path d="M 240 220 L 240 280 L 380 280 L 380 420" className="mech-stroke" strokeWidth="1.5" />
      {/* a marble rolls along periodically */}
      <Marble progress={progress} />
      {/* queue boxes */}
      <g className="mech-stroke">
        <rect x="360" y="400" width="40" height="24" />
        <rect x="360" y="428" width="40" height="24" />
      </g>

      {/* labels */}
      <text x="32" y="462" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2">
        FIG-05 · LOG STAMPER
      </text>
    </svg>
  );
}

function Marble({ progress }) {
  const tick = useRef(0);
  const [, setT] = useState(0);
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => { const dt = (now - last) / 1000; last = now; tick.current += dt; setT(tick.current); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const cyc = 3;
  const p = (tick.current % cyc) / cyc; // 0..1
  let x = 240, y = 220;
  if (p < 0.35) { y = 220 + (p / 0.35) * 60; }
  else if (p < 0.7) { y = 280; x = 240 + ((p - 0.35) / 0.35) * 140; }
  else { x = 380; y = 280 + ((p - 0.7) / 0.3) * 140; }
  const op = p > 0.97 ? 0 : 1;
  return <circle cx={x} cy={y} r="6" fill="var(--ink)" opacity={op} />;
}

function SceneUpdates({ progress }) {
  const local = localOf(progress, 4);
  // cascade-in when scrolling into the scene; once in, stay in
  const near = clamp(1.2 - Math.abs(local), 0, 1.2);
  const visible = Math.max(0, Math.min(UPDATES.length, Math.ceil(near * (UPDATES.length + 1))));
  return (
    <section className="scene updates">
      <div className="sect-label">04 · UPDATES</div>
      <div className="frame">
        <div className="l-col">
          <div className="eyebrow" style={{marginBottom:12}}>FEED · WORKBENCH</div>
          <h2 className="display">Field notes.</h2>
          <p>Short dispatches from the workbench — progress notes, design
             decisions, and lessons learned as they happen.</p>

          <div className="feed" style={{marginTop:32}}>
            {UPDATES.map((u, i) => (
              <div key={i} className={'item' + (i < visible ? ' in' : '')}>
                <span className="date">{u.date}</span>
                <span className="body">{u.body}</span>
                <span className="tag">{u.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="solenoid">
          <Solenoid progress={progress} />
        </div>
      </div>
    </section>
  );
}

window.SceneUpdates = SceneUpdates;
