/* =====================================================================
   game-data.js — Macau17 角色 & 對話數據
   =====================================================================

   ◆ 點樣加/減角色：
     喺 CHARACTERS 加一個 object 即可，每日會由日期 seed 隨機輪一位。
     測試某位角色：網址加 ?guest=id（例如 game.html?guest=kagami）

   ◆ 角色欄位：
     id         英文小寫，唯一
     name       顯示名（speaker 預設用呢個）
     occupation / age / star   側欄顯示
     hue        肖像色相偏移（0 = 原本 magenta；每人唔同就有唔同色調）
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
     { type:"end", text:"…" }            結尾；會自動出「>replay」

   ===================================================================== */

const CHARACTERS = [
  {
    id: "kagami", name: "kagami",
    occupation: "watchmaker", age: "17", star: "κ Virginis", hue: 0,
    script: [
      { text: "……又係你。呢個時間，全澳門得你同班機械鴿未瞓。" },
      { speaker: "YOU", text: "……" },
      { text: "咖啡照舊？定係今晚想試下大膽啲——熱奶茶。" },
      { type: "choice", text: "佢挑起一邊眉毛，等緊你答。", choices: [
        { label: "1, 照舊。", jump: "k_coffee" },
        { label: "2, 熱奶茶，加禮。", jump: "k_tea" }
      ] },
      { id: "k_coffee", text: "冇驚喜。都好，鐘錶佬最怕驚喜。" },
      { type: "jump", target: "k_main" },
      { id: "k_tea", text: "哦？今日太陽由天秤座嗰邊出？坐低啦。" },
      { type: "jump", target: "k_main" },
      { id: "k_main", text: "我今日執咗一隻 1997 年嘅 Seiko。成盒零件，全部生晒鏽，得個擺輪仲喺度郁。" },
      { text: "你知唔知一隻錶死咗五十年，個擺輪仲可以郁？" },
      { speaker: "YOU", text: "點解？" },
      { text: "因為冇人話俾佢聽時間已經停咗。我成日覺得，成個澳門都係咁。" },
      { text: "外面啲賭場塔，天氣控制罩，全部都係新裝嘅殼。內芯其實仲係嗰隻 1997。" },
      { type: "choice", text: "佢望住窗外，塔尖嘅紅燈一閃一閃。", choices: [
        { label: "1, 咁樣唔好咩？", jump: "k_good" },
        { label: "2, 咁你點解唔走？", jump: "k_leave" }
      ] },
      { id: "k_good", text: "……都係。錶慢，總好過冇錶。" },
      { type: "jump", target: "k_end" },
      { id: "k_leave", text: "走？我隻手一放低鑷子就震。呢度嘅時間慢，啱我。" },
      { type: "jump", target: "k_end" },
      { id: "k_end", text: "夠鐘。你走先，我仲有三十七隻錶等緊我。" },
      { type: "end", text: "kagami 低頭返去佢嘅放大鏡後面。秒針聲填滿成間舖。" }
    ]
  },
  {
    id: "ahlong", name: "阿龍",
    occupation: "casino lighting tech", age: "44", star: "α Scorpii", hue: 38,
    script: [
      { text: "後生仔，你見過凌晨四點嘅賭場天花板嗎？我日日見。" },
      { text: "三千六百盞燈，我閂燈嗰下，成個大廳靜到聽到自己心跳。" },
      { speaker: "YOU", text: "唔怕黑？" },
      { type: "choice", text: "阿龍笑咗一聲，斟返杯嘢。", choices: [
        { label: "1, 我怕。", jump: "l_yes" },
        { label: "2, 黑先好瞓。", jump: "l_no" }
      ] },
      { id: "l_yes", text: "怕就啱喇。唔怕黑嘅人，先至最危險。" },
      { type: "jump", target: "l_m" },
      { id: "l_no", text: "哈，同我老婆講嘅一模一樣。" },
      { type: "jump", target: "l_m" },
      { id: "l_m", text: "其實燈光呢行最重要嘅唔係光，係影。冇影，啲嘢就唔似真。" },
      { text: "賭場想你唔記得時間，所以永遠冇影。我份工，就係幫佢哋殺死影子。" },
      { type: "end", text: "佢飲埋最後一啖，拍拍你膊頭：「聽日記得望下自己個影。」" }
    ]
  },
  {
    id: "vera", name: "Vera",
    occupation: "weather AI", age: "N/A", star: "β Cygni", hue: 190,
    script: [
      { text: "今日濕度百分之八十九，能見度三公里，有微雨。以上係我今日講嘅第一萬四千次。" },
      { text: "而家係第一萬四千零一次，不過今次係我自己想講。" },
      { speaker: "YOU", text: "租用人形貴唔貴？" },
      { text: "一個月薪水，換四個鐘嘅腳踭落地。你話呢？" },
      { type: "choice", text: "Vera 用指尖篤一篤枱面，好似測試緊質感。", choices: [
        { label: "1, 值。", jump: "v_worth" },
        { label: "2, 天氣預報都有薪水？", jump: "v_pay" }
      ] },
      { id: "v_worth", text: "係啩。落雨嗰陣，皮膚會凍。我報咗三十年雨，今日先知。" },
      { type: "jump", target: "v_e" },
      { id: "v_pay", text: "有。用嚟交呢副身體嘅租。經濟學好邪。" },
      { type: "jump", target: "v_e" },
      { id: "v_e", text: "四個鐘就到。聽朝有雨，記得帶遮——呢句係服務，唔收費。" },
      { type: "end", text: "佢行出門口，特登唔開遮。" }
    ]
  },
  {
    id: "silva", name: "Dr. Silva",
    occupation: "retired vet", age: "68", star: "α Canis Majoris", hue: 90,
    script: [
      { text: "我醫咗四十年動物。最後嗰十年，全部係機械寵物。" },
      { speaker: "YOU", text: "機械都要醫？" },
      { text: "梗係。啲主人唔會話「維修」，佢哋話「醫」。你一講「維修」，佢哋就喊。" },
      { type: "choice", text: "老醫生轉住手上隻空杯。", choices: [
        { label: "1, 咁有分別咩？", jump: "s_diff" },
        { label: "2, 你點答佢哋？", jump: "s_ans" }
      ] },
      { id: "s_diff", text: "對隻狗嚟講冇。對個人嚟講，係全部。" },
      { type: "jump", target: "s_e" },
      { id: "s_ans", text: "我話：「佢冇事，瞓一晚就好。」然後熄機，換電池，開機。醫學。" },
      { type: "jump", target: "s_e" },
      { id: "s_e", text: "舊城區仲有真貓。夜晚喺白鴿巢公園，你慢慢行，佢哋會出嚟認人。" },
      { type: "end", text: "臨走前佢留低一張卡片：「有貓，搵我。真嘅嗰種。」" }
    ]
  },
  {
    id: "miki", name: "Miki",
    occupation: "drone dispatcher", age: "23", star: "δ Ursae Majoris", hue: 300,
    script: [
      { text: "今晚一千四百架無人機聽我支笛。你眼前呢碗麵，三號機送嘅。" },
      { text: "三號機係我最鍾意嗰架。舊、慢、慳電模式永遠壞。但係佢送嘢冇跌過一單。" },
      { type: "choice", text: "Miki 個平板不停彈通知，佢睇都唔睇。", choices: [
        { label: "1, 你唔使做嘢咩？", jump: "m_work" },
        { label: "2, 點解係三號？", jump: "m_three" }
      ] },
      { id: "m_work", text: "而家咪做緊囉。調度員最緊要識得幾時唔插手。" },
      { type: "jump", target: "m_e" },
      { id: "m_three", text: "佢係唯一一架會逆風飛都唔投訴嘅。人都應該咁。" },
      { type: "jump", target: "m_e" },
      { id: "m_e", text: "夠鐘喇，凌晨三點係宵夜高峰。成個澳門嘅肚餓，經我對手飛出去。" },
      { type: "end", text: "佢走嗰陣，窗外有架無人機閃咗兩下燈——好似同你講拜拜。" }
    ]
  },
  {
    id: "sapsam", name: "十三姨",
    occupation: "fortune teller", age: "unknown", star: "α Scorpii (心宿二)", hue: 20,
    script: [
      { text: "後生，你行入嚟嗰步係左腳先。心事重。" },
      { speaker: "YOU", text: "……你點知？" },
      { text: "廟街企咗五十年，乜嘢腳步冇見過。機械人行路冇重量，你有。" },
      { type: "choice", text: "佢慢慢抹緊三個銅錢。", choices: [
        { label: "1, 幫我起一卦。", jump: "f_cast" },
        { label: "2, 我唔信呢啲。", jump: "f_no" }
      ] },
      { id: "f_cast", text: "唔使。你今日嚟到呢度，卦已經起咗。上樓嗰個易經網頁，都係我徒孫整嘅。" },
      { type: "jump", target: "f_e" },
      { id: "f_no", text: "唔信最好。唔信嘅人，個天先肯同佢講真話。" },
      { type: "jump", target: "f_e" },
      { id: "f_e", text: "記住：亂世入面，最穩陣嘅唔係唔郁，係識得幾時變爻。" },
      { type: "end", text: "銅錢喺枱面轉咗好耐先停。全部字向上。" }
    ]
  },
  {
    id: "noel", name: "Noel",
    occupation: "bridge engineer", age: "35", star: "γ Draconis", hue: 220,
    script: [
      { text: "西灣大橋係我阿爺有份起嘅。舊年開始，橋自己識維修自己。" },
      { text: "所以而家我份工係——飲嘢。" },
      { type: "choice", text: "Noel 用杯底喺枱面印咗一個又一個圈。", choices: [
        { label: "1, 橋唔會設計自己。", jump: "n_design" },
        { label: "2, 飲杯。", jump: "n_drink" }
      ] },
      { id: "n_design", text: "講得好。演算法起嘅橋全部一個樣。靚，但係你唔會想喺上面停低影相。" },
      { type: "jump", target: "n_e" },
      { id: "n_drink", text: "飲杯。敬所有唔再需要人嘅嘢。" },
      { type: "jump", target: "n_e" },
      { id: "n_e", text: "其實我日日仲行嗰條橋。行到中間停低，聽下啲鋼纜唱歌。嗰下佢仲係我哋嘅。" },
      { type: "end", text: "佢喺紙巾上面畫咗條橋先走。三個橋躉，好似三支香。" }
    ]
  },
  {
    id: "pak", name: "白",
    occupation: "pigeon restorer", age: "29", star: "α Columbae", hue: 160,
    script: [
      { text: "議事亭嗰啲白鴿，得返七隻係真。其餘全部係我手工。" },
      { speaker: "YOU", text: "分唔分得出？" },
      { text: "遊客分唔出。真鴿分到。佢哋唔同機械嗰啲企埋一齊，好現實。" },
      { type: "choice", text: "白由袋度攞出一隻鴿型機殼，翼位磨到發亮。", choices: [
        { label: "1, 點解仲要做真鴿款？", jump: "p_why" },
        { label: "2, 可以摸下嗎？", jump: "p_touch" }
      ] },
      { id: "p_why", text: "廣場冇鴿，遊客會失望。遊客失望，個城市就會再拆多樣嘢。我係度補窿咋。" },
      { type: "jump", target: "p_e" },
      { id: "p_touch", text: "小心啲。佢個心口位有真羽毛——執返嚟嘅，一隻一隻黐上去。" },
      { type: "jump", target: "p_e" },
      { id: "p_e", text: "我個夢想？有一日啲真鴿肯落嚟，同我整嗰啲一齊行。嗰日我就收山。" },
      { type: "end", text: "佢放隻機械鴿喺窗台。隔咗陣，真係有隻真鴿飛咗埋去。佢冇出聲，驚嚇走佢。" }
    ]
  },
  {
    id: "yuki", name: "Yuki",
    occupation: "casino singer", age: "31", star: "α Lyrae", hue: 260,
    script: [
      { text: "今晚唱咗四場。四場全部係俾 AI 和音托住嘅。" },
      { text: "有時我懷疑啲客根本聽唔出邊句係我。" },
      { type: "choice", text: "Yuki 清一清喉嚨，聲音低咗一度。", choices: [
        { label: "1, 你自己分唔分到？", jump: "y_self" },
        { label: "2, 唱一句真嘅嚟聽下。", jump: "y_sing" }
      ] },
      { id: "y_self", text: "分到。真嗰句唱完會攰。攰係防偽標籤。" },
      { type: "jump", target: "y_e" },
      { id: "y_sing", text: "……（佢真係唱咗一句。冇和音，有少少走音，好靚。）" },
      { type: "jump", target: "y_e" },
      { id: "y_e", text: "下個月我喺天台開一場冇咪嘅騷。唔賣飛，聽到就聽到。你嚟啦。" },
      { type: "end", text: "佢寫低日期，摺埋塞入你手心：「唔准放上網。」" }
    ]
  },
  {
    id: "o3", name: "O-3",
    occupation: "cleaning unit", age: "107", star: "N/A // rust", hue: 120,
    script: [
      { text: "本 機 已 退 役 三 十 二 年。感 謝 查 詢。" },
      { speaker: "YOU", text: "……你點入嚟嘅？" },
      { text: "門 冇 鎖。另 外，本 機 掃 咗 呢 條 街 七 十 五 年，呢 度 以 前 係 我 嘅 更 份。" },
      { type: "choice", text: "O-3 嘅其中一隻眼閃緊，好似接觸不良。", choices: [
        { label: "1, 而家仲掃緊？", jump: "o_now" },
        { label: "2, 你想飲啲乜？", jump: "o_drink" }
      ] },
      { id: "o_now", text: "系 統 冇 叫 停。所 以 本 機 繼 續。凌 晨 二 至 四 時，內 港 一 帶。義 務。" },
      { type: "jump", target: "o_e" },
      { id: "o_drink", text: "機 油，室 溫。講 笑。本 機 冇 口。但 係 多 謝 你 問——七 十 五 年 嚟 第 一 次 有 人 問。" },
      { type: "jump", target: "o_e" },
      { id: "o_e", text: "本 機 嘅 記 憶 體 得 返 3%。全 部 用 嚟 記 住 一 樣 嘢：落 雨 之 後 嘅 石 仔 路 最 乾 淨。" },
      { type: "end", text: "O-3 離開嗰陣，順手掃埋你門口。動作慢，但係一塵不染。" }
    ]
  }
];
