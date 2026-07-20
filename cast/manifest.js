/* =====================================================================
   cast/manifest.js — 燈火角色劇本池載入器
   =====================================================================
   ◆ 點樣加新角色：
     1. 喺 cast/ 內新增 <id>.js（格式參考 cast/yau.js 開頭註解）
     2. 喺下面 CAST_FILES 加一行檔名
     3. （可選）放 portraits/<id>.png 頭像；冇嘅話會出 recalibrating 動畫
   角色會自動加入每日輪換池——池有幾大，輪幾多日先循環一次。
   ===================================================================== */
var CAST_FILES = [
  'yau.js',      /* 邱探長 */
  'alun.js',     /* 阿倫 */
  'daid.js',     /* 大D */
  'roger.js',    /* Roger */
  'tommy.js'     /* Tommy */
];
(function () {
  /* 同 game.html 嘅 ?v= 保持一致：更新劇本後把版本 +1，避免舊 cache */
  var V = '?v=5';
  for (var i = 0; i < CAST_FILES.length; i++) {
    /* document.write 係同步載入：保證喺 game.html 主腳本執行前備妥 */
    document.write('<script src="cast/' + CAST_FILES[i] + V + '"><\/script>');
  }
})();
