const { useState, useEffect, useRef } = React;
const THREE = window.THREE;

const SceneContact = ({ progress }) => {
  const p = window.clamp(progress - 5, -1, 1);
  const opacity = 1 - Math.abs(p);
  const translateY = p * 100;

  const mountRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const cartridgeRef = useRef(null);
  const gaugeNeedleRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = window.makeRenderer(document.createElement('canvas'), { w, h });
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    window.makeStandardRig(scene);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

    // Tube
    const tubeGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 32, 1, true);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      metalness: 0,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.1,
      transparent: true,
      side: THREE.DoubleSide
    });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(tube);

    // Fittings
    const fittingGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 32);
    const topFitting = new THREE.Mesh(fittingGeom, window.MAT.brassDark);
    topFitting.position.y = 1.4;
    scene.add(topFitting);

    const bottomFitting = new THREE.Mesh(fittingGeom, window.MAT.brassDark);
    bottomFitting.position.y = -1.4;
    scene.add(bottomFitting);

    // Cartridge
    const cartridgeGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.8, 32);
    const cartridge = new THREE.Mesh(cartridgeGeom, window.MAT.steel);
    cartridge.position.y = -1; // Starting resting position
    scene.add(cartridge);
    cartridgeRef.current = cartridge;

    // Red bands on cartridge
    const bandGeom = new THREE.CylinderGeometry(0.285, 0.285, 0.05, 32);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xFF2D2D });
    const band1 = new THREE.Mesh(bandGeom, bandMat);
    band1.position.y = 0.3;
    cartridge.add(band1);
    const band2 = new THREE.Mesh(bandGeom, bandMat);
    band2.position.y = -0.3;
    cartridge.add(band2);

    let reqId;
    let animStart = 0;

    const animate = (time) => {
      // Logic for sending animation
      if (isSending) {
        if (!animStart) animStart = time;
        const dt = (time - animStart) / 1000;

        // Shoot up at ~4 m/s (approx 4 units per second)
        cartridgeRef.current.position.y = -1 + (dt * 4);

        if (dt > 1.6) {
          // Reset and drop a new one
          cartridgeRef.current.position.y = -1;
          animStart = 0;
          setIsSending(false);
        }
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (mountRef.current && mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      renderer.dispose();
    };
  }, [isSending]);

  const handleSend = () => {
    if (isSending) return;
    setIsSending(true);
  };

  return (
    <section className="scene" id="scene-05" style={{ opacity, transform: `translate3d(0, ${translateY}vh, 0)` }}>
      <div style={{ position: 'absolute', top: '20%', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'var(--f-disp)', fontSize: 160, lineHeight: 0.9 }}>
          SEND A <span style={{ color: 'var(--red)' }}>SIGNAL</span>
        </h1>
        <p style={{ marginTop: 24, fontSize: 16, color: 'var(--ink-dim)' }}>
          Got a project that needs a mind? Drop an address, pull the lever.
        </p>

        <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center' }}>
          <div className="s-steel" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', height: 48, width: 520, borderRadius: '4px 0 0 4px' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--ink-mute)', marginRight: 16 }}>ADDRESS</span>
            <input type="text" placeholder="..." style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontFamily: 'var(--f-body)', fontSize: 16, width: '100%', outline: 'none' }} />
          </div>
          <button
            className="btn-primary"
            style={{ height: 48, borderRadius: '0 4px 4px 0', width: 120, fontSize: 14, boxShadow: isSending ? 'inset 0 4px 8px rgba(0,0,0,0.4)' : 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
            onClick={handleSend}
          >
            [ SEND ]
          </button>
        </div>
      </div>

      {/* 3D Tube Container - absolutely positioned on the right */}
      <div ref={mountRef} style={{ position: 'absolute', right: '5%', top: '15%', width: '30%', height: '70%', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--ink-dim)' }}>LINKEDIN</span>
          <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--steel-dark)' }}>in/beckett</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--ink-dim)' }}>GITHUB</span>
          <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--steel-dark)' }}>github.com/BeckettMazeau</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--ink-dim)' }}>EMAIL</span>
          <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--steel-dark)' }}>beckett@beckett.dev</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--ink-dim)' }}>LOCATION</span>
          <span style={{ borderBottom: '1px solid var(--steel-dark)' }}>Houston, TX</span>
        </div>
      </div>
    </section>
  );
};

window.SceneContact = SceneContact;
