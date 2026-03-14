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
  ['clubCard', 'genCard1'].forEach(id => document.getElementById(id).classList.add('hidden'));
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
    star.style.cssText = `position:absolute;left:${x}%;top:${y}%;color:rgba(255,255,255,${0.3 + Math.random() * 0.5});font-size:${Math.random() * 10 + 8}px;animation:popTwinkle ${2 + Math.random() * 2}s ${i * 0.2}s infinite;pointer-events:none;`;
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
    el.style.cssText = `left:${x}%;top:${y}%;width:${Math.random() * 8 + 5}px;height:${Math.random() * 8 + 5}px;background:${Math.random() > .5 ? colorA : colorB};animation-delay:${i * .16}s;animation-duration:${2 + Math.random() * 2}s;`;
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
  ['step1', 'step2A', 'step2B'].forEach(id => document.getElementById(id).classList.add('hidden'));
  ['clubCard', 'genCard1'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById(visibleId).classList.remove('hidden');
  const section = document.getElementById('resultSection');
  section.classList.remove('hidden');
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
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
          img.onload  = () => resolve(img);
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
  const fontSize   = opts.fontSize   || 48;
  const color      = opts.color      || '#ffffff';
  const fontFamily = opts.fontFamily || 'Cairo, Tajawal, sans-serif';
  const fontWeight = opts.fontWeight || '700';
  const canvasW    = opts.width      || 900;
  const canvasH    = opts.height     || Math.ceil(fontSize * 1.8);
  const safeText   = escapeXML(text);

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

  // data URL بدل createObjectURL — يحل مشكلة iOS Safari
  const encoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(img);
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
//  رسم Club Card — مطابق للموقع بالضبط
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

  // ────────────────────────────────────────────
  // الخلفية
  // ────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, S * 0.95, S);
  bg.addColorStop(0, '#041530');
  bg.addColorStop(0.30, '#0b2b72');
  bg.addColorStop(0.72, '#1262d2');
  bg.addColorStop(1, '#2d98ff');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  const topGlow = ctx.createRadialGradient(S * 0.5, S * 0.18, 0, S * 0.5, S * 0.18, S * 0.55);
  topGlow.addColorStop(0, 'rgba(80,230,255,0.10)');
  topGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, S, S);

  const bottomGlow = ctx.createRadialGradient(S * 0.5, S * 0.92, 0, S * 0.5, S * 0.92, S * 0.45);
  bottomGlow.addColorStop(0, 'rgba(255,255,255,0.08)');
  bottomGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, S, S);

  // ────────────────────────────────────────────
  // الشبكة
  // ────────────────────────────────────────────
  const gridTop = S * 0.14;
  const gridBottom = S * 0.83;
  const gridLeft = S * 0.06;
  const gridRight = S * 0.94;

  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;

  for (let x = gridLeft; x <= gridRight; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, gridTop);
    ctx.lineTo(x, gridBottom);
    ctx.stroke();
  }

  for (let y = gridTop; y <= gridBottom; y += 44) {
    ctx.beginPath();
    ctx.moveTo(gridLeft, y);
    ctx.lineTo(gridRight, y);
    ctx.stroke();
  }

  // ────────────────────────────────────────────
  // نجوم ثابتة
  // ────────────────────────────────────────────
  const stars = [
    { x: 0.11, y: 0.18, s: 10, a: 0.24, t: '✦' },
    { x: 0.19, y: 0.29, s: 8,  a: 0.20, t: '✧' },
    { x: 0.88, y: 0.18, s: 10, a: 0.24, t: '✦' },
    { x: 0.83, y: 0.29, s: 8,  a: 0.20, t: '✧' },
    { x: 0.16, y: 0.53, s: 9,  a: 0.25, t: '✦' },
    { x: 0.84, y: 0.53, s: 9,  a: 0.25, t: '✦' },
    { x: 0.50, y: 0.17, s: 7,  a: 0.18, t: '✧' },
    { x: 0.35, y: 0.44, s: 7,  a: 0.17, t: '✧' },
    { x: 0.65, y: 0.44, s: 7,  a: 0.17, t: '✧' },
    { x: 0.33, y: 0.83, s: 7,  a: 0.16, t: '✧' },
    { x: 0.50, y: 0.93, s: 8,  a: 0.18, t: '✦' },
    { x: 0.72, y: 0.83, s: 7,  a: 0.16, t: '✧' }
  ];

  stars.forEach(st => {
    ctx.save();
    ctx.globalAlpha = st.a;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${st.s}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(st.t, st.x * S, st.y * S);
    ctx.restore();
  });

  // ────────────────────────────────────────────
  // الهيدر
  // ────────────────────────────────────────────
  const hdrH = S * 0.12;

  const hdrGrad = ctx.createLinearGradient(0, 0, 0, hdrH * 1.4);
  hdrGrad.addColorStop(0, 'rgba(0,8,28,0.88)');
  hdrGrad.addColorStop(1, 'rgba(0,8,28,0)');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(0, 0, S, hdrH * 1.45);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, hdrH);
  ctx.lineTo(S, hdrH);
  ctx.stroke();

  const logoSize = 50;
  const blockCenterX = S * 0.50;
  const logoX = blockCenterX + 110;
  const logoY = 18;

  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(80,230,255,0.35)';
    ctx.shadowBlur = 14;
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'ltr';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px Cairo, Tajawal, sans-serif';
  ctx.fillText('Microsoft LSAC Club', blockCenterX - 10, 42);
  ctx.restore();

  const arHeadImg = await arabicTextToImage('نادي مايكروسوفت', {
    fontSize: 18,
    color: '#50E6FF',
    width: 280,
    height: 34
  });
  if (arHeadImg) {
    ctx.drawImage(arHeadImg, blockCenterX - 140, 52, 280, 34);
  }

  // ────────────────────────────────────────────
  // الزخارف الجانبية
  // ────────────────────────────────────────────
  function drawSideBurst(x, y, flip = false) {
    const dir = flip ? -1 : 1;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.62)';
    ctx.lineWidth = 3;

    const lines = [
      { dx: 28, dy: -26 },
      { dx: 42, dy: -10 },
      { dx: 55, dy: 6 },
      { dx: 68, dy: 23 }
    ];

    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dir * line.dx, y + line.dy);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawSideBurst(S * 0.16, S * 0.21, false);
  drawSideBurst(S * 0.84, S * 0.21, true);

  // ────────────────────────────────────────────
  // كلمة عيد
  // ────────────────────────────────────────────
  if (eidImg) {
    const maxW = S * 0.48;
    const maxH = S * 0.18;
    const natR = eidImg.width / eidImg.height;

    let dW = maxW;
    let dH = dW / natR;

    if (dH > maxH) {
      dH = maxH;
      dW = dH * natR;
    }

    const dX = (S - dW) / 2;
    const dY = S * 0.305;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.20)';
    ctx.shadowBlur = 12;
    ctx.drawImage(eidImg, dX, dY, dW, dH);
    ctx.restore();
  }

  // ────────────────────────────────────────────
  // سطر التهنئة
  // ────────────────────────────────────────────
  const greetY = S * 0.525;

  ctx.fillStyle = '#FFB900';
  ctx.font = '700 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', S / 2 - 145, greetY + 4);
  ctx.fillText('✦', S / 2 + 145, greetY + 4);

  const greetImg = await arabicTextToImage('كل عام وأنتم بخير', {
    fontSize: 34,
    color: 'rgba(255,255,255,0.96)',
    fontWeight: '700',
    width: 420,
    height: 58
  });
  if (greetImg) {
    ctx.drawImage(greetImg, (S - 420) / 2, greetY - 28, 420, 58);
  }

  // ────────────────────────────────────────────
  // البادج
  // ────────────────────────────────────────────
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
    height: 44
  });
  if (nameImg) {
    ctx.drawImage(nameImg, bdgX, bdgY + (role ? 10 : 14), bdgW, 44);
  }

  if (role) {
    const roleImg = await arabicTextToImage(role, {
      fontSize: 18,
      color: '#50E6FF',
      width: bdgW,
      height: 30
    });
    if (roleImg) {
      ctx.drawImage(roleImg, bdgX, bdgY + 49, bdgW, 30);
    }
  }

  // ────────────────────────────────────────────
  // الفوتر
  // ────────────────────────────────────────────
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
    ctx.drawImage(footerImg, (S - 390) / 2 - 6, footerY - 15, 390, 26);
  }

  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.70;
    ctx.drawImage(logoImg, S * 0.66, footerY - 13, 22, 22);
    ctx.restore();
  }

  return canvas;
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
  btn.disabled  = true;

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await wait(350);

    const isIOS = isIOSDevice();
    let canvas;

    if (isIOS) {
      // iOS: نرسم يدوياً (canvas API) لتفادي مشكلة tainted canvas
      canvas = card.id === 'clubCard'
        ? await drawClubCard()
        : await drawGeneralCard();
    } else {
      // غير iOS: نحاول html2canvas أولاً (يطابق الموقع)، وإلا نرجع للرسم اليدوي
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
      btn.disabled  = false;
    }, 2200);

  } catch (err) {
    console.error(err);
    alert('حدث خطأ: ' + err.message);
    btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
    btn.disabled  = false;
  }
}

// ══════════════════════════════════════════════
//  Floating shapes + Particles
// ══════════════════════════════════════════════

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  if (!container) return;
  const colors = ['#0078D4','#50E6FF','#FFB900','#7FBA00'];
  const shapes = ['◆','✦','●','▪'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';
    const size = Math.random()*12+4, useEmoji = Math.random()>0.5;
    el.style.cssText = `left:${Math.random()*100}%;bottom:-60px;width:${size}px;height:${size}px;${useEmoji?`color:${colors[Math.floor(Math.random()*colors.length)]};font-size:${size}px;`:`background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'3px'};transform:rotate(45deg);`}animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*12}s;`;
    if (useEmoji) el.textContent = shapes[Math.floor(Math.random()*shapes.length)];
    container.appendChild(el);
  }
}

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.5,
      speedX: (Math.random()-0.5)*0.3,
      speedY: (Math.random()-0.5)*0.3,
      alpha: Math.random()*0.5+0.1,
      color: Math.random()>0.5?'#50E6FF':'#FFB900'
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      p.x += p.speedX; p.y += p.speedY;
      if (p.x<0||p.x>W) p.speedX *= -1;
      if (p.y<0||p.y>H) p.speedY *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (!document.getElementById('step2A').classList.contains('hidden')) generateClub();
    else if (!document.getElementById('step2B').classList.contains('hidden')) generateGeneral();
  }
});

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}
  .input-error{animation:shake .35s ease both !important;}
`;
document.head.appendChild(shakeStyle);

createFloatingShapes();
initParticleCanvas();
