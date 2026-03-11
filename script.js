// =============================================
//  MLSAC Eid Generator — script.js
// =============================================

let majorTemplate = 0; // 1=club, 2=general

// ── Navigation ────────────────────────────────

function chooseMajor(n) {
  majorTemplate = n;
  document.getElementById('mainOpt1').classList.toggle('active', n === 1);
  document.getElementById('mainOpt2').classList.toggle('active', n === 2);
  document.getElementById('step1').classList.add('hidden');

  if (n === 1) {
    document.getElementById('step2A').classList.remove('hidden');
    setTimeout(() => document.getElementById('nameA').focus(), 100);
  } else {
    document.getElementById('step2B').classList.remove('hidden');
    setTimeout(() => document.getElementById('nameB').focus(), 100);
  }
}

function goBack() {
  document.getElementById('step2A').classList.add('hidden');
  document.getElementById('step2B').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
}

function goBackFromResult() {
  document.getElementById('resultSection').classList.add('hidden');
  ['clubCard','genCard1'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  document.getElementById('step1').classList.remove('hidden');

  ['nameA','roleA','nameB'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ── Validation ───────────────────────────────

function requireName(inputId) {
  const el  = document.getElementById(inputId);
  const val = el.value.trim();
  if (!val) {
    el.focus();
    el.style.borderColor = '#F25022';
    el.style.boxShadow   = '0 0 14px rgba(242,80,34,.4)';
    setTimeout(() => {
      el.style.borderColor = 'rgba(80,230,255,.3)';
      el.style.boxShadow   = '';
    }, 1200);
    return null;
  }
  return val;
}

// ── Decorative fireworks dots ─────────────────

const FESTIVE_POS = [
  [8,10],[14,16],[86,10],[80,18],[11,82],[86,76],[50,8],[50,92]
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
      width:${Math.random()*8+6}px;
      height:${Math.random()*8+6}px;
      background:${Math.random() > .5 ? colorA : colorB};
      animation-delay:${i * .18}s;
      animation-duration:${2 + Math.random()*1.8}s;
    `;
    c.appendChild(el);
  });
}

// ── Generate Club Card ────────────────────────

function generateClub() {
  const name = requireName('nameA');
  if (!name) return;

  const role = document.getElementById('roleA').value.trim();

  document.getElementById('outName1').textContent = name;

  const roleEl = document.getElementById('outRole1');
  roleEl.textContent = role;
  roleEl.classList.toggle('show', !!role);

  showResult('clubCard');
}

// ── Generate General Card ─────────────────────

function generateGeneral() {
  const name = requireName('nameB');
  if (!name) return;

  document.getElementById('outName2').textContent = name;
  buildFestiveDecor('gen1Decor', '#ffffff', '#d9ecff');
  showResult('genCard1');
}

// ── Show Result ───────────────────────────────

function showResult(visibleId) {
  ['step1','step2A','step2B'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  ['clubCard','genCard1'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  document.getElementById(visibleId).classList.remove('hidden');

  const section = document.getElementById('resultSection');
  section.classList.remove('hidden');

  setTimeout(() => {
    section.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, 120);
}

// ── Download ──────────────────────────────────

function downloadCard() {
  const ids = ['clubCard','genCard1'];
  const card = ids.map(id => document.getElementById(id))
                  .find(el => !el.classList.contains('hidden'));
  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.textContent = ' جاري التحميل...';
  btn.disabled = true;

  html2canvas(card, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 10000,
    onclone: (doc) => {
      doc.querySelectorAll('.b-name,.b-role,.rb-name').forEach(el => {
        el.style.direction    = 'rtl';
        el.style.unicodeBidi  = 'embed';
      });
    }
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'mlsa-eid-2026.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error(err);
    alert('حدث خطأ أثناء التحميل، حاولي مجدداً');
  }).finally(() => {
    btn.textContent = ' تحميل الصورة';
    btn.disabled = false;
  });
}

// ── Floating shapes background ────────────────

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  const colors = ['#0078D4','#50E6FF','#FFB900','#7FBA00','#F25022'];

  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';
    const size = Math.random() * 14 + 5;
    el.style.cssText = `
      left:${Math.random()*100}%;
      bottom:-60px;
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      transform:rotate(45deg);
      border-radius:3px;
      animation-duration:${Math.random()*10+7}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(el);
  }
}

// ── Enter key ─────────────────────────────────

document.getElementById('nameA').addEventListener('keypress', e => {
  if (e.key === 'Enter') generateClub();
});

document.getElementById('roleA').addEventListener('keypress', e => {
  if (e.key === 'Enter') generateClub();
});

document.getElementById('nameB').addEventListener('keypress', e => {
  if (e.key === 'Enter') generateGeneral();
});

// ── Init ─────────────────────────────────────
createFloatingShapes();
