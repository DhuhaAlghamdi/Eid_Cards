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

// ── Confetti positions for both cards
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

// ── Generate Club Card (same logic as General)
function generateClub() {
  const name = requireName('nameA');
  if (!name) return;

  const role = document.getElementById('roleA').value.trim();

  document.getElementById('outName1').textContent = name;

  const roleEl = document.getElementById('outRole1');
  roleEl.textContent = role;
  roleEl.classList.toggle('show', !!role);

  buildFestiveDecor('club1Decor', '#50E6FF', 'rgba(255,185,0,.9)');
  showResult('clubCard');
}

// ── Generate General Card
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
//  Helpers
// ══════════════════════════════════════════════

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// تحميل صورة كـ base64 عبر fetch
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

// رسم النص العربي كصورة — آمن لكل المتصفحات
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

  const encoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = encoded;
  });
}

// ══════════════════════════════════════════════
//  html2canvas helper (Android + Desktop)
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
//  رسم Club Card — صورة خلفية + اسم + منصب
// ══════════════════════════════════════════════

async function drawClubCard() {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  // تحميل صورة الخلفية
  const bgImg = await loadImage('image/eidMicrosoft.png');

  if (bgImg) {
    // رسم الصورة لتملأ الكانفاس (cover)
    const imgRatio = bgImg.width / bgImg.height;
    let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;

    if (imgRatio > 1) {
      // الصورة عريضة — نقلّص العرض
      sw = bgImg.height;
      sx = (bgImg.width - sw) / 2;
    } else if (imgRatio < 1) {
      // الصورة طويلة — نقلّص الارتفاع
      sh = bgImg.width;
      sy = (bgImg.height - sh) / 2;
    }

    ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, S, S);
  } else {
    // fallback gradient
    const bg = ctx.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0, '#041530');
    bg.addColorStop(1, '#2d98ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);
  }

  // overlay خفيف لتحسين قراءة الاسم
  const overlay = ctx.createLinearGradient(0, S * 0.6, 0, S);
  overlay.addColorStop(0, 'rgba(0,0,0,0)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, S, S);

  // ── Badge الاسم والمنصب — مركز البوكس عند 81.5% من الصورة
  const name = document.getElementById('outName1').textContent.trim();
  const role = document.getElementById('outRole1').textContent.trim();

  // البوكس في الصورة: عرضه ~52% من S، مركزه عند 81.5%
  const bdgW = S * 0.52;
  const bdgCenterY = S * 1.15;
  const bdgX = (S - bdgW) / 2;

  // الاسم
  const nameImg = await arabicTextToImage(name, {
    fontSize: role ? 52 : 58,
    color: '#ffffff',
    fontFamily: 'Cairo, Tajawal, sans-serif',
    fontWeight: '900',
    width: bdgW,
    height: role ? 70 : 80
  });
  if (nameImg) {
    const nameH = role ? 70 : 80;
    const totalH = role ? 70 + 8 + 46 : 80;
    const startY = bdgCenterY - totalH / 2;
    ctx.drawImage(nameImg, bdgX, startY, bdgW, nameH);
  }

  // المنصب
  if (role) {
    const roleImg = await arabicTextToImage(role, {
      fontSize: 46,
      color: '#50E6FF',
      fontFamily: 'Cairo, Tajawal, sans-serif',
      fontWeight: '700',
      width: bdgW,
      height: 46
    });
    if (roleImg) {
      const totalH = 70 + 8 + 46;
      const startY = bdgCenterY - totalH / 2;
      ctx.drawImage(roleImg, bdgX, startY + 70 + 8, bdgW, 46);
    }
  }

  return canvas;
}

// ══════════════════════════════════════════════
//  رسم General Card — صورة خلفية + اسم
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
    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = W / H;
    let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;

    if (imgRatio > canvasRatio) {
      sw = bgImg.height * canvasRatio;
      sx = (bgImg.width - sw) / 2;
    } else {
      sh = bgImg.width / canvasRatio;
      sy = (bgImg.height - sh) / 2;
    }

    ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#881c3c');
    bg.addColorStop(1, '#d24a73');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  // overlay
  const overlay = ctx.createLinearGradient(0, H * 0.6, 0, H);
  overlay.addColorStop(0, 'rgba(0,0,0,0)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // الاسم — مركزه عند نفس نسبة بطاقة النادي
  const name = document.getElementById('outName2').textContent.trim();

  const bdgW = W * 0.52;
  const bdgCenterY = H * 0.815;
  const bdgX = (W - bdgW) / 2;

  const nameImg = await arabicTextToImage(name, {
    fontSize: 70,
    color: '#ffffff',
    fontFamily: 'Cairo, Tajawal, sans-serif',
    fontWeight: '900',
    width: bdgW,
    height: 80
  });
  if (nameImg) {
    ctx.drawImage(nameImg, bdgX, bdgCenterY - 40, bdgW, 80);
  }

  return canvas;
}

// ══════════════════════════════════════════════
//  Download — مباشر بدون فتح صفحة جديدة
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
      // iOS: رسم يدوي لتفادي tainted canvas
      canvas = card.id === 'clubCard'
        ? await drawClubCard()
        : await drawGeneralCard();
    } else {
      // Desktop/Android: html2canvas أولاً، وإلا رسم يدوي
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

    // تحميل مباشر — بدون فتح صفحة جديدة
    const link = document.createElement('a');
    link.download = 'mlsac-eid-1447.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    link.remove();

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
