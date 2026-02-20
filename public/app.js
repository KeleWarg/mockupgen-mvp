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
  if (show3d) {
    exitAdjustBg();
    if (typeof closeScreenPanel === 'function') closeScreenPanel();
  }
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
  if (typeof closeScreenPanel === 'function') closeScreenPanel();
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

const screenPos = {};
const screenPanel = document.getElementById('screen-panel');
const screenPanelTitle = document.getElementById('screen-panel-title');
const screenScaleSlider = document.getElementById('screen-scale');
const screenXSlider = document.getElementById('screen-x');
const screenYSlider = document.getElementById('screen-y');
const screenScaleVal = document.getElementById('screen-scale-val');
const screenXVal = document.getElementById('screen-x-val');
const screenYVal = document.getElementById('screen-y-val');

let activeScreenKey = null;

const SCREEN_LABELS = {
  'ipad-portrait-screen': 'iPad Portrait',
  'iphone-screen': 'iPhone',
  'ipad-landscape-screen': 'iPad Landscape',
};

function applyScreenPos(key) {
  const el = document.getElementById(key);
  const pos = screenPos[key];
  el.style.objectPosition = `${pos.x}% ${pos.y}%`;
  el.style.objectFit = pos.zoom < 100 ? 'contain' : 'cover';
  el.style.transform = pos.zoom !== 100 ? `scale(${pos.zoom / 100})` : '';
}

function syncScreenSliders(key) {
  const pos = screenPos[key];
  screenScaleSlider.value = pos.zoom;
  screenXSlider.value = pos.x;
  screenYSlider.value = pos.y;
  screenScaleVal.textContent = pos.zoom + '%';
  screenXVal.textContent = pos.x + '%';
  screenYVal.textContent = pos.y + '%';
}

function openScreenPanel(key) {
  activeScreenKey = key;
  screenPanelTitle.textContent = SCREEN_LABELS[key] || 'Adjust Screen';
  syncScreenSliders(key);
  document.getElementById(key).closest('.device').classList.add('screen-editing');

  if (show3d) { show3d = false; panel3d.classList.remove('visible'); btn3d.classList.remove('active'); }
  if (adjustBg) exitAdjustBg();
  screenPanel.classList.add('visible');
}

function closeScreenPanel() {
  screenPanel.classList.remove('visible');
  if (activeScreenKey) {
    document.getElementById(activeScreenKey).closest('.device').classList.remove('screen-editing');
  }
  activeScreenKey = null;
}

['screen-scale', 'screen-x', 'screen-y'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    if (!activeScreenKey) return;
    const pos = screenPos[activeScreenKey];
    if (id === 'screen-scale') pos.zoom = parseInt(this.value);
    else if (id === 'screen-x') pos.x = parseInt(this.value);
    else pos.y = parseInt(this.value);
    applyScreenPos(activeScreenKey);
    syncScreenSliders(activeScreenKey);
  });
});

document.getElementById('screen-reset').addEventListener('click', () => {
  if (!activeScreenKey) return;
  screenPos[activeScreenKey] = { x: 50, y: 50, zoom: 100 };
  applyScreenPos(activeScreenKey);
  syncScreenSliders(activeScreenKey);
});

document.getElementById('screen-done').addEventListener('click', closeScreenPanel);

document.getElementById('screen-replace').addEventListener('click', () => {
  if (!activeScreenKey) return;
  const d = DEVICE_SCREENS.find(d => d.screen === activeScreenKey);
  if (d) document.getElementById(d.input).click();
});

DEVICE_SCREENS.forEach(d => {
  const screenEl = document.getElementById(d.screen);
  const inputEl = document.getElementById(d.input);
  const placeholderEl = document.getElementById(d.placeholder);
  const key = d.screen;
  screenPos[key] = { x: 50, y: 50, zoom: 100 };

  inputEl.addEventListener('change', function (e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      screenEl.src = ev.target.result;
      screenEl.style.display = 'block';
      placeholderEl.style.display = 'none';
      screenPos[key] = { x: 50, y: 50, zoom: 100 };
      applyScreenPos(key);
      if (activeScreenKey === key) syncScreenSliders(key);
    };
    r.readAsDataURL(f);
  });

  screenEl.addEventListener('click', e => {
    if (screenEl.style.display === 'none') return;
    e.preventDefault();
    if (activeScreenKey === key) { closeScreenPanel(); return; }
    if (activeScreenKey) {
      document.getElementById(activeScreenKey).closest('.device').classList.remove('screen-editing');
    }
    openScreenPanel(key);
  });
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
// SAVE / DOWNLOAD
// ══════════════════════════
const saveBtn = document.getElementById('save-btn');

function swapScreensForExport() {
  const swaps = [];
  DEVICE_SCREENS.forEach(d => {
    const img = document.getElementById(d.screen);
    if (img.style.display === 'none' || !img.src) return;
    const pos = screenPos[d.screen];
    const parent = img.parentElement;
    const div = document.createElement('div');
    div.style.cssText = `
      width: 100%; height: 100%;
      background-image: url(${img.src});
      background-size: ${pos.zoom < 100 ? 'contain' : 'cover'};
      background-position: ${pos.x}% ${pos.y}%;
      background-repeat: no-repeat;
      background-color: #000;
      ${pos.zoom !== 100 ? `transform: scale(${pos.zoom / 100}); transform-origin: center center;` : ''}
    `;
    img.style.display = 'none';
    parent.appendChild(div);
    swaps.push({ img, div, parent });
  });
  return swaps;
}

function restoreScreensAfterExport(swaps) {
  swaps.forEach(({ img, div, parent }) => {
    parent.removeChild(div);
    img.style.display = 'block';
  });
}

saveBtn.addEventListener('click', async () => {
  const origText = saveBtn.textContent;
  saveBtn.textContent = 'Saving…';
  saveBtn.disabled = true;

  const savedTransform = scene.style.transform;
  const savedOrigin = scene.style.transformOrigin;
  const savedMargin = scene.style.marginBottom;
  scene.style.transform = '';
  scene.style.transformOrigin = '';
  scene.style.marginBottom = '';

  const swaps = swapScreensForExport();

  try {
    const canvas = await html2canvas(scene, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: 1200,
      height: 900,
    });

    const link = document.createElement('a');
    link.download = `mockup-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Save failed:', err);
    alert('Save failed — check console for details.');
  } finally {
    restoreScreensAfterExport(swaps);
    scene.style.transform = savedTransform;
    scene.style.transformOrigin = savedOrigin;
    scene.style.marginBottom = savedMargin;
    saveBtn.textContent = origText;
    saveBtn.disabled = false;
  }
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
