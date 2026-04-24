const SceneAbout = ({ progress }) => {
  // Local progress roughly 0 when fully in view, -1 when above, 1 when below
  const p = window.clamp(progress - 1, -1, 1);
  const opacity = 1 - Math.abs(p);
  const translateY = p * 100;

  const angleMult = progress * Math.PI * 4; // Arbitrary mult for visual speed

  // 4-stage gear reduction 27:1 total
  // Gear 0: 16t input
  // Gear 1: 48t stage 1 (ratio 3)
  // Gear 2: 16t stage 2 input (same shaft as 1)
  // Gear 3: 48t stage 2 (ratio 9)
  // Gear 4: 16t stage 3 input (same shaft as 3)
  // Gear 5: 48t output (ratio 27)

  const g0Angle = angleMult;
  const g1Angle = -g0Angle / 3;
  const g2Angle = g1Angle; // same shaft
  const g3Angle = -g2Angle / 3;
  const g4Angle = g3Angle; // same shaft
  const g5Angle = -g4Angle / 3;

  return (
    <section className="scene" id="scene-01" style={{ opacity, transform: `translate3d(0, ${translateY}vh, 0)` }}>
      <div className="split-layout">
        <div className="split-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="s-panel" style={{ padding: 16, width: '70%', maxWidth: 300, aspectRatio: '3/4', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="images/ElectronicCompartment.JPG"
              alt="Beckett Mazeau"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) sepia(10%)', display: 'block' }}
            />
          </div>
          <div className="s-brass" style={{ padding: '8px 24px', fontFamily: 'var(--f-mono)', fontSize: 12, color: '#000', fontWeight: 'bold' }}>
            B. MAZEAU &middot; EST. 2003
          </div>
        </div>

        <div className="split-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
          <h2 className="scene-heading" style={{ fontSize: 72 }}>ABOUT THE OPERATOR</h2>
          <div className="scene-body">
            <p style={{ marginBottom: 16 }}>
              [ABOUT COPY — 3 paragraphs, max 80 words each, written by Beckett] A mechanical and electrical engineer with a focus on systems that move. I build tangible interfaces, kinetic sculptures, and robust embedded hardware.
            </p>
            <p style={{ marginBottom: 16 }}>
              My workshop is a blend of traditional machining and modern digital fabrication. I believe that understanding how a tool is made dictates how it can be used.
            </p>
            <p>
              When I'm not designing PCBs or writing firmware, I'm usually at the lathe or milling machine. The physical world is the ultimate debugger.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            {['SOLIDWORKS', 'KICAD', 'PYTHON', 'C++', 'LVGL', 'LATHE'].map(tag => (
              <span key={tag} className="s-steel" style={{ padding: '6px 16px', borderRadius: 16, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#fff' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2D Gear Reduction Overlay at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35%', pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax meet">
          {/* Shafts (simplified lines) */}
          <line x1="100" y1="200" x2="900" y2="200" stroke="#3C4046" strokeWidth="6" />

          <g transform="translate(200, 200)">
            {/* Input Pinion */}
            <g transform={`rotate(${(g0Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 16, module: 5, pressureAngle: 20 })} fill="#C8A24A" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill="#14161A" />
              <line x1="0" y1="0" x2="0" y2="-30" stroke="#FF2D2D" strokeWidth="3" />
            </g>
          </g>

          <g transform="translate(360, 200)">
            {/* Stage 1 Gear */}
            <g transform={`rotate(${(g1Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 48, module: 5, pressureAngle: 20 })} fill="#C8A24A" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="20" fill="#14161A" />
              <line x1="0" y1="0" x2="0" y2="-110" stroke="#FF2D2D" strokeWidth="3" />
            </g>
            {/* Stage 2 Pinion (drawn on top, same rotation) */}
            <g transform={`rotate(${(g2Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 16, module: 5, pressureAngle: 20 })} fill="#7A5E1F" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill="#0B0C0E" />
            </g>
          </g>

          <g transform="translate(520, 200)">
            {/* Stage 2 Gear */}
             <g transform={`rotate(${(g3Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 48, module: 5, pressureAngle: 20 })} fill="#C8A24A" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="20" fill="#14161A" />
              <line x1="0" y1="0" x2="0" y2="-110" stroke="#FF2D2D" strokeWidth="3" />
            </g>
            {/* Stage 3 Pinion */}
            <g transform={`rotate(${(g4Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 16, module: 5, pressureAngle: 20 })} fill="#7A5E1F" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill="#0B0C0E" />
            </g>
          </g>

          <g transform="translate(680, 200)">
            {/* Output Gear */}
            <g transform={`rotate(${(g5Angle * 180) / Math.PI})`}>
              <path d={window.gearPath({ teeth: 48, module: 5, pressureAngle: 20 })} fill="#C8A24A" stroke="#14161A" strokeWidth="2" />
              <circle cx="0" cy="0" r="20" fill="#14161A" />
              <line x1="0" y1="0" x2="0" y2="-110" stroke="#FF2D2D" strokeWidth="3" />
            </g>
          </g>

        </svg>
      </div>
    </section>
  );
};

window.SceneAbout = SceneAbout;
