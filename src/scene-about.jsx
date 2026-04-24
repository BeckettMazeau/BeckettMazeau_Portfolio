/* global React, localOf, clamp, lerp, smoothstep */

const { useEffect, useRef, useMemo } = React;

/* About: the steel ball from Hero lands in a funnel that drives a gear train.
   The gear train's output shaft spins a little carousel tag cloud behind the photo. */
function GearTrain({ progress }) {
  // continuous rotation driven by a slow base + a kick when entering/leaving
  const local = localOf(progress, 1); // 0 centered on About, -1 at Hero, 1 at Now
  const tick = useRef(0);
  const [, setT] = React.useState(0);
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      // speed ramps up as we approach this section, stays on while centered, tapers as we leave
      const speed = 40 + 120 * (1 - Math.min(1, Math.abs(local)));
      tick.current += speed * dt;
      setT(tick.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [local]);

  const r1 = tick.current;
  const r2 = -tick.current * (20/32);   // teeth ratio
  const r3 = tick.current * (20/32) * (14/28);
  const r4 = -tick.current * (20/32) * (14/28) * (18/24);

  return (
    <svg className="gears" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
      {/* funnel in the upper-left that catches the ball */}
      <g className="mech-stroke">
        <path d="M 50 20 L 160 20 L 130 90 L 80 90 Z" />
        <line x1="105" y1="90" x2="105" y2="130" />
      </g>
      {/* marble in the funnel after handoff */}
      <circle cx="105" cy="135" r="7" fill="var(--ink)" opacity={clamp(progress - 0.5, 0, 1)} />

      {/* gear train across the bottom */}
      <Gear cx={180} cy={650} r={60} teeth={32} rot={r1} color="var(--ink)" />
      <Gear cx={290} cy={650} r={38} teeth={20} rot={r2} color="var(--ink)" />
      <Gear cx={365} cy={600} r={26} teeth={14} rot={r3} color="var(--ink)" />
      <Gear cx={455} cy={600} r={34} teeth={18} rot={r4} accent color="var(--ink)" />

      {/* belt/cable from gear train to rightward mechanism */}
      <path d="M 455 600 C 700 560 900 520 1350 520"
            className="mech-soft" />
      <circle cx={1350} cy={520} r={6} className="mech-fill" />

      {/* dimension line above */}
      <g className="mech-soft">
        <line x1="180" y1="720" x2="455" y2="720" />
        <line x1="180" y1="715" x2="180" y2="730" />
        <line x1="455" y1="715" x2="455" y2="730" />
      </g>
      <text x="315" y="748" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2" textAnchor="middle">
        4-STAGE · REDUCTION 1:13.7
      </text>
    </svg>
  );
}

function Gear({ cx, cy, r, teeth, rot, accent }) {
  const path = useMemo(() => {
    const n = teeth;
    const rOut = r;
    const rIn = r * 0.82;
    const rHub = r * 0.35;
    const tooth = (Math.PI * 2) / n;
    let d = '';
    for (let i = 0; i < n; i++) {
      const a0 = i * tooth;
      const a1 = a0 + tooth * 0.28;
      const a2 = a0 + tooth * 0.5;
      const a3 = a0 + tooth * 0.72;
      const a4 = a0 + tooth;
      const pt = (ang, rad) => `${Math.cos(ang)*rad} ${Math.sin(ang)*rad}`;
      d += (i === 0 ? 'M ' : 'L ') + pt(a0, rOut);
      d += ' L ' + pt(a1, rOut);
      d += ' L ' + pt(a2, rIn);
      d += ' L ' + pt(a3, rIn);
      d += ' L ' + pt(a4, rOut);
    }
    d += ' Z';
    return { d, rHub };
  }, [r, teeth]);

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path d={path.d} fill="var(--ink)" />
      <circle r={path.rHub} fill="var(--bg)" />
      <circle r={path.rHub - 3} fill="none" stroke="var(--ink)" strokeWidth="1" />
      {accent && <circle r={path.rHub * 0.35} fill="var(--accent)" />}
      {/* spoke hint */}
      {[0, 60, 120].map(a => (
        <line key={a} x1="0" y1="0" x2={r*0.75} y2="0" transform={`rotate(${a})`} stroke="var(--bg)" strokeWidth="2" />
      ))}
    </g>
  );
}

function SceneAbout({ progress }) {
  return (
    <section className="scene about">
      <div className="sect-label">01 · ABOUT</div>
      <GearTrain progress={progress} />
      <div className="frame">
        <div className="photo-col">
          <div className="photo-frame">
            <img src="images/Headshot.JPG" alt="Beckett Mazeau" />
            <div className="reg tl" />
            <div className="reg br" />
          </div>
        </div>
        <div className="text-col">
          <div className="eyebrow" style={{marginBottom:12}}>PROFILE · B.M.</div>
          <h2 className="display">Mechanisms<br/>with intent.</h2>
          <p>
            I work where physical systems meet intelligent control — designing
            linkages that move with purpose and electronics that respond with
            precision.
          </p>
          <p className="secondary">
            From concept sketch through CAD, prototyping, and integration, I
            approach every build with a systems-level perspective. My goal is
            to make complex assemblies feel elegant and reliable.
          </p>
          <div className="tags">
            <span>SolidWorks</span>
            <span>Fusion 360</span>
            <span>FEA / CFD</span>
            <span>KiCad</span>
            <span>Embedded C</span>
            <span>FDM · SLA · CNC</span>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SceneAbout = SceneAbout;
