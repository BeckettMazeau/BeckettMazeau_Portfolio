const { useState, useEffect } = React;

const projects = [
  { id: '01', title: 'STIK-eNote', year: '2025', desc: 'e-paper task tracker', img: 'images/stik-enote-render.png' },
  { id: '02', title: 'Rotary Indexer', year: '2024', desc: '8-station indexing mechanism', img: 'images/RotaryMech_Plus_ElementConnection.PNG' },
  { id: '03', title: '3D Scene Compositor', year: '2024', desc: 'GLSL wireframe renderer', img: 'images/ElectronicCompartment.JPG' },
  { id: '04', title: 'Sun-Tracking Array', year: '2024', desc: '2-axis photovoltaic mount', img: 'images/InternalWideShot.JPG' },
  { id: '05', title: 'Edge-Detection Study', year: '2023', desc: 'CV pipeline, bovine edition', img: 'images/stik-enote-schematic.jpg' },
  { id: '06', title: 'Lightspeed Poster', year: '2023', desc: 'infographic on relativistic travel', img: 'images/Poster.jpg' }
];

const SceneProjects = ({ progress }) => {
  const p = window.clamp(progress - 3, -1, 1);
  const opacity = 1 - Math.abs(p);
  const translateY = p * 100;

  const [activeIndex, setActiveIndex] = useState(0);

  // Time-based idle animation + scroll-based offset
  const [timeOffset, setTimeOffset] = useState(0);
  useEffect(() => {
    let req;
    let start = performance.now();
    const tick = (now) => {
      setTimeOffset((now - start) / 1000);
      req = requestAnimationFrame(tick);
    };
    req = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(req);
  }, []);

  // Belt moves 1 card (e.g. 300px) per 6 seconds idle
  // Also moves with scroll progress
  const cardSpacing = 300;
  const beltPosition = (timeOffset / 6) * cardSpacing + (progress * cardSpacing * 2);

  // Calculate which card is active based on belt position
  useEffect(() => {
    // Determine center card
    // Belt moves left as index increases
    const centerOffset = beltPosition % (projects.length * cardSpacing);
    const normalizedOffset = (centerOffset + projects.length * cardSpacing) % (projects.length * cardSpacing);
    const index = Math.floor((normalizedOffset + cardSpacing / 2) / cardSpacing) % projects.length;
    // Note: since belt moves right-to-left as value increases, we invert the index logic
    // Just simple demo logic here
    setActiveIndex((projects.length - index) % projects.length);
  }, [beltPosition]);

  return (
    <section className="scene" id="scene-03" style={{ opacity, transform: `translate3d(0, ${translateY}vh, 0)` }}>
      <div style={{ position: 'absolute', top: '15%', width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--f-disp)', fontSize: 96, color: 'var(--ink)' }}>PROJECTS</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
           <span style={{ cursor: 'pointer', fontFamily: 'var(--f-mono)' }}>[&#9664;]</span>
           <span style={{ fontFamily: 'var(--f-dot)', fontSize: 24, color: 'var(--red)' }}>
             0{activeIndex + 1} / 06
           </span>
           <span style={{ cursor: 'pointer', fontFamily: 'var(--f-mono)' }}>[&#9654;]</span>
        </div>
      </div>

      <div className="conveyor-belt-container">
        {/* The belt itself */}
        <div className="s-belt" style={{
          position: 'absolute',
          width: '100%',
          height: 120,
          bottom: 0,
          backgroundPosition: `${beltPosition}px 0`,
          borderTop: '2px solid #3C4046',
          borderBottom: '2px solid #3C4046',
          transform: 'rotateX(8deg)',
          transformOrigin: 'bottom center'
        }} />

        {/* Cards */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          bottom: 20,
          transform: `translateX(${beltPosition}px)`,
          willChange: 'transform'
        }}>
          {/* We'd normally repeat cards for infinite scroll, just drawing one set for now */}
          {projects.map((proj, i) => {
            const isActive = i === activeIndex;
            return (
              <div key={proj.id} className="s-steel" style={{
                width: 280, height: 360,
                marginRight: cardSpacing - 280,
                padding: 8,
                display: 'flex', flexDirection: 'column',
                boxShadow: isActive ? '0 0 0 2px var(--red)' : 'none',
                transition: 'box-shadow 0.3s'
              }}>
                <div style={{ flex: 1, backgroundColor: '#000', overflow: 'hidden', position: 'relative' }}>
                  {proj.img && <img src={proj.img} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isActive ? 'grayscale(0)' : 'grayscale(100%) opacity(0.5)', transition: 'filter 0.3s' }} />}
                </div>
                <div className="s-brass" style={{ marginTop: 8, padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#000', fontWeight: 'bold' }}>{proj.id}</span>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isActive ? 'var(--red)' : '#333' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--f-dot)', fontSize: 16, color: 'var(--ink-dim)' }}>
          {projects[activeIndex]?.title} &middot; {projects[activeIndex]?.year}
        </div>
      </div>
    </section>
  );
};

window.SceneProjects = SceneProjects;
