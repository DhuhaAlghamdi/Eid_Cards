// =============================================
//  MLSAC Eid Generator — script.js
// =============================================

let majorTemplate = 0;

function chooseMajor(n) {
  majorTemplate = n;
  document.getElementById('mainOpt1').classList.toggle('active', n === 1);
  document.getElementById('mainOpt2').classList.toggle('active', n === 2);

  setTimeout(() => {
    document.getElementById('step1').classList.add('hidden');
    if (n === 1) {
      document.getElementById('step2A').classList.remove('hidden');
      setTimeout(() => document.getElementById('nameA').focus(), 100);
    } else {
      document.getElementById('step2B').classList.remove('hidden');
      setTimeout(() => document.getElementById('nameB').focus(), 100);
    }
  }, 200);
}

function goBack() {
  document.getElementById('step2A').classList.add('hidden');
  document.getElementById('step2B').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
  scrollToTop();
}

function goBackFromResult() {
  document.getElementById('resultSection').classList.add('hidden');
  ['clubCard', 'genCard1'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('mainOpt1').classList.remove('active');
  document.getElementById('mainOpt2').classList.remove('active');

  ['nameA', 'roleA', 'nameB'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  scrollToTop();
}

function scrollToTop() {
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
}

function requireName(inputId) {
  const el = document.getElementById(inputId);
  const val = el.value.trim();

  if (!val) {
    el.focus();
    el.style.borderColor = '#F25022';
    el.style.boxShadow = '0 0 0 3px rgba(242,80,34,.2)';
    el.classList.add('input-error');

    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
      el.classList.remove('input-error');
    }, 1400);

    return null;
  }

  return val;
}

const STAR_POSITIONS = [
  [8, 12], [15, 55], [88, 10], [82, 60],
  [50, 6], [50, 94], [22, 30], [75, 30]
];

function buildClubStars() {
  const container = document.getElementById('clubStars');
  if (!container) return;

  container.innerHTML = '';

  STAR_POSITIONS.forEach(([x, y], i) => {
    const star = document.createElement('div');
    star.style.cssText = `
      position:absolute;
      left:${x}%;
      top:${y}%;
      color:rgba(255,255,255,${0.3 + Math.random() * 0.5});
      font-size:${Math.random() * 10 + 8}px;
      animation:popTwinkle ${2 + Math.random() * 2}s ${i * 0.2}s infinite;
      pointer-events:none;
    `;
    star.textContent = Math.random() > 0.5 ? '✦' : '✧';
    container.appendChild(star);
  });
}

const FESTIVE_POS = [
  [8, 10], [14, 16], [86, 10], [80, 18],
  [11, 82], [86, 76], [50, 8], [50, 92],
  [30, 25], [70, 75], [20, 60], [80, 40]
];

function buildFestiveDecor(containerId, colorA, colorB) {
  const c = document.getElementById(containerId);
  if (!c) return;

  c.innerHTML = '';

  FESTIVE_POS.forEach(([x, y], i) => {
    const el = document.createElement('div');
    el.className = 'c-confetti';
    el.style.cssText = `
      left:${x}%;
      top:${y}%;
      width:${Math.random() * 8 + 5}px;
      height:${Math.random() * 8 + 5}px;
      background:${Math.random() > 0.5 ? colorA : colorB};
      animation-delay:${i * 0.16}s;
      animation-duration:${2 + Math.random() * 2}s;
    `;
    c.appendChild(el);
  });
}

function generateClub() {
  const happyImg = document.getElementById('happyEidImg');
  if (happyImg) happyImg.src = 'image/happyeid.png';

  const name = requireName('nameA');
  if (!name) return;

  const role = document.getElementById('roleA').value.trim();
  document.getElementById('outName1').textContent = name;

  const roleEl = document.getElementById('outRole1');
  roleEl.textContent = role;
  roleEl.classList.toggle('show', !!role);

  buildClubStars();
  showResult('clubCard');
}

function generateGeneral() {
  const name = requireName('nameB');
  if (!name) return;

  document.getElementById('outName2').textContent = name;
  buildFestiveDecor('gen1Decor', '#ffffff', 'rgba(80,230,255,.9)');
  showResult('genCard1');
}

function showResult(visibleId) {
  ['step1', 'step2A', 'step2B'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  ['clubCard', 'genCard1'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const visible = document.getElementById(visibleId);
  if (visible) visible.classList.remove('hidden');

  const section = document.getElementById('resultSection');
  if (section) {
    section.classList.remove('hidden');
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }
}

// ══════════════════════════════════════════════
//  helpers
// ══════════════════════════════════════════════

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isSafariBrowser() {
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|EdgiOS|FxiOS/i.test(ua);
}

// تحميل صورة كـ base64 عبر fetch — يحل مشكلة tainted canvas في iOS
function loadImage(src) {
  return new Promise(resolve => {
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = reader.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      })
      .catch(() => resolve(null));
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// رسم النص العربي — data URL آمن لكل المتصفحات
function arabicTextToImage(text, opts = {}) {
  const fontSize = opts.fontSize || 48;
  const color = opts.color || '#ffffff';
  const fontFamily = opts.fontFamily || 'Cairo, Tajawal, sans-serif';
  const fontWeight = opts.fontWeight || '700';
  const canvasW = opts.width || 900;
  const canvasH = opts.height || Math.ceil(fontSize * 1.8);
  const safeText = escapeXML(text);

  const html = `<div xmlns="http://www.w3.org/1999/xhtml"
    style="width:${canvasW}px;height:${canvasH}px;
           display:flex;align-items:center;justify-content:center;
           direction:rtl;unicode-bidi:embed;
           font-family:${fontFamily};font-size:${fontSize}px;
           font-weight:${fontWeight};color:${color};
           white-space:nowrap;overflow:visible;"
  >${safeText}</div>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
    <foreignObject width="${canvasW}" height="${canvasH}">${html}</foreignObject>
  </svg>`;

  const encoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = encoded;
  });
}

// ══════════════════════════════════════════════
//  html2canvas helper (للأندرويد والديسكتوب)
// ══════════════════════════════════════════════

async function ensureHtml2Canvas() {
  if (window.html2canvas) return window.html2canvas;

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.html2canvas;
}

async function captureVisibleCardCanvas(cardEl) {
  const html2canvas = await ensureHtml2Canvas();
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  await wait(250);

  const rect = cardEl.getBoundingClientRect();
  const scale = Math.min(Math.max(window.devicePixelRatio || 2, 2), 3);

  return await html2canvas(cardEl, {
    backgroundColor: null,
    useCORS: true,
    allowTaint: false,
    scale,
    logging: false,
    imageTimeout: 0,
    removeContainer: true,
    foreignObjectRendering: false,
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const clonedCard = clonedDoc.getElementById(cardEl.id);
      if (!clonedCard) return;

      clonedDoc.querySelectorAll('*').forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.caretColor = 'transparent';
      });

      clonedCard.style.transform = 'none';
      clonedCard.style.filter = 'none';
      clonedCard.style.margin = '0';
    }
  });
}

// ══════════════════════════════════════════════
//  رسم Club Card
// ══════════════════════════════════════════════

async function drawClubCard() {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  const [logoImg, eidImg] = await Promise.all([
    loadImage('image/logo.png'),
    loadImage('image/happyeid.png')
  ]);

  // ── الخلفية ─────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, S * 0.6, S);
  bg.addColorStop(0, '#041530');
  bg.addColorStop(0.35, '#0a2568');
  bg.addColorStop(0.70, '#0d5bc9');
  bg.addColorStop(1, '#1a78e8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  const r1 = ctx.createRadialGradient(S * 0.3, 0, 0, S * 0.3, 0, S * 0.55);
  r1.addColorStop(0, 'rgba(80,230,255,0.13)');
  r1.addColorStop(1, 'transparent');
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, S, S);

  const r2 = ctx.createRadialGradient(S * 0.7, S, 0, S * 0.7, S, S * 0.55);
  r2.addColorStop(0, 'rgba(0,120,212,0.18)');
  r2.addColorStop(1, 'transparent');
  ctx.fillStyle = r2;
  ctx.fillRect(0, 0, S, S);

  // ── الشبكة ─────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.022)';
  ctx.lineWidth = 1;

  for (let x = 70; x < S - 70; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.lineTo(x, S - 190);
    ctx.stroke();
  }

  for (let y = 120; y < S - 190; y += 48) {
    ctx.beginPath();
    ctx.moveTo(70, y);
    ctx.lineTo(S - 70, y);
    ctx.stroke();
  }

  // ── نجوم ثابتة ──────────────────────────
  const stars = [
    [0.10, 0.18, '✦', 0.18, 10],
    [0.17, 0.28, '✧', 0.18, 9],
    [0.86, 0.17, '✦', 0.18, 10],
    [0.82, 0.28, '✧', 0.18, 9],
    [0.15, 0.53, '✦', 0.20, 10],
    [0.84, 0.53, '✦', 0.20, 10],
    [0.38, 0.44, '✧', 0.15, 8],
    [0.65, 0.44, '✧', 0.15, 8],
    [0.33, 0.82, '✧', 0.14, 8],
    [0.50, 0.92, '✦', 0.16, 9],
    [0.70, 0.82, '✧', 0.14, 8]
  ];

  stars.forEach(([xr, yr, ch, alpha, size]) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(ch, xr * S, yr * S);
    ctx.restore();
  });

  // ── الهيدر ──────────────────────────────
  const hdrH = S * 0.115;
  const hdrGrad = ctx.createLinearGradient(0, 0, 0, hdrH * 1.5);
  hdrGrad.addColorStop(0, 'rgba(0,8,30,0.90)');
  hdrGrad.addColorStop(1, 'rgba(0,8,30,0)');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(0, 0, S, hdrH * 1.5);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, hdrH);
  ctx.lineTo(S, hdrH);
  ctx.stroke();

  // اللوغو على اليمين
  const logoSize = 54;
  const logoX = S * 0.63;
  const logoY = 22;

  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(80,230,255,0.30)';
    ctx.shadowBlur = 14;
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  // النص على اليسار
  ctx.save();
  ctx.textAlign = 'right';
  ctx.direction = 'ltr';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 25px Cairo,Tajawal,sans-serif';
  ctx.fillText('Microsoft LSAC Club', S * 0.61, 48);
  ctx.restore();

  const arHeadImg = await arabicTextToImage('نادي مايكروسوفت', {
    fontSize: 19,
    color: '#50E6FF',
    width: 300,
    height: 36
  });

  if (arHeadImg) {
    ctx.drawImage(arHeadImg, S * 0.30, 55, 300, 36);
  }

  // ── الزخارف الجانبية ─────────────────────
  function drawBurst(cx, cy, flip = false) {
    const dir = flip ? -1 : 1;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.58)';
    ctx.lineWidth = 3;

    const rays = [
      [34, -30],
      [48, -12],
      [60, 6],
      [72, 24]
    ];

    rays.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + dir * dx, cy + dy);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawBurst(S * 0.15, S * 0.21, false);
  drawBurst(S * 0.85, S * 0.21, true);

  // ── كلمة عيد ─────────────────────────────
  if (eidImg) {
    const maxW = S * 0.50;
    const maxH = S * 0.18;
    const natR = eidImg.width / eidImg.height;

    let dW = maxW;
    let dH = dW / natR;

    if (dH > maxH) {
      dH = maxH;
      dW = dH * natR;
    }

    const dX = (S - dW) / 2;
    const dY = S * 0.31;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.20)';
    ctx.shadowBlur = 12;
    ctx.drawImage(eidImg, dX, dY, dW, dH);
    ctx.restore();
  }

  // ── كل عام وأنتم بخير ────────────────────
  const greetY = S * 0.525;

  ctx.fillStyle = '#FFB900';
  ctx.font = '700 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', S / 2 - 145, greetY + 4);
  ctx.fillText('✦', S / 2 + 145, greetY + 4);

  const greetImg = await arabicTextToImage('كل عام وأنتم بخير', {
    fontSize: 34,
    color: '#ffffff',
    fontWeight: '700',
    width: 430,
    height: 58
  });

  if (greetImg) {
    ctx.drawImage(greetImg, (S - 430) / 2, greetY - 28, 430, 58);
  }

  // ── البادج ───────────────────────────────
  const name = document.getElementById('outName1').textContent.trim();
  const role = document.getElementById('outRole1').textContent.trim();

  const bdgW = 255;
  const bdgH = role ? 92 : 68;
  const bdgX = (S - bdgW) / 2;
  const bdgY = S * 0.61;
  const bdgR = 16;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.24)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = 'rgba(255,255,255,0.17)';
  roundRect(ctx, bdgX, bdgY, bdgW, bdgH, bdgR);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.19)';
  ctx.lineWidth = 2;
  roundRect(ctx, bdgX, bdgY, bdgW, bdgH, bdgR);
  ctx.stroke();

  const gloss = ctx.createLinearGradient(0, bdgY, 0, bdgY + bdgH);
  gloss.addColorStop(0, 'rgba(255,255,255,0.10)');
  gloss.addColorStop(0.35, 'rgba(255,255,255,0.03)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  roundRect(ctx, bdgX, bdgY, bdgW, bdgH, bdgR);
  ctx.fill();

  const nameImg = await arabicTextToImage(name, {
    fontSize: role ? 28 : 31,
    color: '#ffffff',
    fontFamily: 'Amiri, Cairo, Tajawal, sans-serif',
    width: bdgW,
    height: 46
  });

  if (nameImg) {
    ctx.drawImage(nameImg, bdgX, bdgY + 9, bdgW, 46);
  }

  if (role) {
    const roleImg = await arabicTextToImage(role, {
      fontSize: 18,
      color: '#50E6FF',
      fontFamily: 'Cairo, Tajawal, sans-serif',
      width: bdgW,
      height: 30
    });

    if (roleImg) {
      ctx.drawImage(roleImg, bdgX, bdgY + 49, bdgW, 30);
    }
  }

  // ── الفوتر ───────────────────────────────
  const ftTop = S * 0.865;
  const ftGrad = ctx.createLinearGradient(0, ftTop, 0, S);
  ftGrad.addColorStop(0, 'rgba(0,0,0,0)');
  ftGrad.addColorStop(1, 'rgba(0,0,0,0.26)');
  ctx.fillStyle = ftGrad;
  ctx.fillRect(0, ftTop, S, S - ftTop);

  const footerY = S * 0.935;

  const footerImg = await arabicTextToImage('عيد مبارك  ·  MLSA 2026  ·', {
    fontSize: 14,
    color: 'rgba(255,255,255,0.64)',
    width: 390,
    height: 26
  });

  if (footerImg) {
    ctx.drawImage(footerImg, (S - 390) / 2 - 10, footerY - 15, 390, 26);
  }

  // لوغو صغير يمين الفوتر
  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.70;
    ctx.drawImage(logoImg, S * 0.67, footerY - 13, 22, 22);
    ctx.restore();
  }

  return canvas;
}

// ══════════════════════════════════════════════
//  رسم General Card
// ══════════════════════════════════════════════

async function drawGeneralCard() {
  const W = 900;
  const H = 1200;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bgImg = await loadImage('image/eid.png');

  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#881c3c');
    g.addColorStop(1, '#d24a73');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  const ov = ctx.createLinearGradient(0, H * 0.5, 0, H);
  ov.addColorStop(0, 'rgba(0,0,0,0.05)');
  ov.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);

  const name = document.getElementById('outName2').textContent.trim();
  const bW = Math.min(W * 0.82, 700);
  const bH = 130;
  const bX = (W - bW) / 2;
  const bY = H * 0.72 - bH / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRect(ctx, bX, bY, bW, bH, 40);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, bX, bY, bW, bH, 40);
  ctx.stroke();

  const nameImg = await arabicTextToImage(name, {
    fontSize: 54,
    color: '#ffffff',
    fontFamily: 'Cairo, Tajawal, sans-serif',
    fontWeight: '900',
    width: bW,
    height: bH
  });

  if (nameImg) {
    ctx.drawImage(nameImg, bX, bY, bW, bH);
  }

  return canvas;
}

// ══════════════════════════════════════════════
//  عرض الصورة للحفظ (iOS)
// ══════════════════════════════════════════════

function showImagePreviewForSave(dataURL) {
  let overlay = document.getElementById('savePreviewOverlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'savePreviewOverlay';
    overlay.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(3,10,25,0.96);
      z-index:999999;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      padding:20px;
      box-sizing:border-box;
      gap:16px;
    `;

    overlay.innerHTML = `
      <div style="color:#fff;text-align:center;line-height:1.9;font-size:15px;max-width:320px;">
        اضغطي مطولًا على الصورة ثم اختاري <b>حفظ الصورة</b>
      </div>
      <img id="savePreviewImage" alt="بطاقة المعايدة" style="
        max-width:92vw;
        max-height:68vh;
        width:auto;
        height:auto;
        border-radius:18px;
        box-shadow:0 12px 40px rgba(0,0,0,.35);
        display:block;
      ">
      <button id="closeSavePreviewBtn" style="
        border:none;
        border-radius:14px;
        padding:12px 22px;
        font-size:15px;
        font-weight:700;
        background:#FFB900;
        color:#111;
        cursor:pointer;
      ">إغلاق</button>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeSavePreviewBtn').addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }

  overlay.querySelector('#savePreviewImage').src = dataURL;
  overlay.style.display = 'flex';
}

// ══════════════════════════════════════════════
//  Download
// ══════════════════════════════════════════════

async function downloadCard() {
  const card = ['clubCard', 'genCard1']
    .map(id => document.getElementById(id))
    .find(el => el && !el.classList.contains('hidden'));

  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.innerHTML = 'جاري التحميل...';
  btn.disabled = true;

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await wait(350);

    const isIOS = isIOSDevice();
    let canvas;

    if (isIOS) {
      canvas = card.id === 'clubCard'
        ? await drawClubCard()
        : await drawGeneralCard();
    } else {
      try {
        canvas = await captureVisibleCardCanvas(card);
      } catch (err) {
        console.warn('html2canvas failed, using manual draw:', err);
        canvas = card.id === 'clubCard'
          ? await drawClubCard()
          : await drawGeneralCard();
      }
    }

    const dataURL = canvas.toDataURL('image/png');

    if (isIOS) {
      showImagePreviewForSave(dataURL);
    } else {
      const link = document.createElement('a');
      link.download = 'mlsac-eid-1447.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    btn.innerHTML = '<span>✅</span> <span>تم!</span>';
    setTimeout(() => {
      btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
      btn.disabled = false;
    }, 2200);

  } catch (err) {
    console.error(err);
    alert('حدث خطأ: ' + err.message);
    btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
    btn.disabled = false;
  }
}

// ══════════════════════════════════════════════
//  Floating shapes + Particles
// ══════════════════════════════════════════════

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  if (!container) return;

  const colors = ['#0078D4', '#50E6FF', '#FFB900', '#7FBA00'];
  const shapes = ['◆', '✦', '●', '▪'];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';

    const size = Math.random() * 12 + 4;
    const useEmoji = Math.random() > 0.5;

    el.style.cssText = `
      left:${Math.random() * 100}%;
      bottom:-60px;
      width:${size}px;
      height:${size}px;
      ${useEmoji
        ? `color:${colors[Math.floor(Math.random() * colors.length)]};font-size:${size}px;`
        : `background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '3px'};transform:rotate(45deg);`
      }
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 12}s;
    `;

    if (useEmoji) {
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    }

    container.appendChild(el);
  }
}

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#50E6FF' : '#FFB900'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > W) p.speedX *= -1;
      if (p.y < 0 || p.y > H) p.speedY *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (!document.getElementById('step2A').classList.contains('hidden')) {
      generateClub();
    } else if (!document.getElementById('step2B').classList.contains('hidden')) {
      generateGeneral();
    }
  }
});

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake{
    0%,100%{transform:translateX(0)}
    15%{transform:translateX(-8px)}
    30%{transform:translateX(8px)}
    45%{transform:translateX(-6px)}
    60%{transform:translateX(6px)}
    75%{transform:translateX(-3px)}
    90%{transform:translateX(3px)}
  }
  .input-error{
    animation:shake .35s ease both !important;
  }
`;
document.head.appendChild(shakeStyle);

createFloatingShapes();
initParticleCanvas();
