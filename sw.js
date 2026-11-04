/* =====================================================================
   sw.js — hikki.ca service worker
   目的只有一個：唔好每次入 rainfall 都重新落載 580–868KB 嘅地圖。
   策略保守，唔會攔截自己唔識嘅嘢：
     · 地圖 JSON / 相片 / 字型 → cache-first（內容唔變，變咗會換 ?v=）
     · HTML / JS / CSS         → network-first，斷網先至拎 cache
     · 其他（API、第三方）      → 完全唔碰
   ===================================================================== */
const CACHE_VERSION = 'v127';
const CACHE = 'hikki-' + CACHE_VERSION;

const CACHE_FIRST = [
  /\/(macau|victoria)-map\.json/,
  /\/28_xiu_j2000\.json/,
  /\/bright-stars\.json/,
  /\/photos\//,
  /\/models\//,
  /^https:\/\/fonts\.gstatic\.com\//,
];
const NETWORK_FIRST = [/\.html$/, /\/$/, /\.js(\?|$)/, /\.css(\?|$)/];

const match = (url, list) => list.some((re) => re.test(url));

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (!url.startsWith(self.location.origin) && !/fonts\.gstatic\.com/.test(url)) return;

  if (match(url, CACHE_FIRST)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then((k) => k.put(req, c)); }
        return res;
      }))
    );
    return;
  }

  if (match(url, NETWORK_FIRST)) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then((k) => k.put(req, c)); }
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
