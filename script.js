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
  ['clubCard','genCard1'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('mainOpt1').classList.remove('active');
  document.getElementById('mainOpt2').classList.remove('active');
  ['nameA','roleA','nameB'].forEach(id => {
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

const STAR_POSITIONS = [[8,12],[15,55],[88,10],[82,60],[50,6],[50,94],[22,30],[75,30]];

function buildClubStars() {
  const container = document.getElementById('clubStars');
  if (!container) return;
  container.innerHTML = '';
  STAR_POSITIONS.forEach(([x,y],i) => {
    const star = document.createElement('div');
    star.style.cssText = `position:absolute;left:${x}%;top:${y}%;color:rgba(255,255,255,${0.3+Math.random()*0.5});font-size:${Math.random()*10+8}px;animation:popTwinkle ${2+Math.random()*2}s ${i*0.2}s infinite;pointer-events:none;`;
    star.textContent = Math.random()>0.5 ? '✦' : '✧';
    container.appendChild(star);
  });
}

const FESTIVE_POS = [[8,10],[14,16],[86,10],[80,18],[11,82],[86,76],[50,8],[50,92],[30,25],[70,75],[20,60],[80,40]];

function buildFestiveDecor(containerId, colorA, colorB) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  FESTIVE_POS.forEach(([x,y],i) => {
    const el = document.createElement('div');
    el.className = 'c-confetti';
    el.style.cssText = `left:${x}%;top:${y}%;width:${Math.random()*8+5}px;height:${Math.random()*8+5}px;background:${Math.random()>.5?colorA:colorB};animation-delay:${i*.16}s;animation-duration:${2+Math.random()*2}s;`;
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
  buildFestiveDecor('gen1Decor','#ffffff','rgba(80,230,255,.9)');
  showResult('genCard1');
}

function showResult(visibleId) {
  ['step1','step2A','step2B'].forEach(id => document.getElementById(id).classList.add('hidden'));
  ['clubCard','genCard1'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById(visibleId).classList.remove('hidden');
  const section = document.getElementById('resultSection');
  section.classList.remove('hidden');
  setTimeout(() => section.scrollIntoView({ behavior:'smooth', block:'start' }), 150);
}

// ══════════════════════════════════════════════
//  Download — html2canvas بدون تلوث cross-origin
// ══════════════════════════════════════════════

async function downloadCard() {
  const card = ['clubCard','genCard1']
    .map(id => document.getElementById(id))
    .find(el => !el.classList.contains('hidden'));
  if (!card) return;

  const btn = document.getElementById('dlBtn');
  btn.innerHTML = 'جاري التحميل...';
  btn.disabled  = true;

  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  try {
    // ── الخطوة المهمة: نحول كل الصور لـ dataURL قبل html2canvas ──
    // هذا يمنع "tainted canvas" على iOS
    await preloadImagesAsDataURL(card);
    await new Promise(r => setTimeout(r, 600));

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: true,   // ← مهم على iOS
      backgroundColor: null,
      logging: false,
      imageTimeout: 20000,
      foreignObjectRendering: false,

      onclone: (doc) => {
        // أوقف الأنيميشن
        const s = doc.createElement('style');
        s.textContent = `*,*::before,*::after{animation:none!important;transition:none!important;}`;
        doc.head.appendChild(s);

        // اجبر RTL وظهور النصوص
        doc.documentElement.setAttribute('dir','rtl');
        doc.documentElement.setAttribute('lang','ar');
        doc.body.setAttribute('dir','rtl');

        const fix = doc.createElement('style');
        fix.textContent = `
          .b-name,.b-role,.gen1-name,.club-kol,
          .club-ar-name,.footer-txt-ar,.footer-copy,
          .club-en-name,.footer-txt {
            opacity:1!important; visibility:visible!important;
            direction:rtl!important; unicode-bidi:embed!important;
            text-align:center!important;
            -webkit-text-fill-color:inherit!important;
          }
        `;
        doc.head.appendChild(fix);

        // اجبر ظهور البادج والاسم
        ['.club-badge','.b-info'].forEach(sel => {
          const el = doc.querySelector(sel);
          if(el){ el.style.opacity='1'; el.style.visibility='visible'; el.style.display='flex'; }
        });
        const nm = doc.querySelector('.b-name');
        if(nm){ nm.style.opacity='1'; nm.style.visibility='visible'; nm.style.color='#fff'; nm.style.webkitTextFillColor='#fff'; }
        const rl = doc.querySelector('.b-role');
        if(rl){ const h=rl.textContent.trim().length>0; rl.style.display=h?'block':'none'; rl.style.opacity='1'; rl.style.color='#50E6FF'; rl.style.webkitTextFillColor='#50E6FF'; }
        const kl = doc.querySelector('.club-kol');
        if(kl){ kl.style.opacity='1'; kl.style.visibility='visible'; kl.style.color='rgba(255,255,255,0.95)'; kl.style.webkitTextFillColor='rgba(255,255,255,0.95)'; }
        const gn = doc.querySelector('.gen1-name');
        if(gn){ gn.style.opacity='1'; gn.style.visibility='visible'; gn.style.color='#fff'; gn.style.webkitTextFillColor='#fff'; }
      }
    });

    // استخدم toBlob بدل toDataURL — يتجنب "insecure" على iOS
    canvas.toBlob(blob => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'mlsac-eid-1447.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }, 'image/png');

    btn.innerHTML = '<span>✅</span> <span>تم التحميل!</span>';
    setTimeout(() => {
      btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
      btn.disabled  = false;
    }, 2200);

  } catch(err) {
    console.error(err);
    alert('حدث خطأ: ' + err.message);
    btn.innerHTML = '<span class="dl-icon">⬇</span> <span>تحميل البطاقة</span>';
    btn.disabled  = false;
  }
}

// تحويل صور الكارد لـ dataURL قبل html2canvas
async function preloadImagesAsDataURL(card) {
  const imgs = card.querySelectorAll('img');
  const promises = Array.from(imgs).map(img => {
    return new Promise(resolve => {
      if (!img.src || img.src.startsWith('data:')) { resolve(); return; }
      fetch(img.src)
        .then(r => r.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = e => { img.src = e.target.result; resolve(); };
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve());
    });
  });
  await Promise.all(promises);
}

// ══════════════════════════════════════════════
//  Floating shapes + Particles
// ══════════════════════════════════════════════

function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  const colors = ['#0078D4','#50E6FF','#FFB900','#7FBA00'];
  const shapes = ['◆','✦','●','▪'];
  for(let i=0;i<18;i++){
    const el=document.createElement('div');
    el.className='float-shape';
    const size=Math.random()*12+4, useEmoji=Math.random()>0.5;
    el.style.cssText=`left:${Math.random()*100}%;bottom:-60px;width:${size}px;height:${size}px;${useEmoji?`color:${colors[Math.floor(Math.random()*colors.length)]};font-size:${size}px;`:`background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'3px'};transform:rotate(45deg);`}animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*12}s;`;
    if(useEmoji) el.textContent=shapes[Math.floor(Math.random()*shapes.length)];
    container.appendChild(el);
  }
}

function initParticleCanvas() {
  const canvas=document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W=window.innerWidth, H=window.innerHeight;
  canvas.width=W; canvas.height=H;
  window.addEventListener('resize',()=>{W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H;});
  const particles=[];
  for(let i=0;i<30;i++) particles.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.5,speedX:(Math.random()-0.5)*0.3,speedY:(Math.random()-0.5)*0.3,alpha:Math.random()*0.5+0.1,color:Math.random()>0.5?'#50E6FF':'#FFB900'});
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha;ctx.fill();p.x+=p.speedX;p.y+=p.speedY;if(p.x<0||p.x>W)p.speedX*=-1;if(p.y<0||p.y>H)p.speedY*=-1;});
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('keypress',(e)=>{
  if(e.key==='Enter'){
    if(!document.getElementById('step2A').classList.contains('hidden')) generateClub();
    else if(!document.getElementById('step2B').classList.contains('hidden')) generateGeneral();
  }
});

const shakeStyle=document.createElement('style');
shakeStyle.textContent=`
  @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}
  .input-error{animation:shake .35s ease both !important;}
`;
document.head.appendChild(shakeStyle);

createFloatingShapes();
initParticleCanvas();
