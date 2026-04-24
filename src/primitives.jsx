/* global React */

const { useEffect, useRef, useState, useCallback } = React;

function useWeightedPager(total) {
  const [progress, setProgress] = useState(0);
  const progRef = useRef(0);
  const targetRef = useRef(0);
  const velRef = useRef(0);
  const lastInputT = useRef(0);

  // single global rAF (with setInterval fallback when tab is backgrounded)
  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    let interval = 0;

    const step = (nowT) => {
      const t = nowT ?? performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (t - last) / 1000));
      last = t;
      const k = 280, d = 34;
      const diff = targetRef.current - progRef.current;
      const a = k * diff - d * velRef.current;
      velRef.current += a * dt;
      progRef.current += velRef.current * dt;
      // snap to rest
      if (Math.abs(diff) < 0.08 && Math.abs(velRef.current) < 0.8) {
        progRef.current = targetRef.current;
        velRef.current = 0;
      }
      if (progRef.current < 0) { progRef.current = 0; velRef.current = 0; }
      if (progRef.current > total - 1) { progRef.current = total - 1; velRef.current = 0; }
      setProgress(progRef.current);
    };
    const tick = (t) => { step(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    // safety net so motion continues if tab is backgrounded / rAF throttled
    interval = setInterval(() => step(), 1000 / 30);

    return () => { cancelAnimationFrame(raf); clearInterval(interval); };
  }, [total]);

  const goTo = useCallback((idx) => {
    targetRef.current = Math.max(0, Math.min(total - 1, idx));
  }, [total]);

  const nudge = useCallback((dir) => {
    const t = performance.now();
    if (t - lastInputT.current < 260) return;
    lastInputT.current = t;
    const snapped = Math.round(targetRef.current);
    targetRef.current = Math.max(0, Math.min(total - 1, snapped + dir));
  }, [total]);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 2) return;
      nudge(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e) => {
      if (['ArrowDown','PageDown',' '].includes(e.key)) { e.preventDefault(); nudge(1); }
      else if (['ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); nudge(-1); }
      else if (e.key === 'Home') { targetRef.current = 0; }
      else if (e.key === 'End') { targetRef.current = total - 1; }
    };
    let ty = 0, active = false;
    const ts = (e) => { ty = e.touches[0].clientY; active = true; };
    const tm = (e) => { if (!active) return; const dy = ty - e.touches[0].clientY; if (Math.abs(dy) > 60) { nudge(dy > 0 ? 1 : -1); active = false; } };
    const te = () => { active = false; };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', ts, { passive: true });
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('touchend', te);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', te);
    };
  }, [nudge, total]);

  return { progress, goTo, nudge };
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function localOf(progress, n) { return clamp(progress - n, -1.2, 1.2); }

Object.assign(window, { useWeightedPager, clamp, lerp, smoothstep, localOf });
