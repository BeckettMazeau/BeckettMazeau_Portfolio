const ShaftOverlay = ({ progress }) => {
  // We'll populate this later with the physical handoffs spanning scenes
  // For the initial build, we will simulate the physical connections visually.
  // 0 -> 1: Drive Belt
  // 1 -> 2: Shaft / Cam connection
  // 2 -> 3: Chain
  // 3 -> 4: Shaft
  // 4 -> 5: Tag Conveyor

  // Opacity of handoff elements depend on the progress between specific scenes

  const beltOpacity = window.clamp(1 - Math.abs(progress - 0.5) * 2, 0, 1);
  const shaftOpacity1 = window.clamp(1 - Math.abs(progress - 1.5) * 2, 0, 1);
  const chainOpacity = window.clamp(1 - Math.abs(progress - 2.5) * 2, 0, 1);
  const shaftOpacity2 = window.clamp(1 - Math.abs(progress - 3.5) * 2, 0, 1);
  const conveyorOpacity = window.clamp(1 - Math.abs(progress - 4.5) * 2, 0, 1);

  return (
    <div className="shaft-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}>
      {/* 0 -> 1 Belt */}
      <div style={{ position: 'absolute', right: '10%', top: '45%', width: 200, height: 200, opacity: beltOpacity }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
           <path d="M 0 0 Q 100 100 200 200" fill="none" stroke="#17181A" strokeWidth="8" strokeDasharray="12 4" />
        </svg>
      </div>

      {/* 1 -> 2 Shaft */}
      <div style={{ position: 'absolute', right: '40%', top: '50%', width: 100, height: 200, opacity: shaftOpacity1 }}>
        <div style={{ width: 10, height: '100%', background: 'linear-gradient(90deg, #3C4046, #8A8F97, #3C4046)' }} />
      </div>

      {/* 2 -> 3 Chain */}
      <div style={{ position: 'absolute', left: '20%', top: '50%', width: 100, height: 200, opacity: chainOpacity }}>
         <svg width="100%" height="100%" viewBox="0 0 100 200">
           <path d="M 50 0 L 50 200" fill="none" stroke="#8A8F97" strokeWidth="4" strokeDasharray="8 4" />
        </svg>
      </div>

      {/* 3 -> 4 Shaft */}
      <div style={{ position: 'absolute', right: '20%', top: '45%', width: 100, height: 200, opacity: shaftOpacity2 }}>
        <div style={{ width: 10, height: '100%', background: 'linear-gradient(90deg, #3C4046, #8A8F97, #3C4046)', marginLeft: 'auto' }} />
      </div>

      {/* 4 -> 5 Conveyor */}
      <div style={{ position: 'absolute', right: '25%', top: '45%', width: 40, height: 200, opacity: conveyorOpacity }}>
         <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(0deg, #17181A 0 9px, rgba(0,0,0,0.5) 9px 12px)' }} />
      </div>
    </div>
  );
};

window.ShaftOverlay = ShaftOverlay;
