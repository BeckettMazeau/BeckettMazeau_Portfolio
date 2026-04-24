/* global React, localOf, clamp */

const { useEffect, useRef, useState } = React;

/* Contact: a lever you can press, which pulls a cable over a pulley,
   which raises a flag with "HELLO". Also serves as the CTA. */
function PulleyLever({ progress, pressed }) {
  // lever angle: 0 idle, 1 pressed
  const [hover, setHover] = useState(0);
  const engage = Math.max(pressed ? 1 : 0, hover);
  const ang = -engage * 22;
  const cable = 120 - engage * 60;

  return (
    <svg viewBox="0 0 520 260" preserveAspectRatio="xMidYMid meet"
         style={{width:'100%', maxWidth:520, height:'auto'}}
         onMouseMove={(e) => {
           const r = e.currentTarget.getBoundingClientRect();
           const x = (e.clientX - r.left) / r.width;
           if (x < .3) setHover(.4);
         }}
         onMouseLeave={() => setHover(0)}>
      <g className="mech-soft"><rect x="10" y="10" width="500" height="240" /></g>

      {/* lever fulcrum */}
      <g transform="translate(110 180)">
        <circle r="6" fill="var(--ink)" />
        <g transform={`rotate(${ang})`}>
          <line x1="-60" y1="0" x2="80" y2="0" stroke="var(--ink)" strokeWidth="3" />
          <rect x="-70" y="-8" width="14" height="16" fill="var(--accent)" />
          <circle cx="80" cy="0" r="4" fill="var(--ink)" />
        </g>
      </g>

      {/* pulley */}
      <g transform="translate(330 70)">
        <circle r="22" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
        <g transform={`rotate(${engage * 120})`}>
          <line x1="0" y1="-22" x2="0" y2="-14" stroke="var(--ink)" strokeWidth="1.25" />
          <line x1="0" y1="22" x2="0" y2="14" stroke="var(--ink)" strokeWidth="1.25" />
          <circle r="3" fill="var(--accent)" />
        </g>
      </g>

      {/* cable from lever tip up over pulley down to flag */}
      <path d={`M 190 180 Q 260 140 330 70 L 330 ${70 + cable}`} className="mech-stroke" strokeDasharray="2 3" />

      {/* flag mast */}
      <line x1="440" y1="200" x2="440" y2={70 + cable + 20} className="mech-stroke" strokeWidth="2" />
      {/* flag */}
      <g transform={`translate(440 ${70 + cable + 20})`}>
        <rect x="0" y="-24" width="60" height="24" fill="var(--accent)" />
        <text x="30" y="-8" fontFamily="var(--f-dot)" fontSize="12" fill="var(--paper)" textAnchor="middle">HELLO</text>
      </g>
      <line x1="440" y1="70" x2="440" y2="200" className="mech-soft" />

      <text x="20" y="250" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="2">
        FIG-06 · LEVER + PULLEY · GO AHEAD, PULL IT
      </text>
    </svg>
  );
}

function SceneContact({ progress }) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (!pressed) return;
    const t = setTimeout(() => setPressed(false), 1400);
    return () => clearTimeout(t);
  }, [pressed]);
  return (
    <section className="scene contact">
      <div className="sect-label">05 · CONTACT</div>
      <div className="frame">
        <div className="big">
          <div className="eyebrow" style={{marginBottom:18}}>LET'S BUILD SOMETHING</div>
          <h2 className="display">
            Got a <em>mechanism</em> in mind? Let's talk about it.
          </h2>

          <div style={{marginTop:28}} onClick={() => setPressed(true)}>
            <PulleyLever progress={progress} pressed={pressed} />
          </div>

          <div className="cta-row">
            <a className="cta primary" href="https://www.linkedin.com/in/beckett-mazeau/" target="_blank" rel="noreferrer">
              Connect on LinkedIn →
            </a>
            <a className="cta" href="mailto:hello@beckettmazeau.com">
              hello@beckettmazeau.com
            </a>
          </div>
        </div>

        <div className="foot">
          <div>
            <h4>Elsewhere</h4>
            <a href="https://github.com/BeckettMazeau" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://grabcad.com/beckett.mazeau-1" target="_blank" rel="noreferrer">GrabCAD</a>
            <a href="https://www.linkedin.com/in/beckett-mazeau/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <div>
            <h4>Tools</h4>
            <div>SolidWorks · Fusion 360</div>
            <div>KiCad · Altium</div>
            <div>C / C++ / Python</div>
          </div>
          <div>
            <h4>Located</h4>
            <div>Houston, TX</div>
            <div>Open to remote</div>
          </div>
          <div style={{textAlign:'right'}}>
            <h4>Colophon</h4>
            <div>Space Grotesk</div>
            <div>DSEG14 Classic</div>
            <div>Built by hand, 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SceneContact = SceneContact;
