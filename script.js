// =============================================
//  MLSAC Eid Generator — script.js (fixed)
// =============================================

let majorTemplate = 0; // 1=club, 2=general

// ── Navigation ────────────────────────────────

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
  ['clubCard', 'genCard1'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

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
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 80);
}

// ── Input Validation ─────────────────────────

function requireName(inputId) {
  const el = document.getElementById(inputId);
  const val = el.value.trim();

  if (!val) {
    el.focus();
    el.style.borderColor = '#F25022';
    el.style.boxShadow = '0 0 0 3px rgba(242,80,34,.2)';
    el.style.animation = 'shake .35s ease both';

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

// ── Club stars / confetti ─────────────────────

const STAR_POSITIONS = [
  [8, 12], [15, 55], [88, 10], [82, 60],
  [50, 6], [50, 94], [22, 30], [75, 30],
];

function buildClubStars() {
  const container = document.getElementById('clubStars');
  if (!container) return;
  container.innerHTML = '';

  STAR_POSITIONS.forEach(([x, y], i) => {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      color: rgba(255,255,255,${0.3 + Math.random() * 0.5});
      font-size: ${Math.random() * 10 + 8}px;
      animation: popTwinkle ${2 + Math.random() * 2}s ${i * 0.2}s infinite;
      pointer-events: none;
    `;
    star.textContent = Math.random() > 0.5 ? '✦' : '✧';
    container.appendChild(star);
  });
}

// ── Festive dots (general card) ───────────────

const FESTIVE_POS = [
  [8, 10], [14, 16], [86, 10], [80, 18],
  [11, 82], [86, 76], [50, 8], [50, 92],
  [30, 25], [70, 75], [20, 60], [80, 40],
];

function buildFestiveDecor(containerId, colorA, colorB) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';

  FESTIVE_POS.forEach(([x, y], i) => {
    const el = document.createElement('div');
    el.className = 'c-confetti';
    el.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${Math.random() * 8 + 5}px;
      height: ${Math.random() * 8 + 5}px;
      background: ${Math.random() > .5 ? colorA : colorB};
      animation-delay: ${i * .16}s;
      animation-duration: ${2 + Math.random() * 2}s;
    `;
    c.appendChild(el);
  });
}

// ── Generate Club Card ────────────────────────

function generateClub() {
  document.getElementById('happyEidImg').src = 'image/happyeid.png';

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

// ── Generate General Card ─────────────────────

function generateGeneral() {
  const name = requireName('nameB');
  if (!name) return;

  document.getElementById('outName2').textContent = name;
  buildFestiveDecor('gen1Decor', '#ffffff', 'rgba(80,230,255,.9)');
  showResult('genCard1');
}

// ── Show Result ───────────────────────────────

function showResult(visibleId) {
  ['step1', 'step2A', 'step2B'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  ['clubCard', 'genCard1'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  document.getElementById(visibleId).classList.remove('hidden');

  const section = document.getElementById('resultSection');
  section.classList.remove('hidden');

  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

// ── Arabic text helpers ───────────────────────

function isArabicText(text) {
  return /[\u0600-\u06FF]/.test(text || '');
}

function createTextImage(text, options = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontSize = options.fontSize || 32;
  const fontWeight = options.fontWeight || '700';
  const fontFamily = options.fontFamily || 'Cairo, Tajawal, sans-serif';
  const color = options.color || '#ffffff';
  const paddingX = options.paddingX || 16;
  const paddingY = options.paddingY || 12;

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);

  canvas.width = textWidth + paddingX * 2;
  canvas.height = Math.ceil(fontSize * 2.2) + paddingY * 2;

  const ctx2 = canvas.getContext('2d');
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx2.fillStyle = color;
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.direction = 'rtl';

  ctx2.save();
  ctx2.translate(canvas.width / 2, canvas.height / 2);
  ctx2.fillText(text, 0, 0);
  ctx2.restore();

  return canvas.toDataURL('image/png');
}

// استبدلي الدالة كاملة بهذه النسخة
// هذه تضبط العربي + تقلل المسافة بين "ضحى" و "علي" وقت التحميل

// استبدلي دالة replaceArabicElementsWithImages بهذه النسخة

function replaceArabicElementsWithImages(clonedDoc) {
  const config = [
    {
      selector: '.club-ar-name',
      scale: 1.6,
      heightScale: 1.25,
      paddingX: 18,
      paddingY: 4,
      marginTop: 0
    },
    {
      selector: '.club-kol',
      scale: 1.5,
      heightScale: 1.2,
      paddingX: 16,
      paddingY: 4,
      marginTop: 0
    },
    {
      selector: '.b-name, .gen1-name',
      scale: 2.2,
      heightScale: 1.15,
      paddingX: 16,
      paddingY: 2,
      marginTop: 0
    },
    {
      selector: '.b-role',
      scale: 1.85,
      heightScale: 1.1,
      paddingX: 12,
      paddingY: 4,
      marginTop: -20
    },
    {
      selector: '.footer-copy, .footer-txt, .footer-txt-ar',
      scale: 1.8,
      heightScale: 1.2,
      paddingX: 20,
      paddingY: 4,
      marginTop: 0
    }
  ];

  config.forEach(item => {
    const originalElements = document.querySelectorAll(item.selector);
    const clonedElements = clonedDoc.querySelectorAll(item.selector);

    clonedElements.forEach((el, index) => {
      const text = (el.textContent || '').trim();
      if (!text || !isArabicText(text)) return;

      const originalEl = originalElements[index] || originalElements[0] || el;
      const style = window.getComputedStyle(originalEl);

      const baseFontSize = parseFloat(style.fontSize) || 24;
      const fontSize = Math.round(baseFontSize * item.scale);
      const fontWeight = style.fontWeight || '700';
      const color = style.color || '#ffffff';
      const fontFamily = style.fontFamily || 'Cairo, Tajawal, sans-serif';

      const img = clonedDoc.createElement('img');
      img.src = createTextImage(text, {
        fontSize,
        fontWeight,
        color,
        fontFamily,
        paddingX: item.paddingX,
        paddingY: item.paddingY
      });

      img.style.display = 'block';
      img.style.width = 'auto';
      img.style.maxWidth = '100%';
      img.style.height = `${Math.ceil(fontSize * item.heightScale)}px`;
      img.style.margin = '0 auto';
      img.style.marginTop = `${item.marginTop || 0}px`;

      el.innerHTML = '';
      el.style.direction = 'ltr';
      el.style.unicodeBidi = 'normal';
      el.style.margin = '0';
      el.style.padding = '0';
      el.style.lineHeight = '1';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.appendChild(img);
    });
  });
}

// ── Download ──────────────────────────────────

// =============================================
//  استبدلي دالة downloadCard كاملة بهذه النسخة
//  الحل: نرسم الكارد مباشرة على Canvas بدون html2canvas
// =============================================

async function downloadCard() {
  const ids = ['clubCard', 'genCard1'];
  const card = ids
    .map(id => document.getElementById(id))
    .find(el => !el.classList.contains('hidden'));

  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.innerHTML = 'جاري التحميل...';
  btn.disabled = true;

  try {
    // انتظر تحميل الخطوط
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise(r => setTimeout(r, 600));

    let canvas;

    if (card.id === 'clubCard') {
      canvas = await drawClubCard();
    } else {
      canvas = await drawGeneralCard();
    }

    const link = document.createElement('a');
    link.download = 'mlsac-eid-1447.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    btn.innerHTML = '<span>✅</span> <span>تم التحميل!</span>';
    setTimeout(() => {
      btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
      btn.disabled = false;
    }, 2200);

  } catch (err) {
    console.error(err);
    alert('حدث خطأ أثناء التحميل، حاولي مجددًا');
    btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
    btn.disabled = false;
  }
}

// ── تحميل صورة كـ Promise ─────────────────────

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // لو فشل التحميل، ارجعي null بدل خطأ
      resolve(null);
    };
    img.src = src;
  });
}

// ── رسم Club Card ─────────────────────────────

async function drawClubCard() {
  const SIZE = 1200; // مربع 1:1
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // ── الخلفية التدرجية ──
  const bgGrad = ctx.createLinearGradient(0, 0, SIZE * 0.7, SIZE);
  bgGrad.addColorStop(0, '#041530');
  bgGrad.addColorStop(0.35, '#0a2568');
  bgGrad.addColorStop(0.7, '#0d5bc9');
  bgGrad.addColorStop(1, '#1a78e8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // تأثير radial فوق اليسار
  const radGrad1 = ctx.createRadialGradient(SIZE * 0.3, 0, 0, SIZE * 0.3, 0, SIZE * 0.5);
  radGrad1.addColorStop(0, 'rgba(80,230,255,0.12)');
  radGrad1.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // تأثير radial أسفل اليمين
  const radGrad2 = ctx.createRadialGradient(SIZE * 0.7, SIZE, 0, SIZE * 0.7, SIZE, SIZE * 0.5);
  radGrad2.addColorStop(0, 'rgba(0,120,212,0.2)');
  radGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad2;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── شبكة خفيفة ──
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 0; x < SIZE; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, SIZE); ctx.stroke();
  }
  for (let y = 0; y < SIZE; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SIZE, y); ctx.stroke();
  }

  // ── نجوم خلفية ──
  const starPositions = [
    [0.08, 0.12], [0.15, 0.55], [0.88, 0.10], [0.82, 0.60],
    [0.50, 0.06], [0.50, 0.94], [0.22, 0.30], [0.75, 0.30],
    [0.35, 0.75], [0.65, 0.20], [0.12, 0.45], [0.90, 0.80],
  ];
  starPositions.forEach(([xr, yr]) => {
    ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.4})`;
    ctx.font = `${Math.random() * 14 + 8}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.random() > 0.5 ? '✦' : '✧', xr * SIZE, yr * SIZE);
  });

  // ── الشريط العلوي (top bar) ──
  const topBarH = 110;
  const topBarGrad = ctx.createLinearGradient(0, 0, 0, topBarH);
  topBarGrad.addColorStop(0, 'rgba(0,10,38,0.85)');
  topBarGrad.addColorStop(1, 'rgba(0,10,38,0)');
  ctx.fillStyle = topBarGrad;
  ctx.fillRect(0, 0, SIZE, topBarH);

  // خط أسفل الشريط العلوي
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, topBarH - 1);
  ctx.lineTo(SIZE, topBarH - 1);
  ctx.stroke();

  // اللوغو في الشريط العلوي
  const logoImg = await loadImage('image/logo.png');
  if (logoImg) {
    const logoSize = 85;
    const logoX = SIZE - logoSize - 40; // يمين
    const logoY = (topBarH - logoSize) / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(80,230,255,0.4)';
    ctx.shadowBlur = 20;
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // نصوص الكلوب بجانب اللوغو (عربي = يسار اللوغو)
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 30px Cairo, Tajawal, sans-serif';
    ctx.fillText('Microsoft LSAC Club', logoX - 15, topBarH / 2 - 4);

    ctx.fillStyle = '#50E6FF';
    ctx.font = '600 22px Cairo, Tajawal, sans-serif';
    ctx.fillText('نادي مايكروسوفت', logoX - 15, topBarH / 2 + 26);
  }

  // ── صورة happyeid ──
  const eidImg = await loadImage('image/happyeid.png');
  if (eidImg) {
    const eidW = SIZE * 0.65;
    const eidH = eidW * (eidImg.height / eidImg.width);
    const eidX = (SIZE - eidW) / 2;
    const eidY = SIZE * 0.22;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 30;
    ctx.drawImage(eidImg, eidX, eidY, eidW, eidH);
    ctx.restore();
  }

  // ── "كل عام وأنتم بخير" ──
  const kolY = SIZE * 0.58;

  // نجوم جانبية
  ctx.fillStyle = '#FFB900';
  ctx.font = '700 28px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', SIZE / 2 - 200, kolY + 8);
  ctx.fillText('✦', SIZE / 2 + 200, kolY + 8);

  // النص
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '700 52px Cairo, Tajawal, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 12;
  ctx.fillText('كل عام وأنتم بخير', SIZE / 2, kolY);
  ctx.restore();

  // ── البادج (الاسم والمنصب) ──
  const name = document.getElementById('outName1').textContent.trim();
  const role = document.getElementById('outRole1').textContent.trim();

  const badgeCenterY = SIZE * 0.72;
  const badgeW = Math.min(SIZE * 0.55, 580);
  const badgeH = role ? 130 : 90;
  const badgeX = (SIZE - badgeW) / 2;
  const badgeY = badgeCenterY - badgeH / 2;
  const badgeR = 22;

  // ظل البادج
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;

  // خلفية البادج
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeR);
  ctx.fill();
  ctx.restore();

  // بوردر البادج
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeR);
  ctx.stroke();

  // ── الاسم داخل البادج ──
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${role ? 44 : 50}px Amiri, Cairo, Tajawal, sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;

  const nameY = role
    ? badgeY + badgeH * 0.42
    : badgeY + badgeH * 0.58;

  ctx.fillText(name, SIZE / 2, nameY);
  ctx.restore();

  // ── المنصب ──
  if (role) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#50E6FF';
    ctx.font = '700 30px Cairo, Tajawal, sans-serif';
    ctx.fillText(role, SIZE / 2, badgeY + badgeH * 0.75);
    ctx.restore();
  }

  // ── الفوتر ──
  const footerH = 80;
  const footerGrad = ctx.createLinearGradient(0, SIZE - footerH, 0, SIZE);
  footerGrad.addColorStop(0, 'rgba(0,0,0,0)');
  footerGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = footerGrad;
  ctx.fillRect(0, SIZE - footerH, SIZE, footerH);

  // اللوغو في الفوتر
  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.drawImage(logoImg, SIZE / 2 - 120, SIZE - 55, 36, 36);
    ctx.restore();
  }

  // نصوص الفوتر
  ctx.textAlign = 'center';
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '700 22px Cairo, Tajawal, sans-serif';
  ctx.fillText('· MLSA 2026 · عيد مبارك ·', SIZE / 2 + 20, SIZE - 28);

  return canvas;
}

// ── رسم General Card ──────────────────────────

async function drawGeneralCard() {
  const W = 900;
  const H = 1200; // 3:4
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // صورة الخلفية
  const bgImg = await loadImage('image/eid.png');
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    // fallback gradient لو الصورة ما حملت
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#881c3c');
    grad.addColorStop(1, '#d24a73');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // overlay تدرجي
  const overlay = ctx.createLinearGradient(0, H * 0.5, 0, H);
  overlay.addColorStop(0, 'rgba(0,0,0,0.05)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // بادج الاسم
  const name = document.getElementById('outName2').textContent.trim();
  const badgeW = Math.min(W * 0.82, 700);
  const badgeH = 130;
  const badgeX = (W - badgeW) / 2;
  const badgeY = H * 0.72 - badgeH / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 40);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 40);
  ctx.stroke();

  // الاسم
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 54px Cairo, Tajawal, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 12;
  ctx.fillText(name, W / 2, badgeY + badgeH * 0.62);
  ctx.restore();

  return canvas;
}

// ── Helper: رسم مستطيل بزوايا مدورة ──────────

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

// ── Floating background shapes ────────────────

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  const colors = ['#0078D4', '#50E6FF', '#FFB900', '#7FBA00'];
  const shapes = ['◆', '✦', '●', '▪'];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';
    const size = Math.random() * 12 + 4;
    const useEmoji = Math.random() > 0.5;

    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -60px;
      width: ${size}px;
      height: ${size}px;
      ${useEmoji
        ? `color: ${colors[Math.floor(Math.random() * colors.length)]}; font-size: ${size}px;`
        : `background: ${colors[Math.floor(Math.random() * colors.length)]}; border-radius: ${Math.random() > 0.5 ? '50%' : '3px'}; transform: rotate(45deg);`
      }
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 12}s;
    `;

    if (useEmoji) {
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    }

    container.appendChild(el);
  }
}

// ── Particle canvas (subtle) ──────────────────

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
      color: Math.random() > 0.5 ? '#50E6FF' : '#FFB900',
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

// ── Keyboard shortcuts ────────────────────────

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (!document.getElementById('step2A').classList.contains('hidden')) {
      generateClub();
    } else if (!document.getElementById('step2B').classList.contains('hidden')) {
      generateGeneral();
    }
  }
});

// ── Input shake animation (CSS) ───────────────

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-8px); }
    30% { transform: translateX(8px); }
    45% { transform: translateX(-6px); }
    60% { transform: translateX(6px); }
    75% { transform: translateX(-3px); }
    90% { transform: translateX(3px); }
  }

  .input-error {
    animation: shake .35s ease both !important;
  }
`;

document.head.appendChild(shakeStyle);

// ── Init ─────────────────────────────────────

createFloatingShapes();
initParticleCanvas();
