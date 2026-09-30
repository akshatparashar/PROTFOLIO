/* =====================================================================
   APP.JS — client shell: preloader, router, screens, overlays.
   ===================================================================== */
(() => {
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $("#app");
  const icon = (id, cls = "") => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const DEVICON = "https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/";
  const INVERT = ["express", "vercel", "aws"];
  const isTouch = window.matchMedia("(hover: none), (max-width: 1000px)").matches;
  const TIERS = { select: "#5a9fe2", deluxe: "#1fbfa8", premium: "#d1548d", exclusive: "#f5955b", ultra: "#fad663" };

  /* ------------------------------------------------ settings */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ap." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ap." + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const settings = {
    sound: store.get("sound", true),
    fx: store.get("fx", true),
    xhair: store.get("xhair", true),
    xhColor: store.get("xhColor", "#37ffb0")
  };

  /* ------------------------------------------------ small utils */
  let toastT;
  const toast = (msg) => {
    const t = $("#toast");
    t.innerHTML = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600);
  };
  const sfx = (n) => settings.sound && window.SFX.play(n);
  const pad = (n) => String(n).padStart(2, "0");
  const ist = () => { const d = new Date(); return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 5.5 * 3600000); };
  const toMidnightIST = () => { const n = ist(); const m = new Date(n); m.setHours(24, 0, 0, 0); return m - n; };
  const hms = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; };
  const months = (start, end) => {
    const [ys, ms] = start.split("-").map(Number);
    let ye, me;
    if (end) [ye, me] = end.split("-").map(Number); else { const n = ist(); ye = n.getFullYear(); me = n.getMonth() + 1; }
    return Math.max(1, (ye - ys) * 12 + (me - ms) + 1);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (_) { /* noop */ }
      ta.remove(); return ok;
    }
  };
  const skillImg = (s, cls = "") => s.icon
    ? `<img class="${cls} ${INVERT.includes(s.id) ? "inv" : ""}" src="${DEVICON}${s.icon}.svg" alt="${s.name}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'glyph',textContent:'${s.name.slice(0, 2).toUpperCase()}'}))">`
    : `<span class="glyph">${s.glyph}</span>`;
  const hexToRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

  /* ------------------------------------------------ static wiring */
  $$("[data-resume]").forEach(a => { a.href = D.player.resume; });

  $("#wallet").innerHTML = D.stats.map(s => `<span data-tip="${s.label.toUpperCase()}">${icon(s.icon)}${s.value}</span>`).join("");
  $("#railSocials").innerHTML = D.socials.map(s =>
    `<a class="rail-soc" href="${s.url}" target="_blank" rel="noopener" data-tip="${s.label.toUpperCase()}" aria-label="${s.label}">${icon(s.id)}</a>`).join("");

  /* =====================================================================
     PRELOADER
     ===================================================================== */
  const pre = $("#preloader");
  const preFill = $("#preFill"), preCount = $("#preCount"), preStatus = $("#preStatus");
  const STATUS = ["INITIALISING CLIENT", "LOADING AGENTS", "CALIBRATING CROSSHAIR", "COMPILING PROJECTS", "CONNECTING TO JAIPUR", "WARMING UP LLMS", "READY"];
  const assets = [...Object.values(D.projects).map(p => p.img).filter(Boolean)];
  let loaded = 0, shown = 0, started = false;
  const total = assets.length + 1;
  const t0 = performance.now();
  pre.classList.add("loading");

  assets.forEach(src => { const im = new Image(); im.onload = im.onerror = () => loaded++; im.src = src; });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => loaded++);
  setTimeout(() => { loaded = total; }, 9000); // never hang on a slow CDN

  (function tickLoad() {
    const real = loaded / total;
    const timeCap = Math.min(1, (performance.now() - t0) / 2600);
    const target = Math.min(real, timeCap) * 100;
    shown += (target - shown) * 0.12;
    if (target >= 100 && shown > 99.4) shown = 100;
    preFill.style.width = shown + "%";
    preCount.textContent = Math.floor(shown) + "%";
    preStatus.textContent = STATUS[Math.min(STATUS.length - 1, Math.floor(shown / 100 * (STATUS.length - 1)))];
    if (shown < 100) requestAnimationFrame(tickLoad);
    else { pre.classList.add("ready"); preStatus.textContent = "PRESS ANY KEY"; }
  })();

  const startClient = () => {
    if (started || !pre.classList.contains("ready")) return;
    started = true;
    window.SFX.init();
    window.SFX.enabled = settings.sound;
    sfx("boom");
    const intro = $("#intro");
    intro.classList.add("play");
    setTimeout(() => {
      pre.classList.add("gone");
      document.body.classList.remove("booting");
      FX.start();
      route(true);
    }, 700);
    setTimeout(() => { intro.classList.remove("play"); startChat(); }, 1600);
  };
  $("#preStart").addEventListener("click", startClient);
  pre.addEventListener("click", startClient);

  /* =====================================================================
     ROUTER
     ===================================================================== */
  const SCREENS = {
    lobby:       { crumb: "", fx: "lobby" },
    progression: { crumb: "PROGRESSION", fx: "progression" },
    agents:      { crumb: "AGENTS", fx: "agents" },
    career:      { crumb: "CAREER", fx: "career" },
    about:       { crumb: "ABOUT", fx: "about", sub: [["OVERVIEW", null], ["CAREER", "career"], ["PROJECTS", "collection"], ["CONTACT", "@hire"]] },
    process:     { crumb: "PREMIER", fx: "process", sub: [["HUB", "#hub"], ["AWARDS", "#awards"], ["CREST", "#crest"]] },
    collection:  { crumb: "COLLECTION", fx: "collection" },
    store:       { crumb: "STORE", fx: "store" },
    nightmarket: { crumb: "NIGHT.MARKET", fx: "nightmarket" }
  };
  let current = null;

  function go(name, { silent = false, push = true } = {}) {
    if (!SCREENS[name]) name = "lobby";
    if (name === current) return;
    const prev = current ? $(`#s-${current}`) : null;
    current = name;
    if (push && location.hash.slice(1) !== name) history.replaceState(null, "", "#" + name);

    if (!silent) {
      sfx(name === "lobby" ? "back" : "tab");
      const w = $("#wipe"); w.classList.remove("go"); void w.offsetWidth; w.classList.add("go");
      clearTimeout(go.wipeT); go.wipeT = setTimeout(() => w.classList.remove("go"), 700);
    }
    if (prev) {
      prev.classList.remove("active"); prev.classList.add("leaving");
      setTimeout(() => prev.classList.remove("leaving"), 280);
    }
    const el = $(`#s-${name}`);
    setTimeout(() => {
      el.classList.add("active");
      el.scrollTop = 0;
      if (isTouch) window.scrollTo(0, 0);
    }, prev ? 180 : 0);

    app.dataset.theme = name;
    $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.go === name));
    $(".play-btn").classList.toggle("active", name === "lobby");
    const cfg = SCREENS[name];
    $("#crumb").textContent = cfg.crumb;
    $("#crumb").style.display = cfg.crumb ? "" : "none";
    renderSubtabs(cfg.sub);
    if (name === "agents") selectAgent(currentAgent, true);
    else FX.theme(cfg.fx);
    if (name === "career") renderHistory();
  }

  function renderSubtabs(sub) {
    const box = $("#subtabs");
    if (!sub) { box.innerHTML = ""; return; }
    box.innerHTML = sub.map(([label, to], i) => `<button data-sub="${to || ""}" class="${i === 0 ? "active" : ""}">${label}</button>`).join("");
  }
  $("#subtabs").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const to = b.dataset.sub;
    sfx("click");
    if (to.startsWith("#")) {
      $$("#subtabs button").forEach(x => x.classList.toggle("active", x === b));
      $$("#s-process .pm-view").forEach(v => {
        const on = v.dataset.view === to.slice(1);
        v.classList.toggle("active", on);
        if (on) { v.querySelectorAll(".rv").forEach(r => { r.style.animation = "none"; void r.offsetWidth; r.style.animation = ""; }); }
      });
    } else if (to.startsWith("@")) openContact(to.slice(1));
    else if (to) go(to);
  });

  const route = (silent) => go(location.hash.slice(1) || "lobby", { silent, push: false });
  window.addEventListener("hashchange", () => route(false));

  /* global click delegation */
  document.addEventListener("click", (e) => {
    const goEl = e.target.closest("[data-go]");
    if (goEl) {
      e.preventDefault();
      closeAll();
      if (goEl.dataset.sfx !== "none" && goEl.dataset.go === "lobby" && current !== "lobby") sfx("play");
      go(goEl.dataset.go);
      return;
    }
    const c = e.target.closest("[data-contact]");
    if (c) { e.preventDefault(); openContact(c.dataset.contact); return; }
    const ins = e.target.closest("[data-inspect]");
    if (ins) { e.preventDefault(); openInspect(ins.dataset.inspect); return; }
    const cl = e.target.closest("[data-close]");
    if (cl) { closeTop(); return; }
    const b = e.target.closest("button, a");
    if (b && !b.closest(".tabs") && b.dataset.sfx !== "none") sfx("click");
  });
  $("#crumbBack").addEventListener("click", () => go("store"));

  /* =====================================================================
     LOBBY
     ===================================================================== */
  $("#partyCode").addEventListener("click", async () => {
    const ok = await copy(D.player.email);
    toast(ok ? `PARTY CODE COPIED · <b>${D.player.email}</b>` : `PARTY CODE · <b>${D.player.email}</b>`);
  });
  $("#partyToggle").addEventListener("click", (e) => {
    const t = e.currentTarget.querySelector(".toggle");
    t.classList.remove("on"); sfx("toggle");
    toast("NICE TRY — THIS PARTY IS ALWAYS OPEN TO GOOD OPPORTUNITIES");
    setTimeout(() => { t.classList.add("on"); sfx("toggle"); }, 900);
  });
  $("#pcMute").addEventListener("click", (e) => { e.stopPropagation(); setSound(!settings.sound); });
  $("#patchBtn").addEventListener("click", () => openInbox(3));
  $("#playerCard").addEventListener("click", (e) => { if (!e.target.closest("button")) go("career"); });

  /* ---- matchmaking ---- */
  const match = $("#match");
  let qTimer = null, qStart = 0, mfTimer = null, asTimerI = null, inQueue = false;
  const findBtn = $("#findBtn");

  function resetQueue() {
    inQueue = false;
    clearInterval(qTimer); clearTimeout(mfTimer); clearInterval(asTimerI);
    findBtn.classList.remove("queued");
    findBtn.querySelector("span").textContent = "FIND MATCH";
    $("#queueInfo").classList.remove("show");
  }
  findBtn.addEventListener("click", () => {
    if (inQueue) { sfx("close"); resetQueue(); toast("QUEUE CANCELLED"); return; }
    inQueue = true; sfx("queue");
    findBtn.classList.add("queued");
    findBtn.querySelector("span").textContent = "CANCEL";
    $("#queueInfo").classList.add("show");
    qStart = Date.now();
    $("#queueTime").textContent = "0:00";
    qTimer = setInterval(() => { const s = Math.floor((Date.now() - qStart) / 1000); $("#queueTime").textContent = `${Math.floor(s / 60)}:${pad(s % 60)}`; }, 250);
    mfTimer = setTimeout(matchFound, 3300);
  });

  function matchFound() {
    clearInterval(qTimer);
    sfx("found");
    match.className = "match on found";
    let n = 3; $("#mfCount").textContent = n;
    const cd = setInterval(() => {
      n--; if (n > 0) { $("#mfCount").textContent = n; sfx("tick"); }
      else { clearInterval(cd); agentSelect(); }
    }, 1000);
    mfTimer = cd;
  }
  function agentSelect() {
    match.className = "match on select";
    sfx("open");
    let t = 30; $("#asTimer").textContent = t;
    asTimerI = setInterval(() => { t--; $("#asTimer").textContent = t; if (t <= 5 && t > 0) sfx("tick"); if (t <= 0) lockIn(); }, 1000);
  }
  function lockIn() {
    clearInterval(asTimerI);
    sfx("lock");
    match.className = "match on select locked-in";
    setTimeout(() => {
      match.className = "match";
      resetQueue();
      openContact("match");
    }, 1400);
  }
  function dodge() {
    clearInterval(asTimerI); clearInterval(mfTimer);
    match.className = "match"; resetQueue(); sfx("error");
    toast("DODGED · −3 RR · THE QUEUE IS ALWAYS OPEN");
  }
  $("#lockBtn").addEventListener("click", lockIn);
  $("#dodgeBtn").addEventListener("click", dodge);
  $("#asRoster").innerHTML = `<span class="me">${icon("logo")}</span>` +
    D.skills.filter(s => s.icon).slice(0, 12).map(s => `<span class="lockd">${skillImg(s)}</span>`).join("");

  /* =====================================================================
     PROGRESSION
     ===================================================================== */
  $("#dailyDiamonds").outerHTML =
    `<div class="daily-diamonds" id="dailyDiamonds">${D.dailyLoop.map((l, i) => `<div class="dd done"><b>${i + 1}</b><small>${l}</small></div>`).join("")}</div>
     <div class="daily-lines"><i></i><i></i><i></i></div>`;
  $("#grindList").innerHTML = D.grind.map(g => `
    <div class="g-item"><i class="gd"></i><div>
      <div class="g-name">${g.name}</div>
      <div class="g-bar"><i></i></div>
      <div class="g-meta"><span>ONGOING</span><b>${g.reward}</b></div>
    </div></div>`).join("");

  const passTiers = [...D.experience].reverse(); // oldest → newest
  const ROLE_OF = { flo: "ai", celebal: "devops", greymoon: "design", internpay: "web" };
  function showTier(id) {
    const x = D.experience.find(e => e.id === id);
    $$(".pt").forEach(p => p.classList.toggle("active", p.dataset.id === id));
    $("#passReward").innerHTML = `
      <div class="pr-copy">
        <small>${x.result === "live" ? icon("bolt") + " Currently equipped" : icon("check") + " Tier unlocked"} · ${x.dates}</small>
        <h3>${x.role}</h3>
        <span style="color:${x.color};font-weight:600;letter-spacing:.06em">@ ${x.org.toUpperCase()}</span>
        <ul>${x.points.map(p => `<li>${p}</li>`).join("")}</ul>
      </div>
      <div class="pr-art"><div class="pr-emblem" style="--c:${x.color}"><i class="pr-glow"></i><b>${x.abbr}</b></div></div>`;
  }
  $("#passTrack").innerHTML = passTiers.map((x, i) => `
    <button class="pt ${x.result === "live" ? "live" : "done"}" data-id="${x.id}">
      <small>TIER ${i + 1} · ${x.start.slice(0, 4)}</small><b>${x.abbr === "CLB" ? "CELEBAL" : x.org.toUpperCase()}</b><i></i>
    </button>`).join("");
  $("#passTrack").addEventListener("click", (e) => { const b = e.target.closest(".pt"); if (b) showTier(b.dataset.id); });
  $("#passTrack").addEventListener("mouseover", (e) => { const b = e.target.closest(".pt"); if (b && !b.classList.contains("active")) showTier(b.dataset.id); });
  showTier(D.experience[0].id);

  $("#objectives").innerHTML = D.education.map((ed, i) => `
    <div class="obj-wrap" style="position:relative">
      <button class="obj" data-go="career">
        <h4>${ed.abbr === "PCE" ? "B.TECH CSE" : "CLASS XII · PCM"}</h4>
        <span>${ed.score} · ${ed.dates}</span>
        <div class="ob-bar"><i style="--p:${ed.abbr === "PCE" ? 86 : 93.4}%"></i></div>
        <div class="ob-art">${icon(i ? "star" : "cap")}<small>${i ? "93.4%" : "8.6"}</small></div>
      </button>
      ${i === 0 ? `<div class="ends"><i>${icon("check")}</i>GRADUATED 2026</div>` : ""}
    </div>`).join("");

  /* =====================================================================
     AGENTS (skills)
     ===================================================================== */
  const ME = { id: "akshat", name: "AKSHAT", me: true };
  const ME_THEME = { bg: ["#0b1630", "#283d8f"], color: "#ffd27a", role: "FLEX · FULL-STACK", desc: "Plays every role — designs the interface, builds the stack, wires in the LLMs and ships it." };
  let currentAgent = "akshat", agentTab = 0, agentFilter = "all";

  $("#agFilters").innerHTML = `<button class="active" data-f="all" data-tip="ALL">${icon("stack")}</button>` +
    Object.entries(D.roles).map(([k, r]) => `<button data-f="${k}" data-tip="${r.role} · ${r.name.toUpperCase()}" style="color:${r.color}">${icon({ lang: "code", web: "globe", ai: "spark", devops: "shield", design: "pen" }[k])}</button>`).join("");
  $("#agGrid").innerHTML =
    `<button class="ag-tile me active" data-id="akshat" style="--rc:#ffd27a" data-tip="AKSHAT">${icon("logo")}</button>` +
    D.skills.map(s => `<button class="ag-tile" data-id="${s.id}" data-role="${s.role}" style="--rc:${D.roles[s.role].color}" data-tip="${s.name.toUpperCase()}">${skillImg(s)}<span class="lv">${pad(s.m)}</span></button>`).join("");

  $("#agFilters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    agentFilter = b.dataset.f;
    $$("#agFilters button").forEach(x => x.classList.toggle("active", x === b));
    $$(".ag-tile").forEach(t => t.classList.toggle("hidden", agentFilter !== "all" && t.dataset.role !== agentFilter && !t.classList.contains("me")));
  });
  $(".ag-toggle").addEventListener("click", () => { $("#agFilters [data-f=all]").click(); sfx("toggle"); });
  $("#agGrid").addEventListener("click", (e) => { const t = e.target.closest(".ag-tile"); if (t) { agentTab = 0; selectAgent(t.dataset.id); } });
  $("#agMastery").addEventListener("click", () => { agentTab = 2; renderAgentBody(); });

  const skillById = (id) => id === "akshat" ? ME : D.skills.find(s => s.id === id);
  function usedIn(s) {
    const kw = (s.kw || s.name.split(/[ /]/)[0]).toLowerCase().replace(".js", "");
    const hits = [];
    Object.entries(D.projects).forEach(([id, p]) => { if (p.stack.some(x => x.toLowerCase().includes(kw))) hits.push({ id, name: p.name, type: "p" }); });
    D.experience.forEach(x => { if (x.stack.some(y => y.toLowerCase().includes(kw))) hits.push({ id: x.id, name: x.org, type: "x" }); });
    return hits;
  }

  function selectAgent(id, fromRoute) {
    currentAgent = id;
    const s = skillById(id);
    const th = s.me ? ME_THEME : D.roles[s.role];
    app.style.setProperty("--ag1", th.bg[0]);
    app.style.setProperty("--ag2", th.bg[1]);
    app.style.setProperty("--agc", th.color);
    FX.theme("agents", hexToRgb(th.color));
    $$(".ag-tile").forEach(t => t.classList.toggle("active", t.dataset.id === id));
    const nm = s.me ? "AKSHAT" : s.name.toUpperCase();
    $("#agName").textContent = nm;
    $("#agLvl").textContent = s.me ? "∞" : s.m;
    $("#agBgText").innerHTML = `<span>${(nm + " ").repeat(4)}</span><span>${(nm + " ").repeat(4)}</span><span>${(nm + " ").repeat(4)}</span>`;
    $("#agFigure").innerHTML = s.me
      ? `<div class="skill-hero me-hero">${icon("logo")}</div>`
      : `<div class="skill-hero">${skillImg(s)}</div>`;
    const tabs = s.me
      ? [["INFO", "agents"], ["C", "bolt"], ["Q", "code"], ["X", "rocket"]]
      : [["INFO", "info"], ["USED", "collection"], ["MASTERY", "star"], ["TEAM", "stack"]];
    $("#agTabs").innerHTML = tabs.map(([l, ic], i) => `<button class="${i === agentTab ? "active" : ""}" data-i="${i}">${icon(ic)}${l}</button>`).join("");
    renderAgentBody();
    if (!fromRoute) sfx("click");
  }
  $("#agTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { agentTab = +b.dataset.i; renderAgentBody(); } });

  function renderAgentBody() {
    const s = skillById(currentAgent);
    $$("#agTabs button").forEach((b, i) => b.classList.toggle("active", i === agentTab));
    let html = "";
    if (s.me) {
      const abil = [
        null,
        ["C — PROMPT STORM", "Engineers prompts and LLM workflows (Gemini, Groq) that turn fuzzy asks into reliable, structured output."],
        ["Q — FULL-STACK DASH", "Dashes through React, Node, Express and MongoDB to ship a working product end-to-end."],
        ["X — ULTIMATE: SHIP IT", "Designs in Figma, builds, containerises and deploys — CI/CD to Vercel before the round timer runs out."]
      ];
      if (agentTab === 0) html = `<p>${D.player.bio}</p><h5>${ME_THEME.role}</h5><p>${ME_THEME.desc}</p>`;
      else html = `<h5>${abil[agentTab][0]}</h5><p>${abil[agentTab][1]}</p><div class="chips">${
        (agentTab === 1 ? ["gemini", "groq", "prompt", "llm"] : agentTab === 2 ? ["react", "node", "express", "mongodb"] : ["figma", "docker", "jenkins", "vercel"])
          .map(id => `<button data-skill="${id}">${skillById(id).name}</button>`).join("")}</div>`;
    } else {
      const r = D.roles[s.role];
      if (agentTab === 0) html = `<p>${s.desc}</p><h5>${r.role}</h5><p>${r.desc}</p>`;
      else if (agentTab === 1) {
        const u = usedIn(s);
        html = `<h5>SEEN IN</h5>` + (u.length
          ? `<div class="chips">${u.map(h => h.type === "p" ? `<button data-proj="${h.id}">${h.name}</button>` : `<span>${h.name}</span>`).join("")}</div>`
          : `<p>Used across coursework, experiments and day-to-day builds.</p>`);
      } else if (agentTab === 2) {
        html = `<div class="mastery"><h5>MASTERY TIER ${s.m} / 5</h5><div class="m-row">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= s.m ? "on" : ""}"></i>`).join("")}</div>
          <small>${["", "Learning", "Comfortable", "Confident", "Strong", "Main"][s.m]} · self-assessed</small></div>`;
      } else {
        html = `<h5>${r.role}S · ${r.name.toUpperCase()}</h5><div class="chips">${D.skills.filter(x => x.role === s.role && x.id !== s.id).map(x => `<button data-skill="${x.id}">${x.name}</button>`).join("")}</div>`;
      }
    }
    $("#agBody").innerHTML = html;
  }
  $("#agBody").addEventListener("click", (e) => {
    const sk = e.target.closest("[data-skill]"); if (sk) { agentTab = 0; selectAgent(sk.dataset.skill); return; }
    const pj = e.target.closest("[data-proj]"); if (pj) openInspect(pj.dataset.proj);
  });

  /* =====================================================================
     CAREER
     ===================================================================== */
  const ROLE_ICON = { ai: "spark", web: "code", devops: "shield", design: "pen", lang: "code" };
  $("#mains").innerHTML = D.mains.map(m => {
    const r = D.roles[m.role];
    return `<button class="main-card" data-go="agents" style="--rc:${r.color};--c1:${r.bg[1]};--c2:${r.bg[0]}">
      <div class="mc-art">${icon(ROLE_ICON[m.role])}</div>
      <div class="mc-bar"><span class="mc-lvl">${m.lvl}</span><b>${m.name}</b></div></button>`;
  }).join("");

  let histFilter = "all";
  const MAPS = ["linear-gradient(120deg,#16384a,#2e7d8c)", "linear-gradient(120deg,#23324d,#5a7ba8)", "linear-gradient(120deg,#3a2450,#7a5ba8)", "linear-gradient(120deg,#4a3218,#a8773a)", "linear-gradient(120deg,#4a4018,#b89a3a)", "linear-gradient(120deg,#3a3218,#8a7a3a)"];
  function renderHistory() {
    const rows = [...D.experience, ...D.education].filter(r => histFilter === "all" || r.type === histFilter);
    $("#histList").innerHTML = rows.map((r, i) => {
      const mo = months(r.start, r.end);
      const dur = mo >= 12 ? `${(mo / 12).toFixed(mo % 12 ? 1 : 0)} YRS` : `${mo} MO`;
      const res = { live: "IN PROGRESS", victory: "VICTORY", graduated: "GRADUATED", cleared: "CLEARED" }[r.result];
      const tag = r.type === "edu" ? (r.abbr === "PCE" ? "DEGREE" : "SCHOOL") : r.result === "live" ? "CURRENT" : r.role.includes("Intern") ? "INTERNSHIP" : "SUMMER " + r.start.slice(2, 4);
      const ic = r.type === "edu" ? "cap" : ROLE_ICON[ROLE_OF[r.id]] || "code";
      return `<button class="hrow ${r.result === "live" ? "live" : ""} ${r.type === "edu" ? "edu" : ""}" data-i="${i}" style="--oc:${r.color};--map:${MAPS[i % MAPS.length]}">
          <span class="h-icon">${r.abbr}</span>
          <span class="h-rank">${icon(ic)}</span>
          <span class="h-kda"><small>${r.type === "edu" ? "SCORE" : "DURATION"}</small><b>${r.type === "edu" ? r.score : dur}</b><span>${r.role.toUpperCase()}</span></span>
          <span class="h-res"><b>${res}</b><small>${r.dates}</small></span>
          <span class="h-map"><span>${tag}</span></span>
          <span class="h-exp">${icon("plus")}</span>
        </button>
        <div class="hdetail" style="--rc:${r.result === "live" ? "var(--teal)" : r.type === "edu" ? "var(--gold)" : "var(--green)"}">
          <b style="color:#fff">${r.org}</b> — ${r.role}
          <ul>${r.points.map(p => `<li>${p}</li>`).join("")}</ul>
          ${r.stack ? `<div class="chips">${r.stack.map(s => `<span>${s}</span>`).join("")}</div>` : ""}
        </div>`;
    }).join("");
  }
  $("#histList").addEventListener("click", (e) => {
    const r = e.target.closest(".hrow"); if (!r) return;
    const d = r.nextElementSibling;
    const open = !r.classList.contains("open");
    $$(".hrow.open").forEach(x => { x.classList.remove("open"); x.nextElementSibling.classList.remove("open"); });
    if (open) { r.classList.add("open"); d.classList.add("open"); sfx("open"); }
  });
  const dd = $("#histFilter");
  dd.querySelector(".dd-btn").addEventListener("click", (e) => { e.stopPropagation(); dd.classList.toggle("open"); });
  dd.querySelector(".dd-menu").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    histFilter = b.dataset.f; dd.querySelector(".dd-btn span").textContent = b.textContent; dd.classList.remove("open"); renderHistory();
  });
  document.addEventListener("click", () => dd.classList.remove("open"));
  $("#copyId").addEventListener("click", async () => { await copy(D.player.email); toast(`COPIED · <b>${D.player.email}</b>`); });
  renderHistory();

  /* =====================================================================
     ABOUT
     ===================================================================== */
  $("#abHype").textContent = D.player.hype;
  $("#abSum").textContent = D.player.summary;
  function renderNextUp() {
    const n = ist();
    let h = n.getHours(); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
    const month = n.toLocaleString("en", { month: "long" }).toUpperCase();
    const rows = [
      { d: `${month} ${n.getDate()}`, t: `${pad(h)}:${pad(n.getMinutes())} ${ap}`, z: "GMT+5:30 · JAIPUR", a: "AKS", b: "LLM", mid: ["@ FLO", "1-0"], live: true, c: "#2ee6b6", go: "career" },
      { d: "OPEN SLOT", t: "ANYTIME", z: "REMOTE / ON-SITE", a: "AKS", b: "YOU", mid: ["HIRING", "vs"], c: "#ff4655", contact: "hire" },
      { d: "DAILY", t: "ALWAYS", z: "SHIP → FIX → SHIP", a: "AKS", b: "BUG", mid: ["DEBUG", "2-0"], c: "#fad663", go: "collection" },
      { d: "WEEKENDS", t: "RANKED", z: "AFTER HOURS", a: "AKS", b: "RNK", mid: ["VALORANT", "vs"], c: "#c77dff", go: "nightmarket" }
    ];
    $("#nextUp").innerHTML = rows.map(r => `
      <div class="nu">
        <div class="nu-date"><small>${r.d}</small><b>${r.t}</b><em>${r.z}</em></div>
        <button class="nu-match" ${r.go ? `data-go="${r.go}"` : `data-contact="${r.contact}"`} style="--c:${r.c}">
          ${r.live ? `<span class="live-chip">LIVE</span>` : ""}
          <span class="ghost l">${r.a}</span><span class="ghost r">${r.b}</span>
          <span class="t a">${r.a}</span><span class="mid"><small>${r.mid[0]}</small><b>${r.mid[1]}</b></span><span class="t">${r.b}</span>
        </button>
      </div>`).join("");
  }
  renderNextUp(); setInterval(renderNextUp, 30000);
  const TEAMS = [
    ["FLO", "#2ee6b6", null, "career"], ["CLB", "#4cc3ff", null, "career"], ["GMN", "#b18cff", null, "career"], ["INP", "#ffb454", null, "career"],
    ["PCE", "#e8c56d", null, "progression"], ["VSV", "#d6b36a", D.projects.vishvora.live], ["TOD", "#e0894a", D.projects.tunes.live], ["HPS", "#8fb3d9", null, "progression"]
  ];
  const TEAM_NAMES = { FLO: "FLO", CLB: "Celebal Technologies", GMN: "GreyMoon", INP: "InternPay", PCE: "Poornima College", VSV: "Vishvora", TOD: "Tunes of Dunes", HPS: "Happy Public School" };
  $("#teams").innerHTML = TEAMS.map(([ab, c, url, go]) => url
    ? `<a class="team" href="${url}" target="_blank" rel="noopener" data-tip="${TEAM_NAMES[ab].toUpperCase()}"><b>${ab}</b><i style="--c:${c}">${ab[0]}</i></a>`
    : `<button class="team" data-go="${go}" data-tip="${TEAM_NAMES[ab].toUpperCase()}"><b>${ab}</b><i style="--c:${c}">${ab[0]}</i></button>`).join("");

  /* =====================================================================
     PROCESS (premier)
     ===================================================================== */
  let verified = false;
  $("#pmVerify").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (verified) { openContact("hire"); return; }
    const items = $$("#pmChecks li");
    btn.disabled = true;
    items.forEach((li, i) => setTimeout(() => { li.classList.add("ok"); sfx("tick"); }, 300 * (i + 1)));
    setTimeout(() => {
      verified = true; btn.disabled = false; btn.classList.add("done");
      btn.innerHTML = "<b>ELIGIBLE · HIRE</b>"; sfx("reveal"); toast("VERIFIED · AKSHAT MEETS ALL PREMIER REQUIREMENTS");
    }, 300 * (items.length + 1));
  });
  $("#awards").innerHTML = D.certifications.map((c, i) => `
    <div class="award rv" style="--d:${i + 1}"><em>${c.year}</em><div class="aw-ic">${icon(c.icon)}</div><h4>${c.name}</h4><span>${c.by}</span></div>`).join("");
  $("#crestInfo").innerHTML = [
    ["PLAYER", D.player.name], ["ROLE", D.player.title + " @ FLO"], ["BASED IN", D.player.location],
    ["EDUCATION", "B.Tech CSE · Poornima College of Engineering · CGPA 8.6"],
    ["LANGUAGES", D.player.languages.join(" · ")], ["OFF-DUTY", D.player.interests]
  ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");

  /* =====================================================================
     COLLECTION (projects)
     ===================================================================== */
  const ART = {
    phone: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet"><rect width="320" height="200" fill="#0b141c"/>
      <g stroke="#1e3242" stroke-width="1">${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 22}" y1="0" x2="${i * 22}" y2="200"/>`).join("")}</g>
      <path d="M200 60a40 40 0 0 1 0 80M214 46a60 60 0 0 1 0 108M228 32a80 80 0 0 1 0 136" fill="none" stroke="#2ee6b6" stroke-width="3" opacity=".7"/>
      <rect x="118" y="24" width="76" height="152" rx="12" fill="#101c26" stroke="#7fd7ff" stroke-width="3"/>
      <rect x="126" y="38" width="60" height="118" fill="#050a0e"/>
      <g font-family="monospace" font-size="7.5" fill="#2ee6b6"><text x="130" y="52">$ ./serve</text><text x="130" y="64">nginx: up</text><text x="130" y="76">:8080 open</text><text x="130" y="88" fill="#7fd7ff">tunnel ok</text><text x="130" y="100">uptime 99%</text><text x="130" y="112">_</text></g>
      <circle cx="156" cy="166" r="4" fill="#7fd7ff"/></svg>`,
    client: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet"><rect width="320" height="200" fill="#111"/>
      <path d="M0 150 L120 0 H140 L20 170Z" fill="#d6b36a" opacity=".5"/><path d="M200 200 L320 60 V90 L230 200Z" fill="#d6b36a" opacity=".35"/>
      <rect width="320" height="16" fill="#0f1923"/><path d="M0 0H62L54 16H0Z" fill="#ff4655"/><text x="14" y="12" font-family="Anton,Impact" font-size="11" fill="#fff">PLAY</text>
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${72 + i * 16}" y="5" width="7" height="7" fill="#9aa5b0"/>`).join("")}
      <path d="M130 40H190V140L160 156 130 140Z" fill="#1b2633"/><path d="M130 40H190V92H130Z" fill="#6d2f7a"/><rect x="130" y="92" width="60" height="2" fill="#2ee6b6"/>
      <path d="M96 48H128V132L112 142 96 132Z" fill="#15202b" stroke="#3a4b5c"/><path d="M192 48H224V132L208 142 192 132Z" fill="#15202b" stroke="#3a4b5c"/>
      <rect x="132" y="168" width="56" height="16" fill="#ff4655"/><text x="139" y="180" font-family="Anton,Impact" font-size="10" fill="#fff">FIND MATCH</text></svg>`
  };
  const media = (p) => p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy">` : `<div class="w-art">${ART[p.art]}</div>`;
  const COLS = [["RIFLES"], ["SNIPERS", "MELEE"], ["SIDEARMS"]];
  $("#colGrid").innerHTML = COLS.map((col, ci) => `<div class="col-cat">${col.map(slotName => {
    const slot = D.loadout.find(l => l.slot === slotName);
    return `<h3 class="h-weap rv" style="--d:${ci + 1}">${slot.slot}<small>${slot.sub.toUpperCase()}</small></h3>` +
      slot.ids.map((id, i) => {
        const p = D.projects[id];
        return `<button class="wcard ${slotName !== "SIDEARMS" ? "big" : ""} rv" style="--d:${ci + i + 2};--tc:${TIERS[p.tier]}" data-inspect="${id}">
          <span class="w-img">${media(p)}</span><span class="w-insp">INSPECT</span>
          <span class="w-name">${p.name}</span><span class="w-buddy"><i></i></span></button>`;
      }).join("");
  }).join("")}</div>`).join("");

  const wheelSay = $("#wheelSay");
  $$(".w-slot").forEach(s => {
    s.addEventListener("mouseenter", () => { wheelSay.textContent = s.dataset.say.toUpperCase(); });
    s.addEventListener("click", () => { wheelSay.textContent = s.dataset.say.toUpperCase(); sfx("reveal"); });
  });
  $("#wheel").addEventListener("mouseleave", () => { wheelSay.textContent = "HOVER"; });

  /* ---- inspect overlay ---- */
  const PROJECT_IDS = D.loadout.flatMap(l => l.ids);
  let inspecting = null;
  function openInspect(id) {
    const p = D.projects[id]; if (!p) return;
    inspecting = id;
    const slot = D.loadout.find(l => l.ids.includes(id));
    const idx = PROJECT_IDS.indexOf(id);
    $("#inspInner").innerHTML = `
      <div class="insp-media">${media(p)}</div>
      <div class="insp-copy" style="--tc:${TIERS[p.tier]}">
        <small><i></i>${p.tier.toUpperCase()} EDITION · ${slot.slot}</small>
        <h2>${p.name}</h2>
        <span class="weap">${p.weapon} SKIN · ${slot.sub.toUpperCase()}</span>
        <p>${p.desc}</p>
        <div class="chips">${p.stack.map(s => `<span>${s}</span>`).join("")}</div>
        <div class="insp-btns">
          ${p.live ? `<a class="btn-bone" href="${p.live}" target="_blank" rel="noopener"><b>${icon("ext")}PLAY LIVE</b></a>` : ""}
          ${p.code ? `<a class="btn-ghost" href="${p.code}" target="_blank" rel="noopener">${icon("code")} SOURCE</a>` : ""}
        </div>
        <div class="insp-nav"><button data-nav="-1">← PREV</button><button data-nav="1">NEXT →</button><span style="margin-left:auto;font-size:.8rem;color:#8fa0b0;align-self:center">${pad(idx + 1)} / ${pad(PROJECT_IDS.length)}</span></div>
      </div>`;
    openLayer($("#inspect"));
  }
  $("#inspect").addEventListener("click", (e) => {
    const n = e.target.closest("[data-nav]");
    if (n) { const i = PROJECT_IDS.indexOf(inspecting); openInspect(PROJECT_IDS[(i + +n.dataset.nav + PROJECT_IDS.length) % PROJECT_IDS.length]); }
  });

  /* =====================================================================
     STORE
     ===================================================================== */
  const TIER_BG = {
    select: "linear-gradient(135deg,#0f5560,#1a8f8f 60%,#0d3d45)",
    deluxe: "linear-gradient(135deg,#0d4a3e,#1fbf8f)",
    premium: "linear-gradient(135deg,#3d1b4f,#a0467a)",
    exclusive: "linear-gradient(135deg,#4a2512,#b8622a 60%,#5b2a10)",
    ultra: "linear-gradient(135deg,#5a4a10,#d6b33a)"
  };
  $("#offers").innerHTML = D.services.map((s, i) => `
    <button class="offer rv" style="--d:${i + 3};--tb:${TIER_BG[s.tier]}" data-contact="service:${s.name}">
      <div class="of-art">${icon(s.icon)}</div>
      <div class="of-desc">${s.desc}</div>
      <div class="of-bar"><b style="font-weight:500">${s.name.toUpperCase()}</b><span>${icon("bolt")}LET'S TALK</span></div>
    </button>`).join("");

  let slide = 0, slideT;
  const slides = $$(".st-slide"), dots = $$("#stDots button");
  function showSlide(i) {
    slide = i;
    slides.forEach((s, j) => s.classList.toggle("active", j === i));
    dots.forEach((d, j) => { d.classList.remove("on"); if (j === i) { void d.offsetWidth; d.classList.add("on"); } });
    clearTimeout(slideT); slideT = setTimeout(() => showSlide((slide + 1) % slides.length), 7000);
  }
  dots.forEach((d, i) => d.addEventListener("click", () => showSlide(i)));
  showSlide(0);

  const seasonEnd = new Date("2026-12-31T23:59:59+05:30").getTime();
  function tickTimers() {
    const ms = toMidnightIST();
    $("#dailyTimer").textContent = hms(ms);
    $("#offerTimer").textContent = hms(ms);
    let s = Math.max(0, Math.floor((seasonEnd - Date.now()) / 1000));
    $("#stTimer").textContent = `${pad(Math.floor(s / 86400))}:${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  }
  tickTimers(); setInterval(tickTimers, 1000);

  /* =====================================================================
     NIGHT MARKET
     ===================================================================== */
  const NM_IC = ["stack", "star", "game", "pin", "spark", "globe"];
  const NM_BG = [["#16324a", "#0c1a28"], ["#4a2a12", "#1f1208"], ["#4a1630", "#1e0a14"], ["#3a1616", "#180808"], ["#123a36", "#08181a"], ["#2e1a4a", "#120a20"]];
  $("#nmCards").innerHTML = D.nightMarket.map((c, i) => `
    <button class="nmc rv" style="--d:${i + 2};--nb1:${NM_BG[i % 6][0]};--nb2:${NM_BG[i % 6][1]}" aria-label="Reveal card ${i + 1}">
      <span class="nmc-in"><div class="face front"><b>?</b><small>CLICK TO REVEAL</small></div>
      <div class="face back">
        <span class="off">-${c.off}%</span>
        <span class="price"><s>PRICELESS</s>FREE</span>
        <div class="nm-ic">${icon(NM_IC[i % 6])}</div>
        <h4>${c.title}</h4><p>${c.fact}</p>
      </div></span>
    </button>`).join("");
  $("#nmCards").addEventListener("click", (e) => {
    const c = e.target.closest(".nmc"); if (!c) return;
    c.classList.toggle("flipped");
    sfx(c.classList.contains("flipped") ? "flip" : "close");
    if ($$(".nmc.flipped").length === D.nightMarket.length) setTimeout(() => toast("ALL DEALS REVEALED · THE REAL DEAL IS HIRING AKSHAT"), 700);
  });

  /* =====================================================================
     INBOX
     ===================================================================== */
  const read = new Set(store.get("read", []));
  const INBOX_IC = { flo: "spark", cap: "cap", resume: "collection", patch: "logo" };
  function renderInboxList(active) {
    $("#inboxList").innerHTML = D.inbox.map((m, i) => `
      <button class="ib-item ${i === active ? "active" : ""} ${read.has(i) ? "" : "unread"}" data-i="${i}">
        <span class="ib-ic">${icon(INBOX_IC[m.art] === "logo" ? "star" : INBOX_IC[m.art])}</span>
        <span><b>${m.title}</b><small>${m.sub}</small></span>
      </button>`).join("");
    const unread = D.inbox.length - read.size;
    $("#mailBadge").textContent = unread;
    $("#mailBadge").classList.toggle("hide", unread <= 0);
  }
  function showMessage(i) {
    read.add(i); store.set("read", [...read]);
    const m = D.inbox[i];
    const art = m.art === "resume"
      ? `<img src="${D.projects.resume.img}" alt="">`
      : `<span class="iv-bl">${m.art === "flo" ? "FLO" : m.art === "cap" ? "2026" : "Patch"}</span>${icon(INBOX_IC[m.art], "iv-ic")}`;
    $("#inboxView").innerHTML = `<div class="iv-art">${art}</div>
      <div class="iv-copy"><div><h3>${m.title}</h3><p>${m.body}</p></div>
      <button class="btn-bone" data-go="${m.go}"><b>${m.cta}</b></button></div>`;
    renderInboxList(i);
  }
  function openInbox(i = 0) { showMessage(i); openLayer($("#inbox")); }
  $("#inboxList").addEventListener("click", (e) => { const b = e.target.closest(".ib-item"); if (b) showMessage(+b.dataset.i); });
  $("#mailBtn").addEventListener("click", () => openInbox(0));
  renderInboxList(-1);

  /* =====================================================================
     OVERLAYS
     ===================================================================== */
  const LAYERS = ["#inspect", "#contactModal", "#menuModal", "#inbox"];
  let lastFocus = null;
  function openLayer(el) {
    lastFocus = document.activeElement;
    el.classList.add("open"); sfx("open");
    const f = el.querySelector("input, button:not([data-close]), a[href]");
    setTimeout(() => f && f.focus({ preventScroll: true }), 60);
  }
  function closeLayer(el) { if (el.classList.contains("open")) { el.classList.remove("open"); sfx("close"); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); } }
  function closeTop() {
    if (match.classList.contains("on")) { dodge(); return true; }
    for (const s of LAYERS) { const el = $(s); if (el.classList.contains("open")) { closeLayer(el); return true; } }
    return false;
  }
  function closeAll() { LAYERS.forEach(s => $(s).classList.remove("open")); }
  $$(".modal").forEach(m => m.addEventListener("click", (e) => { if (e.target === m) closeLayer(m); }));

  /* ---- menu ---- */
  const menu = $("#menuModal");
  const menuView = (v) => {
    $$(".menu-view", menu).forEach(x => x.classList.toggle("active", x.dataset.mview === v));
    $("#menuTitle").textContent = v === "main" ? "MENU" : v.toUpperCase();
  };
  $("#gearBtn").addEventListener("click", () => { menuView("main"); openLayer(menu); });
  menu.addEventListener("click", (e) => { const b = e.target.closest("[data-mgo]"); if (b) menuView(b.dataset.mgo); });
  $("#exitBtn").addEventListener("click", () => {
    closeAll(); sfx("boom");
    $("#gg").classList.add("on");
  });
  $("#requeue").addEventListener("click", () => { location.hash = "lobby"; location.reload(); });

  function setSound(v) {
    settings.sound = v; store.set("sound", v); window.SFX.enabled = v;
    $("#setSound").classList.toggle("on", v);
    $("#pcMute").innerHTML = icon(v ? "sound" : "mute");
    if (v) sfx("toggle");
    toast(v ? "UI SOUND ON" : "UI SOUND OFF");
  }
  function setFx(v) { settings.fx = v; store.set("fx", v); FX.enabled = v; $("#setFx").classList.toggle("on", v); }
  function setXhair(v) { settings.xhair = v; store.set("xhair", v); document.body.classList.toggle("xh-on", v && !isTouch); $("#setXhair").classList.toggle("on", v); }
  function setXhColor(c) { settings.xhColor = c; store.set("xhColor", c); document.documentElement.style.setProperty("--xh", c); $$("#swatches button").forEach(b => b.classList.toggle("on", b.dataset.c === c)); }
  $("#setSound").addEventListener("click", () => setSound(!settings.sound));
  $("#setFx").addEventListener("click", () => { setFx(!settings.fx); sfx("toggle"); });
  $("#setXhair").addEventListener("click", () => { setXhair(!settings.xhair); sfx("toggle"); });
  $("#swatches").innerHTML = ["#37ffb0", "#00e5ff", "#ffe14d", "#ff4655", "#ffffff", "#ff7af5"].map(c => `<button data-c="${c}" style="--c:${c}" aria-label="Crosshair ${c}"></button>`).join("");
  $("#swatches").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { setXhColor(b.dataset.c); sfx("toggle"); } });
  // apply persisted settings quietly
  window.SFX.enabled = settings.sound;
  $("#setSound").classList.toggle("on", settings.sound);
  $("#pcMute").innerHTML = icon(settings.sound ? "sound" : "mute");
  setFx(settings.fx); setXhair(settings.xhair); setXhColor(settings.xhColor);

  /* ---- contact ---- */
  const CONTACT = {
    invite:   ["PARTY INVITE", "INVITE AKSHAT TO YOUR TEAM"],
    hire:     ["OPEN TO WORK", "LET'S BUILD SOMETHING"],
    support:  ["PLAYER SUPPORT", "HOW CAN I HELP?"],
    schedule: ["PREMIER SCHEDULING", "BOOK A CALL"],
    match:    ["MATCH ACCEPTED · LOCKED IN", "GG — NOW LET'S TALK"],
    chat:     ["PARTY CHAT", "SEND IT TO AKSHAT"]
  };
  let contactCtx = "hire";
  function openContact(kind, prefill = "") {
    let [k, t] = CONTACT[kind] || CONTACT.hire;
    let msg = prefill;
    if (kind && kind.startsWith("service:")) { const s = kind.slice(8); k = "STORE · PURCHASE"; t = s.toUpperCase(); msg = `Hi Akshat — I'm interested in: ${s}.\n\n`; }
    contactCtx = kind || "hire";
    $("#ctKicker").textContent = k; $("#ctTitle").textContent = t;
    const f = $("#contactForm");
    if (msg) f.msg.value = msg;
    LAYERS.filter(s => s !== "#contactModal").forEach(s => $(s).classList.remove("open"));
    openLayer($("#contactModal"));
  }
  $("#ctLinks").innerHTML = [
    ["mail", "Email", `mailto:${D.player.email}`, D.player.email],
    ["phone", "Call", `tel:${D.player.phone.replace(/[^+\d]/g, "")}`, D.player.phone],
    ...D.socials.map(s => [s.id, s.label, s.url, s.label]),
    ["download", "Resume", D.player.resume, "Resume (PDF)"]
  ].map(([ic, , href, label]) => `<a href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${icon(ic)}<span>${label}</span></a>`).join("");
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const subject = `[Portfolio · ${contactCtx.replace("service:", "").toUpperCase()}] ${f.name.value}`;
    const body = `${f.msg.value}\n\n— ${f.name.value}\n${f.email.value}`;
    window.location.href = `mailto:${D.player.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    sfx("lock");
    toast("INVITE SENT · OPENING YOUR MAIL CLIENT");
    setTimeout(() => { closeLayer($("#contactModal")); f.reset(); }, 900);
  });

  /* =====================================================================
     PARTY CHAT
     ===================================================================== */
  const log = $("#chatLog");
  const say = (who, text, sys) => {
    const p = document.createElement("p"); if (sys) p.className = "sys";
    p.innerHTML = `<b>${who}</b> ${text}`;
    log.appendChild(p);
    while (log.children.length > 4) log.firstChild.remove();
    setTimeout(() => p.remove(), 10000);
  };
  function startChat() {
    say("[SYSTEM]", "Akshat has joined the party.", true);
    setTimeout(() => say("Akshat:", "gl hf — hit FIND MATCH to hire me"), 2600);
    setTimeout(() => say("[SYSTEM]", "Keys 1–8 switch tabs · Esc opens the menu", true), 6500);
  }
  $("#chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#chatInput").value.trim(); if (!v) return;
    say("You:", v.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])));
    $("#chatInput").value = ""; $("#chatInput").blur();
    setTimeout(() => say("Akshat:", "got it — drop your email so I can reply"), 700);
    setTimeout(() => openContact("chat", v), 1300);
  });

  /* =====================================================================
     KEYBOARD
     ===================================================================== */
  document.addEventListener("keydown", (e) => {
    if (!started) { if (pre.classList.contains("ready")) startClient(); return; }
    const typing = /input|textarea/i.test(document.activeElement.tagName);
    if (e.key === "Escape") { e.preventDefault(); if (!closeTop()) { menuView("main"); openLayer(menu); } return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (match.classList.contains("select") && e.key === "Enter") { lockIn(); return; }
    const k = e.key.toLowerCase();
    const tab = $(`.tab[data-key="${k}"]`);
    if (tab) { closeAll(); go(tab.dataset.go); }
    else if (k === "p") { closeAll(); go("lobby"); }
    else if (k === "m") openInbox(0);
    else if (k === "arrowright" && $("#inspect").classList.contains("open")) $("[data-nav='1']").click();
    else if (k === "arrowleft" && $("#inspect").classList.contains("open")) $("[data-nav='-1']").click();
  });

  /* =====================================================================
     CROSSHAIR · TOOLTIP · HOVER SOUND
     ===================================================================== */
  const xh = $("#xhair");
  const INTERACTIVE = "button, a, input, textarea, [data-tip], label";
  let mx = -100, my = -100, xhRaf = 0;
  const placeXh = () => { xh.style.transform = `translate(${mx}px, ${my}px)`; xhRaf = 0; };
  if (!isTouch) {
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!xhRaf) xhRaf = requestAnimationFrame(placeXh);
    }, { passive: true });
    window.addEventListener("pointerdown", (e) => {
      if (!settings.xhair || e.button !== 0) return;
      xh.classList.add("fire");
      setTimeout(() => xh.classList.remove("fire"), 90);
      if (!e.target.closest(INTERACTIVE) && started) {
        const hm = document.createElement("i"); hm.className = "hitmark";
        hm.style.left = e.clientX + "px"; hm.style.top = e.clientY + "px";
        document.body.appendChild(hm); setTimeout(() => hm.remove(), 360);
        sfx("shot");
      }
    });
  }

  const tip = $("#tip");
  let tipEl = null;
  document.addEventListener("pointerover", (e) => {
    const it = e.target.closest(INTERACTIVE);
    xh.classList.toggle("hover", !!it);
    if (it && it !== tipEl && started && !isTouch && !it.matches("input, textarea")) sfx("hover");
    const t = e.target.closest("[data-tip]");
    if (t !== tipEl) {
      tipEl = t;
      if (t && !isTouch) {
        tip.textContent = t.dataset.tip;
        const r = t.getBoundingClientRect();
        let x = r.left + r.width / 2, y = r.bottom + 8;
        if (r.right > window.innerWidth - 80) { x = r.left - 8 - tip.offsetWidth / 2; y = r.top + r.height / 2 - 12; }
        x = Math.max(tip.offsetWidth / 2 + 6, Math.min(window.innerWidth - tip.offsetWidth / 2 - 6, x));
        tip.style.left = x + "px"; tip.style.top = y + "px";
        tip.classList.add("on");
      } else tip.classList.remove("on");
    }
  });
  window.addEventListener("scroll", () => tip.classList.remove("on"), true);

  /* ------------------------------------------------ boot */
  app.dataset.theme = "lobby";
  FX.theme("lobby");
})();
