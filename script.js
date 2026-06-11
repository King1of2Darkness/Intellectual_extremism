// ===== التنقل بين الصفحات =====
var PAGES = [
  'index.html',
  'page1.html',
  'page2.html',
  'page3.html',
  'page4.html',
  'page5.html',
  'page6.html',
];

var TABS = [
  'الرئيسية',
  'الفيديو والمدخل',
  'المفهوم والتعريف',
  'الأسباب والتطور',
  'الآثار والتأثيرات',
  'الوقاية والحلول',
  'الخاتمة',
];

function buildNav(activeIndex) {
  var nav = document.getElementById('pages-nav');
  if (!nav) return;
  var html = '';
  PAGES.forEach(function(file, i) {
    if (i > 0) html += '<span class="tab-sep">|</span>';
    html += '<div class="page-tab' + (i === activeIndex ? ' active' : '') +
            '" onclick="location.href=\'' + file + '\'">' + TABS[i] + '</div>';
  });
  nav.innerHTML = html;
}

function goPage(n) { location.href = PAGES[n]; }
function tocGoPage(n) { toggleToc(); location.href = PAGES[n]; }
function goPageSection(n) { location.href = PAGES[n]; }

// ===== الفهرس الجانبي =====
var tocOpen = false;
function toggleToc() {
  tocOpen = !tocOpen;
  document.getElementById('toc-panel').classList.toggle('open', tocOpen);
  document.getElementById('toc-overlay').classList.toggle('open', tocOpen);
  var btn = document.getElementById('toc-btn');
  if (btn) btn.classList.toggle('active', tocOpen);
  if (tocOpen && settingsOpen) toggleSettings();
}
function toggleTpChapter(id) {
  document.getElementById(id).classList.toggle('open');
}

// ===== الإعدادات =====
var settingsOpen = false;
function toggleSettings() {
  settingsOpen = !settingsOpen;
  document.getElementById('settings-panel').classList.toggle('open', settingsOpen);
  document.getElementById('settings-overlay').classList.toggle('open', settingsOpen);
  if (settingsOpen && tocOpen) toggleToc();
}

function applyFontSize(val) {
  document.querySelector('.main-container').style.fontSize = val + '%';
  document.getElementById('font-size-val').textContent = val + '%';
  localStorage.setItem('acc_fontSize', val);
}
function applyLineHeight(val) {
  var lh = (val / 100).toFixed(1);
  document.querySelector('.main-container').style.lineHeight = lh;
  document.getElementById('line-height-val').textContent = lh;
  localStorage.setItem('acc_lineHeight', val);
}
function applyHighContrast(on) {
  document.querySelectorAll('p, li, .section-box, .highlight-box').forEach(function(el) {
    el.style.color = on ? '#ffffff' : '';
    el.style.textShadow = on ? '0 0 1px #000' : '';
  });
  document.querySelectorAll('.section-box').forEach(function(el) {
    el.style.background = on ? 'rgba(0,0,0,0.95)' : '';
    el.style.borderColor = on ? '#00ffff' : '';
  });
  localStorage.setItem('acc_highContrast', on ? '1' : '0');
}
function applyGrayscale(on) {
  document.body.style.filter = on ? 'grayscale(100%)' : '';
  localStorage.setItem('acc_grayscale', on ? '1' : '0');
}
function resetAll() {
  applyFontSize(100); document.getElementById('font-size-slider').value = 100;
  applyLineHeight(190); document.getElementById('line-height-slider').value = 190;
  applyHighContrast(false); document.getElementById('high-contrast-toggle').checked = false;
  applyGrayscale(false); document.getElementById('grayscale-toggle').checked = false;
  localStorage.clear();
}

// ===== فهرس الصفحة =====
function toggleChapter(id) {
  document.getElementById(id).classList.toggle('open');
}

// ===== شريط التقدم والعودة للأعلى =====
window.addEventListener('scroll', function() {
  var scrollable = document.documentElement.scrollHeight - window.innerHeight;
  var scrolled = window.scrollY;
  if (scrollable > 0) document.getElementById('progress-bar').style.width = ((scrolled / scrollable) * 100) + '%';
  document.getElementById('back-to-top').style.display = scrolled > 300 ? 'block' : 'none';
});

// ===== شاشة الترحيب =====
var introSnowInterval = null;

function drawBolt(ctx, x1, y1, x2, y2, depth) {
  if (depth < 0) return;
  var pts = [{x: x1, y: y1}];
  var segs = 14 + Math.floor(Math.random() * 6);
  for (var i = 1; i < segs; i++) {
    var t = i / segs;
    var jagged = depth === 2 ? 70 : depth === 1 ? 40 : 20;
    pts.push({x: x1 + (x2-x1)*t + (Math.random()-0.5)*jagged, y: y1 + (y2-y1)*t + (Math.random()-0.5)*jagged*0.6});
  }
  pts.push({x: x2, y: y2});
  var layers = [
    {s: depth===2?'rgba(0,150,255,0.2)':'rgba(0,188,212,0.15)', lw: depth===2?18:depth===1?10:5, sb:60, sc:'#0055ff'},
    {s: depth===2?'rgba(0,220,255,0.5)':'rgba(0,200,255,0.3)', lw: depth===2?8:depth===1?4:2, sb:30, sc:'#00bcd4'},
    {s: depth===2?'#00eeff':'rgba(100,230,255,0.8)', lw: depth===2?2.5:depth===1?1.5:0.8, sb:10, sc:'#00ffff'},
    {s: 'rgba(255,255,255,'+(depth===2?'1':'0.7')+')', lw: depth===2?1.2:0.6, sb:0, sc:'transparent'}
  ];
  layers.forEach(function(l) {
    ctx.beginPath(); ctx.strokeStyle=l.s; ctx.lineWidth=l.lw;
    ctx.shadowBlur=l.sb; ctx.shadowColor=l.sc; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(function(p){ctx.lineTo(p.x,p.y);}); ctx.stroke();
  });
  if (depth > 0) {
    var numB = depth===2 ? 3+Math.floor(Math.random()*3) : 1+Math.floor(Math.random()*2);
    for (var b = 0; b < numB; b++) {
      var bIdx = Math.floor(pts.length*0.2 + Math.random()*pts.length*0.6);
      var bpt = pts[bIdx];
      var angle = (Math.random()-0.5)*Math.PI*1.4;
      var len = (depth===2?120:70) + Math.random()*100;
      drawBolt(ctx, bpt.x, bpt.y, bpt.x+Math.cos(angle)*len, bpt.y+Math.sin(angle)*len*0.7, depth-1);
    }
  }
}

function strikeSingleBolt(dir) {
  var canvas = document.getElementById('lightning-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  var title = document.getElementById('intro-title');
  var rect = title ? title.getBoundingClientRect() : null;
  var cx = rect ? (rect.left+rect.right)/2 : canvas.width/2;
  var cy = rect ? rect.top+rect.height/2 : canvas.height/2;
  var r = Math.random;
  var T = {
    top:{bx:cx+(r()-0.5)*100,by:cy-350-r()*180}, bottom:{bx:cx+(r()-0.5)*100,by:cy+350+r()*180},
    right:{bx:cx+350+r()*180,by:cy+(r()-0.5)*100}, left:{bx:cx-350-r()*180,by:cy+(r()-0.5)*100},
    topright:{bx:cx+280+r()*120,by:cy-280-r()*120}, topleft:{bx:cx-280-r()*120,by:cy-280-r()*120},
    bottomright:{bx:cx+280+r()*120,by:cy+280+r()*120}, bottomleft:{bx:cx-280-r()*120,by:cy+280+r()*120}
  };
  var d = T[dir] || T.top;
  drawBolt(ctx, cx, cy, d.bx, d.by, 2);
  if (title) {
    title.style.textShadow = '0 0 60px #fff,0 0 120px #00bcd4,0 0 200px #0055ff';
    setTimeout(function(){title.style.textShadow='0 0 40px #00bcd4,0 0 80px #0055ff';}, 180);
  }
  var is = document.getElementById('intro-screen');
  if (is) { is.style.background='rgba(0,40,100,0.95)'; setTimeout(function(){is.style.background='radial-gradient(ellipse at center,#000820 0%,#000005 100%)';},100); }
  setTimeout(function(){ctx.clearRect(0,0,canvas.width,canvas.height);}, 260);
}

var allDirs = ['top','bottom','right','left','topright','topleft','bottomright','bottomleft'];
function fireRandomBolts(count, spread) {
  var shuffled = allDirs.slice().sort(function(){return Math.random()-0.5;});
  for (var i = 0; i < count; i++) {
    (function(dir,delay){setTimeout(function(){strikeSingleBolt(dir);},delay);})(shuffled[i%shuffled.length], Math.random()*spread);
  }
}

function createIntroSnow() {
  var symbols = ['❄','❅','❆','·','•','✦','✧','*','❋','✼'];
  var snow = document.createElement('div');
  snow.classList.add('intro-snow');
  snow.innerHTML = symbols[Math.floor(Math.random()*symbols.length)];
  var size = Math.random()*25+8;
  snow.style.fontSize = size+'px'; snow.style.left = (Math.random()*100)+'vw'; snow.style.top = '-50px';
  snow.style.color = Math.random()>0.6?'#a0e8ff':'#ffffff';
  snow.style.opacity = (Math.random()*0.6+0.4).toString();
  var dur = Math.random()*1.5+0.8;
  snow.style.animationDuration = dur+'s';
  snow.style.setProperty('--drift',((Math.random()-0.5)*150)+'px');
  snow.style.setProperty('--spin',((Math.random()-0.5)*720)+'deg');
  var sc = document.getElementById('intro-screen');
  if (sc) sc.appendChild(snow);
  setTimeout(function(){if(snow.parentNode)snow.remove();},(dur+0.3)*1000);
}

function startIntro() {
  var introScreen = document.getElementById('intro-screen');
  var mainSite = document.getElementById('main-site');
  if (!introScreen || !mainSite) return;

  // ===== تأثير الترحيب يظهر فقط عند فتح الموقع لأول مرة =====
  var isIndexPage = (location.pathname === '/' || location.pathname.endsWith('index.html') || location.pathname === '');
  var alreadySeen  = sessionStorage.getItem('introSeen');

  if (!isIndexPage || alreadySeen) {
    // أخفِ شاشة الترحيب فوراً في باقي الصفحات
    introScreen.style.display = 'none';
    mainSite.classList.add('visible');
    return;
  }

  // سجّل أن المستخدم شاهد الترحيب في هذه الجلسة
  sessionStorage.setItem('introSeen', '1');

  setTimeout(function(){fireRandomBolts(3,600);},1400);
  setTimeout(function(){fireRandomBolts(2,400);},2200);
  setTimeout(function(){fireRandomBolts(3,500);},2800);
  setTimeout(function(){
    introSnowInterval = setInterval(createIntroSnow, 18);
    for (var i=0; i<100; i++) setTimeout(createIntroSnow, i*12);
    setTimeout(function(){fireRandomBolts(2,300);},200);
    setTimeout(function(){fireRandomBolts(3,500);},800);
    setTimeout(function(){fireRandomBolts(2,400);},1500);
    setTimeout(function(){fireRandomBolts(3,600);},2000);
    setTimeout(function(){
      clearInterval(introSnowInterval);
      introScreen.classList.add('fade-out');
      setTimeout(function(){introScreen.style.display='none'; mainSite.classList.add('visible');},1200);
    },2800);
  },3000);
}

// ===== كيرسور مخصص =====
function initCursor() {
  var cursorEl = document.createElement('div');
  cursorEl.id = 'custom-cursor';
  document.body.appendChild(cursorEl);
  var hue = 180, lastTrailTime = 0;
  setInterval(function(){
    hue = (hue+2)%360;
    cursorEl.style.background = 'radial-gradient(circle,#fff,hsl('+hue+',100%,60%))';
    cursorEl.style.boxShadow = '0 0 12px hsl('+hue+',100%,70%),0 0 30px hsl('+hue+',100%,50%)';
  },16);
  document.addEventListener('mousemove', function(e){
    cursorEl.style.left = e.clientX+'px'; cursorEl.style.top = e.clientY+'px';
    var now = Date.now();
    if (now - lastTrailTime > 20) {
      lastTrailTime = now;
      var trail = document.createElement('div');
      trail.classList.add('cursor-trail');
      var sz = Math.random()*10+5;
      trail.style.width = sz+'px'; trail.style.height = sz+'px';
      trail.style.left = e.clientX+'px'; trail.style.top = e.clientY+'px';
      trail.style.background = 'radial-gradient(circle,hsl('+(hue+(Math.random()-0.5)*60)+',100%,80%),transparent)';
      var dur = Math.random()*0.5+0.3;
      trail.style.animationDuration = dur+'s';
      document.body.appendChild(trail);
      setTimeout(function(){if(trail.parentNode)trail.remove();},dur*1000);
    }
  });
}

// ===== تحميل الإعدادات المحفوظة =====
function loadSettings() {
  var fs = localStorage.getItem('acc_fontSize');
  if (fs) { applyFontSize(fs); var s=document.getElementById('font-size-slider'); if(s) s.value=fs; }
  var lh = localStorage.getItem('acc_lineHeight');
  if (lh) { applyLineHeight(lh); var s2=document.getElementById('line-height-slider'); if(s2) s2.value=lh; }
  if (localStorage.getItem('acc_highContrast')==='1') { applyHighContrast(true); var t=document.getElementById('high-contrast-toggle'); if(t) t.checked=true; }
  if (localStorage.getItem('acc_grayscale')==='1') { applyGrayscale(true); var t2=document.getElementById('grayscale-toggle'); if(t2) t2.checked=true; }
}

window.addEventListener('load', function() {
  loadSettings();
  startIntro();
  initCursor();
});
