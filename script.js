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

// ── Club stars ────────────────────────────────

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

// ── Festive dots ──────────────────────────────

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

// ── تحميل صورة كـ Promise ─────────────────────

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ── Helper: مستطيل بزوايا مدورة ──────────────

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

// ── رسم Club Card ─────────────────────────────

async function drawClubCard() {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width  = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  // 1. خلفية
  const bgGrad = ctx.createLinearGradient(0, 0, S*0.6, S);
  bgGrad.addColorStop(0,    '#041530');
  bgGrad.addColorStop(0.35, '#0a2568');
  bgGrad.addColorStop(0.70, '#0d5bc9');
  bgGrad.addColorStop(1,    '#1a78e8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, S, S);

  const r1 = ctx.createRadialGradient(S*0.3, 0, 0, S*0.3, 0, S*0.55);
  r1.addColorStop(0, 'rgba(80,230,255,0.13)');
  r1.addColorStop(1, 'transparent');
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, S, S);

  const r2 = ctx.createRadialGradient(S*0.7, S, 0, S*0.7, S, S*0.55);
  r2.addColorStop(0, 'rgba(0,120,212,0.22)');
  r2.addColorStop(1, 'transparent');
  ctx.fillStyle = r2;
  ctx.fillRect(0, 0, S, S);

  // 2. شبكة
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < S; x += 48) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,S); ctx.stroke();
  }
  for (let y = 0; y < S; y += 48) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke();
  }

  // 3. نجوم
  [[0.08,0.14],[0.88,0.12],[0.15,0.58],[0.82,0.62],
   [0.50,0.08],[0.22,0.32],[0.75,0.32],[0.35,0.78],
   [0.65,0.22],[0.12,0.48],[0.90,0.82],[0.50,0.92]
  ].forEach(([xr,yr]) => {
    ctx.fillStyle = `rgba(255,255,255,${(0.2+Math.random()*0.35).toFixed(2)})`;
    ctx.font = `${Math.round(Math.random()*12+7)}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.random()>0.5?'✦':'✧', xr*S, yr*S);
  });

  // 4. شريط علوي
  const topH = 118;
  const topGrad = ctx.createLinearGradient(0, 0, 0, topH);
  topGrad.addColorStop(0, 'rgba(0,8,30,0.90)');
  topGrad.addColorStop(1, 'rgba(0,8,30,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, S, topH);

  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, topH); ctx.lineTo(S, topH); ctx.stroke();

  // لوغو يمين
  const logoImg = await loadImage('image/logo.png');
  const logoSize = 82;
  const logoX = S - logoSize - 38;
  const logoY = (topH - logoSize) / 2;

  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(80,230,255,0.35)';
    ctx.shadowBlur  = 18;
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  // نصوص الشريط العلوي
  ctx.save();
  ctx.textAlign = 'right';
  ctx.direction = 'ltr';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 27px Cairo, Tajawal, sans-serif';
  ctx.fillText('Microsoft LSAC Club', logoX - 12, topH/2 - 5);
  ctx.fillStyle = '#50E6FF';
  ctx.font = '600 20px Cairo, Tajawal, sans-serif';
  ctx.fillText('نادي مايكروسوفت', logoX - 12, topH/2 + 22);
  ctx.restore();

  // 5. صورة happyeid — نحسب ارتفاعها الفعلي ونبني باقي العناصر تحتها
  const eidImg = await loadImage('image/happyeid.png');
  const eidW   = S * 0.60;
  const eidX   = (S - eidW) / 2;
  const eidY   = topH + 30;
  let   eidBottom = eidY + eidW * 0.45; // fallback لو الصورة ما حملت

  if (eidImg) {
    const maxH   = S * 0.37;
    const natH   = eidW * (eidImg.height / eidImg.width);
    const finalH = Math.min(natH, maxH);
    const finalW = natH > maxH ? maxH * (eidImg.width / eidImg.height) : eidW;
    const finalX = (S - finalW) / 2;
    eidBottom = eidY + finalH;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur  = 22;
    ctx.drawImage(eidImg, finalX, eidY, finalW, finalH);
    ctx.restore();
  }

  // 6. "كل عام وأنتم بخير" — تحت الصورة مباشرة
  const kolY = eidBottom + 60;

  ctx.fillStyle = '#FFB900';
  ctx.font = '700 26px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', S/2 - 235, kolY + 5);
  ctx.fillText('✦', S/2 + 235, kolY + 5);

  ctx.save();
  ctx.textAlign   = 'center';
  ctx.direction   = 'rtl';
  ctx.fillStyle   = 'rgba(255,255,255,0.95)';
  ctx.font        = '700 50px Cairo, Tajawal, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur  = 10;
  ctx.fillText('كل عام وأنتم بخير', S/2, kolY);
  ctx.restore();

  // 7. البادج — تحت النص مباشرة
  const name = document.getElementById('outName1').textContent.trim();
  const role = document.getElementById('outRole1').textContent.trim();

  const badgeCY = kolY + 80;
  const badgeW  = S * 0.47;
  const badgeH  = role ? 140 : 98;
  const badgeX  = (S - badgeW) / 2;
  const badgeY  = badgeCY;

  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur    = 26;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth   = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.stroke();

  // الاسم
  ctx.save();
  ctx.textAlign  = 'center';
  ctx.direction  = 'rtl';
  ctx.fillStyle  = '#ffffff';
  ctx.font       = `700 ${role ? 42 : 48}px Amiri, Cairo, Tajawal, sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur  = 5;
  ctx.fillText(name, S/2, role ? badgeY + badgeH*0.43 : badgeY + badgeH*0.60);
  ctx.restore();

  // المنصب
  if (role) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#50E6FF';
    ctx.font      = '700 28px Cairo, Tajawal, sans-serif';
    ctx.fillText(role, S/2, badgeY + badgeH*0.77);
    ctx.restore();
  }

  // 8. فوتر
  const ftH = 82;
  const ftGrad = ctx.createLinearGradient(0, S-ftH, 0, S);
  ftGrad.addColorStop(0, 'rgba(0,0,0,0)');
  ftGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = ftGrad;
  ctx.fillRect(0, S-ftH, S, ftH);

  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.drawImage(logoImg, S/2 - 128, S-50, 30, 30);
    ctx.restore();
  }

  ctx.textAlign = 'center';
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  ctx.font      = '600 19px Cairo, Tajawal, sans-serif';
  ctx.fillText('· MLSA 2026 · عيد مبارك ·', S/2 + 16, S-24);

  return canvas;
}

// ── رسم General Card ──────────────────────────

async function drawGeneralCard() {
  const W = 900, H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bgImg = await loadImage('image/eid.png');
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#881c3c');
    grad.addColorStop(1, '#d24a73');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  const ov = ctx.createLinearGradient(0, H*0.5, 0, H);
  ov.addColorStop(0, 'rgba(0,0,0,0.05)');
  ov.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);

  const name   = document.getElementById('outName2').textContent.trim();
  const badgeW = Math.min(W * 0.82, 700);
  const badgeH = 130;
  const badgeX = (W - badgeW) / 2;
  const badgeY = H * 0.72 - badgeH / 2;

  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur    = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 40);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth   = 2.5;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 40);
  ctx.stroke();

  ctx.save();
  ctx.textAlign  = 'center';
  ctx.direction  = 'rtl';
  ctx.fillStyle  = '#ffffff';
  ctx.font       = '900 54px Cairo, Tajawal, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur  = 12;
  ctx.fillText(name, W/2, badgeY + badgeH*0.62);
  ctx.restore();

  return canvas;
}

// ── Download ──────────────────────────────────

async function downloadCard() {
  const ids  = ['clubCard', 'genCard1'];
  const card = ids
    .map(id => document.getElementById(id))
    .find(el => !el.classList.contains('hidden'));

  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.innerHTML = 'جاري التحميل...';
  btn.disabled  = true;

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise(r => setTimeout(r, 400));

  try {
    const canvas = card.id === 'clubCard'
      ? await drawClubCard()
      : await drawGeneralCard();

    const link    = document.createElement('a');
    link.download = 'mlsac-eid-1447.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();

    btn.innerHTML = '<span>✅</span> <span>تم التحميل!</span>';
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

// ── Floating shapes ───────────────────────────

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  const colors = ['#0078D4', '#50E6FF', '#FFB900', '#7FBA00'];
  const shapes = ['◆', '✦', '●', '▪'];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';
    const size     = Math.random() * 12 + 4;
    const useEmoji = Math.random() > 0.5;

    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -60px;
      width: ${size}px;
      height: ${size}px;
      ${useEmoji
        ? `color: ${colors[Math.floor(Math.random()*colors.length)]}; font-size: ${size}px;`
        : `background: ${colors[Math.floor(Math.random()*colors.length)]}; border-radius: ${Math.random()>0.5?'50%':'3px'}; transform: rotate(45deg);`
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

// ── Particle canvas ───────────────────────────

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
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
      ctx.fillStyle   = p.color;
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

// ── Shake animation ───────────────────────────

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

// ── Init ──────────────────────────────────────

createFloatingShapes();
initParticleCanvas();
