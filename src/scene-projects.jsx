/* global React, localOf, clamp */

const { useEffect, useRef, useState } = React;

const PROJECTS = [
  {
    id: 'stik',
    title: 'STIK-eNote',
    tag: 'PRODUCT',
    blurb: 'Pocketable clamshell task tracker built on PocketBeagle, with e-paper persistence and TFT + keyboard on open.',
    img: 'images/stik-enote-render.png',
  },
  {
    id: 'rotary',
    title: 'Rotary Element Connector',
    tag: 'MECHANISM',
    blurb: 'A rotary indexing mechanism with element connection — precision locating and repeatable engagement across index positions.',
    img: 'images/RotaryMech_Plus_ElementConnection.PNG',
  },
  {
    id: 'scene',
    title: 'Scene Creator GUI',
    tag: 'SOFTWARE',
    blurb: 'Interactive scene authoring tool. Compose geometry, lights, and materials with a focused creator-first interface.',
    img: 'images/SceneCreatorGUI.png',
  },
  {
    id: 'solar',
    title: 'Solar Ray Visibility',
    tag: 'SIMULATION',
    blurb: 'Analytical model of solar exposure vs panel tilt — derives the geometric best tilt from ray-visibility constraints.',
    img: 'images/solar_ray_visibility_diagram.png',
  },
  {
    id: 'cow',
    title: 'Edge Detection Studies',
    tag: 'VISION',
    blurb: 'Classic edge-detection experiments — exploring kernel families and noise robustness on reference imagery.',
    img: 'images/beautifulCowBWEdgeDetect.jpg',
  },
  {
    id: 'lightspeed',
    title: 'Relativistic Viewport',
    tag: 'SIMULATION',
    blurb: 'Relativistic aberration and doppler shift applied to a scene viewport — what the world looks like at near-light velocity.',
    img: 'images/lightspeed_high_v.png',
  },
  {
    id: 'poster',
    title: 'Project Poster',
    tag: 'PRINT',
    blurb: 'Large-format project poster distilling a multi-week capstone into a single readable sheet.',
    img: 'images/Poster.jpg',
  },
];

function Card({ p, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={'card' + (open ? ' open' : '')}>
      <div className="meta">
        <span className="idx">{String(idx + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
        <span className="tag">{p.tag}</span>
      </div>
      <div className="ph">
        {p.img ? <img src={p.img} alt={p.title} loading="lazy" /> : <span>{p.title}</span>}
      </div>
      <h3>{p.title}</h3>
      <p>{p.blurb}</p>
      <button className="more" onClick={() => setOpen(v => !v)}>
        <span className="chev">›</span>
        <span>{open ? 'Collapse' : 'Read more'}</span>
      </button>
    </div>
  );
}

function BeltRoller({ progress }) {
  // belt moves with a combined base speed + local progress
  const local = localOf(progress, 3);
  const tick = useRef(0);
  const [, setT] = useState(0);
  useEffect(() => {
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      const speed = 80 + 60 * (1 - Math.min(1, Math.abs(local)));
      tick.current += speed * dt;
      setT(tick.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [local]);

  const rot = tick.current;
  return (
    <svg viewBox="0 0 48 200" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(24 100)">
        <circle r="22" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
        <g transform={`rotate(${rot})`}>
          {[0, 60, 120].map(a => (
            <line key={a} x1="0" y1="0" x2="0" y2="-18" transform={`rotate(${a})`} stroke="var(--ink)" strokeWidth="1.25" />
          ))}
          <circle r="4" fill="var(--accent)" />
        </g>
      </g>
    </svg>
  );
}

function SceneProjects({ progress }) {
  const local = localOf(progress, 3);
  const trackRef = useRef(null);
  // belt offset: as user moves through this section, the belt slides left
  const beltOffset = clamp(local, -1, 1) * 220;

  return (
    <section className="scene projects">
      <div className="sect-label">03 · WORK</div>
      <div className="frame">
        <div className="head">
          <h2 className="display">Selected work<span style={{color:'var(--accent)'}}>.</span></h2>
          <div className="count">{String(PROJECTS.length).padStart(2,'0')} · CASES</div>
        </div>
        <div className="belt-wrap">
          <div className="belt-rollers l"><BeltRoller progress={progress} /></div>
          <div className="belt-rollers r"><BeltRoller progress={progress} /></div>
          <div className="belt" ref={trackRef}
               style={{transform: `translateX(${-beltOffset}px)`}}>
            {PROJECTS.map((p, i) => <Card key={p.id} p={p} idx={i} />)}
            {PROJECTS.slice(0,2).map((p, i) => <Card key={p.id + '-d'} p={p} idx={i} />)}
          </div>
        </div>
        <div style={{padding:'0 28px 18px', display:'flex', justifyContent:'space-between',
                     fontFamily:'var(--f-mono)', fontSize:10, letterSpacing:'.14em',
                     textTransform:'uppercase', color:'var(--ink-3)'}}>
          <span>◁ drag · scroll · swipe</span>
          <span>CONVEYOR · 01</span>
        </div>
      </div>
    </section>
  );
}

window.SceneProjects = SceneProjects;
