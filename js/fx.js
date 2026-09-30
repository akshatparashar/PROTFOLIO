/* =====================================================================
   FX.JS — background canvas: silk ribbons, dust, embers, sparks.
   ===================================================================== */
window.FX = (() => {
  const cv = document.getElementById("fx");
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, DPR = 1, t = 0, raf = 0, on = true, last = 0;
  let cfg = { ribbons: 0, color: [212, 178, 106], particles: 40, pcolor: [255, 255, 255], rise: 0.2, angle: -0.42, alpha: 0.5 };
  let target = { ...cfg };
  let parts = [];

  const THEMES = {
    lobby:       { ribbons: 7, color: [214, 176, 96], particles: 55, pcolor: [255, 214, 140], rise: 0.25, angle: -0.5, alpha: 0.55 },
    about:       { ribbons: 8, color: [226, 186, 104], particles: 45, pcolor: [255, 224, 160], rise: 0.2, angle: 0.35, alpha: 0.5 },
    store:       { ribbons: 3, color: [110, 160, 220], particles: 35, pcolor: [170, 210, 255], rise: 0.15, angle: -0.6, alpha: 0.25 },
    progression: { ribbons: 3, color: [90, 150, 220], particles: 35, pcolor: [160, 200, 255], rise: 0.15, angle: -0.35, alpha: 0.25 },
    career:      { ribbons: 3, color: [90, 150, 220], particles: 30, pcolor: [160, 200, 255], rise: 0.15, angle: 0.4, alpha: 0.22 },
    collection:  { ribbons: 2, color: [110, 150, 210], particles: 30, pcolor: [160, 200, 255], rise: 0.12, angle: -0.3, alpha: 0.2 },
    process:     { ribbons: 0, color: [200, 160, 100], particles: 120, pcolor: [230, 190, 130], rise: 0.35, angle: 0, alpha: 0.3 },
    agents:      { ribbons: 4, color: [200, 130, 255], particles: 70, pcolor: [230, 200, 255], rise: 0.3, angle: -0.2, alpha: 0.35 },
    nightmarket: { ribbons: 3, color: [255, 70, 85], particles: 80, pcolor: [255, 120, 110], rise: 0.6, angle: 0.5, alpha: 0.35 }
  };

  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const spawn = (anywhere) => ({
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : H + 10,
    r: Math.random() * 1.6 + 0.3,
    v: Math.random() * 0.6 + 0.2,
    s: Math.random() * Math.PI * 2,
    w: Math.random() * 0.02 + 0.005
  });

  const lerp = (a, b, k) => a + (b - a) * k;
  const lerpArr = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));

  function drawRibbons() {
    const n = Math.round(cfg.ribbons);
    if (n <= 0) return;
    const [r, g, b] = cfg.color;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(cfg.angle);
    ctx.globalCompositeOperation = "lighter";
    const span = Math.hypot(W, H);
    for (let i = 0; i < n; i++) {
      const base = ((i + 0.5) / n - 0.5) * H * 1.1;
      const amp = 40 + (i % 3) * 30;
      const f = 0.0016 + (i % 4) * 0.0005;
      const sp = 0.35 + (i % 5) * 0.08;
      const strands = 10;
      for (let s = 0; s < strands; s++) {
        const off = s * (3 + (i % 3));
        const a = (1 - Math.abs(s - strands / 2) / (strands / 2)) * 0.12 * cfg.alpha;
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.beginPath();
        for (let x = -span / 2; x <= span / 2; x += 24) {
          const y = base + off
            + Math.sin(x * f + t * sp + i * 1.7) * amp
            + Math.sin(x * f * 2.3 - t * sp * 0.7 + s * 0.12) * amp * 0.35;
          x === -span / 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawParticles(dt) {
    const want = Math.round(cfg.particles * (W * H) / (1600 * 900));
    while (parts.length < want) parts.push(spawn(true));
    if (parts.length > want) parts.length = want;
    const [r, g, b] = cfg.pcolor;
    ctx.globalCompositeOperation = "lighter";
    for (const p of parts) {
      p.y -= p.v * cfg.rise * dt * 0.06;
      p.x += Math.sin(t * 0.5 + p.s) * 0.15;
      p.s += p.w;
      if (p.y < -10) Object.assign(p, spawn(false));
      const a = (0.35 + Math.sin(p.s) * 0.35) * 0.9;
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function frame(now) {
    const dt = Math.min(50, now - (last || now)); last = now;
    t += dt * 0.00035;
    const k = Math.min(1, dt * 0.004);
    cfg.ribbons = lerp(cfg.ribbons, target.ribbons, k);
    cfg.particles = lerp(cfg.particles, target.particles, k);
    cfg.rise = lerp(cfg.rise, target.rise, k);
    cfg.angle = lerp(cfg.angle, target.angle, k);
    cfg.alpha = lerp(cfg.alpha, target.alpha, k);
    cfg.color = lerpArr(cfg.color, target.color, k);
    cfg.pcolor = lerpArr(cfg.pcolor, target.pcolor, k);
    ctx.clearRect(0, 0, W, H);
    drawRibbons();
    drawParticles(dt);
    if (on && !reduce) raf = requestAnimationFrame(frame);
  }

  const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };

  window.addEventListener("resize", () => { resize(); if (reduce || !on) frame(performance.now()); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf); else if (on && !reduce) start();
  });

  resize();
  return {
    theme(name, overrideColor) {
      const th = THEMES[name] || THEMES.lobby;
      target = { ...th };
      if (overrideColor) { target.color = overrideColor; target.pcolor = overrideColor.map(v => Math.min(255, v + 60)); }
      if (reduce) { cfg = { ...target }; frame(performance.now()); }
    },
    set enabled(v) {
      on = v;
      cv.style.opacity = v ? "" : "0";
      if (v && !reduce) start(); else cancelAnimationFrame(raf);
    },
    start() { if (!reduce) start(); else frame(performance.now()); }
  };
})();
