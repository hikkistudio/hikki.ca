/* =========================================================
   hikki photography — shared behaviour
   header 注入 / 語錄 rotator / menu overlay / about panel /
   HikkiCrack 解碼引擎（供各頁重用）
   ========================================================= */
(function () {
  'use strict';

  /* ===== 全站禁縮放（pinch / 雙擊 / ctrl+滾輪）=====
     model-viewer / game 用原始 touch 事件做自己嘅縮放，唔受影響。 */
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gestureend', function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', function (e) { if (e.ctrlKey || e.metaKey) e.preventDefault(); }, { passive: false });
  (function () {                                    /* 雙指以上手勢＝縮放意圖，攔截 */
    document.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 1 && !e.target.closest('model-viewer, canvas')) e.preventDefault();
    }, { passive: false });
  })();

  /* ===== 全站 ■ 閃動相位對齊 =====
     所有 .blink-block / .hk-blink 對齊同一個 3s 全域時間格，
     令動態插入嘅方塊（header、jewel 規格）都同步。頁面可再 call window.hkSyncBlink()。 */
  window.hkSyncBlink = function () {
    var delay = -(performance.now() % 3000) + 'ms';
    var els = document.querySelectorAll('.blink-block, .hk-blink');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      e.style.animationDelay = delay;
    }
  };

  /* ===== 語錄（全站唯一一份） ===== */
  var SENTENCES = [
    "of time, souls and cities.", "know thyself.", "静かな光。", "10% off for rescued animals.", "yyj > yvr",
    "get a quote today for free！", "絢爛如電 虛幻如霧", "wake the fuck up, samurai—", "father anderson...",
    "also try max noodle house", "晚星墜落處，自成橋梁。", "elegance is about breaking the rules.", "hesitation is defeat", "賺菲林錢",
    "假作真時真亦假，無為有處有還無。", "死生契闊，與子成說。", "ネットは広大だわ。", "恥の多い生涯を送ってきました。",
    "demain, dès l’aube…", "je pense, donc je suis.", "il faut imaginer sisyphe heureux.", "stay gold, ponyboy.",
    "what’s in a name? that which we call a rose…", "i drink your milkshake!", "the horror! the horror!", "le temps détruit tout。",
    "翩翩不富，皆失實也。", "雲上於天，需；君子以飲食宴樂。", "天下有山，遯。", "元者，善之長也；亨者，嘉之會也。",
    "男性は本質を愛し、女性は習慣を愛する。", "い～や　い～や　い～や", "sksksk", "come on and join our convoy.",
    "i am in flames!", "cbt is a lie, try carl jung.", "be your own reason to smile.", "其為質則金玉不足喻其貴。", "写真は記憶だ。", "影は真實を語る。",
    "빛은 거짓말하지 않아.", "light reveals. shadow defines.", "some people are worth melting for.", "ひとりって切ないくらい自由。",
    "the name of the rose is all that remains.", "οἷ’ ἥβης ἄνθεα...*", "φαίνεταί μοι", "(づ｡◕ ‿‿ ◕｡)づ", "(⁄ ⁄•⁄ω⁄•⁄ ⁄)♡",
    "shanghai fog, yes.", "悲喜千般同幻夢。", "欲望屬於他者。", "Desire is the desire of the Other.",
    "世界無人始，亦無人終。", "The world began and ends without man.", "民為貴，君為輕。", "Lucky Vicky～",
    "Beauty will save the world.", "深宮似海，人人自危。", "一笑傾城，再笑傾國。", "Better die with fragrance.",
    "得寵易，守寵難。", "Family comes first.", "活下去", "Friends don’t lie.", "The crown must endure.",
    "Power is better than sex.", "Love is stronger than reason.", "孤獨是命運。", "Poetry belongs to people.",
    "One word of truth.", "El Psy Congroo", "Just keep swimming.", "We’re all undercover.",
    "War never changes.", "YOU-ARE-NOT-PREPARED.", "Nothing is true？", "I am a real boy.",
    "Marriage is war.", "A Royale with cheese.", "Don’t call me Mr. Pink."
  ];

  var MANIFESTO_HTML =
    '<p>Somewhere along the way, photography learned to lie—magic-moment presets, AI faces, filters that sand away everything true. We are not interested.</p>' +
    '<p>A photograph should feel like the moment it was made: the quiet light that belongs to you and the people you love, not the person you pretend to be.</p>' +
    '<p>Emotions, not imitate perfection.<br>Job invitations are welcomed. <span class="hk-blink">■</span></p>';

  var isCJK = function (s) { return /[一-鿿぀-ヿ가-힯]/.test(s); };

  /* ===== HikkiCrack：文字解碼引擎（全站共用） ===== */
  var Crack = (function () {
    var LAT = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var CJK = "乾坤屯蒙需訟師比小畜兮履泰否同人大有謙豫隨蠱臨觀兮噬嗑賁剝復無妄大畜頤大過坎離咸恆遯兮及大壯晉與明夷家人睽蹇解損益夬姤萃升困井革鼎震繼艮漸歸妹豐旅巽兌渙節兮中孚小過既濟兼未濟";
    var FPS = 49, LOCK_MIN = 90, LOCK_MAX = 120, STEP = [2, 3];

    function makeState(textNode) {
      var target = textNode.nodeValue;
      var set = isCJK(target) ? CJK : LAT;
      var cur = target.split('');
      var locked = cur.map(function (ch) { return /\s/.test(ch); });
      for (var i = 0; i < cur.length; i++) {
        if (!locked[i]) cur[i] = set[(Math.random() * set.length) | 0];
      }
      return { node: textNode, target: target.split(''), cur: cur, locked: locked, set: set };
    }

    function collect(root) {
      var out = [];
      if (!root) return out;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          while (p) {
            if (p.classList && (p.classList.contains('hk-blink') || p.classList.contains('blink-block'))) return NodeFilter.FILTER_REJECT;
            p = p.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      while (w.nextNode()) out.push(w.currentNode);
      return out;
    }

    function startOn(nodes, opts) {
      if (!nodes.length) return function () {};
      opts = opts || {};
      var states = nodes.map(makeState);
      states.forEach(function (s) { s.node.nodeValue = s.cur.join(''); });
      var raf = 0, last = 0, interval = 1000 / FPS;
      // budgetMs：要求全部文字喺呢個時間內鎖定完成（快速模式）
      var avgTick = (LOCK_MIN + LOCK_MAX) / 2;
      var fastRatio = opts.budgetMs ? Math.max(0.05, avgTick / opts.budgetMs) : 0;

      function scramble(now) {
        if (now - last >= interval && !document.hidden) {
          for (var k = 0; k < states.length; k++) {
            var s = states[k], t = s.target, c = s.cur, L = s.locked, set = s.set;
            for (var i = 0; i < c.length; i++) {
              if (!L[i] && !/\s/.test(t[i])) c[i] = set[(Math.random() * set.length) | 0];
            }
            s.node.nodeValue = c.join('');
          }
          last = now;
        }
        raf = requestAnimationFrame(scramble);
      }

      var timer = 0;
      function lockSome() {
        if (document.hidden) { timer = setTimeout(lockSome, 200); return; }
        var allDone = true;
        for (var k = 0; k < states.length; k++) {
          var s = states[k];
          var cand = [];
          for (var i = 0; i < s.locked.length; i++) if (!s.locked[i]) cand.push(i);
          if (cand.length) {
            allDone = false;
            var base = fastRatio
              ? Math.ceil(s.locked.length * fastRatio)
              : ((Math.random() * (STEP[1] - STEP[0] + 1)) | 0) + STEP[0];
            var take = Math.min(Math.max(1, base), cand.length);
            for (var j = 0; j < take; j++) {
              var idx = cand.splice((Math.random() * cand.length) | 0, 1)[0];
              s.cur[idx] = s.target[idx]; s.locked[idx] = true;
            }
            s.node.nodeValue = s.cur.join('');
          }
        }
        if (!allDone) timer = setTimeout(lockSome, ((Math.random() * (LOCK_MAX - LOCK_MIN + 1)) | 0) + LOCK_MIN);
        else cancelAnimationFrame(raf);
      }

      requestAnimationFrame(scramble);
      timer = setTimeout(lockSome, ((Math.random() * (LOCK_MAX - LOCK_MIN + 1)) | 0) + LOCK_MIN);
      return function () { cancelAnimationFrame(raf); clearTimeout(timer); };
    }

    return { collect: collect, startOn: startOn };
  })();

  window.HikkiCrack = Crack;

  /* ===== Header / Menu / About 注入 ===== */
  function buildUI() {
    var frag = document.createElement('div');
    frag.innerHTML =
      '<header class="hk-bar" role="banner">' +
        '<a class="hk-logo" href="index.html" aria-label="hikki photography — home"><span class="hk-sq" aria-hidden="true"></span></a>' +
        '<div class="hk-rotator" id="hkRotator" aria-live="polite"><span>of time, souls and cities.</span></div>' +
        '<button class="hk-menu-btn" id="hkMenuBtn" aria-expanded="false" aria-controls="hkMenu">menu</button>' +
      '</header>' +
      '<nav class="hk-menu" id="hkMenu" aria-label="site menu" aria-hidden="true">' +
        '<ul class="hk-menu-list">' +
          '<li><button type="button" id="hkAboutBtn">about</button></li>' +
          '<li><a href="gallery.html">gallery</a></li>' +
          '<li><a href="jewel.html">jeweldesign</a></li>' +
          '<li><a href="iching.html">iching</a></li>' +
          '<li><a href="game.html">macau17 (beta)</a></li>' +
        '</ul>' +
        '<div class="hk-menu-contact">' +
          '<h2 class="hk-contact-head">contact</h2>' +
          '<ul>' +
            '<li><a href="tel:+12509869516">250-986-9516</a></li>' +
            '<li><a href="mailto:alex@hikki.ca">alex@hikki.ca</a></li>' +
            '<li><a href="https://www.instagram.com/hikki_with_her_camera" target="_blank" rel="noopener noreferrer me">@hikki_with_her_camera</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hk-menu-copy">© 2026 hikki photography &amp; philosophy. <span class="hk-blink">■</span></div>' +
      '</nav>' +
      '<div class="hk-about" id="hkAbout" role="dialog" aria-modal="true" aria-label="about hikki photography" aria-hidden="true">' +
        '<button type="button" class="hk-about-close" id="hkAboutClose" aria-label="close">&times;</button>' +
        '<div class="hk-about-body" id="hkAboutBody">' + MANIFESTO_HTML + '</div>' +
        '<div class="hk-about-foot" id="hkAboutFoot">Nightcity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;36.245993&nbsp;|&nbsp;-115.980127</div>' +
      '</div>';
    while (frag.firstChild) document.body.insertBefore(frag.firstChild, document.body.firstChild);
  }

  /* ===== Rotator（純 CSS transition，無 GSAP） ===== */
  function startRotator() {
    var box = document.getElementById('hkRotator');
    if (!box) return;
    var span = box.querySelector('span');
    var last = -1;

    function step() {
      if (document.hidden) return;
      var i;
      do { i = (Math.random() * SENTENCES.length) | 0; } while (i === last);
      last = i;
      var txt = SENTENCES[i];
      span.style.opacity = '0';
      span.style.transform = 'translateY(-12px)';
      setTimeout(function () {
        span.classList.toggle('ja', isCJK(txt));
        span.setAttribute('lang', isCJK(txt) ? 'ja' : 'en');
        span.textContent = txt;
        span.style.transition = 'none';
        span.style.transform = 'translateY(12px)';
        // 強制 reflow，令下一步 transition 生效
        void span.offsetHeight;
        span.style.transition = '';
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 230);
    }
    setInterval(step, 4000);
  }

  /* ===== Menu / About 開關 ===== */
  function wireMenu() {
    var btn = document.getElementById('hkMenuBtn');
    var menu = document.getElementById('hkMenu');
    var about = document.getElementById('hkAbout');
    var aboutBtn = document.getElementById('hkAboutBtn');
    var aboutClose = document.getElementById('hkAboutClose');
    var aboutBody = document.getElementById('hkAboutBody');
    var stopAboutCrack = null;

    function setMenu(open) {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '×' : 'menu';
      btn.classList.toggle('is-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) Crack.startOn(Crack.collect(menu.querySelector('.hk-menu-list')), { budgetMs: 400 });
    }
    /* 面板底邊對齊 menu 入面 contact 上方嘅虛線 */
    function sizeAbout() {
      var contact = menu.querySelector('.hk-menu-contact');
      var bar = document.querySelector('.hk-bar');
      if (!contact || !bar) return;
      var barBottom = bar.getBoundingClientRect().bottom;
      var lineTop = contact.getBoundingClientRect().top; // 虛線就喺 contact 區塊上方
      var h = lineTop - barBottom;
      if (h > 160) about.style.height = h + 'px';
      else about.style.removeProperty('height'); // 量唔到就用 CSS fallback
    }

    function setAbout(open) {
      if (open) sizeAbout();
      about.classList.toggle('open', open);
      about.setAttribute('aria-hidden', String(!open));
      if (open) {
        if (stopAboutCrack) stopAboutCrack();
        stopAboutCrack = Crack.startOn(Crack.collect(aboutBody), { budgetMs: 450 });
        aboutClose.focus();
      }
    }
    window.addEventListener('resize', function () {
      if (about.classList.contains('open')) sizeAbout();
    });

    /* about 底部 nightcity 座標漂移（虛構座標） */
    (function () {
      var foot = document.getElementById('hkAboutFoot');
      if (!foot) return;
      var textNode = foot.firstChild; // "Nightcity ... -115.980127 " 嘅純文字節點
      if (!textNode || textNode.nodeType !== 3) return;
      var BOUNDS = { lat: [36.001, 36.489], lon: [115.501, 116.489] }; // 顯示為 -1xx，負號唔郁
      var RE = /(\d+\.\d+)(\D+)(\d+\.\d+)/;
      function tick() {
        if (!document.hidden && about.classList.contains('open')) {
          var flat = textNode.nodeValue;
          var m = flat.match(RE);
          if (m) {
            var latNew = (BOUNDS.lat[0] + Math.random() * (BOUNDS.lat[1] - BOUNDS.lat[0])).toFixed(6);
            var lonNew = (BOUNDS.lon[0] + Math.random() * (BOUNDS.lon[1] - BOUNDS.lon[0])).toFixed(6);
            var chars = flat.split('');
            var swapDigits = function (start, target) {
              var idxs = [];
              for (var i = 0; i < target.length; i++) { if (target[i] >= '0' && target[i] <= '9') idxs.push(i); }
              var take = 1 + ((Math.random() * 3) | 0);
              for (var k = 0; k < take && idxs.length; k++) {
                var p = idxs.splice((Math.random() * idxs.length) | 0, 1)[0];
                if (start + p < chars.length) chars[start + p] = target[p];
              }
            };
            swapDigits(m.index, latNew);
            swapDigits(m.index + m[1].length + m[2].length, lonNew);
            textNode.nodeValue = chars.join('');
          }
        }
        setTimeout(tick, 40 + Math.random() * 80);
      }
      tick();
    })();

    btn.addEventListener('click', function () {
      if (about.classList.contains('open')) setAbout(false);
      setMenu(!menu.classList.contains('open'));
    });
    aboutBtn.addEventListener('click', function () { setAbout(true); });
    aboutClose.addEventListener('click', function () { setAbout(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (about.classList.contains('open')) setAbout(false);
      else if (menu.classList.contains('open')) setMenu(false);
    });
    // 點 menu 內連結後，行去新頁前唔使處理；同頁 anchor 情況收返個 menu
    menu.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a) setMenu(false);
    });
  }

  function init() {
    buildUI();
    startRotator();
    wireMenu();
    window.hkSyncBlink();          /* 對齊 header 及靜態 ■ */
    setTimeout(window.hkSyncBlink, 900);  /* 再對齊延遲插入嘅 ■（如 jewel 規格） */
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
