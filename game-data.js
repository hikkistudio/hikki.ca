/* =====================================================================
   game-data.js — Macau17 角色 & 對話數據
   =====================================================================

   角色劇本一律放喺 cast/ 資料夾（見 cast/README.md），
   由 cast/manifest.js 載入。呢度嘅 CHARACTERS 留空，
   只作後備擴充用（有需要時可以直接喺下面加角色，格式如下）。

   ◆ 角色欄位：
     id         英文小寫，唯一
     name       顯示名（speaker 預設用呢個）
     occupation / age / star   側欄顯示
     hue        環境光及肖像色相偏移
     portrait   （可選）頭像路徑；預設慣例 = portraits/<id>.png。
                搵唔到檔案時自動顯示 recalibrating placeholder 動畫。
     script     對話節點陣列，由頭播到尾

   ◆ 對話節點格式（單線劇情，可以有分岐再匯合）：
     { text:"…" }                        角色講嘢（speaker 預設 = 角色名）
     { speaker:"YOU", text:"…" }         你講嘢（speaker 可以係任何字串）
     { id:"a", text:"…" }                錨點，俾 jump/choice 跳過嚟
     { type:"choice", text:"…",
       choices:[ {label:"1, …", jump:"a"}, {label:"2, …", jump:"b"} ] }
     { type:"jump", target:"end" }       無條件跳去某錨點
     { type:"gate", met:"id", then:"a", else:"b" }
                                         見過某角色就跳 a，否則 b
     { type:"end", text:"…" }            結尾；會自動出「>replay」

   ===================================================================== */

const CHARACTERS = [];
