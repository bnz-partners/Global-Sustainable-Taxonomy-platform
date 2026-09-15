/* Global Sustainable Taxonomies — AI Taxonomy Advisor (Screen 3)
   NOTE: There is no live AI backend behind the Compare/Country-Specific analysis.
   All "analysis" is a simple, transparent, rule-based keyword match against the
   data compiled in data.js. Results are illustrative only and are clearly
   labelled as such everywhere they appear — this is a UI/UX demonstration, not
   a compliance determination. (The separate "Ask AI" tab does call a real AI
   model via /api/ask once deployed.)

   Response language: fully static/deterministic translation of every label,
   disclaimer, template sentence and sector name — no external call needed, so
   it works whether or not the site is deployed with an AI backend. */

const REGIONS = ["All", "Europe", "Asia-Pacific", "Americas", "Africa", "Middle East"];

const SECTOR_OPTIONS = [
  "Energy",
  "Transport",
  "Buildings & Construction",
  "Manufacturing & Industry",
  "Agriculture & Forestry",
  "Water & Waste Management",
  "ICT & Digital Infrastructure"
];

const CATEGORY_KEYWORDS = {
  "Energy": ["solar", "wind", "renewable", "geothermal", "hydro", "hydropower", "nuclear", "energy storage", "battery storage", "grid", "photovoltaic", "biomass", "power plant"],
  "Transport": ["vehicle", "transport", "rail", "railway", "electric vehicle", "ev charging", "aviation", "shipping", "maritime", "bus", "metro", "freight"],
  "Buildings & Construction": ["building", "construction", "retrofit", "real estate", "residential", "commercial building", "energy efficiency", "insulation", "office"],
  "Manufacturing & Industry": ["manufacturing", "steel", "cement", "chemical", "industrial", "factory", "production line", "hydrogen production", "battery manufacturing"],
  "Agriculture & Forestry": ["agriculture", "farming", "forestry", "afforestation", "reforestation", "land use", "crop", "livestock", "timber"],
  "Water & Waste Management": ["water", "wastewater", "waste", "recycling", "circular economy", "landfill", "sanitation"],
  "ICT & Digital Infrastructure": ["data center", "data centre", "digital", "ict", "software", "cloud computing", "telecom"]
};

/* Predefined economic activities for the Portfolio Comparison mode (and as a
   quick-select aid in the single-activity Compare mode). Labels and keywords
   are kept English-only, consistent with the site's convention that deep
   factual/reference content stays English while interface chrome is translated. */
const ACTIVITY_CATALOG = [
  { id: "solar-power", sector: "Energy", label: "Solar power generation", keywords: ["solar", "photovoltaic", "pv", "solar farm", "solar plant"] },
  { id: "wind-power", sector: "Energy", label: "Wind power generation", keywords: ["wind power", "wind energy", "wind turbine", "wind farm", "offshore wind"] },
  { id: "battery-storage", sector: "Energy", label: "Battery energy storage", keywords: ["battery storage", "energy storage", "grid storage", "storage system"] },
  { id: "green-hydrogen", sector: "Energy", label: "Green hydrogen production", keywords: ["hydrogen", "green hydrogen", "electrolysis", "hydrogen production"] },
  { id: "nuclear-power", sector: "Energy", label: "Nuclear power", keywords: ["nuclear", "nuclear power", "nuclear plant"] },
  { id: "ev-manufacturing", sector: "Transport", label: "Electric vehicle manufacturing", keywords: ["electric vehicle", "battery electric", "zero-emission vehicle", "e-mobility", "ev manufacturing"] },
  { id: "ev-charging", sector: "Transport", label: "EV charging infrastructure", keywords: ["charging infrastructure", "charging station", "ev charging", "charging network"] },
  { id: "rail-transport", sector: "Transport", label: "Rail & mass transit", keywords: ["rail", "railway", "metro", "mass transit", "light rail"] },
  { id: "shipping-aviation", sector: "Transport", label: "Low-emission shipping & aviation", keywords: ["shipping", "maritime", "aviation", "sustainable fuel", "saf", "low-carbon fuel"] },
  { id: "green-buildings", sector: "Buildings & Construction", label: "Green / energy-efficient buildings", keywords: ["green building", "energy-efficient building", "building efficiency", "retrofit", "leed", "breeam"] },
  { id: "new-construction", sector: "Buildings & Construction", label: "Sustainable new construction", keywords: ["sustainable construction", "low-carbon building", "green construction", "new building"] },
  { id: "residential-retrofit", sector: "Buildings & Construction", label: "Residential energy retrofits", keywords: ["residential retrofit", "home insulation", "building renovation", "residential energy"] },
  { id: "battery-manufacturing", sector: "Manufacturing & Industry", label: "Battery manufacturing", keywords: ["battery manufacturing", "battery production", "batteries for electric", "cell manufacturing"] },
  { id: "low-carbon-steel", sector: "Manufacturing & Industry", label: "Low-carbon steel & cement", keywords: ["steel", "cement", "low-carbon manufacturing", "green steel"] },
  { id: "chemicals", sector: "Manufacturing & Industry", label: "Sustainable chemicals production", keywords: ["chemical production", "green chemistry", "chemicals manufacturing"] },
  { id: "semiconductor", sector: "Manufacturing & Industry", label: "Semiconductor / electronics manufacturing", keywords: ["semiconductor", "electronics manufacturing", "chip fabrication", "chip manufacturing"] },
  { id: "sustainable-agriculture", sector: "Agriculture & Forestry", label: "Sustainable agriculture", keywords: ["sustainable agriculture", "agriculture", "farming", "regenerative agriculture"] },
  { id: "forestry", sector: "Agriculture & Forestry", label: "Afforestation & sustainable forestry", keywords: ["forestry", "afforestation", "reforestation", "sustainable forestry"] },
  { id: "livestock", sector: "Agriculture & Forestry", label: "Low-emission livestock", keywords: ["livestock", "cattle", "low-emission farming"] },
  { id: "water-treatment", sector: "Water & Waste Management", label: "Water treatment & supply", keywords: ["water treatment", "water supply", "water management", "desalination"] },
  { id: "waste-management", sector: "Water & Waste Management", label: "Waste management & circular economy", keywords: ["waste management", "circular economy", "recycling", "landfill"] },
  { id: "wastewater", sector: "Water & Waste Management", label: "Wastewater treatment", keywords: ["wastewater", "sewage treatment", "wastewater treatment"] },
  { id: "data-centers", sector: "ICT & Digital Infrastructure", label: "Data centers & digital infrastructure", keywords: ["data centre", "data center", "digital infrastructure", "cloud computing"] },
  { id: "ict-efficiency", sector: "ICT & Digital Infrastructure", label: "Energy-efficient ICT / software", keywords: ["ict", "software", "energy-efficient computing", "digital efficiency"] }
];

const EXAMPLES = {
  compare: [
    "Construction of a new solar photovoltaic power plant",
    "Retrofitting an existing office building to cut energy use by 30%",
    "Manufacturing of batteries for electric vehicles",
    "Expansion of a coal-fired power station"
  ],
  country: [
    "Manufacturing of batteries for electric vehicles",
    "Construction of a new wind farm",
    "Retrofitting a residential building for energy efficiency",
    "Development of a new coal mine"
  ]
};

/* ---------- Languages & i18n ---------- */

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sv", label: "Svenska" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" }
];

const I18N = {
  en: {
    meets: "Meets", partial: "Partial", doesNotMeet: "Does Not Meet",
    colJurisdiction: "Jurisdiction", colStatus: "Status", colKeyCriterion: "Key Criterion", viewLink: "View >",
    aiSummaryHeading: "AI Analysis Summary", exportBtn: "Export", shareBtn: "Share",
    compareDisclaimer: "Simulated illustrative analysis based on simple keyword matching against publicly documented sector coverage — not a legal or regulatory determination. Always confirm against official taxonomy documentation.",
    countryDisclaimer: "Simulated illustrative analysis based on simple keyword matching — not a legal or regulatory determination. Always confirm against official taxonomy documentation.",
    substantialContribution: "Substantial Contribution", dnshLabel: "Do No Significant Harm (DNSH)", minimumSafeguardsLabel: "Minimum Safeguards",
    requiredDocumented: "Required and documented for this taxonomy.", notConfirmed: "Not confirmed in our dataset — check official criteria.",
    additionalDocsHeading: "Additional Documentation Likely Required", viewFullProfile: "View Full Country Profile",
    illustrativeNote: "This is an illustrative demonstration, not a substitute for professional or legal compliance advice.",
    promptBeforeAnalyze: "Please describe an activity before analyzing.",
    emptyPromptCompare: "Enter an activity description and click Screen Activity Criteria to see results.",
    analyzeBtn: "Screen Activity Criteria",
    screeningNotice: "A taxonomy alignment determination requires every layer of criteria to be met: not only the activity criteria, but also the technical screening (recognition) criteria, the exclusion criteria ensuring the activity does no significant harm (DNSH) to the other environmental objectives, and the minimum safeguards covering human rights, labour and cultural heritage. This screening should therefore be understood as a first-pass check against the activity criteria alone, and for a formal taxonomy alignment determination we recommend engaging a qualified professional body.",
    docs: ["Technical screening assessment report", "DNSH compliance declaration", "Minimum safeguards / human rights due diligence statement", "Independent third-party verification (where required by the regulator)"],
    coversTemplate: 'Covers "{sector}" under {taxonomy}{year}.',
    resemblesTemplate: 'Activity resembles a "{category}" category commonly covered by taxonomies, but explicit sector coverage is not confirmed in our dataset for {taxonomy}.',
    uncertainTemplate: "Description did not clearly match a recognised green activity category — classification is uncertain.",
    noneTemplate: "No sustainable finance taxonomy currently in force in this jurisdiction.",
    summaryTemplate: 'Based on a simulated keyword analysis of "{activity}"{sectorPart}, {meets} of {total} reviewed jurisdictions\' published taxonomies explicitly cover this type of activity, {partial} show partial or unconfirmed alignment, and {none} currently have no taxonomy in place.{strongestPart} This summary is illustrative only and should not be relied upon for compliance decisions.',
    sectorPart: " (classified as {sector})", strongestPart: " Strongest matches: {names}.",
    pdfTitleCompare: "AI Taxonomy Advisor — Multi-Country Comparison", pdfTitleCountry: "AI Taxonomy Advisor — Country-Specific Assessment",
    pdfActivity: "Activity", pdfSector: "Sector", pdfRegionFilter: "Region filter", pdfCountry: "Country", pdfResult: "Result",
    pdfCriteria: "Criteria", pdfMet: "Met", pdfNotConfirmedShort: "Not confirmed",
    deepMatchTemplate: "Matches a specific listed activity — \"{activity}\" under {taxonomy}: {criteria}",
    portfolioTabLabel: "Portfolio Comparison", selectActivitiesHeading: "Select the economic activities you invest in",
    analyzeBtnPortfolio: "Screen Portfolio Activities", deepMatchBadge: "Explicit activity match", sectorOnlyBadge: "Sector-level match only", noDataBadge: "No detailed data yet",
    noDetailedDataTemplate: "Detailed activity-level data is not yet available for {taxonomy} in our dataset — check the official source for the exact scope of coverage.",
    portfolioSummaryTemplate: "Across {total} reviewed jurisdictions, {meets} have documented criteria matching at least one of your {n} selected activities, {partial} show sector-level or partial coverage only, and {none} currently have no taxonomy in place.",
    selectActivitiesPrompt: "Select at least one activity before analyzing.", pdfTitlePortfolio: "AI Taxonomy Advisor — Portfolio Comparison",
    pdfActivities: "Selected Activities", activityMatchCount: "{n} of {total} activities",
    sectors: { "Energy": "Energy", "Transport": "Transport", "Buildings & Construction": "Buildings & Construction", "Manufacturing & Industry": "Manufacturing & Industry", "Agriculture & Forestry": "Agriculture & Forestry", "Water & Waste Management": "Water & Waste Management", "ICT & Digital Infrastructure": "ICT & Digital Infrastructure" },
    pageHeading: "AI Taxonomy Advisor",
    pageLede: "Describe an economic activity to see how it may align with sustainable finance taxonomies worldwide. Simulated, illustrative analysis — not a substitute for professional or legal compliance advice.",
    compareTabLabel: "Multi-Country Comparison",
    countryTabLabel: "Country-Specific Advisor",
    askTabLabel: "Ask AI",
    activityDescLabel: "Activity Description",
    sectorClassLabel: "Sector Classification",
    regionFilterLabel: "Region Filter",
    responseLanguageLabel: "Response Language",
    exampleQueriesLabel: "Example Queries",
    autoDetectOption: "Auto-detect from description",
    regions: {"All": "All Regions", "Europe": "Europe", "Asia-Pacific": "Asia-Pacific", "Americas": "Americas", "Africa": "Africa", "Middle East": "Middle East"},
    chatWelcomeAdvisor: "Ask anything about the taxonomies in our dataset — compare countries, ask what a term means, or ask which jurisdictions cover a given sector. Powered by a live AI model once this site is deployed with an API key.",
    askDisclaimerNote: "This tab calls a real AI model through a secure backend (your API key is never in this webpage). If it doesn't respond, this site may not be deployed to Vercel with an API key yet.",
    sendBtn: "Send",
    chatInputPlaceholder: "Ask about any taxonomy… e.g. Compare the EU and South Korea taxonomies"
  },
  sv: {
    meets: "Uppfyller", partial: "Delvis", doesNotMeet: "Uppfyller inte",
    colJurisdiction: "Jurisdiktion", colStatus: "Status", colKeyCriterion: "Huvudkriterium", viewLink: "Visa >",
    aiSummaryHeading: "AI-analyssammanfattning", exportBtn: "Exportera", shareBtn: "Dela",
    compareDisclaimer: "Simulerad, illustrativ analys baserad på enkel nyckelordsmatchning mot offentligt dokumenterad sektortäckning — inte ett juridiskt eller regulatoriskt avgörande. Bekräfta alltid mot officiell taxonomidokumentation.",
    countryDisclaimer: "Simulerad, illustrativ analys baserad på enkel nyckelordsmatchning — inte ett juridiskt eller regulatoriskt avgörande. Bekräfta alltid mot officiell taxonomidokumentation.",
    substantialContribution: "Väsentligt bidrag", dnshLabel: "Ingen betydande skada (DNSH)", minimumSafeguardsLabel: "Minimiskyddsåtgärder",
    requiredDocumented: "Krävs och är dokumenterat för denna taxonomi.", notConfirmed: "Ej bekräftat i vårt dataset — kontrollera officiella kriterier.",
    additionalDocsHeading: "Ytterligare dokumentation som troligen krävs", viewFullProfile: "Visa fullständig landsprofil",
    illustrativeNote: "Detta är en illustrativ demonstration, inte en ersättning för professionell eller juridisk rådgivning om regelefterlevnad.",
    promptBeforeAnalyze: "Beskriv en aktivitet innan du analyserar.",
    emptyPromptCompare: "Ange en aktivitetsbeskrivning och klicka på Granska aktivitetskriterier för att se resultat.",
    analyzeBtn: "Granska aktivitetskriterier",
    screeningNotice: "Ett fastställande av taxonomiförenlighet kräver att samtliga kriterienivåer uppfylls: inte bara aktivitetskriterierna, utan även de tekniska granskningskriterierna, uteslutningskriterierna som säkerställer att verksamheten inte orsakar betydande skada (DNSH) för övriga miljömål, samt minimiskyddsåtgärderna för mänskliga rättigheter, arbetsvillkor och kulturarv. Denna granskning ska därför förstås som en första kontroll enbart mot aktivitetskriterierna, och för ett formellt fastställande rekommenderar vi att anlita ett kvalificerat fackorgan.",
    docs: ["Teknisk granskningsrapport", "DNSH-efterlevnadsdeklaration", "Redogörelse för minimiskyddsåtgärder / mänskliga rättigheter", "Oberoende tredjepartsverifiering (där det krävs av tillsynsmyndigheten)"],
    coversTemplate: 'Omfattar "{sector}" enligt {taxonomy}{year}.',
    resemblesTemplate: 'Aktiviteten liknar kategorin "{category}" som ofta omfattas av taxonomier, men explicit sektortäckning är inte bekräftad i vårt dataset för {taxonomy}.',
    uncertainTemplate: "Beskrivningen matchade inte tydligt en erkänd grön aktivitetskategori — klassificeringen är osäker.",
    noneTemplate: "Ingen taxonomi för hållbar finansiering gäller för närvarande i denna jurisdiktion.",
    summaryTemplate: 'Baserat på en simulerad nyckelordsanalys av "{activity}"{sectorPart} täcker {meets} av {total} granskade jurisdiktioners publicerade taxonomier uttryckligen denna typ av aktivitet, {partial} visar delvis eller obekräftad överensstämmelse, och {none} saknar för närvarande en taxonomi.{strongestPart} Denna sammanfattning är endast illustrativ och bör inte användas som grund för beslut om regelefterlevnad.',
    sectorPart: " (klassificerad som {sector})", strongestPart: " Starkaste träffar: {names}.",
    pdfTitleCompare: "AI Taxonomy Advisor — Jämförelse mellan flera länder", pdfTitleCountry: "AI Taxonomy Advisor — Landsspecifik bedömning",
    pdfActivity: "Aktivitet", pdfSector: "Sektor", pdfRegionFilter: "Regionfilter", pdfCountry: "Land", pdfResult: "Resultat",
    pdfCriteria: "Kriterier", pdfMet: "Uppfyllt", pdfNotConfirmedShort: "Ej bekräftat",
    deepMatchTemplate: "Matchar en specifik listad verksamhet — \"{activity}\" enligt {taxonomy}: {criteria}",
    portfolioTabLabel: "Portföljjämförelse", selectActivitiesHeading: "Välj de ekonomiska verksamheter du investerar i",
    analyzeBtnPortfolio: "Granska portföljaktiviteter", deepMatchBadge: "Uttrycklig aktivitetsträff", sectorOnlyBadge: "Endast sektornivåträff", noDataBadge: "Ingen detaljerad data än",
    noDetailedDataTemplate: "Detaljerad aktivitetsdata är ännu inte tillgänglig för {taxonomy} i vårt dataset — kontrollera den officiella källan för exakt omfattning.",
    portfolioSummaryTemplate: "Av {total} granskade jurisdiktioner har {meets} dokumenterade kriterier som matchar minst en av dina {n} valda verksamheter, {partial} visar endast sektornivå- eller partiell täckning, och {none} saknar för närvarande en taxonomi.",
    selectActivitiesPrompt: "Välj minst en verksamhet innan du analyserar.", pdfTitlePortfolio: "AI Taxonomy Advisor — Portföljjämförelse",
    pdfActivities: "Valda verksamheter", activityMatchCount: "{n} av {total} verksamheter",
    sectors: { "Energy": "Energi", "Transport": "Transport", "Buildings & Construction": "Byggnader & konstruktion", "Manufacturing & Industry": "Tillverkning & industri", "Agriculture & Forestry": "Jord- & skogsbruk", "Water & Waste Management": "Vatten- & avfallshantering", "ICT & Digital Infrastructure": "IKT & digital infrastruktur" },
    pageHeading: "AI Taxonomy Advisor",
    pageLede: "Beskriv en ekonomisk aktivitet för att se hur den kan överensstämma med taxonomier för hållbar finansiering världen över. Simulerad, illustrativ analys — inte en ersättning för professionell eller juridisk rådgivning om regelefterlevnad.",
    compareTabLabel: "Jämförelse mellan flera länder",
    countryTabLabel: "Landsspecifik rådgivare",
    askTabLabel: "Fråga AI",
    activityDescLabel: "Aktivitetsbeskrivning",
    sectorClassLabel: "Sektorklassificering",
    regionFilterLabel: "Regionfilter",
    responseLanguageLabel: "Svarsspråk",
    exampleQueriesLabel: "Exempelfrågor",
    autoDetectOption: "Identifiera automatiskt från beskrivning",
    regions: {"All": "Alla regioner", "Europe": "Europa", "Asia-Pacific": "Asien-Stillahavsregionen", "Americas": "Amerika", "Africa": "Afrika", "Middle East": "Mellanöstern"},
    chatWelcomeAdvisor: "Fråga vad som helst om taxonomierna i vårt dataset — jämför länder, fråga vad en term betyder, eller vilka jurisdiktioner som täcker en viss sektor. Drivs av en riktig AI-modell när denna sajt är driftsatt med en API-nyckel.",
    askDisclaimerNote: "Denna flik anropar en riktig AI-modell via en säker backend (din API-nyckel finns aldrig på denna webbsida). Om den inte svarar kan det bero på att sajten ännu inte är driftsatt på Vercel med en API-nyckel.",
    sendBtn: "Skicka",
    chatInputPlaceholder: "Fråga om vilken taxonomi som helst … t.ex. Jämför EU:s och Sydkoreas taxonomier"
  },
  ko: {
    meets: "충족", partial: "부분 충족", doesNotMeet: "미충족",
    colJurisdiction: "관할권", colStatus: "상태", colKeyCriterion: "핵심 기준", viewLink: "보기 >",
    aiSummaryHeading: "AI 분석 요약", exportBtn: "내보내기", shareBtn: "공유",
    compareDisclaimer: "공개적으로 문서화된 부문 적용 범위에 대한 단순 키워드 매칭을 기반으로 한 시뮬레이션된 예시 분석입니다 — 법적 또는 규제상의 판단이 아닙니다. 항상 공식 택소노미 문서를 통해 확인하십시오.",
    countryDisclaimer: "단순 키워드 매칭을 기반으로 한 시뮬레이션된 예시 분석입니다 — 법적 또는 규제상의 판단이 아닙니다. 항상 공식 택소노미 문서를 통해 확인하십시오.",
    substantialContribution: "실질적 기여", dnshLabel: "중대한 환경피해 방지 원칙 (DNSH)", minimumSafeguardsLabel: "최소 안전장치",
    requiredDocumented: "이 택소노미에서 요구되며 문서화되어 있습니다.", notConfirmed: "데이터셋에서 확인되지 않았습니다 — 공식 기준을 확인하십시오.",
    additionalDocsHeading: "추가로 필요할 수 있는 문서", viewFullProfile: "국가 전체 프로필 보기",
    illustrativeNote: "이는 예시를 위한 시연이며, 전문적이거나 법적인 컴플라이언스 자문을 대체하지 않습니다.",
    promptBeforeAnalyze: "분석하기 전에 활동을 설명해 주세요.",
    emptyPromptCompare: "활동 설명을 입력하고 '활동 기준 판별'을 클릭하여 결과를 확인하세요.",
    analyzeBtn: "활동 기준 판별",
    screeningNotice: "택소노미 적합성 판정은 복합적인 판단기준을 모두 충족해야 이루어집니다. 활동기준뿐 아니라 기술적인 인정기준에 부합해야 하고, 다른 환경목표에 심각한 해를 끼치지 않는(DNSH) 배제기준과 인권·노동·문화재 등 보호기준도 함께 충족해야 합니다. 따라서 본 판별은 1차적인 활동기준 스크리닝 수준으로 이해되어야 하며, 공식적인 택소노미 적합성 판정은 전문기관에 의뢰하기를 권장합니다.",
    docs: ["기술 심사 평가 보고서", "DNSH 준수 선언서", "최소 안전장치 / 인권 실사 진술서", "독립적인 제3자 검증 (규제 기관이 요구하는 경우)"],
    coversTemplate: '{taxonomy}{year}에 따라 "{sector}"을(를) 포함합니다.',
    resemblesTemplate: '이 활동은 택소노미에서 흔히 다루는 "{category}" 범주와 유사하지만, {taxonomy}에 대한 명시적인 부문 적용 범위는 데이터셋에서 확인되지 않았습니다.',
    uncertainTemplate: "설명이 인정된 녹색 활동 범주와 명확히 일치하지 않아 분류가 불확실합니다.",
    noneTemplate: "이 관할권에는 현재 시행 중인 지속가능금융 택소노미가 없습니다.",
    summaryTemplate: '"{activity}"{sectorPart}에 대한 시뮬레이션된 키워드 분석 결과, 검토된 {total}개 관할권 중 {meets}개의 공개된 택소노미가 이러한 유형의 활동을 명시적으로 다루고 있으며, {partial}개는 부분적이거나 확인되지 않은 부합성을 보이고, {none}개는 현재 택소노미가 없습니다.{strongestPart} 이 요약은 예시일 뿐이며 컴플라이언스 결정의 근거로 사용되어서는 안 됩니다.',
    sectorPart: " ({sector}(으)로 분류됨)", strongestPart: " 가장 강한 일치: {names}.",
    pdfTitleCompare: "AI 택소노미 어드바이저 — 다국가 비교", pdfTitleCountry: "AI 택소노미 어드바이저 — 국가별 평가",
    pdfActivity: "활동", pdfSector: "부문", pdfRegionFilter: "지역 필터", pdfCountry: "국가", pdfResult: "결과",
    pdfCriteria: "기준", pdfMet: "충족", pdfNotConfirmedShort: "미확인",
    deepMatchTemplate: "구체적으로 명시된 활동과 일치합니다 — \"{activity}\" ({taxonomy} 기준): {criteria}",
    portfolioTabLabel: "포트폴리오 비교", selectActivitiesHeading: "투자 중인 경제 활동을 선택하세요",
    analyzeBtnPortfolio: "포트폴리오 활동 기준 판별", deepMatchBadge: "명시적 활동 일치", sectorOnlyBadge: "부문 수준 일치만 해당", noDataBadge: "아직 상세 데이터 없음",
    noDetailedDataTemplate: "{taxonomy}에 대한 상세 활동 수준 데이터가 아직 데이터셋에 없습니다 — 정확한 적용 범위는 공식 출처를 확인하십시오.",
    portfolioSummaryTemplate: "검토된 {total}개 관할권 중 {meets}개는 선택하신 {n}개 활동 중 하나 이상과 일치하는 문서화된 기준을 보유하고 있으며, {partial}개는 부문 수준 또는 부분적 적용 범위만 나타내고, {none}개는 현재 택소노미가 없습니다.",
    selectActivitiesPrompt: "분석하기 전에 하나 이상의 활동을 선택하세요.", pdfTitlePortfolio: "AI 택소노미 어드바이저 — 포트폴리오 비교",
    pdfActivities: "선택한 활동", activityMatchCount: "{total}개 중 {n}개 활동",
    sectors: { "Energy": "에너지", "Transport": "교통", "Buildings & Construction": "건물 및 건설", "Manufacturing & Industry": "제조 및 산업", "Agriculture & Forestry": "농업 및 임업", "Water & Waste Management": "수자원 및 폐기물 관리", "ICT & Digital Infrastructure": "ICT 및 디지털 인프라" },
    pageHeading: "AI 택소노미 어드바이저",
    pageLede: "경제 활동을 설명하여 전 세계 지속가능금융 택소노미와의 부합 여부를 확인하세요. 시뮬레이션된 예시 분석이며 — 전문적이거나 법적인 컴플라이언스 자문을 대체하지 않습니다.",
    compareTabLabel: "다국가 비교",
    countryTabLabel: "국가별 어드바이저",
    askTabLabel: "AI에게 질문",
    activityDescLabel: "활동 설명",
    sectorClassLabel: "부문 분류",
    regionFilterLabel: "지역 필터",
    responseLanguageLabel: "응답 언어",
    exampleQueriesLabel: "예시 질문",
    autoDetectOption: "설명에서 자동 감지",
    regions: {"All": "전체 지역", "Europe": "유럽", "Asia-Pacific": "아시아·태평양", "Americas": "아메리카", "Africa": "아프리카", "Middle East": "중동"},
    chatWelcomeAdvisor: "데이터셋에 포함된 택소노미에 대해 무엇이든 물어보세요 — 국가 비교, 용어의 의미, 특정 부문을 다루는 관할권 등을 질문할 수 있습니다. 이 사이트가 API 키와 함께 배포되면 실제 AI 모델이 작동합니다.",
    askDisclaimerNote: "이 탭은 안전한 백엔드를 통해 실제 AI 모델을 호출합니다(API 키는 이 웹페이지에 절대 노출되지 않습니다). 응답이 없다면 이 사이트가 아직 API 키와 함께 Vercel에 배포되지 않았을 수 있습니다.",
    sendBtn: "보내기",
    chatInputPlaceholder: "어떤 택소노미에 대해서든 질문하세요… 예: EU와 한국의 택소노미를 비교해줘"
  },
  es: {
    meets: "Cumple", partial: "Parcial", doesNotMeet: "No cumple",
    colJurisdiction: "Jurisdicción", colStatus: "Estado", colKeyCriterion: "Criterio clave", viewLink: "Ver >",
    aiSummaryHeading: "Resumen del análisis de IA", exportBtn: "Exportar", shareBtn: "Compartir",
    compareDisclaimer: "Análisis simulado e ilustrativo basado en una simple coincidencia de palabras clave con la cobertura sectorial documentada públicamente — no constituye una determinación legal o regulatoria. Confirme siempre con la documentación oficial de la taxonomía.",
    countryDisclaimer: "Análisis simulado e ilustrativo basado en una simple coincidencia de palabras clave — no constituye una determinación legal o regulatoria. Confirme siempre con la documentación oficial de la taxonomía.",
    substantialContribution: "Contribución sustancial", dnshLabel: "No causar daño significativo (DNSH)", minimumSafeguardsLabel: "Salvaguardias mínimas",
    requiredDocumented: "Requerido y documentado para esta taxonomía.", notConfirmed: "No confirmado en nuestro conjunto de datos — consulte los criterios oficiales.",
    additionalDocsHeading: "Documentación adicional probablemente requerida", viewFullProfile: "Ver perfil completo del país",
    illustrativeNote: "Esta es una demostración ilustrativa, no un sustituto del asesoramiento profesional o legal sobre cumplimiento.",
    promptBeforeAnalyze: "Describa una actividad antes de analizar.",
    emptyPromptCompare: "Ingrese una descripción de la actividad y haga clic en Evaluar criterios de actividad para ver los resultados.",
    analyzeBtn: "Evaluar criterios de actividad",
    screeningNotice: "Una determinación de alineación con la taxonomía exige cumplir todos los niveles de criterios: no solo los criterios de actividad, sino también los criterios técnicos de selección, los criterios de exclusión que garantizan que la actividad no causa un perjuicio significativo (DNSH) a los demás objetivos medioambientales, y las garantías mínimas relativas a derechos humanos, trabajo y patrimonio cultural. Por tanto, esta evaluación debe entenderse como una primera verificación únicamente frente a los criterios de actividad, y para una determinación formal recomendamos recurrir a un organismo profesional cualificado.",
    docs: ["Informe de evaluación técnica", "Declaración de cumplimiento DNSH", "Declaración de salvaguardias mínimas / debida diligencia en derechos humanos", "Verificación independiente de terceros (cuando lo exija el regulador)"],
    coversTemplate: 'Cubre "{sector}" según {taxonomy}{year}.',
    resemblesTemplate: 'La actividad se asemeja a una categoría de "{category}" comúnmente cubierta por las taxonomías, pero la cobertura sectorial explícita no está confirmada en nuestro conjunto de datos para {taxonomy}.',
    uncertainTemplate: "La descripción no coincidió claramente con una categoría de actividad verde reconocida — la clasificación es incierta.",
    noneTemplate: "Actualmente no existe una taxonomía de finanzas sostenibles vigente en esta jurisdicción.",
    summaryTemplate: 'Según un análisis simulado de palabras clave de "{activity}"{sectorPart}, {meets} de {total} jurisdicciones revisadas cuentan con taxonomías publicadas que cubren explícitamente este tipo de actividad, {partial} muestran una alineación parcial o no confirmada, y {none} actualmente no tienen taxonomía.{strongestPart} Este resumen es solo ilustrativo y no debe utilizarse como base para decisiones de cumplimiento.',
    sectorPart: " (clasificada como {sector})", strongestPart: " Coincidencias más fuertes: {names}.",
    pdfTitleCompare: "Asesor de Taxonomías IA — Comparación multinacional", pdfTitleCountry: "Asesor de Taxonomías IA — Evaluación por país",
    pdfActivity: "Actividad", pdfSector: "Sector", pdfRegionFilter: "Filtro de región", pdfCountry: "País", pdfResult: "Resultado",
    pdfCriteria: "Criterios", pdfMet: "Cumple", pdfNotConfirmedShort: "No confirmado",
    deepMatchTemplate: "Coincide con una actividad específica listada — \"{activity}\" según {taxonomy}: {criteria}",
    portfolioTabLabel: "Comparación de cartera", selectActivitiesHeading: "Seleccione las actividades económicas en las que invierte",
    analyzeBtnPortfolio: "Evaluar actividades de la cartera", deepMatchBadge: "Coincidencia explícita de actividad", sectorOnlyBadge: "Coincidencia solo a nivel sectorial", noDataBadge: "Aún sin datos detallados",
    noDetailedDataTemplate: "Aún no se dispone de datos detallados a nivel de actividad para {taxonomy} en nuestro conjunto de datos — consulte la fuente oficial para conocer el alcance exacto de la cobertura.",
    portfolioSummaryTemplate: "De {total} jurisdicciones revisadas, {meets} cuentan con criterios documentados que coinciden con al menos una de sus {n} actividades seleccionadas, {partial} muestran cobertura solo a nivel sectorial o parcial, y {none} actualmente no tienen taxonomía.",
    selectActivitiesPrompt: "Seleccione al menos una actividad antes de analizar.", pdfTitlePortfolio: "Asesor de Taxonomías IA — Comparación de cartera",
    pdfActivities: "Actividades seleccionadas", activityMatchCount: "{n} de {total} actividades",
    sectors: { "Energy": "Energía", "Transport": "Transporte", "Buildings & Construction": "Edificios y construcción", "Manufacturing & Industry": "Manufactura e industria", "Agriculture & Forestry": "Agricultura y silvicultura", "Water & Waste Management": "Gestión del agua y residuos", "ICT & Digital Infrastructure": "TIC e infraestructura digital" },
    pageHeading: "Asesor de Taxonomías IA",
    pageLede: "Describa una actividad económica para ver cómo puede alinearse con las taxonomías de finanzas sostenibles en todo el mundo. Análisis simulado e ilustrativo — no sustituye el asesoramiento profesional o legal sobre cumplimiento.",
    compareTabLabel: "Comparación multinacional",
    countryTabLabel: "Asesor específico por país",
    askTabLabel: "Preguntar a la IA",
    activityDescLabel: "Descripción de la Actividad",
    sectorClassLabel: "Clasificación Sectorial",
    regionFilterLabel: "Filtro de región",
    responseLanguageLabel: "Idioma de Respuesta",
    exampleQueriesLabel: "Consultas de Ejemplo",
    autoDetectOption: "Detectar automáticamente según la descripción",
    regions: {"All": "Todas las regiones", "Europe": "Europa", "Asia-Pacific": "Asia-Pacífico", "Americas": "América", "Africa": "África", "Middle East": "Oriente Medio"},
    chatWelcomeAdvisor: "Pregunte lo que quiera sobre las taxonomías de nuestro conjunto de datos — compare países, pregunte qué significa un término o qué jurisdicciones cubren un sector determinado. Impulsado por un modelo de IA real una vez que este sitio esté implementado con una clave de API.",
    askDisclaimerNote: "Esta pestaña llama a un modelo de IA real a través de un backend seguro (su clave de API nunca está en esta página web). Si no responde, es posible que este sitio aún no esté implementado en Vercel con una clave de API.",
    sendBtn: "Enviar",
    chatInputPlaceholder: "Pregunte sobre cualquier taxonomía… p. ej., Compare las taxonomías de la UE y Corea del Sur"
  },
  fr: {
    meets: "Conforme", partial: "Partiel", doesNotMeet: "Non conforme",
    colJurisdiction: "Juridiction", colStatus: "Statut", colKeyCriterion: "Critère clé", viewLink: "Voir >",
    aiSummaryHeading: "Résumé de l'analyse IA", exportBtn: "Exporter", shareBtn: "Partager",
    compareDisclaimer: "Analyse simulée et illustrative basée sur une simple correspondance de mots-clés avec la couverture sectorielle documentée publiquement — il ne s'agit pas d'une détermination juridique ou réglementaire. Vérifiez toujours auprès de la documentation officielle de la taxonomie.",
    countryDisclaimer: "Analyse simulée et illustrative basée sur une simple correspondance de mots-clés — il ne s'agit pas d'une détermination juridique ou réglementaire. Vérifiez toujours auprès de la documentation officielle de la taxonomie.",
    substantialContribution: "Contribution substantielle", dnshLabel: "Ne pas causer de préjudice important (DNSH)", minimumSafeguardsLabel: "Garanties minimales",
    requiredDocumented: "Exigé et documenté pour cette taxonomie.", notConfirmed: "Non confirmé dans notre ensemble de données — vérifiez les critères officiels.",
    additionalDocsHeading: "Documentation supplémentaire probablement requise", viewFullProfile: "Voir le profil complet du pays",
    illustrativeNote: "Il s'agit d'une démonstration illustrative, qui ne remplace pas un conseil professionnel ou juridique en matière de conformité.",
    promptBeforeAnalyze: "Veuillez décrire une activité avant d'analyser.",
    emptyPromptCompare: "Saisissez une description d'activité et cliquez sur Évaluer les critères d'activité pour voir les résultats.",
    analyzeBtn: "Évaluer les critères d'activité",
    screeningNotice: "Une détermination d'alignement sur la taxonomie suppose que tous les niveaux de critères soient satisfaits : non seulement les critères d'activité, mais aussi les critères techniques de sélection, les critères d'exclusion garantissant l'absence de préjudice important (DNSH) aux autres objectifs environnementaux, et les garanties minimales relatives aux droits humains, au travail et au patrimoine culturel. Cette évaluation doit donc être comprise comme une première vérification au regard des seuls critères d'activité, et pour une détermination formelle nous recommandons de faire appel à un organisme professionnel qualifié.",
    docs: ["Rapport d'évaluation technique", "Déclaration de conformité DNSH", "Déclaration relative aux garanties minimales / diligence raisonnable en matière de droits humains", "Vérification indépendante par un tiers (lorsque requise par le régulateur)"],
    coversTemplate: 'Couvre "{sector}" en vertu de {taxonomy}{year}.',
    resemblesTemplate: "L'activité ressemble à une catégorie \"{category}\" généralement couverte par les taxonomies, mais la couverture sectorielle explicite n'est pas confirmée dans notre ensemble de données pour {taxonomy}.",
    uncertainTemplate: "La description ne correspond pas clairement à une catégorie d'activité verte reconnue — la classification est incertaine.",
    noneTemplate: "Aucune taxonomie de finance durable n'est actuellement en vigueur dans cette juridiction.",
    summaryTemplate: 'Sur la base d\'une analyse simulée par mots-clés de "{activity}"{sectorPart}, {meets} des {total} juridictions examinées disposent de taxonomies publiées couvrant explicitement ce type d\'activité, {partial} présentent un alignement partiel ou non confirmé, et {none} n\'ont actuellement aucune taxonomie.{strongestPart} Ce résumé est purement illustratif et ne doit pas être utilisé comme base de décisions de conformité.',
    sectorPart: " (classée comme {sector})", strongestPart: " Meilleures correspondances : {names}.",
    pdfTitleCompare: "Conseiller IA en Taxonomies — Comparaison multi-pays", pdfTitleCountry: "Conseiller IA en Taxonomies — Évaluation par pays",
    pdfActivity: "Activité", pdfSector: "Secteur", pdfRegionFilter: "Filtre régional", pdfCountry: "Pays", pdfResult: "Résultat",
    pdfCriteria: "Critères", pdfMet: "Conforme", pdfNotConfirmedShort: "Non confirmé",
    deepMatchTemplate: "Correspond à une activité spécifique répertoriée — « {activity} » selon {taxonomy} : {criteria}",
    portfolioTabLabel: "Comparaison de portefeuille", selectActivitiesHeading: "Sélectionnez les activités économiques dans lesquelles vous investissez",
    analyzeBtnPortfolio: "Évaluer les activités du portefeuille", deepMatchBadge: "Correspondance explicite d'activité", sectorOnlyBadge: "Correspondance au niveau sectoriel uniquement", noDataBadge: "Pas encore de données détaillées",
    noDetailedDataTemplate: "Des données détaillées au niveau de l'activité ne sont pas encore disponibles pour {taxonomy} dans notre ensemble de données — vérifiez la source officielle pour connaître l'étendue exacte de la couverture.",
    portfolioSummaryTemplate: "Sur {total} juridictions examinées, {meets} disposent de critères documentés correspondant à au moins une de vos {n} activités sélectionnées, {partial} présentent une couverture uniquement sectorielle ou partielle, et {none} n'ont actuellement aucune taxonomie.",
    selectActivitiesPrompt: "Sélectionnez au moins une activité avant d'analyser.", pdfTitlePortfolio: "Conseiller IA en Taxonomies — Comparaison de portefeuille",
    pdfActivities: "Activités sélectionnées", activityMatchCount: "{n} sur {total} activités",
    sectors: { "Energy": "Énergie", "Transport": "Transport", "Buildings & Construction": "Bâtiments et construction", "Manufacturing & Industry": "Fabrication et industrie", "Agriculture & Forestry": "Agriculture et foresterie", "Water & Waste Management": "Gestion de l'eau et des déchets", "ICT & Digital Infrastructure": "TIC et infrastructure numérique" },
    pageHeading: "Conseiller IA en Taxonomies",
    pageLede: "Décrivez une activité économique pour voir comment elle peut s'aligner avec les taxonomies de finance durable dans le monde. Analyse simulée et illustrative — ne remplace pas un conseil professionnel ou juridique en matière de conformité.",
    compareTabLabel: "Comparaison multi-pays",
    countryTabLabel: "Conseiller par pays",
    askTabLabel: "Demander à l'IA",
    activityDescLabel: "Description de l'Activité",
    sectorClassLabel: "Classification Sectorielle",
    regionFilterLabel: "Filtre régional",
    responseLanguageLabel: "Langue de Réponse",
    exampleQueriesLabel: "Exemples de Requêtes",
    autoDetectOption: "Détection automatique à partir de la description",
    regions: {"All": "Toutes les régions", "Europe": "Europe", "Asia-Pacific": "Asie-Pacifique", "Americas": "Amériques", "Africa": "Afrique", "Middle East": "Moyen-Orient"},
    chatWelcomeAdvisor: "Posez toute question sur les taxonomies de notre ensemble de données — comparez des pays, demandez la signification d'un terme, ou quelles juridictions couvrent un secteur donné. Alimenté par un véritable modèle d'IA une fois ce site déployé avec une clé API.",
    askDisclaimerNote: "Cet onglet fait appel à un véritable modèle d'IA via un backend sécurisé (votre clé API n'est jamais présente sur cette page web). S'il ne répond pas, ce site n'est peut-être pas encore déployé sur Vercel avec une clé API.",
    sendBtn: "Envoyer",
    chatInputPlaceholder: "Posez une question sur n'importe quelle taxonomie… par ex. Comparez les taxonomies de l'UE et de la Corée du Sud"
  },
  de: {
    meets: "Erfüllt", partial: "Teilweise", doesNotMeet: "Nicht erfüllt",
    colJurisdiction: "Jurisdiktion", colStatus: "Status", colKeyCriterion: "Hauptkriterium", viewLink: "Ansehen >",
    aiSummaryHeading: "KI-Analysezusammenfassung", exportBtn: "Exportieren", shareBtn: "Teilen",
    compareDisclaimer: "Simulierte, illustrative Analyse auf Basis eines einfachen Schlagwortabgleichs mit öffentlich dokumentierter Sektorabdeckung — keine rechtliche oder regulatorische Feststellung. Bitte stets mit der offiziellen Taxonomie-Dokumentation abgleichen.",
    countryDisclaimer: "Simulierte, illustrative Analyse auf Basis eines einfachen Schlagwortabgleichs — keine rechtliche oder regulatorische Feststellung. Bitte stets mit der offiziellen Taxonomie-Dokumentation abgleichen.",
    substantialContribution: "Wesentlicher Beitrag", dnshLabel: "Vermeidung erheblicher Beeinträchtigungen (DNSH)", minimumSafeguardsLabel: "Mindestschutzvorkehrungen",
    requiredDocumented: "Für diese Taxonomie erforderlich und dokumentiert.", notConfirmed: "In unserem Datensatz nicht bestätigt — offizielle Kriterien prüfen.",
    additionalDocsHeading: "Voraussichtlich zusätzlich erforderliche Dokumentation", viewFullProfile: "Vollständiges Länderprofil ansehen",
    illustrativeNote: "Dies ist eine illustrative Demonstration und kein Ersatz für professionelle oder rechtliche Compliance-Beratung.",
    promptBeforeAnalyze: "Bitte beschreiben Sie eine Aktivität, bevor Sie die Analyse starten.",
    emptyPromptCompare: "Geben Sie eine Aktivitätsbeschreibung ein und klicken Sie auf „Aktivitätskriterien prüfen“, um Ergebnisse zu sehen.",
    analyzeBtn: "Aktivitätskriterien prüfen",
    screeningNotice: "Eine Feststellung der Taxonomiekonformität setzt voraus, dass sämtliche Kriterienebenen erfüllt sind: nicht nur die Tätigkeitskriterien, sondern auch die technischen Bewertungskriterien, die Ausschlusskriterien, die sicherstellen, dass die Tätigkeit den übrigen Umweltzielen keinen erheblichen Schaden zufügt (DNSH), sowie die Mindestschutzmaßnahmen für Menschenrechte, Arbeit und Kulturgüter. Diese Prüfung ist daher nur als erste Kontrolle anhand der Tätigkeitskriterien zu verstehen, und für eine förmliche Feststellung empfehlen wir die Beauftragung einer qualifizierten Fachstelle.",
    docs: ["Technischer Bewertungsbericht", "DNSH-Konformitätserklärung", "Erklärung zu Mindestschutzvorkehrungen / Sorgfaltspflicht in Bezug auf Menschenrechte", "Unabhängige Drittverifizierung (sofern von der Aufsichtsbehörde gefordert)"],
    coversTemplate: 'Umfasst „{sector}" gemäß {taxonomy}{year}.',
    resemblesTemplate: 'Die Aktivität ähnelt einer Kategorie „{category}", die häufig von Taxonomien abgedeckt wird, eine explizite Sektorabdeckung ist für {taxonomy} in unserem Datensatz jedoch nicht bestätigt.',
    uncertainTemplate: "Die Beschreibung stimmte nicht eindeutig mit einer anerkannten grünen Aktivitätskategorie überein — die Klassifizierung ist unsicher.",
    noneTemplate: "In dieser Jurisdiktion ist derzeit keine Taxonomie für nachhaltige Finanzen in Kraft.",
    summaryTemplate: 'Basierend auf einer simulierten Schlagwortanalyse von „{activity}"{sectorPart} decken {meets} von {total} geprüften Jurisdiktionen mit veröffentlichten Taxonomien diese Art von Aktivität ausdrücklich ab, {partial} zeigen eine teilweise oder unbestätigte Übereinstimmung, und {none} haben derzeit keine Taxonomie.{strongestPart} Diese Zusammenfassung dient nur zur Veranschaulichung und sollte nicht als Grundlage für Compliance-Entscheidungen verwendet werden.',
    sectorPart: " (klassifiziert als {sector})", strongestPart: " Stärkste Übereinstimmungen: {names}.",
    pdfTitleCompare: "KI-Taxonomie-Berater — Ländervergleich", pdfTitleCountry: "KI-Taxonomie-Berater — Länderspezifische Bewertung",
    pdfActivity: "Aktivität", pdfSector: "Sektor", pdfRegionFilter: "Regionsfilter", pdfCountry: "Land", pdfResult: "Ergebnis",
    pdfCriteria: "Kriterien", pdfMet: "Erfüllt", pdfNotConfirmedShort: "Nicht bestätigt",
    deepMatchTemplate: "Entspricht einer konkret aufgeführten Tätigkeit — \"{activity}\" gemäß {taxonomy}: {criteria}",
    portfolioTabLabel: "Portfoliovergleich", selectActivitiesHeading: "Wählen Sie die wirtschaftlichen Tätigkeiten aus, in die Sie investieren",
    analyzeBtnPortfolio: "Portfolio-Aktivitäten prüfen", deepMatchBadge: "Explizite Aktivitätsübereinstimmung", sectorOnlyBadge: "Nur Übereinstimmung auf Sektorebene", noDataBadge: "Noch keine detaillierten Daten",
    noDetailedDataTemplate: "Detaillierte Daten auf Aktivitätsebene sind für {taxonomy} in unserem Datensatz noch nicht verfügbar — prüfen Sie die offizielle Quelle für den genauen Umfang der Abdeckung.",
    portfolioSummaryTemplate: "Von {total} geprüften Jurisdiktionen verfügen {meets} über dokumentierte Kriterien, die mit mindestens einer Ihrer {n} ausgewählten Aktivitäten übereinstimmen, {partial} zeigen nur eine Abdeckung auf Sektorebene oder teilweise, und {none} haben derzeit keine Taxonomie.",
    selectActivitiesPrompt: "Wählen Sie mindestens eine Aktivität aus, bevor Sie analysieren.", pdfTitlePortfolio: "KI-Taxonomie-Berater — Portfoliovergleich",
    pdfActivities: "Ausgewählte Aktivitäten", activityMatchCount: "{n} von {total} Aktivitäten",
    sectors: { "Energy": "Energie", "Transport": "Verkehr", "Buildings & Construction": "Gebäude & Bauwesen", "Manufacturing & Industry": "Fertigung & Industrie", "Agriculture & Forestry": "Land- & Forstwirtschaft", "Water & Waste Management": "Wasser- & Abfallwirtschaft", "ICT & Digital Infrastructure": "IKT & digitale Infrastruktur" },
    pageHeading: "KI-Taxonomie-Berater",
    pageLede: "Beschreiben Sie eine wirtschaftliche Tätigkeit, um zu sehen, wie sie mit Taxonomien für nachhaltige Finanzen weltweit übereinstimmen könnte. Simulierte, illustrative Analyse — kein Ersatz für professionelle oder rechtliche Compliance-Beratung.",
    compareTabLabel: "Ländervergleich",
    countryTabLabel: "Länderspezifischer Berater",
    askTabLabel: "KI fragen",
    activityDescLabel: "Tätigkeitsbeschreibung",
    sectorClassLabel: "Sektorklassifizierung",
    regionFilterLabel: "Regionsfilter",
    responseLanguageLabel: "Antwortsprache",
    exampleQueriesLabel: "Beispielanfragen",
    autoDetectOption: "Automatisch aus Beschreibung erkennen",
    regions: {"All": "Alle Regionen", "Europe": "Europa", "Asia-Pacific": "Asien-Pazifik", "Americas": "Amerika", "Africa": "Afrika", "Middle East": "Naher Osten"},
    chatWelcomeAdvisor: "Stellen Sie beliebige Fragen zu den Taxonomien in unserem Datensatz — vergleichen Sie Länder, fragen Sie nach der Bedeutung eines Begriffs oder welche Jurisdiktionen einen bestimmten Sektor abdecken. Wird von einem echten KI-Modell unterstützt, sobald diese Website mit einem API-Schlüssel bereitgestellt ist.",
    askDisclaimerNote: "Dieser Tab ruft über ein sicheres Backend ein echtes KI-Modell auf (Ihr API-Schlüssel befindet sich niemals auf dieser Webseite). Wenn keine Antwort erfolgt, ist diese Website möglicherweise noch nicht mit einem API-Schlüssel auf Vercel bereitgestellt.",
    sendBtn: "Senden",
    chatInputPlaceholder: "Fragen Sie zu einer beliebigen Taxonomie… z. B. Vergleichen Sie die Taxonomien der EU und Südkoreas"
  },
  ja: {
    meets: "適合", partial: "部分的適合", doesNotMeet: "不適合",
    colJurisdiction: "法域", colStatus: "ステータス", colKeyCriterion: "主要基準", viewLink: "詳細 >",
    aiSummaryHeading: "AI分析サマリー", exportBtn: "エクスポート", shareBtn: "共有",
    compareDisclaimer: "公開されている分野カバレッジ情報に基づく単純なキーワード照合によるシミュレーションの例示的分析です — 法的または規制上の判断ではありません。必ず公式のタクソノミー文書で確認してください。",
    countryDisclaimer: "単純なキーワード照合によるシミュレーションの例示的分析です — 法的または規制上の判断ではありません。必ず公式のタクソノミー文書で確認してください。",
    substantialContribution: "実質的な貢献", dnshLabel: "重大な害を及ぼさないこと (DNSH)", minimumSafeguardsLabel: "最低限のセーフガード",
    requiredDocumented: "このタクソノミーで要求され、文書化されています。", notConfirmed: "当データセットでは確認されていません — 公式基準をご確認ください。",
    additionalDocsHeading: "追加で必要となる可能性のある文書", viewFullProfile: "国の詳細プロフィールを見る",
    illustrativeNote: "これは例示的なデモンストレーションであり、専門的または法的なコンプライアンス助言に代わるものではありません。",
    promptBeforeAnalyze: "分析する前に活動内容を入力してください。",
    emptyPromptCompare: "活動内容を入力し、「活動基準の判別」をクリックして結果を確認してください。",
    analyzeBtn: "活動基準の判別",
    screeningNotice: "タクソノミー適合の判定は、すべての判断基準を満たしてはじめて成立します。活動基準だけでなく、技術的な認定基準に適合し、さらに他の環境目標に重大な害を与えない(DNSH)という除外基準、および人権・労働・文化財などの保護基準も満たす必要があります。したがって本判別は一次的な活動基準スクリーニングの水準として理解されるべきであり、正式なタクソノミー適合判定は専門機関へのご依頼を推奨します。",
    docs: ["技術審査評価報告書", "DNSH遵守宣言書", "最低限のセーフガード／人権デューデリジェンス声明", "独立した第三者による検証（規制当局が求める場合）"],
    coversTemplate: '{taxonomy}{year}のもとで「{sector}」を対象としています。',
    resemblesTemplate: 'この活動はタクソノミーで一般的に対象とされる「{category}」カテゴリーに類似していますが、{taxonomy}における明示的な分野カバレッジは当データセットでは確認されていません。',
    uncertainTemplate: "説明が認識済みのグリーン活動カテゴリーと明確に一致しなかったため、分類は不確実です。",
    noneTemplate: "この法域には現在施行されているサステナブルファイナンス・タクソノミーはありません。",
    summaryTemplate: '「{activity}」{sectorPart}のシミュレーションによるキーワード分析に基づくと、検討対象の{total}法域のうち{meets}法域の公開タクソノミーがこの種の活動を明示的に対象としており、{partial}法域は部分的または未確認の適合を示し、{none}法域には現在タクソノミーがありません。{strongestPart}この要約はあくまで例示であり、コンプライアンス上の意思決定の根拠とすべきではありません。',
    sectorPart: "（「{sector}」に分類）", strongestPart: " 最も強い一致：{names}。",
    pdfTitleCompare: "AIタクソノミー・アドバイザー — 多国間比較", pdfTitleCountry: "AIタクソノミー・アドバイザー — 国別評価",
    pdfActivity: "活動", pdfSector: "分野", pdfRegionFilter: "地域フィルター", pdfCountry: "国", pdfResult: "結果",
    pdfCriteria: "基準", pdfMet: "適合", pdfNotConfirmedShort: "未確認",
    deepMatchTemplate: "具体的に記載された活動と一致します — 「{activity}」（{taxonomy}に基づく）：{criteria}",
    portfolioTabLabel: "ポートフォリオ比較", selectActivitiesHeading: "投資している経済活動を選択してください",
    analyzeBtnPortfolio: "ポートフォリオ活動の判別", deepMatchBadge: "明示的な活動一致", sectorOnlyBadge: "分野レベルの一致のみ", noDataBadge: "詳細データはまだありません",
    noDetailedDataTemplate: "{taxonomy}の詳細な活動レベルのデータは当データセットにまだありません — 正確な適用範囲は公式情報源をご確認ください。",
    portfolioSummaryTemplate: "検討対象の{total}法域のうち、{meets}法域は選択された{n}件の活動の少なくとも1つと一致する文書化された基準を有しており、{partial}法域は分野レベルまたは部分的な適用範囲のみを示し、{none}法域には現在タクソノミーがありません。",
    selectActivitiesPrompt: "分析する前に少なくとも1つの活動を選択してください。", pdfTitlePortfolio: "AIタクソノミー・アドバイザー — ポートフォリオ比較",
    pdfActivities: "選択した活動", activityMatchCount: "{total}件中{n}件の活動",
    sectors: { "Energy": "エネルギー", "Transport": "運輸", "Buildings & Construction": "建築・建設", "Manufacturing & Industry": "製造業・産業", "Agriculture & Forestry": "農業・林業", "Water & Waste Management": "水・廃棄物管理", "ICT & Digital Infrastructure": "ICT・デジタルインフラ" },
    pageHeading: "AIタクソノミー・アドバイザー",
    pageLede: "経済活動を説明して、世界各国のサステナブルファイナンス・タクソノミーとの整合性を確認してください。シミュレーションによる例示的な分析であり — 専門的または法的なコンプライアンス助言に代わるものではありません。",
    compareTabLabel: "多国間比較",
    countryTabLabel: "国別アドバイザー",
    askTabLabel: "AIに質問",
    activityDescLabel: "活動内容",
    sectorClassLabel: "分野分類",
    regionFilterLabel: "地域フィルター",
    responseLanguageLabel: "回答言語",
    exampleQueriesLabel: "質問例",
    autoDetectOption: "説明から自動検出",
    regions: {"All": "すべての地域", "Europe": "ヨーロッパ", "Asia-Pacific": "アジア太平洋", "Americas": "南北アメリカ", "Africa": "アフリカ", "Middle East": "中東"},
    chatWelcomeAdvisor: "当データセットのタクソノミーについて何でもご質問ください — 国同士の比較、用語の意味、特定分野を対象とする法域などについてお尋ねいただけます。このサイトがAPIキー付きでデプロイされると、実際のAIモデルが動作します。",
    askDisclaimerNote: "このタブは安全なバックエンドを通じて実際のAIモデルを呼び出します（APIキーがこのウェブページに含まれることはありません）。応答がない場合、このサイトはまだAPIキー付きでVercelにデプロイされていない可能性があります。",
    sendBtn: "送信",
    chatInputPlaceholder: "任意のタクソノミーについて質問してください…例：EUと韓国のタクソノミーを比較して"
  },
  zh: {
    meets: "符合", partial: "部分符合", doesNotMeet: "不符合",
    colJurisdiction: "司法辖区", colStatus: "状态", colKeyCriterion: "关键标准", viewLink: "查看 >",
    aiSummaryHeading: "AI 分析摘要", exportBtn: "导出", shareBtn: "分享",
    compareDisclaimer: "基于对公开记录的行业覆盖范围进行简单关键词匹配的模拟性示例分析 — 并非法律或监管认定。请始终以官方分类标准文件为准。",
    countryDisclaimer: "基于简单关键词匹配的模拟性示例分析 — 并非法律或监管认定。请始终以官方分类标准文件为准。",
    substantialContribution: "实质性贡献", dnshLabel: "不造成重大损害 (DNSH)", minimumSafeguardsLabel: "最低限度保障措施",
    requiredDocumented: "该分类标准要求并已记录。", notConfirmed: "我们的数据集中未确认 — 请查阅官方标准。",
    additionalDocsHeading: "可能需要的其他文件", viewFullProfile: "查看完整国家概况",
    illustrativeNote: "这是一个示例性演示，不能替代专业或法律合规建议。",
    promptBeforeAnalyze: "请在分析前描述一项活动。",
    emptyPromptCompare: "输入活动描述并点击「活动标准判别」以查看结果。",
    analyzeBtn: "活动标准判别",
    screeningNotice: "分类标准符合性判定需要同时满足全部判断标准：不仅是活动标准，还须符合技术性的认定标准，以及确保不对其他环境目标造成重大损害（DNSH）的排除标准，和涵盖人权、劳工、文化遗产等的保护标准。因此本判别应理解为仅针对活动标准的初步筛查，正式的分类标准符合性判定建议委托专业机构进行。",
    docs: ["技术筛选评估报告", "DNSH 合规声明", "最低限度保障措施／人权尽职调查声明", "独立第三方核查（如监管机构要求）"],
    coversTemplate: '根据{taxonomy}{year}，涵盖"{sector}"。',
    resemblesTemplate: '该活动类似于分类标准通常涵盖的"{category}"类别，但我们的数据集中尚未确认{taxonomy}对该行业的明确覆盖。',
    uncertainTemplate: "该描述与已认可的绿色活动类别不完全匹配 — 分类结果不确定。",
    noneTemplate: "该司法辖区目前没有生效的可持续金融分类标准。",
    summaryTemplate: '基于对"{activity}"{sectorPart}的模拟关键词分析，在审查的{total}个司法辖区中，有{meets}个已发布的分类标准明确涵盖此类活动，{partial}个显示部分或未确认的符合性，{none}个目前尚无分类标准。{strongestPart}本摘要仅供参考，不应作为合规决策的依据。',
    sectorPart: "（归类为{sector}）", strongestPart: " 最匹配项：{names}。",
    pdfTitleCompare: "AI 分类标准顾问 — 多国比较", pdfTitleCountry: "AI 分类标准顾问 — 国别评估",
    pdfActivity: "活动", pdfSector: "行业", pdfRegionFilter: "地区筛选", pdfCountry: "国家", pdfResult: "结果",
    pdfCriteria: "标准", pdfMet: "符合", pdfNotConfirmedShort: "未确认",
    deepMatchTemplate: "与具体列出的活动相匹配 — “{activity}”（依据{taxonomy}）：{criteria}",
    portfolioTabLabel: "投资组合比较", selectActivitiesHeading: "选择您所投资的经济活动",
    analyzeBtnPortfolio: "投资组合活动判别", deepMatchBadge: "明确活动匹配", sectorOnlyBadge: "仅行业层面匹配", noDataBadge: "尚无详细数据",
    noDetailedDataTemplate: "我们的数据集中尚无{taxonomy}的详细活动层面数据 — 请查阅官方来源以了解确切的覆盖范围。",
    portfolioSummaryTemplate: "在审查的{total}个司法辖区中，{meets}个拥有与您所选{n}项活动中至少一项相匹配的书面标准，{partial}个仅显示行业层面或部分覆盖，{none}个目前尚无分类标准。",
    selectActivitiesPrompt: "请至少选择一项活动后再进行分析。", pdfTitlePortfolio: "AI 分类标准顾问 — 投资组合比较",
    pdfActivities: "已选活动", activityMatchCount: "{total}项活动中的{n}项",
    sectors: { "Energy": "能源", "Transport": "交通运输", "Buildings & Construction": "建筑与施工", "Manufacturing & Industry": "制造业与工业", "Agriculture & Forestry": "农业与林业", "Water & Waste Management": "水与废物管理", "ICT & Digital Infrastructure": "信息通信技术与数字基础设施" },
    pageHeading: "AI 分类标准顾问",
    pageLede: "描述一项经济活动，以了解其可能如何符合全球可持续金融分类标准。这是模拟性示例分析 — 不能替代专业或法律合规建议。",
    compareTabLabel: "多国比较",
    countryTabLabel: "国别顾问",
    askTabLabel: "询问 AI",
    activityDescLabel: "活动描述",
    sectorClassLabel: "行业分类",
    regionFilterLabel: "地区筛选",
    responseLanguageLabel: "回复语言",
    exampleQueriesLabel: "示例查询",
    autoDetectOption: "根据描述自动检测",
    regions: {"All": "所有地区", "Europe": "欧洲", "Asia-Pacific": "亚太地区", "Americas": "美洲", "Africa": "非洲", "Middle East": "中东"},
    chatWelcomeAdvisor: "可以询问关于我们数据集中分类标准的任何问题 — 比较国家、询问某个术语的含义，或询问哪些司法辖区涵盖特定行业。一旦本网站使用 API 密钥部署，将由真实的 AI 模型提供支持。",
    askDisclaimerNote: "此标签页通过安全的后端调用真实的 AI 模型（您的 API 密钥绝不会出现在此网页中）。如果没有响应，可能是此网站尚未使用 API 密钥部署到 Vercel。",
    sendBtn: "发送",
    chatInputPlaceholder: "询问任何分类标准…例如：比较欧盟和韩国的分类标准"
  },
  ar: {
    meets: "مستوفٍ", partial: "جزئي", doesNotMeet: "غير مستوفٍ",
    colJurisdiction: "الولاية القضائية", colStatus: "الحالة", colKeyCriterion: "المعيار الرئيسي", viewLink: "عرض >",
    aiSummaryHeading: "ملخص تحليل الذكاء الاصطناعي", exportBtn: "تصدير", shareBtn: "مشاركة",
    compareDisclaimer: "تحليل توضيحي محاكى يعتمد على مطابقة كلمات مفتاحية بسيطة مقابل التغطية القطاعية الموثقة علنًا — وليس قرارًا قانونيًا أو تنظيميًا. يُرجى دائمًا التأكيد من خلال وثائق التصنيف الرسمية.",
    countryDisclaimer: "تحليل توضيحي محاكى يعتمد على مطابقة كلمات مفتاحية بسيطة — وليس قرارًا قانونيًا أو تنظيميًا. يُرجى دائمًا التأكيد من خلال وثائق التصنيف الرسمية.",
    substantialContribution: "مساهمة جوهرية", dnshLabel: "عدم الإضرار الجسيم (DNSH)", minimumSafeguardsLabel: "الضمانات الدنيا",
    requiredDocumented: "مطلوب وموثّق لهذا التصنيف.", notConfirmed: "غير مؤكَّد في مجموعة بياناتنا — يُرجى مراجعة المعايير الرسمية.",
    additionalDocsHeading: "وثائق إضافية قد تكون مطلوبة", viewFullProfile: "عرض الملف الكامل للبلد",
    illustrativeNote: "هذا عرض توضيحي، وليس بديلاً عن الاستشارة المهنية أو القانونية بشأن الامتثال.",
    promptBeforeAnalyze: "يُرجى وصف نشاط قبل التحليل.",
    emptyPromptCompare: "أدخل وصف النشاط وانقر على فحص معايير النشاط لعرض النتائج.",
    analyzeBtn: "فحص معايير النشاط",
    screeningNotice: "يتطلب تحديد التوافق مع التصنيف استيفاء جميع مستويات المعايير: ليس معايير النشاط فحسب، بل أيضاً معايير الفحص التقني، ومعايير الاستبعاد التي تضمن عدم إلحاق ضرر جسيم (DNSH) بالأهداف البيئية الأخرى، والضمانات الدنيا المتعلقة بحقوق الإنسان والعمل والتراث الثقافي. لذا ينبغي فهم هذا الفحص على أنه تدقيق أولي مقابل معايير النشاط وحدها، ونوصي بالاستعانة بجهة مهنية مؤهلة للحصول على تحديد رسمي.",
    docs: ["تقرير التقييم الفني", "إقرار الامتثال لمبدأ عدم الإضرار الجسيم (DNSH)", "إقرار الضمانات الدنيا / العناية الواجبة بحقوق الإنسان", "تحقق مستقل من طرف ثالث (عند طلب الجهة الرقابية ذلك)"],
    coversTemplate: 'يغطي "{sector}" بموجب {taxonomy}{year}.',
    resemblesTemplate: 'يشبه هذا النشاط فئة "{category}" التي تغطيها التصنيفات عادةً، لكن التغطية القطاعية الصريحة غير مؤكدة في مجموعة بياناتنا لـ {taxonomy}.',
    uncertainTemplate: "لم يتطابق الوصف بوضوح مع فئة نشاط أخضر معترف بها — التصنيف غير مؤكد.",
    noneTemplate: "لا يوجد حاليًا تصنيف تمويل مستدام ساري في هذه الولاية القضائية.",
    summaryTemplate: 'استنادًا إلى تحليل محاكى للكلمات المفتاحية لـ "{activity}"{sectorPart}، فإن {meets} من أصل {total} ولاية قضائية تمت مراجعتها لديها تصنيفات منشورة تغطي صراحةً هذا النوع من النشاط، بينما تُظهر {partial} توافقًا جزئيًا أو غير مؤكد، ولا تملك {none} حاليًا أي تصنيف.{strongestPart} هذا الملخص توضيحي فقط ولا ينبغي الاعتماد عليه في قرارات الامتثال.',
    sectorPart: " (مصنَّف كـ {sector})", strongestPart: " أقوى التطابقات: {names}.",
    pdfTitleCompare: "مستشار التصنيف بالذكاء الاصطناعي — مقارنة بين عدة دول", pdfTitleCountry: "مستشار التصنيف بالذكاء الاصطناعي — تقييم خاص بالبلد",
    pdfActivity: "النشاط", pdfSector: "القطاع", pdfRegionFilter: "تصفية حسب المنطقة", pdfCountry: "البلد", pdfResult: "النتيجة",
    pdfCriteria: "المعايير", pdfMet: "مستوفٍ", pdfNotConfirmedShort: "غير مؤكد",
    deepMatchTemplate: "يطابق نشاطًا محددًا مدرجًا — \"{activity}\" بموجب {taxonomy}: {criteria}",
    portfolioTabLabel: "مقارنة المحفظة", selectActivitiesHeading: "اختر الأنشطة الاقتصادية التي تستثمر فيها",
    analyzeBtnPortfolio: "فحص أنشطة المحفظة", deepMatchBadge: "تطابق صريح للنشاط", sectorOnlyBadge: "تطابق على مستوى القطاع فقط", noDataBadge: "لا توجد بيانات تفصيلية بعد",
    noDetailedDataTemplate: "لا تتوفر بيانات تفصيلية على مستوى النشاط لـ {taxonomy} في مجموعة بياناتنا بعد — يُرجى مراجعة المصدر الرسمي لمعرفة نطاق التغطية بدقة.",
    portfolioSummaryTemplate: "من بين {total} ولاية قضائية تمت مراجعتها، لدى {meets} معايير موثقة تطابق واحدًا على الأقل من أنشطتك المختارة البالغ عددها {n}، بينما تُظهر {partial} تغطية على مستوى القطاع أو جزئية فقط، ولا تملك {none} حاليًا أي تصنيف.",
    selectActivitiesPrompt: "اختر نشاطًا واحدًا على الأقل قبل التحليل.", pdfTitlePortfolio: "مستشار التصنيف بالذكاء الاصطناعي — مقارنة المحفظة",
    pdfActivities: "الأنشطة المختارة", activityMatchCount: "{n} من أصل {total} نشاطًا",
    sectors: { "Energy": "الطاقة", "Transport": "النقل", "Buildings & Construction": "المباني والتشييد", "Manufacturing & Industry": "التصنيع والصناعة", "Agriculture & Forestry": "الزراعة والحراجة", "Water & Waste Management": "إدارة المياه والنفايات", "ICT & Digital Infrastructure": "تقنية المعلومات والاتصالات والبنية التحتية الرقمية" },
    pageHeading: "مستشار التصنيف بالذكاء الاصطناعي",
    pageLede: "صف نشاطًا اقتصاديًا لمعرفة مدى توافقه مع تصنيفات التمويل المستدام حول العالم. تحليل توضيحي محاكى — وليس بديلاً عن الاستشارة المهنية أو القانونية بشأن الامتثال.",
    compareTabLabel: "مقارنة بين عدة دول",
    countryTabLabel: "مستشار خاص بالبلد",
    askTabLabel: "اسأل الذكاء الاصطناعي",
    activityDescLabel: "وصف النشاط",
    sectorClassLabel: "التصنيف القطاعي",
    regionFilterLabel: "تصفية حسب المنطقة",
    responseLanguageLabel: "لغة الرد",
    exampleQueriesLabel: "أمثلة على الاستفسارات",
    autoDetectOption: "الاكتشاف التلقائي من الوصف",
    regions: {"All": "جميع المناطق", "Europe": "أوروبا", "Asia-Pacific": "آسيا والمحيط الهادئ", "Americas": "الأمريكتان", "Africa": "أفريقيا", "Middle East": "الشرق الأوسط"},
    chatWelcomeAdvisor: "اسأل أي شيء عن التصنيفات الموجودة في مجموعة بياناتنا — قارن بين الدول، اسأل عن معنى مصطلح ما، أو استفسر عن الولايات القضائية التي تغطي قطاعًا معينًا. يعمل بواسطة نموذج ذكاء اصطناعي حقيقي بمجرد نشر هذا الموقع بمفتاح API.",
    askDisclaimerNote: "تستدعي هذه العلامة نموذج ذكاء اصطناعي حقيقيًا عبر خلفية آمنة (مفتاح API الخاص بك لا يوجد أبدًا في هذه الصفحة). إذا لم يستجب، فقد يكون هذا الموقع لم يُنشر بعد على Vercel بمفتاح API.",
    sendBtn: "إرسال",
    chatInputPlaceholder: "اسأل عن أي تصنيف… على سبيل المثال، قارن بين تصنيفي الاتحاد الأوروبي وكوريا الجنوبية"
  },
  pt: {
    meets: "Atende", partial: "Parcial", doesNotMeet: "Não Atende",
    colJurisdiction: "Jurisdição", colStatus: "Status", colKeyCriterion: "Critério Principal", viewLink: "Ver >",
    aiSummaryHeading: "Resumo da Análise de IA", exportBtn: "Exportar", shareBtn: "Compartilhar",
    compareDisclaimer: "Análise simulada e ilustrativa baseada em correspondência simples de palavras-chave com a cobertura setorial documentada publicamente — não constitui uma determinação legal ou regulatória. Sempre confirme com a documentação oficial da taxonomia.",
    countryDisclaimer: "Análise simulada e ilustrativa baseada em correspondência simples de palavras-chave — não constitui uma determinação legal ou regulatória. Sempre confirme com a documentação oficial da taxonomia.",
    substantialContribution: "Contribuição Substancial", dnshLabel: "Não Causar Dano Significativo (DNSH)", minimumSafeguardsLabel: "Salvaguardas Mínimas",
    requiredDocumented: "Exigido e documentado para esta taxonomia.", notConfirmed: "Não confirmado em nosso conjunto de dados — verifique os critérios oficiais.",
    additionalDocsHeading: "Documentação Adicional Provavelmente Necessária", viewFullProfile: "Ver Perfil Completo do País",
    illustrativeNote: "Esta é uma demonstração ilustrativa, não um substituto para aconselhamento profissional ou jurídico sobre conformidade.",
    promptBeforeAnalyze: "Descreva uma atividade antes de analisar.",
    emptyPromptCompare: "Insira uma descrição da atividade e clique em Avaliar critérios de atividade para ver os resultados.",
    analyzeBtn: "Avaliar critérios de atividade",
    screeningNotice: "Uma determinação de alinhamento com a taxonomia exige o cumprimento de todos os níveis de critérios: não apenas os critérios de atividade, mas também os critérios técnicos de seleção, os critérios de exclusão que asseguram que a atividade não causa dano significativo (DNSH) aos demais objetivos ambientais, e as salvaguardas mínimas relativas a direitos humanos, trabalho e património cultural. Esta avaliação deve, portanto, ser entendida como uma primeira verificação apenas face aos critérios de atividade, e para uma determinação formal recomendamos recorrer a um organismo profissional qualificado.",
    docs: ["Relatório de avaliação técnica", "Declaração de conformidade DNSH", "Declaração de salvaguardas mínimas / diligência em direitos humanos", "Verificação independente por terceiros (quando exigido pelo regulador)"],
    coversTemplate: 'Cobre "{sector}" sob {taxonomy}{year}.',
    resemblesTemplate: 'A atividade se assemelha a uma categoria "{category}" comumente coberta por taxonomias, mas a cobertura setorial explícita não está confirmada em nosso conjunto de dados para {taxonomy}.',
    uncertainTemplate: "A descrição não correspondeu claramente a uma categoria de atividade verde reconhecida — a classificação é incerta.",
    noneTemplate: "Nenhuma taxonomia de finanças sustentáveis está atualmente em vigor nesta jurisdição.",
    summaryTemplate: 'Com base em uma análise simulada de palavras-chave de "{activity}"{sectorPart}, {meets} de {total} jurisdições revisadas têm taxonomias publicadas que cobrem explicitamente esse tipo de atividade, {partial} mostram alinhamento parcial ou não confirmado, e {none} atualmente não têm taxonomia.{strongestPart} Este resumo é apenas ilustrativo e não deve ser utilizado como base para decisões de conformidade.',
    sectorPart: " (classificada como {sector})", strongestPart: " Correspondências mais fortes: {names}.",
    pdfTitleCompare: "Consultor de IA em Taxonomias — Comparação Multinacional", pdfTitleCountry: "Consultor de IA em Taxonomias — Avaliação por País",
    pdfActivity: "Atividade", pdfSector: "Setor", pdfRegionFilter: "Filtro de Região", pdfCountry: "País", pdfResult: "Resultado",
    pdfCriteria: "Critérios", pdfMet: "Atendido", pdfNotConfirmedShort: "Não confirmado",
    deepMatchTemplate: "Corresponde a uma atividade específica listada — \"{activity}\" sob {taxonomy}: {criteria}",
    portfolioTabLabel: "Comparação de Portfólio", selectActivitiesHeading: "Selecione as atividades econômicas em que você investe",
    analyzeBtnPortfolio: "Avaliar atividades da carteira", deepMatchBadge: "Correspondência explícita de atividade", sectorOnlyBadge: "Correspondência apenas no nível setorial", noDataBadge: "Ainda sem dados detalhados",
    noDetailedDataTemplate: "Dados detalhados em nível de atividade ainda não estão disponíveis para {taxonomy} em nosso conjunto de dados — verifique a fonte oficial para o escopo exato da cobertura.",
    portfolioSummaryTemplate: "Entre {total} jurisdições revisadas, {meets} têm critérios documentados que correspondem a pelo menos uma de suas {n} atividades selecionadas, {partial} mostram apenas cobertura setorial ou parcial, e {none} atualmente não têm taxonomia.",
    selectActivitiesPrompt: "Selecione pelo menos uma atividade antes de analisar.", pdfTitlePortfolio: "Consultor de IA em Taxonomias — Comparação de Portfólio",
    pdfActivities: "Atividades Selecionadas", activityMatchCount: "{n} de {total} atividades",
    sectors: { "Energy": "Energia", "Transport": "Transporte", "Buildings & Construction": "Edifícios e Construção", "Manufacturing & Industry": "Manufatura e Indústria", "Agriculture & Forestry": "Agricultura e Silvicultura", "Water & Waste Management": "Gestão de Água e Resíduos", "ICT & Digital Infrastructure": "TIC e Infraestrutura Digital" },
    pageHeading: "Consultor de IA em Taxonomias",
    pageLede: "Descreva uma atividade econômica para ver como ela pode se alinhar com as taxonomias de finanças sustentáveis em todo o mundo. Análise simulada e ilustrativa — não substitui o aconselhamento profissional ou jurídico sobre conformidade.",
    compareTabLabel: "Comparação Multinacional",
    countryTabLabel: "Consultor Específico por País",
    askTabLabel: "Perguntar à IA",
    activityDescLabel: "Descrição da Atividade",
    sectorClassLabel: "Classificação Setorial",
    regionFilterLabel: "Filtro de Região",
    responseLanguageLabel: "Idioma de Resposta",
    exampleQueriesLabel: "Consultas de Exemplo",
    autoDetectOption: "Detectar automaticamente a partir da descrição",
    regions: {"All": "Todas as regiões", "Europe": "Europa", "Asia-Pacific": "Ásia-Pacífico", "Americas": "Américas", "Africa": "África", "Middle East": "Oriente Médio"},
    chatWelcomeAdvisor: "Pergunte qualquer coisa sobre as taxonomias em nosso conjunto de dados — compare países, pergunte o que um termo significa ou quais jurisdições cobrem um determinado setor. Alimentado por um modelo de IA real assim que este site for implantado com uma chave de API.",
    askDisclaimerNote: "Esta aba chama um modelo de IA real por meio de um backend seguro (sua chave de API nunca está nesta página). Se não responder, este site pode ainda não estar implantado no Vercel com uma chave de API.",
    sendBtn: "Enviar",
    chatInputPlaceholder: "Pergunte sobre qualquer taxonomia… ex.: Compare as taxonomias da UE e da Coreia do Sul"
  }
};

let currentLang = "en";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key] !== undefined) ? I18N[currentLang][key] : I18N.en[key];
}

function fmt(template, vars) {
  let out = template;
  Object.keys(vars).forEach(k => {
    out = out.split("{" + k + "}").join(vars[k] == null ? "" : vars[k]);
  });
  return out;
}

function sectorLabel(sectorKey) {
  if (!sectorKey) return "";
  const dict = I18N[currentLang] && I18N[currentLang].sectors;
  return (dict && dict[sectorKey]) || sectorKey;
}

function regionLabel(regionKey) {
  if (!regionKey) return "";
  const dict = I18N[currentLang] && I18N[currentLang].regions;
  return (dict && dict[regionKey]) || regionKey;
}

/* Applies every static piece of page chrome (heading, lede, tab labels, field
   labels, region-chip labels, chat strings) that isn't already re-rendered as
   part of runCompareAnalysis/runCountryAnalysis/runPortfolioAnalysis/setMode.
   Called on init and whenever the response language changes, from either this
   page's own "Response Language" selector or the site-wide nav language
   selector (see syncLanguageFromGlobal / the gst-lang-changed listener below). */
function applyStaticI18n() {
  const byId = id => document.getElementById(id);
  if (byId("advisorPageHeading")) byId("advisorPageHeading").textContent = t("pageHeading");
  if (byId("advisorPageLede")) byId("advisorPageLede").textContent = t("pageLede");

  const tabKeys = { compare: "compareTabLabel", country: "countryTabLabel", portfolio: "portfolioTabLabel", ask: "askTabLabel" };
  document.querySelectorAll(".advisor-tab").forEach(btn => {
    const key = tabKeys[btn.dataset.mode];
    if (key) btn.textContent = t(key);
  });

  if (byId("activityDescLabelCompare")) byId("activityDescLabelCompare").textContent = t("activityDescLabel");
  if (byId("activityDescLabelCountry")) byId("activityDescLabelCountry").textContent = t("activityDescLabel");
  if (byId("sectorClassLabelId")) byId("sectorClassLabelId").textContent = t("sectorClassLabel");
  if (byId("regionFilterLabelCompare")) byId("regionFilterLabelCompare").textContent = t("regionFilterLabel");
  if (byId("regionFilterLabelPortfolio")) byId("regionFilterLabelPortfolio").textContent = t("regionFilterLabel");
  if (byId("jurisdictionLabelId")) byId("jurisdictionLabelId").textContent = t("colJurisdiction");
  if (byId("portfolioActivitiesLabel")) byId("portfolioActivitiesLabel").textContent = t("selectActivitiesHeading");
  if (byId("responseLanguageLabelId")) byId("responseLanguageLabelId").textContent = t("responseLanguageLabel");
  if (byId("exampleQueriesLabelId")) byId("exampleQueriesLabelId").textContent = t("exampleQueriesLabel");
  if (byId("askDisclaimerNoteId")) byId("askDisclaimerNoteId").textContent = t("askDisclaimerNote");

  document.querySelectorAll(".chip-row .chip").forEach(btn => {
    const region = btn.dataset.region;
    if (region) btn.textContent = regionLabel(region);
  });

  const chatInput = byId("chatInput");
  if (chatInput) chatInput.placeholder = t("chatInputPlaceholder");
  const chatSendBtn = byId("chatSendBtn");
  if (chatSendBtn) chatSendBtn.textContent = t("sendBtn");

  if (byId("advisorScopeNote")) byId("advisorScopeNote").textContent = t("screeningNotice");
  document.getElementById("analyzeBtn").textContent = currentMode === "portfolio" ? t("analyzeBtnPortfolio") : t("analyzeBtn");
}

/* Shared side effects whenever the response language actually changes,
   regardless of whether it was triggered by this page's own "Response
   Language" dropdown or by the site-wide nav language selector. */
function onLanguageChanged() {
  applyStaticI18n();
  setupSectorSelect();
  if (currentMode === "portfolio") {
    const wrap = document.getElementById("activityChecklist");
    wrap.dataset.built = ""; // force rebuild so sector/activity labels re-render in the new language
    renderPortfolioChecklist();
  }
  renderExampleCards();
  renderChatLog();
  if (document.getElementById("resultsContent").style.display !== "none") {
    // results are showing — re-run so they reflect the new language
    if (currentMode === "compare") runCompareAnalysis();
    else if (currentMode === "country") runCountryAnalysis();
    else if (currentMode === "portfolio") runPortfolioAnalysis();
  } else {
    resetResults();
  }
}

let currentMode = "compare";
let currentRegionFilter = "All";
let lastQuery = null; // remembers the last analysis so we can re-render on language change

function getCountries() {
  return Object.keys(window.TAXONOMY_DATA)
    .map(iso => ({ iso, entry: window.TAXONOMY_DATA[iso] }))
    .sort((a, b) => a.entry.name.localeCompare(b.entry.name));
}

function bucketStatus(raw) {
  return (raw === "established" || raw === "developing") ? raw : "none";
}

/* ---------- Classification & simulated compliance logic ---------- */

function classify(text) {
  const txt = (text || "").toLowerCase();
  const hits = [];
  Object.keys(CATEGORY_KEYWORDS).forEach(cat => {
    const matched = CATEGORY_KEYWORDS[cat].some(kw => txt.includes(kw));
    if (matched) hits.push(cat);
  });
  return hits;
}

function explicitSectorMatch(entry, categories) {
  if (!entry || !entry.sectors || !entry.sectors.length) return null;
  for (const sector of entry.sectors) {
    const s = sector.toLowerCase();
    for (const cat of categories) {
      const words = cat.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      if (words.some(w => s.includes(w)) || CATEGORY_KEYWORDS[cat].some(kw => s.includes(kw))) {
        return sector;
      }
    }
  }
  return null;
}

/* Deep, activity-level match: searches entry.activityList (real researched
   criteria text, present for 32 of 107 countries) for actual keyword overlap
   with the user's described activity, rather than only matching at the broad
   sector level. Optionally takes an explicit keyword list (used by the
   Portfolio mode's predefined catalog) instead of deriving keywords from
   free text. Returns the matching activityList item, or null. */
function deepActivityMatch(entry, categories, text, extraKeywords) {
  if (!entry || !entry.activityList || !entry.activityList.length) return null;
  const txt = (text || "").toLowerCase();
  const words = txt.split(/\W+/).filter(w => w.length >= 4);
  let pool = [...words];
  (categories || []).forEach(cat => { if (CATEGORY_KEYWORDS[cat]) pool = pool.concat(CATEGORY_KEYWORDS[cat]); });
  if (extraKeywords) pool = pool.concat(extraKeywords);
  pool = [...new Set(pool.map(w => w.toLowerCase()).filter(w => w.length >= 4))];
  if (!pool.length) return null;

  let best = null, bestScore = 0;
  entry.activityList.forEach(item => {
    const hay = ((item.activity || "") + " " + (item.criteria || "")).toLowerCase();
    let score = 0;
    pool.forEach(kw => { if (hay.includes(kw)) score++; });
    if (score > bestScore) { bestScore = score; best = item; }
  });
  return bestScore > 0 ? best : null;
}

function assess(entry, selectedSector, text) {
  const status = bucketStatus(entry ? entry.status : "none");
  let categories = classify(text);
  if (selectedSector && !categories.includes(selectedSector)) categories = [selectedSector, ...categories];
  const recognized = categories.length > 0;

  let bucket, criterion, deep = false, thinData = false, deepMatch = null, sectorMatch = null;

  if (status === "none") {
    bucket = "none";
    criterion = t("noneTemplate");
  } else if (!recognized) {
    bucket = "partial";
    criterion = t("uncertainTemplate");
  } else {
    deepMatch = deepActivityMatch(entry, categories, text);
    sectorMatch = explicitSectorMatch(entry, categories);
    const hasAnyData = (entry.sectors && entry.sectors.length) || (entry.activityList && entry.activityList.length);

    if (deepMatch) {
      bucket = status === "established" ? "meets" : "partial";
      deep = true;
      criterion = fmt(t("deepMatchTemplate"), {
        activity: deepMatch.activity || "",
        taxonomy: entry.taxonomy || "the national taxonomy",
        criteria: deepMatch.criteria || ""
      });
    } else if (sectorMatch) {
      bucket = status === "established" ? "meets" : "partial";
      criterion = fmt(t("coversTemplate"), {
        sector: sectorLabel(sectorMatch),
        taxonomy: entry.taxonomy || "the national taxonomy",
        year: entry.year ? " (" + entry.year + ")" : ""
      });
    } else if (!hasAnyData) {
      bucket = "partial";
      thinData = true;
      criterion = fmt(t("noDetailedDataTemplate"), { taxonomy: entry.taxonomy || "this taxonomy" });
    } else {
      bucket = "partial";
      criterion = fmt(t("resemblesTemplate"), {
        category: sectorLabel(categories[0]),
        taxonomy: entry.taxonomy || "this taxonomy"
      });
    }
  }

  return { bucket, criterion, categories, sectorMatch, deepMatch, deep, thinData, status };
}

/* Used by Portfolio Comparison mode: assess a single predefined catalog
   activity (with its own keyword list) against one country entry. */
function assessActivity(entry, catalogItem) {
  const status = bucketStatus(entry ? entry.status : "none");
  let bucket, criterion, deep = false, thinData = false;

  if (status === "none") {
    bucket = "none";
    criterion = t("noneTemplate");
  } else {
    const deepMatch = deepActivityMatch(entry, [catalogItem.sector], catalogItem.label, catalogItem.keywords);
    const sectorMatch = explicitSectorMatch(entry, [catalogItem.sector]);
    const hasAnyData = (entry.sectors && entry.sectors.length) || (entry.activityList && entry.activityList.length);

    if (deepMatch) {
      bucket = status === "established" ? "meets" : "partial";
      deep = true;
      criterion = fmt(t("deepMatchTemplate"), {
        activity: deepMatch.activity || "",
        taxonomy: entry.taxonomy || "the national taxonomy",
        criteria: deepMatch.criteria || ""
      });
    } else if (sectorMatch) {
      bucket = status === "established" ? "meets" : "partial";
      criterion = fmt(t("coversTemplate"), {
        sector: sectorLabel(sectorMatch),
        taxonomy: entry.taxonomy || "the national taxonomy",
        year: entry.year ? " (" + entry.year + ")" : ""
      });
    } else if (!hasAnyData) {
      bucket = "partial";
      thinData = true;
      criterion = fmt(t("noDetailedDataTemplate"), { taxonomy: entry.taxonomy || "this taxonomy" });
    } else {
      bucket = "partial";
      criterion = fmt(t("resemblesTemplate"), {
        category: sectorLabel(catalogItem.sector),
        taxonomy: entry.taxonomy || "this taxonomy"
      });
    }
  }

  return { bucket, criterion, deep, thinData, status };
}

/* Small pill shown next to a criterion, distinguishing a verified activity-list
   match from a generic sector-level match or from a jurisdiction with no
   detailed activity data at all (honest labelling, per the site's stated
   never-fabricate principle). */
function matchQualityTag(r) {
  if (!r || r.bucket === "none") return "";
  if (r.deep) return `<span class="match-quality-tag deep">${t("deepMatchBadge")}</span>`;
  if (r.thinData) return `<span class="match-quality-tag thin">${t("noDataBadge")}</span>`;
  if (r.sectorMatch) return `<span class="match-quality-tag sector">${t("sectorOnlyBadge")}</span>`;
  return "";
}

function bucketLabel(bucket) {
  return bucket === "meets" ? t("meets") : bucket === "partial" ? t("partial") : t("doesNotMeet");
}
const BUCKET_BADGE = { meets: "badge-established", partial: "badge-developing", none: "badge-none" };
const BUCKET_ORDER = { meets: 0, partial: 1, none: 2 };

/* ---------- Rendering ---------- */

function renderExampleCards() {
  const wrap = document.getElementById("exampleCards");
  /* Portfolio mode has no example queries (its input is a checklist), so
     EXAMPLES has no entry for it. Without this fallback the function threw,
     which aborted setMode() before resetResults() and left the previous
     mode's results on screen under the new tab. */
  const list = EXAMPLES[currentMode] || [];
  wrap.innerHTML = "";
  list.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "example-card";
    btn.type = "button";
    btn.textContent = q;
    btn.addEventListener("click", () => {
      const target = currentMode === "compare" ? document.getElementById("activityInput") : document.getElementById("activityInputCountry");
      target.value = q;
      target.focus();
    });
    wrap.appendChild(btn);
  });
}

function populateCountrySelect() {
  const sel = document.getElementById("countrySelect");
  const prev = sel.value;
  sel.innerHTML = "";
  getCountries().forEach(({ iso, entry }) => {
    const opt = document.createElement("option");
    opt.value = iso;
    opt.textContent = entry.name;
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll(".advisor-tab").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));

  const isAsk = mode === "ask";
  const isPortfolio = mode === "portfolio";
  document.querySelector(".advisor-layout").style.display = isAsk ? "none" : "grid";
  document.getElementById("chatPanel").style.display = isAsk ? "block" : "none";

  if (isAsk) return;

  document.getElementById("modeCompareInputs").style.display = mode === "compare" ? "block" : "none";
  document.getElementById("modeCountryInputs").style.display = mode === "country" ? "block" : "none";
  document.getElementById("modePortfolioInputs").style.display = isPortfolio ? "block" : "none";
  document.getElementById("exampleQueriesBlock").style.display = isPortfolio ? "none" : "block";
  document.getElementById("analyzeBtn").textContent = isPortfolio ? t("analyzeBtnPortfolio") : t("analyzeBtn");
  if (isPortfolio) renderPortfolioChecklist();
  renderExampleCards();
  resetResults();
}

function resetResults() {
  document.getElementById("resultsEmpty").style.display = "block";
  document.getElementById("resultsEmpty").querySelector("p").textContent =
    currentMode === "portfolio" ? t("selectActivitiesPrompt") : t("emptyPromptCompare");
  document.getElementById("resultsContent").style.display = "none";
  document.getElementById("resultsContent").innerHTML = "";
}

function setupTabs() {
  document.querySelectorAll(".advisor-tab").forEach(btn => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });
}

function setupRegionChipsFor(containerId) {
  document.querySelectorAll(`#${containerId} .chip`).forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .chip`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentRegionFilter = btn.dataset.region;
    });
  });
}

function setupRegionChips() {
  setupRegionChipsFor("advisorRegionChips");
  setupRegionChipsFor("portfolioRegionChips");
}

/* ---------- Portfolio Comparison mode ---------- */

let selectedActivityIds = [];

function renderPortfolioChecklist() {
  const wrap = document.getElementById("activityChecklist");
  if (wrap.dataset.built === "1") return; // build once; checkbox state persists across mode switches
  wrap.dataset.built = "1";
  const bySector = {};
  ACTIVITY_CATALOG.forEach(a => {
    if (!bySector[a.sector]) bySector[a.sector] = [];
    bySector[a.sector].push(a);
  });
  let html = "";
  SECTOR_OPTIONS.forEach(sector => {
    if (!bySector[sector]) return;
    html += `<div class="activity-checklist-group"><h4>${sectorLabel(sector)}</h4><div class="interest-list">`;
    bySector[sector].forEach(a => {
      html += `<label class="interest-check"><input type="checkbox" data-activity-id="${a.id}" ${selectedActivityIds.includes(a.id) ? "checked" : ""} /> <span>${a.label}</span></label>`;
    });
    html += `</div></div>`;
  });
  wrap.innerHTML = html;
  wrap.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      const id = cb.dataset.activityId;
      if (cb.checked) { if (!selectedActivityIds.includes(id)) selectedActivityIds.push(id); }
      else { selectedActivityIds = selectedActivityIds.filter(x => x !== id); }
    });
  });
}

function runPortfolioAnalysis() {
  const resultsEl = document.getElementById("resultsContent");
  const emptyEl = document.getElementById("resultsEmpty");

  if (!selectedActivityIds.length) {
    emptyEl.style.display = "block";
    emptyEl.querySelector("p").textContent = t("selectActivitiesPrompt");
    resultsEl.style.display = "none";
    return;
  }

  const activities = ACTIVITY_CATALOG.filter(a => selectedActivityIds.includes(a.id));
  const countries = getCountries().filter(({ entry }) => currentRegionFilter === "All" || entry.region === currentRegionFilter);

  const perCountry = countries.map(({ iso, entry }) => {
    const activityResults = activities.map(a => ({ activity: a, ...assessActivity(entry, a) }));
    const bestBucket = activityResults.reduce((best, r) => BUCKET_ORDER[r.bucket] < BUCKET_ORDER[best] ? r.bucket : best, "none");
    const deepCount = activityResults.filter(r => r.deep).length;
    return { iso, entry, activityResults, bestBucket, deepCount };
  });

  perCountry.sort((a, b) => BUCKET_ORDER[a.bestBucket] - BUCKET_ORDER[b.bestBucket] || b.deepCount - a.deepCount || a.entry.name.localeCompare(b.entry.name));

  let meetsJurisdictions = 0, partialJurisdictions = 0, noneJurisdictions = 0;
  perCountry.forEach(c => {
    if (c.bestBucket === "meets") meetsJurisdictions++;
    else if (c.bestBucket === "partial") partialJurisdictions++;
    else noneJurisdictions++;
  });

  let html = `<div class="disclaimer-banner">${t("compareDisclaimer")}</div>`;

  const summaryText = fmt(t("portfolioSummaryTemplate"), {
    total: perCountry.length, meets: meetsJurisdictions, n: activities.length,
    partial: partialJurisdictions, none: noneJurisdictions
  });
  html += `<div class="ai-summary-box"><h3>${t("aiSummaryHeading")}</h3><p>${summaryText}</p></div>`;

  perCountry.forEach(c => {
    html += `<div class="country-result-card portfolio-country-card">`;
    html += `<span class="badge ${BUCKET_BADGE[c.bestBucket]}">${bucketLabel(c.bestBucket)}</span>`;
    html += `<h3>${c.entry.name}${c.entry.taxonomy ? " — " + c.entry.taxonomy : ""}</h3>`;
    html += `<ul class="criteria-check-list">`;
    c.activityResults.forEach(r => {
      const icon = r.bucket === "none" ? "–" : r.deep ? "✓" : r.thinData ? "○" : "~";
      const iconClass = r.bucket === "none" ? "no" : r.deep ? "yes" : "partial";
      const qualityTag = r.bucket === "none" ? "" :
        r.deep ? `<span class="match-quality-tag deep">${t("deepMatchBadge")}</span>` :
        r.thinData ? `<span class="match-quality-tag thin">${t("noDataBadge")}</span>` :
        `<span class="match-quality-tag sector">${t("sectorOnlyBadge")}</span>`;
      html += `<li><span class="status-icon ${iconClass}">${icon}</span><div><strong>${r.activity.label}.</strong> ${qualityTag} ${r.criterion}</div></li>`;
    });
    html += `</ul>`;
    /* `from`/`amode` let the country page offer a way back to this analysis:
       these links open a new tab, where the browser's Back button is dead. */
    html += `<a class="btn-secondary" href="country.html?iso=${c.iso}&from=advisor&amode=${currentMode}" target="_blank" rel="noopener">${t("viewFullProfile")}</a>`;
    html += `</div>`;
  });

  html += `<div class="results-actions" style="margin-top:16px;"><button class="btn-secondary" id="shareBtn">${t("shareBtn")}</button></div>`;

  resultsEl.innerHTML = html;
  resultsEl.style.display = "block";
  emptyEl.style.display = "none";

  document.getElementById("shareBtn").addEventListener("click", () => shareResults());
}

function setupSectorSelect() {
  const sel = document.getElementById("sectorSelect");
  const prev = sel.value;
  sel.innerHTML = "";
  const autoOpt = document.createElement("option");
  autoOpt.value = "";
  autoOpt.textContent = t("autoDetectOption");
  sel.appendChild(autoOpt);
  SECTOR_OPTIONS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s; // keep canonical English key as the value
    opt.textContent = sectorLabel(s);
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
}

/* Pulls the page's language from the site-wide nav selector (global.js's
   gstCurrentLang) if one has been set — so arriving on this page (or
   switching language in the nav on any page) starts Advisor in the same
   language as the rest of the site, rather than always defaulting to English. */
function syncLanguageFromGlobal() {
  if (typeof gstCurrentLang !== "undefined" && I18N[gstCurrentLang]) {
    currentLang = gstCurrentLang;
  }
}

function setupLanguageSelect() {
  syncLanguageFromGlobal();
  const sel = document.getElementById("langSelectAdvisor");
  sel.innerHTML = LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
  sel.value = currentLang;
  sel.addEventListener("change", () => {
    currentLang = sel.value;
    // Keep the site-wide nav language selector (and every other page) in sync
    // with this page's own "Response Language" control, in both directions.
    if (typeof gstCurrentLang !== "undefined") {
      gstCurrentLang = currentLang;
      if (typeof localStorage !== "undefined") localStorage.setItem("gst-lang", gstCurrentLang);
      if (typeof gstApplyI18n === "function") gstApplyI18n();
      const globalSel = document.getElementById("globalLangSelect");
      if (globalSel) globalSel.value = gstCurrentLang;
    }
    onLanguageChanged();
  });
}

function runCompareAnalysis() {
  const text = document.getElementById("activityInput").value.trim();
  const sector = document.getElementById("sectorSelect").value;
  const resultsEl = document.getElementById("resultsContent");
  const emptyEl = document.getElementById("resultsEmpty");

  if (!text) {
    emptyEl.style.display = "block";
    emptyEl.querySelector("p").textContent = t("promptBeforeAnalyze");
    resultsEl.style.display = "none";
    return;
  }

  lastQuery = { mode: "compare", text, sector };

  const countries = getCountries().filter(({ entry }) => currentRegionFilter === "All" || entry.region === currentRegionFilter);
  const rows = countries.map(({ iso, entry }) => ({ iso, entry, ...assess(entry, sector, text) }));
  rows.sort((a, b) => BUCKET_ORDER[a.bucket] - BUCKET_ORDER[b.bucket] || a.entry.name.localeCompare(b.entry.name));

  const counts = { meets: 0, partial: 0, none: 0 };
  rows.forEach(r => counts[r.bucket]++);

  let html = `<div class="disclaimer-banner">${t("compareDisclaimer")}</div>`;

  html += `<div class="results-summary">`;
  html += `<div class="summary-pill meets"><span class="num">${counts.meets}</span><span class="lbl">${t("meets")}</span></div>`;
  html += `<div class="summary-pill partial"><span class="num">${counts.partial}</span><span class="lbl">${t("partial")}</span></div>`;
  html += `<div class="summary-pill none"><span class="num">${counts.none}</span><span class="lbl">${t("doesNotMeet")}</span></div>`;
  html += `</div>`;

  html += `<div class="results-table-wrap"><table class="results-table"><thead><tr><th>${t("colJurisdiction")}</th><th>${t("colStatus")}</th><th>${t("colKeyCriterion")}</th><th></th></tr></thead><tbody>`;
  rows.forEach(r => {
    html += `<tr><td>${r.entry.name}</td><td><span class="badge badge-sm ${BUCKET_BADGE[r.bucket]}">${bucketLabel(r.bucket)}</span></td><td>${matchQualityTag(r)}${r.criterion}</td><td><a href="country.html?iso=${r.iso}&from=advisor&amode=${currentMode}" target="_blank" rel="noopener">${t("viewLink")}</a></td></tr>`;
  });
  html += `</tbody></table></div>`;

  const topMeets = rows.filter(r => r.bucket === "meets").slice(0, 5).map(r => r.entry.name);
  const summaryText = fmt(t("summaryTemplate"), {
    activity: text,
    sectorPart: sector ? fmt(t("sectorPart"), { sector: sectorLabel(sector) }) : "",
    meets: counts.meets, total: rows.length, partial: counts.partial, none: counts.none,
    strongestPart: topMeets.length ? fmt(t("strongestPart"), { names: topMeets.join(", ") }) : ""
  });

  html += `<div class="ai-summary-box"><h3>${t("aiSummaryHeading")}</h3><p>${summaryText}</p></div>`;
  html += `<div class="results-actions"><button class="btn-secondary" id="shareBtn">${t("shareBtn")}</button></div>`;

  resultsEl.innerHTML = html;
  resultsEl.style.display = "block";
  emptyEl.style.display = "none";

  document.getElementById("shareBtn").addEventListener("click", () => shareResults());
}

function runCountryAnalysis() {
  const text = document.getElementById("activityInputCountry").value.trim();
  const iso = document.getElementById("countrySelect").value;
  const entry = window.TAXONOMY_DATA[iso];
  const resultsEl = document.getElementById("resultsContent");
  const emptyEl = document.getElementById("resultsEmpty");

  if (!text) {
    emptyEl.style.display = "block";
    emptyEl.querySelector("p").textContent = t("promptBeforeAnalyze");
    resultsEl.style.display = "none";
    return;
  }

  lastQuery = { mode: "country", text, iso };

  const result = assess(entry, "", text);
  const name = entry ? entry.name : iso;
  const facts = entry && entry.facts ? entry.facts : {};

  const criteria = [
    { label: t("substantialContribution"), met: result.bucket === "meets" || (result.bucket === "partial" && result.categories.length > 0), note: result.criterion },
    { label: t("dnshLabel"), met: facts.dnsh === true, note: facts.dnsh === true ? t("requiredDocumented") : t("notConfirmed") },
    { label: t("minimumSafeguardsLabel"), met: facts.minimumSafeguards === true, note: facts.minimumSafeguards === true ? t("requiredDocumented") : t("notConfirmed") }
  ];

  const docsI18n = t("docs");
  const docs = [docsI18n[0]];
  if (facts.dnsh === true) docs.push(docsI18n[1]);
  if (facts.minimumSafeguards === true) docs.push(docsI18n[2]);
  docs.push(docsI18n[3]);

  let html = `<div class="disclaimer-banner">${t("countryDisclaimer")}</div>`;

  html += `<div class="country-result-card">`;
  html += `<span class="badge ${BUCKET_BADGE[result.bucket]}">${bucketLabel(result.bucket)}</span>`;
  html += `<h3>${name}${entry && entry.taxonomy ? " — " + entry.taxonomy : ""}</h3>`;
  html += `<p class="section-text">${matchQualityTag(result)}${result.criterion}</p>`;

  html += `<ul class="criteria-check-list">`;
  criteria.forEach(c => {
    html += `<li><span class="status-icon ${c.met ? "yes" : "no"}">${c.met ? "✓" : "–"}</span><div><strong>${c.label}.</strong> ${c.note}</div></li>`;
  });
  html += `</ul>`;

  html += `<h3 style="font-size:1rem;">${t("additionalDocsHeading")}</h3><ul class="doc-list">`;
  docs.forEach(d => { html += `<li>${d}</li>`; });
  html += `</ul>`;

  html += `<p class="sample-note">${t("illustrativeNote")}</p>`;
  /* Carry the activity text too, so the Back link on the country page
     reopens this exact analysis rather than an empty advisor form. */
  const backQ = lastQuery && lastQuery.text ? `&q=${encodeURIComponent(lastQuery.text)}` : "";
  html += `<a class="btn-secondary" href="country.html?iso=${iso}&from=advisor&amode=${currentMode}${backQ}" target="_blank" rel="noopener">${t("viewFullProfile")}</a>`;
  html += `</div>`;

  html += `<div class="results-actions" style="margin-top:16px;"><button class="btn-secondary" id="shareBtn">${t("shareBtn")}</button></div>`;

  resultsEl.innerHTML = html;
  resultsEl.style.display = "block";
  emptyEl.style.display = "none";

  document.getElementById("shareBtn").addEventListener("click", () => shareResults());
}

/* PDF export removed 2026-09: a "Country-Specific Assessment" PDF read as a
   formal determination, but the underlying analysis is a keyword screen of
   the activity criteria only. Sharing a link (below) keeps the on-screen
   caveats attached to the result. */

function shareResults() {
  const params = new URLSearchParams(window.location.search);
  if (currentMode === "compare") {
    params.set("mode", "compare");
    const txt = document.getElementById("activityInput").value.trim();
    if (txt) params.set("q", txt);
  } else if (currentMode === "portfolio") {
    params.set("mode", "portfolio");
    if (selectedActivityIds.length) params.set("activities", selectedActivityIds.join(","));
  } else {
    params.set("mode", "country");
    params.set("iso", document.getElementById("countrySelect").value);
    const txt = document.getElementById("activityInputCountry").value.trim();
    if (txt) params.set("q", txt);
  }
  if (currentLang !== "en") params.set("lang", currentLang);
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => alert("Shareable link copied to clipboard:\n" + url))
      .catch(() => prompt("Copy this link:", url));
  } else {
    prompt("Copy this link:", url);
  }
}

/* ---------- Ask AI (real model, via /api/ask) ---------- */

const CHAT_EXAMPLES = [
  "Compare the EU and South Korea taxonomies",
  "Which countries require Do No Significant Harm (DNSH)?",
  "What is the newest taxonomy in Asia-Pacific?",
  "What's the difference between a developed and a developing taxonomy status?"
];

let chatHistory = [];
let chatBusy = false;

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderChatLog() {
  const log = document.getElementById("chatLog");
  const welcome = `<div class="chat-welcome">${escapeHtml(t("chatWelcomeAdvisor"))}</div>`;
  const msgs = chatHistory.map(m => `
    <div class="chat-msg chat-msg-${m.role}">
      <div class="chat-bubble${m.pending ? " chat-bubble-pending" : ""}${m.error ? " chat-bubble-error" : ""}">${escapeHtml(m.content).replace(/\n/g, "<br>")}</div>
    </div>
  `).join("");
  log.innerHTML = chatHistory.length ? msgs : welcome;
  log.scrollTop = log.scrollHeight;
}

function renderChatExamples() {
  const wrap = document.getElementById("chatExamples");
  wrap.innerHTML = CHAT_EXAMPLES.map(q => `<button class="example-card" type="button">${q}</button>`).join("");
  wrap.querySelectorAll(".example-card").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      document.getElementById("chatInput").value = CHAT_EXAMPLES[i];
      document.getElementById("chatInput").focus();
    });
  });
}

async function sendChatMessage(question) {
  if (chatBusy) return;
  chatBusy = true;
  document.getElementById("chatSendBtn").disabled = true;

  chatHistory.push({ role: "user", content: question });
  chatHistory.push({ role: "assistant", content: "Thinking…", pending: true });
  renderChatLog();

  const historyForApi = chatHistory.slice(0, -2).map(m => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, history: historyForApi, lang: currentLang })
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }

    chatHistory.pop();
    if (!res.ok) {
      chatHistory.push({
        role: "assistant",
        error: true,
        content: (data && data.error) || "This site doesn't seem to be deployed with the AI backend yet — see DEPLOY_INSTRUCTIONS.md."
      });
    } else {
      chatHistory.push({ role: "assistant", content: data.answer || "(no response)" });
    }
  } catch (err) {
    chatHistory.pop();
    chatHistory.push({
      role: "assistant",
      error: true,
      content: "Couldn't reach the AI backend (" + err.message + "). If you're opening this file directly rather than visiting a deployed Vercel URL, \"Ask AI\" isn't available yet — see DEPLOY_INSTRUCTIONS.md."
    });
  }

  renderChatLog();
  chatBusy = false;
  document.getElementById("chatSendBtn").disabled = false;
}

function setupChat() {
  renderChatExamples();
  renderChatLog();
  document.getElementById("chatForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    sendChatMessage(q);
  });
  document.getElementById("chatInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("chatForm").requestSubmit();
    }
  });
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");
  if (langParam && I18N[langParam]) currentLang = langParam;

  const modeParam = params.get("mode");
  const mode = modeParam === "country" ? "country" : modeParam === "ask" ? "ask" : modeParam === "portfolio" ? "portfolio" : "compare";
  setMode(mode);

  const q = params.get("q") || "";
  if (mode === "compare") {
    if (q) document.getElementById("activityInput").value = q;
  } else if (mode === "country") {
    const iso = (params.get("iso") || "").toUpperCase();
    if (iso && window.TAXONOMY_DATA[iso]) document.getElementById("countrySelect").value = iso;
    if (q) document.getElementById("activityInputCountry").value = q;
  } else if (mode === "portfolio") {
    const idsParam = (params.get("activities") || "").split(",").filter(Boolean);
    const valid = ACTIVITY_CATALOG.map(a => a.id);
    selectedActivityIds = idsParam.filter(id => valid.includes(id));
    const wrap = document.getElementById("activityChecklist");
    wrap.dataset.built = "";
    renderPortfolioChecklist();
  }

  if (mode === "compare" && q) runCompareAnalysis();
  else if (mode === "country" && q) runCountryAnalysis();
  else if (mode === "portfolio" && selectedActivityIds.length) runPortfolioAnalysis();
}

function init() {
  setupLanguageSelect();
  setupSectorSelect();
  populateCountrySelect();
  setupTabs();
  setupRegionChips();
  setupChat();

  document.getElementById("analyzeBtn").textContent = t("analyzeBtn");
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    if (currentMode === "compare") runCompareAnalysis();
    else if (currentMode === "portfolio") runPortfolioAnalysis();
    else runCountryAnalysis();
  });

  applyQueryParams();
  // language may have come from the URL — refresh language-dependent chrome
  document.getElementById("langSelectAdvisor").value = currentLang;
  setupSectorSelect();
  applyStaticI18n();

  // Keep this page in sync when the site-wide nav language selector changes
  // (on this page or navigated in from another page with a saved language).
  document.addEventListener("gst-lang-changed", e => {
    const lang = e && e.detail && e.detail.lang;
    if (lang && I18N[lang] && lang !== currentLang) {
      currentLang = lang;
      const sel = document.getElementById("langSelectAdvisor");
      if (sel) sel.value = lang;
      onLanguageChanged();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
