/* =====================================================================
   cast/tommy.js — Tommy（《燈火》邱曉棋）
   場景：天台，樓層六十四。剝膚以床，凶。錄自佢最後一晚。
   ===================================================================== */
(function () {
  var C = {
    id: "tommy", name: "Tommy",
    occupation: "informant / ex-lookout", age: "†58", star: "ε Lyrae", hue: 268,
    script: [
      { speaker: "——", text: "天台。樓層六十四。雨停咗，但係風勢喘急。" },
      { speaker: "——", text: "有個人扶住輸水管，匍匐前行。佢見到你，冇驚。" },
      { text: "小心風。企埋嚟啲。" },
      { speaker: "YOU", text: "你喺度做咩？" },
      { text: "搵我阿媽間屋嘅方位。" },
      { text: "……以前一望就見。" },
      { type: "choice", text: "佢瞇起眼。你可以陪佢望一陣。", choices: [
        { label: "1, 望東面。", jump: "t_east" },
        { label: "2, 望北面。", jump: "t_north" },
        { label: "3, 望落下面。", jump: "t_down" }
      ] },

      { id: "t_east", text: "銀河、永利、葡京。嗰啲巨大建築以不合比例嘅姿態向天伸張，喺低雲之間閃爍。" },
      { text: "每一處燈光都有自己嘅節奏。不協調，卻頑強。" },
      { text: "再過去，九澳、竹灣。舊礦場同難民營。" },
      { text: "大D中槍嗰一刻，風就係由嗰邊吹入。我記得嗰種角度。" },
      { type: "jump", target: "t_city" },
      { id: "t_north", text: "關閘。灰黃色嘅行政樓層，企喺邊界上。" },
      { text: "另一側係珠海。城市嘅燈火如同病灶，蔓延至祖國嘅肺葉。" },
      { text: "嗰邊有更廣、更深嘅濕地。濕地埋住龍舟，龍舟兩旁係荔枝樹。" },
      { text: "樹上嘅細路，做緊有關石榴嘅夢。……太遲了。" },
      { type: "jump", target: "t_city" },
      { id: "t_down", text: "落面每一條街名，都嚟自我陌生嘅語言。" },
      { text: "每一層建築，都混合水泥、貪婪與諷刺。" },
      { type: "jump", target: "t_city" },

      { id: "t_city", speaker: "——", text: "風由高樓壓縮，喺天台上轉向。佢坐低，背靠水箱。" },
      { text: "三個島，用陸橋同填海縫埋一齊。似一具被強行接駁嘅遺體。" },
      { text: "佢哋唔屬於彼此，卻必須共享同一種呼吸方式。" },
      { text: "西灣大橋係動脈。氹仔舊區係反芻吐出嘅渣滓。" },
      { text: "路環森林係個肺。個肺早就纖維化，俾填海嘅塵土堵死。" },
      { text: "黑沙海灘擱淺嘅，唔再係貝殼。" },
      { speaker: "YOU", text: "你好熟呢度。" },
      { text: "以前成個澳門我睇晒。" },
      { text: "邊個同邊個食飯，邊隻貨櫃走邊條水路——佢哋有咩傾，都係搵我。" },
      { type: "choice", text: "佢由褲袋摸出一疊彩票，數都冇數，又塞返入去。", choices: [
        { label: "1, 睇晒，即係明晒？", jump: "t_see" },
        { label: "2, 而家呢？", jump: "t_now" }
      ] },
      { id: "t_see", text: "睇晒，唔等於明晒。" },
      { type: "jump", target: "t_father" },
      { id: "t_now", text: "而家啲樓越起越高。" },
      { text: "佢哋企喺我同一切嘢中間。" },
      { type: "jump", target: "t_father" },

      { id: "t_father", speaker: "——", text: "一陣更急嘅風。佢等風過，先開口。" },
      { text: "大D結婚嗰日，中午，我接到我老豆嘅死訊。" },
      { type: "gate", met: "daid", then: "t_wed_met", else: "t_wed" },
      { id: "t_wed_met", text: "……你聽過佢把聲。" },
      { text: "嗰日佢著住西裝。成場最靜嗰個，係新郎。" },
      { type: "jump", target: "t_wed" },
      { id: "t_wed", text: "隔籬廳傳嚟碗筷嘅碰撞聲，咀嚼聲，新聞主播嗡嗡嗡講個不停。" },
      { text: "瞬間嘅光線剎白，一切歸於寂靜。" },
      { text: "嗰一刻我覺得，自己好似成咗新娘嘅父親。" },

      { speaker: "——", text: "佢望落城市。低雲反住光，成個天好似一塊熄咗一半嘅招牌。" },
      { text: "下期六合彩獎金高達廿億。收音機日日咁講。" },
      { text: "臨上嚟之前，我起咗一卦。剝。" },
      { text: "剝膚以床——凶。" },
      { speaker: "YOU", text: "……" },
      { text: "殖民地，籌碼，星體。" },
      { text: "世間萬物，都終將被拋棄。" },

      { type: "gate", met: "yau", then: "t_yau_met", else: "t_last" },
      { id: "t_yau_met", text: "你識阿邱。嗰條硬頸。" },
      { text: "同佢講，唔好再食咁多粉。" },
      { type: "jump", target: "t_last" },

      { id: "t_last", speaker: "——", text: "佢慢慢企起身，拍一拍褲上面嘅灰。攞出兩粒藥丸，望一望，又收返。" },
      { text: "我落去喇。" },
      { text: "唔關燈，唔鎖門。冇家人，冇朋友。" },
      { speaker: "YOU", text: "……" },
      { text: "你行嗰陣，幫我熄埋天台呢盞燈。佢係公家嘅。" },
      { type: "end", text: "佢側身瞓低，面向窗。窗外，暴風像是巨大的幽靈在移動。伶仃怒海，命如孤舟。" }
    ]
  };
  (window.CAST = window.CAST || []).push(C);
})();
