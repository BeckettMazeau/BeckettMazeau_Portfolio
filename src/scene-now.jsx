const { useEffect, useRef } = React;
const THREE = window.THREE;

const SceneNow = ({ progress }) => {
  const mountRef = useRef(null);
  const p = window.clamp(progress - 2, -1, 1);
  const opacity = 1 - Math.abs(p);
  const translateY = p * 100;

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = window.makeRenderer(document.createElement('canvas'), { w, h });
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    window.makeStandardRig(scene);

    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(2, 1, 3);
    camera.lookAt(0, 0.2, 0);

    // Stage
    const stageGeom = new THREE.BoxGeometry(2, 0.1, 1.5);
    const stageMesh = new THREE.Mesh(stageGeom, window.MAT.brassDark);
    stageMesh.position.y = -0.5;
    stageMesh.receiveShadow = true;
    scene.add(stageMesh);

    // Basic representation of STIK-eNote Device
    const deviceGroup = new THREE.Group();
    deviceGroup.position.set(0.2, -0.45, 0);
    scene.add(deviceGroup);

    // Base slab
    const baseGeom = new THREE.BoxGeometry(0.8, 0.1, 0.6);
    const base = new THREE.Mesh(baseGeom, window.MAT.steelDark);
    base.position.y = 0.05;
    deviceGroup.add(base);

    // Lid (clamshell)
    const lidGroup = new THREE.Group();
    // Hinge at far edge (z = -0.3)
    lidGroup.position.set(0, 0.1, -0.3);
    deviceGroup.add(lidGroup);

    const lidGeom = new THREE.BoxGeometry(0.8, 0.05, 0.6);
    lidGeom.translate(0, 0.025, 0.3); // offset so it rotates around hinge
    const lid = new THREE.Mesh(lidGeom, window.MAT.painted);
    lidGroup.add(lid);

    // Screen (simple plane on lid)
    const screenGeom = new THREE.PlaneGeometry(0.6, 0.4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.rotation.x = -Math.PI / 2;
    screen.position.set(0, 0.051, 0.3);
    lidGroup.add(screen);

    // Cam
    const camShape = new THREE.Shape();
    camShape.moveTo(0, 0.2);
    camShape.quadraticCurveTo(0.2, 0.2, 0.25, 0);
    camShape.quadraticCurveTo(0.2, -0.2, 0, -0.2);
    camShape.quadraticCurveTo(-0.2, -0.2, -0.2, 0);
    camShape.quadraticCurveTo(-0.2, 0.2, 0, 0.2);

    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const camGeom = new THREE.ExtrudeGeometry(camShape, extrudeSettings);
    camGeom.translate(0, 0, -0.05); // center depth
    const cam = new THREE.Mesh(camGeom, window.MAT.steel);
    cam.position.set(-0.6, -0.2, 0);
    scene.add(cam);

    // Follower Rod
    const rodGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const rod = new THREE.Mesh(rodGeom, window.MAT.steel);
    rod.position.set(-0.6, 0.2, 0);
    scene.add(rod);

    // Connection from rod to lid (simplified)
    const linkGeom = new THREE.BoxGeometry(0.4, 0.02, 0.02);
    const link = new THREE.Mesh(linkGeom, window.MAT.steel);
    link.position.set(-0.4, 0.6, 0.3);
    scene.add(link);

    let reqId;

    const animate = () => {
      // Use global progress from React closure
      const scrollVal = document.documentElement.scrollTop / window.innerHeight; // rough fallback or we could use a ref

      // Since progress is a prop, we animate it based on that
      // For smooth idle, let's just add a small time component
      const time = performance.now() / 1000;
      // output of scene 01 / 27
      const camAngle = (progress * Math.PI * 4) / 27 + time * 0.5;

      cam.rotation.z = -camAngle;

      // Calculate follower height based on cam profile (very simplified physics)
      // Base radius 0.2, eccentric up to 0.25
      const followerLift = 0.2 + 0.05 * Math.sin(camAngle);

      rod.position.y = -0.2 + followerLift + 0.4; // offset + rod half height
      link.position.y = rod.position.y + 0.4;

      // Drive lid angle
      const lidAngle = window.lerp(0, 28 * (Math.PI / 180), (followerLift - 0.2) / 0.05);
      lidGroup.rotation.x = lidAngle;

      // Snap closed logic (overshoot) could be added here if needed,
      // but lerp gives a smooth enough motion for the prototype.

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
  }, [progress]); // Re-bind if progress was strictly needed inside, but usually we use a ref for continuous

  return (
    <section className="scene" id="scene-02" style={{ opacity, transform: `translate3d(0, ${translateY}vh, 0)` }}>
      <div className="split-layout">
        <div className="split-left" ref={mountRef} style={{ position: 'relative' }}>
          {/* 3D Canvas goes here */}
          <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', fontFamily: 'var(--f-dot)', fontSize: 18, color: 'var(--amber)', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', border: '1px solid var(--amber)' }}>
            12 RPM
          </div>
        </div>
        <div className="split-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="scene-heading" style={{ fontSize: 64 }}>NOW &middot; STIK-eNote</h2>
          <div className="scene-body" style={{ color: 'var(--amber)', fontFamily: 'var(--f-mono)', marginBottom: 24, fontSize: 14 }}>
            Prototype rev C &middot; integrating LVGL UI
          </div>
          <div className="scene-body">
            A pocketable e-paper task tracker. Clamshell housing, dual OLED + TFT display, LVGL UI on an ESP32-S3.
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
              {[
                'Custom PCB, 4-layer, 0.8mm',
                'Lid-closed power gating via hall sensor',
                'Li-Po + USB-C, 14 days standby',
                'LVGL 9.2 on a 240×320 TFT',
                'Mechanical keyboard, low-profile',
                'Designed in SolidWorks, machined shell'
              ].map(bullet => (
                <li key={bullet} style={{ marginBottom: 8, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--red)' }}>&middot;</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 32 }}>
            <button className="btn-primary" style={{ width: 200 }}>
              [INSPECT PROJECT] &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

window.SceneNow = SceneNow;
