import io, sys, pathlib

MARK_A = "  <!-- POLI3-TAKEOVER-START -->"
MARK_B = "  <!-- POLI3-TAKEOVER-END -->"

BLOCK = MARK_A + """
  <!-- 2026-11-27 夜，台灣大選前：全站暫時轉去 POLI-3。這一段是臨時的。
       拆返（十分鐘內全站生效，HTML 不經 Cloudflare 快取）：
         python3 scripts/takeover.py off && python3 bump.py
       KEEP 裏那幾版不轉：傳單同卡片上面印了 QR，掃下去要見到原本那一頁。
       想連那幾版都轉，把 KEEP 改成空陣列 []（十五個檔都要改，見 scripts/takeover.py）。
       網址加 ?stay 可以照看原本那一頁，之後同一個分頁都不會再轉。 -->
  <script>(function(){var K=['/jewel.html','/gallery.html'],
    p=location.pathname.replace(/\\/index\\.html$/,'/');
    if(p.indexOf('/poli3/')===0||p.indexOf('/alex')===0)return;
    for(var i=0;i<K.length;i++)if(p===K[i])return;
    try{if(location.search.indexOf('stay')>=0){sessionStorage.setItem('hk-stay','1');return;}
        if(sessionStorage.getItem('hk-stay'))return;}catch(e){}
    location.replace('/poli3/');})();</script>
""" + MARK_B

PAGES = ["404.html","about.html","console.html","gallery.html","game.html",
         "iching.html","index.html","jewel-gallery.html","jewel-patterns.html",
         "jewel-process.html","jewel.html","privacy.html","rainfall.html","sky.html"]

def strip(s):
    a = s.find(MARK_A)
    if a < 0: return s, False
    b = s.find(MARK_B)
    return s[:a] + s[b+len(MARK_B):].lstrip("\n"), True

mode = sys.argv[1] if len(sys.argv) > 1 else "on"
for name in PAGES:
    p = pathlib.Path(name)
    s = p.read_text(encoding="utf-8")
    s, had = strip(s)
    if mode == "on":
        at = s.find("<head>")
        if at < 0:
            print("!! 冇 <head>：", name); continue
        at += len("<head>")
        s = s[:at] + "\n" + BLOCK + s[at:]
    p.write_text(s, encoding="utf-8")
    print(("加" if mode=="on" else "拆") + ("（覆蓋舊嘅）" if had and mode=="on" else ""), name)
