/* =====================================================================
   bg-frege.js — 卦象 × Frege《概念文字》生成式背景（iching / game 共用）
   頁面放 <div class="bg-data" id="bgData"></div> + 引入本檔即自動生效。
   無限向上捲動，離屏剪走（記憶體恆定），4 分鐘後凍結慳電。
   ===================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var COL = 'rgba(244,242,240,0.15)';
  var MONO = '"Courier New", Courier, monospace';

  var host = null, svg = null, layer = null;
  var numTexts = [];

  var hexch = function () { return String.fromCharCode(0x4DC0 + ((Math.random() * 64) | 0)); };
  var GK = ['α', 'β', 'γ', 'δ', 'ε', 'm', 'x', 'y'];
  var gk = function () { return GK[(Math.random() * GK.length) | 0]; };
  function bin6() { var b = ''; for (var i = 0; i < 6; i++) b += (Math.random() < .5 ? '0' : '1'); return b; }
  function rndLabel() {
    var r = Math.random();
    if (r < .30) return 'f(' + hexch() + gk() + ', ' + hexch() + gk() + ')';
    if (r < .52) return hexch() + ' ' + bin6();
    if (r < .70) return 'f(m' + gk() + ', ' + gk() + bin6().slice(0, 2) + ')';
    if (r < .85) return 'I(δ, ε) · ' + hexch();
    return 'K.W.(' + String(1 + ((Math.random() * 64) | 0)).padStart(3, '0') + ')';
  }

  function mkLine(x1, y1, x2, y2, w) {
    var l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', COL); l.setAttribute('stroke-width', w || 1);
    (layer || svg).appendChild(l); return l;
  }
  function mkRect(x, y, w, h) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('fill', COL);
    (layer || svg).appendChild(r); return r;
  }
  function mkText(x, y, str, size) {
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('fill', COL);
    t.setAttribute('font-family', MONO);
    t.setAttribute('font-size', size || 9);
    t.textContent = str;
    (layer || svg).appendChild(t); return t;
  }

  /* 內容枝：橫線＋否定豎＋（一層子脊 或 葉標籤）。
     嵌套限一層 + 子脊縮短 → 分枝唔會再打交叉 */
  function branch(x, y, depth, maxX) {
    var len = 46 + Math.random() * 88;
    if (x + len > maxX) len = Math.max(30, maxX - x);
    mkLine(x, y, x + len, y);
    if (Math.random() < .38) mkLine(x + len * 0.38, y, x + len * 0.38, y + 6);
    if (Math.random() < .22) mkText(x + len * 0.6 - 3, y - 3, gk(), 8);

    if (depth < 1 && Math.random() < .32 && x + len < maxX - 90) {
      var h = 20 + Math.random() * 42;
      mkLine(x + len, y, x + len, y + h);
      for (var i = 0; i < 2; i++) branch(x + len, y + h * (i + 1) / 2, depth + 1, maxX);
    } else {
      var t = mkText(x + len + 5, y + 3, rndLabel());
      if (/\d/.test(t.textContent)) {
        t._set = /[01]{6}/.test(t.textContent) ? '01' : '0123456789';
        numTexts.push(t);
      }
    }
  }

  function tree(x, y, h, maxX) {
    mkLine(x - 1, y - 9, x - 1, y + 3, 2.6);
    mkLine(x, y, x, y + h);
    var n = 3 + ((Math.random() * 2) | 0);
    for (var i = 0; i < n; i++) branch(x, y + h * (i + 0.5) / n, 0, maxX);
    mkText(x + 30 + Math.random() * 60, y + h + 14, '(' + (100 + ((Math.random() * 99) | 0)) + ').', 9);
  }

  /* 條紋裝飾元素：hazard 斜紋帶 / 標尺 / 方塊簇 / 雙細線 */
  function stripes(x, y, w) {
    var kind = (Math.random() * 4) | 0;
    var i;
    if (kind === 0) {                       /* hazard 斜紋帶 */
      var n = 6 + ((Math.random() * 8) | 0);
      for (i = 0; i < n; i++) mkLine(x + i * 9, y + 8, x + i * 9 + 6, y, 1.4);
      mkLine(x - 4, y + 11, x + n * 9 + 2, y + 11);
    } else if (kind === 1) {                /* 標尺刻度 */
      mkLine(x, y, x + w, y);
      for (i = 0; i <= w; i += 14) mkLine(x + i, y, x + i, y + (i % 70 === 0 ? 7 : 4));
      var t = mkText(x + w + 6, y + 6, bin6());
      t._set = '01'; numTexts.push(t);
    } else if (kind === 2) {                /* 實心方塊簇 */
      var n2 = 3 + ((Math.random() * 4) | 0);
      for (i = 0; i < n2; i++) mkRect(x + i * 8, y, 5, 8);
      mkText(x + n2 * 8 + 6, y + 7, hexch(), 9);
    } else {                                /* 雙細線 + 粗短棒 */
      mkRect(x, y - 2, 26, 4);
      mkLine(x + 32, y - 1, x + w, y - 1);
      mkLine(x + 32, y + 1, x + w * 0.7, y + 1);
    }
  }

  var world = null, worldY = 0, cursorY = 0, trees = [];
  var SPEED = 7, STOP_MS = 4 * 60 * 1000;
  var bornAt = performance.now(), lastT = 0;

  function spawnUnit() {
    var W = window.innerWidth, H = window.innerHeight;
    var g = document.createElementNS(NS, 'g');
    world.appendChild(g);
    layer = g;
    var x = 24 + Math.random() * (W * 0.72);
    var h;
    if (Math.random() < 0.3) {              /* 三成係條紋裝飾 */
      h = 30;
      stripes(x, cursorY + 20, 90 + Math.random() * 140);
    } else {
      h = H * (0.18 + Math.random() * 0.30);
      var maxX = Math.min(W - 16, x + W * (0.26 + Math.random() * 0.22));
      tree(x, cursorY + 20, h, maxX);
    }
    layer = null;
    trees.push({ g: g, bottom: cursorY + h + 60 });
    cursorY += Math.max(46, h * (0.62 + Math.random() * 0.5));
  }

  function draw() {
    var W = window.innerWidth, H = window.innerHeight;
    host.innerHTML = '';
    numTexts = []; trees = []; worldY = 0; cursorY = 50; lastT = 0;
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');
    host.appendChild(svg);
    world = document.createElementNS(NS, 'g');
    svg.appendChild(world);
    while (cursorY + worldY < H + 260) spawnUnit();
  }

  function step(now) {
    if (now - bornAt > STOP_MS) return;
    requestAnimationFrame(step);
    if (document.hidden) { lastT = now; return; }
    if (!lastT) lastT = now;
    var dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    worldY -= SPEED * dt;
    world.setAttribute('transform', 'translate(0,' + worldY.toFixed(2) + ')');
    if (cursorY + worldY < window.innerHeight + 260) spawnUnit();
    for (var i = trees.length - 1; i >= 0; i--) {
      if (trees[i].bottom + worldY < -80) { trees[i].g.remove(); trees.splice(i, 1); }
    }
  }

  function init() {
    host = document.getElementById('bgData');
    if (!host) return;
    draw();
    requestAnimationFrame(step);
    var rto = 0;
    window.addEventListener('resize', function () {
      clearTimeout(rto); rto = setTimeout(draw, 250);
    });
    setInterval(function () {
      if (document.hidden || !numTexts.length) return;
      numTexts = numTexts.filter(function (n) { return n.isConnected; });
      for (var k = 0; k < 4 && numTexts.length; k++) {
        var node = numTexts[(Math.random() * numTexts.length) | 0];
        var set = node._set || '0123456789';
        var t = node.textContent.split('');
        var idxs = [];
        for (var j = 0; j < t.length; j++) { if (t[j] >= '0' && t[j] <= '9') idxs.push(j); }
        if (!idxs.length) continue;
        var p = idxs[(Math.random() * idxs.length) | 0];
        t[p] = set[(Math.random() * set.length) | 0];
        node.textContent = t.join('');
      }
    }, 380);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
