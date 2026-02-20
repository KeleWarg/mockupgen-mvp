// ══════════════════════════════════════
// Device Mockup Composer — Main Script
// ══════════════════════════════════════

const scene = document.getElementById('scene');
const bgImage = document.getElementById('bg-image');
const devicesRow = document.getElementById('devices-row');
const devIpadP = document.getElementById('dev-ipad-portrait');
const devIphone = document.getElementById('dev-iphone');
const devIpadL = document.getElementById('dev-ipad-landscape');

// ────────────────────
// BACKGROUND PRESETS
// ────────────────────
const BG_PRESETS = {
  'warm-stucco':   'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&h=1200&fit=crop&q=85',
  'concrete':      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1600&h=1200&fit=crop&q=85',
  'dark-plaster':  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&h=1200&fit=crop&q=85',
  'minimal-light': 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=1600&h=1200&fit=crop&q=85',
  'terracotta':    'https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=1600&h=1200&fit=crop&q=85',
};

// ────────────────────
// 3D PRESETS
// ────────────────────
const PRESETS_3D = {
  flat:      { perspective: 2000, groupRx: 0, groupRy: 0, ipadP_ry: 0, ipadP_rx: 0, iphone_ry: 0, iphone_rx: 0, ipadL_ry: 0, ipadL_rx: 0 },
  subtle:    { perspective: 1200, groupRx: 8, groupRy: 0, ipadP_ry: 15, ipadP_rx: 0, iphone_ry: 0, iphone_rx: 0, ipadL_ry: -12, ipadL_rx: 0 },
  editorial: { perspective: 900, groupRx: 12, groupRy: -5, ipadP_ry: 22, ipadP_rx: -3, iphone_ry: 5, iphone_rx: 0, ipadL_ry: -18, ipadL_rx: -2 },
  dramatic:  { perspective: 700, groupRx: 18, groupRy: -8, ipadP_ry: 30, ipadP_rx: -5, iphone_ry: 8, iphone_rx: -3, ipadL_ry: -25, ipadL_rx: -4 },
  hero:      { perspective: 800, groupRx: 15, groupRy: 10, ipadP_ry: 20, ipadP_rx: 0, iphone_ry: 3, iphone_rx: 0, ipadL_ry: -15, ipadL_rx: 0 },
  spread:    { perspective: 1000, groupRx: 10, groupRy: 0, ipadP_ry: 28, ipadP_rx: 0, iphone_ry: 0, iphone_rx: 0, ipadL_ry: -28, ipadL_rx: 0 },
};

// ══════════════════════════
// 3D VIEW
// ══════════════════════════
let view3d = { ...PRESETS_3D.subtle };

const SLIDER_KEY_MAP = {
  'perspective': 'perspective', 'group-rx': 'groupRx', 'group-ry': 'groupRy',
  'ipadP-ry': 'ipadP_ry', 'ipadP-rx': 'ipadP_rx',
  'iphone-ry': 'iphone_ry', 'iphone-rx': 'iphone_rx',
  'ipadL-ry': 'ipadL_ry', 'ipadL-rx': 'ipadL_rx',
};

function apply3d() {
  devicesRow.style.perspective = view3d.perspective + 'px';
  devicesRow.style.transform = `translateX(-50%) rotateX(${view3d.groupRx}deg) rotateY(${view3d.groupRy}deg)`;
  devIpadP.style.transform = `rotateY(${view3d.ipadP_ry}deg) rotateX(${view3d.ipadP_rx}deg)`;
  devIphone.style.transform = `rotateY(${view3d.iphone_ry}deg) rotateX(${view3d.iphone_rx}deg)`;
  devIpadL.style.transform = `rotateY(${view3d.ipadL_ry}deg) rotateX(${view3d.ipadL_rx}deg)`;

  // Sync sliders
  Object.entries(SLIDER_KEY_MAP).forEach(([id, key]) => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(id + '-val');
    if (el) el.value = view3d[key];
    if (valEl) valEl.textContent = id === 'perspective' ? view3d[key] : view3d[key] + '°';
  });
}

// 3D slider listeners
Object.keys(SLIDER_KEY_MAP).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function () {
    view3d[SLIDER_KEY_MAP[id]] = parseInt(this.value);
    apply3d();
    document.querySelectorAll('.preset-3d').forEach(b => b.classList.remove('active'));
  });
});

// 3D preset buttons
document.querySelectorAll('.preset-3d').forEach(btn => {
  btn.addEventListener('click', function () {
    const p = PRESETS_3D[this.dataset.preset];
    if (p) { Object.assign(view3d, p); apply3d(); }
    document.querySelectorAll('.preset-3d').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

document.getElementById('reset-3d').addEventListener('click', () => {
  Object.assign(view3d, PRESETS_3D.subtle);
  apply3d();
  document.querySelectorAll('.preset-3d').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-preset="subtle"]').classList.add('active');
});

// 3D panel toggle
const panel3d = document.getElementById('panel-3d');
const btn3d = document.getElementById('adjust-3d-btn');
let show3d = false;

btn3d.addEventListener('click', () => {
  show3d = !show3d;
  panel3d.classList.toggle('visible', show3d);
  btn3d.classList.toggle('active', show3d);
  if (show3d) exitAdjustBg();
});

document.getElementById('done-3d').addEventListener('click', () => {
  show3d = false;
  panel3d.classList.remove('visible');
  btn3d.classList.remove('active');
});

// Init 3D
apply3d();

// ══════════════════════════
// BACKGROUND CONTROLS
// ══════════════════════════
let bgState = { x: 50, y: 50, scale: 100 };

function applyBg() {
  bgImage.style.backgroundPosition = `${bgState.x}% ${bgState.y}%`;
  bgImage.style.transform = `scale(${bgState.scale / 100})`;
  bgImage.style.backgroundSize = 'cover';
  document.getElementById('bg-scale').value = bgState.scale;
  document.getElementById('bg-x').value = bgState.x;
  document.getElementById('bg-y').value = bgState.y;
  document.getElementById('bg-scale-val').textContent = bgState.scale + '%';
  document.getElementById('bg-x-val').textContent = bgState.x + '%';
  document.getElementById('bg-y-val').textContent = bgState.y + '%';
}

function setBg(url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    bgImage.style.backgroundImage = `url(${url})`;
    bgState = { x: 50, y: 50, scale: 100 };
    applyBg();
  };
  img.src = url;
}

// Load default
setBg(BG_PRESETS['warm-stucco']);

// Preset thumbnails
document.querySelectorAll('.preset-thumb').forEach(t =>
  t.addEventListener('click', function () {
    const k = this.dataset.bg;
    if (BG_PRESETS[k]) setBg(BG_PRESETS[k]);
    document.querySelectorAll('.preset-thumb').forEach(t2 => t2.classList.remove('active'));
    this.classList.add('active');
  })
);

// Upload BG
document.getElementById('upload-bg-btn').addEventListener('click', () =>
  document.getElementById('bg-input').click()
);
document.getElementById('bg-input').addEventListener('change', function (e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    bgImage.style.backgroundImage = `url(${ev.target.result})`;
    bgState = { x: 50, y: 50, scale: 100 };
    applyBg();
    document.querySelectorAll('.preset-thumb').forEach(t => t.classList.remove('active'));
  };
  r.readAsDataURL(f);
});

// BG Adjust mode
let adjustBg = false;
const bgPanel = document.getElementById('bg-panel');
const adjBtn = document.getElementById('adjust-bg-btn');

function enterAdjustBg() {
  adjustBg = true;
  scene.classList.add('adjusting-bg');
  bgPanel.classList.add('visible');
  adjBtn.classList.add('active');
  if (show3d) {
    show3d = false;
    panel3d.classList.remove('visible');
    btn3d.classList.remove('active');
  }
}

function exitAdjustBg() {
  adjustBg = false;
  scene.classList.remove('adjusting-bg');
  bgPanel.classList.remove('visible');
  adjBtn.classList.remove('active');
}

adjBtn.addEventListener('click', () => (adjustBg ? exitAdjustBg() : enterAdjustBg()));
document.getElementById('bg-done').addEventListener('click', exitAdjustBg);
document.getElementById('bg-reset').addEventListener('click', () => {
  bgState = { x: 50, y: 50, scale: 100 };
  applyBg();
});

// BG sliders
['bg-scale', 'bg-x', 'bg-y'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    const key = id === 'bg-scale' ? 'scale' : id === 'bg-x' ? 'x' : 'y';
    bgState[key] = parseInt(this.value);
    applyBg();
  });
});

// BG drag to pan
let isDrag = false, ds = {}, bs = {};
bgImage.addEventListener('mousedown', e => {
  if (!adjustBg) return;
  isDrag = true;
  bgImage.classList.add('dragging');
  ds = { x: e.clientX, y: e.clientY };
  bs = { x: bgState.x, y: bgState.y };
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (!isDrag) return;
  bgState.x = Math.max(0, Math.min(100, bs.x - (e.clientX - ds.x) * 0.08));
  bgState.y = Math.max(0, Math.min(100, bs.y - (e.clientY - ds.y) * 0.08));
  applyBg();
});
document.addEventListener('mouseup', () => {
  isDrag = false;
  bgImage.classList.remove('dragging');
});

// BG scroll to zoom
scene.addEventListener(
  'wheel',
  e => {
    if (!adjustBg) return;
    e.preventDefault();
    bgState.scale = Math.max(50, Math.min(250, bgState.scale + (e.deltaY > 0 ? -3 : 3)));
    applyBg();
  },
  { passive: false }
);

// ══════════════════════════
// DEVICE SCREEN UPLOADS
// ══════════════════════════
const DEVICE_SCREENS = [
  { input: 'ipad-portrait-input', screen: 'ipad-portrait-screen', placeholder: 'ipad-portrait-placeholder' },
  { input: 'iphone-input', screen: 'iphone-screen', placeholder: 'iphone-placeholder' },
  { input: 'ipad-landscape-input', screen: 'ipad-landscape-screen', placeholder: 'ipad-landscape-placeholder' },
];

DEVICE_SCREENS.forEach(d => {
  document.getElementById(d.input).addEventListener('change', function (e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      document.getElementById(d.screen).src = ev.target.result;
      document.getElementById(d.screen).style.display = 'block';
      document.getElementById(d.placeholder).style.display = 'none';
    };
    r.readAsDataURL(f);
  });
  document.getElementById(d.screen).addEventListener('click', () =>
    document.getElementById(d.input).click()
  );
});

// ══════════════════════════
// DEVICE SIZE
// ══════════════════════════
document.getElementById('device-size').addEventListener('change', function () {
  document.querySelectorAll('.device').forEach(d => {
    d.classList.remove('size-sm', 'size-md', 'size-lg');
    d.classList.add('size-' + this.value);
  });
});

// ══════════════════════════
// OVERLAYS
// ══════════════════════════
let overlaysOn = true;
document.getElementById('toggle-overlays').addEventListener('click', function () {
  overlaysOn = !overlaysOn;
  document.querySelectorAll('.scene-overlay').forEach(o => (o.style.opacity = overlaysOn ? '1' : '0'));
  this.textContent = overlaysOn ? 'Light: On' : 'Light: Off';
});

// ══════════════════════════
// DEVICE COLOR
// ══════════════════════════
let colorIdx = 0;
const COLORS = ['device-dark', 'device-silver'];
const COLOR_LABELS = ['Space Gray', 'Silver'];

document.getElementById('toggle-device-color').addEventListener('click', function () {
  colorIdx = (colorIdx + 1) % COLORS.length;
  document.querySelectorAll('.device').forEach(d => {
    COLORS.forEach(c => d.classList.remove(c));
    d.classList.add(COLORS[colorIdx]);
  });
  this.textContent = COLOR_LABELS[colorIdx];
});

// ══════════════════════════
// RESPONSIVE SCENE SCALING
// ══════════════════════════
const canvasWrapper = document.querySelector('.canvas-wrapper');
const toolbar = document.querySelector('.toolbar');

function handleResize() {
  const toolbarH = toolbar.offsetHeight;
  canvasWrapper.style.marginTop = (toolbarH + 12) + 'px';

  const availableWidth = canvasWrapper.clientWidth;
  const sceneW = 1200;
  const sceneH = 900;
  const scale = Math.min(1, availableWidth / sceneW);

  if (scale < 1) {
    scene.style.transform = `scale(${scale})`;
    scene.style.transformOrigin = 'top center';
    scene.style.marginBottom = -(sceneH * (1 - scale)) + 'px';
  } else {
    scene.style.transform = '';
    scene.style.transformOrigin = '';
    scene.style.marginBottom = '';
  }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);
handleResize();

// ══════════════════════════
// TOUCH SUPPORT FOR BG PAN
// ══════════════════════════
bgImage.addEventListener('touchstart', e => {
  if (!adjustBg) return;
  const t = e.touches[0];
  isDrag = true;
  bgImage.classList.add('dragging');
  ds = { x: t.clientX, y: t.clientY };
  bs = { x: bgState.x, y: bgState.y };
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (!isDrag) return;
  const t = e.touches[0];
  bgState.x = Math.max(0, Math.min(100, bs.x - (t.clientX - ds.x) * 0.08));
  bgState.y = Math.max(0, Math.min(100, bs.y - (t.clientY - ds.y) * 0.08));
  applyBg();
}, { passive: false });

document.addEventListener('touchend', () => {
  isDrag = false;
  bgImage.classList.remove('dragging');
});
