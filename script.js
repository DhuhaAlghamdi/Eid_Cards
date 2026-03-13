

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
