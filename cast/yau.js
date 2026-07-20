/* =====================================================================
   cast/yau.js — 邱探長（《燈火》邱曉棋）
   場景：毛二麵檔，暴風雨日。殮房之後，七樓之前。
   ===================================================================== */
(function () {
  var C = {
    id: "yau", name: "邱探長",
    occupation: "detective / PJ intel", age: "52", star: "ζ Ophiuchi", hue: 8,
    script: [
      { speaker: "——", text: "蒸氣喺玻璃窗上結霧。舊報紙貼咗上嚟，轉瞬又俾狂風吹走。" },
      { speaker: "——", text: "白光管下面坐咗個人。煙以每年十六米嘅速度，隨燈光飄遠。" },
      { speaker: "——", text: "與氹仔飄離澳門、月球飄離地球嘅軌跡，同步。" },
      { speaker: "——", text: "枱面有醃辣椒，半滿嘅豉油，一份《力報》。今日嘅頭條依舊喜慶。" },
      { text: "……坐。" },
      { speaker: "YOU", text: "……" },
      { text: "呢種天行得入嚟嘅，唔係嚟避雨。講。" },
      { type: "choice", text: "佢用匙羹推開肉沫上飄浮嘅蠔仔。", choices: [
        { label: "1, 你係差人？", jump: "y_cop" },
        { label: "2, 想搵人傾偈。", jump: "y_talk" },
        { label: "3, （唔出聲）", jump: "y_silent" }
      ] },
      { id: "y_cop", text: "算係。" },
      { speaker: "耳語", text: "你不是一名警察。你是遺失在制度漏洞裡的記錄，你的階級是失語。" },
      { text: "……落雨落得耐，人會聽到啲嘢。唔好理。" },
      { type: "jump", target: "y_main" },
      { id: "y_talk", text: "傾偈。" },
      { text: "我喺呢度審過三個毒販，一個神父，一位區議員。你想傾邊味？" },
      { type: "jump", target: "y_main" },
      { id: "y_silent", text: "……" },
      { speaker: "——", text: "湯滾，粉滑，丸彈。佢食咗兩啖，先再開口。" },
      { type: "jump", target: "y_main" },

      { id: "y_main", speaker: "——", text: "廚房好似有人盯緊佢。並沒有。抬頭，廚房入面冇人，只有熱氣湧出。" },
      { text: "今朝死咗個人。開報紙檔嗰個。" },
      { text: "背脊貼地，手指張開。血唔再由左胸滲出——雨水反而開始滲入身體。" },
      { text: "嗰槍太靚，太乾淨。但凡有半點動靜，都一定會打偏。" },
      { speaker: "YOU", text: "你識佢？" },
      { text: "廿年。" },
      { text: "成個警隊，得我一個真心想趕佢出澳門。亦都係我，廿年前救過佢一命。" },
      { type: "choice", text: "佢冇解釋呢兩句嘢點樣同時成立。", choices: [
        { label: "1, 廿年前發生咗咩事？", jump: "y_1993" },
        { label: "2, 咁而家邊個殺佢？", jump: "y_who" }
      ] },

      { id: "y_1993", text: "九三年，年廿八。我無視所有訓示，一口氣拉咗幾十人，封咗舊碼頭個軍火倉。" },
      { text: "開埠以嚟第二多。仲有佢同海外網絡聯繫嘅鐵證。" },
      { text: "我滿心歡喜行出倉庫。迎住我嘅，係上級一張張比北風仲肅殺嘅臉。" },
      { text: "國際刑警冇介入。案件石沉大海。本地新聞一隻字都冇。" },
      { text: "我貫徹咗我嘅正義。代價係仕途，同繼續查落去嘅資格。" },
      { type: "jump", target: "y_conv" },

      { id: "y_who", text: "太多人想佢死。呢樣先至難查。" },
      { text: "但係兇手同佢講過嘢。公司做嘢，唔會同你傾閑偈。" },
      { text: "仲有——佢冇避。" },
      { text: "一個做咗成世刀嘅人，企定定，等把刀落嚟。" },
      { type: "jump", target: "y_conv" },

      { id: "y_conv", speaker: "——", text: "收音機播緊華南海域天氣報告。專業嘅聲線略帶不安。" },
      { text: "我而家教書。警校。高層唔想我查案，但係唔介意我日日喺度瘋言瘋語。" },
      { text: "第一堂，我例必問一條問題——你係邊個。" },
      { type: "choice", text: "佢望住你。", choices: [
        { label: "1, 我係澳門人。", jump: "y_id1" },
        { label: "2, （唔答）", jump: "y_id2" }
      ] },
      { id: "y_id1", text: "葡國走之前，叫『華民』。中國未收返之前，叫『海外華僑』。而家，『特區居民』。" },
      { text: "咁多年嚟，你都唔係一個『人』。" },
      { text: "「澳門人」三個字太輕。如一片煙灰，稍一碰撞便飄散。" },
      { type: "jump", target: "y_alun" },
      { id: "y_id2", text: "……班房通常都係咁靜。" },
      { text: "有個學生答過「保護市民」。我問佢：邊個係市民。" },
      { text: "佢到而家都未答到我。" },
      { type: "jump", target: "y_alun" },

      { id: "y_alun", speaker: "——", text: "佢筷子擱喺碗邊。湯面嗰層油膜完全合攏。" },
      { text: "我拍檔尋晚俾架五噸半撞入間茶記。今朝凌晨自己拆咗鹽水，行返出嚟。" },
      { type: "gate", met: "alun", then: "y_alun_met", else: "y_alun_no" },
      { id: "y_alun_met", text: "……你見過佢。" },
      { text: "咁你知我講緊乜。嗰種人，件事未完，佢唔會肯瞓喺床度。" },
      { type: "jump", target: "y_boss" },
      { id: "y_alun_no", text: "後生。應該做醫生嗰種人。點知走咗入嚟。" },
      { type: "jump", target: "y_boss" },

      { id: "y_boss", speaker: "——", text: "又一陣雨灑喺玻璃上，滴滴滴，如波子傾瀉喺鵝卵石路。" },
      { text: "我上頭有個人。冇官銜，冇部門。程序係佢最鍾意嘅詞語。" },
      { text: "佢話：呢場風打完，我哋三邊都贏。" },
      { speaker: "YOU", text: "咁你點答？" },
      { text: "……" },
      { speaker: "耳語", text: "所有不必要的同情，所有矛盾。轉椅應聲倒下，輪子在空中徒勞地旋轉。" },
      { text: "我冇答。" },
      { speaker: "——", text: "佢嘅憤怒總是帶着疑惑。" },

      { type: "gate", met: "daid", then: "y_daid_met", else: "y_vision" },
      { id: "y_daid_met", speaker: "——", text: "你提起另一段信號。佢隻手停咗喺半空。" },
      { text: "……佢同你講咗啲咩。" },
      { speaker: "——", text: "唔係問句。佢等咗一陣，冇再問落去。" },
      { type: "jump", target: "y_vision" },

      { id: "y_vision", text: "尋晚我見到七枝箭浮喺水面。水溫攝氏三十八度。" },
      { text: "每枝指向唔同嘅地方。賭場。船塢。七樓。……仲有一張我憎惡萬分嘅臉。" },
      { speaker: "——", text: "白光管閃咗一下。" },
      { text: "夠鐘。" },
      { speaker: "YOU", text: "……" },
      { text: "埋單。" },
      { type: "end", text: "佢起身，隨意踢到幾張摺凳，行返入滂沱大雨中。歸一。" }
    ]
  };
  (window.CAST = window.CAST || []).push(C);
})();
