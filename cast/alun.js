/* =====================================================================
   cast/alun.js — 阿倫（《燈火》邱曉棋）
   場景：醫院後門，凌晨四點三十一分。出院唔係決定，係習慣。
   ===================================================================== */
(function () {
  var C = {
    id: "alun", name: "阿倫",
    occupation: "intel officer / PJ", age: "29", star: "α Cygni", hue: 195,
    script: [
      { speaker: "——", text: "凌晨四點三十一分。醫院後門。雨未停。" },
      { speaker: "——", text: "白色絲質襯衫透出鎖骨嘅輪廓。佢用指尖輕輕拎住支煙。" },
      { text: "你唔係護士。" },
      { speaker: "YOU", text: "……" },
      { speaker: "——", text: "佢喺雨入面點火。一次就着。" },
      { type: "choice", text: "佢望住你，等你先開口。", choices: [
        { label: "1, 你頭先喺入面？", jump: "a_ward" },
        { label: "2, 你冇事？", jump: "a_ok" }
      ] },
      { id: "a_ward", text: "醒咗。凌晨四點半。" },
      { text: "第一個諗法係：終於有人同大D收屍。" },
      { text: "第二個諗法先係：我仲未死。次序有啲問題。我知。" },
      { type: "jump", target: "a_case" },
      { id: "a_ok", text: "隱隱有啲頭痛。四肢活動如常。" },
      { text: "醫院嘅燈光打落嚟嗰陣，有種懷念嘅感覺。但係燈冇旋轉。得一瞬。" },
      { type: "jump", target: "a_case" },

      { id: "a_case", speaker: "——", text: "佢呼出一口煙。煙喺雨粉之間。" },
      { text: "你想問單案。" },
      { text: "兇手同大D講過嘢，冇同 Tommy 講。" },
      { text: "公司唔會同你傾閑偈。所以第一單，唔係佢哋嘅人。" },
      { text: "第二單——一槍攞命，仲要補兩槍，掟落街。呢個先係公司做嘢嘅方法。" },
      { type: "choice", text: "煙灰跌落水氹，又浮起。", choices: [
        { label: "1, 咁邊個殺大D？", jump: "a_killer" },
        { label: "2, 撞你哋嗰架車呢？", jump: "a_truck" }
      ] },
      { id: "a_killer", text: "識佢嘅人。佢肯企定定聽佢講完嘅人。" },
      { text: "呢個名單好短。" },
      { type: "jump", target: "a_self" },
      { id: "a_truck", text: "五噸半，冇車牌，左軚。司機當場死亡。" },
      { text: "同前兩單，都唔同人。……呢樣先至有趣。" },
      { text: "signal lost" }
    ]
  };
  (window.CAST = window.CAST || []).push(C);
})();
