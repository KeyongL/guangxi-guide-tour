// 地图途经点（F059；F046 扩展为行程页复用）：真实经纬度，按行程顺序补齐路线途经站；
// group 决定归属哪个可开关图层；photo 是弹窗照片占位槽的图注（待站长实拍替换）。
// 首页（index.astro）与行程页（flow-a/flow-b）共享同一份数据，避免同一坐标在多处
// 各抄一份、日后改一处漏改一处（坐标本身已是「真实经纬度」的核实结果，不是随手抄的）。
export type StopGroup = 'coastal' | 'border' | 'both' | 'vietnam' | 'hechi';

export interface Stop {
  name: string;
  lat: number;
  lng: number;
  sub?: string;
  href?: string;
  group: StopGroup;
  photo?: string;
  note?: string;
}

export const stops: Stop[] = [
  { name: 'Nanning 南宁', lat: 22.817, lng: 108.3665, sub: 'Fly-in port · 10-day transit OK', href: '/itineraries/flow-a/', group: 'both', photo: 'Yongjiang riverside' },
  { name: 'Beihai 北海', lat: 21.4733, lng: 109.1209, sub: 'Fly-in port · coast · 2–3 days', href: '/itineraries/flow-a/', group: 'coastal', photo: 'Silver Beach' },
  { name: 'Weizhou Island 涠洲岛', lat: 21.0333, lng: 109.1167, sub: 'Ferry from Beihai · 1–2 days', href: '/guides/weizhou-island-complete-guide/', group: 'coastal', photo: 'Volcanic sea cliffs' },
  { name: 'Fangchenggang 防城港', lat: 21.6867, lng: 108.3547, sub: 'Harbour coast · day stop', href: '/itineraries/flow-a/', group: 'coastal', photo: 'Fishing harbour' },
  { name: 'Dongxing 东兴', lat: 21.5433, lng: 108.0064, sub: 'Border bridge · walk across ~15 min', href: '/itineraries/flow-a/', group: 'coastal', photo: 'Border gate', note: 'Entry here: 30-day list or visa — 10-day transit must fly in' },
  { name: 'Detian Falls 德天瀑布', lat: 22.8564, lng: 106.7204, sub: 'Transnational waterfall · visa required', href: '/guides/detian-waterfall-friendship-pass/', group: 'border', photo: 'Detian waterfall' },
  { name: 'Jingxi 靖西', lat: 23.1347, lng: 106.4173, sub: 'Tongling canyon · visa required', href: '/itineraries/flow-b/', group: 'border', photo: 'Tongling Grand Canyon' },
  { name: 'Baise 百色', lat: 23.9022, lng: 106.6183, sub: 'Karst west hub · visa required', href: '/itineraries/flow-b/', group: 'border', photo: 'Riverside old quarter' },
  { name: 'Leye 乐业', lat: 24.7833, lng: 106.5611, sub: 'Dashiwei sinkholes · visa required', href: '/guides/leye-tiankeng-baise/', group: 'border', photo: 'Dashiwei tiankeng' },
  { name: 'Bama 巴马', lat: 24.1414, lng: 107.2547, sub: 'Longevity karst · caves', href: '/guides/bama-longevity-hechi/', group: 'border', photo: 'Karst valleys' },
  // 河池喀斯特（F061，站长补：河池很多县）：全域 240h 免签可达；县级景点无实地核实攻略，
  // 用百科级事实一句话 + not yet verified，链接 Plan My Trip（不编造具体景点）。坐标为真实县城。
  { name: 'Hechi 河池', lat: 24.696, lng: 108.062, sub: 'Karst-county hub · visa-free', note: 'Gateway to Du\'an, Tian\'e, Nandan', href: '/plan-my-trip/', group: 'hechi' },
  { name: 'Du\'an 都安', lat: 23.932, lng: 108.104, sub: 'Yao karst county · visa-free', note: 'Karst geopark — not yet verified', href: '/plan-my-trip/', group: 'hechi' },
  { name: 'Tian\'e 天峨', lat: 24.995, lng: 107.174, sub: 'Hongshui River 红水河 karst · visa-free', note: 'Longtan gorge — not yet verified', href: '/plan-my-trip/', group: 'hechi' },
  { name: 'Nandan 南丹', lat: 24.979, lng: 107.545, sub: 'White Trouser Yao 白裤瑶 · visa-free', note: 'Yao culture — not yet verified', href: '/plan-my-trip/', group: 'hechi' },
  // 站长补：只加自然风光县（人文景点如刘三姐不加）。环江=世界自然遗产喀斯特，凤山=世界地质公园——头衔是硬事实，具体景点仍挂 not yet verified。
  { name: 'Huanjiang 环江', lat: 24.831, lng: 108.259, sub: 'World Heritage karst 木论 · visa-free', note: 'Mulun old-growth karst — not yet verified', href: '/plan-my-trip/', group: 'hechi' },
  { name: 'Fengshan 凤山', lat: 24.543, lng: 107.048, sub: 'World Geopark · caves & sky-windows 天窗 · visa-free', note: 'Chuanlong karst — not yet verified', href: '/plan-my-trip/', group: 'hechi' },
  // 从越南过来（F060）：时长/班次未实地核实的一律挂 not yet verified；公司名不编造——代订走 Plan My Trip。
  { name: 'Hanoi', lat: 21.0285, lng: 105.8542, sub: 'Buses to the border · from HCMC fly ~2 h', note: 'Bus to Nanning ~8 h · to Móng Cái ~5 h — not yet verified', href: '/plan-my-trip/', group: 'vietnam' },
  { name: 'Ha Long Bay', lat: 20.9517, lng: 107.0805, sub: 'Cruise hub · on the Móng Cái road', note: 'Bus to Móng Cái ~4 h — not yet verified', group: 'vietnam' },
  { name: 'Móng Cái', lat: 21.5333, lng: 107.9667, sub: 'Walk the bridge into Dongxing ~15 min', note: 'Entry: 30-day list or visa — 10-day transit must fly in', href: '/guides/vietnam-to-china-overland/', group: 'vietnam' },
  { name: 'Friendship Pass 友谊关', lat: 21.9743, lng: 106.7146, sub: 'Hanoi–Nanning road crossing', note: 'Entry: 30-day list or visa — 10-day transit must fly in', href: '/guides/detian-waterfall-friendship-pass/', group: 'vietnam' },
];
