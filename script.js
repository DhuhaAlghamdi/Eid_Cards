// =============================================
//  MLSAC Eid Generator — script.js (modified)
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
    el.style.boxShadow   = '0 0 0 3px rgba(242,80,34,.2)';
    el.style.animation   = 'shake .35s ease both';

    el.classList.add('input-error');
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
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

// ── Arabic text → SVG helpers ─────────────────

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createArabicSvgDataUrl(text, opts = {}) {
  const width = Math.max(10, Math.ceil(opts.width || 200));
  const height = Math.max(10, Math.ceil(opts.height || 60));
  const fontSize = Math.max(10, Math.round(opts.fontSize || 24));
  const fontWeight = opts.fontWeight || 700;
  const fill = opts.color || '#ffffff';
  const family = opts.fontFamily || "'Cairo','Tajawal',sans-serif";
  const align = opts.align || 'center';
  const stroke = opts.stroke || 'none';
  const strokeWidth = opts.strokeWidth || 0;
  const shadowColor = opts.shadowColor || 'transparent';
  const shadowBlur = opts.shadowBlur || 0;

  let x = width / 2;
  let anchor = 'middle';

  if (align === 'right') {
    x = width - 6;
    anchor = 'end';
  } else if (align === 'left') {
    x = 6;
    anchor = 'start';
  }

  const y = Math.round(height * 0.70);
  const safeText = escapeXml(text);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <filter id="txtShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="${shadowBlur}" flood-color="${shadowColor}" flood-opacity="1"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="transparent"/>
      <text
        x="${x}"
        y="${y}"
        font-family="${family}"
        font-size="${fontSize}"
        font-weight="${fontWeight}"
        fill="${fill}"
        text-anchor="${anchor}"
        direction="rtl"
        unicode-bidi="bidi-override"
        dominant-baseline="alphabetic"
        filter="url(#txtShadow)"
        stroke="${stroke}"
        stroke-width="${strokeWidth}"
        paint-order="stroke"
      >${safeText}</text>
    </svg>
  `;

  return toDataUri(svg);
}

function replaceArabicTextWithSvg(doc, selector, options = {}) {
  doc.querySelectorAll(selector).forEach(el => {
    const text = (el.textContent || '').trim();
    if (!text) return;

    const rect = el.getBoundingClientRect();
    const width = Math.max(el.offsetWidth, rect.width, options.minWidth || 20);
    const height = Math.max(el.offsetHeight, rect.height, options.minHeight || 20);

    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize) || options.fontSize || 20;
    const fontWeight = style.fontWeight || options.fontWeight || 700;
    const color = style.color || options.color || '#fff';
    const textAlign = options.align || style.textAlign || 'center';

    const img = doc.createElement('img');
    img.src = createArabicSvgDataUrl(text, {
      width,
      height,
      fontSize,
      fontWeight,
      color,
      fontFamily: options.fontFamily || style.fontFamily || "'Cairo','Tajawal',sans-serif",
      align: textAlign === 'right' ? 'right' : textAlign === 'left' ? 'left' : 'center',
      stroke: options.stroke || 'none',
      strokeWidth: options.strokeWidth || 0,
      shadowColor: options.shadowColor || 'transparent',
      shadowBlur: options.shadowBlur || 0
    });

    img.alt = text;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.display = 'block';
    img.style.objectFit = 'contain';

    if (textAlign === 'right') {
      img.style.marginLeft = 'auto';
      img.style.marginRight = '0';
    } else if (textAlign === 'left') {
      img.style.marginLeft = '0';
      img.style.marginRight = 'auto';
    } else {
      img.style.marginLeft = 'auto';
      img.style.marginRight = 'auto';
    }

    el.textContent = '';
    el.style.color = 'transparent';
    el.style.textShadow = 'none';
    el.style.lineHeight = '1';
    el.appendChild(img);
  });
}

// ── Download ──────────────────────────────────

function downloadCard() {
  const ids = ['clubCard', 'genCard1'];
  const card = ids
    .map(id => document.getElementById(id))
    .find(el => !el.classList.contains('hidden'));

  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.innerHTML = '<span class="dl-icon">⏳</span> <span>جاري الإعداد...</span>';
  btn.disabled = true;

  html2canvas(card, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 12000,

    onclone: (doc) => {
      doc.documentElement.setAttribute('lang', 'ar');
      doc.documentElement.setAttribute('dir', 'rtl');
      doc.body.setAttribute('dir', 'rtl');

      doc.querySelectorAll('.b-name, .b-role, .gen1-name, .club-kol, .club-en-name, .club-ar-name, .footer-txt, .footer-txt-ar').forEach(el => {
        el.style.direction = 'rtl';
        el.style.unicodeBidi = 'plaintext';
        el.style.fontFamily = 'Cairo, Tajawal, sans-serif';
      });

      replaceArabicTextWithSvg(doc, '.club-ar-name', {
        align: 'center',
        shadowColor: 'rgba(0,0,0,.15)',
        shadowBlur: 0.6
      });

      replaceArabicTextWithSvg(doc, '.club-kol', {
        align: 'center',
        shadowColor: 'rgba(0,0,0,.35)',
        shadowBlur: 1.2
      });

      replaceArabicTextWithSvg(doc, '.b-name', {
        align: 'center',
        shadowColor: 'rgba(0,0,0,.25)',
        shadowBlur: 1
      });

      replaceArabicTextWithSvg(doc, '.b-role', {
        align: 'center',
        shadowColor: 'rgba(0,0,0,.15)',
        shadowBlur: 0.8
      });

      replaceArabicTextWithSvg(doc, '.gen1-name', {
        align: 'center',
        shadowColor: 'rgba(0,0,0,.45)',
        shadowBlur: 1.4
      });

      replaceArabicTextWithSvg(doc, '.footer-txt-ar', {
        align: 'center'
      });
    }

  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'mlsac-eid-1447.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    btn.innerHTML = '<span>✅</span> <span>تم التحميل!</span>';
    setTimeout(() => {
      btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
      btn.disabled = false;
    }, 2200);

  }).catch(err => {
    console.error(err);
    alert('حدث خطأ أثناء التحميل، حاولي مجدداً');
    btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
    btn.disabled = false;
  });
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

    if (useEmoji) el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
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
