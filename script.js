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

async function downloadCard() {

   const ids = ['clubCard', 'genCard1'];
  const card = ids
    .map(id => document.getElementById(id))
    .find(el => !el.classList.contains('hidden'));

  if (!card) return;

  const btn = document.getElementById('dlBtn');

  btn.innerHTML = 'جاري التحميل...';
  btn.disabled = true;

  // مهم جداً للآيفون
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // مهلة صغيرة عشان Safari
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    // انتظار تحميل الخطوط
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // انتظار بسيط إضافي مهم في Safari
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      imageTimeout: 20000,
      foreignObjectRendering: false,

      onclone: (doc) => {
        doc.documentElement.setAttribute('lang', 'ar');
        doc.documentElement.setAttribute('dir', 'rtl');
        doc.body.setAttribute('dir', 'rtl');

        doc.querySelectorAll('.b-name, .b-role, .gen1-name, .club-kol, .club-en-name, .club-ar-name, .footer-txt, .footer-txt-ar, .footer-copy').forEach(el => {
          el.style.direction = 'rtl';
          el.style.unicodeBidi = 'plaintext';
          el.style.fontFamily = 'Tajawal, Cairo, sans-serif';
          el.style.textAlign = 'center';
          el.style.lineHeight = '1';
          el.style.margin = '0';
          el.style.padding = '0';
          el.style.webkitTextFillColor = el.style.color || '#fff';
        });

        const badge = doc.querySelector('.club-badge');
        if (badge) {
          badge.style.display = 'flex';
          badge.style.flexDirection = 'column';
          badge.style.alignItems = 'center';
          badge.style.justifyContent = 'center';
          badge.style.gap = '0';
          badge.style.padding = '8px 20px 6px 20px';
        }

        const info = doc.querySelector('.b-info');
        if (info) {
          info.style.display = 'flex';
          info.style.flexDirection = 'column';
          info.style.alignItems = 'center';
          info.style.justifyContent = 'center';
          info.style.gap = '0';
          info.style.lineHeight = '1';
          info.style.margin = '0';
          info.style.padding = '0';
        }

        const name = doc.querySelector('.b-name, .gen1-name');
        if (name) {
          name.style.display = 'flex';
          name.style.alignItems = 'center';
          name.style.justifyContent = 'center';
          name.style.lineHeight = '1';
          name.style.margin = '0';
          name.style.padding = '0';
        }

        const role = doc.querySelector('.b-role');
        if (role) {
          role.style.display = role.textContent.trim() ? 'flex' : 'none';
          role.style.alignItems = 'center';
          role.style.justifyContent = 'center';
          role.style.lineHeight = '1';
          role.style.margin = '0';
          role.style.marginTop = '-28px';
          role.style.padding = '0';
        }

        replaceArabicElementsWithImages(doc);
      }
    });

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
