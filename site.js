/* =========================================================
   hikki photography — shared behaviour
   header 注入 / 語錄 rotator / menu overlay /
   HikkiCrack 解碼引擎（供各頁重用）
   ========================================================= */
(function () {
  'use strict';

  /* ===== 縮放 =====
     以前全站攔截 pinch / 雙擊 / ctrl+滾輪，令用家放大唔到相，
     係 WCAG 1.4.4 (AA) 失效。而家一律唔攔：
     儀器嘅互動面（地圖 canvas、旋鈕、model-viewer）各自用
     CSS touch-action:none 收自己嗰份手勢，唔使全域封鎖。 */

  /* ===== 全站 ■ 閃動相位對齊 =====
     所有 .blink-block / .hk-blink 對齊同一個 3s 全域時間格，
     令動態插入嘅方塊（header、jewel 規格）都同步。頁面可再 call window.hkSyncBlink()。 */
  window.hkSyncBlink = function () {
    var delay = -(performance.now() % 3000) + 'ms';
    /* header 個 ■ 有自己嘅 animation 但冇 .hk-blink class，要一齊校相位 */
    var els = document.querySelectorAll('.blink-block, .hk-blink, .hk-logo .hk-sq, .g-sq');
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
          '<li class="hk-grp open" id="hkGrpPhoto">' +
            '<button type="button" class="hk-grp-btn" id="hkPhotoBtn"' +
              ' aria-expanded="true" aria-controls="hkPhotoSub">' +
              'Photography<i class="hk-grp-caret" aria-hidden="true"></i>' +
            '</button>' +
            '<ul class="hk-sub" id="hkPhotoSub">' +
              '<li><a href="about.html">about</a></li>' +
              '<li><a href="gallery.html">gallery</a></li>' +
            '</ul>' +
          '</li>' +
          '<li class="hk-grp open" id="hkGrpJewel">' +
            '<button type="button" class="hk-grp-btn" id="hkJewelBtn"' +
              ' aria-expanded="true" aria-controls="hkJewelSub">' +
              'Jewel Design<i class="hk-grp-caret" aria-hidden="true"></i>' +
            '</button>' +
            '<ul class="hk-sub" id="hkJewelSub">' +
              '<li><a href="jewel.html">about</a></li>' +
              '<li><a href="jewel-gallery.html">gallery</a></li>' +
            '</ul>' +
          '</li>' +
          '<li class="hk-side-h" aria-hidden="true">side projects</li>' +
          '<li class="hk-side"><a href="iching.html">iching</a></li>' +
          '<li class="hk-side"><a href="game.html">macau17</a></li>' +
          '<li class="hk-side"><a href="console.html">rainfall</a></li>' +
        '</ul>' +
        '<div class="hk-menu-contact">' +
          '<h2 class="hk-contact-head">contact</h2>' +
          '<ul>' +
            '<li><a href="tel:+12509869516">250-986-9516</a></li>' +
            '<li><a href="mailto:hikki.pnp@gmail.com">hikki.pnp@gmail.com</a></li>' +
            '<li><a href="https://www.instagram.com/hikki_with_her_camera" target="_blank" rel="noopener noreferrer me">@hikki_with_her_camera</a></li>' +
            '<li><a href="#" class="hk-enq" data-enq-source="general">&gt;direct message</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hk-menu-geo" id="hkMenuGeo" aria-hidden="true">' +
          '<div class="hk-geo-loc" id="hkGeoLoc">locating<span class="g-sq"> ·</span></div>' +
          '<div class="hk-geo-wx" id="hkGeoWx">--.-°C&nbsp;&nbsp;·&nbsp;&nbsp;--%&nbsp;&nbsp;·&nbsp;&nbsp;--:--</div>' +
        '</div>' +
        '<div class="hk-menu-copy">© 2026 hikki photography &amp; philosophy.</div>' +
      '</nav>' +

      /* ===== Enquiry：由右邊彈出、佔全屏嘅終端表單 ===== */
      '<div class="hk-enq-panel" id="hkEnq" role="dialog" aria-modal="true" aria-label="enquiry" aria-hidden="true">' +
        '<button type="button" class="hk-enq-close" id="hkEnqClose" aria-label="close">&times;</button>' +
        '<form class="hk-enq-form" id="hkEnqForm" novalidate>' +
          '<div class="hk-enq-head" id="hkEnqHead">' +
            '<span class="hk-enq-state">connecting</span><i class="hk-enq-dots" aria-hidden="true"><b>.</b><b>.</b><b>.</b></i>' +
          '</div>' +
          '<p class="hk-enq-sub">Tell me what you have in mind. I read every one of these myself.</p>' +
          '<label class="hk-enq-row"><span>&gt;name</span><input name="name" autocomplete="name"></label>' +
          '<label class="hk-enq-row"><span>&gt;email</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>' +
          '<label class="hk-enq-row"><span>&gt;city</span><input name="city" autocomplete="address-level2"></label>' +
          '<div class="hk-enq-row"><span>&gt;type</span><div class="hk-enq-opts" id="hkEnqTypes">' +
            '<button type="button" data-type="photography">photography</button>' +
            '<button type="button" data-type="jeweldesign">jeweldesign</button>' +
            '<button type="button" data-type="philosophy">philosophy</button>' +
          '</div></div>' +
          '<label class="hk-enq-row hk-enq-msg"><span>&gt;message</span><textarea name="message" rows="3"></textarea></label>' +
          '<input type="hidden" name="source" id="hkEnqSource">' +
          /* 蜜罐：螢幕閱讀器同真人都接觸唔到，機械人會照填 */
          '<div class="hk-hp" aria-hidden="true">' +
            '<label>Leave this empty<input type="text" name="botcheck" tabindex="-1" autocomplete="off"></label>' +
          '</div>' +
          '<div class="hk-enq-foot">' +
            '<button type="submit" class="hk-enq-send">&gt;send <span class="hk-blink">■</span></button>' +
            '<div class="hk-enq-note" id="hkEnqNote" role="status" aria-live="polite"></div>' +
          '</div>' +
        '</form>' +
      '</div>';
    while (frag.firstChild) document.body.insertBefore(frag.firstChild, document.body.firstChild);

    /* 當前頁指示：menu 對應項旁一粒細 ■ */
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = document.querySelectorAll('.hk-menu-list a');
    for (var i = 0; i < links.length; i++) {
      if ((links[i].getAttribute('href') || '').toLowerCase() === here) links[i].classList.add('now');
    }
  }

  /* ===== Rotator（純 CSS transition，無 GSAP） ===== */
  function startRotator() {
    var box = document.getElementById('hkRotator');
    if (!box) return;
    var span = box.querySelector('span');
    var last = -1;

    /* 動畫用 inline 顯式 transition：唔依賴 stylesheet cascade，
       亦唔受 prefers-reduced-motion 豁免規則影響（rotator 係內容） */
    var TR = 'opacity .22s ease, transform .22s ease';
    function step() {
      if (document.hidden) return;
      var i;
      do { i = (Math.random() * SENTENCES.length) | 0; } while (i === last);
      last = i;
      var txt = SENTENCES[i];
      span.style.transition = TR;
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
        span.style.transition = TR;
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 240);
    }
    setInterval(step, 4000);
  }

  /* ===== Menu 定位訊號：IP 城市 + 座標（微跳動）+ 天氣 + 當地時間 =====
     位置由瀏覽器時區推算（零外部請求）；天氣只喺 menu 首次打開時
     向 open-meteo 攞一次（只送座標，唔送任何個人資料），
     兩者免 key / HTTPS / CORS），sessionStorage 快取；座標跳動同時鐘只喺
     menu 打開時行——唔追蹤、唔輪詢，資源極輕。取唔到位置就用南極 Dome Fuji。 */
  function initGeo() {
    var locEl = document.getElementById('hkGeoLoc');
    var wxEl = document.getElementById('hkGeoWx');
    var menu = document.getElementById('hkMenu');
    if (!locEl || !wxEl || locEl.dataset.init) return;
    locEl.dataset.init = '1';

    var DOME = { city: 'Dome Fuji', cc: 'AQ', lat: -77.3167, lon: 39.7000, tz: 'Antarctica/Syowa' };
    var menuOpen = function () { return menu && menu.classList.contains('open'); };

    function apply(loc) {
      var baseLat = loc.lat, baseLon = loc.lon, tz = loc.tz;
      var head = (loc.city || '—') + (loc.cc ? ', ' + loc.cc : '');

      function coordStr() {                       /* 城市範圍 ±0.03 微跳動，唔精確 */
        var la = baseLat + (Math.random() - 0.5) * 0.06;
        var lo = baseLon + (Math.random() - 0.5) * 0.06;
        return la.toFixed(3) + ' | ' + lo.toFixed(3);
      }
      locEl.innerHTML = head + '&nbsp;&nbsp;/&nbsp;&nbsp;<span id="hkGeoCoord">' + coordStr() + '</span>';
      var coordEl = document.getElementById('hkGeoCoord');
      (function jit() {
        if (menuOpen() && !document.hidden && coordEl) coordEl.textContent = coordStr();
        setTimeout(jit, 900 + Math.random() * 700);
      })();

      var timeStr = '--:--', wx = { t: null, h: null };
      function clock() {
        try { timeStr = new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }); }
        catch (e) { timeStr = '--:--'; }
      }
      function paintWx() {
        var t = (wx.t == null) ? '--.-' : wx.t.toFixed(1);
        var h = (wx.h == null) ? '--' : Math.round(wx.h);
        wxEl.innerHTML = t + '°C&nbsp;&nbsp;·&nbsp;&nbsp;' + h + '%&nbsp;&nbsp;·&nbsp;&nbsp;' + timeStr;
      }
      clock(); paintWx();
      (function tick() {
        if (menuOpen() && !document.hidden) { clock(); paintWx(); }
        setTimeout(tick, 15000);
      })();

      var wxKey = 'hk_wx_' + baseLat.toFixed(2) + '_' + baseLon.toFixed(2), cw = null;
      try { cw = JSON.parse(sessionStorage.getItem(wxKey) || 'null'); } catch (e) {}
      if (cw && Date.now() - cw.at < 1800000) { wx.t = cw.t; wx.h = cw.h; paintWx(); }
      else {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=' + baseLat.toFixed(4) + '&longitude=' + baseLon.toFixed(4) + '&current=temperature_2m,relative_humidity_2m')
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && d.current) {
              wx.t = d.current.temperature_2m; wx.h = d.current.relative_humidity_2m; paintWx();
              try { sessionStorage.setItem(wxKey, JSON.stringify({ t: wx.t, h: wx.h, at: Date.now() })); } catch (e) {}
            }
          })
          .catch(function () {});
      }
    }

    /* IANA 時區 → 大概位置。估唔到就 fallback 去大三巴。 */
    var TZ_MAP = {
      'America/Vancouver':   { city: 'Vancouver',  cc: 'CA', lat: 49.2827, lon: -123.1207 },
      'America/Edmonton':    { city: 'Edmonton',   cc: 'CA', lat: 53.5461, lon: -113.4938 },
      'America/Winnipeg':    { city: 'Winnipeg',   cc: 'CA', lat: 49.8951, lon:  -97.1384 },
      'America/Toronto':     { city: 'Toronto',    cc: 'CA', lat: 43.6532, lon:  -79.3832 },
      'America/Halifax':     { city: 'Halifax',    cc: 'CA', lat: 44.6488, lon:  -63.5752 },
      'America/Los_Angeles': { city: 'Los Angeles',cc: 'US', lat: 34.0522, lon: -118.2437 },
      'America/New_York':    { city: 'New York',   cc: 'US', lat: 40.7128, lon:  -74.0060 },
      'America/Chicago':     { city: 'Chicago',    cc: 'US', lat: 41.8781, lon:  -87.6298 },
      'Asia/Macau':          { city: 'Macau',      cc: 'MO', lat: 22.1930, lon:  113.5490 },
      'Asia/Hong_Kong':      { city: 'Hong Kong',  cc: 'HK', lat: 22.3193, lon:  114.1694 },
      'Asia/Taipei':         { city: 'Taipei',     cc: 'TW', lat: 25.0330, lon:  121.5654 },
      'Asia/Shanghai':       { city: 'Shanghai',   cc: 'CN', lat: 31.2304, lon:  121.4737 },
      'Asia/Tokyo':          { city: 'Tokyo',      cc: 'JP', lat: 35.6762, lon:  139.6503 },
      'Asia/Seoul':          { city: 'Seoul',      cc: 'KR', lat: 37.5665, lon:  126.9780 },
      'Asia/Singapore':      { city: 'Singapore',  cc: 'SG', lat:  1.3521, lon:  103.8198 },
      'Europe/London':       { city: 'London',     cc: 'GB', lat: 51.5074, lon:   -0.1278 },
      'Europe/Paris':        { city: 'Paris',      cc: 'FR', lat: 48.8566, lon:    2.3522 },
      'Europe/Berlin':       { city: 'Berlin',     cc: 'DE', lat: 52.5200, lon:   13.4050 },
      'Australia/Sydney':    { city: 'Sydney',     cc: 'AU', lat: -33.8688, lon: 151.2093 }
    };
    function guessFromTimezone() {
      var tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      var hit = TZ_MAP[tz];
      if (hit) return { city: hit.city, cc: hit.cc, lat: hit.lat, lon: hit.lon, tz: tz };
      return DOME;
    }

    var lc = null;
    try { lc = JSON.parse(sessionStorage.getItem('hk_loc') || 'null'); } catch (e) {}
    if (lc && lc.lat != null) { apply(lc); return; }

    /* 以前 fetch ipapi.co：為咗 menu 一行天氣，就將訪客 IP 交畀第三方。
       而家改用瀏覽器本身報嘅時區推算城市 —— 零外部請求、零個人資料出境。 */
    apply(guessFromTimezone());
  }

  /* ===== Menu / About 開關 ===== */
  function wireMenu() {
    var btn = document.getElementById('hkMenuBtn');
    var menu = document.getElementById('hkMenu');

    function setMenu(open) {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '×' : 'menu';
      btn.classList.toggle('is-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) {
        Crack.startOn(Crack.collect(menu.querySelector('.hk-menu-list')), { budgetMs: 400 });
        initGeo();   /* 首次打開先 fetch 定位/天氣 */
      }
    }
    /* 面板底邊精確對齊 menu 最後一項（macau17）嗰條虛線——齊整 */

    btn.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });

    /* ── 兩個組（photography / jewel design）：撳開先見到 about / gallery ── */
    (function () {
      var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      [{ b: 'hkPhotoBtn', g: 'hkGrpPhoto', on: ['about.html', 'gallery.html'] },
       { b: 'hkJewelBtn', g: 'hkGrpJewel', on: ['jewel.html', 'jewel-gallery.html'] }
      ].forEach(function (cfg) {
        var gBtn = document.getElementById(cfg.b);
        var grp = document.getElementById(cfg.g);
        if (!gBtn || !grp) return;
        function setGrp(open) {
          grp.classList.toggle('open', open);
          gBtn.setAttribute('aria-expanded', String(open));
        }
        gBtn.addEventListener('click', function () {
          setGrp(!grp.classList.contains('open'));
        });
        /* 兩個組預設喺 markup 就開咗（photography / jewel design 係主線），
           呢度淨係保證當前頁所屬嗰組一定開住——就算日後改咗預設都唔會收埋。 */
        if (cfg.on.indexOf(here) >= 0) setGrp(true);
      });
    })();
    // 點 menu 內連結後，行去新頁前唔使處理；同頁 anchor 情況收返個 menu
    menu.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a) setMenu(false);
    });
  }

  /* ===== Enquiry 表單：右邊全屏彈出 → 組成 mailto（免後端） =====
     全站任何 .hk-enq 觸發（data-enq-source 決定預選 type）；觸發文字轉金、每 4 秒重播解碼。 */
  /* ── 表單直送設定 ──────────────────────────────────────────────
     填咗 ENQ_ENDPOINT 之後，訊息會直接送到你信箱，唔會再開用戶個 mail app。
     未填就自動 fallback 去 mailto（即係而家嘅行為）。

     兩個免費、免後端、key 可以公開嘅選擇（二選一，兩分鐘搞掂）：
       ① Web3Forms   https://web3forms.com  → 輸入 hikki.pnp@gmail.com 攞 access key
          ENQ_ENDPOINT = 'https://api.web3forms.com/submit'
          ENQ_KEY      = '你嘅 access key'
       ② Formspree    https://formspree.io   → 開 form 攞 form id
          ENQ_ENDPOINT = 'https://formspree.io/f/你嘅formid'
          ENQ_KEY      = ''   （Formspree 唔使 key）
     ───────────────────────────────────────────────────────────── */
  var ENQ_ENDPOINT = 'https://api.web3forms.com/submit';
  var ENQ_KEY = 'e1f68a96-0daa-45f3-bf85-0e79abb1f659';

  function wireEnq() {
    var panel = document.getElementById('hkEnq');
    if (!panel) return;
    var closeBtn = document.getElementById('hkEnqClose');
    var form = document.getElementById('hkEnqForm');
    var typesWrap = document.getElementById('hkEnqTypes');
    var sourceInput = document.getElementById('hkEnqSource');
    var note = document.getElementById('hkEnqNote');
    var chosenType = '';

    typesWrap.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-type]'); if (!b) return;
      for (var i = 0; i < typesWrap.children.length; i++) typesWrap.children[i].classList.remove('on');
      b.classList.add('on'); chosenType = b.dataset.type;
    });

    /* 標題：connecting（搜尋緊）→ 送出成功先至 connected */
    var headEl = document.getElementById('hkEnqHead');
    function setState(st) {
      if (!headEl) return;
      var lab = headEl.querySelector('.hk-enq-state');
      if (lab) lab.textContent = st;
      headEl.classList.toggle('is-connected', st === 'connected');
      headEl.classList.toggle('is-sending', st === 'transmitting');
    }

    function open(source) {
      sourceInput.value = source || '';
      var preset = { session: 'photography', jewel: 'jeweldesign' }[source] || '';
      chosenType = '';
      for (var i = 0; i < typesWrap.children.length; i++) {
        var on = preset && typesWrap.children[i].dataset.type === preset;
        typesWrap.children[i].classList.toggle('on', !!on);
        if (on) chosenType = preset;
      }
      setState('connecting');            /* 每次開都由 connecting 開始 */
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function () { var f = form.querySelector('input[name=name]'); if (f) f.focus(); }, 420);
    }
    function close() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      note.textContent = '';
    }
    window.hkOpenEnq = open;
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

    function focusRow(n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) { el.focus(); el.setAttribute('aria-invalid', 'true'); }
    }
    form.addEventListener('input', function (e) {
      if (e.target.name) e.target.removeAttribute('aria-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').trim();
      var email = (d.get('email') || '').trim();
      if (!name) { note.textContent = '> name required.'; focusRow('name'); return; }
      /* 以前冇驗 email，結果會收到覆唔返嘅查詢，而對方以為聯絡咗你。 */
      if (!email) { note.textContent = '> email required — 冇佢我覆唔到你。'; focusRow('email'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        note.textContent = '> email 格式好似唔啱，再檢查一次？'; focusRow('email'); return;
      }
      /* 蜜罐：真人見唔到呢格，填咗嘅一定係機械人。靜靜當成功，唔好畀佢知。 */
      if ((d.get('botcheck') || '') !== '') { note.textContent = '> received.'; form.reset(); return; }
      var type = chosenType || 'enquiry';
      var subject = '[hikki] ' + type + ' — ' + name;
      var body =
        '> name: ' + name + '\n' +
        '> email: ' + (d.get('email') || '') + '\n' +
        '> city: ' + (d.get('city') || '') + '\n' +
        '> type: ' + type + '\n' +
        '> from: ' + (d.get('source') || 'site') + '\n\n' +
        (d.get('message') || '');

      /* 未設定 endpoint → 沿用 mailto */
      if (!ENQ_ENDPOINT) {
        note.textContent = '> opening mail…';
        window.location.href = 'mailto:hikki.pnp@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        return;
      }

      /* 直送：唔會開用戶個 mail app */
      var btn = form.querySelector('.hk-enq-send');
      btn.disabled = true;
      setState('transmitting');
      note.textContent = '> transmitting…';
      var payload = {
        name: name,
        email: d.get('email') || '',
        city: d.get('city') || '',
        type: type,
        source: d.get('source') || 'site',
        message: d.get('message') || '',
        subject: subject,
        _replyto: d.get('email') || ''
      };
      if (ENQ_KEY) { payload.access_key = ENQ_KEY; payload.botcheck = ''; }   /* Web3Forms */
      fetch(ENQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (r) { return r.ok ? r.json().catch(function(){ return {}; }) : Promise.reject(r.status); })
      .then(function () {
        setState('connected');             /* 真係送到，先至變 connected */
        note.textContent = '> received. 多謝，我會回覆你。';
        form.reset();
        for (var i = 0; i < typesWrap.children.length; i++) typesWrap.children[i].classList.remove('on');
        chosenType = '';
        setTimeout(close, 2200);
      })
      .catch(function () {
        /* 送唔到：唔好蝕咗人哋打嘅字，退返去 mailto */
        setState('connecting');            /* 冇接通，唔可以扮 connected */
        note.textContent = '> line down — opening mail instead…';
        window.location.href = 'mailto:hikki.pnp@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      })
      .then(function () { btn.disabled = false; });
    });

    /* 全站觸發器：委派 click（連日後動態加入嘅，例如 jewel specs 都覆蓋到） */
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('.hk-enq');
      if (el) { e.preventDefault(); open(el.getAttribute('data-enq-source') || 'general'); }
    });
    /* 觸發文字每 4 秒重播解碼（只做開場已存在、可見嘅） */
    if (window.HikkiCrack) {
      var triggers = document.querySelectorAll('.hk-enq');
      for (var t = 0; t < triggers.length; t++) {
        (function (el) {
          var run = function () { if (el.offsetParent !== null && !document.hidden) window.HikkiCrack.startOn(window.HikkiCrack.collect(el), { budgetMs: 500 }); };
          run(); setInterval(run, 4000);
        })(triggers[t]);
      }
    }
  }

  /* ===== 電傳機 =====
     每 40 秒喺頁底打一行氣象電文。組合空間夠大，見過嘅唔會再見。
     冇任何功能，唔可以撳，唔會影響任何嘢。 */
  var TTY_CALL = ['ROSE','LARK','AMBER','SABLE','WILLOW','KESTREL','INDIGO','MAGPIE',
                  'CEDAR','HALCYON','PLOVER','ONYX','THISTLE','ORIOLE','SLATE','JUNIPER',
                  'HERON','QUARTZ','LINNET','MULBERRY'];
  var TTY_OBS = [
    'NO WIND AT ALL','WIND BACKING SOUTH','SEA STATE UNCHANGED','CEILING UNMEASURED',
    'RAIN ENDED 0200','FOG ON THE WATER','PRESSURE STILL FALLING','FIRST FROST',
    'SKY CLEAR TO THE POLE','NOTHING ON THE HORIZON','LIGHTNING NO THUNDER',
    'HIGH CLOUD MOVING FAST','TIDE HIGHER THAN CHARTED','SNOW NOT SETTLING',
    'VISIBILITY UNLIMITED','THE RIVER IS WARM','BIRDS LEFT AT DAWN',
    'MOON THROUGH THIN CLOUD','SWELL FROM THE WEST','NO CHANGE SINCE MIDNIGHT',
    'AIR SMELLS OF RAIN','SHADOWS LONGER THAN USUAL','NO STARS TONIGHT',
    'HEAT LEAVING THE STONE'
  ];
  var TTY_ORD = [
    'TELL HER ANYWAY','HOLD THIS FREQUENCY','DO NOT ACKNOWLEDGE','SLEEP IF YOU CAN',
    'CONTINUE AS BEFORE','SEND NOTHING BACK','WAIT FOR THE HOUR','GO HOME',
    'KEEP THE LIGHT ON','NO ACTION REQUIRED','RECORD AND FORGET','LOOK UP',
    'REPEAT AT WILL','STAND BY','SAY IT PLAINLY','LEAVE THE DOOR OPEN',
    'COUNT TO NINE','NOTHING FOLLOWS','BURN AFTER READING','STAY WHERE YOU ARE'
  ];
  var ttySeen = {};
  function ttyLine() {
    for (var i = 0; i < 24; i++) {
      var s = TTY_CALL[(Math.random() * TTY_CALL.length) | 0]
            + ' ' + (((Math.random() * 99) | 0) + 1 + '').replace(/^(\d)$/, '0$1')
            + ' // ' + TTY_OBS[(Math.random() * TTY_OBS.length) | 0]
            + ' // ' + TTY_ORD[(Math.random() * TTY_ORD.length) | 0];
      if (!ttySeen[s]) { ttySeen[s] = 1; return s; }
    }
    return null;                                   /* 見晒就唔再出 */
  }
  function wireTty() {
    if (window.hkNoTty) return;
    var el = document.createElement('div');
    el.className = 'hk-tty'; el.setAttribute('aria-hidden', 'true');
    el.dataset.idle = '1';
    document.body.appendChild(el);

    var reduce = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function emit() {
      var txt = ttyLine();
      if (txt === null) { el.dataset.idle = '1'; return; }
      if (document.hidden) { setTimeout(emit, 8000); return; }
      el.dataset.idle = '0';
      if (reduce) {                                /* 唔郁：一次過出 */
        el.textContent = txt;
        setTimeout(function () { el.dataset.idle = '1'; setTimeout(emit, 32000); }, 9000);
        return;
      }
      var i = 0;
      (function type() {
        el.innerHTML = txt.slice(0, i).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                     + '<i>_</i>';
        if (i++ < txt.length) { setTimeout(type, 26 + Math.random() * 44); return; }
        el.textContent = txt;
        setTimeout(function () {                   /* 停一陣，然後熄，再等下一封 */
          el.dataset.idle = '1';
          setTimeout(emit, 31000);
        }, 9000);
      })();
    }
    setTimeout(emit, 6000 + Math.random() * 5000);
  }

  /* ===== 列印＝解密文件 =====
     ⌘P 之前臨時砌一張文件頭／尾。頁面可以提供 window.hkPrintBody()
     回傳一段 HTML（該頁真正想印嘅內容）。 */
  var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  function dtg() {                                   /* DDHHMMZ MON YY */
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p(d.getUTCDate()) + p(d.getUTCHours()) + p(d.getUTCMinutes()) + 'Z '
         + MON[d.getUTCMonth()] + ' ' + String(d.getUTCFullYear()).slice(2);
  }
  function stationName() {
    var f = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '');
    return 'HIKKI / ' + (f || 'INDEX').toUpperCase();
  }
  function bars() {                                  /* 塗黑條：每次印都唔同長度 */
    var n = 3 + ((Math.random() * 3) | 0), h = '';
    for (var i = 0; i < n; i++) h += '<i style="width:' + (34 + ((Math.random() * 120) | 0)) + 'px"></i>';
    return h;
  }
  function buildDoc() {
    teardownDoc();
    var top = document.createElement('div');
    top.className = 'hk-doc'; top.id = 'hkDocTop'; top.setAttribute('aria-hidden', 'true');
    top.innerHTML =
      '<div class="hk-doc-cls">DECLASSIFIED &middot; RELEASE IN FULL</div>' +
      '<div class="hk-doc-hd">' +
        '<b>STATION</b><span>' + stationName() + '</span>' +
        '<b>DTG</b><span>' + dtg() + '</span>' +
        '<b>SOURCE</b><span>hikki.ca' + location.pathname + '</span>' +
        '<b>SHEET</b><span>1 OF 1</span>' +
      '</div><div class="hk-doc-rule"></div>';
    document.body.insertBefore(top, document.body.firstChild);

    if (typeof window.hkPrintBody === 'function') {
      var mid = document.createElement('div');
      mid.className = 'hk-doc'; mid.id = 'hkDocBody'; mid.setAttribute('aria-hidden', 'true');
      try { mid.innerHTML = window.hkPrintBody() || ''; } catch (_) { mid.innerHTML = ''; }
      top.parentNode.insertBefore(mid, top.nextSibling);
    }

    var foot = document.createElement('div');
    foot.className = 'hk-doc'; foot.id = 'hkDocFoot'; foot.setAttribute('aria-hidden', 'true');
    foot.innerHTML =
      '<div class="hk-doc-bars">' + bars() + '</div>' +
      '<div class="hk-doc-foot"><span>hikki photography &amp; philosophy</span>' +
      '<span>NO FOREIGN DISSEM &nbsp;&#9632;</span></div>';
    document.body.appendChild(foot);
  }
  function teardownDoc() {
    ['hkDocTop', 'hkDocBody', 'hkDocFoot'].forEach(function (id) {
      var e = document.getElementById(id); if (e) e.remove();
    });
  }
  function wirePrint() {
    window.addEventListener('beforeprint', buildDoc);
    window.addEventListener('afterprint', teardownDoc);
    if (window.matchMedia) {                         /* Safari 唔發 beforeprint */
      var mq = window.matchMedia('print');
      var onMq = function (e) { (e.matches ? buildDoc : teardownDoc)(); };
      if (mq.addEventListener) mq.addEventListener('change', onMq);
      else if (mq.addListener) mq.addListener(onMq);
    }
  }

  /* ===== Service worker =====
     淨係為咗唔使每次入 rainfall 都重載 580–868KB 地圖。
     localhost 唔註冊，免得改嘢嗰陣食住舊 cache。 */
  function wireSW() {
    if (!('serviceWorker' in navigator)) return;
    if (/^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  /* ===== Analytics（預設唔開）=====
     填咗 domain 之後會載入 Plausible —— 唔用 cookie、唔收 IP、
     唔追蹤個人，所以唔使 cookie banner，亦唔抵觸私隱頁講嘅嘢。
     自架 Umami 嘅話改 ANALYTICS_SRC 就得。
     留空 = 一個第三方請求都唔會發出。 */
  var ANALYTICS_DOMAIN = 'hikki.ca';
  var ANALYTICS_SRC = 'https://plausible.io/js/script.js';
  function wireAnalytics() {
    if (!ANALYTICS_DOMAIN) return;
    var t = document.createElement('script');
    t.defer = true;
    t.setAttribute('data-domain', ANALYTICS_DOMAIN);
    t.src = ANALYTICS_SRC;
    document.head.appendChild(t);
  }

  function init() {
    buildUI();
    startRotator();
    wireMenu();
    wireEnq();
    wirePrint();
    wireTty();
    wireSW();
    wireAnalytics();
    window.hkSyncBlink();          /* 對齊 header 及靜態 ■ */
    setTimeout(window.hkSyncBlink, 900);  /* 再對齊延遲插入嘅 ■（如 jewel 規格） */
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
