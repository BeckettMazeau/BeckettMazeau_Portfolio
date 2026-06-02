/* Beckett Mazeau portfolio — 3 home-page directions.
   NOTE: card copy is PLACEHOLDER for layout review — real writeups slot in later. */

const IMG = {
  enote: "uploads/stik-enote-render.png",
  solar: "uploads/solar_energy_vs_tilt_graph.png",
  trough: "uploads/InternalWideShot.JPG",
  control: "uploads/ElectronicCompartment.JPG",
  schematic: "uploads/StikE_Schematic_page-0002.jpg",
  calendar: "uploads/CalendarMonthView.JPG",
};

/* ---------- DIRECTION A — Editorial Index (light) ---------- */
function DirA() {
  return (
    <div className="dir dir-a">
      <div className="wrap">
        <nav className="nav">
          <div className="brand">Beckett Mazeau</div>
          <div className="links">
            <a className="active" href="#">Work</a>
            <a href="#">About</a>
            <a href="#">Updates</a>
            <span className="toggle" title="Theme">◐</span>
          </div>
        </nav>

        <header className="hero">
          <div className="meta-row eyebrow">
            <span>Focus<span className="k">Mechatronics</span></span>
            <span>Based<span className="k">Houston, TX</span></span>
            <span>Status<span className="k">Open to roles</span></span>
          </div>
          <h1>Beckett<br/>Mazeau</h1>
          <p>Mechanical, aerospace, and embedded engineering — designed, built,
            and tested end to end. Selected work below.</p>
        </header>

        <div className="section-head">
          <span className="eyebrow label">Selected Work — 04</span>
          <a className="all" href="#">All projects ↗</a>
        </div>

        <div className="grid">
          <article className="card contain">
            <div className="frame"><img src={IMG.enote} alt="STIK eNote"/></div>
            <div className="row"><span className="num mono">01</span><h3>STIK eNote</h3>
              <span className="rl mono">Firmware + ID<br/>2026</span></div>
            <p className="summary">Pocket e-paper task companion — custom PCB, power tree, and UI firmware.</p>
          </article>
          <article className="card contain">
            <div className="frame"><img src={IMG.solar} alt="Orbital solar study"/></div>
            <div className="row"><span className="num mono">02</span><h3>Orbital Solar Study</h3>
              <span className="rl mono">Systems analysis<br/>2025</span></div>
            <p className="summary">Modeling collected solar energy across satellite orbital tilt regimes.</p>
          </article>
          <article className="card">
            <div className="frame"><img src={IMG.trough} alt="Thermal trough"/></div>
            <div className="row"><span className="num mono">03</span><h3>Directional Trough</h3>
              <span className="rl mono">Mechanical + thermal<br/>2025</span></div>
            <p className="summary">A 2.4 m insulated casting trough for controlled directional solidification.</p>
          </article>
          <article className="card">
            <div className="frame"><img src={IMG.control} alt="Embedded control stack"/></div>
            <div className="row"><span className="num mono">04</span><h3>Embedded Control Stack</h3>
              <span className="rl mono">Electronics + controls<br/>2024</span></div>
            <p className="summary">Motor driver and sensing stack wired and tuned on an Arduino core.</p>
          </article>
        </div>

        <section className="updates">
          <div className="section-head" style={{padding:"0 0 18px"}}>
            <span className="eyebrow label">Latest Updates</span>
          </div>
          <div className="ulist">
            <div className="urow"><span className="ud mono">May 18, 2026</span>
              <span className="ut">Bring-up of the STIK power board</span><span className="ua">↗</span></div>
            <div className="urow"><span className="ud mono">Apr 02, 2026</span>
              <span className="ut">Trough thermal test #3 — results</span><span className="ua">↗</span></div>
          </div>
        </section>

        <footer className="foot">
          <div className="big">Let's build something<br/><span className="em">real.</span></div>
          <div className="c mono">beckett@example.com<br/>GitHub ↗ · LinkedIn ↗<br/>© 2026</div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- DIRECTION B — Product Grid (dark) ---------- */
function DirB() {
  return (
    <div className="dir dir-b">
      <div className="wrap">
        <nav className="nav">
          <div className="brand"><span className="dot"></span>Beckett Mazeau</div>
          <div className="links">
            <a className="active" href="#">Work</a>
            <a href="#">About</a>
            <a href="#">Updates</a>
            <span className="toggle" title="Theme" style={{color:"var(--muted)",fontSize:14}}>◑</span>
            <a className="cta" href="#">Get in touch</a>
          </div>
        </nav>

        <header className="hero">
          <div>
            <span className="status mono"><span className="led"></span>Available for engineering roles</span>
            <h1>Beckett Mazeau<span className="tag">Making Mechatronics</span></h1>
            <p>Mechanical · aerospace · embedded. I take hardware from schematic
              to soldered, tested, and shipped.</p>
            <div className="actions">
              <a className="btn primary" href="#">View work</a>
              <a className="btn ghost" href="#">About me</a>
            </div>
          </div>
          <aside className="spec">
            <div className="sh mono"><span>// skills</span></div>
            <div className="srow"><span>Mechanical design</span><span className="v">CAD · FEA</span></div>
            <div className="srow"><span>Embedded systems</span><span className="v">C · RTOS</span></div>
            <div className="srow"><span>PCB + power</span><span className="v">KiCad</span></div>
            <div className="srow"><span>Aerospace analysis</span><span className="v">MATLAB</span></div>
          </aside>
        </header>

        <div className="section-head">
          <span className="eyebrow label">Selected work <b>/ 04</b></span>
          <a className="all" href="#">All projects →</a>
        </div>

        <div className="grid">
          <article className="card contain">
            <div className="frame"><img src={IMG.enote} alt="STIK eNote"/></div>
            <div className="body"><div className="top mono"><span className="num">01</span><span>2026</span></div>
              <h3>STIK eNote</h3><p>Pocket e-paper task companion — PCB, power tree, UI firmware.</p></div>
          </article>
          <article className="card contain">
            <div className="frame"><img src={IMG.solar} alt="Orbital solar study"/></div>
            <div className="body"><div className="top mono"><span className="num">02</span><span>2025</span></div>
              <h3>Orbital Solar Study</h3><p>Solar energy collected across satellite orbital tilt regimes.</p></div>
          </article>
          <article className="card">
            <div className="frame"><img src={IMG.control} alt="Control stack"/></div>
            <div className="body"><div className="top mono"><span className="num">03</span><span>2024</span></div>
              <h3>Embedded Control Stack</h3><p>Motor driver and sensing stack on an Arduino core.</p></div>
          </article>
          <article className="card">
            <div className="frame"><img src={IMG.trough} alt="Thermal trough"/></div>
            <div className="body"><div className="top mono"><span className="num">04</span><span>2025</span></div>
              <h3>Directional Trough</h3><p>2.4 m insulated trough for directional solidification.</p></div>
          </article>
        </div>

        <section className="updates">
          <div className="section-head" style={{padding:"0 0 10px"}}>
            <span className="eyebrow label">Latest updates</span>
          </div>
          <div className="urow"><span className="ud mono">2026.05.18</span>
            <span className="ut">Bring-up of the STIK power board</span><span className="ua">→</span></div>
          <div className="urow"><span className="ud mono">2026.04.02</span>
            <span className="ut">Trough thermal test #3 — results</span><span className="ua">→</span></div>
        </section>

        <footer className="foot">
          <div className="big">Let's build something <span className="em">real.</span></div>
          <div className="c mono">beckett@example.com<br/>GitHub ↗ · LinkedIn ↗<br/>© 2026</div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- DIRECTION C — Big Type / Asymmetric (light bold) ---------- */
function DirC() {
  return (
    <div className="dir dir-c">
      <div className="wrap">
        <nav className="nav">
          <div className="brand">BECKETT MAZEAU</div>
          <div className="links">
            <a href="#">Work</a><a href="#">About</a><a href="#">Updates</a>
            <span className="toggle">◐</span>
          </div>
        </nav>

        <header className="hero">
          <div className="label-row eyebrow"><span>Engineer · Mechatronics</span><span>Portfolio — 2026</span></div>
          <h1>Making<span className="l2"><em>Mechatronics.</em></span></h1>
          <div className="sub">
            <p>Mechanical, aerospace, and embedded engineering — built and tested
              by hand. The work speaks first.</p>
            <div className="by">By <b>Beckett Mazeau</b><br/>Houston, TX · open to roles</div>
          </div>
        </header>

        <div className="rule"></div>
        <div className="section-head">
          <span className="eyebrow label">Selected Work</span>
          <a className="all" href="#">All 6 projects ↗</a>
        </div>

        <article className="feature">
          <div className="frame"><img src={IMG.enote} alt="STIK eNote" style={{objectFit:"contain",padding:"40px"}}/></div>
          <div className="info">
            <span className="pill">Featured</span>
            <h3>STIK eNote</h3>
            <div className="meta mono"><span>Firmware + ID</span><span>2026</span></div>
            <p>A pocket e-paper task companion. Custom PCB and power tree, lid-switch
              wake, and a calendar/task UI written from the display driver up.</p>
            <div className="more">Read case study <span className="arr">→</span></div>
          </div>
        </article>

        <div className="row3">
          <article className="rcard">
            <span className="rnum">02</span>
            <div className="rframe"><img src={IMG.solar} alt="Solar study"/></div>
            <h4>Orbital Solar Study</h4>
            <div className="rmeta mono">Systems analysis · 2025</div>
          </article>
          <article className="rcard">
            <span className="rnum">03</span>
            <div className="rframe"><img src={IMG.trough} alt="Thermal trough"/></div>
            <h4>Directional Trough</h4>
            <div className="rmeta mono">Mechanical + thermal · 2025</div>
          </article>
          <article className="rcard">
            <span className="rnum">04</span>
            <div className="rframe"><img src={IMG.control} alt="Control stack"/></div>
            <h4>Embedded Control Stack</h4>
            <div className="rmeta mono">Electronics + controls · 2024</div>
          </article>
        </div>

        <section className="updates">
          <div className="section-head" style={{padding:"36px 0 14px"}}>
            <span className="eyebrow label">Latest Updates</span>
          </div>
          <div className="urow"><span className="ud mono">May 18, 2026</span>
            <span className="ut">Bring-up of the STIK power board</span><span className="ua">↗</span></div>
          <div className="urow"><span className="ud mono">Apr 02, 2026</span>
            <span className="ut">Trough thermal test #3 — results</span><span className="ua">↗</span></div>
        </section>

        <footer className="foot">
          <div className="big">Build<br/>something <em>real.</em></div>
          <div className="c mono">beckett@example.com<br/>GitHub ↗ · LinkedIn ↗<br/>© 2026</div>
        </footer>
      </div>
    </div>
  );
}

Object.assign(window, { DirA, DirB, DirC });
