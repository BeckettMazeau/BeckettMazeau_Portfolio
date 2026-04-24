/* global React, localOf, clamp, lerp, smoothstep */

const { useEffect, useRef, useState, useMemo } = React;

function BootLine({ progress }) {
  // tiny dot-matrix boot sequence driven by progress away from hero
  const steps = [
    '> INIT .......... OK',
    '> POWER ......... 3.3V',
    '> SENSORS ....... ONLINE',
    '> MECH .......... IDLE',
    '> READY'
  ];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0, c = 0, raf;
    const run = () => {
      if (i >= steps.length) return;
      c++;
      setTyped(steps[i].slice(0, c));
      if (c >= steps[i].length) {
        c = 0;
        i++;
        setIdx(i);
        setTimeout(run, 220);
      } else {
        setTimeout(run, 22);
      }
    };
    setTimeout(run, 350);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="boot">
      {steps.slice(0, idx).map((s, i) => <div key={i}>{s}</div>)}
      {idx < steps.length && <div>{typed}<span style={{opacity:.6}}>_</span></div>}
    </div>
  );
}

function Pendulum({ progress }) {
  // Idle swing when at hero (progress ~ 0). As user scrolls to next section,
  // the pendulum's last swing "releases" the ball on the right-hand platform.
  const t = useRef(0);
  const [tick, setTick] = useState(0);
  const local = localOf(progress, 0); // 0 at hero, 1 at about

  useEffect(() => {
    let raf;
    const loop = (now) => {
      t.current = now / 1000;
      setTick(t.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // swing amplitude grows as user commits to leaving the hero
  const leaving = clamp(local, 0, 1);
  const baseAmp = 18;
  const amp = baseAmp + leaving * 22;
  const freq = 0.6 + leaving * 0.5;
  const angle = Math.sin(tick * Math.PI * 2 * freq) * amp;

  // ball release at local > .55: ball falls off the platform into abyss (handoff)
  const releasing = smoothstep(.45, 1.0, local);
  const ballX = 240 - releasing * 30;
  const ballY = 160 + releasing * releasing * 320;
  const ballOp = 1 - smoothstep(.85, 1.1, local);

  return (
    <svg className="pendulum-svg" viewBox="0 0 420 500" preserveAspectRatio="xMidYMid meet">
      {/* frame */}
      <g className="mech-soft">
        <rect x="30" y="30" width="360" height="440" />
        <line x1="30" y1="110" x2="390" y2="110" />
        <line x1="30" y1="390" x2="390" y2="390" />
      </g>
      {/* top bracket */}
      <g className="mech-stroke">
        <line x1="80" y1="60" x2="340" y2="60" strokeWidth="2" />
        <circle cx="210" cy="60" r="6" className="mech-fill" />
      </g>

      {/* pendulum arm */}
      <g transform={`rotate(${angle} 210 60)`}>
        <line x1="210" y1="60" x2="210" y2="310" className="mech-stroke" strokeWidth="1.5" />
        {/* bob */}
        <circle cx="210" cy="320" r="22" fill="var(--ink)" />
        <circle cx="210" cy="320" r="6" fill="var(--accent)" />
      </g>

      {/* escapement ticks (decorative arc) */}
      <g className="mech-soft">
        <path d={`M 150 130 A 60 60 0 0 1 270 130`} />
        <line x1="210" y1="70" x2="210" y2="86" />
        <line x1="150" y1="130" x2="166" y2="130" />
        <line x1="254" y1="130" x2="270" y2="130" />
      </g>

      {/* right-hand platform holding a steel ball (to be released on scroll) */}
      <g>
        <line x1="240" y1="175" x2="340" y2="175" className="mech-stroke" strokeWidth="1.5" />
        <line x1="340" y1="175" x2="340" y2="195" className="mech-stroke" />
        <circle cx={ballX} cy={ballY} r="8" fill="var(--ink)" opacity={ballOp} />
        <circle cx={ballX} cy={ballY} r="2.5" fill="var(--accent)" opacity={ballOp} />
      </g>

      {/* measurement callouts (technical drawing) */}
      <g className="mech-soft" fontFamily="var(--f-mono)" fontSize="9" fill="var(--ink-3)">
        <line x1="70" y1="60" x2="40" y2="60" />
        <line x1="40" y1="60" x2="40" y2="320" />
        <line x1="40" y1="320" x2="180" y2="320" />
        <text x="44" y="190" className="mech-fill" fontFamily="var(--f-mono)" fontSize="9">L = 250mm</text>
      </g>

      {/* label */}
      <text x="32" y="480" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2">
        FIG-01 · HARMONIC OSCILLATOR
      </text>
      <text x="388" y="480" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2" textAnchor="end">
        {`θ = ${angle.toFixed(1)}°`}
      </text>
    </svg>
  );
}

function SceneHero({ progress }) {
  return (
    <section className="scene hero">
      <div className="sect-label">00 · HOME</div>
      <div className="frame">
        <div className="title-cell">
          <BootLine progress={progress} />
          <h1 className="display">
            <span className="l1">Beckett</span>
            <span className="l2">Mazeau<span className="dot" /></span>
          </h1>
          <p className="intro">
            Mechatronics engineer. I build at the seam where physical mechanism meets
            embedded intelligence — precision linkages, power-gated electronics,
            and objects that feel deliberate.
          </p>
        </div>
        <div className="pendulum-stage">
          <Pendulum progress={progress} />
        </div>

        <div className="specs">
          <div><span>Discipline</span><b>MECHATRONICS</b></div>
          <div><span>Based</span><b>HOUSTON, TX</b></div>
          <div><span>Year</span><b>2026</b></div>
          <div><span>Status</span><b style={{color:'var(--accent)'}}>● OPEN TO WORK</b></div>
        </div>
      </div>

      <div className="big-hint">
        <span>scroll to engage</span>
        <div className="track" />
      </div>
    </section>
  );
}

window.SceneHero = SceneHero;
