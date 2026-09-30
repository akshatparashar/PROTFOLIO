/* =====================================================================
   SFX.JS — tiny synthesised UI sound kit (Web Audio, no files).
   ===================================================================== */
window.SFX = (() => {
  let ctx = null, master = null, enabled = true, lastHover = 0;

  const init = () => {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
  };

  const tone = (freq, dur, { type = "sine", gain = 0.2, to = null, delay = 0, attack = 0.004 } = {}) => {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  };

  const noise = (dur, { gain = 0.15, from = 800, to = 4000, q = 1.2, delay = 0, type = "bandpass" } = {}) => {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + delay;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.02);
  };

  const sounds = {
    hover() {
      const now = performance.now();
      if (now - lastHover < 45) return;
      lastHover = now;
      tone(2400, 0.035, { type: "sine", gain: 0.035 });
    },
    click() { tone(520, 0.07, { type: "triangle", gain: 0.16, to: 880 }); noise(0.05, { gain: 0.05, from: 3000, to: 6000 }); },
    tab() { noise(0.22, { gain: 0.12, from: 400, to: 5000 }); tone(180, 0.12, { type: "sine", gain: 0.12, to: 90 }); },
    back() { noise(0.18, { gain: 0.1, from: 4000, to: 500 }); },
    open() { tone(330, 0.12, { type: "triangle", gain: 0.12, to: 660 }); tone(990, 0.1, { type: "sine", gain: 0.05, delay: 0.05 }); },
    close() { tone(660, 0.1, { type: "triangle", gain: 0.1, to: 300 }); },
    play() { tone(90, 0.35, { type: "sine", gain: 0.3, to: 45 }); noise(0.3, { gain: 0.1, from: 200, to: 3000 }); },
    toggle() { tone(1200, 0.04, { type: "square", gain: 0.05 }); tone(1600, 0.04, { type: "square", gain: 0.04, delay: 0.05 }); },
    error() { tone(160, 0.18, { type: "sawtooth", gain: 0.08 }); },
    shot() { noise(0.09, { gain: 0.14, from: 2500, to: 300, type: "lowpass", q: 0.7 }); tone(140, 0.08, { type: "square", gain: 0.05, to: 60 }); },
    queue() { tone(440, 0.12, { gain: 0.12 }); tone(660, 0.18, { gain: 0.1, delay: 0.1 }); },
    found() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.5, { type: "triangle", gain: 0.13, delay: i * 0.09 }));
      tone(65, 0.9, { type: "sine", gain: 0.35, to: 40 });
      noise(0.6, { gain: 0.08, from: 300, to: 8000 });
    },
    tick() { tone(1800, 0.03, { type: "square", gain: 0.04 }); },
    lock() {
      tone(55, 0.8, { type: "sine", gain: 0.4, to: 30 });
      noise(0.5, { gain: 0.16, from: 6000, to: 200, type: "lowpass", q: 0.5 });
      [784, 1175, 1568].forEach((f, i) => tone(f, 0.7, { type: "sine", gain: 0.08, delay: 0.08 + i * 0.05 }));
    },
    boom() { tone(70, 1.2, { type: "sine", gain: 0.45, to: 28 }); noise(0.9, { gain: 0.12, from: 5000, to: 80, type: "lowpass", q: 0.4 }); },
    flip() { noise(0.15, { gain: 0.1, from: 1200, to: 6000 }); tone(900, 0.15, { type: "triangle", gain: 0.07, to: 1400, delay: 0.05 }); },
    reveal() { [880, 1320].forEach((f, i) => tone(f, 0.35, { type: "sine", gain: 0.08, delay: i * 0.08 })); }
  };

  return {
    init,
    play(name) {
      if (!ctx) return; // only after the first user gesture (the start gate)
      try { if (ctx.state === "suspended") ctx.resume(); sounds[name] && sounds[name](); } catch (e) { /* audio is optional */ }
    },
    set enabled(v) { enabled = v; },
    get enabled() { return enabled; }
  };
})();
