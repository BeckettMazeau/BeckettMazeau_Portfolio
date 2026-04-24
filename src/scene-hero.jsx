const { useEffect, useRef, useState } = React;
const THREE = window.THREE;

const SceneHero = ({ progress, velocity }) => {
  const mountRef = useRef(null);
  const flywheelRef = useRef(null);
  const crankAngleRef = useRef(0);
  const [bootText, setBootText] = useState("> COLD START ................ OK\n> SPIN UP ................... 0.8 rad/s\n> SCROLL TO DRIVE THE SHAFT\n> _");

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = window.makeRenderer(document.createElement('canvas'), { w, h });
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    window.makeStandardRig(scene);

    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    camera.position.set(0.6, 0.2, 3.2);
    camera.lookAt(0, 0, 0);

    // Ground
    const groundGeom = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 1 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pedestal
    const pedestalGeom = new THREE.BoxGeometry(0.8, 0.25, 0.5);
    const pedestal = new THREE.Mesh(pedestalGeom, window.MAT.steelDark);
    pedestal.position.y = -0.5;
    pedestal.receiveShadow = true;
    pedestal.castShadow = true;
    scene.add(pedestal);

    // Flywheel
    const flywheel = window.makeFlywheel(0.55);
    flywheel.position.set(0, 0, 0);
    flywheel.castShadow = true;
    scene.add(flywheel);
    flywheelRef.current = flywheel;

    // Crank arm
    const crankGeom = new THREE.BoxGeometry(0.35, 0.06, 0.06);
    // Move origin to end of crank
    crankGeom.translate(0.175, 0, 0);
    const crank = new THREE.Mesh(crankGeom, window.MAT.brass);
    crank.position.set(0, 0, 0.1);
    flywheel.add(crank);

    // Crank grip
    const gripGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16);
    gripGeom.rotateX(Math.PI / 2);
    const grip = new THREE.Mesh(gripGeom, window.MAT.brass);
    grip.position.set(0.35, 0, 0.1);
    crank.add(grip);

    // Red stripe on grip
    const stripeGeom = new THREE.CylinderGeometry(0.041, 0.041, 0.02, 16);
    stripeGeom.rotateX(Math.PI / 2);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFF2D2D });
    const stripe = new THREE.Mesh(stripeGeom, stripeMat);
    stripe.position.set(0.35, 0, 0.1);
    crank.add(stripe);

    let reqId;
    let lastTime = performance.now();

    const animate = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const omega = window.clamp(0.8 + 1.4 * Math.abs(velocity), 0.6, 6);
      crankAngleRef.current += omega * dt;

      if (flywheelRef.current) {
        flywheelRef.current.rotation.z = -crankAngleRef.current;
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
  }, []);

  // Opacity fade based on scroll
  const opacity = 1 - window.smoothstep(0, 0.8, progress);

  return (
    <section className="scene" id="scene-00" style={{ opacity }}>
      <div className="hero-content">
        <h1 className="hero-name">
          BECKETT<br />MAZEAU
        </h1>
        <div className="hero-underscore" />
        <div className="hero-label">MECHANICAL / ELECTRICAL / SYSTEMS</div>

        <pre className="hero-boot">{bootText}</pre>

        <button className="btn-primary" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown'}))}>
          [ENGAGE] &darr;
        </button>
      </div>

      <div className="split-layout" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div className="split-left" />
        <div className="split-right" ref={mountRef} />
      </div>
    </section>
  );
};

window.SceneHero = SceneHero;
