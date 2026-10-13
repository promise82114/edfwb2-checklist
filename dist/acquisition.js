// Verified acquisition overrides for the 173 extra weapons in the 688-weapon catalog.
// Base-game rescue weapons intentionally use the application's existing fallback.
// Static stable-ID map: no load-order dependency on data.js or details.js.
// Mission-pack overview / box and clear tables: https://w.atwiki.jp/edfwb2/pages/188.html
// Lv.1 purchase grants and HARDEST EX05 launcher3 correction: https://w.atwiki.jp/edfwb2/pages/21.html
// DLC / bonus character Lv.1 grants and higher-level rescue: https://w.atwiki.jp/edfwb2/pages/14.html
// Character-family owners are corroborated by their category URLs in details.js.
// Exact source spelling aliases (no fuzzy matching):
// "エアメールⅡ" -> "エアメールII"
// "Opxll.D1\"David\"" -> "OpxII.D1 \"David\""
// "ナイル一号基" -> "ナイル1号基"
// "プレデターSamrai" -> "プレデターSamurai"
// "Apxll.A3\"Ali\"" -> "OpxII.A3 \"Ali\""
// "ギガント・ジオニードルⅡ" -> "ギガント・ジオニードルII"
// "ALT−ガイスト3改" -> "ALT-ガイスト3改"
// Opxll. is the catalog family label; all five weapon names use OpxII.
// Central HARDEST EX05 says launcher without suffix; the investigation log
// explicitly identifies launcher3. Lv.1 launcher remains a purchase grant.
// method: box = collect mission weapon box; rescue = rescue installed owner;
// bonus = supplied with installed DLC/bonus; clear = cumulative IMP mission count.
// missions entries record only verified exact EX numbers and difficulty.
// clearCount counts distinct completed missions, including main game and DLC.
// Do not derive owner display from weapon.extra; only method box means DLC武器箱.
window.EDF_ACQUISITION = {
  weapons: {
    // ブレイザー001
    "w-2e279038": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ブレイザー002
    "w-c142894": {"method":"box","note":"DLC武器箱：EX03／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":3,"extra":true,"difficulty":"HARD"}]},
    // ブレイザー005A
    "w-19bf4b4d": {"method":"box","note":"DLC武器箱：EX03／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":3,"extra":true,"difficulty":"INFERNO"}]},
    // ブレイザー005B
    "w-2151eb0": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 24 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":24},
    // ブレイザー007
    "w-9d55ee89": {"method":"box","note":"DLC武器箱：EX14／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":14,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // OpxII.A1 "Arthur"
    "w-24f5e702": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // OpxII.D1 "David"
    "w-838e71d0": {"method":"box","note":"DLC武器箱：EX14／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":14,"extra":true,"difficulty":"NORMAL"}]},
    // OpxII.A2 "Alex"
    "w-2a7b68eb": {"method":"box","note":"DLC武器箱：EX15／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":15,"extra":true,"difficulty":"HARD"}]},
    // OpxII.D2 "Diego"
    "w-11fbe2d8": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 2 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":2},
    // OpxII.A3 "Ali"
    "w-dee6b8af": {"method":"box","note":"DLC武器箱：EX08／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":8,"extra":true,"difficulty":"INFERNO"}]},
    // プレデター
    "w-f3960176": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // プレデターShuriken
    "w-488c0a94": {"method":"box","note":"DLC武器箱：EX15／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":15,"extra":true,"difficulty":"NORMAL"}]},
    // プレデターKatana
    "w-a6aa4396": {"method":"box","note":"DLC武器箱：EX04／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":4,"extra":true,"difficulty":"INFERNO"}]},
    // プレデターYaiba
    "w-c54f178c": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 19 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":19},
    // プレデターSamurai
    "w-e26300ab": {"method":"box","note":"DLC武器箱：EX06／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":6,"extra":true,"difficulty":"INFERNO"}]},
    // ホビー・スレイド
    "w-cf985a6e": {"method":"bonus","note":"取得並導入DLC角色「プロフェッサー」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ホビー・スレイドv2
    "w-bb4107cb": {"method":"rescue","note":"導入DLC角色後，救援「プロフェッサー」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 試作型スレイド
    "w-278dc652": {"method":"rescue","note":"導入DLC角色後，救援「プロフェッサー」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 試作型スレイドv2
    "w-e2bc023a": {"method":"rescue","note":"導入DLC角色後，救援「プロフェッサー」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // スレイド・ゼロ
    "w-2a939382": {"method":"rescue","note":"導入DLC角色後，救援「プロフェッサー」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // AF-14 & ガバナー
    "w-b3197d1e": {"method":"bonus","note":"取得並導入DLC角色「大尉」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // AF-15 & ガバナー
    "w-61e7ae6a": {"method":"rescue","note":"導入DLC角色後，救援「大尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // AF-16 & ガバナー
    "w-5aefa6a": {"method":"rescue","note":"導入DLC角色後，救援「大尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // AF-15V & ガバナー
    "w-9d89d259": {"method":"rescue","note":"導入DLC角色後，救援「大尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // AF-17 & ガバナー
    "w-192c9e06": {"method":"rescue","note":"導入DLC角色後，救援「大尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // PA-11AA
    "w-b5d40bc7": {"method":"bonus","note":"取得並導入DLC角色「中尉」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // PA-11AA-D
    "w-eb78f58b": {"method":"rescue","note":"導入DLC角色後，救援「中尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // PA-11AA-ST
    "w-14632c2f": {"method":"rescue","note":"導入DLC角色後，救援「中尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // PA-11AA-V
    "w-509b91e6": {"method":"rescue","note":"導入DLC角色後，救援「中尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // PA-11AA-Rev
    "w-56606a00": {"method":"rescue","note":"導入DLC角色後，救援「中尉」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 水鉄砲（税込み４６０円）
    "w-4da5c8d7": {"method":"bonus","note":"取得並導入特典角色「双葉理保 14歳 ～夏～」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 水鉄砲（税込み９８０円）
    "w-7c5263": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 14歳 ～夏～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 水鉄砲（税込み１９８０円）
    "w-643118e1": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 14歳 ～夏～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 水鉄砲（非売品）
    "w-b60380b9": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 14歳 ～夏～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 水鉄砲（税込み４６００円）
    "w-15e67378": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 14歳 ～夏～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // 殺虫スプレー
    "w-c05dd8a4": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // 殺虫スプレーEX
    "w-fb9b3348": {"method":"box","note":"DLC武器箱：EX12／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":12,"extra":true,"difficulty":"NORMAL"}]},
    // リクルート殺虫スプレー
    "w-a68c4027": {"method":"bonus","note":"Amazon 店舗特典；PC 版為 DLC 武器，無擁有者。","source":"https://w.atwiki.jp/edfwb2/pages/72.html"},
    // 虫よけスプレー
    "w-a2c46ad": {"method":"box","note":"DLC武器箱：EX08／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":8,"extra":true,"difficulty":"HARDEST"}]},
    // 殺虫スプレージェット
    "w-69d0e390": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 21 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":21},
    // 殺虫スプレーPRO
    "w-9d371ab8": {"method":"box","note":"DLC武器箱：EX07／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":7,"extra":true,"difficulty":"INFERNO"}]},
    // デクスター自動小銃
    "w-1bd29e41": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // デクスター自動小銃D1
    "w-b364d8cb": {"method":"box","note":"DLC武器箱：EX01／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":1,"extra":true,"difficulty":"NORMAL"}]},
    // デクスター自動小銃D2
    "w-1a9a9479": {"method":"box","note":"DLC武器箱：EX14／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":14,"extra":true,"difficulty":"HARD"}]},
    // デクスター自動小銃G
    "w-c7d0906": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 4 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":4},
    // デクスター自動小銃Z
    "w-36f1f54": {"method":"box","note":"DLC武器箱：EX14／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":14,"extra":true,"difficulty":"INFERNO"}]},
    // サプレスガン
    "w-689d26b8": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // サプレスガンM2
    "w-9e7744e2": {"method":"box","note":"DLC武器箱：EX07／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":7,"extra":true,"difficulty":"NORMAL"}]},
    // サプレスガンM3
    "w-3de2f00e": {"method":"box","note":"DLC武器箱：EX06／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":6,"extra":true,"difficulty":"HARDEST"}]},
    // サプレスガンM4
    "w-6f7a686f": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 15 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":15},
    // サプレスガンMS
    "w-1b1215e7": {"method":"box","note":"DLC武器箱：EX15／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":15,"extra":true,"difficulty":"INFERNO"}]},
    // ソニックパイル
    "w-87bcf53e": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // アラベスク
    "w-12eda503": {"method":"box","note":"DLC武器箱：EX04／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":4,"extra":true,"difficulty":"NORMAL"}]},
    // ソニックパイルPlus
    "w-77edb2ec": {"method":"box","note":"DLC武器箱：EX13／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":13,"extra":true,"difficulty":"HARDEST"}]},
    // アラベスクII
    "w-e8418662": {"method":"box","note":"DLC武器箱：EX01／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":1,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ローレンツ
    "w-6fcfafbd": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 5 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":5},
    // プロト・ライジン
    "w-8ec0d9a7": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ライコウ
    "w-f1c25ce1": {"method":"box","note":"DLC武器箱：EX07／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":7,"extra":true,"difficulty":"HARD"}]},
    // ライジン
    "w-d263fd42": {"method":"box","note":"DLC武器箱：EX01／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":1,"extra":true,"difficulty":"INFERNO"}]},
    // ライコウα
    "w-3c017ebd": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 16 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":16},
    // ライジンα
    "w-53b14eec": {"method":"box","note":"DLC武器箱：EX10／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":10,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // イグアス1号基
    "w-b5a5fc09": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // イグアス2号基
    "w-db698127": {"method":"box","note":"DLC武器箱：EX13／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":13,"extra":true,"difficulty":"NORMAL"}]},
    // ナイル1号基
    "w-6853f7cb": {"method":"box","note":"DLC武器箱：EX01／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":1,"extra":true,"difficulty":"HARDEST"}]},
    // イグアス・シンギュラリティ
    "w-112818cf": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 25 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":25},
    // ナイル・ジェットパルサー
    "w-1c6ca94a": {"method":"box","note":"DLC武器箱：EX15／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":15,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ポジトロンキャノン
    "w-1d4218a": {"method":"box","note":"DLC武器箱：EX16／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":16,"extra":true,"difficulty":"NORMAL"}]},
    // ポジトロンキャノンG
    "w-2dbcbf2": {"method":"box","note":"DLC武器箱：EX16／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":16,"extra":true,"difficulty":"HARD"}]},
    // ポジトロンキャノンGX
    "w-6bdb2235": {"method":"box","note":"DLC武器箱：EX16／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":16,"extra":true,"difficulty":"HARDEST"}]},
    // ポジトロンキャノンLimit
    "w-2d590327": {"method":"box","note":"DLC武器箱：EX16／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":16,"extra":true,"difficulty":"INFERNO"}]},
    // ポジトロンキャノンZ
    "w-2f2ae089": {"method":"box","note":"DLC武器箱：EX16／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":16,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // スティングレイM1
    "w-487ccc11": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // スティングレイM2
    "w-9247f079": {"method":"box","note":"DLC武器箱：EX05／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":5,"extra":true,"difficulty":"NORMAL"}]},
    // リクルートスティングレイ
    "w-a1460424": {"method":"bonus","note":"全球發行紀念免費 DLC 武器，無擁有者。","source":"https://w.atwiki.jp/edfwb2/pages/75.html"},
    // スティングレイM3
    "w-2b832d09": {"method":"box","note":"DLC武器箱：EX12／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":12,"extra":true,"difficulty":"HARDEST"}]},
    // スティングレイM4
    "w-476c68dc": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 17 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":17},
    // スティングレイMF
    "w-5c4cda53": {"method":"box","note":"DLC武器箱：EX13／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":13,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // プラズマヘビーキャノン
    "w-db016938": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // プラズマヘビーキャノンR
    "w-6a0b7461": {"method":"box","note":"DLC武器箱：EX06／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":6,"extra":true,"difficulty":"NORMAL"}]},
    // プラズマヘビーキャノン改
    "w-be98804b": {"method":"box","note":"DLC武器箱：EX14／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":14,"extra":true,"difficulty":"HARDEST"}]},
    // プラズマヘビーキャノンR2
    "w-82088a9e": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 3 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":3},
    // プラズマグレートキャノン
    "w-55817afa": {"method":"box","note":"DLC武器箱：EX08／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":8,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // CC10爆弾
    "w-902c1e71": {"method":"bonus","note":"取得並導入特典角色「本田広報官」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // CC20爆弾
    "w-e9e67753": {"method":"rescue","note":"導入特典角色後，救援「本田広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // CC30爆弾
    "w-c877a8ed": {"method":"rescue","note":"導入特典角色後，救援「本田広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // CC10爆弾（量産型）
    "w-db620f25": {"method":"rescue","note":"導入特典角色後，救援「本田広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // CC40爆弾
    "w-65fef9e3": {"method":"rescue","note":"導入特典角色後，救援「本田広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ストレート・ガイスト
    "w-478f857f": {"method":"bonus","note":"取得並導入特典角色「姫川広報官」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ストレート・ガイストB
    "w-f491c0ac": {"method":"rescue","note":"導入特典角色後，救援「姫川広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ストレート・ガイストC
    "w-de4f7b24": {"method":"rescue","note":"導入特典角色後，救援「姫川広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ラピッド・ストレート・ガイスト
    "w-4df09bc1": {"method":"rescue","note":"導入特典角色後，救援「姫川広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ストレート・ガイストD
    "w-33a25244": {"method":"rescue","note":"導入特典角色後，救援「姫川広報官」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // C30爆弾
    "w-52f413f6": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // C40爆弾
    "w-a82c963c": {"method":"box","note":"DLC武器箱：EX08／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":8,"extra":true,"difficulty":"HARD"}]},
    // C50爆弾
    "w-e055cdd2": {"method":"box","note":"DLC武器箱：EX12／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":12,"extra":true,"difficulty":"HARD"}]},
    // 軽量型C30爆弾
    "w-f61b4f15": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 23 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":23},
    // C60爆弾
    "w-994d5e84": {"method":"box","note":"DLC武器箱：EX11／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":11,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ALT-ガイスト
    "w-9f992565": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ALT-ガイスト3
    "w-f2e9ef31": {"method":"box","note":"DLC武器箱：EX09／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":9,"extra":true,"difficulty":"HARD"}]},
    // ALT-ガイストD
    "w-ce90cd7f": {"method":"box","note":"DLC武器箱：EX11／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":11,"extra":true,"difficulty":"HARD"}]},
    // ALT-ガイスト7
    "w-c18b9c3a": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 14 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":14},
    // ALT-ガイスト3改
    "w-b00e01ea": {"method":"box","note":"DLC武器箱：EX13／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":13,"extra":true,"difficulty":"INFERNO"}]},
    // レーザーチェーンソー
    "w-a6aa3322": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // レーザーチェーンソーG
    "w-fae51ad4": {"method":"box","note":"DLC武器箱：EX10／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":10,"extra":true,"difficulty":"NORMAL"}]},
    // リクルートレーザーチェーンソー
    "w-9c8c140d": {"method":"bonus","note":"全球發行紀念免費 DLC 武器，無擁有者。","source":"https://w.atwiki.jp/edfwb2/pages/76.html"},
    // レーザーチェーンソーII
    "w-8252251a": {"method":"box","note":"DLC武器箱：EX07／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":7,"extra":true,"difficulty":"HARDEST"}]},
    // レーザーチェーンソーGX
    "w-3da4f79f": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 12 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":12},
    // レーザーチェーンソーIII
    "w-8fdde25e": {"method":"box","note":"DLC武器箱：EX06／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":6,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // エアメール
    "w-4462952e": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // エアメールII
    "w-a4ef3e0d": {"method":"box","note":"DLC武器箱：EX02／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":2,"extra":true,"difficulty":"NORMAL"}]},
    // エアメールIII
    "w-73a1394f": {"method":"box","note":"DLC武器箱：EX02／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":2,"extra":true,"difficulty":"HARDEST"}]},
    // エアメールIV
    "w-762e1bf3": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 18 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":18},
    // エアメールV
    "w-ac0b1751": {"method":"box","note":"DLC武器箱：EX02／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":2,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ファルコン
    "w-d3443123": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ファルコンLR
    "w-14a29c4": {"method":"box","note":"DLC武器箱：EX08／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":8,"extra":true,"difficulty":"NORMAL"}]},
    // パワード・ファルコン
    "w-3587e35f": {"method":"box","note":"DLC武器箱：EX11／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":11,"extra":true,"difficulty":"HARDEST"}]},
    // ファルコンLR-2
    "w-b96a9c98": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 1 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":1},
    // スーパー・ファルコン
    "w-a836351d": {"method":"box","note":"DLC武器箱：EX05／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":5,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // インテグラルレイ
    "w-9f1eec17": {"method":"bonus","note":"取得並導入特典角色「双葉理保 19歳 ～冬～」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // インテグラルレイF
    "w-193425e4": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 19歳 ～冬～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // インテグラルレイG
    "w-7ca6b154": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 19歳 ～冬～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // インテグラルレイFdx
    "w-ad64afeb": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 19歳 ～冬～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // インテグラルレイGdx
    "w-b1f98d25": {"method":"rescue","note":"導入特典角色後，救援「双葉理保 19歳 ～冬～」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ミラージュ
    "w-ab04ee6d": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ミラージュ・ニンフ
    "w-615fa602": {"method":"box","note":"DLC武器箱：EX04／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":4,"extra":true,"difficulty":"HARD"}]},
    // ミラージュ・ヴィヴィアン
    "w-54cc8215": {"method":"box","note":"DLC武器箱：EX13／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":13,"extra":true,"difficulty":"HARD"}]},
    // ミラージュ・モルガン
    "w-7bf8e3c8": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 11 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":11},
    // ミラージュ・ロキ
    "w-8aa2c5d1": {"method":"box","note":"DLC武器箱：EX11／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":11,"extra":true,"difficulty":"INFERNO"}]},
    // ローラーボム
    "w-2deba2c4": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // B型ローラーボム
    "w-cefeb332": {"method":"box","note":"DLC武器箱：EX05／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":5,"extra":true,"difficulty":"HARD"}]},
    // ホバーボム
    "w-985d3fbd": {"method":"box","note":"DLC武器箱：EX05／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":5,"extra":true,"difficulty":"INFERNO"}]},
    // ローラーファットボム
    "w-62dffb8b": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 22 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":22},
    // C型ローラーボム
    "w-5d0fd2d": {"method":"box","note":"DLC武器箱：EX09／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":9,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ダイナモブレード
    "w-14c37ce1": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ダイナモブレードM2
    "w-87009b7": {"method":"box","note":"DLC武器箱：EX06／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":6,"extra":true,"difficulty":"HARD"}]},
    // ダイナモブレードM3
    "w-6c615a57": {"method":"box","note":"DLC武器箱：EX15／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":15,"extra":true,"difficulty":"HARDEST"}]},
    // ダイナモブレード改
    "w-711058a8": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 13 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":13},
    // ダイナモブレードM4
    "w-fb2fcab": {"method":"box","note":"DLC武器箱：EX12／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":12,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // プロト・サイキックコプター
    "w-4e9e04ea": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // サイキックコプター
    "w-c2c54748": {"method":"box","note":"DLC武器箱：EX10／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":10,"extra":true,"difficulty":"HARD"}]},
    // サイキックコプター・レーザー
    "w-1eea5e8": {"method":"box","note":"DLC武器箱：EX10／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":10,"extra":true,"difficulty":"HARDEST"}]},
    // サイキックコプター・カーテン
    "w-c42645c2": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 7 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":7},
    // サイキックコプターG
    "w-556fad97": {"method":"box","note":"DLC武器箱：EX04／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":4,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ウィザードビートル
    "w-4bd1b0a7": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ウィザードビートルE
    "w-7eb06b93": {"method":"box","note":"DLC武器箱：EX01／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":1,"extra":true,"difficulty":"HARD"}]},
    // ウィザードビートルS
    "w-e1c00ea": {"method":"box","note":"DLC武器箱：EX04／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":4,"extra":true,"difficulty":"HARDEST"}]},
    // ウィザードビートルQ
    "w-a0a099cc": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 8 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":8},
    // ニュー・ウィザードビートル
    "w-35c46827": {"method":"box","note":"DLC武器箱：EX10／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":10,"extra":true,"difficulty":"INFERNO"}]},
    // ヘブンズゲート・ランチャー
    "w-ef90c939": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ヘブンズゲート・ランチャー2
    "w-325aae58": {"method":"box","note":"DLC武器箱：EX11／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":11,"extra":true,"difficulty":"NORMAL"}]},
    // ヘブンズゲート・ランチャー3
    "w-25da3f68": {"method":"box","note":"DLC武器箱：EX05／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/21.html","missions":[{"number":5,"extra":true,"difficulty":"HARDEST"}]},
    // ヘブンズゲート・ガン
    "w-25d8cc00": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 10 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":10},
    // ヘブンズゲート・ランチャーD
    "w-29b2f98": {"method":"box","note":"DLC武器箱：EX09／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":9,"extra":true,"difficulty":"INFERNO"}]},
    // ライオニック・プランA
    "w-23444a70": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ライオニック・プランB
    "w-21b2de68": {"method":"box","note":"DLC武器箱：EX02／HARD。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":2,"extra":true,"difficulty":"HARD"}]},
    // ライオニック・プランC
    "w-7cc9b4b8": {"method":"box","note":"DLC武器箱：EX02／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":2,"extra":true,"difficulty":"INFERNO"}]},
    // ライオニック・プランE
    "w-af783832": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 20 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":20},
    // ライオニック・プランD
    "w-a7023f18": {"method":"box","note":"DLC武器箱：EX07／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":7,"extra":true,"difficulty":"IMPOSSIBLE"}]},
    // ジオニードル
    "w-9540bbda": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // ギガント・ジオニードル
    "w-fca4a67": {"method":"box","note":"DLC武器箱：EX09／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":9,"extra":true,"difficulty":"NORMAL"}]},
    // ジオニードル・ライフル
    "w-8e1c2cfc": {"method":"box","note":"DLC武器箱：EX09／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":9,"extra":true,"difficulty":"HARDEST"}]},
    // ジオニードルII
    "w-590d9f52": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 9 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":9},
    // ギガント・ジオニードルII
    "w-3ca31c13": {"method":"box","note":"DLC武器箱：EX12／INFERNO。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":12,"extra":true,"difficulty":"INFERNO"}]},
    // アントコプター
    "w-11dbdc65": {"method":"bonus","note":"取得並導入特典角色「エアレイ先輩」時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // アントコプターGreen
    "w-15110821": {"method":"rescue","note":"導入特典角色後，救援「エアレイ先輩」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // クイーン・アントコプター
    "w-664eb00c": {"method":"rescue","note":"導入特典角色後，救援「エアレイ先輩」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // アントコプターBlue
    "w-d939d2bb": {"method":"rescue","note":"導入特典角色後，救援「エアレイ先輩」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // アントコプターGold
    "w-d6ee0138": {"method":"rescue","note":"導入特典角色後，救援「エアレイ先輩」取得高階武器。","source":"https://w.atwiki.jp/edfwb2/pages/14.html"},
    // ドレインリバーサー
    "w-c96eb592": {"method":"bonus","note":"購買並導入任務包時附贈 Lv.1 武器。","source":"https://w.atwiki.jp/edfwb2/pages/21.html"},
    // メガドレインリバーサー
    "w-9d464314": {"method":"box","note":"DLC武器箱：EX03／NORMAL。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":3,"extra":true,"difficulty":"NORMAL"}]},
    // ドレインリバーサーM2
    "w-c41d3ab3": {"method":"box","note":"DLC武器箱：EX03／HARDEST。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":3,"extra":true,"difficulty":"HARDEST"}]},
    // ギガドレインリバーサー
    "w-b6c32612": {"method":"clear","note":"需任務包；IMPOSSIBLE 累計通關 6 個不同任務（本篇與 DLC 合計）。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","clearCount":6},
    // ドレインリバーサーM3
    "w-2bb715": {"method":"box","note":"DLC武器箱：EX03／IMPOSSIBLE。","source":"https://w.atwiki.jp/edfwb2/pages/188.html","missions":[{"number":3,"extra":true,"difficulty":"IMPOSSIBLE"}]}
  }
};

