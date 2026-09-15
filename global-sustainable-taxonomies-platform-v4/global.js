/* Global Sustainable Taxonomies — shared nav/footer components: global search
   and a site-wide language selector for interface chrome.

   SCOPE NOTE: this translates interface labels, headings and buttons across
   every page (nav, footer, homepage widgets, Media Hub, Subscribe, About,
   Preferences, and the country page's own section headings). It does NOT
   translate researched content itself — country descriptions, activity
   lists, official document titles, media items and chat answers all stay in
   English, since reliably translating that material is a separate, larger
   task (flagged to Tyra as a follow-up). */

const GST_LANGUAGES = [
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

const GST_I18N = {
  en: {
    "nav.map": "Interactive Global Map", "nav.advisor": "AI Advisor", "nav.media": "Media Hub",
    "nav.subscribe": "Subscribe", "nav.resources": "Resources", "nav.about": "About",
    "nav.comingSoon": "Coming soon", "nav.toggleTheme": "Toggle theme", "nav.search": "Search",
    "footer.developedBy": "Developed by", "footer.supervisedBy": "Supervised by", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Supervisor", "footer.contactPhone": "Phone", "footer.contactEmail": "Email",
    "search.placeholder": "Search the whole site — countries, criteria, activities, pages…", "search.mapPlaceholder": "Search by country, taxonomy or regulator…", "search.noMatches": "No matches", "search.noTaxonomyData": "No taxonomy data",
    "search.groupCountries": "Countries", "search.groupActivities": "K-Taxonomy activities", "search.groupPages": "Pages & tools",
    "advisor.tabCompare": "Multi-Country Comparison", "advisor.tabCountry": "Country-Specific Advisor", "advisor.tabPortfolio": "Portfolio Comparison", "advisor.tabAsk": "Ask AI",
    "search.title": "Search", "search.close": "Close",
    "translate.button": "Translate", "translate.modalTitle": "Translated Document",
    "translate.loading": "Translating this document\u2026",
    "translate.loadingPart": "Translating part {n} of {total}…",
    "translate.disclaimer": "Machine translation of an official document, for reference only \u2014 always refer to the original for legal or compliance purposes.",
    "sources.note": "This overview is compiled from the official documents and regulatory sources listed above.",
    "sources.lastReviewed": "Content last compiled/reviewed:", "about.resourcesHeading": "Key Reference Resources", "about.resourcesIntro": "Every country page links directly to its official government/regulator documents and, where the page includes a detailed description, numbered citations for each specific claim. Alongside those primary sources, these cross-cutting resources are useful for understanding and comparing taxonomies globally.", "about.resourcesColResource": "Resource", "about.resourcesColDescription": "Description", "about.resourcesColLink": "Link", "footer.references": "References", "country.generalResources": "General Reference Resources",
    "country.noTaxonomyEstablished": "No taxonomy established",
    "country.tableCountry": "Country",
    "country.tableTaxonomyName": "Taxonomy Name",
    "country.notEstablished": "Not established",
    "country.tableStatus": "Status",
    "country.tableRegulator": "Regulator",
    "country.notPubliclySpecified": "Not publicly specified",
    "country.tableYearPublished": "Year Published",
    "country.notSpecified": "Not specified",
    "country.tableRegion": "Region",
    "country.notYetDocumented": "Not yet documented for this taxonomy.",
    "country.colActivity": "Activity",
    "country.colScreeningCriteria": "Screening Criteria",
    "country.colThreshold": "Threshold",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "See official documentation",
    "country.dnshAppliesDefault": "Applies",
    "country.viewAllCriteria": "View All Criteria (Official Source)",
    "country.officialSourceLabel": "Official source:",
    "country.singleSourceNote": "Only a single general source link has been compiled for this country so far — a fuller list of official documents may be added later.",
    "country.noSourceYet": "No official source link has been compiled for this country yet.",
    "country.mediaTagDocument": "Document",
    "country.officialTaxonomyDocumentation": "Official Taxonomy Documentation",
    "country.mediaTagRegional": "Regional",
    "country.moreUpdatesComingSoon": "More updates coming soon",
    "country.chatPlaceholder": "Ask a question…",
    "country.chatDisclaimer": "Calls a real AI model through a secure backend. If it doesn't respond, this site may not be deployed with an API key yet — see DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Taxonomy Overview",
    "country.headingAboutTaxonomy": "About the Taxonomy",
    "country.limitedInfoNote": "Limited public information compiled so far — this summary may be expanded as more sources are reviewed.",
    "country.noDataCompiledYet": "No taxonomy data has been compiled for this country yet.",
    "country.headingOfficialDocuments": "Official Documents",
    "country.headingEnvironmentalObjectives": "Environmental Objectives",
    "country.headingTechnicalCriteria": "Technical Screening Criteria",
    "country.headingAlsoApplies": "Also Applies",
    "country.headingRelatedMedia": "Related Media & Updates",
    "country.headingAiChat": "AI Compliance Chat",
    "country.headingCompare": "Compare With Another Taxonomy",
    "country.compareAllCountriesBtn": "Compare All Countries",
    "country.noCountrySelected": "No country selected",
    "country.goBackToMap": "Go back to the map and click on a country to view its taxonomy profile.",
    "country.compareWithLabel": "Compare {name}'s taxonomy with:",
    "country.rowMandatoryVoluntary": "Mandatory / Voluntary",
    "country.rowRequiresDnsh": "Requires DNSH",
    "country.rowRequiresSafeguards": "Requires Minimum Safeguards",
    "country.rowSectorsCovered": "Sectors Covered",
    "country.notDocumented": "Not documented",
    "country.yes": "Yes",
    "country.no": "No",
    "country.publishedPrefix": "Published",
    "country.sourceLinkLabel": "source",
    "country.chatWelcomeDefault": "Ask anything about this taxonomy.",
    "country.chatWelcomeWithName": "Ask anything about {name}'s taxonomy — including how it compares to others, like the EU taxonomy or South Korea's K-Taxonomy.",
    "country.chatExampleCompare": "Compare {name}'s taxonomy to the EU taxonomy",
    "country.chatExampleCriteria": "What are the key screening criteria under {taxonomy}?",
    "country.chatExampleDocumentation": "What documentation would I need to demonstrate compliance here?",
    "country.chatExampleSimilar": "Which other countries have similar taxonomies to {name}?",
    "translate.viewOriginal": "View Original PDF \u2197", "translate.close": "Close",
    "translate.language": "Translate to", "translate.originalPane": "Original", "translate.translatedPane": "Translation",
    "translate.errorGeneric": "Couldn't translate this document right now.",
    "translate.errorNotDeployed": "Translate needs the live site backend, which isn't connected here — this only works once the site is deployed to Vercel with an API key (see DEPLOY_INSTRUCTIONS.md). You can still open the original PDF below.",
    "translate.truncatedNote": "This document is long \u2014 showing a translation of the first portion only.",
    "translate.previewUnavailable": "Preview isn't available for this source — it blocks automated preview loading. Use \"View Original PDF\" below to open it directly in your browser.",
    "home.heroTitle": "Explore Sustainable Finance Taxonomies Worldwide",
    "home.heroSub": "Select a country on the map, or use the search bar below.",
    "home.chipAllRegions": "All Regions", "home.chipEurope": "Europe", "home.chipAsiaPacific": "Asia-Pacific",
    "home.chipAmericas": "Americas", "home.chipAfrica": "Africa", "home.chipMiddleEast": "Middle East",
    "home.chipAllStatuses": "All Statuses", "home.chipDeveloped": "Developed",
    "home.chipUnderDevelopment": "Under Development", "home.chipNoTaxonomy": "No Taxonomy",
    "home.globalStats": "Global Stats", "home.totalCountriesTracked": "Total Countries Tracked",
    "home.recentlyUpdated": "Recently Updated", "home.askAi": "Ask AI",
    "home.objectiveFilterHeading": "Filter by Environmental Objective", "home.sectorFilterHeading": "Filter by Sector",
    "home.advancedFiltersToggle": "Advanced Search & Filtering",
    "home.objAll": "All Objectives", "home.objClimateMitigation": "Climate Change Mitigation", "home.objClimateAdaptation": "Climate Change Adaptation",
    "home.objBiodiversity": "Biodiversity & Ecosystems", "home.objWater": "Water & Marine Resources", "home.objCircular": "Circular Economy",
    "home.objPollution": "Pollution Prevention", "home.objEnergy": "Energy", "home.objIndustry": "Industry & Transition",
    "home.secAll": "All Sectors", "home.secAgriculture": "Agriculture", "home.secBuildings": "Buildings",
    "home.secEcologicalRestoration": "Ecological Restoration", "home.secEnergy": "Energy", "home.secEnergyTransition": "Energy Transition",
    "home.secEnvironmentalProtection": "Environmental Protection", "home.secGreenServicesTrade": "Green Services & Trade", "home.secICTDigital": "ICT & Digital",
    "home.secInfrastructure": "Infrastructure", "home.secManufacturing": "Manufacturing", "home.secNuclearTransition": "Nuclear & Transition Industries",
    "home.secResourceRecycling": "Resource Recycling", "home.secTransport": "Transport", "home.secWasteManagement": "Waste Management", "home.secWater": "Water",
    "home.matchingCountriesHeading": "Matching Countries", "home.noMatchingCountries": "No countries match these filters yet.",
    "home.partialDataNote": "Objective and sector filters currently match against the countries we've compiled this detail for so far — others may not appear here yet even if their taxonomy could cover it.",
    "about.missionHeading": "About the Platform",
    "about.missionText": "Sustainable finance taxonomies — the rulebooks that define which economic activities count as \"green\" or \"sustainable\" — are multiplying fast, but they're scattered across dozens of government websites, PDFs and languages. Anyone trying to compare the EU Taxonomy with Korea's K-Taxonomy, or check whether a given activity is covered anywhere, has to piece it together by hand. This platform brings that information into one interactive place: a map of where taxonomies stand today, side-by-side comparisons, direct links to the original official documents, and an AI advisor to answer specific questions — so regulators, investors and companies can navigate the landscape faster and with fewer blind spots.",
    "about.featurePill1": "Interactive Global Map", "about.featurePill2": "AI Taxonomy Advisor",
    "about.featurePill3": "Media & Trend Hub", "about.featurePill4": "Side-by-Side Comparison",
    "about.featurePill5": "Official Source Documents",
    "about.teamHeading": "Platform Team", "about.coreDeveloper": "Core Developer",
    "about.supervisorRole": "Supervisor · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "About BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS is a Seoul-based \"Beyond Net Zero\" business group working across advisory, policy think-tank and climate-tech investment. The firm has been directly involved in designing major Korean climate policy, including the K-ETS (Emission Trading Scheme) and the K-Taxonomy itself, and advises financial institutions, industry and government on net-zero strategy, sustainability disclosure and green finance. This platform is part of BNZ PARTNERS' newer AI Centre initiative — applying AI to make sustainable finance taxonomies easier to navigate, compare and act on, building on the firm's existing K-Taxonomy policy work.",
    "about.contactHeading": "Questions, feedback, or want to collaborate?",
    "about.contactSub": "Get in touch, or subscribe for updates as this platform grows.",
    "about.contactUs": "Contact Us",
    "subscribe.heading": "Subscribe to the Weekly Digest",
    "subscribe.lede": "Get a weekly summary of taxonomy news, reports, AI trend insights and BNZ Partners company updates, delivered to your inbox. Only your email address is required — everything else is optional.",
    "subscribe.sampleBanner": "This form adds subscribers to a real Brevo mailing list once the site is deployed with a Brevo API key (see DEPLOY_INSTRUCTIONS.md). Sending the weekly digest itself is still done manually from the Brevo dashboard — this form only handles sign-ups.",
    "subscribe.emailLabel": "Email Address", "subscribe.nameLabel": "Name", "subscribe.optional": "(optional)",
    "subscribe.interestLabel": "Area of Interest", "subscribe.interestEu": "EU Taxonomy Updates",
    "subscribe.interestApac": "Asia-Pacific Taxonomies", "subscribe.interestGreenBonds": "Green Bonds & Finance",
    "subscribe.interestCompliance": "Compliance & Assurance", "subscribe.langLabel": "Language Preference",
    "subscribe.consentComms": "I agree to receive the weekly digest and occasional platform updates from Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "I have read and accept the Privacy Policy, and consent to my data being processed in line with GDPR (EU) and PIPA (South Korea) requirements.",
    "subscribe.submitBtn": "Subscribe for Free",
    "subscribe.privacyNote": "We only use your email to send the digest you've signed up for — it is stored in our Brevo mailing list and is not sold or shared. You can unsubscribe at any time using the link included in the emails you receive.",
    "subscribe.managePrefs": "Manage your preferences", "subscribe.backToMedia": "Back to Media Hub",
    "subscribe.benefit1Title": "Weekly Digest", "subscribe.benefit1Text": "A concise Monday-morning summary of the week's taxonomy news, reports and regulatory updates.",
    "subscribe.benefit2Title": "Platform Alerts", "subscribe.benefit2Text": "Be first to know when a country's taxonomy status changes, or a new official document is published.",
    "subscribe.benefit3Title": "BNZ PARTNERS Insights", "subscribe.benefit3Text": "Occasional analysis pieces from the BNZ Partners AI Centre on emerging taxonomy and compliance themes.",
    "subscribe.benefit4Title": "Event Invitations", "subscribe.benefit4Text": "Invites to webinars, panel discussions and briefings on sustainable finance taxonomies worldwide.",
    "prefs.heading": "Subscriber Preferences", "prefs.lede": "Manage your digest topics, language and communication settings.",
    "prefs.sampleBanner": "Demo preference centre — for illustration only. There is no real subscriber account behind this page, so nothing here is saved, and the fields are shown pre-filled with sample data. In the live product, existing subscribers would land here after clicking a link in their digest email.",
    "prefs.saveBtn": "Save Preferences (demo — disabled)",
    "prefs.privacyNote": "This screen is a non-functional placeholder. To actually change your interests or language in the future, you'd use a page like this one, but it isn't wired up to a real subscriber database yet.",
    "prefs.unsubscribeLink": "Unsubscribe (demo — disabled)", "prefs.backToSubscribe": "Back to Subscribe",
    "media.heading": "Global Media & Trend Hub", "media.lede": "Taxonomy-related media and AI-generated trend insights, in one place.",
    "media.sampleBanner": "This page aggregates real, live content: News, Reports and Papers via Google News, and AI Trend Insights plus the thematic chart via live AI analysis of that content. The taxonomy-development timeline chart below uses this site\u2019s own real data.",
    "media.filterAll": "All", "media.filterNews": "News", "media.filterReports": "Reports",
    "media.filterPapers": "Papers",
    "media.searchPlaceholder": "Search media…", "media.trendLabel": "AI Trend Insights",
    "media.timelineHeading": "Taxonomy Development Timeline",
    "media.timelineNote": "Real data — number of taxonomies published per year, from the compiled dataset.",
    "media.thematicHeading": "Thematic Policy Trends",
    "media.thematicNote": "AI-estimated weighting based on live analysis of recent headlines — refreshed periodically.",
    "media.ctaHeading": "Get the Weekly Taxonomy Digest",
    "media.ctaText": "A weekly summary of taxonomy news, reports and trend insights — free.",
    "media.ctaBtn": "Subscribe Free",
    "country.backToMap": "Back to map", "country.backToAdvisor": "Back to AI Advisor",
    "home.filterLogicNote": "All filters apply together — a country must match every selection.", "home.activeFiltersLabel": "Active filters", "country.translatingContent": "Translating this page's content…",
    "chat.toggleLabel": "Ask the AI Assistant", "chat.title": "AI Assistant",
    "chat.subtitle": "Ask about taxonomy terms, compare countries, or find your way around the site.",
    "chat.placeholder": "Type your question…", "chat.send": "Send",
    "chat.greeting": "Hi! I can explain taxonomy terms, compare countries, or point you to the right page. What would you like to know?",
    "chat.thinking": "Thinking…",
    "chat.errorGeneric": "Couldn't reach the assistant right now — please try again.",
    "chat.errorNotDeployed": "The assistant needs the live site backend, which isn't connected here — this only works once the site is deployed to Vercel with an API key (see DEPLOY_INSTRUCTIONS.md)."
  },
  sv: {
    "nav.map": "Interaktiv global karta", "nav.advisor": "AI-rådgivare", "nav.media": "Mediehubb",
    "nav.subscribe": "Prenumerera", "nav.resources": "Resurser", "nav.about": "Om oss",
    "nav.comingSoon": "Kommer snart", "nav.toggleTheme": "Växla tema", "nav.search": "Sök",
    "footer.developedBy": "Utvecklad av", "footer.supervisedBy": "Handledd av", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Handledare",
    "search.placeholder": "Sök hela webbplatsen — länder, kriterier, aktiviteter, sidor…", "search.mapPlaceholder": "Sök på land, taxonomi eller tillsynsmyndighet…", "search.noMatches": "Inga träffar", "search.noTaxonomyData": "Inga taxonomidata",
    "search.groupCountries": "Länder", "search.groupActivities": "K-taxonomiaktiviteter", "search.groupPages": "Sidor & verktyg",
    "advisor.tabCompare": "Jämförelse av flera länder", "advisor.tabCountry": "Landsspecifik rådgivare", "advisor.tabPortfolio": "Portföljjämförelse", "advisor.tabAsk": "Fråga AI",
    "search.title": "Sök", "search.close": "Stäng",
    "translate.button": "Översätt", "translate.modalTitle": "Översatt dokument",
    "translate.loading": "Översätter dokumentet\u2026",
    "translate.loadingPart": "Översätter del {n} av {total}…",
    "translate.disclaimer": "Maskinöversättning av ett officiellt dokument, endast som referens \u2014 se alltid originalet för juridiska eller regelefterlevnadssyften.",
    "sources.note": "Den här översikten är sammanställd från de officiella dokument och regulatoriska källor som listas ovan.",
    "sources.lastReviewed": "Innehållet senast sammanställt/granskat:", "about.resourcesHeading": "Viktiga referensresurser", "about.resourcesIntro": "Varje landssida länkar direkt till sina officiella myndighets-/regulatorsdokument och, där sidan innehåller en detaljerad beskrivning, numrerade källhänvisningar för varje specifikt påstående. Utöver dessa primärkällor är dessa övergripande resurser användbara för att förstå och jämföra taxonomier globalt.", "about.resourcesColResource": "Resurs", "about.resourcesColDescription": "Beskrivning", "about.resourcesColLink": "Länk", "footer.references": "Källor", "country.generalResources": "Allmänna referensresurser",
    "country.noTaxonomyEstablished": "Ingen taxonomi etablerad",
    "country.tableCountry": "Land",
    "country.tableTaxonomyName": "Taxonominamn",
    "country.notEstablished": "Ej etablerad",
    "country.tableStatus": "Status",
    "country.tableRegulator": "Reglerare",
    "country.notPubliclySpecified": "Ej offentligt specificerad",
    "country.tableYearPublished": "År publicerad",
    "country.notSpecified": "Ej specificerat",
    "country.tableRegion": "Region",
    "country.notYetDocumented": "Ännu inte dokumenterat för denna taxonomi.",
    "country.colActivity": "Aktivitet",
    "country.colScreeningCriteria": "Granskningskriterier",
    "country.colThreshold": "Tröskelvärde",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "Se officiell dokumentation",
    "country.dnshAppliesDefault": "Gäller",
    "country.viewAllCriteria": "Visa alla kriterier (officiell källa)",
    "country.officialSourceLabel": "Officiell källa:",
    "country.singleSourceNote": "Endast en allmän källänk har sammanställts för detta land hittills — en mer omfattande lista över officiella dokument kan läggas till senare.",
    "country.noSourceYet": "Ingen officiell källänk har sammanställts för detta land ännu.",
    "country.mediaTagDocument": "Dokument",
    "country.officialTaxonomyDocumentation": "Officiell taxonomidokumentation",
    "country.mediaTagRegional": "Regional",
    "country.moreUpdatesComingSoon": "Fler uppdateringar kommer snart",
    "country.chatPlaceholder": "Ställ en fråga…",
    "country.chatDisclaimer": "Anropar en riktig AI-modell via en säker backend. Om den inte svarar kan sajten ännu inte vara driftsatt med en API-nyckel — se DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Taxonomiöversikt",
    "country.headingAboutTaxonomy": "Om taxonomin",
    "country.limitedInfoNote": "Begränsad offentlig information sammanställd hittills — sammanfattningen kan utökas när fler källor granskats.",
    "country.noDataCompiledYet": "Ingen taxonomidata har sammanställts för detta land ännu.",
    "country.headingOfficialDocuments": "Officiella dokument",
    "country.headingEnvironmentalObjectives": "Miljömål",
    "country.headingTechnicalCriteria": "Tekniska granskningskriterier",
    "country.headingAlsoApplies": "Gäller även",
    "country.headingRelatedMedia": "Relaterad media och uppdateringar",
    "country.headingAiChat": "AI-efterlevnadschatt",
    "country.headingCompare": "Jämför med en annan taxonomi",
    "country.compareAllCountriesBtn": "Jämför alla länder",
    "country.noCountrySelected": "Inget land valt",
    "country.goBackToMap": "Gå tillbaka till kartan och klicka på ett land för att se dess taxonomiprofil.",
    "country.compareWithLabel": "Jämför {name}s taxonomi med:",
    "country.rowMandatoryVoluntary": "Obligatorisk / Frivillig",
    "country.rowRequiresDnsh": "Kräver DNSH",
    "country.rowRequiresSafeguards": "Kräver minimiskyddsåtgärder",
    "country.rowSectorsCovered": "Täckta sektorer",
    "country.notDocumented": "Ej dokumenterat",
    "country.yes": "Ja",
    "country.no": "Nej",
    "country.publishedPrefix": "Publicerad",
    "country.sourceLinkLabel": "källa",
    "country.chatWelcomeDefault": "Fråga vad som helst om denna taxonomi.",
    "country.chatWelcomeWithName": "Fråga vad som helst om {name}s taxonomi — inklusive hur den jämförs med andra, som EU:s taxonomi eller Sydkoreas K-Taxonomy.",
    "country.chatExampleCompare": "Jämför {name}s taxonomi med EU:s taxonomi",
    "country.chatExampleCriteria": "Vilka är de viktigaste granskningskriterierna under {taxonomy}?",
    "country.chatExampleDocumentation": "Vilken dokumentation skulle jag behöva för att visa efterlevnad här?",
    "country.chatExampleSimilar": "Vilka andra länder har liknande taxonomier som {name}?",
    "translate.viewOriginal": "Visa original-PDF \u2197", "translate.close": "Stäng",
    "translate.language": "Översätt till", "translate.originalPane": "Original", "translate.translatedPane": "Översättning",
    "translate.errorGeneric": "Det gick inte att översätta dokumentet just nu.",
    "translate.errorNotDeployed": "Översätt kräver den live serverdelen, som inte är ansluten här — detta fungerar först när webbplatsen är driftsatt på Vercel med en API-nyckel (se DEPLOY_INSTRUCTIONS.md). Du kan fortfarande öppna original-PDF:en nedan.",
    "translate.truncatedNote": "Dokumentet är långt \u2014 endast en översättning av den första delen visas.",
    "translate.previewUnavailable": "Förhandsgranskning är inte tillgänglig för denna källa — källan blockerar automatisk förhandsgranskning. Använd \"Visa original-PDF\" nedan för att öppna den direkt i din webbläsare.",
    "home.heroTitle": "Utforska hållbara finanstaxonomier världen över",
    "home.heroSub": "Välj ett land på kartan, eller använd sökfältet nedan.",
    "home.chipAllRegions": "Alla regioner", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asien-Stillahavsregionen",
    "home.chipAmericas": "Amerika", "home.chipAfrica": "Afrika", "home.chipMiddleEast": "Mellanöstern",
    "home.chipAllStatuses": "Alla statusar", "home.chipDeveloped": "Utvecklad",
    "home.chipUnderDevelopment": "Under utveckling", "home.chipNoTaxonomy": "Ingen taxonomi",
    "home.globalStats": "Global statistik", "home.totalCountriesTracked": "Totalt antal länder som bevakas",
    "home.recentlyUpdated": "Senast uppdaterat", "home.askAi": "Fråga AI",
    "home.objectiveFilterHeading": "Filtrera på miljömål", "home.sectorFilterHeading": "Filtrera på sektor",
    "home.advancedFiltersToggle": "Avancerad sökning & filtrering",
    "home.objAll": "Alla miljömål", "home.objClimateMitigation": "Begränsning av klimatförändringar", "home.objClimateAdaptation": "Klimatanpassning",
    "home.objBiodiversity": "Biologisk mångfald & ekosystem", "home.objWater": "Vatten- & marina resurser", "home.objCircular": "Cirkulär ekonomi",
    "home.objPollution": "Förebyggande av föroreningar", "home.objEnergy": "Energi", "home.objIndustry": "Industri & omställning",
    "home.secAll": "Alla sektorer", "home.secAgriculture": "Jordbruk", "home.secBuildings": "Byggnader",
    "home.secEcologicalRestoration": "Ekologisk restaurering", "home.secEnergy": "Energi", "home.secEnergyTransition": "Energiomställning",
    "home.secEnvironmentalProtection": "Miljöskydd", "home.secGreenServicesTrade": "Gröna tjänster & handel", "home.secICTDigital": "IKT & digitalt",
    "home.secInfrastructure": "Infrastruktur", "home.secManufacturing": "Tillverkning", "home.secNuclearTransition": "Kärnkraft & omställningsindustrier",
    "home.secResourceRecycling": "Materialåtervinning", "home.secTransport": "Transport", "home.secWasteManagement": "Avfallshantering", "home.secWater": "Vatten",
    "home.matchingCountriesHeading": "Matchande länder", "home.noMatchingCountries": "Inga länder matchar dessa filter än.",
    "home.partialDataNote": "Filter för miljömål och sektor matchar just nu bara mot de länder vi hittills sammanställt den detaljnivån för — andra kanske inte visas här än, även om deras taxonomi skulle kunna täcka det.",
    "about.missionHeading": "Om plattformen",
    "about.missionText": "Taxonomier för hållbar finansiering — regelverken som definierar vilka ekonomiska aktiviteter som räknas som \"gröna\" eller \"hållbara\" — växer snabbt i antal, men är utspridda över dussintals myndighetswebbplatser, PDF:er och språk. Den som vill jämföra EU-taxonomin med Koreas K-Taxonomy, eller kontrollera om en viss aktivitet omfattas någonstans, måste pussla ihop det för hand. Den här plattformen samlar informationen på ett interaktivt ställe: en karta över var taxonomier står idag, sida-vid-sida-jämförelser, direkta länkar till de officiella originaldokumenten, och en AI-rådgivare som svarar på specifika frågor — så att tillsynsmyndigheter, investerare och företag kan navigera snabbare och med färre blinda fläckar.",
    "about.featurePill1": "Interaktiv global karta", "about.featurePill2": "AI-taxonomirådgivare",
    "about.featurePill3": "Medie- och trendhubb", "about.featurePill4": "Jämförelse sida vid sida",
    "about.featurePill5": "Officiella källdokument",
    "about.teamHeading": "Plattformens team", "about.coreDeveloper": "Kärnutvecklare",
    "about.supervisorRole": "Handledare · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Om BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS är en Seoulbaserad \"Beyond Net Zero\"-affärsgrupp verksam inom rådgivning, policy-tankesmedja och klimattekniska investeringar. Företaget har varit direkt involverat i utformningen av Sydkoreas viktigaste klimatpolitik, inklusive K-ETS (utsläppshandelssystemet) och själva K-Taxonomy, och rådger finansiella institutioner, industri och myndigheter om nollutsläppsstrategi, hållbarhetsrapportering och grön finansiering. Den här plattformen är en del av BNZ PARTNERS nyare AI Centre-satsning — att använda AI för att göra taxonomier för hållbar finansiering enklare att navigera, jämföra och agera på, med utgångspunkt i företagets befintliga K-Taxonomy-policyarbete.",
    "about.contactHeading": "Frågor, feedback, eller vill samarbeta?",
    "about.contactSub": "Hör av dig, eller prenumerera på uppdateringar när plattformen växer.",
    "about.contactUs": "Kontakta oss",
    "subscribe.heading": "Prenumerera på veckobrevet",
    "subscribe.lede": "Få en veckovis sammanfattning av taxonominyheter, rapporter, AI-trendinsikter och nyheter från BNZ Partners, direkt till din inkorg. Bara din e-postadress krävs — allt annat är valfritt.",
    "subscribe.sampleBanner": "Detta formulär lägger till prenumeranter i en riktig Brevo-e-postlista när sajten driftsätts med en Brevo API-nyckel (se DEPLOY_INSTRUCTIONS.md). Att faktiskt skicka veckobrevet görs fortfarande manuellt från Brevo-panelen — det här formuläret hanterar bara anmälningar.",
    "subscribe.emailLabel": "E-postadress", "subscribe.nameLabel": "Namn", "subscribe.optional": "(valfritt)",
    "subscribe.interestLabel": "Intresseområde", "subscribe.interestEu": "EU-taxonomiuppdateringar",
    "subscribe.interestApac": "Asien-Stillahavstaxonomier", "subscribe.interestGreenBonds": "Gröna obligationer & finans",
    "subscribe.interestCompliance": "Regelefterlevnad & granskning", "subscribe.langLabel": "Språkinställning",
    "subscribe.consentComms": "Jag samtycker till att få veckobrevet och enstaka plattformsuppdateringar från Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "Jag har läst och godkänner integritetspolicyn, och samtycker till att mina uppgifter behandlas i enlighet med GDPR (EU) och PIPA (Sydkorea).",
    "subscribe.submitBtn": "Prenumerera gratis",
    "subscribe.privacyNote": "Vi använder bara din e-post för att skicka veckobrevet du anmält dig till — den sparas i vår Brevo-e-postlista och säljs eller delas inte. Du kan avsluta prenumerationen när som helst via länken som finns i de e-postmeddelanden du får.",
    "subscribe.managePrefs": "Hantera dina inställningar", "subscribe.backToMedia": "Tillbaka till Mediehubben",
    "subscribe.benefit1Title": "Veckobrev", "subscribe.benefit1Text": "En kortfattad måndagsmorgon-sammanfattning av veckans taxonominyheter, rapporter och regeluppdateringar.",
    "subscribe.benefit2Title": "Plattformsaviseringar", "subscribe.benefit2Text": "Få veta först när ett lands taxonomistatus ändras, eller ett nytt officiellt dokument publiceras.",
    "subscribe.benefit3Title": "BNZ PARTNERS-insikter", "subscribe.benefit3Text": "Enstaka analyser från BNZ Partners AI Centre om nya taxonomi- och regelefterlevnadsteman.",
    "subscribe.benefit4Title": "Eventinbjudningar", "subscribe.benefit4Text": "Inbjudningar till webbinarier, paneldiskussioner och genomgångar om taxonomier för hållbar finansiering världen över.",
    "prefs.heading": "Prenumerantinställningar", "prefs.lede": "Hantera dina ämnen för veckobrevet, språk och kommunikationsinställningar.",
    "prefs.sampleBanner": "Demo-inställningscenter — endast för illustration. Det finns inget riktigt prenumerantkonto bakom den här sidan, så inget här sparas, och fälten visas förifyllda med exempeldata. I den riktiga produkten skulle befintliga prenumeranter hamna här efter att ha klickat på en länk i sitt veckobrev.",
    "prefs.saveBtn": "Spara inställningar (demo — inaktiverad)",
    "prefs.privacyNote": "Den här skärmen är en icke-funktionell platshållare. För att faktiskt ändra dina intressen eller språk i framtiden skulle du använda en sida som denna, men den är inte kopplad till en riktig prenumerantdatabas ännu.",
    "prefs.unsubscribeLink": "Avsluta prenumeration (demo — inaktiverad)", "prefs.backToSubscribe": "Tillbaka till Prenumerera",
    "media.heading": "Global medie- och trendhubb", "media.lede": "Taxonomirelaterade medier och AI-genererade trendinsikter, på ett ställe.",
    "media.sampleBanner": "Den här sidan samlar riktigt, live-innehåll: nyheter, rapporter och papper via Google News, samt AI-trendinsikter och det tematiska diagrammet via live AI-analys av det innehållet. Tidslinjediagrammet för taxonomiutveckling nedan bygger på webbplatsens egna riktiga data.",
    "media.filterAll": "Alla", "media.filterNews": "Nyheter", "media.filterReports": "Rapporter",
    "media.filterPapers": "Papper",
    "media.searchPlaceholder": "Sök medier…", "media.trendLabel": "AI-trendinsikter",
    "media.timelineHeading": "Tidslinje för taxonomiutveckling",
    "media.timelineNote": "Riktig data — antal publicerade taxonomier per år, från det sammanställda datasetet.",
    "media.thematicHeading": "Tematiska policytrender",
    "media.thematicNote": "AI-uppskattad viktning baserad på live-analys av senaste rubrikerna — uppdateras regelbundet.",
    "media.ctaHeading": "Få veckans taxonomibrev",
    "media.ctaText": "En veckovis sammanfattning av taxonominyheter, rapporter och trendinsikter — gratis.",
    "media.ctaBtn": "Prenumerera gratis",
    "country.backToMap": "Tillbaka till kartan", "country.backToAdvisor": "Tillbaka till AI-rådgivaren",
    "home.filterLogicNote": "Alla filter gäller samtidigt — ett land måste matcha varje val.", "home.activeFiltersLabel": "Aktiva filter", "country.translatingContent": "Översätter sidans innehåll…",
    "chat.toggleLabel": "Fråga AI-assistenten", "chat.title": "AI-assistent",
    "chat.subtitle": "Fråga om taxonomibegrepp, jämför länder, eller hitta rätt på sajten.",
    "chat.placeholder": "Skriv din fråga…", "chat.send": "Skicka",
    "chat.greeting": "Hej! Jag kan förklara taxonomibegrepp, jämföra länder, eller visa dig rätt sida. Vad vill du veta?",
    "chat.thinking": "Tänker…",
    "chat.errorGeneric": "Kunde inte nå assistenten just nu — försök igen.",
    "chat.errorNotDeployed": "Assistenten kräver den live serverdelen, som inte är ansluten här — detta fungerar först när webbplatsen är driftsatt på Vercel med en API-nyckel (se DEPLOY_INSTRUCTIONS.md)."
  },
  ko: {
    "nav.map": "인터랙티브 글로벌 지도", "nav.advisor": "AI 어드바이저", "nav.media": "미디어 허브",
    "nav.subscribe": "구독", "nav.resources": "자료", "nav.about": "소개",
    "nav.comingSoon": "출시 예정", "nav.toggleTheme": "테마 전환", "nav.search": "검색",
    "footer.developedBy": "개발", "footer.supervisedBy": "감수", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "감수",
    "search.placeholder": "사이트 전체 검색 — 국가, 판단기준, 경제활동, 페이지…", "search.mapPlaceholder": "국가, 택소노미 또는 규제 기관으로 검색…", "search.noMatches": "검색 결과 없음", "search.noTaxonomyData": "택소노미 데이터 없음",
    "search.groupCountries": "국가", "search.groupActivities": "K-Taxonomy 경제활동", "search.groupPages": "페이지 · 기능",
    "advisor.tabCompare": "다국가 비교", "advisor.tabCountry": "국가별 어드바이저", "advisor.tabPortfolio": "포트폴리오 비교", "advisor.tabAsk": "AI에게 질문",
    "search.title": "검색", "search.close": "닫기",
    "translate.button": "번역", "translate.modalTitle": "번역된 문서",
    "translate.loading": "문서를 번역하는 중\u2026",
    "translate.loadingPart": "{total}부분 중 {n}번째 부분 번역 중…",
    "translate.disclaimer": "공식 문서의 기계 번역이며 참고용입니다 \u2014 법적 또는 규정 준수 목적으로는 항상 원본을 참조하십시오.",
    "sources.note": "이 개요는 위에 나열된 공식 문서 및 규제 출처를 바탕으로 작성되었습니다.",
    "sources.lastReviewed": "콘텐츠 최종 작성/검토일:", "about.resourcesHeading": "주요 참고 자료", "about.resourcesIntro": "각 국가 페이지는 공식 정부/규제 기관 문서로 직접 연결되며, 상세 설명이 포함된 페이지에는 각 구체적 주장에 대한 번호가 매겨진 출처 표시가 있습니다. 이러한 1차 자료와 더불어, 아래의 포괄적인 자료들은 전 세계 택소노미를 이해하고 비교하는 데 유용합니다.", "about.resourcesColResource": "자료", "about.resourcesColDescription": "설명", "about.resourcesColLink": "링크", "footer.references": "출처", "country.generalResources": "일반 참고 자료",
    "country.noTaxonomyEstablished": "택소노미가 수립되지 않음",
    "country.tableCountry": "국가",
    "country.tableTaxonomyName": "택소노미 이름",
    "country.notEstablished": "수립되지 않음",
    "country.tableStatus": "상태",
    "country.tableRegulator": "규제 기관",
    "country.notPubliclySpecified": "공개적으로 명시되지 않음",
    "country.tableYearPublished": "발행 연도",
    "country.notSpecified": "명시되지 않음",
    "country.tableRegion": "지역",
    "country.notYetDocumented": "이 택소노미에 대해 아직 문서화되지 않았습니다.",
    "country.colActivity": "활동",
    "country.colScreeningCriteria": "심사 기준",
    "country.colThreshold": "임계값",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "공식 문서 참조",
    "country.dnshAppliesDefault": "적용됨",
    "country.viewAllCriteria": "모든 기준 보기 (공식 출처)",
    "country.officialSourceLabel": "공식 출처:",
    "country.singleSourceNote": "현재까지 이 국가에 대해 하나의 일반 출처 링크만 수집되었습니다 — 향후 더 완전한 공식 문서 목록이 추가될 수 있습니다.",
    "country.noSourceYet": "이 국가에 대한 공식 출처 링크가 아직 수집되지 않았습니다.",
    "country.mediaTagDocument": "문서",
    "country.officialTaxonomyDocumentation": "공식 택소노미 문서",
    "country.mediaTagRegional": "지역(권역)",
    "country.moreUpdatesComingSoon": "추가 업데이트 예정",
    "country.chatPlaceholder": "질문을 입력하세요…",
    "country.chatDisclaimer": "안전한 백엔드를 통해 실제 AI 모델을 호출합니다. 응답이 없다면 이 사이트가 아직 API 키와 함께 배포되지 않았을 수 있습니다 — DEPLOY_INSTRUCTIONS.md를 참고하세요.",
    "country.headingOverview": "택소노미 개요",
    "country.headingAboutTaxonomy": "택소노미 소개",
    "country.limitedInfoNote": "지금까지 수집된 공개 정보가 제한적입니다 — 추가 자료 검토에 따라 이 요약은 확장될 수 있습니다.",
    "country.noDataCompiledYet": "이 국가에 대한 택소노미 데이터가 아직 수집되지 않았습니다.",
    "country.headingOfficialDocuments": "공식 문서",
    "country.headingEnvironmentalObjectives": "환경 목표",
    "country.headingTechnicalCriteria": "기술 심사 기준",
    "country.headingAlsoApplies": "추가 적용 사항",
    "country.headingRelatedMedia": "관련 미디어 및 업데이트",
    "country.headingAiChat": "AI 컴플라이언스 채팅",
    "country.headingCompare": "다른 택소노미와 비교",
    "country.compareAllCountriesBtn": "모든 국가 비교",
    "country.noCountrySelected": "선택된 국가 없음",
    "country.goBackToMap": "지도로 돌아가서 국가를 클릭하면 해당 택소노미 프로필을 볼 수 있습니다.",
    "country.compareWithLabel": "{name}의 택소노미와 비교:",
    "country.rowMandatoryVoluntary": "의무 / 자율",
    "country.rowRequiresDnsh": "DNSH 요구 여부",
    "country.rowRequiresSafeguards": "최소 안전장치 요구 여부",
    "country.rowSectorsCovered": "적용 대상 부문",
    "country.notDocumented": "문서화되지 않음",
    "country.yes": "예",
    "country.no": "아니요",
    "country.publishedPrefix": "발행",
    "country.sourceLinkLabel": "출처",
    "country.chatWelcomeDefault": "이 택소노미에 대해 무엇이든 물어보세요.",
    "country.chatWelcomeWithName": "{name}의 택소노미에 대해 무엇이든 물어보세요 — EU 택소노미나 한국의 K-택소노미와 어떻게 비교되는지 등을 포함해서요.",
    "country.chatExampleCompare": "{name}의 택소노미를 EU 택소노미와 비교",
    "country.chatExampleCriteria": "{taxonomy}의 주요 심사 기준은 무엇인가요?",
    "country.chatExampleDocumentation": "여기서 준수를 입증하려면 어떤 서류가 필요한가요?",
    "country.chatExampleSimilar": "{name}과(와) 유사한 택소노미를 가진 다른 국가는 어디인가요?",
    "translate.viewOriginal": "원본 PDF 보기 \u2197", "translate.close": "닫기",
    "translate.language": "번역 언어", "translate.originalPane": "원본", "translate.translatedPane": "번역",
    "translate.errorGeneric": "지금은 이 문서를 번역할 수 없습니다.",
    "translate.errorNotDeployed": "번역 기능은 실제 서버 백엔드가 필요하지만 현재 연결되어 있지 않습니다 — 이 기능은 사이트가 API 키와 함께 Vercel에 배포된 후에만 작동합니다(DEPLOY_INSTRUCTIONS.md 참고). 아래에서 원본 PDF는 계속 열어볼 수 있습니다.",
    "translate.truncatedNote": "문서가 길어서 처음 일부만 번역하여 표시합니다.",
    "translate.previewUnavailable": "이 소스는 자동 미리보기 로딩을 차단하여 미리보기를 사용할 수 없습니다. 아래의 \"원본 PDF 보기\"를 사용해 브라우저에서 직접 여세요.",
    "home.heroTitle": "전 세계 지속가능금융 택소노미 살펴보기",
    "home.heroSub": "지도에서 국가를 선택하거나 아래 검색창을 이용하세요.",
    "home.chipAllRegions": "전체 지역", "home.chipEurope": "유럽", "home.chipAsiaPacific": "아시아·태평양",
    "home.chipAmericas": "아메리카", "home.chipAfrica": "아프리카", "home.chipMiddleEast": "중동",
    "home.chipAllStatuses": "전체 상태", "home.chipDeveloped": "구축 완료",
    "home.chipUnderDevelopment": "개발 중", "home.chipNoTaxonomy": "택소노미 없음",
    "home.globalStats": "글로벌 통계", "home.totalCountriesTracked": "추적 중인 총 국가 수",
    "home.recentlyUpdated": "최근 업데이트", "home.askAi": "AI에게 질문",
    "home.objectiveFilterHeading": "환경 목표별 필터", "home.sectorFilterHeading": "부문별 필터",
    "home.advancedFiltersToggle": "고급 검색 및 필터링",
    "home.objAll": "모든 환경 목표", "home.objClimateMitigation": "기후변화 완화", "home.objClimateAdaptation": "기후변화 적응",
    "home.objBiodiversity": "생물다양성 및 생태계", "home.objWater": "수자원 및 해양자원", "home.objCircular": "순환 경제",
    "home.objPollution": "오염 방지", "home.objEnergy": "에너지", "home.objIndustry": "산업 및 전환",
    "home.secAll": "모든 부문", "home.secAgriculture": "농업", "home.secBuildings": "건물",
    "home.secEcologicalRestoration": "생태 복원", "home.secEnergy": "에너지", "home.secEnergyTransition": "에너지 전환",
    "home.secEnvironmentalProtection": "환경 보호", "home.secGreenServicesTrade": "녹색 서비스 및 무역", "home.secICTDigital": "ICT 및 디지털",
    "home.secInfrastructure": "인프라", "home.secManufacturing": "제조업", "home.secNuclearTransition": "원자력 및 전환 산업",
    "home.secResourceRecycling": "자원 재활용", "home.secTransport": "운송", "home.secWasteManagement": "폐기물 관리", "home.secWater": "수자원",
    "home.matchingCountriesHeading": "일치하는 국가", "home.noMatchingCountries": "아직 이 필터와 일치하는 국가가 없습니다.",
    "home.partialDataNote": "환경 목표 및 부문 필터는 현재까지 해당 세부 정보를 수집한 국가에 한해 적용됩니다 — 택소노미가 해당 분야를 다루더라도 아직 여기 표시되지 않을 수 있습니다.",
    "about.missionHeading": "플랫폼 소개",
    "about.missionText": "어떤 경제 활동이 \"녹색\" 또는 \"지속가능\"한지 정의하는 규칙집인 지속가능금융 택소노미는 빠르게 늘어나고 있지만, 수십 개의 정부 웹사이트와 PDF, 언어에 흩어져 있습니다. EU 택소노미와 한국의 K-택소노미를 비교하거나 특정 활동이 어딘가에서 다뤄지는지 확인하려는 사람은 이를 직접 손으로 짜맞춰야 합니다. 이 플랫폼은 그 정보를 하나의 인터랙티브한 공간으로 모읍니다: 오늘날 택소노미의 현황을 보여주는 지도, 나란히 비교, 공식 원문 문서로의 직접 링크, 그리고 구체적인 질문에 답하는 AI 어드바이저까지 — 규제 기관, 투자자, 기업이 더 빠르고 사각지대 없이 이 지형을 탐색할 수 있도록 돕습니다.",
    "about.featurePill1": "인터랙티브 글로벌 지도", "about.featurePill2": "AI 택소노미 어드바이저",
    "about.featurePill3": "미디어 및 트렌드 허브", "about.featurePill4": "나란히 비교",
    "about.featurePill5": "공식 출처 문서",
    "about.teamHeading": "플랫폼 팀", "about.coreDeveloper": "핵심 개발자",
    "about.supervisorRole": "감수 · BNZ PARTNERS Head of AI Centre",
    "about.bnzHeading": "BNZ PARTNERS 소개",
    "about.bnzText": "BNZ PARTNERS는 자문, 정책 싱크탱크, 클라이밋테크 투자를 아우르는 서울 소재 \"Beyond Net Zero\" 비즈니스 그룹입니다. 이 회사는 K-ETS(배출권거래제)와 K-Taxonomy 자체를 포함한 한국의 주요 기후 정책 설계에 직접 참여해 왔으며, 금융기관·산업·정부에 넷제로 전략, 지속가능성 공시, 녹색금융에 대해 자문하고 있습니다. 이 플랫폼은 BNZ PARTNERS의 새로운 AI Centre 이니셔티브의 일환으로, 회사의 기존 K-Taxonomy 정책 업무를 바탕으로 AI를 활용해 지속가능금융 택소노미를 더 쉽게 탐색·비교·활용할 수 있도록 합니다.",
    "about.contactHeading": "질문, 피드백 또는 협업을 원하시나요?",
    "about.contactSub": "연락하시거나, 플랫폼이 성장함에 따라 업데이트를 받아보세요.",
    "about.contactUs": "문의하기",
    "subscribe.heading": "주간 다이제스트 구독하기",
    "subscribe.lede": "택소노미 뉴스, 보고서, AI 트렌드 인사이트, 그리고 BNZ Partners 소식을 주간 요약으로 받은편지함에서 받아보세요. 이메일 주소만 필수이며 나머지는 모두 선택 사항입니다.",
    "subscribe.sampleBanner": "이 양식은 Brevo API 키로 사이트가 배포되면 실제 Brevo 메일링 리스트에 구독자를 추가합니다(DEPLOY_INSTRUCTIONS.md 참조). 실제로 주간 다이제스트를 발송하는 것은 여전히 Brevo 대시보드에서 수동으로 해야 합니다 — 이 양식은 가입만 처리합니다.",
    "subscribe.emailLabel": "이메일 주소", "subscribe.nameLabel": "이름", "subscribe.optional": "(선택 사항)",
    "subscribe.interestLabel": "관심 분야", "subscribe.interestEu": "EU 택소노미 업데이트",
    "subscribe.interestApac": "아시아·태평양 택소노미", "subscribe.interestGreenBonds": "녹색채권 및 금융",
    "subscribe.interestCompliance": "컴플라이언스 및 검증", "subscribe.langLabel": "언어 설정",
    "subscribe.consentComms": "Global Sustainable Taxonomies / BNZ Partners로부터 주간 다이제스트와 간헐적인 플랫폼 업데이트를 받는 것에 동의합니다.",
    "subscribe.consentPrivacy": "개인정보처리방침을 읽고 동의하며, GDPR(EU) 및 PIPA(대한민국)에 따라 제 데이터가 처리되는 것에 동의합니다.",
    "subscribe.submitBtn": "무료로 구독하기",
    "subscribe.privacyNote": "귀하의 이메일은 신청하신 다이제스트 발송에만 사용됩니다 — Brevo 메일링 리스트에 저장되며 판매되거나 공유되지 않습니다. 받으시는 이메일에 포함된 링크를 통해 언제든지 구독을 취소할 수 있습니다.",
    "subscribe.managePrefs": "환경설정 관리", "subscribe.backToMedia": "미디어 허브로 돌아가기",
    "subscribe.benefit1Title": "주간 다이제스트", "subscribe.benefit1Text": "이번 주 택소노미 뉴스, 보고서, 규제 업데이트를 월요일 아침에 간결하게 요약해 드립니다.",
    "subscribe.benefit2Title": "플랫폼 알림", "subscribe.benefit2Text": "국가의 택소노미 상태가 변경되거나 새 공식 문서가 게시되면 가장 먼저 알려드립니다.",
    "subscribe.benefit3Title": "BNZ PARTNERS 인사이트", "subscribe.benefit3Text": "BNZ Partners AI Centre가 전하는 새로운 택소노미 및 컴플라이언스 주제에 대한 분석 콘텐츠입니다.",
    "subscribe.benefit4Title": "이벤트 초대", "subscribe.benefit4Text": "전 세계 지속가능금융 택소노미에 관한 웨비나, 패널 토론, 브리핑 초대장을 받아보세요.",
    "prefs.heading": "구독자 환경설정", "prefs.lede": "다이제스트 주제, 언어 및 커뮤니케이션 설정을 관리하세요.",
    "prefs.sampleBanner": "데모 환경설정 센터 — 예시 목적으로만 제공됩니다. 이 페이지 뒤에는 실제 구독자 계정이 없으므로 여기서는 아무것도 저장되지 않으며, 필드에는 예시 데이터가 미리 채워져 있습니다. 실제 제품에서는 기존 구독자가 다이제스트 이메일의 링크를 클릭한 후 이곳으로 이동하게 됩니다.",
    "prefs.saveBtn": "환경설정 저장 (데모 — 비활성화됨)",
    "prefs.privacyNote": "이 화면은 작동하지 않는 자리표시자입니다. 앞으로 관심사나 언어를 실제로 변경하려면 이와 같은 페이지를 사용하겠지만, 아직 실제 구독자 데이터베이스에 연결되어 있지 않습니다.",
    "prefs.unsubscribeLink": "구독 취소 (데모 — 비활성화됨)", "prefs.backToSubscribe": "구독 페이지로 돌아가기",
    "media.heading": "글로벌 미디어 및 트렌드 허브", "media.lede": "택소노미 관련 미디어와 AI 생성 트렌드 인사이트를 한곳에서 만나보세요.",
    "media.sampleBanner": "이 페이지는 실시간 실제 콘텐츠를 수집합니다: Google 뉴스를 통한 뉴스·보고서·논문, 그리고 해당 콘텐츠에 대한 실시간 AI 분석을 통한 AI 트렌드 인사이트와 테마별 차트입니다. 아래 택소노미 개발 타임라인 차트는 이 사이트의 실제 데이터를 사용합니다.",
    "media.filterAll": "전체", "media.filterNews": "뉴스", "media.filterReports": "보고서",
    "media.filterPapers": "논문",
    "media.searchPlaceholder": "미디어 검색…", "media.trendLabel": "AI 트렌드 인사이트",
    "media.timelineHeading": "택소노미 발전 타임라인",
    "media.timelineNote": "실제 데이터 — 편집된 데이터셋 기준 연도별 발표된 택소노미 수.",
    "media.thematicHeading": "주제별 정책 트렌드",
    "media.thematicNote": "최근 헤드라인의 실시간 분석을 기반으로 AI가 추정한 가중치입니다 — 주기적으로 업데이트됩니다.",
    "media.ctaHeading": "주간 택소노미 다이제스트 받기",
    "media.ctaText": "택소노미 뉴스, 보고서, 트렌드 인사이트를 담은 주간 요약 — 무료입니다.",
    "media.ctaBtn": "무료로 구독하기",
    "country.backToMap": "지도로 돌아가기", "country.backToAdvisor": "AI 어드바이저로 돌아가기",
    "home.filterLogicNote": "선택한 조건은 모두 동시에 적용됩니다 — 전부 충족하는 국가만 표시됩니다.", "home.activeFiltersLabel": "적용된 필터", "country.translatingContent": "이 페이지의 콘텐츠를 번역하는 중…",
    "chat.toggleLabel": "AI 어시스턴트에게 질문", "chat.title": "AI 어시스턴트",
    "chat.subtitle": "택소노미 용어를 질문하거나, 국가를 비교하거나, 사이트 내 원하는 곳을 찾아보세요.",
    "chat.placeholder": "질문을 입력하세요…", "chat.send": "전송",
    "chat.greeting": "안녕하세요! 택소노미 용어 설명, 국가 비교, 또는 원하는 페이지 안내를 도와드릴 수 있습니다. 무엇이 궁금하신가요?",
    "chat.thinking": "생각 중…",
    "chat.errorGeneric": "지금은 어시스턴트에 연결할 수 없습니다 — 다시 시도해 주세요.",
    "chat.errorNotDeployed": "어시스턴트는 실제 서버 백엔드가 필요하지만 현재 연결되어 있지 않습니다 — 이 기능은 사이트가 API 키와 함께 Vercel에 배포된 후에만 작동합니다(DEPLOY_INSTRUCTIONS.md 참고)."
  },
  es: {
    "nav.map": "Mapa Global Interactivo", "nav.advisor": "Asesor de IA", "nav.media": "Centro de Medios",
    "nav.subscribe": "Suscribirse", "nav.resources": "Recursos", "nav.about": "Acerca de",
    "nav.comingSoon": "Próximamente", "nav.toggleTheme": "Cambiar tema", "nav.search": "Buscar",
    "footer.developedBy": "Desarrollado por", "footer.supervisedBy": "Supervisado por", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Supervisora",
    "search.placeholder": "Busque en todo el sitio: países, criterios, actividades, páginas…", "search.mapPlaceholder": "Buscar por país, taxonomía o regulador…", "search.noMatches": "Sin resultados", "search.noTaxonomyData": "Sin datos de taxonomía",
    "search.groupCountries": "Países", "search.groupActivities": "Actividades de la K-Taxonomy", "search.groupPages": "Páginas y herramientas",
    "advisor.tabCompare": "Comparación entre países", "advisor.tabCountry": "Asesor por país", "advisor.tabPortfolio": "Comparación de cartera", "advisor.tabAsk": "Preguntar a la IA",
    "search.title": "Buscar", "search.close": "Cerrar",
    "translate.button": "Traducir", "translate.modalTitle": "Documento traducido",
    "translate.loading": "Traduciendo este documento\u2026",
    "translate.loadingPart": "Traduciendo la parte {n} de {total}…",
    "translate.disclaimer": "Traducción automática de un documento oficial, solo como referencia \u2014 consulte siempre el original para fines legales o de cumplimiento.",
    "sources.note": "Este resumen se ha elaborado a partir de los documentos oficiales y las fuentes regulatorias enumeradas arriba.",
    "sources.lastReviewed": "Contenido compilado/revisado por última vez:", "about.resourcesHeading": "Recursos de Referencia Clave", "about.resourcesIntro": "Cada página de país enlaza directamente con sus documentos oficiales del gobierno/regulador y, cuando la página incluye una descripción detallada, citas numeradas para cada afirmación específica. Junto con esas fuentes primarias, estos recursos transversales son útiles para entender y comparar taxonomías a nivel mundial.", "about.resourcesColResource": "Recurso", "about.resourcesColDescription": "Descripción", "about.resourcesColLink": "Enlace", "footer.references": "Fuentes", "country.generalResources": "Recursos Generales de Referencia",
    "country.noTaxonomyEstablished": "No se ha establecido una taxonomía",
    "country.tableCountry": "País",
    "country.tableTaxonomyName": "Nombre de la taxonomía",
    "country.notEstablished": "No establecida",
    "country.tableStatus": "Estado",
    "country.tableRegulator": "Regulador",
    "country.notPubliclySpecified": "No especificado públicamente",
    "country.tableYearPublished": "Año de publicación",
    "country.notSpecified": "No especificado",
    "country.tableRegion": "Región",
    "country.notYetDocumented": "Aún no documentado para esta taxonomía.",
    "country.colActivity": "Actividad",
    "country.colScreeningCriteria": "Criterios de evaluación",
    "country.colThreshold": "Umbral",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "Consulte la documentación oficial",
    "country.dnshAppliesDefault": "Aplica",
    "country.viewAllCriteria": "Ver todos los criterios (fuente oficial)",
    "country.officialSourceLabel": "Fuente oficial:",
    "country.singleSourceNote": "Hasta ahora solo se ha compilado un enlace de fuente general para este país — más adelante podría añadirse una lista más completa de documentos oficiales.",
    "country.noSourceYet": "Aún no se ha compilado un enlace de fuente oficial para este país.",
    "country.mediaTagDocument": "Documento",
    "country.officialTaxonomyDocumentation": "Documentación oficial de la taxonomía",
    "country.mediaTagRegional": "Regional",
    "country.moreUpdatesComingSoon": "Más actualizaciones próximamente",
    "country.chatPlaceholder": "Haga una pregunta…",
    "country.chatDisclaimer": "Llama a un modelo de IA real a través de un backend seguro. Si no responde, es posible que este sitio aún no esté desplegado con una clave de API — consulte DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Resumen de la taxonomía",
    "country.headingAboutTaxonomy": "Sobre la taxonomía",
    "country.limitedInfoNote": "Información pública limitada compilada hasta ahora — este resumen puede ampliarse a medida que se revisen más fuentes.",
    "country.noDataCompiledYet": "Aún no se han compilado datos de taxonomía para este país.",
    "country.headingOfficialDocuments": "Documentos oficiales",
    "country.headingEnvironmentalObjectives": "Objetivos ambientales",
    "country.headingTechnicalCriteria": "Criterios técnicos de evaluación",
    "country.headingAlsoApplies": "También aplica",
    "country.headingRelatedMedia": "Medios y actualizaciones relacionadas",
    "country.headingAiChat": "Chat de cumplimiento con IA",
    "country.headingCompare": "Comparar con otra taxonomía",
    "country.compareAllCountriesBtn": "Comparar todos los países",
    "country.noCountrySelected": "Ningún país seleccionado",
    "country.goBackToMap": "Vuelva al mapa y haga clic en un país para ver su perfil de taxonomía.",
    "country.compareWithLabel": "Comparar la taxonomía de {name} con:",
    "country.rowMandatoryVoluntary": "Obligatoria / Voluntaria",
    "country.rowRequiresDnsh": "Requiere DNSH",
    "country.rowRequiresSafeguards": "Requiere salvaguardas mínimas",
    "country.rowSectorsCovered": "Sectores cubiertos",
    "country.notDocumented": "No documentado",
    "country.yes": "Sí",
    "country.no": "No",
    "country.publishedPrefix": "Publicado",
    "country.sourceLinkLabel": "fuente",
    "country.chatWelcomeDefault": "Pregunte lo que quiera sobre esta taxonomía.",
    "country.chatWelcomeWithName": "Pregunte lo que quiera sobre la taxonomía de {name} — incluyendo cómo se compara con otras, como la taxonomía de la UE o la K-Taxonomy de Corea del Sur.",
    "country.chatExampleCompare": "Comparar la taxonomía de {name} con la taxonomía de la UE",
    "country.chatExampleCriteria": "¿Cuáles son los criterios de evaluación clave bajo {taxonomy}?",
    "country.chatExampleDocumentation": "¿Qué documentación necesitaría para demostrar el cumplimiento aquí?",
    "country.chatExampleSimilar": "¿Qué otros países tienen taxonomías similares a la de {name}?",
    "translate.viewOriginal": "Ver PDF original \u2197", "translate.close": "Cerrar",
    "translate.language": "Traducir a", "translate.originalPane": "Original", "translate.translatedPane": "Traducci\u00f3n",
    "translate.errorGeneric": "No se pudo traducir este documento en este momento.",
    "translate.errorNotDeployed": "Traducir requiere el backend en vivo del sitio, que no está conectado aquí — esto solo funciona una vez que el sitio esté desplegado en Vercel con una clave de API (consulte DEPLOY_INSTRUCTIONS.md). Aún puede abrir el PDF original a continuación.",
    "translate.truncatedNote": "Este documento es extenso \u2014 se muestra la traducción solo de la primera parte.",
    "translate.previewUnavailable": "La vista previa no está disponible para esta fuente — la fuente bloquea la carga automática de vistas previas. Use \"Ver PDF original\" abajo para abrirlo directamente en su navegador.",
    "home.heroTitle": "Explore las taxonomías de finanzas sostenibles en todo el mundo",
    "home.heroSub": "Seleccione un país en el mapa, o use la barra de búsqueda a continuación.",
    "home.chipAllRegions": "Todas las regiones", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asia-Pacífico",
    "home.chipAmericas": "América", "home.chipAfrica": "África", "home.chipMiddleEast": "Oriente Medio",
    "home.chipAllStatuses": "Todos los estados", "home.chipDeveloped": "Desarrollada",
    "home.chipUnderDevelopment": "En desarrollo", "home.chipNoTaxonomy": "Sin taxonomía",
    "home.globalStats": "Estadísticas globales", "home.totalCountriesTracked": "Total de países monitoreados",
    "home.recentlyUpdated": "Actualizado recientemente", "home.askAi": "Preguntar a la IA",
    "home.objectiveFilterHeading": "Filtrar por objetivo ambiental", "home.sectorFilterHeading": "Filtrar por sector",
    "home.advancedFiltersToggle": "Búsqueda y filtrado avanzados",
    "home.objAll": "Todos los objetivos", "home.objClimateMitigation": "Mitigación del cambio climático", "home.objClimateAdaptation": "Adaptación al cambio climático",
    "home.objBiodiversity": "Biodiversidad y ecosistemas", "home.objWater": "Recursos hídricos y marinos", "home.objCircular": "Economía circular",
    "home.objPollution": "Prevención de la contaminación", "home.objEnergy": "Energía", "home.objIndustry": "Industria y transición",
    "home.secAll": "Todos los sectores", "home.secAgriculture": "Agricultura", "home.secBuildings": "Edificios",
    "home.secEcologicalRestoration": "Restauración ecológica", "home.secEnergy": "Energía", "home.secEnergyTransition": "Transición energética",
    "home.secEnvironmentalProtection": "Protección ambiental", "home.secGreenServicesTrade": "Servicios verdes y comercio", "home.secICTDigital": "TIC y digital",
    "home.secInfrastructure": "Infraestructura", "home.secManufacturing": "Manufactura", "home.secNuclearTransition": "Nuclear e industrias de transición",
    "home.secResourceRecycling": "Reciclaje de recursos", "home.secTransport": "Transporte", "home.secWasteManagement": "Gestión de residuos", "home.secWater": "Agua",
    "home.matchingCountriesHeading": "Países coincidentes", "home.noMatchingCountries": "Ningún país coincide todavía con estos filtros.",
    "home.partialDataNote": "Los filtros de objetivo y sector actualmente solo coinciden con los países para los que hemos compilado este nivel de detalle — otros pueden no aparecer aquí todavía aunque su taxonomía podría cubrirlo.",
    "about.missionHeading": "Sobre la plataforma",
    "about.missionText": "Las taxonomías de finanzas sostenibles — los reglamentos que definen qué actividades económicas cuentan como \"verdes\" o \"sostenibles\" — se multiplican rápidamente, pero están dispersas en docenas de sitios web gubernamentales, PDFs e idiomas. Cualquiera que intente comparar la Taxonomía de la UE con la K-Taxonomy de Corea, o verificar si una actividad determinada está cubierta en algún lugar, tiene que armarlo a mano. Esta plataforma reúne esa información en un solo lugar interactivo: un mapa de dónde se encuentran hoy las taxonomías, comparaciones lado a lado, enlaces directos a los documentos oficiales originales, y un asesor de IA para responder preguntas específicas — para que reguladores, inversores y empresas puedan navegar el panorama más rápido y con menos puntos ciegos.",
    "about.featurePill1": "Mapa Global Interactivo", "about.featurePill2": "Asesor de Taxonomías IA",
    "about.featurePill3": "Centro de Medios y Tendencias", "about.featurePill4": "Comparación lado a lado",
    "about.featurePill5": "Documentos fuente oficiales",
    "about.teamHeading": "Equipo de la plataforma", "about.coreDeveloper": "Desarrolladora principal",
    "about.supervisorRole": "Supervisora · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Acerca de BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS es un grupo empresarial \"Beyond Net Zero\" con sede en Seúl que trabaja en asesoría, think tank de políticas e inversión en tecnología climática. La firma ha participado directamente en el diseño de las principales políticas climáticas de Corea, incluido el K-ETS (sistema de comercio de emisiones) y la propia K-Taxonomy, y asesora a instituciones financieras, la industria y el gobierno en estrategia net-zero, divulgación de sostenibilidad y finanzas verdes. Esta plataforma forma parte de la nueva iniciativa AI Centre de BNZ PARTNERS — aplicando IA para facilitar la navegación, comparación y acción sobre las taxonomías de finanzas sostenibles, sobre la base del trabajo existente de la firma en políticas de K-Taxonomy.",
    "about.contactHeading": "¿Preguntas, comentarios o quieres colaborar?",
    "about.contactSub": "Ponte en contacto, o suscríbete para recibir actualizaciones a medida que esta plataforma crece.",
    "about.contactUs": "Contáctenos",
    "subscribe.heading": "Suscríbase al boletín semanal",
    "subscribe.lede": "Reciba un resumen semanal de noticias de taxonomías, informes, ideas de tendencias de IA y novedades de BNZ Partners, directamente en su bandeja de entrada. Solo se requiere su dirección de correo electrónico — todo lo demás es opcional.",
    "subscribe.sampleBanner": "Este formulario añade suscriptores a una lista de correo real de Brevo una vez que el sitio se despliegue con una clave API de Brevo (ver DEPLOY_INSTRUCTIONS.md). El envío del boletín semanal en sí todavía se hace manualmente desde el panel de Brevo — este formulario solo gestiona las inscripciones.",
    "subscribe.emailLabel": "Correo electrónico", "subscribe.nameLabel": "Nombre", "subscribe.optional": "(opcional)",
    "subscribe.interestLabel": "Área de interés", "subscribe.interestEu": "Actualizaciones de la Taxonomía de la UE",
    "subscribe.interestApac": "Taxonomías de Asia-Pacífico", "subscribe.interestGreenBonds": "Bonos verdes y finanzas",
    "subscribe.interestCompliance": "Cumplimiento y aseguramiento", "subscribe.langLabel": "Preferencia de idioma",
    "subscribe.consentComms": "Acepto recibir el boletín semanal y actualizaciones ocasionales de la plataforma de Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "He leído y acepto la Política de Privacidad, y consiento que mis datos sean procesados conforme al RGPD (UE) y la PIPA (Corea del Sur).",
    "subscribe.submitBtn": "Suscribirse gratis",
    "subscribe.privacyNote": "Solo usamos su correo para enviarle el boletín al que se ha suscrito — se almacena en nuestra lista de correo de Brevo y no se vende ni comparte. Puede darse de baja en cualquier momento mediante el enlace incluido en los correos que recibe.",
    "subscribe.managePrefs": "Administrar sus preferencias", "subscribe.backToMedia": "Volver al Centro de Medios",
    "subscribe.benefit1Title": "Boletín semanal", "subscribe.benefit1Text": "Un resumen conciso de los lunes por la mañana con las noticias, informes y actualizaciones regulatorias de taxonomías de la semana.",
    "subscribe.benefit2Title": "Alertas de la plataforma", "subscribe.benefit2Text": "Entérese primero cuando cambie el estado de la taxonomía de un país, o se publique un nuevo documento oficial.",
    "subscribe.benefit3Title": "Perspectivas de BNZ PARTNERS", "subscribe.benefit3Text": "Piezas de análisis ocasionales del AI Centre de BNZ Partners sobre temas emergentes de taxonomía y cumplimiento.",
    "subscribe.benefit4Title": "Invitaciones a eventos", "subscribe.benefit4Text": "Invitaciones a webinars, mesas redondas y sesiones informativas sobre taxonomías de finanzas sostenibles en todo el mundo.",
    "prefs.heading": "Preferencias del suscriptor", "prefs.lede": "Administre los temas de su boletín, idioma y configuración de comunicación.",
    "prefs.sampleBanner": "Centro de preferencias de demostración — solo con fines ilustrativos. No hay una cuenta de suscriptor real detrás de esta página, por lo que nada aquí se guarda, y los campos se muestran precargados con datos de ejemplo. En el producto real, los suscriptores existentes llegarían aquí después de hacer clic en un enlace de su correo del boletín.",
    "prefs.saveBtn": "Guardar preferencias (demo — deshabilitado)",
    "prefs.privacyNote": "Esta pantalla es un marcador de posición no funcional. Para cambiar realmente sus intereses o idioma en el futuro, usaría una página como esta, pero aún no está conectada a una base de datos de suscriptores real.",
    "prefs.unsubscribeLink": "Cancelar suscripción (demo — deshabilitado)", "prefs.backToSubscribe": "Volver a Suscribirse",
    "media.heading": "Centro Global de Medios y Tendencias", "media.lede": "Medios relacionados con taxonomías e ideas de tendencias generadas por IA, en un solo lugar.",
    "media.sampleBanner": "Esta página recopila contenido real y en vivo: noticias, informes y documentos a través de Google News, y perspectivas de tendencias de IA además del gráfico temático mediante análisis de IA en vivo de ese contenido. El gráfico de la cronología de desarrollo de taxonomías a continuación utiliza los datos reales de este sitio.",
    "media.filterAll": "Todo", "media.filterNews": "Noticias", "media.filterReports": "Informes",
    "media.filterPapers": "Documentos",
    "media.searchPlaceholder": "Buscar medios…", "media.trendLabel": "Perspectivas de tendencias de IA",
    "media.timelineHeading": "Cronología del desarrollo de taxonomías",
    "media.timelineNote": "Datos reales — número de taxonomías publicadas por año, del conjunto de datos compilado.",
    "media.thematicHeading": "Tendencias temáticas de políticas",
    "media.thematicNote": "Ponderación estimada por IA basada en el análisis en vivo de titulares recientes — se actualiza periódicamente.",
    "media.ctaHeading": "Reciba el boletín semanal de taxonomías",
    "media.ctaText": "Un resumen semanal de noticias, informes e ideas de tendencias sobre taxonomías — gratis.",
    "media.ctaBtn": "Suscribirse gratis",
    "country.backToMap": "Volver al mapa", "country.backToAdvisor": "Volver al Asesor de IA",
    "home.filterLogicNote": "Todos los filtros se aplican a la vez: un país debe cumplir todas las selecciones.", "home.activeFiltersLabel": "Filtros activos", "country.translatingContent": "Traduciendo el contenido de esta página…",
    "chat.toggleLabel": "Preguntar al asistente de IA", "chat.title": "Asistente de IA",
    "chat.subtitle": "Pregunte sobre términos de taxonomías, compare países, o encuentre lo que busca en el sitio.",
    "chat.placeholder": "Escriba su pregunta…", "chat.send": "Enviar",
    "chat.greeting": "¡Hola! Puedo explicar términos de taxonomías, comparar países, o indicarle la página correcta. ¿Qué desea saber?",
    "chat.thinking": "Pensando…",
    "chat.errorGeneric": "No se pudo contactar al asistente en este momento — inténtelo de nuevo.",
    "chat.errorNotDeployed": "El asistente requiere el backend en vivo del sitio, que no está conectado aquí — esto solo funciona una vez que el sitio esté desplegado en Vercel con una clave de API (consulte DEPLOY_INSTRUCTIONS.md)."
  },
  fr: {
    "nav.map": "Carte mondiale interactive", "nav.advisor": "Conseiller IA", "nav.media": "Centre de médias",
    "nav.subscribe": "S'abonner", "nav.resources": "Ressources", "nav.about": "À propos",
    "nav.comingSoon": "Bientôt disponible", "nav.toggleTheme": "Changer de thème", "nav.search": "Rechercher",
    "footer.developedBy": "Développé par", "footer.supervisedBy": "Supervisé par", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Superviseure",
    "search.placeholder": "Rechercher dans tout le site — pays, critères, activités, pages…", "search.mapPlaceholder": "Rechercher par pays, taxonomie ou régulateur…", "search.noMatches": "Aucun résultat", "search.noTaxonomyData": "Aucune donnée de taxonomie",
    "search.groupCountries": "Pays", "search.groupActivities": "Activités K-Taxonomy", "search.groupPages": "Pages et outils",
    "advisor.tabCompare": "Comparaison multi-pays", "advisor.tabCountry": "Conseiller par pays", "advisor.tabPortfolio": "Comparaison de portefeuille", "advisor.tabAsk": "Demander à l'IA",
    "search.title": "Rechercher", "search.close": "Fermer",
    "translate.button": "Traduire", "translate.modalTitle": "Document traduit",
    "translate.loading": "Traduction du document en cours\u2026",
    "translate.loadingPart": "Traduction de la partie {n} sur {total}…",
    "translate.disclaimer": "Traduction automatique d'un document officiel, à titre indicatif uniquement \u2014 consultez toujours l'original à des fins juridiques ou de conformité.",
    "sources.note": "Ce résumé a été compilé à partir des documents officiels et des sources réglementaires indiqués ci-dessus.",
    "sources.lastReviewed": "Contenu compilé/révisé pour la dernière fois le :", "about.resourcesHeading": "Ressources de Référence Clés", "about.resourcesIntro": "Chaque page pays renvoie directement à ses documents officiels du gouvernement/régulateur et, lorsque la page comprend une description détaillée, à des citations numérotées pour chaque affirmation spécifique. Outre ces sources primaires, ces ressources transversales sont utiles pour comprendre et comparer les taxonomies à l'échelle mondiale.", "about.resourcesColResource": "Ressource", "about.resourcesColDescription": "Description", "about.resourcesColLink": "Lien", "footer.references": "Sources", "country.generalResources": "Ressources Générales de Référence",
    "country.noTaxonomyEstablished": "Aucune taxonomie établie",
    "country.tableCountry": "Pays",
    "country.tableTaxonomyName": "Nom de la taxonomie",
    "country.notEstablished": "Non établie",
    "country.tableStatus": "Statut",
    "country.tableRegulator": "Régulateur",
    "country.notPubliclySpecified": "Non précisé publiquement",
    "country.tableYearPublished": "Année de publication",
    "country.notSpecified": "Non précisé",
    "country.tableRegion": "Région",
    "country.notYetDocumented": "Pas encore documenté pour cette taxonomie.",
    "country.colActivity": "Activité",
    "country.colScreeningCriteria": "Critères d'évaluation",
    "country.colThreshold": "Seuil",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "Voir la documentation officielle",
    "country.dnshAppliesDefault": "S'applique",
    "country.viewAllCriteria": "Voir tous les critères (source officielle)",
    "country.officialSourceLabel": "Source officielle :",
    "country.singleSourceNote": "Un seul lien de source générale a été compilé pour ce pays jusqu'à présent — une liste plus complète de documents officiels pourra être ajoutée plus tard.",
    "country.noSourceYet": "Aucun lien de source officielle n'a encore été compilé pour ce pays.",
    "country.mediaTagDocument": "Document",
    "country.officialTaxonomyDocumentation": "Documentation officielle de la taxonomie",
    "country.mediaTagRegional": "Régional",
    "country.moreUpdatesComingSoon": "D'autres mises à jour à venir",
    "country.chatPlaceholder": "Posez une question…",
    "country.chatDisclaimer": "Fait appel à un véritable modèle d'IA via un backend sécurisé. S'il ne répond pas, ce site n'est peut-être pas encore déployé avec une clé API — voir DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Aperçu de la taxonomie",
    "country.headingAboutTaxonomy": "À propos de la taxonomie",
    "country.limitedInfoNote": "Informations publiques limitées compilées jusqu'à présent — ce résumé pourra être complété à mesure que d'autres sources sont examinées.",
    "country.noDataCompiledYet": "Aucune donnée de taxonomie n'a encore été compilée pour ce pays.",
    "country.headingOfficialDocuments": "Documents officiels",
    "country.headingEnvironmentalObjectives": "Objectifs environnementaux",
    "country.headingTechnicalCriteria": "Critères techniques d'évaluation",
    "country.headingAlsoApplies": "S'applique également",
    "country.headingRelatedMedia": "Médias et mises à jour associés",
    "country.headingAiChat": "Chat de conformité IA",
    "country.headingCompare": "Comparer avec une autre taxonomie",
    "country.compareAllCountriesBtn": "Comparer tous les pays",
    "country.noCountrySelected": "Aucun pays sélectionné",
    "country.goBackToMap": "Retournez à la carte et cliquez sur un pays pour voir son profil de taxonomie.",
    "country.compareWithLabel": "Comparer la taxonomie de {name} avec :",
    "country.rowMandatoryVoluntary": "Obligatoire / Volontaire",
    "country.rowRequiresDnsh": "Exige le DNSH",
    "country.rowRequiresSafeguards": "Exige des garanties minimales",
    "country.rowSectorsCovered": "Secteurs couverts",
    "country.notDocumented": "Non documenté",
    "country.yes": "Oui",
    "country.no": "Non",
    "country.publishedPrefix": "Publié",
    "country.sourceLinkLabel": "source",
    "country.chatWelcomeDefault": "Posez n'importe quelle question sur cette taxonomie.",
    "country.chatWelcomeWithName": "Posez n'importe quelle question sur la taxonomie de {name} — y compris comment elle se compare à d'autres, comme la taxonomie de l'UE ou la K-Taxonomy de la Corée du Sud.",
    "country.chatExampleCompare": "Comparer la taxonomie de {name} à la taxonomie de l'UE",
    "country.chatExampleCriteria": "Quels sont les critères d'évaluation clés selon {taxonomy} ?",
    "country.chatExampleDocumentation": "Quels documents me faudrait-il pour démontrer la conformité ici ?",
    "country.chatExampleSimilar": "Quels autres pays ont des taxonomies similaires à celle de {name} ?",
    "translate.viewOriginal": "Voir le PDF original \u2197", "translate.close": "Fermer",
    "translate.language": "Traduire vers", "translate.originalPane": "Original", "translate.translatedPane": "Traduction",
    "translate.errorGeneric": "Impossible de traduire ce document pour le moment.",
    "translate.errorNotDeployed": "La traduction nécessite le backend en direct du site, qui n'est pas connecté ici — cela ne fonctionne qu'une fois le site déployé sur Vercel avec une clé API (voir DEPLOY_INSTRUCTIONS.md). Vous pouvez toujours ouvrir le PDF original ci-dessous.",
    "translate.truncatedNote": "Ce document est long \u2014 seule la traduction de la première partie est affichée.",
    "translate.previewUnavailable": "L’aperçu n’est pas disponible pour cette source — la source bloque le chargement automatique de l’aperçu. Utilisez « Voir le PDF original » ci-dessous pour l’ouvrir directement dans votre navigateur.",
    "home.heroTitle": "Explorez les taxonomies de la finance durable dans le monde",
    "home.heroSub": "Sélectionnez un pays sur la carte, ou utilisez la barre de recherche ci-dessous.",
    "home.chipAllRegions": "Toutes les régions", "home.chipEurope": "Europe", "home.chipAsiaPacific": "Asie-Pacifique",
    "home.chipAmericas": "Amériques", "home.chipAfrica": "Afrique", "home.chipMiddleEast": "Moyen-Orient",
    "home.chipAllStatuses": "Tous les statuts", "home.chipDeveloped": "Développée",
    "home.chipUnderDevelopment": "En développement", "home.chipNoTaxonomy": "Aucune taxonomie",
    "home.globalStats": "Statistiques globales", "home.totalCountriesTracked": "Total des pays suivis",
    "home.recentlyUpdated": "Récemment mis à jour", "home.askAi": "Demander à l'IA",
    "home.objectiveFilterHeading": "Filtrer par objectif environnemental", "home.sectorFilterHeading": "Filtrer par secteur",
    "home.advancedFiltersToggle": "Recherche et filtrage avancés",
    "home.objAll": "Tous les objectifs", "home.objClimateMitigation": "Atténuation du changement climatique", "home.objClimateAdaptation": "Adaptation au changement climatique",
    "home.objBiodiversity": "Biodiversité et écosystèmes", "home.objWater": "Ressources en eau et marines", "home.objCircular": "Économie circulaire",
    "home.objPollution": "Prévention de la pollution", "home.objEnergy": "Énergie", "home.objIndustry": "Industrie et transition",
    "home.secAll": "Tous les secteurs", "home.secAgriculture": "Agriculture", "home.secBuildings": "Bâtiments",
    "home.secEcologicalRestoration": "Restauration écologique", "home.secEnergy": "Énergie", "home.secEnergyTransition": "Transition énergétique",
    "home.secEnvironmentalProtection": "Protection de l'environnement", "home.secGreenServicesTrade": "Services verts et commerce", "home.secICTDigital": "TIC et numérique",
    "home.secInfrastructure": "Infrastructure", "home.secManufacturing": "Fabrication", "home.secNuclearTransition": "Nucléaire et industries de transition",
    "home.secResourceRecycling": "Recyclage des ressources", "home.secTransport": "Transport", "home.secWasteManagement": "Gestion des déchets", "home.secWater": "Eau",
    "home.matchingCountriesHeading": "Pays correspondants", "home.noMatchingCountries": "Aucun pays ne correspond encore à ces filtres.",
    "home.partialDataNote": "Les filtres d'objectif et de secteur ne correspondent actuellement qu'aux pays pour lesquels nous avons compilé ce niveau de détail — d'autres peuvent ne pas encore apparaître ici même si leur taxonomie pourrait le couvrir.",
    "about.missionHeading": "À propos de la plateforme",
    "about.missionText": "Les taxonomies de finance durable — les règlements qui définissent quelles activités économiques comptent comme \"vertes\" ou \"durables\" — se multiplient rapidement, mais sont dispersées sur des dizaines de sites web gouvernementaux, de PDF et de langues. Quiconque essaie de comparer la taxonomie de l'UE avec la K-Taxonomy coréenne, ou de vérifier si une activité donnée est couverte quelque part, doit reconstituer cela à la main. Cette plateforme rassemble ces informations en un seul endroit interactif : une carte de l'état actuel des taxonomies, des comparaisons côte à côte, des liens directs vers les documents officiels originaux, et un conseiller IA pour répondre à des questions précises — afin que les régulateurs, les investisseurs et les entreprises puissent naviguer plus rapidement dans ce paysage, avec moins d'angles morts.",
    "about.featurePill1": "Carte mondiale interactive", "about.featurePill2": "Conseiller en taxonomies IA",
    "about.featurePill3": "Centre de médias et tendances", "about.featurePill4": "Comparaison côte à côte",
    "about.featurePill5": "Documents sources officiels",
    "about.teamHeading": "Équipe de la plateforme", "about.coreDeveloper": "Développeuse principale",
    "about.supervisorRole": "Superviseure · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "À propos de BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS est un groupe d'affaires \"Beyond Net Zero\" basé à Séoul, actif dans le conseil, les think tanks politiques et l'investissement en technologies climatiques. L'entreprise a été directement impliquée dans la conception des principales politiques climatiques coréennes, y compris le K-ETS (système d'échange de quotas d'émission) et la K-Taxonomy elle-même, et conseille les institutions financières, l'industrie et le gouvernement sur la stratégie net zéro, la publication d'informations en matière de durabilité et la finance verte. Cette plateforme fait partie de la nouvelle initiative AI Centre de BNZ PARTNERS — appliquer l'IA pour faciliter la navigation, la comparaison et l'action sur les taxonomies de finance durable, en s'appuyant sur le travail politique existant de l'entreprise sur la K-Taxonomy.",
    "about.contactHeading": "Des questions, des retours, ou envie de collaborer ?",
    "about.contactSub": "Contactez-nous, ou abonnez-vous pour recevoir des mises à jour à mesure que cette plateforme évolue.",
    "about.contactUs": "Nous contacter",
    "subscribe.heading": "Abonnez-vous à la newsletter hebdomadaire",
    "subscribe.lede": "Recevez un résumé hebdomadaire des actualités, rapports, analyses de tendances IA sur les taxonomies et actualités de BNZ Partners, directement dans votre boîte de réception. Seule votre adresse e-mail est requise — tout le reste est facultatif.",
    "subscribe.sampleBanner": "Ce formulaire ajoute les abonnés à une véritable liste de diffusion Brevo une fois le site déployé avec une clé API Brevo (voir DEPLOY_INSTRUCTIONS.md). L'envoi effectif de la newsletter hebdomadaire se fait encore manuellement depuis le tableau de bord Brevo — ce formulaire ne gère que les inscriptions.",
    "subscribe.emailLabel": "Adresse e-mail", "subscribe.nameLabel": "Nom", "subscribe.optional": "(facultatif)",
    "subscribe.interestLabel": "Centre d'intérêt", "subscribe.interestEu": "Mises à jour de la taxonomie de l'UE",
    "subscribe.interestApac": "Taxonomies Asie-Pacifique", "subscribe.interestGreenBonds": "Obligations vertes et finance",
    "subscribe.interestCompliance": "Conformité et assurance", "subscribe.langLabel": "Préférence linguistique",
    "subscribe.consentComms": "J'accepte de recevoir la newsletter hebdomadaire et des mises à jour occasionnelles de la plateforme de la part de Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "J'ai lu et j'accepte la politique de confidentialité, et je consens à ce que mes données soient traitées conformément au RGPD (UE) et à la PIPA (Corée du Sud).",
    "subscribe.submitBtn": "S'abonner gratuitement",
    "subscribe.privacyNote": "Nous utilisons votre e-mail uniquement pour vous envoyer la newsletter à laquelle vous vous êtes inscrit — il est stocké dans notre liste de diffusion Brevo et n'est ni vendu ni partagé. Vous pouvez vous désabonner à tout moment via le lien inclus dans les e-mails que vous recevez.",
    "subscribe.managePrefs": "Gérer vos préférences", "subscribe.backToMedia": "Retour au Centre de médias",
    "subscribe.benefit1Title": "Newsletter hebdomadaire", "subscribe.benefit1Text": "Un résumé concis du lundi matin des actualités, rapports et mises à jour réglementaires de la semaine sur les taxonomies.",
    "subscribe.benefit2Title": "Alertes de la plateforme", "subscribe.benefit2Text": "Soyez informé en premier lorsque le statut de la taxonomie d'un pays change, ou qu'un nouveau document officiel est publié.",
    "subscribe.benefit3Title": "Perspectives BNZ PARTNERS", "subscribe.benefit3Text": "Analyses occasionnelles de l'AI Centre de BNZ Partners sur les thèmes émergents de taxonomie et de conformité.",
    "subscribe.benefit4Title": "Invitations aux événements", "subscribe.benefit4Text": "Invitations à des webinaires, tables rondes et briefings sur les taxonomies de finance durable dans le monde.",
    "prefs.heading": "Préférences de l'abonné", "prefs.lede": "Gérez les sujets de votre newsletter, la langue et les paramètres de communication.",
    "prefs.sampleBanner": "Centre de préférences de démonstration — à titre illustratif uniquement. Il n'y a pas de véritable compte d'abonné derrière cette page, donc rien n'est enregistré ici, et les champs sont pré-remplis avec des données d'exemple. Dans le produit réel, les abonnés existants arriveraient ici après avoir cliqué sur un lien dans leur e-mail de newsletter.",
    "prefs.saveBtn": "Enregistrer les préférences (démo — désactivé)",
    "prefs.privacyNote": "Cet écran est un espace réservé non fonctionnel. Pour réellement modifier vos centres d'intérêt ou votre langue à l'avenir, vous utiliseriez une page comme celle-ci, mais elle n'est pas encore connectée à une véritable base de données d'abonnés.",
    "prefs.unsubscribeLink": "Se désabonner (démo — désactivé)", "prefs.backToSubscribe": "Retour à Abonnement",
    "media.heading": "Centre mondial de médias et tendances", "media.lede": "Médias liés aux taxonomies et analyses de tendances générées par IA, en un seul endroit.",
    "media.sampleBanner": "Cette page rassemble du contenu réel et en direct : actualités, rapports et articles via Google News, ainsi que des analyses de tendances IA et le graphique thématique via une analyse IA en direct de ce contenu. Le graphique de la chronologie de développement des taxonomies ci-dessous utilise les données réelles de ce site.",
    "media.filterAll": "Tout", "media.filterNews": "Actualités", "media.filterReports": "Rapports",
    "media.filterPapers": "Articles",
    "media.searchPlaceholder": "Rechercher des médias…", "media.trendLabel": "Analyses de tendances IA",
    "media.timelineHeading": "Chronologie du développement des taxonomies",
    "media.timelineNote": "Données réelles — nombre de taxonomies publiées par an, à partir du jeu de données compilé.",
    "media.thematicHeading": "Tendances politiques thématiques",
    "media.thematicNote": "Pondération estimée par IA basée sur l'analyse en direct des titres récents — mise à jour périodiquement.",
    "media.ctaHeading": "Recevez la newsletter hebdomadaire sur les taxonomies",
    "media.ctaText": "Un résumé hebdomadaire des actualités, rapports et analyses de tendances sur les taxonomies — gratuit.",
    "media.ctaBtn": "S'abonner gratuitement",
    "country.backToMap": "Retour à la carte", "country.backToAdvisor": "Retour au conseiller IA",
    "home.filterLogicNote": "Tous les filtres s'appliquent ensemble : un pays doit satisfaire chaque sélection.", "home.activeFiltersLabel": "Filtres actifs", "country.translatingContent": "Traduction du contenu de cette page…",
    "chat.toggleLabel": "Demander à l'assistant IA", "chat.title": "Assistant IA",
    "chat.subtitle": "Posez des questions sur les termes de taxonomie, comparez des pays, ou trouvez votre chemin sur le site.",
    "chat.placeholder": "Tapez votre question…", "chat.send": "Envoyer",
    "chat.greeting": "Bonjour ! Je peux expliquer des termes de taxonomie, comparer des pays, ou vous indiquer la bonne page. Que souhaitez-vous savoir ?",
    "chat.thinking": "Réflexion en cours…",
    "chat.errorGeneric": "Impossible de joindre l'assistant pour le moment — veuillez réessayer.",
    "chat.errorNotDeployed": "L'assistant nécessite le backend en direct du site, qui n'est pas connecté ici — cela ne fonctionne qu'une fois le site déployé sur Vercel avec une clé API (voir DEPLOY_INSTRUCTIONS.md)."
  },
  de: {
    "nav.map": "Interaktive Weltkarte", "nav.advisor": "KI-Berater", "nav.media": "Medien-Hub",
    "nav.subscribe": "Abonnieren", "nav.resources": "Ressourcen", "nav.about": "Über uns",
    "nav.comingSoon": "Demnächst", "nav.toggleTheme": "Design wechseln", "nav.search": "Suche",
    "footer.developedBy": "Entwickelt von", "footer.supervisedBy": "Betreut von", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Betreuerin",
    "search.placeholder": "Gesamte Website durchsuchen — Länder, Kriterien, Aktivitäten, Seiten…", "search.mapPlaceholder": "Nach Land, Taxonomie oder Aufsichtsbehörde suchen…", "search.noMatches": "Keine Treffer", "search.noTaxonomyData": "Keine Taxonomiedaten",
    "search.groupCountries": "Länder", "search.groupActivities": "K-Taxonomy-Aktivitäten", "search.groupPages": "Seiten & Werkzeuge",
    "advisor.tabCompare": "Ländervergleich", "advisor.tabCountry": "Länderspezifischer Berater", "advisor.tabPortfolio": "Portfoliovergleich", "advisor.tabAsk": "KI fragen",
    "search.title": "Suche", "search.close": "Schließen",
    "translate.button": "Übersetzen", "translate.modalTitle": "Übersetztes Dokument",
    "translate.loading": "Dokument wird übersetzt\u2026",
    "translate.loadingPart": "Übersetze Teil {n} von {total}…",
    "translate.disclaimer": "Maschinelle Übersetzung eines offiziellen Dokuments, nur zur Information \u2014 für rechtliche oder Compliance-Zwecke stets das Original heranziehen.",
    "sources.note": "Dieser Überblick wurde anhand der oben aufgeführten offiziellen Dokumente und behördlichen Quellen erstellt.",
    "sources.lastReviewed": "Inhalt zuletzt zusammengestellt/überprüft am:", "about.resourcesHeading": "Wichtige Referenzressourcen", "about.resourcesIntro": "Jede Länderseite verlinkt direkt zu ihren offiziellen Regierungs-/Regulierungsdokumenten und, wo die Seite eine detaillierte Beschreibung enthält, zu nummerierten Quellenangaben für jede einzelne Aussage. Neben diesen Primärquellen sind diese übergreifenden Ressourcen nützlich, um Taxonomien weltweit zu verstehen und zu vergleichen.", "about.resourcesColResource": "Ressource", "about.resourcesColDescription": "Beschreibung", "about.resourcesColLink": "Link", "footer.references": "Quellen", "country.generalResources": "Allgemeine Referenzressourcen",
    "country.noTaxonomyEstablished": "Keine Taxonomie etabliert",
    "country.tableCountry": "Land",
    "country.tableTaxonomyName": "Taxonomiename",
    "country.notEstablished": "Nicht etabliert",
    "country.tableStatus": "Status",
    "country.tableRegulator": "Regulierungsbehörde",
    "country.notPubliclySpecified": "Nicht öffentlich angegeben",
    "country.tableYearPublished": "Veröffentlichungsjahr",
    "country.notSpecified": "Nicht angegeben",
    "country.tableRegion": "Region",
    "country.notYetDocumented": "Für diese Taxonomie noch nicht dokumentiert.",
    "country.colActivity": "Aktivität",
    "country.colScreeningCriteria": "Prüfkriterien",
    "country.colThreshold": "Schwellenwert",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "Siehe offizielle Dokumentation",
    "country.dnshAppliesDefault": "Gilt",
    "country.viewAllCriteria": "Alle Kriterien anzeigen (offizielle Quelle)",
    "country.officialSourceLabel": "Offizielle Quelle:",
    "country.singleSourceNote": "Bisher wurde nur ein allgemeiner Quellenlink für dieses Land zusammengestellt — eine vollständigere Liste offizieller Dokumente kann später hinzugefügt werden.",
    "country.noSourceYet": "Für dieses Land wurde noch kein offizieller Quellenlink zusammengestellt.",
    "country.mediaTagDocument": "Dokument",
    "country.officialTaxonomyDocumentation": "Offizielle Taxonomie-Dokumentation",
    "country.mediaTagRegional": "Regional",
    "country.moreUpdatesComingSoon": "Weitere Updates folgen in Kürze",
    "country.chatPlaceholder": "Stellen Sie eine Frage…",
    "country.chatDisclaimer": "Ruft ein echtes KI-Modell über ein sicheres Backend auf. Falls keine Antwort erfolgt, ist diese Website möglicherweise noch nicht mit einem API-Schlüssel bereitgestellt — siehe DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Taxonomie-Übersicht",
    "country.headingAboutTaxonomy": "Über die Taxonomie",
    "country.limitedInfoNote": "Bisher begrenzte öffentliche Informationen zusammengestellt — diese Zusammenfassung kann erweitert werden, sobald weitere Quellen geprüft wurden.",
    "country.noDataCompiledYet": "Für dieses Land wurden noch keine Taxonomiedaten zusammengestellt.",
    "country.headingOfficialDocuments": "Offizielle Dokumente",
    "country.headingEnvironmentalObjectives": "Umweltziele",
    "country.headingTechnicalCriteria": "Technische Prüfkriterien",
    "country.headingAlsoApplies": "Gilt auch für",
    "country.headingRelatedMedia": "Zugehörige Medien & Updates",
    "country.headingAiChat": "KI-Compliance-Chat",
    "country.headingCompare": "Mit einer anderen Taxonomie vergleichen",
    "country.compareAllCountriesBtn": "Alle Länder vergleichen",
    "country.noCountrySelected": "Kein Land ausgewählt",
    "country.goBackToMap": "Gehen Sie zurück zur Karte und klicken Sie auf ein Land, um dessen Taxonomieprofil anzuzeigen.",
    "country.compareWithLabel": "Taxonomie von {name} vergleichen mit:",
    "country.rowMandatoryVoluntary": "Verpflichtend / Freiwillig",
    "country.rowRequiresDnsh": "Erfordert DNSH",
    "country.rowRequiresSafeguards": "Erfordert Mindestschutzmaßnahmen",
    "country.rowSectorsCovered": "Abgedeckte Sektoren",
    "country.notDocumented": "Nicht dokumentiert",
    "country.yes": "Ja",
    "country.no": "Nein",
    "country.publishedPrefix": "Veröffentlicht",
    "country.sourceLinkLabel": "Quelle",
    "country.chatWelcomeDefault": "Stellen Sie eine beliebige Frage zu dieser Taxonomie.",
    "country.chatWelcomeWithName": "Stellen Sie eine beliebige Frage zur Taxonomie von {name} — auch dazu, wie sie sich mit anderen vergleicht, etwa der EU-Taxonomie oder Südkoreas K-Taxonomy.",
    "country.chatExampleCompare": "Taxonomie von {name} mit der EU-Taxonomie vergleichen",
    "country.chatExampleCriteria": "Was sind die wichtigsten Prüfkriterien gemäß {taxonomy}?",
    "country.chatExampleDocumentation": "Welche Unterlagen bräuchte ich, um die Einhaltung hier nachzuweisen?",
    "country.chatExampleSimilar": "Welche anderen Länder haben ähnliche Taxonomien wie {name}?",
    "translate.viewOriginal": "Original-PDF ansehen \u2197", "translate.close": "Schließen",
    "translate.language": "Übersetzen in", "translate.originalPane": "Original", "translate.translatedPane": "Übersetzung",
    "translate.errorGeneric": "Dieses Dokument konnte gerade nicht übersetzt werden.",
    "translate.errorNotDeployed": "Übersetzen benötigt das Live-Backend der Website, das hier nicht verbunden ist — dies funktioniert erst, wenn die Website mit einem API-Schlüssel auf Vercel bereitgestellt wurde (siehe DEPLOY_INSTRUCTIONS.md). Sie können unten weiterhin das Original-PDF öffnen.",
    "translate.truncatedNote": "Dieses Dokument ist lang \u2014 es wird nur eine Übersetzung des ersten Abschnitts angezeigt.",
    "translate.previewUnavailable": "Die Vorschau ist für diese Quelle nicht verfügbar — die Quelle blockiert das automatische Laden der Vorschau. Verwenden Sie unten „Original-PDF ansehen“, um es direkt in Ihrem Browser zu öffnen.",
    "home.heroTitle": "Nachhaltige Finanztaxonomien weltweit entdecken",
    "home.heroSub": "Wählen Sie ein Land auf der Karte, oder nutzen Sie die Suchleiste unten.",
    "home.chipAllRegions": "Alle Regionen", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asien-Pazifik",
    "home.chipAmericas": "Amerika", "home.chipAfrica": "Afrika", "home.chipMiddleEast": "Naher Osten",
    "home.chipAllStatuses": "Alle Status", "home.chipDeveloped": "Etabliert",
    "home.chipUnderDevelopment": "In Entwicklung", "home.chipNoTaxonomy": "Keine Taxonomie",
    "home.globalStats": "Globale Statistiken", "home.totalCountriesTracked": "Erfasste Länder insgesamt",
    "home.recentlyUpdated": "Kürzlich aktualisiert", "home.askAi": "KI fragen",
    "home.objectiveFilterHeading": "Nach Umweltziel filtern", "home.sectorFilterHeading": "Nach Sektor filtern",
    "home.advancedFiltersToggle": "Erweiterte Suche & Filterung",
    "home.objAll": "Alle Umweltziele", "home.objClimateMitigation": "Klimaschutz", "home.objClimateAdaptation": "Anpassung an den Klimawandel",
    "home.objBiodiversity": "Biodiversität & Ökosysteme", "home.objWater": "Wasser- & Meeresressourcen", "home.objCircular": "Kreislaufwirtschaft",
    "home.objPollution": "Vermeidung von Umweltverschmutzung", "home.objEnergy": "Energie", "home.objIndustry": "Industrie & Transformation",
    "home.secAll": "Alle Sektoren", "home.secAgriculture": "Landwirtschaft", "home.secBuildings": "Gebäude",
    "home.secEcologicalRestoration": "Ökologische Wiederherstellung", "home.secEnergy": "Energie", "home.secEnergyTransition": "Energiewende",
    "home.secEnvironmentalProtection": "Umweltschutz", "home.secGreenServicesTrade": "Grüne Dienstleistungen & Handel", "home.secICTDigital": "IKT & Digitales",
    "home.secInfrastructure": "Infrastruktur", "home.secManufacturing": "Fertigung", "home.secNuclearTransition": "Kernenergie & Transformationsindustrien",
    "home.secResourceRecycling": "Ressourcenrecycling", "home.secTransport": "Verkehr", "home.secWasteManagement": "Abfallwirtschaft", "home.secWater": "Wasser",
    "home.matchingCountriesHeading": "Passende Länder", "home.noMatchingCountries": "Noch keine Länder entsprechen diesen Filtern.",
    "home.partialDataNote": "Umweltziel- und Sektorfilter stimmen derzeit nur mit den Ländern überein, für die wir diese Detailtiefe bereits zusammengestellt haben — andere erscheinen hier möglicherweise noch nicht, auch wenn ihre Taxonomie dies abdecken könnte.",
    "about.missionHeading": "Über die Plattform",
    "about.missionText": "Taxonomien für nachhaltige Finanzen — die Regelwerke, die festlegen, welche Wirtschaftstätigkeiten als \"grün\" oder \"nachhaltig\" gelten — vermehren sich rasant, sind aber über Dutzende Regierungswebsites, PDFs und Sprachen verstreut. Wer die EU-Taxonomie mit Koreas K-Taxonomy vergleichen oder prüfen möchte, ob eine bestimmte Aktivität irgendwo abgedeckt ist, muss dies mühsam von Hand zusammensetzen. Diese Plattform bringt diese Informationen an einem interaktiven Ort zusammen: eine Karte des aktuellen Stands der Taxonomien, Vergleiche nebeneinander, direkte Links zu den offiziellen Originaldokumenten und einen KI-Berater für konkrete Fragen — damit Aufsichtsbehörden, Investoren und Unternehmen sich schneller und mit weniger blinden Flecken zurechtfinden.",
    "about.featurePill1": "Interaktive Weltkarte", "about.featurePill2": "KI-Taxonomie-Berater",
    "about.featurePill3": "Medien- und Trend-Hub", "about.featurePill4": "Direktvergleich",
    "about.featurePill5": "Offizielle Quelldokumente",
    "about.teamHeading": "Plattform-Team", "about.coreDeveloper": "Kernentwicklerin",
    "about.supervisorRole": "Betreuerin · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Über BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS ist eine in Seoul ansässige \"Beyond Net Zero\"-Unternehmensgruppe, die in Beratung, politischem Think-Tank und Klimatech-Investitionen tätig ist. Das Unternehmen war direkt an der Gestaltung wichtiger koreanischer Klimapolitik beteiligt, einschließlich des K-ETS (Emissionshandelssystem) und der K-Taxonomy selbst, und berät Finanzinstitute, Industrie und Regierung zu Net-Zero-Strategie, Nachhaltigkeitsberichterstattung und grüner Finanzierung. Diese Plattform ist Teil der neueren AI-Centre-Initiative von BNZ PARTNERS — der Einsatz von KI, um Taxonomien für nachhaltige Finanzen leichter navigierbar, vergleichbar und umsetzbar zu machen, aufbauend auf der bestehenden K-Taxonomy-Politikarbeit des Unternehmens.",
    "about.contactHeading": "Fragen, Feedback oder Interesse an einer Zusammenarbeit?",
    "about.contactSub": "Nehmen Sie Kontakt auf, oder abonnieren Sie Updates, während diese Plattform wächst.",
    "about.contactUs": "Kontaktieren Sie uns",
    "subscribe.heading": "Den wöchentlichen Newsletter abonnieren",
    "subscribe.lede": "Erhalten Sie eine wöchentliche Zusammenfassung von Taxonomie-Neuigkeiten, Berichten, KI-Trendeinblicken und Neuigkeiten von BNZ Partners direkt in Ihr Postfach. Nur Ihre E-Mail-Adresse ist erforderlich — alles andere ist optional.",
    "subscribe.sampleBanner": "Dieses Formular fügt Abonnenten zu einer echten Brevo-Mailingliste hinzu, sobald die Website mit einem Brevo-API-Schlüssel bereitgestellt wird (siehe DEPLOY_INSTRUCTIONS.md). Der tatsächliche Versand des wöchentlichen Newsletters erfolgt weiterhin manuell über das Brevo-Dashboard — dieses Formular übernimmt nur die Anmeldungen.",
    "subscribe.emailLabel": "E-Mail-Adresse", "subscribe.nameLabel": "Name", "subscribe.optional": "(optional)",
    "subscribe.interestLabel": "Interessengebiet", "subscribe.interestEu": "EU-Taxonomie-Updates",
    "subscribe.interestApac": "Asien-Pazifik-Taxonomien", "subscribe.interestGreenBonds": "Grüne Anleihen & Finanzen",
    "subscribe.interestCompliance": "Compliance & Prüfung", "subscribe.langLabel": "Sprachpräferenz",
    "subscribe.consentComms": "Ich stimme zu, den wöchentlichen Newsletter und gelegentliche Plattform-Updates von Global Sustainable Taxonomies / BNZ Partners zu erhalten.",
    "subscribe.consentPrivacy": "Ich habe die Datenschutzerklärung gelesen und akzeptiere sie und stimme zu, dass meine Daten gemäß DSGVO (EU) und PIPA (Südkorea) verarbeitet werden.",
    "subscribe.submitBtn": "Kostenlos abonnieren",
    "subscribe.privacyNote": "Wir verwenden Ihre E-Mail nur, um den von Ihnen abonnierten Newsletter zu versenden — sie wird in unserer Brevo-Mailingliste gespeichert und weder verkauft noch weitergegeben. Sie können sich jederzeit über den Link in den E-Mails, die Sie erhalten, abmelden.",
    "subscribe.managePrefs": "Ihre Einstellungen verwalten", "subscribe.backToMedia": "Zurück zum Medien-Hub",
    "subscribe.benefit1Title": "Wöchentlicher Newsletter", "subscribe.benefit1Text": "Eine prägnante Montagmorgen-Zusammenfassung der Taxonomie-Neuigkeiten, Berichte und regulatorischen Updates der Woche.",
    "subscribe.benefit2Title": "Plattform-Benachrichtigungen", "subscribe.benefit2Text": "Erfahren Sie als Erste(r), wenn sich der Taxonomie-Status eines Landes ändert oder ein neues offizielles Dokument veröffentlicht wird.",
    "subscribe.benefit3Title": "BNZ PARTNERS Einblicke", "subscribe.benefit3Text": "Gelegentliche Analysebeiträge des BNZ Partners AI Centre zu neu aufkommenden Taxonomie- und Compliance-Themen.",
    "subscribe.benefit4Title": "Veranstaltungseinladungen", "subscribe.benefit4Text": "Einladungen zu Webinaren, Podiumsdiskussionen und Briefings zu Taxonomien für nachhaltige Finanzen weltweit.",
    "prefs.heading": "Abonnenteneinstellungen", "prefs.lede": "Verwalten Sie Ihre Newsletter-Themen, Sprache und Kommunikationseinstellungen.",
    "prefs.sampleBanner": "Demo-Einstellungszentrale — nur zur Veranschaulichung. Hinter dieser Seite steht kein echtes Abonnentenkonto, daher wird hier nichts gespeichert, und die Felder werden mit Beispieldaten vorausgefüllt angezeigt. Im echten Produkt würden bestehende Abonnenten hier landen, nachdem sie auf einen Link in ihrer Newsletter-E-Mail geklickt haben.",
    "prefs.saveBtn": "Einstellungen speichern (Demo — deaktiviert)",
    "prefs.privacyNote": "Dieser Bildschirm ist ein nicht funktionsfähiger Platzhalter. Um Ihre Interessen oder Ihre Sprache künftig tatsächlich zu ändern, würden Sie eine Seite wie diese verwenden, aber sie ist noch nicht mit einer echten Abonnentendatenbank verbunden.",
    "prefs.unsubscribeLink": "Abmelden (Demo — deaktiviert)", "prefs.backToSubscribe": "Zurück zu Abonnieren",
    "media.heading": "Globaler Medien- und Trend-Hub", "media.lede": "Taxonomiebezogene Medien und KI-generierte Trendeinblicke an einem Ort.",
    "media.sampleBanner": "Diese Seite sammelt echte, live Inhalte: Nachrichten, Berichte und Fachartikel über Google News sowie KI-Trendeinblicke und das thematische Diagramm über Live-KI-Analyse dieser Inhalte. Das Taxonomie-Entwicklungs-Zeitachsen-Diagramm unten verwendet die echten Daten dieser Website.",
    "media.filterAll": "Alle", "media.filterNews": "Nachrichten", "media.filterReports": "Berichte",
    "media.filterPapers": "Fachartikel",
    "media.searchPlaceholder": "Medien durchsuchen…", "media.trendLabel": "KI-Trendeinblicke",
    "media.timelineHeading": "Zeitachse der Taxonomieentwicklung",
    "media.timelineNote": "Echte Daten — Anzahl der pro Jahr veröffentlichten Taxonomien, aus dem zusammengestellten Datensatz.",
    "media.thematicHeading": "Thematische Politiktrends",
    "media.thematicNote": "KI-geschätzte Gewichtung basierend auf Live-Analyse aktueller Schlagzeilen — wird regelmäßig aktualisiert.",
    "media.ctaHeading": "Den wöchentlichen Taxonomie-Newsletter erhalten",
    "media.ctaText": "Eine wöchentliche Zusammenfassung von Taxonomie-Neuigkeiten, Berichten und Trendeinblicken — kostenlos.",
    "media.ctaBtn": "Kostenlos abonnieren",
    "country.backToMap": "Zurück zur Karte", "country.backToAdvisor": "Zurück zum KI-Berater",
    "home.filterLogicNote": "Alle Filter gelten gemeinsam — ein Land muss jede Auswahl erfüllen.", "home.activeFiltersLabel": "Aktive Filter", "country.translatingContent": "Inhalt dieser Seite wird übersetzt…",
    "chat.toggleLabel": "KI-Assistent fragen", "chat.title": "KI-Assistent",
    "chat.subtitle": "Fragen Sie nach Taxonomiebegriffen, vergleichen Sie Länder, oder finden Sie sich auf der Website zurecht.",
    "chat.placeholder": "Ihre Frage eingeben…", "chat.send": "Senden",
    "chat.greeting": "Hallo! Ich kann Taxonomiebegriffe erklären, Länder vergleichen oder Ihnen die richtige Seite zeigen. Was möchten Sie wissen?",
    "chat.thinking": "Denke nach…",
    "chat.errorGeneric": "Der Assistent konnte gerade nicht erreicht werden — bitte versuchen Sie es erneut.",
    "chat.errorNotDeployed": "Der Assistent benötigt das Live-Backend der Website, das hier nicht verbunden ist — dies funktioniert erst, wenn die Website mit einem API-Schlüssel auf Vercel bereitgestellt wurde (siehe DEPLOY_INSTRUCTIONS.md)."
  },
  ja: {
    "nav.map": "インタラクティブ・グローバルマップ", "nav.advisor": "AIアドバイザー", "nav.media": "メディアハブ",
    "nav.subscribe": "登録", "nav.resources": "リソース", "nav.about": "サイトについて",
    "nav.comingSoon": "近日公開", "nav.toggleTheme": "テーマ切替", "nav.search": "検索",
    "footer.developedBy": "開発", "footer.supervisedBy": "監修", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "監修",
    "search.placeholder": "サイト全体を検索 — 国・判断基準・経済活動・ページ…", "search.mapPlaceholder": "国、タクソノミー、規制当局で検索…", "search.noMatches": "該当なし", "search.noTaxonomyData": "タクソノミーデータなし",
    "search.groupCountries": "国", "search.groupActivities": "K-Taxonomyの経済活動", "search.groupPages": "ページ・機能",
    "advisor.tabCompare": "多国間比較", "advisor.tabCountry": "国別アドバイザー", "advisor.tabPortfolio": "ポートフォリオ比較", "advisor.tabAsk": "AIに質問",
    "search.title": "検索", "search.close": "閉じる",
    "translate.button": "翻訳", "translate.modalTitle": "翻訳された文書",
    "translate.loading": "文書を翻訳中\u2026",
    "translate.loadingPart": "部分 {n}/{total} を翻訳中…",
    "translate.disclaimer": "公式文書の機械翻訳であり、参考情報です \u2014 法的または規制遵守の目的では常に原文をご確認ください。",
    "sources.note": "この概要は、上記に記載された公式文書および規制当局の情報源をもとに作成されています。",
    "sources.lastReviewed": "コンテンツの最終作成・確認日:", "about.resourcesHeading": "主要参考資料", "about.resourcesIntro": "各国のページは、その国の政府・規制当局の公式文書に直接リンクしており、詳細な説明があるページでは、個々の主張ごとに番号付きの出典が示されています。これらの一次資料に加えて、以下の横断的なリソースは、世界各国のタクソノミーを理解し比較する際に役立ちます。", "about.resourcesColResource": "リソース", "about.resourcesColDescription": "説明", "about.resourcesColLink": "リンク", "footer.references": "出典", "country.generalResources": "一般参考資料",
    "country.noTaxonomyEstablished": "タクソノミー未策定",
    "country.tableCountry": "国",
    "country.tableTaxonomyName": "タクソノミー名",
    "country.notEstablished": "未策定",
    "country.tableStatus": "ステータス",
    "country.tableRegulator": "規制当局",
    "country.notPubliclySpecified": "公表されていません",
    "country.tableYearPublished": "発行年",
    "country.notSpecified": "指定なし",
    "country.tableRegion": "地域",
    "country.notYetDocumented": "このタクソノミーについてはまだ文書化されていません。",
    "country.colActivity": "活動",
    "country.colScreeningCriteria": "審査基準",
    "country.colThreshold": "閾値",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "公式文書を参照してください",
    "country.dnshAppliesDefault": "適用",
    "country.viewAllCriteria": "すべての基準を見る（公式情報源）",
    "country.officialSourceLabel": "公式情報源:",
    "country.singleSourceNote": "この国についてはこれまでのところ一般的な情報源リンクが1件のみ収集されています — 今後より詳細な公式文書リストが追加される場合があります。",
    "country.noSourceYet": "この国についてはまだ公式情報源リンクが収集されていません。",
    "country.mediaTagDocument": "文書",
    "country.officialTaxonomyDocumentation": "公式タクソノミー文書",
    "country.mediaTagRegional": "地域",
    "country.moreUpdatesComingSoon": "今後さらに更新予定",
    "country.chatPlaceholder": "質問を入力…",
    "country.chatDisclaimer": "安全なバックエンドを介して実際のAIモデルを呼び出します。応答がない場合、このサイトはまだAPIキーでデプロイされていない可能性があります — DEPLOY_INSTRUCTIONS.mdを参照してください。",
    "country.headingOverview": "タクソノミー概要",
    "country.headingAboutTaxonomy": "タクソノミーについて",
    "country.limitedInfoNote": "これまでに収集された公開情報は限定的です — より多くの情報源が確認されるにつれて、この概要は拡充される可能性があります。",
    "country.noDataCompiledYet": "この国についてはまだタクソノミーデータが収集されていません。",
    "country.headingOfficialDocuments": "公式文書",
    "country.headingEnvironmentalObjectives": "環境目標",
    "country.headingTechnicalCriteria": "技術的審査基準",
    "country.headingAlsoApplies": "その他適用事項",
    "country.headingRelatedMedia": "関連メディア・アップデート",
    "country.headingAiChat": "AIコンプライアンスチャット",
    "country.headingCompare": "他のタクソノミーと比較",
    "country.compareAllCountriesBtn": "すべての国を比較",
    "country.noCountrySelected": "国が選択されていません",
    "country.goBackToMap": "地図に戻り、国をクリックするとそのタクソノミープロファイルが表示されます。",
    "country.compareWithLabel": "{name}のタクソノミーと比較:",
    "country.rowMandatoryVoluntary": "義務的 / 任意",
    "country.rowRequiresDnsh": "DNSHが必要",
    "country.rowRequiresSafeguards": "最低限のセーフガードが必要",
    "country.rowSectorsCovered": "対象セクター",
    "country.notDocumented": "文書化されていません",
    "country.yes": "はい",
    "country.no": "いいえ",
    "country.publishedPrefix": "公開",
    "country.sourceLinkLabel": "出典",
    "country.chatWelcomeDefault": "このタクソノミーについて何でも質問してください。",
    "country.chatWelcomeWithName": "{name}のタクソノミーについて何でも質問してください — EUタクソノミーや韓国のK-タクソノミーとの比較なども含めて。",
    "country.chatExampleCompare": "{name}のタクソノミーをEUタクソノミーと比較",
    "country.chatExampleCriteria": "{taxonomy}における主な審査基準は何ですか？",
    "country.chatExampleDocumentation": "ここでコンプライアンスを証明するにはどのような書類が必要ですか？",
    "country.chatExampleSimilar": "{name}と類似したタクソノミーを持つ他の国はどこですか？",
    "translate.viewOriginal": "元のPDFを見る \u2197", "translate.close": "閉じる",
    "translate.language": "翻訳先", "translate.originalPane": "原文", "translate.translatedPane": "翻訳",
    "translate.errorGeneric": "現在この文書を翻訳できませんでした。",
    "translate.errorNotDeployed": "翻訳機能にはライブのサイトバックエンドが必要ですが、ここでは接続されていません — この機能はサイトがAPIキー付きでVercelにデプロイされた後にのみ動作します（DEPLOY_INSTRUCTIONS.mdを参照）。下の元のPDFは引き続き開くことができます。",
    "translate.truncatedNote": "この文書は長いため、最初の部分のみの翻訳を表示しています。",
    "translate.previewUnavailable": "このソースはプレビューの自動読み込みをブロックしているため、プレビューは利用できません。下の「元のPDFを表示」からブラウザで直接開いてください。",
    "home.heroTitle": "世界のサステナブルファイナンス・タクソノミーを探る",
    "home.heroSub": "地図から国を選択するか、下の検索バーをご利用ください。",
    "home.chipAllRegions": "すべての地域", "home.chipEurope": "ヨーロッパ", "home.chipAsiaPacific": "アジア太平洋",
    "home.chipAmericas": "南北アメリカ", "home.chipAfrica": "アフリカ", "home.chipMiddleEast": "中東",
    "home.chipAllStatuses": "すべてのステータス", "home.chipDeveloped": "整備済み",
    "home.chipUnderDevelopment": "開発中", "home.chipNoTaxonomy": "タクソノミーなし",
    "home.globalStats": "グローバル統計", "home.totalCountriesTracked": "追跡対象の総国数",
    "home.recentlyUpdated": "最近の更新", "home.askAi": "AIに質問",
    "home.objectiveFilterHeading": "環境目標で絞り込み", "home.sectorFilterHeading": "分野で絞り込み",
    "home.advancedFiltersToggle": "詳細検索・絞り込み",
    "home.objAll": "すべての環境目標", "home.objClimateMitigation": "気候変動の緩和", "home.objClimateAdaptation": "気候変動への適応",
    "home.objBiodiversity": "生物多様性と生態系", "home.objWater": "水資源・海洋資源", "home.objCircular": "循環経済",
    "home.objPollution": "汚染防止", "home.objEnergy": "エネルギー", "home.objIndustry": "産業・移行",
    "home.secAll": "すべての分野", "home.secAgriculture": "農業", "home.secBuildings": "建物",
    "home.secEcologicalRestoration": "生態系の復元", "home.secEnergy": "エネルギー", "home.secEnergyTransition": "エネルギー転換",
    "home.secEnvironmentalProtection": "環境保護", "home.secGreenServicesTrade": "グリーンサービス・貿易", "home.secICTDigital": "ICT・デジタル",
    "home.secInfrastructure": "インフラ", "home.secManufacturing": "製造業", "home.secNuclearTransition": "原子力・移行産業",
    "home.secResourceRecycling": "資源リサイクル", "home.secTransport": "運輸", "home.secWasteManagement": "廃棄物管理", "home.secWater": "水",
    "home.matchingCountriesHeading": "該当する国", "home.noMatchingCountries": "この条件に該当する国はまだありません。",
    "home.partialDataNote": "環境目標・分野フィルターは、現時点でこの詳細情報を収集済みの国のみに一致します — タクソノミーが対象としていても、まだここに表示されない国がある場合があります。",
    "about.missionHeading": "プラットフォームについて",
    "about.missionText": "どの経済活動が「グリーン」または「サステナブル」と見なされるかを定義するルールブックであるサステナブルファイナンス・タクソノミーは急速に増加していますが、数十もの政府ウェブサイト、PDF、言語に分散しています。EUタクソノミーと韓国のK-Taxonomyを比較したい人や、ある活動がどこかで対象となっているか確認したい人は、それを手作業でつなぎ合わせなければなりません。このプラットフォームは、その情報を一つのインタラクティブな場所に集約します。今日のタクソノミーの状況を示す地図、並列比較、公式原本文書への直接リンク、そして具体的な質問に答えるAIアドバイザーです。これにより、規制当局、投資家、企業がより速く、死角の少ない形でこの分野を進むことができます。",
    "about.featurePill1": "インタラクティブ・グローバルマップ", "about.featurePill2": "AIタクソノミー・アドバイザー",
    "about.featurePill3": "メディア・トレンドハブ", "about.featurePill4": "並列比較",
    "about.featurePill5": "公式ソース文書",
    "about.teamHeading": "プラットフォームチーム", "about.coreDeveloper": "コア開発者",
    "about.supervisorRole": "監修 · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "BNZ PARTNERSについて",
    "about.bnzText": "BNZ PARTNERSは、アドバイザリー、政策シンクタンク、クライメートテック投資にまたがるソウル拠点の「Beyond Net Zero」ビジネスグループです。同社はK-ETS(排出量取引制度)やK-Taxonomy自体を含む韓国の主要な気候政策の設計に直接関与しており、金融機関、産業界、政府にネットゼロ戦略、サステナビリティ開示、グリーンファイナンスについて助言しています。このプラットフォームはBNZ PARTNERSの新しいAI Centreの取り組みの一環であり、同社の既存のK-Taxonomy政策業務を基盤として、AIを活用してサステナブルファイナンス・タクソノミーをより簡単に閲覧・比較・活用できるようにするものです。",
    "about.contactHeading": "ご質問、フィードバック、協業のご希望はありますか?",
    "about.contactSub": "お問い合わせいただくか、プラットフォームの成長に合わせた更新情報をご登録ください。",
    "about.contactUs": "お問い合わせ",
    "subscribe.heading": "週刊ダイジェストに登録する",
    "subscribe.lede": "タクソノミーに関するニュース、レポート、AIトレンドインサイト、そしてBNZ Partnersのニュースの週刊まとめを受信箱にお届けします。必要なのはメールアドレスのみで、他はすべて任意です。",
    "subscribe.sampleBanner": "このフォームは、サイトがBrevo APIキーでデプロイされると、実際のBrevoメーリングリストに購読者を追加します(DEPLOY_INSTRUCTIONS.md参照)。週刊ダイジェストの実際の送信は引き続きBrevoダッシュボードから手動で行う必要があります — このフォームは登録のみを処理します。",
    "subscribe.emailLabel": "メールアドレス", "subscribe.nameLabel": "お名前", "subscribe.optional": "(任意)",
    "subscribe.interestLabel": "関心分野", "subscribe.interestEu": "EUタクソノミーの更新情報",
    "subscribe.interestApac": "アジア太平洋のタクソノミー", "subscribe.interestGreenBonds": "グリーンボンド・金融",
    "subscribe.interestCompliance": "コンプライアンス・保証", "subscribe.langLabel": "言語設定",
    "subscribe.consentComms": "Global Sustainable Taxonomies / BNZ Partnersから週刊ダイジェストと随時のプラットフォーム更新情報を受け取ることに同意します。",
    "subscribe.consentPrivacy": "プライバシーポリシーを読み、同意します。また、GDPR(EU)およびPIPA(韓国)に従って自分のデータが処理されることに同意します。",
    "subscribe.submitBtn": "無料で登録する",
    "subscribe.privacyNote": "お客様のメールアドレスは、登録いただいたダイジェストの送信にのみ使用されます — Brevoメーリングリストに保存され、販売または共有されることはありません。受け取るメールに記載されているリンクからいつでも登録解除できます。",
    "subscribe.managePrefs": "設定を管理する", "subscribe.backToMedia": "メディアハブに戻る",
    "subscribe.benefit1Title": "週刊ダイジェスト", "subscribe.benefit1Text": "その週のタクソノミーに関するニュース、レポート、規制の更新情報を月曜朝に簡潔にまとめてお届けします。",
    "subscribe.benefit2Title": "プラットフォームアラート", "subscribe.benefit2Text": "国のタクソノミーのステータスが変わったとき、または新しい公式文書が公開されたときにいち早くお知らせします。",
    "subscribe.benefit3Title": "BNZ PARTNERSインサイト", "subscribe.benefit3Text": "BNZ Partners AI Centreによる、新たなタクソノミーおよびコンプライアンステーマに関する分析コンテンツを不定期にお届けします。",
    "subscribe.benefit4Title": "イベント招待", "subscribe.benefit4Text": "世界のサステナブルファイナンス・タクソノミーに関するウェビナー、パネルディスカッション、ブリーフィングへの招待。",
    "prefs.heading": "購読者設定", "prefs.lede": "ダイジェストのトピック、言語、コミュニケーション設定を管理します。",
    "prefs.sampleBanner": "デモ設定センター — あくまで例示目的です。このページの背後には実際の購読者アカウントは存在しないため、ここでの内容は保存されず、フィールドにはサンプルデータがあらかじめ入力されています。実際の製品では、既存の購読者はダイジェストメール内のリンクをクリックした後にここに到達します。",
    "prefs.saveBtn": "設定を保存 (デモ — 無効)",
    "prefs.privacyNote": "この画面は機能しないプレースホルダーです。今後、関心事項や言語を実際に変更するにはこのようなページを使用しますが、まだ実際の購読者データベースには接続されていません。",
    "prefs.unsubscribeLink": "登録解除 (デモ — 無効)", "prefs.backToSubscribe": "登録ページに戻る",
    "media.heading": "グローバル・メディア&トレンドハブ", "media.lede": "タクソノミー関連のメディアとAI生成のトレンドインサイトを一箇所で。",
    "media.sampleBanner": "このページは実際のライブコンテンツを集約しています:Googleニュース経由のニュース・レポート・論文、そしてそのコンテンツのライブAI分析によるAIトレンドインサイトとテーマ別チャートです。以下のタクソノミー開発タイムラインのグラフはこのサイトの実データを使用しています。",
    "media.filterAll": "すべて", "media.filterNews": "ニュース", "media.filterReports": "レポート",
    "media.filterPapers": "論文",
    "media.searchPlaceholder": "メディアを検索…", "media.trendLabel": "AIトレンドインサイト",
    "media.timelineHeading": "タクソノミー発展のタイムライン",
    "media.timelineNote": "実データ — 編集されたデータセットに基づく年間発表タクソノミー数。",
    "media.thematicHeading": "テーマ別政策トレンド",
    "media.thematicNote": "最近の見出しのライブ分析に基づくAI推定の重み付けです—定期的に更新されます。",
    "media.ctaHeading": "週刊タクソノミーダイジェストを受け取る",
    "media.ctaText": "タクソノミーニュース、レポート、トレンドインサイトの週刊まとめ — 無料。",
    "media.ctaBtn": "無料で登録する",
    "country.backToMap": "地図に戻る", "country.backToAdvisor": "AIアドバイザーに戻る",
    "home.filterLogicNote": "すべてのフィルターは同時に適用されます — すべての条件を満たす国のみが表示されます。", "home.activeFiltersLabel": "適用中のフィルター", "country.translatingContent": "このページのコンテンツを翻訳中…",
    "chat.toggleLabel": "AIアシスタントに質問", "chat.title": "AIアシスタント",
    "chat.subtitle": "タクソノミー用語について質問したり、国を比較したり、サイト内の目的のページを見つけたりできます。",
    "chat.placeholder": "質問を入力…", "chat.send": "送信",
    "chat.greeting": "こんにちは！タクソノミー用語の説明、国の比較、適切なページのご案内ができます。何をお知りになりたいですか？",
    "chat.thinking": "考え中…",
    "chat.errorGeneric": "現在アシスタントに接続できませんでした — もう一度お試しください。",
    "chat.errorNotDeployed": "アシスタントにはライブのサイトバックエンドが必要ですが、ここでは接続されていません — この機能はサイトがAPIキー付きでVercelにデプロイされた後にのみ動作します（DEPLOY_INSTRUCTIONS.mdを参照）。"
  },
  zh: {
    "nav.map": "全球互动地图", "nav.advisor": "AI 顾问", "nav.media": "媒体中心",
    "nav.subscribe": "订阅", "nav.resources": "资源", "nav.about": "关于我们",
    "nav.comingSoon": "即将推出", "nav.toggleTheme": "切换主题", "nav.search": "搜索",
    "footer.developedBy": "开发者", "footer.supervisedBy": "指导", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "指导",
    "search.placeholder": "全站搜索 — 国家、判定标准、经济活动、页面…", "search.mapPlaceholder": "按国家、分类标准或监管机构搜索…", "search.noMatches": "无匹配结果", "search.noTaxonomyData": "暂无分类标准数据",
    "search.groupCountries": "国家", "search.groupActivities": "K-Taxonomy 经济活动", "search.groupPages": "页面与工具",
    "advisor.tabCompare": "多国比较", "advisor.tabCountry": "国别顾问", "advisor.tabPortfolio": "组合比较", "advisor.tabAsk": "询问 AI",
    "search.title": "搜索", "search.close": "关闭",
    "translate.button": "翻译", "translate.modalTitle": "翻译文档",
    "translate.loading": "正在翻译此文档\u2026",
    "translate.loadingPart": "正在翻译第 {n} 部分，共 {total} 部分…",
    "translate.disclaimer": "官方文档的机器翻译，仅供参考——法律或合规目的请始终参阅原文。",
    "sources.note": "本概述基于上文列出的官方文件和监管来源编写。",
    "sources.lastReviewed": "内容最后编制/审核时间：", "about.resourcesHeading": "主要参考资源", "about.resourcesIntro": "每个国家页面都直接链接到其官方政府/监管机构文件，如果页面包含详细说明，还会为每项具体陈述提供带编号的引用来源。除了这些主要来源外，以下这些跨领域资源有助于理解和比较全球各地的分类标准。", "about.resourcesColResource": "资源", "about.resourcesColDescription": "说明", "about.resourcesColLink": "链接", "footer.references": "来源", "country.generalResources": "通用参考资源",
    "country.noTaxonomyEstablished": "尚未建立分类标准",
    "country.tableCountry": "国家",
    "country.tableTaxonomyName": "分类标准名称",
    "country.notEstablished": "尚未建立",
    "country.tableStatus": "状态",
    "country.tableRegulator": "监管机构",
    "country.notPubliclySpecified": "未公开说明",
    "country.tableYearPublished": "发布年份",
    "country.notSpecified": "未说明",
    "country.tableRegion": "地区",
    "country.notYetDocumented": "该分类标准尚未有相关文档。",
    "country.colActivity": "活动",
    "country.colScreeningCriteria": "筛选标准",
    "country.colThreshold": "阈值",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "请参阅官方文档",
    "country.dnshAppliesDefault": "适用",
    "country.viewAllCriteria": "查看所有标准（官方来源）",
    "country.officialSourceLabel": "官方来源：",
    "country.singleSourceNote": "目前该国仅收录了一个通用来源链接——未来可能会添加更完整的官方文件列表。",
    "country.noSourceYet": "该国尚未收录官方来源链接。",
    "country.mediaTagDocument": "文档",
    "country.officialTaxonomyDocumentation": "官方分类标准文件",
    "country.mediaTagRegional": "区域",
    "country.moreUpdatesComingSoon": "更多更新即将推出",
    "country.chatPlaceholder": "输入问题…",
    "country.chatDisclaimer": "通过安全的后端调用真实的AI模型。如果没有响应，该网站可能尚未配置API密钥进行部署——请参阅DEPLOY_INSTRUCTIONS.md。",
    "country.headingOverview": "分类标准概览",
    "country.headingAboutTaxonomy": "关于该分类标准",
    "country.limitedInfoNote": "目前收集到的公开信息有限——随着更多来源的审查，本摘要可能会扩充。",
    "country.noDataCompiledYet": "该国尚未收录分类标准数据。",
    "country.headingOfficialDocuments": "官方文件",
    "country.headingEnvironmentalObjectives": "环境目标",
    "country.headingTechnicalCriteria": "技术筛选标准",
    "country.headingAlsoApplies": "同时适用",
    "country.headingRelatedMedia": "相关媒体与更新",
    "country.headingAiChat": "AI合规聊天",
    "country.headingCompare": "与其他分类标准比较",
    "country.compareAllCountriesBtn": "比较所有国家",
    "country.noCountrySelected": "未选择国家",
    "country.goBackToMap": "请返回地图并点击某个国家以查看其分类标准概况。",
    "country.compareWithLabel": "将{name}的分类标准与以下对象比较：",
    "country.rowMandatoryVoluntary": "强制性 / 自愿性",
    "country.rowRequiresDnsh": "是否要求DNSH",
    "country.rowRequiresSafeguards": "是否要求最低限度保障措施",
    "country.rowSectorsCovered": "涵盖行业",
    "country.notDocumented": "尚未有文档",
    "country.yes": "是",
    "country.no": "否",
    "country.publishedPrefix": "发布",
    "country.sourceLinkLabel": "来源",
    "country.chatWelcomeDefault": "请随意询问关于该分类标准的任何问题。",
    "country.chatWelcomeWithName": "请随意询问关于{name}分类标准的任何问题——包括它与其他分类标准（如欧盟分类标准或韩国K-分类标准）的比较。",
    "country.chatExampleCompare": "将{name}的分类标准与欧盟分类标准进行比较",
    "country.chatExampleCriteria": "{taxonomy}下的主要筛选标准是什么？",
    "country.chatExampleDocumentation": "在这里证明合规需要哪些文件？",
    "country.chatExampleSimilar": "哪些其他国家的分类标准与{name}相似？",
    "translate.viewOriginal": "查看原始PDF \u2197", "translate.close": "关闭",
    "translate.language": "翻译为", "translate.originalPane": "原文", "translate.translatedPane": "翻译",
    "translate.errorGeneric": "目前无法翻译此文档。",
    "translate.errorNotDeployed": "翻译功能需要网站的实时后端支持，但此处尚未连接——只有在网站部署到 Vercel 并配置 API 密钥后才能使用（请参阅 DEPLOY_INSTRUCTIONS.md）。您仍然可以打开下方的原始 PDF。",
    "translate.truncatedNote": "此文档较长——仅显示前半部分的翻译。",
    "translate.previewUnavailable": "此来源不支持自动加载预览——该来源阻止了自动预览加载。请使用下方的“查看原始PDF”直接在浏览器中打开。",
    "home.heroTitle": "探索全球可持续金融分类标准",
    "home.heroSub": "在地图上选择一个国家，或使用下方的搜索栏。",
    "home.chipAllRegions": "所有地区", "home.chipEurope": "欧洲", "home.chipAsiaPacific": "亚太地区",
    "home.chipAmericas": "美洲", "home.chipAfrica": "非洲", "home.chipMiddleEast": "中东",
    "home.chipAllStatuses": "所有状态", "home.chipDeveloped": "已建立",
    "home.chipUnderDevelopment": "开发中", "home.chipNoTaxonomy": "无分类标准",
    "home.globalStats": "全球统计", "home.totalCountriesTracked": "追踪国家总数",
    "home.recentlyUpdated": "最近更新", "home.askAi": "咨询 AI",
    "home.objectiveFilterHeading": "按环境目标筛选", "home.sectorFilterHeading": "按行业筛选",
    "home.advancedFiltersToggle": "高级搜索与筛选",
    "home.objAll": "所有环境目标", "home.objClimateMitigation": "气候变化减缓", "home.objClimateAdaptation": "气候变化适应",
    "home.objBiodiversity": "生物多样性与生态系统", "home.objWater": "水资源与海洋资源", "home.objCircular": "循环经济",
    "home.objPollution": "污染防治", "home.objEnergy": "能源", "home.objIndustry": "产业与转型",
    "home.secAll": "所有行业", "home.secAgriculture": "农业", "home.secBuildings": "建筑",
    "home.secEcologicalRestoration": "生态修复", "home.secEnergy": "能源", "home.secEnergyTransition": "能源转型",
    "home.secEnvironmentalProtection": "环境保护", "home.secGreenServicesTrade": "绿色服务与贸易", "home.secICTDigital": "信息通信与数字化",
    "home.secInfrastructure": "基础设施", "home.secManufacturing": "制造业", "home.secNuclearTransition": "核能与转型产业",
    "home.secResourceRecycling": "资源回收", "home.secTransport": "交通运输", "home.secWasteManagement": "废物管理", "home.secWater": "水",
    "home.matchingCountriesHeading": "匹配的国家", "home.noMatchingCountries": "目前没有国家符合这些筛选条件。",
    "home.partialDataNote": "环境目标和行业筛选目前仅匹配我们已收集该详细信息的国家——即使某国分类标准可能涵盖该领域，也可能尚未在此显示。",
    "about.missionHeading": "关于本平台",
    "about.missionText": "可持续金融分类标准——定义哪些经济活动可被视为\"绿色\"或\"可持续\"的规则手册——正在迅速增加，但分散在数十个政府网站、PDF文件和不同语言中。任何想要比较欧盟分类标准与韩国K-Taxonomy，或想确认某项活动是否在任何地方被涵盖的人，都必须手动拼凑信息。本平台将这些信息汇集到一个互动空间中：一张展示当前各分类标准现状的地图、并排比较、指向官方原始文件的直接链接，以及一个可回答具体问题的AI顾问——让监管机构、投资者和企业能够更快、更少盲点地了解这一领域。",
    "about.featurePill1": "全球互动地图", "about.featurePill2": "AI 分类标准顾问",
    "about.featurePill3": "媒体与趋势中心", "about.featurePill4": "并排比较",
    "about.featurePill5": "官方原始文件",
    "about.teamHeading": "平台团队", "about.coreDeveloper": "核心开发者",
    "about.supervisorRole": "指导 · BNZ PARTNERS AI 中心负责人",
    "about.bnzHeading": "关于 BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS是一家总部位于首尔的\"超越净零\"业务集团，业务涵盖咨询、政策智库和气候科技投资。该公司直接参与设计了韩国的主要气候政策，包括K-ETS(排放交易体系)和K-Taxonomy本身，并就净零战略、可持续性披露和绿色金融为金融机构、产业界和政府提供咨询。本平台是BNZ PARTNERS新成立的AI中心计划的一部分——运用AI技术，在公司现有K-Taxonomy政策工作的基础上，让可持续金融分类标准更易于浏览、比较和应用。",
    "about.contactHeading": "有疑问、反馈，或想合作？",
    "about.contactSub": "欢迎联系我们，或订阅以随平台发展获取更新。",
    "about.contactUs": "联系我们",
    "subscribe.heading": "订阅每周简报",
    "subscribe.lede": "将分类标准新闻、报告、AI趋势洞察以及BNZ Partners公司动态的每周摘要直接发送到您的收件箱。只需提供电子邮箱地址——其他均为可选项。",
    "subscribe.sampleBanner": "一旦网站部署了Brevo API密钥（参见DEPLOY_INSTRUCTIONS.md），此表单将把订阅者添加到真实的Brevo邮件列表中。每周简报的实际发送仍需从Brevo仪表板手动完成——此表单仅处理注册。",
    "subscribe.emailLabel": "电子邮箱", "subscribe.nameLabel": "姓名", "subscribe.optional": "（可选）",
    "subscribe.interestLabel": "兴趣领域", "subscribe.interestEu": "欧盟分类标准更新",
    "subscribe.interestApac": "亚太分类标准", "subscribe.interestGreenBonds": "绿色债券与金融",
    "subscribe.interestCompliance": "合规与鉴证", "subscribe.langLabel": "语言偏好",
    "subscribe.consentComms": "我同意接收来自Global Sustainable Taxonomies / BNZ Partners的每周简报和偶尔的平台更新。",
    "subscribe.consentPrivacy": "我已阅读并接受隐私政策，并同意我的数据按照GDPR（欧盟）和PIPA（韩国）的要求进行处理。",
    "subscribe.submitBtn": "免费订阅",
    "subscribe.privacyNote": "我们仅使用您的电子邮箱发送您注册的简报——它存储在我们的Brevo邮件列表中，不会被出售或分享。您可以随时通过收到的邮件中包含的链接取消订阅。",
    "subscribe.managePrefs": "管理您的偏好设置", "subscribe.backToMedia": "返回媒体中心",
    "subscribe.benefit1Title": "每周简报", "subscribe.benefit1Text": "在每周一早晨简洁汇总本周的分类标准新闻、报告和监管更新。",
    "subscribe.benefit2Title": "平台提醒", "subscribe.benefit2Text": "当某国的分类标准状态发生变化，或发布新的官方文件时，第一时间通知您。",
    "subscribe.benefit3Title": "BNZ PARTNERS 洞察", "subscribe.benefit3Text": "来自BNZ Partners AI中心关于新兴分类标准和合规主题的不定期分析文章。",
    "subscribe.benefit4Title": "活动邀请", "subscribe.benefit4Text": "邀请您参加关于全球可持续金融分类标准的网络研讨会、小组讨论和简报会。",
    "prefs.heading": "订阅者偏好设置", "prefs.lede": "管理您的简报主题、语言和沟通设置。",
    "prefs.sampleBanner": "演示用偏好设置中心——仅供说明之用。此页面背后没有真实的订阅者账户，因此这里的任何内容都不会被保存，各字段显示的是预填的示例数据。在实际产品中，现有订阅者点击简报邮件中的链接后会进入此页面。",
    "prefs.saveBtn": "保存偏好设置（演示——已禁用）",
    "prefs.privacyNote": "此屏幕是一个不起作用的占位符。将来要真正更改您的兴趣或语言，您会使用类似这样的页面，但目前尚未连接到真实的订阅者数据库。",
    "prefs.unsubscribeLink": "取消订阅（演示——已禁用）", "prefs.backToSubscribe": "返回订阅页面",
    "media.heading": "全球媒体与趋势中心", "media.lede": "分类标准相关媒体与AI生成的趋势洞察，尽在一处。",
    "media.sampleBanner": "本页面汇集真实的实时内容:通过Google新闻获取的新闻、报告和论文,以及通过对该内容进行实时AI分析得出的AI趋势洞察和主题图表。下方的分类标准发展时间线图表使用本网站的真实数据。",
    "media.filterAll": "全部", "media.filterNews": "新闻", "media.filterReports": "报告",
    "media.filterPapers": "论文",
    "media.searchPlaceholder": "搜索媒体…", "media.trendLabel": "AI 趋势洞察",
    "media.timelineHeading": "分类标准发展时间线",
    "media.timelineNote": "真实数据——根据汇编数据集，按年份统计已发布的分类标准数量。",
    "media.thematicHeading": "主题政策趋势",
    "media.thematicNote": "基于对近期标题的实时分析得出的AI估算权重——定期更新。",
    "media.ctaHeading": "获取每周分类标准简报",
    "media.ctaText": "分类标准新闻、报告和趋势洞察的每周摘要——免费。",
    "media.ctaBtn": "免费订阅",
    "country.backToMap": "返回地图", "country.backToAdvisor": "返回 AI 顾问",
    "home.filterLogicNote": "所有筛选条件同时生效——国家须满足全部所选条件。", "home.activeFiltersLabel": "已启用的筛选", "country.translatingContent": "正在翻译此页面的内容…",
    "chat.toggleLabel": "咨询 AI 助手", "chat.title": "AI 助手",
    "chat.subtitle": "询问分类标准术语、比较各国情况，或在网站中找到您需要的内容。",
    "chat.placeholder": "输入您的问题…", "chat.send": "发送",
    "chat.greeting": "您好！我可以解释分类标准术语、比较各国情况，或为您指引正确的页面。您想了解什么？",
    "chat.thinking": "思考中…",
    "chat.errorGeneric": "暂时无法连接助手——请重试。",
    "chat.errorNotDeployed": "助手需要网站的实时后端支持，但此处尚未连接——只有在网站部署到 Vercel 并配置 API 密钥后才能使用（请参阅 DEPLOY_INSTRUCTIONS.md）。"
  },
  ar: {
    "nav.map": "الخريطة العالمية التفاعلية", "nav.advisor": "المستشار الذكي", "nav.media": "مركز الوسائط",
    "nav.subscribe": "اشترك", "nav.resources": "الموارد", "nav.about": "حول",
    "nav.comingSoon": "قريبًا", "nav.toggleTheme": "تبديل المظهر", "nav.search": "بحث",
    "footer.developedBy": "تم التطوير بواسطة", "footer.supervisedBy": "بإشراف", "footer.headOfAI": "رئيس مركز الذكاء الاصطناعي", "footer.supervisorLabel": "المشرفة",
    "search.placeholder": "ابحث في الموقع بالكامل — الدول والمعايير والأنشطة والصفحات…", "search.mapPlaceholder": "ابحث حسب البلد أو التصنيف أو الجهة الرقابية…", "search.noMatches": "لا توجد نتائج", "search.noTaxonomyData": "لا توجد بيانات تصنيف",
    "search.groupCountries": "الدول", "search.groupActivities": "أنشطة K-Taxonomy", "search.groupPages": "الصفحات والأدوات",
    "advisor.tabCompare": "مقارنة بين عدة دول", "advisor.tabCountry": "مستشار خاص بالدولة", "advisor.tabPortfolio": "مقارنة المحفظة", "advisor.tabAsk": "اسأل الذكاء الاصطناعي",
    "search.title": "بحث", "search.close": "إغلاق",
    "translate.button": "ترجمة", "translate.modalTitle": "المستند المترجم",
    "translate.loading": "جارٍ ترجمة هذا المستند…",
    "translate.loadingPart": "جارٍ ترجمة الجزء {n} من {total}…",
    "translate.disclaimer": "ترجمة آلية لمستند رسمي، للاطلاع فقط — يُرجى دائمًا الرجوع إلى النص الأصلي للأغراض القانونية أو التنظيمية.",
    "sources.note": "تم تجميع هذا الملخص من المستندات الرسمية والمصادر التنظيمية المدرجة أعلاه.",
    "sources.lastReviewed": "آخر تجميع/مراجعة للمحتوى:", "about.resourcesHeading": "أهم الموارد المرجعية", "about.resourcesIntro": "ترتبط كل صفحة بلد مباشرة بمستنداتها الرسمية الحكومية أو التنظيمية، وحيثما تتضمن الصفحة وصفًا تفصيليًا، تظهر إحالات مرقّمة لكل ادعاء محدد. إلى جانب هذه المصادر الأساسية، تُعد هذه الموارد الشاملة مفيدة لفهم التصنيفات ومقارنتها عالميًا.", "about.resourcesColResource": "المورد", "about.resourcesColDescription": "الوصف", "about.resourcesColLink": "الرابط", "footer.references": "المراجع", "country.generalResources": "موارد مرجعية عامة",
    "country.noTaxonomyEstablished": "لم يتم وضع تصنيف",
    "country.tableCountry": "الدولة",
    "country.tableTaxonomyName": "اسم التصنيف",
    "country.notEstablished": "غير موضوع",
    "country.tableStatus": "الحالة",
    "country.tableRegulator": "الجهة التنظيمية",
    "country.notPubliclySpecified": "غير محدد علنًا",
    "country.tableYearPublished": "سنة النشر",
    "country.notSpecified": "غير محدد",
    "country.tableRegion": "المنطقة",
    "country.notYetDocumented": "لم يتم توثيقه بعد لهذا التصنيف.",
    "country.colActivity": "النشاط",
    "country.colScreeningCriteria": "معايير الفحص",
    "country.colThreshold": "الحد الأدنى/الأقصى",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "راجع الوثائق الرسمية",
    "country.dnshAppliesDefault": "ينطبق",
    "country.viewAllCriteria": "عرض جميع المعايير (المصدر الرسمي)",
    "country.officialSourceLabel": "المصدر الرسمي:",
    "country.singleSourceNote": "تم حتى الآن تجميع رابط مصدر عام واحد فقط لهذه الدولة — قد تُضاف لاحقًا قائمة أكثر اكتمالاً بالوثائق الرسمية.",
    "country.noSourceYet": "لم يتم تجميع رابط مصدر رسمي لهذه الدولة بعد.",
    "country.mediaTagDocument": "وثيقة",
    "country.officialTaxonomyDocumentation": "وثائق التصنيف الرسمية",
    "country.mediaTagRegional": "إقليمي",
    "country.moreUpdatesComingSoon": "المزيد من التحديثات قريبًا",
    "country.chatPlaceholder": "اطرح سؤالاً…",
    "country.chatDisclaimer": "يستدعي نموذج ذكاء اصطناعي حقيقي عبر خادم خلفي آمن. إذا لم يستجب، فقد لا يكون هذا الموقع منشورًا بعد بمفتاح API — راجع DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "نظرة عامة على التصنيف",
    "country.headingAboutTaxonomy": "حول التصنيف",
    "country.limitedInfoNote": "معلومات عامة محدودة تم تجميعها حتى الآن — قد يتم توسيع هذا الملخص مع مراجعة مزيد من المصادر.",
    "country.noDataCompiledYet": "لم يتم تجميع بيانات تصنيف لهذه الدولة بعد.",
    "country.headingOfficialDocuments": "الوثائق الرسمية",
    "country.headingEnvironmentalObjectives": "الأهداف البيئية",
    "country.headingTechnicalCriteria": "معايير الفحص الفني",
    "country.headingAlsoApplies": "ينطبق أيضًا",
    "country.headingRelatedMedia": "الوسائط والتحديثات ذات الصلة",
    "country.headingAiChat": "محادثة الامتثال بالذكاء الاصطناعي",
    "country.headingCompare": "مقارنة مع تصنيف آخر",
    "country.compareAllCountriesBtn": "مقارنة جميع الدول",
    "country.noCountrySelected": "لم يتم اختيار دولة",
    "country.goBackToMap": "عد إلى الخريطة وانقر على دولة لعرض ملف التصنيف الخاص بها.",
    "country.compareWithLabel": "قارن تصنيف {name} مع:",
    "country.rowMandatoryVoluntary": "إلزامي / طوعي",
    "country.rowRequiresDnsh": "يتطلب DNSH",
    "country.rowRequiresSafeguards": "يتطلب ضمانات دنيا",
    "country.rowSectorsCovered": "القطاعات المشمولة",
    "country.notDocumented": "غير موثق",
    "country.yes": "نعم",
    "country.no": "لا",
    "country.publishedPrefix": "نُشر",
    "country.sourceLinkLabel": "المصدر",
    "country.chatWelcomeDefault": "اسأل أي شيء عن هذا التصنيف.",
    "country.chatWelcomeWithName": "اسأل أي شيء عن تصنيف {name} — بما في ذلك كيفية مقارنته بغيره، مثل تصنيف الاتحاد الأوروبي أو تصنيف كوريا الجنوبية (K-Taxonomy).",
    "country.chatExampleCompare": "قارن تصنيف {name} بتصنيف الاتحاد الأوروبي",
    "country.chatExampleCriteria": "ما هي معايير الفحص الرئيسية بموجب {taxonomy}؟",
    "country.chatExampleDocumentation": "ما الوثائق التي أحتاجها لإثبات الامتثال هنا؟",
    "country.chatExampleSimilar": "ما الدول الأخرى التي لديها تصنيفات مشابهة لتصنيف {name}؟",
    "translate.viewOriginal": "عرض ملف PDF الأصلي ↗", "translate.close": "إغلاق",
    "translate.language": "الترجمة إلى", "translate.originalPane": "الأصل", "translate.translatedPane": "الترجمة",
    "translate.errorGeneric": "تعذّرت ترجمة هذا المستند في الوقت الحالي.",
    "translate.errorNotDeployed": "تتطلب الترجمة الخادم الفعلي للموقع، وهو غير متصل هنا — لن يعمل هذا إلا بعد نشر الموقع على Vercel بمفتاح API (راجع DEPLOY_INSTRUCTIONS.md). لا يزال بإمكانك فتح ملف PDF الأصلي أدناه.",
    "translate.truncatedNote": "هذا المستند طويل — يتم عرض ترجمة الجزء الأول منه فقط.",
    "translate.previewUnavailable": "المعاينة غير متاحة لهذا المصدر — يحظر المصدر التحميل التلقائي للمعاينة. استخدم \"عرض ملف PDF الأصلي\" أدناه لفتحه مباشرة في متصفحك.",
    "home.heroTitle": "استكشف تصنيفات التمويل المستدام حول العالم",
    "home.heroSub": "اختر بلدًا على الخريطة، أو استخدم شريط البحث أدناه.",
    "home.chipAllRegions": "جميع المناطق", "home.chipEurope": "أوروبا", "home.chipAsiaPacific": "آسيا والمحيط الهادئ",
    "home.chipAmericas": "الأمريكتان", "home.chipAfrica": "أفريقيا", "home.chipMiddleEast": "الشرق الأوسط",
    "home.chipAllStatuses": "جميع الحالات", "home.chipDeveloped": "مكتمل",
    "home.chipUnderDevelopment": "قيد التطوير", "home.chipNoTaxonomy": "لا يوجد تصنيف",
    "home.globalStats": "إحصاءات عالمية", "home.totalCountriesTracked": "إجمالي عدد البلدان المتابَعة",
    "home.recentlyUpdated": "آخر التحديثات", "home.askAi": "اسأل الذكاء الاصطناعي",
    "home.objectiveFilterHeading": "تصفية حسب الهدف البيئي", "home.sectorFilterHeading": "تصفية حسب القطاع",
    "home.advancedFiltersToggle": "بحث وتصفية متقدمة",
    "home.objAll": "جميع الأهداف البيئية", "home.objClimateMitigation": "التخفيف من تغير المناخ", "home.objClimateAdaptation": "التكيف مع تغير المناخ",
    "home.objBiodiversity": "التنوع البيولوجي والنظم البيئية", "home.objWater": "الموارد المائية والبحرية", "home.objCircular": "الاقتصاد الدائري",
    "home.objPollution": "منع التلوث", "home.objEnergy": "الطاقة", "home.objIndustry": "الصناعة والتحول",
    "home.secAll": "جميع القطاعات", "home.secAgriculture": "الزراعة", "home.secBuildings": "المباني",
    "home.secEcologicalRestoration": "استعادة النظام البيئي", "home.secEnergy": "الطاقة", "home.secEnergyTransition": "التحول في الطاقة",
    "home.secEnvironmentalProtection": "حماية البيئة", "home.secGreenServicesTrade": "الخدمات الخضراء والتجارة", "home.secICTDigital": "تقنية المعلومات والرقمنة",
    "home.secInfrastructure": "البنية التحتية", "home.secManufacturing": "التصنيع", "home.secNuclearTransition": "الطاقة النووية وصناعات التحول",
    "home.secResourceRecycling": "إعادة تدوير الموارد", "home.secTransport": "النقل", "home.secWasteManagement": "إدارة النفايات", "home.secWater": "المياه",
    "home.matchingCountriesHeading": "الدول المطابقة", "home.noMatchingCountries": "لا توجد دول مطابقة لهذه الفلاتر بعد.",
    "home.partialDataNote": "تطابق فلاتر الهدف البيئي والقطاع حاليًا فقط الدول التي جمعنا هذا المستوى من التفاصيل عنها حتى الآن — قد لا تظهر دول أخرى هنا بعد حتى لو كان تصنيفها يغطي ذلك.",
    "about.missionHeading": "عن المنصة",
    "about.missionText": "تتزايد تصنيفات التمويل المستدام - القواعد التي تحدد الأنشطة الاقتصادية التي تُعتبر \"خضراء\" أو \"مستدامة\" - بسرعة، لكنها متناثرة عبر عشرات المواقع الحكومية والملفات بصيغة PDF واللغات المختلفة. فأي شخص يحاول مقارنة تصنيف الاتحاد الأوروبي بتصنيف كوريا K-Taxonomy، أو التحقق مما إذا كان نشاط معين مشمولاً في أي مكان، يضطر إلى تجميع ذلك يدويًا. تجمع هذه المنصة تلك المعلومات في مكان تفاعلي واحد: خريطة توضح أين تقف التصنيفات اليوم، مقارنات جنبًا إلى جنب، روابط مباشرة إلى المستندات الرسمية الأصلية، ومستشار ذكاء اصطناعي للإجابة عن أسئلة محددة — ليتمكن المنظمون والمستثمرون والشركات من التنقل في هذا المشهد بشكل أسرع وبنقاط عمياء أقل.",
    "about.featurePill1": "الخريطة العالمية التفاعلية", "about.featurePill2": "مستشار التصنيف بالذكاء الاصطناعي",
    "about.featurePill3": "مركز الوسائط والاتجاهات", "about.featurePill4": "مقارنة جنبًا إلى جنب",
    "about.featurePill5": "المستندات المصدرية الرسمية",
    "about.teamHeading": "فريق المنصة", "about.coreDeveloper": "المطوّرة الأساسية",
    "about.supervisorRole": "المشرفة · رئيسة مركز الذكاء الاصطناعي، BNZ PARTNERS",
    "about.bnzHeading": "عن BNZ PARTNERS",
    "about.bnzText": "تعد BNZ PARTNERS مجموعة أعمال \"Beyond Net Zero\" مقرها سيول، تعمل في مجالات الاستشارات، ومراكز الفكر السياساتي، والاستثمار في تقنيات المناخ. شاركت الشركة بشكل مباشر في تصميم السياسات المناخية الكورية الرئيسية، بما في ذلك نظام تداول الانبعاثات K-ETS وتصنيف K-Taxonomy نفسه، وتقدم الاستشارات للمؤسسات المالية والصناعة والحكومة بشأن استراتيجية الحياد الكربوني، والإفصاح عن الاستدامة، والتمويل الأخضر. تُعد هذه المنصة جزءًا من مبادرة AI Centre الجديدة لدى BNZ PARTNERS — تطبيق الذكاء الاصطناعي لتسهيل التنقل بين تصنيفات التمويل المستدام ومقارنتها والتصرف بناءً عليها، بالاستناد إلى عمل الشركة القائم في سياسات K-Taxonomy.",
    "about.contactHeading": "أسئلة أو ملاحظات أو ترغب في التعاون؟",
    "about.contactSub": "تواصل معنا، أو اشترك لتصلك التحديثات مع نمو هذه المنصة.",
    "about.contactUs": "تواصل معنا",
    "subscribe.heading": "اشترك في النشرة الأسبوعية",
    "subscribe.lede": "احصل على ملخص أسبوعي لأخبار التصنيفات، والتقارير، ورؤى اتجاهات الذكاء الاصطناعي، وتحديثات شركة BNZ Partners، مباشرة إلى بريدك الإلكتروني. لا يُطلب سوى عنوان بريدك الإلكتروني — وكل ما عدا ذلك اختياري.",
    "subscribe.sampleBanner": "يضيف هذا النموذج المشتركين إلى قائمة بريدية حقيقية عبر Brevo بمجرد نشر الموقع بمفتاح API الخاص بـ Brevo (راجع DEPLOY_INSTRUCTIONS.md). لا يزال إرسال النشرة الأسبوعية نفسها يتم يدويًا من لوحة تحكم Brevo — هذا النموذج يتعامل فقط مع عمليات الاشتراك.",
    "subscribe.emailLabel": "البريد الإلكتروني", "subscribe.nameLabel": "الاسم", "subscribe.optional": "(اختياري)",
    "subscribe.interestLabel": "مجال الاهتمام", "subscribe.interestEu": "تحديثات تصنيف الاتحاد الأوروبي",
    "subscribe.interestApac": "تصنيفات آسيا والمحيط الهادئ", "subscribe.interestGreenBonds": "السندات الخضراء والتمويل",
    "subscribe.interestCompliance": "الامتثال والتأكيد", "subscribe.langLabel": "تفضيل اللغة",
    "subscribe.consentComms": "أوافق على تلقي النشرة الأسبوعية والتحديثات العرضية للمنصة من Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "لقد قرأت سياسة الخصوصية وأوافق عليها، وأوافق على معالجة بياناتي وفقًا لمتطلبات اللائحة العامة لحماية البيانات (GDPR) في الاتحاد الأوروبي وقانون PIPA في كوريا الجنوبية.",
    "subscribe.submitBtn": "اشترك مجانًا",
    "subscribe.privacyNote": "نستخدم بريدك الإلكتروني فقط لإرسال النشرة التي اشتركت فيها — يتم تخزينه في قائمة Brevo البريدية الخاصة بنا ولا يُباع أو يُشارَك. يمكنك إلغاء الاشتراك في أي وقت عبر الرابط المضمّن في الرسائل التي تستلمها.",
    "subscribe.managePrefs": "إدارة تفضيلاتك", "subscribe.backToMedia": "العودة إلى مركز الوسائط",
    "subscribe.benefit1Title": "النشرة الأسبوعية", "subscribe.benefit1Text": "ملخص موجز صباح كل اثنين لأخبار وتقارير وتحديثات تنظيمية للتصنيفات خلال الأسبوع.",
    "subscribe.benefit2Title": "تنبيهات المنصة", "subscribe.benefit2Text": "كن أول من يعلم عند تغيّر حالة تصنيف بلد ما، أو عند نشر مستند رسمي جديد.",
    "subscribe.benefit3Title": "رؤى BNZ PARTNERS", "subscribe.benefit3Text": "مقالات تحليلية بين الحين والآخر من مركز الذكاء الاصطناعي لدى BNZ Partners حول مواضيع التصنيف والامتثال الناشئة.",
    "subscribe.benefit4Title": "دعوات الفعاليات", "subscribe.benefit4Text": "دعوات لحضور ندوات عبر الإنترنت، ومناقشات جماعية، وإحاطات حول تصنيفات التمويل المستدام حول العالم.",
    "prefs.heading": "تفضيلات المشترك", "prefs.lede": "إدارة مواضيع نشرتك، واللغة، وإعدادات التواصل.",
    "prefs.sampleBanner": "مركز تفضيلات تجريبي — لأغراض التوضيح فقط. لا يوجد حساب مشترك حقيقي وراء هذه الصفحة، لذا لا يتم حفظ أي شيء هنا، وتظهر الحقول معبأة مسبقًا ببيانات نموذجية. في المنتج الفعلي، يصل المشتركون الحاليون إلى هنا بعد النقر على رابط في رسالة النشرة الإلكترونية.",
    "prefs.saveBtn": "حفظ التفضيلات (تجريبي — معطّل)",
    "prefs.privacyNote": "هذه الشاشة عنصر نائب غير فعّال. لتغيير اهتماماتك أو لغتك فعليًا في المستقبل، ستستخدم صفحة كهذه، لكنها غير مرتبطة بعد بقاعدة بيانات مشتركين حقيقية.",
    "prefs.unsubscribeLink": "إلغاء الاشتراك (تجريبي — معطّل)", "prefs.backToSubscribe": "العودة إلى الاشتراك",
    "media.heading": "مركز الوسائط والاتجاهات العالمي", "media.lede": "الوسائط المتعلقة بالتصنيفات ورؤى الاتجاهات المولَّدة بالذكاء الاصطناعي، في مكان واحد.",
    "media.sampleBanner": "تجمع هذه الصفحة محتوى حقيقيًا ومباشرًا: الأخبار والتقارير والأوراق البحثية عبر Google News، ورؤى اتجاهات الذكاء الاصطناعي إلى جانب الرسم البياني الموضوعي عبر تحليل ذكاء اصطناعي مباشر لذلك المحتوى. يستخدم الرسم البياني الزمني لتطور التصنيفات أدناه بيانات هذا الموقع الحقيقية الخاصة به.",
    "media.filterAll": "الكل", "media.filterNews": "أخبار", "media.filterReports": "تقارير",
    "media.filterPapers": "أوراق بحثية",
    "media.searchPlaceholder": "ابحث في الوسائط…", "media.trendLabel": "رؤى اتجاهات الذكاء الاصطناعي",
    "media.timelineHeading": "الجدول الزمني لتطور التصنيفات",
    "media.timelineNote": "بيانات حقيقية — عدد التصنيفات المنشورة سنويًا، من مجموعة البيانات المجمَّعة.",
    "media.thematicHeading": "الاتجاهات السياساتية الموضوعية",
    "media.thematicNote": "ترجيح مقدَّر بواسطة الذكاء الاصطناعي استنادًا إلى تحليل مباشر للعناوين الأخيرة — يُحدَّث بشكل دوري.",
    "media.ctaHeading": "احصل على النشرة الأسبوعية للتصنيفات",
    "media.ctaText": "ملخص أسبوعي لأخبار التصنيفات والتقارير ورؤى الاتجاهات — مجانًا.",
    "media.ctaBtn": "اشترك مجانًا",
    "country.backToMap": "العودة إلى الخريطة", "country.backToAdvisor": "العودة إلى مستشار الذكاء الاصطناعي",
    "home.filterLogicNote": "تُطبَّق جميع عوامل التصفية معًا — يجب أن يستوفي البلد كل اختيار.", "home.activeFiltersLabel": "عوامل التصفية النشطة", "country.translatingContent": "جارٍ ترجمة محتوى هذه الصفحة…",
    "chat.toggleLabel": "اسأل مساعد الذكاء الاصطناعي", "chat.title": "مساعد الذكاء الاصطناعي",
    "chat.subtitle": "اسأل عن مصطلحات التصنيف، أو قارن بين الدول، أو ابحث عن طريقك في الموقع.",
    "chat.placeholder": "اكتب سؤالك…", "chat.send": "إرسال",
    "chat.greeting": "مرحبًا! يمكنني شرح مصطلحات التصنيف، ومقارنة الدول، وتوجيهك إلى الصفحة الصحيحة. بماذا تود أن تعرف؟",
    "chat.thinking": "جارٍ التفكير…",
    "chat.errorGeneric": "تعذّر الوصول إلى المساعد في الوقت الحالي — يرجى المحاولة مرة أخرى.",
    "chat.errorNotDeployed": "يتطلب المساعد الخادم الفعلي للموقع، وهو غير متصل هنا — لن يعمل هذا إلا بعد نشر الموقع على Vercel بمفتاح API (راجع DEPLOY_INSTRUCTIONS.md)."
  },
  pt: {
    "nav.map": "Mapa Global Interativo", "nav.advisor": "Consultor de IA", "nav.media": "Central de Mídia",
    "nav.subscribe": "Inscrever-se", "nav.resources": "Recursos", "nav.about": "Sobre",
    "nav.comingSoon": "Em breve", "nav.toggleTheme": "Alternar tema", "nav.search": "Pesquisar",
    "footer.developedBy": "Desenvolvido por", "footer.supervisedBy": "Supervisionado por", "footer.headOfAI": "Head of AI Centre", "footer.supervisorLabel": "Supervisora",
    "search.placeholder": "Pesquise em todo o site — países, critérios, atividades, páginas…", "search.mapPlaceholder": "Pesquisar por país, taxonomia ou regulador…", "search.noMatches": "Nenhum resultado", "search.noTaxonomyData": "Sem dados de taxonomia",
    "search.groupCountries": "Países", "search.groupActivities": "Atividades da K-Taxonomy", "search.groupPages": "Páginas e ferramentas",
    "advisor.tabCompare": "Comparação entre países", "advisor.tabCountry": "Consultor por país", "advisor.tabPortfolio": "Comparação de carteira", "advisor.tabAsk": "Perguntar à IA",
    "search.title": "Pesquisar", "search.close": "Fechar",
    "translate.button": "Traduzir", "translate.modalTitle": "Documento Traduzido",
    "translate.loading": "Traduzindo este documento…",
    "translate.loadingPart": "Traduzindo a parte {n} de {total}…",
    "translate.disclaimer": "Tradução automática de um documento oficial, apenas para referência — consulte sempre o original para fins legais ou de conformidade.",
    "sources.note": "Este resumo foi compilado a partir dos documentos oficiais e fontes regulatórias listadas acima.",
    "sources.lastReviewed": "Conteúdo compilado/revisado pela última vez em:", "about.resourcesHeading": "Principais Recursos de Referência", "about.resourcesIntro": "Cada página de país tem links diretos para os seus documentos oficiais do governo/regulador e, quando a página inclui uma descrição detalhada, citações numeradas para cada afirmação específica. Além dessas fontes primárias, estes recursos transversais são úteis para entender e comparar taxonomias globalmente.", "about.resourcesColResource": "Recurso", "about.resourcesColDescription": "Descrição", "about.resourcesColLink": "Link", "footer.references": "Referências", "country.generalResources": "Recursos Gerais de Referência",
    "country.noTaxonomyEstablished": "Nenhuma taxonomia estabelecida",
    "country.tableCountry": "País",
    "country.tableTaxonomyName": "Nome da Taxonomia",
    "country.notEstablished": "Não estabelecida",
    "country.tableStatus": "Status",
    "country.tableRegulator": "Regulador",
    "country.notPubliclySpecified": "Não especificado publicamente",
    "country.tableYearPublished": "Ano de Publicação",
    "country.notSpecified": "Não especificado",
    "country.tableRegion": "Região",
    "country.notYetDocumented": "Ainda não documentado para esta taxonomia.",
    "country.colActivity": "Atividade",
    "country.colScreeningCriteria": "Critérios de Triagem",
    "country.colThreshold": "Limite",
    "country.colDnsh": "DNSH",
    "country.seeOfficialDocumentation": "Consulte a documentação oficial",
    "country.dnshAppliesDefault": "Aplica-se",
    "country.viewAllCriteria": "Ver Todos os Critérios (Fonte Oficial)",
    "country.officialSourceLabel": "Fonte oficial:",
    "country.singleSourceNote": "Até agora, apenas um link de fonte geral foi compilado para este país — uma lista mais completa de documentos oficiais pode ser adicionada posteriormente.",
    "country.noSourceYet": "Ainda não foi compilado um link de fonte oficial para este país.",
    "country.mediaTagDocument": "Documento",
    "country.officialTaxonomyDocumentation": "Documentação Oficial da Taxonomia",
    "country.mediaTagRegional": "Regional",
    "country.moreUpdatesComingSoon": "Mais atualizações em breve",
    "country.chatPlaceholder": "Faça uma pergunta…",
    "country.chatDisclaimer": "Chama um modelo de IA real por meio de um backend seguro. Se não responder, este site pode ainda não estar implantado com uma chave de API — consulte DEPLOY_INSTRUCTIONS.md.",
    "country.headingOverview": "Visão Geral da Taxonomia",
    "country.headingAboutTaxonomy": "Sobre a Taxonomia",
    "country.limitedInfoNote": "Informações públicas limitadas compiladas até agora — este resumo pode ser expandido conforme mais fontes forem revisadas.",
    "country.noDataCompiledYet": "Ainda não foram compilados dados de taxonomia para este país.",
    "country.headingOfficialDocuments": "Documentos Oficiais",
    "country.headingEnvironmentalObjectives": "Objetivos Ambientais",
    "country.headingTechnicalCriteria": "Critérios Técnicos de Triagem",
    "country.headingAlsoApplies": "Também se Aplica",
    "country.headingRelatedMedia": "Mídia e Atualizações Relacionadas",
    "country.headingAiChat": "Chat de Conformidade com IA",
    "country.headingCompare": "Comparar com Outra Taxonomia",
    "country.compareAllCountriesBtn": "Comparar Todos os Países",
    "country.noCountrySelected": "Nenhum país selecionado",
    "country.goBackToMap": "Volte ao mapa e clique em um país para ver seu perfil de taxonomia.",
    "country.compareWithLabel": "Comparar a taxonomia de {name} com:",
    "country.rowMandatoryVoluntary": "Obrigatória / Voluntária",
    "country.rowRequiresDnsh": "Requer DNSH",
    "country.rowRequiresSafeguards": "Requer Salvaguardas Mínimas",
    "country.rowSectorsCovered": "Setores Cobertos",
    "country.notDocumented": "Não documentado",
    "country.yes": "Sim",
    "country.no": "Não",
    "country.publishedPrefix": "Publicado",
    "country.sourceLinkLabel": "fonte",
    "country.chatWelcomeDefault": "Pergunte qualquer coisa sobre esta taxonomia.",
    "country.chatWelcomeWithName": "Pergunte qualquer coisa sobre a taxonomia de {name} — incluindo como ela se compara a outras, como a taxonomia da UE ou a K-Taxonomy da Coreia do Sul.",
    "country.chatExampleCompare": "Comparar a taxonomia de {name} com a taxonomia da UE",
    "country.chatExampleCriteria": "Quais são os principais critérios de triagem segundo {taxonomy}?",
    "country.chatExampleDocumentation": "Que documentação eu precisaria para demonstrar conformidade aqui?",
    "country.chatExampleSimilar": "Quais outros países têm taxonomias semelhantes à de {name}?",
    "translate.viewOriginal": "Ver PDF Original ↗", "translate.close": "Fechar",
    "translate.language": "Traduzir para", "translate.originalPane": "Original", "translate.translatedPane": "Tradução",
    "translate.errorGeneric": "Não foi possível traduzir este documento agora.",
    "translate.errorNotDeployed": "A tradução requer o backend do site em produção, que não está conectado aqui — isso só funciona quando o site está implantado no Vercel com uma chave de API (consulte DEPLOY_INSTRUCTIONS.md). Você ainda pode abrir o PDF original abaixo.",
    "translate.truncatedNote": "Este documento é extenso — mostrando a tradução apenas da primeira parte.",
    "translate.previewUnavailable": "A pré-visualização não está disponível para esta fonte — a fonte bloqueia o carregamento automático da pré-visualização. Use \"Ver PDF original\" abaixo para abri-lo diretamente no navegador.",
    "home.heroTitle": "Explore as Taxonomias de Finanças Sustentáveis em Todo o Mundo",
    "home.heroSub": "Selecione um país no mapa, ou use a barra de pesquisa abaixo.",
    "home.chipAllRegions": "Todas as Regiões", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Ásia-Pacífico",
    "home.chipAmericas": "Américas", "home.chipAfrica": "África", "home.chipMiddleEast": "Oriente Médio",
    "home.chipAllStatuses": "Todos os Status", "home.chipDeveloped": "Desenvolvida",
    "home.chipUnderDevelopment": "Em Desenvolvimento", "home.chipNoTaxonomy": "Sem Taxonomia",
    "home.globalStats": "Estatísticas Globais", "home.totalCountriesTracked": "Total de Países Monitorados",
    "home.recentlyUpdated": "Atualizado Recentemente", "home.askAi": "Perguntar à IA",
    "home.objectiveFilterHeading": "Filtrar por objetivo ambiental", "home.sectorFilterHeading": "Filtrar por setor",
    "home.advancedFiltersToggle": "Pesquisa e filtragem avançadas",
    "home.objAll": "Todos os objetivos", "home.objClimateMitigation": "Mitigação das mudanças climáticas", "home.objClimateAdaptation": "Adaptação às mudanças climáticas",
    "home.objBiodiversity": "Biodiversidade e ecossistemas", "home.objWater": "Recursos hídricos e marinhos", "home.objCircular": "Economia circular",
    "home.objPollution": "Prevenção da poluição", "home.objEnergy": "Energia", "home.objIndustry": "Indústria e transição",
    "home.secAll": "Todos os setores", "home.secAgriculture": "Agricultura", "home.secBuildings": "Edifícios",
    "home.secEcologicalRestoration": "Restauração ecológica", "home.secEnergy": "Energia", "home.secEnergyTransition": "Transição energética",
    "home.secEnvironmentalProtection": "Proteção ambiental", "home.secGreenServicesTrade": "Serviços verdes e comércio", "home.secICTDigital": "TIC e digital",
    "home.secInfrastructure": "Infraestrutura", "home.secManufacturing": "Manufatura", "home.secNuclearTransition": "Nuclear e indústrias de transição",
    "home.secResourceRecycling": "Reciclagem de recursos", "home.secTransport": "Transporte", "home.secWasteManagement": "Gestão de resíduos", "home.secWater": "Água",
    "home.matchingCountriesHeading": "Países correspondentes", "home.noMatchingCountries": "Nenhum país corresponde a esses filtros ainda.",
    "home.partialDataNote": "Os filtros de objetivo e setor atualmente correspondem apenas aos países para os quais compilamos esse nível de detalhe — outros podem não aparecer aqui ainda, mesmo que sua taxonomia possa cobrir isso.",
    "about.missionHeading": "Sobre a Plataforma",
    "about.missionText": "As taxonomias de finanças sustentáveis — os regulamentos que definem quais atividades econômicas contam como \"verdes\" ou \"sustentáveis\" — estão se multiplicando rapidamente, mas estão espalhadas por dezenas de sites governamentais, PDFs e idiomas. Qualquer pessoa que tente comparar a Taxonomia da UE com a K-Taxonomy da Coreia, ou verificar se uma determinada atividade está coberta em algum lugar, precisa reunir isso manualmente. Esta plataforma reúne essas informações em um só lugar interativo: um mapa de onde as taxonomias estão hoje, comparações lado a lado, links diretos para os documentos oficiais originais, e um consultor de IA para responder perguntas específicas — para que reguladores, investidores e empresas possam navegar pelo panorama mais rápido e com menos pontos cegos.",
    "about.featurePill1": "Mapa Global Interativo", "about.featurePill2": "Consultor de IA em Taxonomias",
    "about.featurePill3": "Central de Mídia e Tendências", "about.featurePill4": "Comparação Lado a Lado",
    "about.featurePill5": "Documentos-Fonte Oficiais",
    "about.teamHeading": "Equipe da Plataforma", "about.coreDeveloper": "Desenvolvedora Principal",
    "about.supervisorRole": "Supervisora · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Sobre a BNZ PARTNERS",
    "about.bnzText": "A BNZ PARTNERS é um grupo empresarial \"Beyond Net Zero\" sediado em Seul, atuando em consultoria, think tank de políticas públicas e investimento em climate-tech. A empresa esteve diretamente envolvida na elaboração das principais políticas climáticas da Coreia, incluindo o K-ETS (Sistema de Comércio de Emissões) e a própria K-Taxonomy, e assessora instituições financeiras, indústrias e governos em estratégia net-zero, divulgação de sustentabilidade e finanças verdes. Esta plataforma faz parte da nova iniciativa AI Centre da BNZ PARTNERS — aplicando IA para tornar as taxonomias de finanças sustentáveis mais fáceis de navegar, comparar e agir, com base no trabalho existente da empresa em políticas de K-Taxonomy.",
    "about.contactHeading": "Perguntas, comentários ou quer colaborar?",
    "about.contactSub": "Entre em contato, ou inscreva-se para receber atualizações à medida que esta plataforma cresce.",
    "about.contactUs": "Fale Conosco",
    "subscribe.heading": "Inscreva-se no Resumo Semanal",
    "subscribe.lede": "Receba um resumo semanal de notícias sobre taxonomias, relatórios, insights de tendências de IA e novidades da BNZ Partners, diretamente na sua caixa de entrada. Apenas o seu endereço de e-mail é obrigatório — todo o resto é opcional.",
    "subscribe.sampleBanner": "Este formulário adiciona assinantes a uma lista de e-mail real do Brevo assim que o site for implantado com uma chave de API do Brevo (veja DEPLOY_INSTRUCTIONS.md). O envio do resumo semanal em si ainda é feito manualmente a partir do painel do Brevo — este formulário apenas processa as inscrições.",
    "subscribe.emailLabel": "Endereço de E-mail", "subscribe.nameLabel": "Nome", "subscribe.optional": "(opcional)",
    "subscribe.interestLabel": "Área de Interesse", "subscribe.interestEu": "Atualizações da Taxonomia da UE",
    "subscribe.interestApac": "Taxonomias da Ásia-Pacífico", "subscribe.interestGreenBonds": "Títulos Verdes e Finanças",
    "subscribe.interestCompliance": "Conformidade e Auditoria", "subscribe.langLabel": "Preferência de Idioma",
    "subscribe.consentComms": "Concordo em receber o resumo semanal e atualizações ocasionais da plataforma da Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "Li e aceito a Política de Privacidade, e concordo que meus dados sejam processados de acordo com o RGPD (UE) e a PIPA (Coreia do Sul).",
    "subscribe.submitBtn": "Inscrever-se Gratuitamente",
    "subscribe.privacyNote": "Usamos o seu e-mail apenas para enviar o resumo ao qual você se inscreveu — ele é armazenado em nossa lista de e-mail do Brevo e não é vendido nem compartilhado. Você pode cancelar a inscrição a qualquer momento por meio do link incluído nos e-mails que você recebe.",
    "subscribe.managePrefs": "Gerenciar suas preferências", "subscribe.backToMedia": "Voltar à Central de Mídia",
    "subscribe.benefit1Title": "Resumo Semanal", "subscribe.benefit1Text": "Um resumo conciso, toda segunda-feira de manhã, das notícias, relatórios e atualizações regulatórias da semana sobre taxonomias.",
    "subscribe.benefit2Title": "Alertas da Plataforma", "subscribe.benefit2Text": "Seja o primeiro a saber quando o status da taxonomia de um país mudar, ou quando um novo documento oficial for publicado.",
    "subscribe.benefit3Title": "Insights da BNZ PARTNERS", "subscribe.benefit3Text": "Análises ocasionais do AI Centre da BNZ Partners sobre temas emergentes de taxonomia e conformidade.",
    "subscribe.benefit4Title": "Convites para Eventos", "subscribe.benefit4Text": "Convites para webinars, painéis de discussão e briefings sobre taxonomias de finanças sustentáveis em todo o mundo.",
    "prefs.heading": "Preferências do Assinante", "prefs.lede": "Gerencie os temas do seu resumo, idioma e configurações de comunicação.",
    "prefs.sampleBanner": "Central de preferências de demonstração — apenas para fins ilustrativos. Não há uma conta de assinante real por trás desta página, portanto nada aqui é salvo, e os campos são exibidos pré-preenchidos com dados de exemplo. No produto real, os assinantes existentes chegariam aqui após clicar em um link no e-mail do resumo.",
    "prefs.saveBtn": "Salvar Preferências (demonstração — desativado)",
    "prefs.privacyNote": "Esta tela é um espaço reservado não funcional. Para realmente alterar seus interesses ou idioma no futuro, você usaria uma página como esta, mas ela ainda não está conectada a um banco de dados real de assinantes.",
    "prefs.unsubscribeLink": "Cancelar Inscrição (demonstração — desativado)", "prefs.backToSubscribe": "Voltar para Inscrever-se",
    "media.heading": "Central Global de Mídia e Tendências", "media.lede": "Mídia relacionada a taxonomias e insights de tendências gerados por IA, em um só lugar.",
    "media.sampleBanner": "Esta página agrega conteúdo real e ao vivo: Notícias, Relatórios e Artigos via Google Notícias, e Insights de Tendências de IA além do gráfico temático via análise de IA ao vivo desse conteúdo. O gráfico da linha do tempo de desenvolvimento de taxonomias abaixo usa os dados reais deste próprio site.",
    "media.filterAll": "Todos", "media.filterNews": "Notícias", "media.filterReports": "Relatórios",
    "media.filterPapers": "Artigos",
    "media.searchPlaceholder": "Pesquisar mídia…", "media.trendLabel": "Insights de Tendências de IA",
    "media.timelineHeading": "Linha do Tempo de Desenvolvimento de Taxonomias",
    "media.timelineNote": "Dados reais — número de taxonomias publicadas por ano, do conjunto de dados compilado.",
    "media.thematicHeading": "Tendências Políticas Temáticas",
    "media.thematicNote": "Ponderação estimada por IA com base em análise ao vivo de manchetes recentes — atualizada periodicamente.",
    "media.ctaHeading": "Receba o Resumo Semanal de Taxonomias",
    "media.ctaText": "Um resumo semanal de notícias, relatórios e insights de tendências sobre taxonomias — gratuito.",
    "media.ctaBtn": "Inscrever-se Gratuitamente",
    "country.backToMap": "Voltar ao mapa", "country.backToAdvisor": "Voltar ao Consultor de IA",
    "home.filterLogicNote": "Todos os filtros se aplicam em conjunto — um país deve atender a todas as seleções.", "home.activeFiltersLabel": "Filtros ativos", "country.translatingContent": "Traduzindo o conteúdo desta página…",
    "chat.toggleLabel": "Perguntar ao assistente de IA", "chat.title": "Assistente de IA",
    "chat.subtitle": "Pergunte sobre termos de taxonomia, compare países, ou encontre o que procura no site.",
    "chat.placeholder": "Digite sua pergunta…", "chat.send": "Enviar",
    "chat.greeting": "Olá! Posso explicar termos de taxonomia, comparar países, ou indicar a página certa. O que gostaria de saber?",
    "chat.thinking": "Pensando…",
    "chat.errorGeneric": "Não foi possível contatar o assistente agora — tente novamente.",
    "chat.errorNotDeployed": "O assistente requer o backend do site em produção, que não está conectado aqui — isso só funciona quando o site está implantado no Vercel com uma chave de API (consulte DEPLOY_INSTRUCTIONS.md)."
  }
};

let gstCurrentLang = "en";

function gstT(key) {
  return (GST_I18N[gstCurrentLang] && GST_I18N[gstCurrentLang][key] !== undefined)
    ? GST_I18N[gstCurrentLang][key]
    : (GST_I18N.en[key] !== undefined ? GST_I18N.en[key] : key);
}

function gstApplyI18n() {
  document.documentElement.lang = gstCurrentLang;
  document.documentElement.dir = (gstCurrentLang === "ar") ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = gstT(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = gstT(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const val = gstT(el.dataset.i18nTitle);
    el.title = val;
    if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", val);
  });
}

function gstSetupLangSelector() {
  const sel = document.getElementById("globalLangSelect");
  if (!sel) return;
  sel.innerHTML = GST_LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
  const saved = localStorage.getItem("gst-lang");
  if (saved && GST_I18N[saved]) gstCurrentLang = saved;
  sel.value = gstCurrentLang;
  sel.addEventListener("change", () => {
    gstCurrentLang = sel.value;
    localStorage.setItem("gst-lang", gstCurrentLang);
    gstApplyI18n();
    document.dispatchEvent(new CustomEvent("gst-lang-changed", { detail: { lang: gstCurrentLang } }));
  });
}

/* ---------- Global search (available from every page) ---------- */

function gstGetCountries() {
  if (!window.TAXONOMY_DATA) return [];
  return Object.keys(window.TAXONOMY_DATA).map(iso => ({ iso, entry: window.TAXONOMY_DATA[iso] }));
}

function gstOpenSearch() {
  const overlay = document.getElementById("globalSearchOverlay");
  if (!overlay) return;
  overlay.classList.add("open");
  const input = document.getElementById("globalSearchInput");
  input.value = "";
  document.getElementById("globalSearchResults").innerHTML = "";
  setTimeout(() => input.focus(), 10);
}

function gstCloseSearch() {
  const overlay = document.getElementById("globalSearchOverlay");
  if (overlay) overlay.classList.remove("open");
}

/* ---------- Site-wide search ----------
   The magnifier in the header searches the whole site's CONTENT, not just a
   list of names. Three indexes are searched at once:

     1. Countries  — every text field the site holds for all 196 jurisdictions:
                     the taxonomy name, regulator, summary, the full "About the
                     Taxonomy" write-up, sector lists, environmental objectives,
                     the screening-criteria table and official document titles.
     2. Activities — the 100 K-Taxonomy economic activities with their full
                     determining criteria (fetched on first use).
     3. Pages      — the actual wording of each page, read out of the site's own
                     translation dictionary, so a search for a phrase that
                     appears on the Subscribe or About page finds that page.

   Every hit shows the snippet that matched, with the search term highlighted,
   so it is obvious why a result is there. The map's own search box is separate
   and still looks up countries only. */

const GST_SEARCH_LIMITS = { countries: 8, activities: 8, pages: 5 };

/* Which page each group of translation keys belongs to. Keys outside this map
   (nav.*, footer.*, search.*, chat.*, country.*) are chrome or per-country
   labels rather than page content, so they are not indexed. */
const GST_PAGE_SECTIONS = [
  { prefix: "home.",      href: "index.html",     titleKey: "nav.map" },
  { prefix: "advisor.",   href: "advisor.html",   titleKey: "nav.advisor" },
  { prefix: "media.",     href: "media.html",     titleKey: "nav.media" },
  { prefix: "subscribe.", href: "subscribe.html", titleKey: "nav.subscribe" },
  { prefix: "about.",     href: "about.html",     titleKey: "nav.about" }
];

function gstNorm(s) {
  return String(s == null ? "" : s).toLowerCase();
}

/* Flattens any nested value (string, array, object) into one searchable run of
   text, so a new data field starts being searchable without extra code. */
function gstFlattenText(value, depth) {
  depth = depth || 0;
  if (value == null || depth > 4) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(v => gstFlattenText(v, depth + 1)).join(" · ");
  if (typeof value === "object") {
    return Object.keys(value)
      .filter(k => k !== "url" && k !== "icon" && k !== "citationId")
      .map(k => gstFlattenText(value[k], depth + 1))
      .join(" · ");
  }
  return "";
}

/* ---- localised country names -------------------------------------------

   The country dataset itself is written in English, so before this a Korean
   visitor typing "태국" or "미국" got "No matches". Rather than maintaining a
   translated name for every country in the data file, we use the CLDR country
   tables the browser already ships (Intl.DisplayNames) and derive the names
   for all ten interface languages at runtime, then fold them into the search
   index. They are added to the *title* only, not to the body text, so a match
   on a translated name ranks at the top and shows no snippet (there is no
   English passage to quote).

   Intl.DisplayNames takes ISO 3166-1 alpha-2 codes while the dataset is keyed
   by alpha-3, hence the lookup table. It was verified against the dataset:
   all 196 keys present, no duplicates, no orphans. */

const GST_ISO3_TO_ISO2 = {
  AUT: "AT", BEL: "BE", BGR: "BG", HRV: "HR", CYP: "CY", CZE: "CZ", DNK: "DK", EST: "EE",
  FIN: "FI", FRA: "FR", DEU: "DE", GRC: "GR", HUN: "HU", IRL: "IE", ITA: "IT", LVA: "LV",
  LTU: "LT", LUX: "LU", MLT: "MT", NLD: "NL", POL: "PL", PRT: "PT", ROU: "RO", SVK: "SK",
  SVN: "SI", ESP: "ES", SWE: "SE", NOR: "NO", ISL: "IS", LIE: "LI", GBR: "GB", CHE: "CH",
  KOR: "KR", BRN: "BN", KHM: "KH", IDN: "ID", LAO: "LA", MYS: "MY", MMR: "MM", PHL: "PH",
  SGP: "SG", THA: "TH", VNM: "VN", CHN: "CN", AUS: "AU", BRA: "BR", RUS: "RU", MEX: "MX",
  SLV: "SV", PRY: "PY", DOM: "DO", COL: "CO", ZAF: "ZA", CRI: "CR", PAN: "PA", HKG: "HK",
  CHL: "CL", KAZ: "KZ", MNG: "MN", RWA: "RW", LKA: "LK", KEN: "KE", ISR: "IL", JOR: "JO",
  GEO: "GE", AZE: "AZ", PAK: "PK", UZB: "UZ", KGZ: "KG", NPL: "NP", BGD: "BD", FJI: "FJ",
  MDA: "MD", BEN: "BJ", BFA: "BF", GNB: "GW", CIV: "CI", MLI: "ML", NER: "NE", TGO: "TG",
  SEN: "SN", CAN: "CA", ALB: "AL", ETH: "ET", GHA: "GH", IND: "IN", MAR: "MA", NZL: "NZ",
  PNG: "PG", PER: "PE", ECU: "EC", MWI: "MW", SWZ: "SZ", MDG: "MG", TUR: "TR", ARM: "AM",
  HND: "HN", ARG: "AR", URY: "UY", UKR: "UA", GTM: "GT", BIH: "BA", ZMB: "ZM", USA: "US",
  JPN: "JP", NIC: "NI", BLZ: "BZ", ARE: "AE", SAU: "SA", EGY: "EG", NGA: "NG", KWT: "KW",
  QAT: "QA", BHR: "BH", OMN: "OM", TUN: "TN", DZA: "DZ", MUS: "MU", TZA: "TZ", UGA: "UG",
  SRB: "RS", BLR: "BY", IRN: "IR", IRQ: "IQ", LBN: "LB", SYR: "SY", YEM: "YE", LBY: "LY",
  CUB: "CU", VEN: "VE", ZWE: "ZW", MOZ: "MZ", CMR: "CM", GAB: "GA", COD: "CD", COG: "CG",
  AGO: "AO", BOL: "BO", GUY: "GY", SUR: "SR", JAM: "JM", TTO: "TT", BHS: "BS", BRB: "BB",
  HTI: "HT", DMA: "DM", GRD: "GD", KNA: "KN", LCA: "LC", VCT: "VC", ATG: "AG", CPV: "CV",
  BTN: "BT", AFG: "AF", PRK: "KP", TJK: "TJ", TKM: "TM", TLS: "TL", MNE: "ME", MKD: "MK",
  AND: "AD", MCO: "MC", SMR: "SM", VAT: "VA", PSE: "PS", BWA: "BW", NAM: "NA", SLE: "SL",
  LBR: "LR", GIN: "GN", GMB: "GM", SDN: "SD", SSD: "SS", SOM: "SO", ERI: "ER", DJI: "DJ",
  TCD: "TD", CAF: "CF", GNQ: "GQ", BDI: "BI", MRT: "MR", LSO: "LS", COM: "KM", STP: "ST",
  SYC: "SC", SLB: "SB", VUT: "VU", WSM: "WS", TON: "TO", MDV: "MV", KIR: "KI", TUV: "TV",
  MHL: "MH", FSM: "FM", NRU: "NR", PLW: "PW"
};

/* CLDR gives the formal name — "대한민국", "오스트레일리아", "튀르키예". These are
   the short or older forms people actually type. Deliberately small: only
   names that would NOT already match as a substring of the CLDR name (e.g.
   "사우디" is skipped because it is inside "사우디아라비아"). */
const GST_COUNTRY_ALIASES = {
  KOR: ["한국", "남한", "코리아", "Republic of Korea", "ROK", "韓国", "韩国"],
  PRK: ["조선", "북조선", "DPRK"],
  USA: ["아메리카", "America", "U.S.", "U.S.A."],   /* 미합중국 deliberately left out: it contains "중국", so it stole China's hits */
  GBR: ["UK", "Great Britain", "그레이트브리튼", "잉글랜드", "이기리스"],
  AUS: ["호주"],
  ZAF: ["남아공", "남아프리카공화국"],
  TUR: ["터키", "Turkiye"],
  ARE: ["UAE", "에미리트", "두바이", "아부다비"],
  CIV: ["아이보리코스트"],
  MMR: ["버마", "Burma"],
  COD: ["콩고민주공화국", "민주콩고", "DRC", "Zaire"],
  COG: ["콩고공화국"],
  CZE: ["체코공화국", "Czech Republic"],
  NLD: ["홀란드", "Holland"],
  CHN: ["중화인민공화국", "PRC"],
  JPN: ["일본국", "Nippon"],
  DEU: ["독일연방공화국"],
  HKG: ["홍콩특별행정구"],
  VNM: ["월남"],
  KGZ: ["키르기스", "Kyrgyz Republic"],
  CPV: ["카부베르데", "Cape Verde"],
  SWZ: ["스와질란드", "Swaziland"],
  MKD: ["마케도니아"],
  MDA: ["몰다비아"],
  LAO: ["라오인민민주공화국"],
  VAT: ["교황청", "Holy See"],
  TLS: ["티모르"],
  MYS: ["말레이지아"]
};

/* Regional blocs: typing the Korean name of the bloc should find its members.
   Keyed on a fragment of the country's own taxonomy label so the list stays
   in sync with the data instead of being a second hard-coded member list. */
const GST_TAXONOMY_ALIASES = [
  { match: "EU Taxonomy", names: ["유럽연합", "유럽 택소노미", "EU 택소노미"] },
  { match: "ASEAN", names: ["아세안"] },
  { match: "UMOA", names: ["서아프리카"] }
];

let gstCountryNamesCache = null;
function gstCountryNames() {
  if (gstCountryNamesCache) return gstCountryNamesCache;
  const out = {};
  const isoList = Object.keys(GST_ISO3_TO_ISO2);
  isoList.forEach(iso3 => { out[iso3] = { byLang: {}, all: [] }; });

  GST_LANGUAGES.forEach(l => {
    let dn = null;
    /* Intl.DisplayNames is supported everywhere current, but an old browser
       (or one built without the full ICU data) simply falls back to English. */
    try { dn = new Intl.DisplayNames([l.code], { type: "region" }); } catch (e) { dn = null; }
    if (!dn) return;
    isoList.forEach(iso3 => {
      const iso2 = GST_ISO3_TO_ISO2[iso3];
      let name = null;
      try { name = dn.of(iso2); } catch (e) { name = null; }
      if (!name || name === iso2) return;
      out[iso3].byLang[l.code] = name;
      if (out[iso3].all.indexOf(name) === -1) out[iso3].all.push(name);
    });
  });

  Object.keys(GST_COUNTRY_ALIASES).forEach(iso3 => {
    if (!out[iso3]) return;
    GST_COUNTRY_ALIASES[iso3].forEach(a => {
      if (out[iso3].all.indexOf(a) === -1) out[iso3].all.push(a);
    });
  });

  if (window.TAXONOMY_DATA) {
    isoList.forEach(iso3 => {
      const tax = (window.TAXONOMY_DATA[iso3] || {}).taxonomy || "";
      GST_TAXONOMY_ALIASES.forEach(rule => {
        if (tax.indexOf(rule.match) === -1) return;
        rule.names.forEach(a => {
          if (out[iso3].all.indexOf(a) === -1) out[iso3].all.push(a);
        });
      });
    });
  }

  gstCountryNamesCache = out;
  return out;
}

/* Every searchable name for one country, across all interface languages. */
function gstCountryAltNames(iso3) {
  const rec = gstCountryNames()[iso3];
  return rec ? rec.all : [];
}

/* The country's name in the language currently selected, when it differs from
   the English name in the data — used to label results as "Thailand (태국)". */
function gstCountryLocalName(iso3, lang) {
  const rec = gstCountryNames()[iso3];
  if (!rec) return "";
  return rec.byLang[lang || gstCurrentLang] || "";
}

function gstCountryDisplayName(iso3, englishName) {
  const local = gstCountryLocalName(iso3);
  if (!local || gstNorm(local) === gstNorm(englishName || "")) return englishName || iso3;
  return (englishName || iso3) + " (" + local + ")";
}

/* True when the query matches the country's name in ANY interface language.
   Shared with the map search on the home page. */
function gstCountryNameMatches(iso3, q) {
  const needle = gstNorm(q);
  if (!needle) return false;
  return gstCountryAltNames(iso3).some(n => gstNorm(n).indexOf(needle) !== -1);
}

/* ---- index 1: countries (built once from the dataset already on the page) ---- */

let gstCountryIndex = null;
function gstBuildCountryIndex() {
  if (gstCountryIndex) return gstCountryIndex;
  if (!window.TAXONOMY_DATA) return [];

  gstCountryIndex = Object.keys(window.TAXONOMY_DATA).map(iso => {
    const e = window.TAXONOMY_DATA[iso] || {};
    /* Deliberately broad: the point of a site-wide search is that body text is
       searchable, not only headings. */
    const body = [
      e.name, iso, e.taxonomy, e.regulator, e.region, e.status, e.year, e.note,
      gstFlattenText(e.features), gstFlattenText(e.fullDescription),
      gstFlattenText(e.sectors), gstFlattenText(e.objectives),
      gstFlattenText(e.facts), gstFlattenText(e.activityList),
      gstFlattenText(e.officialDocuments), gstFlattenText(e.timeline),
      gstFlattenText(e.overlays)
    ].filter(Boolean).join("  ");

    return {
      iso,
      name: e.name || iso,
      sub: e.taxonomy || "",
      body,
      hay: gstNorm(body),
      /* The translated names live in the title, not the body: a hit on "태국"
         should rank first, and there is no English passage to quote for it. */
      title: gstNorm((e.name || "") + " " + iso + " " + (e.taxonomy || "") + " " +
                     gstCountryAltNames(iso).join(" "))
    };
  });
  return gstCountryIndex;
}

/* ---- index 2: K-Taxonomy activities (lazy — ~420KB, fetched on first search) ---- */

let gstActivityIndex = null;
let gstActivityLoading = null;
function gstLoadActivityIndex() {
  if (gstActivityIndex) return Promise.resolve(gstActivityIndex);
  if (gstActivityLoading) return gstActivityLoading;
  gstActivityLoading = fetch("kr-taxonomy-activities.json")
    .then(r => (r.ok ? r.json() : []))
    .then(list => {
      gstActivityIndex = (list || []).map(a => {
        const body = [
          a.code_ko, a.code_en, a.name_ko, a.name_en, a.field_ko, a.field_en,
          a.objective_ko, a.objective_en, a.section_ko, a.section_en,
          a.activity_ko, a.activity_en,
          (a.recognition_ko || []).join(" "), (a.recognition_en || []).join(" "),
          (a.exclusion_ko || []).map(r => r.objective + " " + r.text).join(" "),
          (a.exclusion_en || []).map(r => r.objective + " " + r.text).join(" ")
        ].filter(Boolean).join("  ");
        return {
          id: a.id, code: a.code_en, name_ko: a.name_ko, name_en: a.name_en,
          field_ko: a.field_ko, field_en: a.field_en,
          body, hay: gstNorm(body),
          title: gstNorm(a.code_en + " " + a.code_ko + " " + a.name_en + " " + a.name_ko)
        };
      });
      return gstActivityIndex;
    })
    .catch(() => { gstActivityIndex = []; return gstActivityIndex; });
  return gstActivityLoading;
}

/* ---- index 3: page wording, straight from the translation dictionary ---- */

let gstPageIndex = null;
let gstPageIndexLang = null;
function gstBuildPageIndex() {
  if (gstPageIndex && gstPageIndexLang === gstCurrentLang) return gstPageIndex;
  if (typeof GST_I18N === "undefined") return [];

  /* Search the current language and English together, so an English term still
     finds the page when the interface is in Korean, and vice versa. */
  const dicts = [GST_I18N[gstCurrentLang], GST_I18N.en].filter(Boolean);

  gstPageIndex = GST_PAGE_SECTIONS.map(section => {
    const lines = [];
    dicts.forEach(dict => {
      Object.keys(dict).forEach(key => {
        if (key.indexOf(section.prefix) === 0 && typeof dict[key] === "string") {
          lines.push(dict[key]);
        }
      });
    });
    const body = lines.join("  ");
    return {
      href: section.href,
      title: gstT(section.titleKey),
      body,
      hay: gstNorm(body),
      titleHay: gstNorm(gstT(section.titleKey) + " " + section.href)
    };
  });
  gstPageIndexLang = gstCurrentLang;
  return gstPageIndex;
}

/* ---- matching ---- */

/* Title hits rank above body hits, and an earlier body hit above a later one,
   so "Korea" surfaces South Korea before a country that merely mentions it. */
function gstScoreAndRank(items, q, limit) {
  const scored = [];
  items.forEach(item => {
    const inTitle = (item.title || item.titleHay || "").indexOf(q);
    const at = item.hay.indexOf(q);
    if (inTitle === -1 && at === -1) return;
    scored.push({ item, at, score: (inTitle !== -1 ? 1000 : 0) - (at === -1 ? 0 : at) / 1000 });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/* Pulls the matched phrase out of the body with a little context either side,
   and marks the term. Returns "" when the match was in the title only. */
function gstSnippet(body, hay, at, q) {
  if (at === -1) return "";
  const before = Math.max(0, at - 55);
  const after = Math.min(body.length, at + q.length + 75);
  const raw = (before > 0 ? "…" : "") + body.slice(before, after).replace(/\s+/g, " ").trim() +
              (after < body.length ? "…" : "");
  const idx = gstNorm(raw).indexOf(q);
  if (idx === -1) return gstEscapeHtml(raw);
  return gstEscapeHtml(raw.slice(0, idx)) +
         "<mark>" + gstEscapeHtml(raw.slice(idx, idx + q.length)) + "</mark>" +
         gstEscapeHtml(raw.slice(idx + q.length));
}

function gstResultHtml(href, name, sub, snippet) {
  return `
    <a class="search-result-item" href="${href}">
      <span class="sr-name">${gstEscapeHtml(name)}</span>
      ${sub ? `<span class="sr-sub">${gstEscapeHtml(sub)}</span>` : ""}
      ${snippet ? `<span class="sr-snippet">${snippet}</span>` : ""}
    </a>`;
}

function gstRenderSearchResults(q) {
  const resultsEl = document.getElementById("globalSearchResults");
  if (!resultsEl) return;

  const isKo = gstCurrentLang === "ko";
  /* Take a wider slice of country hits than we will display: near-identical
     ones get merged just below, and the surplus keeps the list full afterwards. */
  const countries = gstScoreAndRank(gstBuildCountryIndex(), q, GST_SEARCH_LIMITS.countries * 8);
  const activities = gstScoreAndRank(gstActivityIndex || [], q, GST_SEARCH_LIMITS.activities);
  const pages = gstScoreAndRank(gstBuildPageIndex(), q, GST_SEARCH_LIMITS.pages);

  if (!countries.length && !activities.length && !pages.length) {
    resultsEl.innerHTML = `<div class="search-empty">${gstEscapeHtml(gstT("search.noMatches"))}</div>`;
    return;
  }

  let html = "";

  if (countries.length) {
    html += `<div class="search-group-label">${gstEscapeHtml(gstT("search.groupCountries"))}</div>`;
    /* The 27 EU member states share one write-up, so a term from that shared
       text would otherwise fill every slot with the same paragraph. Collapse
       hits whose taxonomy and matched snippet are identical into one row. */
    const merged = [];
    const seen = {};
    countries.forEach(({ item, at }) => {
      const snippet = gstSnippet(item.body, item.hay, at, q);
      const key = item.sub + "||" + snippet;
      const label = gstCountryDisplayName(item.iso, item.name);
      if (seen[key] !== undefined) { merged[seen[key]].names.push(label); return; }
      seen[key] = merged.length;
      merged.push({ iso: item.iso, names: [label], sub: item.sub, snippet });
    });
    html += merged.slice(0, GST_SEARCH_LIMITS.countries).map(m => {
      const shown = m.names.slice(0, 3).join(", ");
      const extra = m.names.length > 3 ? ` +${m.names.length - 3}` : "";
      return gstResultHtml(`country.html?iso=${m.iso}`, shown + extra, m.sub, m.snippet);
    }).join("");
  }

  if (activities.length) {
    html += `<div class="search-group-label">${gstEscapeHtml(gstT("search.groupActivities"))}</div>`;
    html += activities.map(({ item, at }) =>
      gstResultHtml(`country.html?iso=KOR&activity=${encodeURIComponent(item.id)}`,
        item.code + " " + (isKo ? item.name_ko : item.name_en),
        (isKo ? item.field_ko : item.field_en) + " · K-Taxonomy",
        gstSnippet(item.body, item.hay, at, q))
    ).join("");
  }

  if (pages.length) {
    html += `<div class="search-group-label">${gstEscapeHtml(gstT("search.groupPages"))}</div>`;
    html += pages.map(({ item, at }) =>
      gstResultHtml(item.href, item.title, "", gstSnippet(item.body, item.hay, at, q))
    ).join("");
  }

  resultsEl.innerHTML = html;
}

function gstRunSearch(query) {
  const resultsEl = document.getElementById("globalSearchResults");
  const q = gstNorm(query.trim());
  if (!q) { resultsEl.innerHTML = ""; return; }

  gstRenderSearchResults(q);

  /* The activity file arrives a moment later on the very first search; re-render
     then, but only if the box still holds the query these results belong to. */
  if (!gstActivityIndex) {
    gstLoadActivityIndex().then(() => {
      const input = document.getElementById("globalSearchInput");
      if (input && gstNorm(input.value.trim()) === q) gstRenderSearchResults(q);
    });
  }
}

function gstSetupGlobalSearch() {
  const btn = document.getElementById("globalSearchBtn");
  const overlay = document.getElementById("globalSearchOverlay");
  if (!btn || !overlay) return;

  btn.addEventListener("click", gstOpenSearch);
  overlay.addEventListener("click", e => { if (e.target === overlay) gstCloseSearch(); });
  document.getElementById("globalSearchCloseBtn").addEventListener("click", gstCloseSearch);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) gstCloseSearch();
  });
  document.getElementById("globalSearchInput").addEventListener("input", e => gstRunSearch(e.target.value));
}

/* ---------- Sitewide AI Assistant (persistent chat widget, on every page) ---------- */

let gstChatHistory = [];
let gstChatOpen = false;
let gstChatBusy = false;

function gstEscapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function gstChatWidgetHtml() {
  return `
    <button type="button" id="gstChatToggle" class="gst-chat-toggle" data-i18n-title="chat.toggleLabel" title="Ask the AI Assistant" aria-label="Ask the AI Assistant">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    </button>
    <div id="gstChatPanel" class="gst-chat-panel" aria-hidden="true">
      <div class="gst-chat-header">
        <span data-i18n="chat.title">AI Assistant</span>
        <button type="button" id="gstChatCloseBtn" class="icon-btn" data-i18n-title="translate.close" title="Close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <p class="gst-chat-subtitle" data-i18n="chat.subtitle">Ask about taxonomy terms, compare countries, or find your way around the site.</p>
      <div class="gst-chat-log" id="gstChatLog"></div>
      <form class="gst-chat-input-row" id="gstChatForm">
        <input type="text" id="gstChatInput" data-i18n-placeholder="chat.placeholder" placeholder="Type your question…" autocomplete="off" />
        <button type="submit" id="gstChatSendBtn" data-i18n="chat.send">Send</button>
      </form>
    </div>
  `;
}

function gstChatBubbleHtml(m) {
  const cls = m.role === "user" ? "chat-msg-user" : "chat-msg-assistant";
  const bubbleCls = "chat-bubble" + (m.pending ? " chat-bubble-pending" : "") + (m.error ? " chat-bubble-error" : "");
  return `<div class="chat-msg ${cls}"><div class="${bubbleCls}">${gstEscapeHtml(m.content).replace(/\n/g, "<br>")}</div></div>`;
}

function gstRenderChatLog() {
  const log = document.getElementById("gstChatLog");
  if (!log) return;
  if (!gstChatHistory.length) {
    log.innerHTML = `<div class="chat-msg chat-msg-assistant"><div class="chat-bubble">${gstEscapeHtml(gstT("chat.greeting"))}</div></div>`;
    return;
  }
  log.innerHTML = gstChatHistory.map(gstChatBubbleHtml).join("");
  log.scrollTop = log.scrollHeight;
}

function gstOpenChat() {
  const panel = document.getElementById("gstChatPanel");
  const toggle = document.getElementById("gstChatToggle");
  if (!panel) return;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  if (toggle) toggle.classList.add("open");
  gstChatOpen = true;
  gstRenderChatLog();
  setTimeout(() => { const input = document.getElementById("gstChatInput"); if (input) input.focus(); }, 10);
}

function gstCloseChat() {
  const panel = document.getElementById("gstChatPanel");
  const toggle = document.getElementById("gstChatToggle");
  if (panel) { panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); }
  if (toggle) toggle.classList.remove("open");
  gstChatOpen = false;
}

async function gstSendChatMessage(question) {
  if (gstChatBusy || !question) return;
  gstChatBusy = true;
  const sendBtn = document.getElementById("gstChatSendBtn");
  if (sendBtn) sendBtn.disabled = true;

  gstChatHistory.push({ role: "user", content: question });
  gstChatHistory.push({ role: "assistant", content: gstT("chat.thinking"), pending: true });
  gstRenderChatLog();

  const historyForApi = gstChatHistory.slice(0, -2).map(m => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, history: historyForApi, lang: gstCurrentLang })
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }

    gstChatHistory.pop();
    if (!res.ok) {
      const upstreamMsg = (data && data.error) || "";
      const msg = /ANTHROPIC_API_KEY|backend/i.test(upstreamMsg) ? gstT("chat.errorNotDeployed") : (upstreamMsg || gstT("chat.errorGeneric"));
      gstChatHistory.push({ role: "assistant", content: msg, error: true });
    } else {
      gstChatHistory.push({ role: "assistant", content: data.answer || "(no response)" });
    }
  } catch (err) {
    gstChatHistory.pop();
    gstChatHistory.push({ role: "assistant", content: gstT("chat.errorNotDeployed"), error: true });
  }

  gstRenderChatLog();
  gstChatBusy = false;
  if (sendBtn) sendBtn.disabled = false;
}

function gstSetupChatWidget() {
  if (document.getElementById("gstChatToggle")) return;
  const wrap = document.createElement("div");
  wrap.className = "gst-chat-wrap";
  wrap.innerHTML = gstChatWidgetHtml();
  document.body.appendChild(wrap);

  document.getElementById("gstChatToggle").addEventListener("click", () => {
    if (gstChatOpen) gstCloseChat(); else gstOpenChat();
  });
  document.getElementById("gstChatCloseBtn").addEventListener("click", gstCloseChat);
  document.getElementById("gstChatForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("gstChatInput");
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    gstSendChatMessage(question);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && gstChatOpen) gstCloseChat();
  });
  document.addEventListener("gst-lang-changed", () => { if (gstChatOpen) gstRenderChatLog(); });
}

function gstInit() {
  const saved = localStorage.getItem("gst-lang");
  if (saved && GST_I18N[saved]) gstCurrentLang = saved;
  gstSetupLangSelector();
  gstApplyI18n();
  gstSetupGlobalSearch();
  gstSetupChatWidget();
  gstApplyI18n();
}

document.addEventListener("DOMContentLoaded", gstInit);
