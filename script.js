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

  // تحميل الصور كـ base64 مسبقاً (يحل tainted canvas في iOS)
  const [logoImg, eidImg] = await Promise.all([
    loadImage('image/logo.png'),
    loadImage('image/happyeid.png')
  ]);

  // ── خلفية ──
  const bg = ctx.createLinearGradient(0, 0, S * 0.6, S);
  bg.addColorStop(0,    '#041530');
  bg.addColorStop(0.35, '#0a2568');
  bg.addColorStop(0.70, '#0d5bc9');
  bg.addColorStop(1,    '#1a78e8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  const r1 = ctx.createRadialGradient(S*0.3, 0, 0, S*0.3, 0, S*0.55);
  r1.addColorStop(0, 'rgba(80,230,255,0.13)');
  r1.addColorStop(1, 'transparent');
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, S, S);

  const r2 = ctx.createRadialGradient(S*0.7, S, 0, S*0.7, S, S*0.55);
  r2.addColorStop(0, 'rgba(0,120,212,0.2)');
  r2.addColorStop(1, 'transparent');
  ctx.fillStyle = r2;
  ctx.fillRect(0, 0, S, S);

  // شبكة خفيفة
  ctx.strokeStyle = 'rgba(255,255,255,0.022)';
  ctx.lineWidth = 1;
  for (let x = 0; x < S; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,S); ctx.stroke(); }
  for (let y = 0; y < S; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke(); }

  // نجوم خلفية
  [[0.08,0.14],[0.88,0.12],[0.15,0.58],[0.82,0.62],[0.50,0.08],
   [0.22,0.32],[0.75,0.32],[0.35,0.78],[0.65,0.22],[0.12,0.48],
   [0.90,0.82],[0.50,0.92]].forEach(([xr,yr]) => {
    ctx.fillStyle = `rgba(255,255,255,${(0.2+Math.random()*0.35).toFixed(2)})`;
    ctx.font = `${Math.round(Math.random()*12+7)}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.random()>0.5?'✦':'✧', xr*S, yr*S);
  });

  // ── هيدر (0% → 13%) ──
  const hdrH = S * 0.13;

  const hdrGrad = ctx.createLinearGradient(0, 0, 0, hdrH * 1.5);
  hdrGrad.addColorStop(0, 'rgba(0,8,30,0.92)');
  hdrGrad.addColorStop(1, 'rgba(0,8,30,0)');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(0, 0, S, hdrH * 1.5);

  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, hdrH); ctx.lineTo(S, hdrH); ctx.stroke();

  // حساب عرض الكتلة (لوغو + نص) لتمركزها
  const logoSize  = Math.round(hdrH * 0.62);
  const gap       = 18;
  const enFontSz  = Math.round(hdrH * 0.21);
  const arFontSz  = Math.round(hdrH * 0.19);
  const arImgW    = 360;
  const arImgH    = Math.round(hdrH * 0.32);

  ctx.font = `800 ${enFontSz}px Cairo,Tajawal,sans-serif`;
  const enW = ctx.measureText('Microsoft LSAC Club').width;
  const textColW = Math.max(enW, arImgW);

  const blockW = logoSize + gap + textColW;
  const blockX = (S - blockW) / 2;
  const logoY  = (hdrH - logoSize) / 2;

  // رسم اللوغو
  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(80,230,255,0.3)';
    ctx.shadowBlur  = 16;
    ctx.drawImage(logoImg, blockX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  // النص الإنجليزي (يسار اللوغو)
  const txX = blockX + logoSize + gap;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${enFontSz}px Cairo,Tajawal,sans-serif`;
  ctx.fillText('Microsoft LSAC Club', txX, hdrH * 0.42);
  ctx.restore();

  // النص العربي تحت الإنجليزي
  const arNameImg = await arabicTextToImage('نادي مايكروسوفت', {
    fontSize: arFontSz, color: '#50E6FF',
    width: arImgW, height: arImgH
  });
  if (arNameImg) {
    ctx.drawImage(arNameImg, txX, hdrH * 0.55, arImgW, arImgH);
  }

  // ── صورة happyeid (13% → 50%) ──
  const eidTop = S * 0.13;
  const eidBot = S * 0.50;

  if (eidImg) {
    const maxW = S * 0.70;
    const maxH = eidBot - eidTop - 10;
    const natR = eidImg.width / eidImg.height;
    let dW = maxW, dH = maxW / natR;
    if (dH > maxH) { dH = maxH; dW = maxH * natR; }
    const dX = (S - dW) / 2;
    const dY = eidTop + (maxH - dH) / 2 + 5;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur  = 20;
    ctx.drawImage(eidImg, dX, dY, dW, dH);
    ctx.restore();
  }

  // ── "كل عام وأنتم بخير" (51% → 60%) ──
  const kolCY = S * 0.545;

  // نجمتان ذهبيتان
  ctx.fillStyle  = '#FFB900';
  ctx.font       = '700 26px serif';
  ctx.textAlign  = 'center';
  ctx.fillText('✦', S/2 - 220, kolCY + 8);
  ctx.fillText('✦', S/2 + 220, kolCY + 8);

  const kolFsz = Math.round(S * 0.038);
  const kolW   = S * 0.60;
  const kolH   = Math.round(kolFsz * 1.8);
  const kolImg = await arabicTextToImage('كل عام وأنتم بخير', {
    fontSize: kolFsz, color: 'rgba(255,255,255,0.95)',
    fontWeight: '700', width: kolW, height: kolH
  });
  if (kolImg) {
    ctx.drawImage(kolImg, S/2 - kolW/2, kolCY - kolH * 0.78, kolW, kolH);
  }

  // ── البادج (62% → 77%) ──
  const name = document.getElementById('outName1').textContent.trim();
  const role = document.getElementById('outRole1').textContent.trim();

  // البادج في الموقع: max-width:260px على ~560px → ~46% | height:70px → ~12.5%
  const bdgW  = S * 0.40;
  const bdgH  = role ? S * 0.120 : S * 0.088;
  const bdgCY = S * 0.700;
  const bdgX  = (S - bdgW) / 2;
  const bdgY  = bdgCY - bdgH / 2;
  const bdgR  = 20;

  // ظل وخلفية
  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur    = 24;
  ctx.shadowOffsetY = 7;
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, bdgX, bdgY, bdgW, bdgH, bdgR);
  ctx.fill();
  ctx.restore();

  // حدود
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth   = 2;
  roundRect(ctx, bdgX, bdgY, bdgW, bdgH, bdgR);
  ctx.stroke();

  // حلقة توهج سيان
  ctx.save();
  ctx.strokeStyle = 'rgba(80,230,255,0.3)';
  ctx.lineWidth   = 1.5;
  roundRect(ctx, bdgX-3, bdgY-3, bdgW+6, bdgH+6, bdgR+3);
  ctx.stroke();
  ctx.restore();

  // الاسم — مركزي عمودياً إذا بدون منصب، وفي الثلث العلوي إذا مع منصب
  const nameFsz  = role ? Math.round(S * 0.036) : Math.round(S * 0.040);
  const nameImgH = Math.round(nameFsz * 1.5);
  const nameImg2 = await arabicTextToImage(name, {
    fontSize: nameFsz, color: '#ffffff',
    fontFamily: 'Amiri, Cairo, Tajawal, sans-serif',
    width: bdgW, height: nameImgH
  });
  if (nameImg2) {
    const nameY = role
      ? bdgY + bdgH * 0.06
      : bdgY + (bdgH - nameImgH) / 2;
    ctx.drawImage(nameImg2, bdgX, nameY, bdgW, nameImgH);
  }

  // المنصب — في الثلث السفلي
  if (role) {
    const roleFsz  = Math.round(S * 0.025);
    const roleImgH = Math.round(roleFsz * 1.5);
    const roleImg2 = await arabicTextToImage(role, {
      fontSize: roleFsz, color: '#50E6FF',
      width: bdgW, height: roleImgH
    });
    if (roleImg2) {
      const roleY = bdgY + bdgH - roleImgH - bdgH * 0.08;
      ctx.drawImage(roleImg2, bdgX, roleY, bdgW, roleImgH);
    }
  }

  // ── فوتر (88% → 100%) ──
  const ftTop = S * 0.88;
  const ftGrad = ctx.createLinearGradient(0, ftTop, 0, S);
  ftGrad.addColorStop(0, 'rgba(0,0,0,0)');
  ftGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = ftGrad;
  ctx.fillRect(0, ftTop, S, S - ftTop);

  const ftCY      = S * 0.944;
  const ftLogoSz  = 26;
  const ftFsz     = Math.round(S * 0.018);
  const ftImgW    = 680;
  const ftImgH    = Math.round(S * 0.032);

  const ftImg = await arabicTextToImage('عيد مبارك  ·  MLSA 2026  ·', {
    fontSize: ftFsz, color: 'rgba(255,255,255,0.65)',
    width: ftImgW, height: ftImgH
  });
  if (ftImg) {
    ctx.drawImage(ftImg, S/2 - ftImgW/2, ftCY - ftImgH * 0.8, ftImgW, ftImgH);
  }

  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.drawImage(logoImg, S/2 + ftImgW/2 - ftLogoSz - 8, ftCY - ftLogoSz/2 - 1, ftLogoSz, ftLogoSz);
    ctx.restore();
  }

  return canvas;
}

// ══════════════════════════════════════════════
//  رسم General Card
// ══════════════════════════════════════════════

async function drawGeneralCard() {
  const W = 900, H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bgImg = await loadImage('image/eid.png');
  if (bgImg) { ctx.drawImage(bgImg, 0, 0, W, H); }
  else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#881c3c'); g.addColorStop(1, '#d24a73');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  const ov = ctx.createLinearGradient(0, H*0.5, 0, H);
  ov.addColorStop(0, 'rgba(0,0,0,0.05)');
  ov.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H);

  const name = document.getElementById('outName2').textContent.trim();
  const bW = Math.min(W*0.82, 700), bH = 130;
  const bX = (W - bW) / 2, bY = H*0.72 - bH/2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRect(ctx, bX, bY, bW, bH, 40); ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2.5;
  roundRect(ctx, bX, bY, bW, bH, 40); ctx.stroke();

  const nameImg = await arabicTextToImage(name, {
    fontSize: 54, color: '#ffffff',
    fontFamily: 'Cairo, Tajawal, sans-serif', fontWeight: '900',
    width: bW, height: bH
  });
  if (nameImg) { ctx.drawImage(nameImg, bX, bY, bW, bH); }

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
      position:fixed;inset:0;background:rgba(3,10,25,0.96);
      z-index:999999;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:20px;box-sizing:border-box;gap:16px;
    `;
    overlay.innerHTML = `
      <div style="color:#fff;text-align:center;line-height:1.9;font-size:15px;max-width:320px;">
        اضغطي مطولًا على الصورة ثم اختاري <b>حفظ الصورة</b>
      </div>
      <img id="savePreviewImage" alt="بطاقة المعايدة" style="
        max-width:92vw;max-height:68vh;width:auto;height:auto;
        border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.35);display:block;">
      <button id="closeSavePreviewBtn" style="
        border:none;border-radius:14px;padding:12px 22px;
        font-size:15px;font-weight:700;background:#FFB900;color:#111;cursor:pointer;">
        إغلاق
      </button>
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
