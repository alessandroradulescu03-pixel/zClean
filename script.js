/* =========================================================
   ZClean – sito demo
   ---------------------------------------------------------
   PREZZI: sono indicativi per la demo. Quando ZClean ti dà
   le sue tariffe, cambia solo i numeri qui sotto.
   ========================================================= */
const CONFIG = {
  whatsapp: '393914060514',

  // Calcolatore case: prezzo = base + camere × camera + bagni × bagno
  casa: {
    ordinaria: { nome: 'Pulizia ordinaria', base: 45, camera: 14, bagno: 16 },
    profonda:  { nome: 'Pulizia profonda',  base: 80, camera: 25, bagno: 28 },
    fine:      { nome: 'Fine locazione',    base: 110, camera: 32, bagno: 35 },
  },
  extra: [
    { id: 'forno',   nome: 'Interno forno',           prezzo: 25, minuti: 30 },
    { id: 'frigo',   nome: 'Interno frigorifero',     prezzo: 20, minuti: 25 },
    { id: 'vetri',   nome: 'Vetri e infissi',         prezzo: 40, minuti: 60 },
    { id: 'balcone', nome: 'Balcone o terrazzo',      prezzo: 25, minuti: 30 },
    { id: 'armadi',  nome: 'Interno armadi e pensili', prezzo: 35, minuti: 45 },
    { id: 'letti',   nome: 'Cambio lenzuola',         prezzo: 8,  minuti: 10, perCamera: true },
  ],
  euroOra: 24, // per stimare la durata del lavoro

  // Calcolatore aziende: € al m² per passaggio
  azienda: {
    ufficio:    { nome: 'ufficio',       mq: 0.32, lista: ['Scrivanie e postazioni spolverate', 'Bagni e area break igienizzati', 'Cestini svuotati e raccolta differenziata', 'Pavimenti aspirati e lavati'] },
    studio:     { nome: 'studio medico', mq: 0.46, lista: ['Ambulatori e sala d\'attesa sanificati', 'Superfici di contatto disinfettate', 'Bagni igienizzati a ogni passaggio', 'Pavimenti lavati con prodotti specifici'] },
    negozio:    { nome: 'negozio',       mq: 0.38, lista: ['Vetrine pulite dentro e fuori', 'Pavimenti e camerini', 'Scaffali e bancone spolverati', 'Bagno e magazzino'] },
    palestra:   { nome: 'palestra',      mq: 0.42, lista: ['Attrezzi e panche igienizzati', 'Spogliatoi e docce', 'Specchi e vetri senza aloni', 'Pavimenti tecnici e in gomma'] },
    condominio: { nome: 'condominio',    mq: 0.28, lista: ['Androne, scale e pianerottoli', 'Ascensore, pulsantiere e corrimano', 'Vetri del portone d\'ingresso', 'Calendario fisso con report'] },
  },
  minimoPassaggio: 45,
  sconto: { 1: 0, 2: 0.05, 3: 0.08, 5: 0.12, 7: 0.15 },
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const euro = n => Math.round(n).toLocaleString('it-IT');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

// Esegue fn quando il loader ha finito (o subito, se ha già finito)
let siteReady = false;
const readyQueue = [];
const onReady = fn => (siteReady ? fn() : readyQueue.push(fn));

/* =========================================================
   1. LOADER – schermo sporco pulito dal tergivetro
   ========================================================= */
(function loader() {
  const box = $('#loader');
  const dirt = $('#dirt');
  const fx = $('#wiper');
  const pctEl = $('#ldPct');
  const ring = $('#ringBar');
  const RING = 326.7;
  const dctx = dirt.getContext('2d');
  const fctx = fx.getContext('2d');
  let W, H, dpr;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    [dirt, fx].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const r = (a, b) => a + Math.random() * (b - a);

  function paintDirt() {
    const c = dctx;
    c.clearRect(0, 0, W, H);
    // patina di sporco di base
    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, 'rgba(112,94,64,.80)');
    g.addColorStop(.5, 'rgba(96,80,56,.84)');
    g.addColorStop(1, 'rgba(78,64,44,.88)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);

    // macchie scure
    for (let i = 0; i < 70; i++) {
      const x = r(0, W), y = r(0, H), rad = r(30, 220);
      const rg = c.createRadialGradient(x, y, 0, x, y, rad);
      rg.addColorStop(0, `rgba(52,38,22,${r(.18, .5)})`);
      rg.addColorStop(1, 'rgba(52,38,22,0)');
      c.fillStyle = rg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
    // zone di polvere chiara
    for (let i = 0; i < 26; i++) {
      const x = r(0, W), y = r(0, H), rad = r(60, 260);
      const rg = c.createRadialGradient(x, y, 0, x, y, rad);
      rg.addColorStop(0, `rgba(190,170,128,${r(.12, .28)})`);
      rg.addColorStop(1, 'rgba(190,170,128,0)');
      c.fillStyle = rg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
    // ditate e strisciate
    c.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      c.strokeStyle = `rgba(215,198,160,${r(.07, .16)})`;
      c.lineWidth = r(16, 48);
      c.beginPath();
      const x = r(0, W), y = r(0, H);
      c.moveTo(x, y);
      c.bezierCurveTo(x + r(-150, 150), y + r(-80, 80), x + r(-200, 200), y + r(-120, 120), x + r(-260, 260), y + r(-140, 140));
      c.stroke();
    }
    // aloni d'acqua
    for (let i = 0; i < 34; i++) {
      const x = r(0, W), y = r(0, H), rad = r(5, 26);
      c.fillStyle = `rgba(150,128,90,${r(.1, .22)})`;
      c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
      c.strokeStyle = `rgba(48,34,18,${r(.25, .5)})`;
      c.lineWidth = r(1, 2.2);
      c.beginPath(); c.arc(x, y, rad, 0, 7); c.stroke();
    }
    // colature
    for (let i = 0; i < 12; i++) {
      const x = r(0, W), y = r(-20, H * .6), len = r(50, 200), w = r(2, 5);
      const lg = c.createLinearGradient(x, y, x, y + len);
      lg.addColorStop(0, 'rgba(60,45,26,0)');
      lg.addColorStop(1, 'rgba(60,45,26,.45)');
      c.strokeStyle = lg; c.lineWidth = w;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + r(-6, 6), y + len); c.stroke();
      c.fillStyle = 'rgba(60,45,26,.5)';
      c.beginPath(); c.arc(x, y + len, w * 1.1, 0, 7); c.fill();
    }
    // granelli di polvere
    const n = Math.round(W * H / 700);
    for (let i = 0; i < n; i++) {
      c.fillStyle = `rgba(${r(30, 70) | 0},${r(22, 50) | 0},${r(10, 30) | 0},${r(.3, .85)})`;
      const s = r(.6, 2.6);
      c.fillRect(r(0, W), r(0, H), s, s);
    }
    // grana fine
    const nc = document.createElement('canvas');
    nc.width = nc.height = 140;
    const nx = nc.getContext('2d');
    const img = nx.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 34;
    }
    nx.putImageData(img, 0, 0);
    c.fillStyle = c.createPattern(nc, 'repeat');
    c.fillRect(0, 0, W, H);
  }

  // ---------------------------------------------------------
  // Percorso del tergivetro: movimento "a mano", casuale e curvo.
  // Passa su tutto lo schermo (righe o colonne a caso) con onde
  // e cerchi, e la lama resta sempre di traverso al movimento.
  // ---------------------------------------------------------
  let L, track, pathLen, lastD = 0;

  function buildPath() {
    L = Math.max(110, Math.min(200, Math.min(W, H) * .24));   // lunghezza lama
    const cell = L * 1.0;
    const cols = Math.max(2, Math.ceil(W / cell));
    const rows = Math.max(2, Math.ceil(H / cell));
    const vertical = Math.random() < .45;
    const jit = () => (Math.random() - .5) * cell * .55;
    const pts = [];
    if (!vertical) {
      for (let r = 0; r < rows; r++) {
        const cy = (r + .5) * H / rows;
        for (let k = 0; k < cols; k++) {
          const c = r % 2 ? cols - 1 - k : k;
          pts.push({ x: (c + .5) * W / cols + jit(), y: cy + jit() });
        }
      }
    } else {
      for (let c = 0; c < cols; c++) {
        const cx = (c + .5) * W / cols;
        for (let k = 0; k < rows; k++) {
          const r = c % 2 ? rows - 1 - k : k;
          pts.push({ x: cx + jit(), y: (r + .5) * H / rows + jit() });
        }
      }
    }
    // entra e esce da fuori schermo
    const f = pts[0], l = pts[pts.length - 1];
    pts.unshift(vertical ? { x: f.x, y: -L * 1.6 } : { x: -L * 1.6, y: f.y });
    pts.push({ x: l.x + (l.x > W / 2 ? L * 1.8 : -L * 1.8), y: l.y + (l.y > H / 2 ? L : -L) });

    // curva morbida che passa per tutti i punti (Catmull-Rom)
    let dense = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let t = 0; t < 1; t += 1 / 18) {
        const t2 = t * t, t3 = t2 * t;
        dense.push({
          x: .5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y: .5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        });
      }
    }
    dense.push(pts[pts.length - 1]);

    // onde e piccoli cerchi, come una mano che strofina
    const ph1 = Math.random() * 6.28, ph2 = Math.random() * 6.28;
    let d = 0;
    const withWiggle = dense.map((q, i) => {
      if (i) d += Math.hypot(q.x - dense[i - 1].x, q.y - dense[i - 1].y);
      const a = dense[Math.min(i + 1, dense.length - 1)], b = dense[Math.max(i - 1, 0)];
      const tx = a.x - b.x, ty = a.y - b.y, tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl;
      const w = Math.sin(d / L * 2.2 + ph1) * L * .26 + Math.sin(d / L * 5.3 + ph2) * L * .1;
      const u = Math.cos(d / L * 5.3 + ph2) * L * .1; // componente lungo il percorso → piccoli cerchi
      return { x: q.x + nx * w + (tx / tl) * u, y: q.y + ny * w + (ty / tl) * u };
    });

    // distanze e angolo della lama (perpendicolare al movimento, ammorbidito)
    track = [];
    let acc = 0, prevAng = 0;
    withWiggle.forEach((q, i) => {
      if (i) acc += Math.hypot(q.x - withWiggle[i - 1].x, q.y - withWiggle[i - 1].y);
      const a = withWiggle[Math.min(i + 2, withWiggle.length - 1)], b = withWiggle[Math.max(i - 2, 0)];
      let ang = Math.atan2(a.y - b.y, a.x - b.x);
      while (ang - prevAng > Math.PI) ang -= 2 * Math.PI;
      while (ang - prevAng < -Math.PI) ang += 2 * Math.PI;
      prevAng = ang;
      track.push({ x: q.x, y: q.y, ang, d: acc });
    });
    const win = 7;
    track = track.map((q, i) => {
      let s = 0, n = 0;
      for (let k = Math.max(0, i - win); k <= Math.min(track.length - 1, i + win); k++) { s += track[k].ang; n++; }
      return { ...q, ang: s / n };
    });
    pathLen = acc;
    lastD = 0;
  }

  // posizione e angolo della lama a una certa distanza sul percorso
  let hint = 0;
  function pose(dist) {
    dist = Math.max(0, Math.min(pathLen, dist));
    while (hint > 0 && track[hint].d > dist) hint--;
    while (hint < track.length - 2 && track[hint + 1].d < dist) hint++;
    const a = track[hint], b = track[hint + 1] || a;
    const t = b.d > a.d ? (dist - a.d) / (b.d - a.d) : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, ang: a.ang + (b.ang - a.ang) * t };
  }

  // cancella lo sporco nella striscia spazzata dalla lama
  // (una lama di traverso che avanza = un tratto largo quanto la lama)
  function wipe(p) {
    const target = p * pathLen;
    if (target <= lastD) return;
    dctx.save();
    dctx.globalCompositeOperation = 'destination-out';
    dctx.strokeStyle = '#000';
    dctx.lineWidth = L;
    dctx.lineCap = 'round';
    dctx.lineJoin = 'round';
    dctx.beginPath();
    let q = pose(lastD);
    dctx.moveTo(q.x, q.y);
    for (let dd = lastD + 6; dd < target; dd += 6) { q = pose(dd); dctx.lineTo(q.x, q.y); }
    q = pose(target);
    dctx.lineTo(q.x, q.y);
    dctx.stroke();
    dctx.restore();
    lastD = target;
  }

  function drawSqueegee(p) {
    const c = fctx;
    c.clearRect(0, 0, W, H);
    if (p <= 0 || p >= 1) return;
    const q = pose(p * pathLen);
    c.save();
    c.translate(q.x, q.y);
    c.rotate(q.ang);            // asse x locale = direzione del movimento
    const h = L / 2;

    // scia bagnata dietro la lama
    const wg = c.createLinearGradient(0, 0, -50, 0);
    wg.addColorStop(0, 'rgba(255,255,255,.5)');
    wg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = wg;
    c.fillRect(-50, -h, 50, L);
    // goccioline sul bordo
    c.fillStyle = 'rgba(255,255,255,.75)';
    for (let i = 0; i < 4; i++) {
      c.beginPath(); c.arc(8, -h + L * ((i * .29 + p * 7) % 1), 2, 0, 7); c.fill();
    }

    // lama
    c.lineCap = 'round';
    c.save();
    c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 14; c.shadowOffsetX = 4; c.shadowOffsetY = 6;
    c.strokeStyle = '#f2c200'; c.lineWidth = 13;
    c.beginPath(); c.moveTo(-5, -h); c.lineTo(-5, h); c.stroke();
    c.restore();
    c.strokeStyle = '#15181d'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(3, -h + 2); c.lineTo(3, h - 2); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-9, -h + 4); c.lineTo(-9, h - 4); c.stroke();

    // manico
    const Lh = Math.max(64, Math.min(100, L * .62));
    c.save();
    c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 12; c.shadowOffsetX = 4; c.shadowOffsetY = 6;
    c.strokeStyle = '#ffd43b'; c.lineWidth = 17;
    c.beginPath(); c.moveTo(-14, 0); c.lineTo(-14 - Lh, 0); c.stroke();
    c.restore();
    c.lineCap = 'butt';
    c.strokeStyle = '#15181d'; c.lineWidth = 17;
    c.beginPath(); c.moveTo(-14 - Lh * .5, 0); c.lineTo(-14 - Lh, 0); c.stroke();
    c.strokeStyle = '#2d323b'; c.setLineDash([3, 5]);
    c.beginPath(); c.moveTo(-14 - Lh * .5, 0); c.lineTo(-14 - Lh, 0); c.stroke();
    c.setLineDash([]);
    c.fillStyle = '#15181d';
    c.beginPath(); c.arc(-14 - Lh, 0, 8.5, 0, 7); c.fill();
    c.strokeStyle = '#15181d'; c.lineWidth = 10; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-4, 0); c.lineTo(-14, 0); c.stroke();
    c.restore();
  }

  function setPct(p) {
    const v = Math.round(p * 100);
    pctEl.textContent = v + '%';
    ring.style.strokeDashoffset = RING * (1 - p);
  }

  // Avanzamento reale: immagini della pagina + font
  const imgs = $$('img').filter(i => i.loading !== 'lazy');
  let loaded = 0;
  const total = imgs.length + 1;
  const tick = () => { loaded++; };
  imgs.forEach(i => {
    if (i.complete) tick();
    else { i.addEventListener('load', tick, { once: true }); i.addEventListener('error', tick, { once: true }); }
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(tick);

  const MIN = 4000;   // durata minima, così l'effetto si vede sempre
  const MAX = 7000;   // oltre questo tempo chiude comunque
  const t0 = performance.now();
  let shown = 0;

  function finish() {
    dctx.clearRect(0, 0, W, H);
    fctx.clearRect(0, 0, W, H);
    setPct(1);
    box.classList.add('done');
    document.body.classList.remove('loading');
    siteReady = true;
    readyQueue.splice(0).forEach(fn => fn());
    setTimeout(() => box.remove(), 700);
  }

  if (reduceMotion) { finish(); return; }

  size();
  paintDirt();
  buildPath();
  addEventListener('resize', () => { if (!box.isConnected) return; size(); paintDirt(); buildPath(); wipe(shown); }, { passive: true });

  function frame(now) {
    const el = now - t0;
    const real = el > MAX ? 1 : loaded / total;
    const time = Math.min(1, el / MIN);
    const target = Math.min(real, time);
    shown += (target - shown) * .2;
    if (target >= 1 && shown > .995) shown = 1;
    wipe(shown);
    // l'ultimo sporco rimasto sfuma via mentre il tergivetro finisce
    dirt.style.opacity = shown < .8 ? 1 : Math.max(0, 1 - (shown - .8) / .2);
    drawSqueegee(shown);
    setPct(shown);
    if (shown >= 1) finish();
    else requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* =========================================================
   2. HEADER, MENU MOBILE, BARRA IN BASSO
   ========================================================= */
(function header() {
  const head = $('.site-header');
  const burger = $('#burger');
  const nav = $('#mainNav');
  const bar = $('#mobileBar');
  const hero = $('.hero');

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));

  const onScroll = () => {
    head.classList.toggle('scrolled', scrollY > 10);
    bar.classList.toggle('show', scrollY > hero.offsetHeight * .6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('#year').textContent = new Date().getFullYear();
})();

/* =========================================================
   3. COMPARSA AL SCROLL, CONTATORI, STELLINE
   ========================================================= */
function addStars(el) {
  // posizioni delle stelline attorno al testo (in %)
  const spots = [
    [-6, -30, 20, 0], [18, -48, 14, .08], [42, -38, 24, .16], [70, -52, 16, .24], [96, -30, 22, .32],
    [104, 30, 14, .4], [80, 92, 18, .48], [50, 100, 12, .56], [8, 88, 16, .64], [-10, 40, 12, .72],
  ];
  spots.forEach(([x, y, s, d]) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('star');
    svg.style.cssText = `--x:${x}%;--y:${y}%;--s:${s}px;--d:${d}s`;
    svg.innerHTML = '<path d="M12 0c.8 6.5 4.6 10.9 12 12-7.4 1.1-11.2 5.5-12 12-.8-6.5-4.6-10.9-12-12C7.4 10.9 11.2 6.5 12 0z"/>';
    el.appendChild(svg);
  });
}

function countUp(el) {
  const to = +el.dataset.count;
  const t0 = performance.now();
  const dur = 1600;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function startObservers() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains('reveal')) el.classList.add('in');
      if (el.matches('.sparkle, .hl')) el.classList.add('lit');
      if (el.dataset.count) countUp(el);
      io.unobserve(el);
    });
  }, { threshold: .2, rootMargin: '0px 0px -40px 0px' });

  // piccolo ritardo a cascata per gli elementi vicini
  $$('.services .reveal, .stats .reveal').forEach((el, i) => el.style.setProperty('--rd', (i % 3) * .08 + 's'));
  // l'hero è già visibile sotto lo sporco, così il tergivetro "scopre" il sito
  $$('.hero .reveal').forEach(el => el.classList.add('in'));
  $$('.reveal, [data-count]').forEach(el => io.observe(el));
  // evidenziatore e stelline partono solo a pulizia finita
  $$('.sparkle').forEach(addStars);
  onReady(() => $$('.sparkle, .hl').forEach(el => io.observe(el)));
}
startObservers();

/* =========================================================
   4. SPRUZZINI E SPUGNA CHE SI MUOVONO CON LO SCROLL
   ========================================================= */
(function parallax() {
  if (reduceMotion) return;
  const items = $$('.float');
  let ticking = false;
  function update() {
    const vh = innerHeight;
    items.forEach(el => {
      const host = el.parentElement.getBoundingClientRect();
      if (host.bottom < -200 || host.top > vh + 200) return;
      const d = host.top + host.height / 2 - vh / 2;
      const y = d * (+el.dataset.speed || 0);
      const rot = (+el.dataset.base || 0) + d * (+el.dataset.rot || 0);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    });
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();

/* =========================================================
   5. BOLLE DI SAPONE
   ========================================================= */
$$('[data-bubbles]').forEach(box => {
  if (reduceMotion) return;
  const n = +box.dataset.bubbles;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const s = 8 + Math.random() * 38;
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;--dur:${9 + Math.random() * 12}s;--delay:${-Math.random() * 20}s;--drift:${(Math.random() - .5) * 80}px`;
    box.appendChild(b);
  }
});

/* =========================================================
   6. SLIDER PRIMA / DOPO CON IL TERGIVETRO
   ========================================================= */
(function beforeAfter() {
  const ba = $('#ba');
  const range = $('.ba-range', ba);
  let pos = 55;
  let touched = false;

  const set = v => {
    pos = Math.max(0, Math.min(100, v));
    ba.style.setProperty('--pos', pos + '%');
    range.value = Math.round(pos);
  };
  const fromEvent = e => {
    const r = ba.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  const touch = () => { touched = true; ba.classList.add('touched'); };

  let dragging = false;
  ba.addEventListener('pointerdown', e => {
    dragging = true; touch();
    ba.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  ba.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
  ['pointerup', 'pointercancel'].forEach(t => ba.addEventListener(t, () => { dragging = false; }));
  range.addEventListener('input', () => { touch(); set(+range.value); });

  // Animazione di invito: il tergivetro si muove da solo la prima volta
  const hint = () => {
    if (touched || reduceMotion) return;
    const keys = [55, 82, 22, 55];
    const t0 = performance.now();
    const seg = 700;
    const step = now => {
      if (touched) return;
      const t = (now - t0) / seg;
      const i = Math.floor(t);
      if (i >= keys.length - 1) { set(keys[keys.length - 1]); return; }
      const f = t - i;
      const e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      set(keys[i] + (keys[i + 1] - keys[i]) * e);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  onReady(() => setTimeout(hint, 900));
})();

/* =========================================================
   7. CALCOLATORE CASE
   ========================================================= */
function animateNumber(el, to) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  if (from === to) return;
  const t0 = performance.now();
  const dur = 450;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = euro(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  el.parentElement.classList.remove('bump');
  void el.parentElement.offsetWidth;
  el.parentElement.classList.add('bump');
}

(function homeCalc() {
  const form = $('#homeCalc');
  const extrasBox = $('#extras');
  const state = { tipo: 'ordinaria', camere: 2, bagni: 1, extra: new Set() };

  extrasBox.innerHTML = CONFIG.extra.map(x => `
    <label class="extra">
      <input type="checkbox" value="${x.id}">
      <span>${x.nome}</span>
      <em>+€${x.prezzo}${x.perCamera ? '/camera' : ''}</em>
    </label>`).join('');

  form.addEventListener('change', e => {
    if (e.target.name === 'tipo') state.tipo = e.target.value;
    if (e.target.type === 'checkbox') {
      e.target.checked ? state.extra.add(e.target.value) : state.extra.delete(e.target.value);
    }
    render();
  });

  $$('.stepper', form).forEach(st => {
    const key = st.dataset.key;
    const min = +st.dataset.min, max = +st.dataset.max;
    const out = $('output', st);
    const [minus, plus] = $$('button', st);
    const sync = () => { out.textContent = state[key]; minus.disabled = state[key] <= min; plus.disabled = state[key] >= max; };
    st.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      state[key] = Math.max(min, Math.min(max, state[key] + +b.dataset.step));
      sync(); render();
    });
    sync();
  });

  function render() {
    const t = CONFIG.casa[state.tipo];
    const base = t.base + state.camere * t.camera + state.bagni * t.bagno;
    const lines = [{ label: `${t.nome} · ${state.camere} ${state.camere > 1 ? 'camere' : 'camera'}, ${state.bagni} ${state.bagni > 1 ? 'bagni' : 'bagno'}`, price: base }];
    let minutiExtra = 0;
    CONFIG.extra.forEach(x => {
      if (!state.extra.has(x.id)) return;
      const qty = x.perCamera ? state.camere : 1;
      lines.push({ label: x.nome + (x.perCamera ? ` (${qty})` : ''), price: x.prezzo * qty });
      minutiExtra += x.minuti * qty;
    });
    const total = lines.reduce((s, l) => s + l.price, 0);

    // durata e numero di operatori stimati
    const oreTot = base / CONFIG.euroOra + minutiExtra / 60;
    const team = oreTot > 4.5 ? 2 : 1;
    const ore = Math.max(1.5, Math.ceil((oreTot / team) * 2) / 2);

    $('#sumKicker').textContent = `${t.nome} · prezzo fisso`;
    animateNumber($('#sumPrice'), total);
    $('#sumLines').innerHTML = lines.map(l => `<li><span>${l.label}</span><b>€${euro(l.price)}</b></li>`).join('');
    $('#sumTime').textContent = `≈ ${String(ore).replace('.', ',')} ore`;
    $('#sumTeam').textContent = team === 1 ? '1 operatore' : '2 operatori';

    const extraTxt = lines.slice(1).map(l => l.label.toLowerCase()).join(', ');
    const msg = `Ciao ZClean! Vorrei prenotare: ${t.nome.toLowerCase()}, ${state.camere} ${state.camere > 1 ? 'camere' : 'camera'} e ${state.bagni} ${state.bagni > 1 ? 'bagni' : 'bagno'}` +
      (extraTxt ? `, con extra: ${extraTxt}` : '') +
      `. Prezzo dal sito: €${euro(total)}. Quando siete disponibili?`;
    $('#homeBook').href = waLink(msg);

    const mb = $('#mobileBook');
    mb.textContent = `Prenota a €${euro(total)}`;
    mb.href = waLink(msg);
    mb.target = '_blank';
  }
  render();
})();

/* =========================================================
   8. CALCOLATORE AZIENDE
   ========================================================= */
(function bizCalc() {
  const state = { tipo: 'ufficio', mq: 350, visite: 3 };
  const area = $('#bizArea');

  function radioGroup(box, key, cast = v => v) {
    box.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
      state[key] = cast(b.dataset.v);
      render();
    });
  }
  radioGroup($('#bizType'), 'tipo');
  radioGroup($('#bizVisits'), 'visite', Number);
  area.addEventListener('input', () => { state.mq = +area.value; render(); });

  let lastTipo = null;
  function render() {
    const t = CONFIG.azienda[state.tipo];
    const sconto = CONFIG.sconto[state.visite] || 0;
    const perVisita = Math.max(CONFIG.minimoPassaggio, Math.round(state.mq * t.mq * (1 - sconto) / 5) * 5);
    const mese = Math.round(perVisita * state.visite * 4.33 / 10) * 10;

    const fill = ((state.mq - area.min) / (area.max - area.min)) * 100;
    area.style.setProperty('--fill', fill + '%');
    $('#bizAreaOut').textContent = `${euro(state.mq)} m²`;
    animateNumber($('#bizPrice'), perVisita);
    $('#bizMonth').textContent = `Circa €${euro(mese)} al mese con ${state.visite} ${state.visite > 1 ? 'passaggi' : 'passaggio'} a settimana, anche di sera o di notte.`;
    if (lastTipo !== state.tipo) {
      $('#bizList').innerHTML = t.lista.map((x, i) => `<li style="animation-delay:${i * .06}s">${x}</li>`).join('');
      lastTipo = state.tipo;
    }
    const msg = `Ciao ZClean! Vorrei un sopralluogo gratuito per un ${t.nome} di circa ${euro(state.mq)} m², ${state.visite} ${state.visite > 1 ? 'passaggi' : 'passaggio'} a settimana. Stima dal sito: €${euro(perVisita)} a passaggio.`;
    $('#bizBook').href = waLink(msg);
  }
  render();
})();

/* =========================================================
   9. EFFETTO "30 SECONDI" NEL FOOTER
   Il tergivetro toglie il fango, il numero conta fino a 30,
   poi esplosione di stelline e riflesso che scorre.
   ========================================================= */
(function wow() {
  const el = $('#wow');
  if (!el) return;
  const num = $('.wow-num', el);
  const STAR = '<path d="M12 0c.8 6.5 4.6 10.9 12 12-7.4 1.1-11.2 5.5-12 12-.8-6.5-4.6-10.9-12-12C7.4 10.9 11.2 6.5 12 0z"/>';

  function burst() {
    const box = document.createElement('span');
    box.className = 'burst';
    el.appendChild(box);
    const ring = document.createElement('span');
    ring.className = 'burst-ring';
    box.appendChild(ring);
    ring.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(9)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'forwards' });

    const n = innerWidth < 600 ? 18 : 30;
    for (let i = 0; i < n; i++) {
      const star = i % 3 !== 0;
      const p = star ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement('span');
      if (star) { p.setAttribute('viewBox', '0 0 24 24'); p.innerHTML = STAR; p.classList.add('burst-star'); p.style.setProperty('--s', (10 + Math.random() * 18) + 'px'); }
      else p.className = 'burst-dot';
      box.appendChild(p);
      const ang = (i / n) * Math.PI * 2 + Math.random() * .4;
      const dist = 90 + Math.random() * (innerWidth < 600 ? 90 : 190);
      const x = Math.cos(ang) * dist * 1.4, y = Math.sin(ang) * dist * .8;
      p.animate([
        { transform: 'translate(0,0) scale(.2) rotate(0)', opacity: 1 },
        { transform: `translate(${x * .8}px, ${y * .8}px) scale(1.1) rotate(${180 * Math.random()}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${x}px, ${y + 40}px) scale(.3) rotate(${360 * Math.random()}deg)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(.15,.8,.3,1)', fill: 'forwards' });
    }
    setTimeout(() => box.remove(), 1700);
  }

  function count() {
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / 1000);
      num.textContent = Math.round(30 * (1 - Math.pow(1 - p, 2)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  let played = false;
  function play() {
    if (played) return;
    played = true;
    if (reduceMotion) return;
    el.classList.add('go');
    count();
    setTimeout(() => { el.classList.add('boom'); burst(); }, 1050);
  }

  // si riattiva passandoci sopra o toccandolo
  let last = 0;
  const again = () => {
    if (!el.classList.contains('boom') || performance.now() - last < 900) return;
    last = performance.now();
    el.classList.remove('boom'); void el.offsetWidth; el.classList.add('boom');
    burst();
  };
  el.addEventListener('mouseenter', again);
  el.addEventListener('click', again);

  onReady(() => {
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { play(); io.disconnect(); }
    }, { threshold: .9 });
    io.observe(el);
  });
})();
