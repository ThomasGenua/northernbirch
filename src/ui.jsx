// Shared foundation: palette, type, the rate table, translations, routing and
// metadata, the small components every page builds on, and the hooks behind
// them. Split out of App.jsx so page components can live in their own modules
// and be loaded on demand -- nothing here changed in the move.
import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import './index.css';
import ratesData from './data/rates.json';

export const C={navy:"#1B2A4A",accent:"#2E86C1",dark:"#0C1829",green:"#27AE60",amber:"#D4A547",amberText:"#8A6410",red:"#E74C3C",redText:"#B3271A",birch:"#C8B88A",birchLight:"#F5F0E6",cream:"#FDFBF7",purple:"#8E44AD",accentText:"#1F6FA5",accentOnDark:"#7FB8E0",greenOnDark:"#6FD79B",amberOnDark:"#E8C46A",purpleOnDark:"#C89BDB",redOnDark:"#F5A99F",amberFill:"#8A6410",birchText:"#7D6C3E",greenText:"#197A41",greenFill:"#177A41",lightBlue:"#EBF5FB"};
export const ff="'Playfair Display',Georgia,serif",fs="'DM Sans',sans-serif";

// ============ POSTED RATES (single source: RatesPage + homepage banking cards read this) ============
// Posted rates come from src/data/rates.json so that changing what the site
// advertises is a one-line edit to a data file, not a code change. The build
// validates that file first (scripts/check-rates.mjs) and refuses to run if a
// rate is missing or malformed.
export const RATE=ratesData.rates;
export const RATES_EFFECTIVE=ratesData.effective;
// The posted table on /rates, as [term, rate] rows.
export const RATE_TABLES=ratesData.tables;
// "1 September 2026" -- the date members see beside the rates.
export function ratesEffectiveLabel(){
  const d=new Date(`${RATES_EFFECTIVE}T00:00:00`);
  if(Number.isNaN(d.getTime()))return RATES_EFFECTIVE;
  return d.toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});
}

// ============ CORE BANKING PRODUCTS (homepage cards, nav, search) ============
export const BANKING=[
  {k:"mortgages",t:"Mortgages",p:"mortgages",c:C.green,tc:C.greenText,d:"Fixed, variable, and high-ratio mortgages -- including co-op apartment financing few lenders offer.",rate:RATE.m5,rl:"5-year fixed",b:["Free pre-approval, held 120 days","Co-op and multi-unit financing","C$3,500 cash back offer available"],cta:"Explore Mortgages",kw:"mortgage home loan pre-approval renewal refinance fixed variable high ratio co-op heloc"},
  {k:"cards",t:"Credit Cards",p:"cards",c:C.purple,tc:C.purple,d:"Collabria Mastercard cards with cash back, low-rate, and travel rewards options.",rate:RATE.mcLow,rl:"Low Rate APR",b:["No-annual-fee options","Cash back up to 2%","Lock and unlock in the app"],cta:"Apply for a Credit Card",kw:"credit card mastercard collabria cash back rewards low rate apply"},
  {k:"chequing",t:"Chequing Accounts",p:"accounts",c:C.accent,tc:C.accentText,d:"No-fee everyday banking with unlimited e-Transfers and free member cheques.",rate:RATE.chq,rl:"Monthly fee",b:["$0 monthly fee for members","Unlimited e-Transfers","THE EXCHANGE ATM network"],cta:"Compare Accounts",kw:"chequing checking everyday banking debit e-transfer account fees student senior"},
  {k:"savings",t:"Savings & GICs",p:"accounts",c:C.amber,tc:C.amberText,d:"High-interest savings, GIC terms from 90 days to 5 years, and registered TFSA, RRSP, FHSA and RESP plans.",rate:RATE.gic1,rl:"1-year GIC",b:["No minimum balance","GIC terms from 90 days","TFSA, RRSP, FHSA, RESP eligible"],cta:"Compare Accounts",kw:"savings gic tfsa rrsp fhsa resp rdsp registered high interest term deposit"},
  {k:"invest",t:"Investments",p:"personal",c:C.navy,tc:C.navy,d:"Mutual funds, Qtrade direct investing, and VirtualWealth portfolios inside your registered accounts.",rate:RATE.hisa,rl:"Savings rate",b:["Self-directed or advisor-managed","Held in TFSA, RRSP or cash","Aviso Wealth partnership"],cta:"Explore Investing",kw:"invest investments portfolio mutual funds qtrade virtualwealth etf stocks wealth retirement"},
];

// ============ TRANSLATION SYSTEM ============
export const TX={
  // Nav
  "Personal":{est:"Eraisik",lat:"Privātpersonām"},
  "Banking":{est:"Pangandus",lat:"Bankas pakalpojumi"},
  "Chequing & Savings":{est:"Arve- ja säästukontod",lat:"Norēķinu un krājkonti"},
  "Chequing":{est:"Arvelduskonto",lat:"Norēķinu konts"},
  "Mortgages":{est:"Hüpoteeklaenud",lat:"Hipotēkas"},
  "Credit Cards":{est:"Krediitkaardid",lat:"Kredītkartes"},
  "Personal Banking":{est:"Erapangandus",lat:"Privātpersonu banka"},
  "Banking Products":{est:"Pangatooted",lat:"Bankas produkti"},
  "Everyday banking, start to finish":{est:"Igapäevane pangandus algusest lõpuni",lat:"Ikdienas banku pakalpojumi no sākuma līdz beigām"},
  "A Full-Service Credit Union Since 1954":{est:"Täisteenust pakkuv krediidiühistu alates 1954",lat:"Pilna servisa krājaizdevu sabiedrība kopš 1954. gada"},
  "Compare Accounts":{est:"Võrdle kontosid",lat:"Salīdzināt kontus"},
  "Explore Mortgages":{est:"Tutvu hüpoteeklaenudega",lat:"Iepazīties ar hipotēkām"},
  "Apply for a Credit Card":{est:"Taotle krediitkaarti",lat:"Pieteikties kredītkartei"},
  "Apply for this card":{est:"Taotle seda kaarti",lat:"Pieteikties šai kartei"},
  "Explore Investing":{est:"Tutvu investeerimisega",lat:"Iepazīt investēšanu"},
  "See All Rates":{est:"Vaata kõiki intresse",lat:"Skatīt visas likmes"},
  "Get Pre-Approved":{est:"Küsi eelnõusolekut",lat:"Saņemt priekšapstiprinājumu"},
  "Open an Account":{est:"Ava konto",lat:"Atvērt kontu"},
  "Savings & GICs":{est:"Säästud ja tähtajalised hoiused",lat:"Uzkrājumi un noguldījumi"},
  "Registered accounts":{est:"Registreeritud kontod",lat:"Reģistrētie konti"},
  "Compare accounts side by side":{est:"Võrdle kontosid kõrvuti",lat:"Salīdziniet kontus līdzās"},
  "Insurance":{est:"Kindlustus",lat:"Apdrošināšana"},
  "Advice":{est:"Nõustamine",lat:"Konsultācijas"},
  "Financial Advice":{est:"Finantsnõustamine",lat:"Finanšu konsultācijas"},
  "Advice from people you can meet":{est:"Nõu inimestelt, keda saate kohata",lat:"Padoms no cilvēkiem, kurus varat satikt"},
  "Planning, retirement, investments, estate and tax advice from Northern Birch's wealth team -- starting with a Financial Check-Up that costs members nothing.":{est:"Planeerimine, pension, investeeringud, pärand ja maksunõustamine Northern Birchi varahaldusmeeskonnalt -- alustades finantsülevaatusest, mis on liikmetele tasuta.",lat:"Plānošana, pensija, investīcijas, mantojums un nodokļu konsultācijas no Northern Birch bagātības pārvaldības komandas -- sākot ar finanšu pārbaudi, kas biedriem ir bez maksas."},
  "Financial Check-Up":{est:"Finantsülevaatus",lat:"Finanšu pārbaude"},
  "Retirement & Investments":{est:"Pension ja investeeringud",lat:"Pensija un investīcijas"},
  "Estate & Tax Planning":{est:"Pärandi- ja maksuplaneerimine",lat:"Mantojuma un nodokļu plānošana"},
  "Explore Financial Advice":{est:"Tutvu finantsnõustamisega",lat:"Iepazīt finanšu konsultācijas"},
  "Travel":{est:"Reisimine",lat:"Ceļošana"},
  "Business":{est:"Ettevõtlus",lat:"Bizness"},
  "Digital":{est:"Digitaalne",lat:"Digitālā"},
  "Tools":{est:"Tööriistad",lat:"Rīki"},
  "Rates":{est:"Intressid",lat:"Likmes"},
  "Community":{est:"Kogukond",lat:"Kopiena"},
  "Sign In":{est:"Logi sisse",lat:"Ieiet"},
  "Credit Union":{est:"Krediidiühistu",lat:"Krājaizdevu sabiedrība"},
  // Hero
  "Your whole financial life.":{est:"Kogu teie finantselu.",lat:"Visa jūsu finanšu dzīve."},
  "Under one Birch.":{est:"Ühe kase all.",lat:"Zem viena bērza."},
  "The Future of Member Financial Wellness":{est:"Liikmete rahalise heaolu tulevik",lat:"Biedru finanšu labklājības nākotne"},
  "Insurance. Investments. International transfers. Estate planning. Business benefits. 70+ years of community trust.":{est:"Kindlustus. Investeeringud. Rahvusvahelised ülekanded. Pärandiplaneerimine. Äritoetused. 70+ aastat kogukonna usaldust.",lat:"Apdrošināšana. Investīcijas. Starptautiskie pārvedumi. Mantojuma plānošana. Biznesa priekšrocības. 70+ gadu kopienas uzticība."},
  "Get an Insurance Quote":{est:"Küsi kindlustuspakkumist",lat:"Saņemt apdrošināšanas piedāvājumu"},
  "AI Insurance Advisor":{est:"AI kindlustusnõustaja",lat:"AI apdrošināšanas padomnieks"},
  "Travel & Transfers":{est:"Reisimine ja ülekanded",lat:"Ceļošana un pārvedumi"},
  "Business Solutions":{est:"Ärilahendused",lat:"Biznesa risinājumi"},
  "Years of Heritage":{est:"Aastat pärandit",lat:"Gadu mantojuma"},
  "Branches incl. KESKUS":{est:"Filiaalid sh. KESKUS",lat:"Filiāles ieskaitot KESKUS"},
  "Insurance Products":{est:"Kindlustustooted",lat:"Apdrošināšanas produkti"},
  "New Digital Services":{est:"Uued digiteenused",lat:"Jauni digitālie pakalpojumi"},
  // Insurance
  "Protection for every stage of your life":{est:"Kaitse igaks eluetapiks",lat:"Aizsardzība katram dzīves posmam"},
  "Comprehensive Insurance Protection":{est:"Terviklik kindlustuskaitse",lat:"Visaptveroša apdrošināšanas aizsardzība"},
  "Life & Health":{est:"Elu ja tervis",lat:"Dzīvība un veselība"},
  "Home & Auto":{est:"Kodu ja auto",lat:"Māja un auto"},
  "Travel & Specialty":{est:"Reis ja eriliigid",lat:"Ceļojumi un speciālā"},
  "Term Life Insurance":{est:"Tähtajaline elukindlustus",lat:"Termiņa dzīvības apdrošināšana"},
  "Critical Illness":{est:"Kriitilised haigused",lat:"Kritiskas slimības"},
  "Disability Insurance":{est:"Töövõimetuskindlustus",lat:"Invaliditātes apdrošināšana"},
  "Mortgage Protection":{est:"Hüpoteegi kaitse",lat:"Hipotēkas aizsardzība"},
  "Home Insurance":{est:"Kodukindlustus",lat:"Mājas apdrošināšana"},
  "Co-op Insurance":{est:"Ühistukindlustus",lat:"Kooperatīva apdrošināšana"},
  "Auto Insurance":{est:"Autokindlustus",lat:"Auto apdrošināšana"},
  "Tenant Insurance":{est:"Üürnikukindlustus",lat:"Īrnieka apdrošināšana"},
  "Get a Quote":{est:"Küsi pakkumist",lat:"Saņemt piedāvājumu"},
  "Compare Plans":{est:"Võrdle plaane",lat:"Salīdzināt plānus"},
  // Travel
  "Connected to Your Heritage":{est:"Ühenduses teie pärandiga",lat:"Saistīts ar jūsu mantojumu"},
  "Travel, transfers & foreign exchange for the Baltic community":{est:"Reisimine, ülekanded ja valuutavahetus Balti kogukonnale",lat:"Ceļošana, pārvedumi un valūtas maiņa Baltijas kopienai"},
  "Travel Insurance":{est:"Reisikindlustus",lat:"Ceļojumu apdrošināšana"},
  "International Transfers":{est:"Rahvusvahelised ülekanded",lat:"Starptautiskie pārvedumi"},
  "Foreign Exchange":{est:"Valuutavahetus",lat:"Valūtas maiņa"},
  // Business
  "Everything your business needs":{est:"Kõik, mida teie ettevõte vajab",lat:"Viss, kas nepieciešams jūsu biznesam"},
  "Group Health & Dental":{est:"Grupi tervis ja hambaravi",lat:"Grupas veselība un zobārstniecība"},
  "Commercial Insurance":{est:"Ärikindlustus",lat:"Komerciālā apdrošināšana"},
  "Key Person Insurance":{est:"Võtmeisiku kindlustus",lat:"Galvenās personas apdrošināšana"},
  "Succession Planning":{est:"Järeltulijate planeerimine",lat:"Pēctecības plānošana"},
  // Digital
  "Heritage values. Digital convenience.":{est:"Pärandväärtused. Digitaalne mugavus.",lat:"Mantojuma vērtības. Digitālais ērtums."},
  "Insurance Dashboard":{est:"Kindlustuse ülevaade",lat:"Apdrošināšanas panelis"},
  "Smart Quote Engine":{est:"Nutikas pakkumismootor",lat:"Viedā piedāvājumu sistēma"},
  "Financial Planning":{est:"Finantsplaneerimine",lat:"Finanšu plānošana"},
  "Mobile Banking":{est:"Mobiilipank",lat:"Mobilā banka"},
  // Estate
  "Protect your family across generations":{est:"Kaitske oma perekonda põlvkondade vältel",lat:"Aizsargājiet savu ģimeni paaudžu garumā"},
  // Community
  "70 years of trust":{est:"70 aastat usaldust",lat:"70 gadu uzticības"},
  "Our Heritage":{est:"Meie pärand",lat:"Mūsu mantojums"},
  "KESKUS Flagship":{est:"KESKUS lipulaev",lat:"KESKUS galvenā filiāle"},
  // Contact
  "We're here for you":{est:"Oleme teie jaoks siin",lat:"Mēs esam šeit jūsu labā"},
  // Tools
  "See your estimated premium instantly":{est:"Vaadake oma hinnangulist kindlustusmakset koheselt",lat:"Skatiet savu apdrošināšanas prēmiju nekavējoties"},
  "Interactive Quote Calculator":{est:"Interaktiivne pakkumiskalkulaator",lat:"Interaktīvais piedāvājumu kalkulators"},
  "File an insurance claim":{est:"Esitage kindlustusnõue",lat:"Iesniegt apdrošināšanas prasību"},
  "Book an Appointment":{est:"Broneeri kohtumine",lat:"Rezervēt tikšanos"},
  "Meet with an advisor":{est:"Kohtu nõustajaga",lat:"Tikties ar konsultantu"},
  // Dashboard
  "Welcome back":{est:"Tere tulemast tagasi",lat:"Laipni lūdzam atpakaļ"},
  "My Insurance Policies":{est:"Minu kindlustuspoliisid",lat:"Manas apdrošināšanas polises"},
  "Recent Activity":{est:"Hiljutised tehingud",lat:"Nesenā darbība"},
  "Quick Actions":{est:"Kiirtoimingud",lat:"Ātrās darbības"},
  "Your Coverage Score":{est:"Teie kaitse skoor",lat:"Jūsu seguma novērtējums"},
  // AI
  "Tell me about your life situation and I'll recommend the right insurance products for you.":{est:"Rääkige mulle oma eluolukorrast ja soovitan teile õigeid kindlustustooteid.",lat:"Pastāstiet par savu dzīves situāciju, un es ieteikšu jums piemērotus apdrošināšanas produktus."},
  "Powered by Claude -- Available 24/7":{est:"Töötab Claude baasil -- Saadaval 24/7",lat:"Darbina Claude -- Pieejams 24/7"},
  // Footer
  "Your whole financial life. Under one Birch.":{est:"Kogu teie finantselu. Ühe kase all.",lat:"Visa jūsu finanšu dzīve. Zem viena bērza."},
  "Privacy Policy":{est:"Privaatsuspoliitika",lat:"Privātuma politika"},
  "Terms of Use":{est:"Kasutustingimused",lat:"Lietošanas noteikumi"},
  "Accessibility (AODA)":{est:"Ligipääsetavus (AODA)",lat:"Pieejamība (AODA)"},
  "Complaint Resolution":{est:"Kaebuste lahendamine",lat:"Sūdzību izskatīšana"},
  // Common
  "Learn More":{est:"Loe lisaks",lat:"Uzzināt vairāk"},
  "Contact Us":{est:"Võtke meiega ühendust",lat:"Sazinieties ar mums"},
  "Send":{est:"Saada",lat:"Sūtīt"},
  "Book Appointment":{est:"Broneeri kohtumine",lat:"Rezervēt tikšanos"},
  "Coming Soon":{est:"Tulekul",lat:"Drīzumā"},
  // Shown only when a non-English language is selected. NOTE: like the rest of
  // this table these two strings should be confirmed by a native speaker.
  "Parts of this site are still only in English. Call us and we will serve you in your language.":{est:"Osa sellest veebisaidist on praegu ainult inglise keeles. Helistage meile ja teenindame teid eesti keeles.",lat:"Daļa šīs vietnes pašlaik ir pieejama tikai angļu valodā. Zvaniet mums, un mēs jūs apkalposim latviešu valodā."},
};
export function t(key,lang){if(!lang||lang==="en")return key;return TX[key]?.[lang==="est"?"est":"lat"]||key;}

// The language switcher only lived in React state, so a refresh, a bookmark or
// a shared link always came back in English -- the choice was silently thrown
// away every time. Keep it next to the cookie preference, and tell assistive
// technology which language the page chrome is actually in.
export const LANG_KEY="nb-lang";
// The pages that actually read the translation table. Everything else renders
// English regardless of the switcher, so it is marked lang="en" rather than
// inheriting the selected language and being read out with the wrong voice.
export const TRANSLATED_PAGES=new Set(["home","mortgages","cards","accounts"]);
export const LANG_TAG={en:"en",est:"et",lat:"lv"};
export function readLang(){
  try{const v=window.localStorage.getItem(LANG_KEY);return v==="est"||v==="lat"?v:"en"}catch(e){return "en"}
}
const langListeners=new Set();
const subscribeLang=(cb)=>{langListeners.add(cb);return()=>langListeners.delete(cb)};
export function writeLang(v){
  try{window.localStorage.setItem(LANG_KEY,v)}catch(e){}
  langListeners.forEach(l=>l());
}
/** The chosen language. English while hydrating, because that is what the
 *  prerendered HTML says; the stored choice takes over on the same tick. */
export function useLang(){return useSyncExternalStore(subscribeLang,readLang,()=>"en")}

// ============ ROUTES ============
// Every page has a real URL, so it can be linked, shared, bookmarked and
// indexed. Navigation still goes through setPage(key): the router turns that
// into a history entry, which is why the existing call sites are unchanged.
export const ROUTES={
  home:"/",personal:"/personal",accounts:"/accounts",mortgages:"/mortgages",cards:"/cards",
  insurance:"/insurance",advice:"/advice",apply:"/apply",travel:"/travel",business:"/business",digital:"/digital",estate:"/estate",
  community:"/community",contact:"/contact",rates:"/rates",quote:"/quote",compare:"/compare",
  claims:"/claims",calculators:"/calculators",booking:"/booking",referrals:"/referrals",
  blog:"/blog",glossary:"/glossary",mobileapp:"/mobile-app",dashboard:"/dashboard",
  aiadvisor:"/ai-advisor",analyzer:"/coverage-analyzer",healthcheck:"/financial-health-check",
  lifesim:"/life-event-simulator",docreader:"/policy-document-reader",tax:"/tax-optimizer",
  messages:"/messages",privacy:"/privacy",accessibility:"/accessibility",complaints:"/complaints",
  terms:"/terms",leadership:"/leadership",
};
export const PATH_TO_PAGE=Object.fromEntries(Object.entries(ROUTES).map(([k,v])=>[v,k]));
export function pageFromPath(path){return PATH_TO_PAGE[path.replace(/\/+$/,"")||"/"]||"home"}

// Per-page title and description. Without these every URL shared the one
// <title> in index.html, so nothing was distinguishable in search or when
// pasted into a chat.
export const META={
  home:["Northern Birch Credit Union | Banking & Insurance in Toronto","Chequing, savings, mortgages, credit cards, GICs and registered plans from a full-service Toronto credit union serving the Estonian and Latvian communities since 1954."],
  accounts:["Chequing, Savings & Registered Accounts | Northern Birch","Compare no-fee chequing, high-interest savings, GIC terms and TFSA, RRSP, FHSA, RESP and RRIF plans at Northern Birch Credit Union."],
  mortgages:["Mortgages | Northern Birch Credit Union","Fixed, variable and high-ratio mortgages, plus co-op apartment financing most lenders decline. Free pre-approval from a Toronto credit union."],
  cards:["Credit Cards | Northern Birch Credit Union","Collabria Mastercard cards for members: cash back, low rate and travel rewards, with no-annual-fee options."],
  personal:["Personal Banking | Northern Birch Credit Union","Everyday accounts, borrowing and investing for Northern Birch members."],
  rates:["Current Rates | Northern Birch Credit Union","Today's posted mortgage, GIC, savings and lending rates at Northern Birch Credit Union."],
  apply:["Apply | Open an Account or Start a Mortgage | Northern Birch","Start an application for a chequing account, savings, GIC, mortgage pre-approval or credit card. An advisor calls you back within one business day."],
  advice:["Financial Advice & Planning | Northern Birch","Retirement, investment, estate and tax advice from Northern Birch's wealth team, starting with a Financial Check-Up that costs members nothing."],
  insurance:["Insurance | Northern Birch Credit Union","Life, home, auto, travel and co-op insurance distributed through The Personal, CUMIS and Manulife."],
  travel:["Travel & International Transfers | Northern Birch","Baltic travel insurance, international transfers to Estonia and Latvia, and competitive foreign exchange."],
  business:["Business Solutions | Northern Birch Credit Union","Group benefits, commercial insurance, payroll and commercial lending for Ontario businesses."],
  booking:["Book an Appointment | Northern Birch Credit Union","Request a meeting with a Northern Birch advisor at any branch, for banking, mortgages, investments or insurance."],
  claims:["Claims Centre | Northern Birch Credit Union","Start an insurance claim online, or reach your insurer's claims line directly."],
  calculators:["Financial Calculators | Northern Birch","Mortgage, retirement and insurance-needs calculators for Northern Birch members."],
  contact:["Contact & Branches | Northern Birch Credit Union","Branch addresses, hours and phone numbers, including the KESKUS location."],
  community:["Our Community | Northern Birch Credit Union","70+ years serving Toronto's Estonian and Latvian communities, with scholarships and cultural sponsorship."],
  digital:["Digital Banking Tools | Northern Birch","Your insurance dashboard, quote engine, planning calculators and mobile banking, all in one place."],
  estate:["Estate Planning | Northern Birch Credit Union","Wills, trusts, beneficiary designations and insurance strategies for every stage, from young family to senior."],
  quote:["Insurance Quote Calculator | Northern Birch","Estimate a term life, home, auto or travel premium in under two minutes. No personal information required."],
  compare:["Compare Coverage Options | Northern Birch","Compare insurance plans side by side on coverage, limits and price before you request a quote."],
  referrals:["Member Referral Program | Northern Birch","Refer a friend to Northern Birch and you each earn $50 once they join and transact."],
  blog:["Blog & News | Northern Birch Credit Union","Financial insights, product updates and community news from Northern Birch Credit Union."],
  glossary:["Insurance Glossary | Northern Birch","Plain-language definitions of deductibles, riders, creditor insurance and other terms you will meet."],
  mobileapp:["Mobile Banking App | Northern Birch","Deposit cheques, send Interac e-Transfers, manage policies and transfer to the Baltics from your phone."],
  dashboard:["Member Dashboard | Northern Birch Credit Union","Balances, transactions, policies, documents and international transfers for Northern Birch members."],
  aiadvisor:["AI Insurance Advisor | Northern Birch","Ask about coverage and get a plain-language answer, then book a real advisor to confirm it."],
  analyzer:["Coverage Gap Analyzer | Northern Birch","Describe your current cover and see where the gaps are before you speak to an advisor."],
  healthcheck:["Financial Health Check | Northern Birch","A ten-question review of your savings, debt and protection, with what to do about each gap."],
  lifesim:["Life Event Simulator | Northern Birch","See how a new home, a baby or a career change reshapes your banking and insurance needs."],
  docreader:["Policy Document Reader | Northern Birch","Paste a policy or renewal notice and get a plain-language summary of what it actually covers."],
  tax:["Tax & Savings Optimizer | Northern Birch","Find the RRSP, TFSA, FHSA and RESP moves that reduce your Canadian tax bill this year."],
  messages:["Secure Messages | Northern Birch Credit Union","A direct line to your Northern Birch advisor for account, mortgage and insurance questions."],
  privacy:["Privacy Policy | Northern Birch Credit Union","How Northern Birch collects, uses, discloses and protects your personal information under PIPEDA."],
  accessibility:["Accessibility | Northern Birch Credit Union","Our AODA commitment: accessible service, alternative formats, branch access and how to give feedback."],
  complaints:["Complaint Resolution | Northern Birch","How to raise a concern, escalate it, and reach OBSI, FSRA or the FCAC if it stays unresolved."],
  terms:["Terms of Use | Northern Birch Credit Union","Website terms, deposit insurance, rate disclaimers and investment risk disclosure for Northern Birch."],
  leadership:["Insurance Business Case | Northern Birch","The revenue model, cost structure and five-year projections behind the Northern Birch insurance program."],
};
export const META_DEFAULT=["Northern Birch Credit Union","A full-service Toronto credit union: everyday banking, mortgages, credit cards, investments and insurance."];

export function setTag(selector,attr,value){
  let el=document.head.querySelector(selector);
  if(!el){
    el=document.createElement(selector.startsWith("link")?"link":"meta");
    if(selector.includes("property="))el.setAttribute("property",selector.match(/property="([^"]+)"/)[1]);
    else if(selector.includes("name="))el.setAttribute("name",selector.match(/name="([^"]+)"/)[1]);
    else if(selector.includes("rel="))el.setAttribute("rel",selector.match(/rel="([^"]+)"/)[1]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr,value);
}

export function applyMeta(page){
  const[title,desc]=META[page]||META_DEFAULT;
  document.title=title;
  setTag('meta[name="description"]',"content",desc);
  setTag('link[rel="canonical"]',"href",window.location.origin+(ROUTES[page]||"/"));
  setTag('meta[property="og:title"]',"content",title);
  setTag('meta[property="og:description"]',"content",desc);
  setTag('meta[property="og:url"]',"content",window.location.origin+(ROUTES[page]||"/"));
}

// Form submission. Posts to Netlify Forms, which needs no API key: the hidden
// static forms in index.html are what Netlify detects at build time, and
// submissions land in the site's Forms dashboard with email notification.
//
// Returns true only when Netlify actually accepted the submission. Callers must
// not show a confirmation on false — these forms used to declare success
// unconditionally while sending nothing anywhere.
export async function submitForm(formName,fields){
  const body=new URLSearchParams({"form-name":formName,"bot-field":"",...fields});
  try{
    const res=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body.toString()});
    // which form, and whether it went through -- never any of the fields
    track("form_submit",{form:formName,result:res.ok?"ok":"failed"});
    return res.ok;
  }catch(e){track("form_submit",{form:formName,result:"failed"});return false}
}

// Consent at the point of collection. Until the forms actually submitted,
// nothing left the browser and there was nothing to consent to. Now that they
// reach a processor, PIPEDA requires telling people what is collected, why,
// and who handles it — before they hand it over, not in a policy page they
// never open.
//
// CONSENT_VERSION travels with each submission so there is a record of which
// wording someone actually agreed to.
export const CONSENT_VERSION="2026-08-collection-notice-v1";

export function ConsentNotice({checked,onChange,purpose,extra,id}){
  return <div style={{background:"#FAFAF7",border:"1px solid #E8E4D8",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
    <label htmlFor={id} style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}>
      <input id={id} type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{marginTop:3,width:18,height:18,flexShrink:0,cursor:"pointer"}}/>
      <span style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.65}}>
        I consent to Northern Birch collecting the information in this form {purpose}.{extra?" "+extra:""} It is handled by a service provider outside Canada and may be accessible to authorities there. You can withdraw consent at any time by calling 416-465-4659.
      </span>
    </label>
  </div>;
}

// Shared styles for the inline error shown when a submission does not go through.
// Currency in one place. The quote page's headline premium printed C$5376.00
// while every other figure on the site printed C$5,376.00.
export const money=(n,dp=2)=>Number(n).toLocaleString("en-CA",{minimumFractionDigits:dp,maximumFractionDigits:dp});

export const errBox={background:"#FDECEA",border:"1px solid #F5C6C2",borderRadius:12,padding:"14px 18px",marginBottom:16,fontFamily:fs,fontSize:13.5,color:"#8B2B22",lineHeight:1.6};

// AI caller. The server owns the model, the system prompt, and the token budget;
// we send only which feature is asking and the conversation so far.
export async function callAI(feature,messages){
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({feature,messages})});
    if(res.ok)return await res.json();
  }catch(e){}
  return {content:[{text:"I'm having trouble connecting. Please call 416-465-4659."}]};
}

// PDF export via browser print-to-PDF
export function exportToPDF(elementId,title="Northern Birch Document"){
  const el=document.getElementById(elementId);
  if(!el){window.print();return;}
  const w=window.open("","_blank","width=900,height=700");
  if(!w){alert("Please allow pop-ups to download PDF.");return;}
  const date=new Date().toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    @page{size:letter;margin:0.75in}
    *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1B2A4A;line-height:1.6;padding:0}
    .header{border-bottom:3px solid #1B2A4A;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center}
    .logo{font-size:24px;font-weight:700;color:#1B2A4A;letter-spacing:-0.5px}
    .logo span{color:#C8B88A}
    .meta{font-size:11px;color:#999;text-align:right}
    h1,h2,h3{color:#1B2A4A;margin-bottom:8px}
    h2{font-size:24px;margin-top:0}
    h3{font-size:16px;margin-top:16px}
    p{margin-bottom:8px;font-size:13px}
    table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}
    th,td{padding:10px 14px;text-align:left;border-bottom:1px solid #eee}
    th{background:#f8f8f8;font-weight:600;color:#1B2A4A}
    .result-box{background:#f8f8f8;border-radius:12px;padding:24px;margin:16px 0;border-left:4px solid #2E86C1}
    .big-number{font-size:42px;font-weight:700;color:#2E86C1;margin:8px 0}
    .label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#999;text-align:center}
    .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:12px 0}
    .grid-item{background:#fff;border:1px solid #eee;border-radius:8px;padding:14px;text-align:center}
    .grid-item .num{font-size:18px;font-weight:700;color:#1B2A4A}
    .grid-item .lbl{font-size:10px;color:#999;margin-top:4px}
    .disclaimer{background:#fff8e6;border-radius:8px;padding:12px 16px;margin-top:24px;font-size:10px;color:#666;border-left:3px solid #D4A547}
    button,input,select,textarea{display:none !important}
    @media print{body{padding:0}}
  </style></head><body>
    <div class="header">
      <div class="logo">Northern Birch <span>Credit Union</span></div>
      <div class="meta">${title}<br/>${date}</div>
    </div>
    ${el.innerHTML.replace(/<button[^>]*>.*?<\/button>/g,"").replace(/<input[^>]*\/?>(.*?<\/input>)?/g,"").replace(/<select[\s\S]*?<\/select>/g,"")}
    <div class="footer">Northern Birch Credit Union Limited &middot; FSRA Insured &middot; northernbirchcu.com &middot; 416-465-4659<br/>Insurance products distributed via The Personal Insurance Company, CUMIS/Co-operators, and Manulife Financial.</div>
    <script>setTimeout(()=>{window.print();setTimeout(()=>window.close(),500)},250)</script>
  </body></html>`);
  w.document.close();
}
// A real <button> that inherits the caller's styling. Seventeen interactive
// elements in this file were plain <div onClick>: not focusable, not reachable
// by keyboard, and announced as nothing by a screen reader. Passing the same
// style object through keeps them looking identical.
export function Clickable({onClick,style={},label,children,...rest}){
  return <button type="button" onClick={onClick} aria-label={label} style={{background:"none",border:"none",padding:0,margin:0,font:"inherit",color:"inherit",textAlign:"inherit",display:"block",width:"100%",cursor:"pointer",...style}} {...rest}>{children}</button>;
}

// The privacy, accessibility, terms and complaints pages tell members to phone
// a regulator, email the Privacy Officer or visit OBSI -- and printed every one
// of those as plain text, so the pages whose entire job is "here is how to
// reach someone" had nothing to click. This turns emails, phone numbers and
// web addresses inside a paragraph into real links.
export const LINK_SRC="([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})|((?:https?://|www\\.)[^\\s,;)]*[^\\s,;.)])|(\\b1?[-\\s]?\\(?\\d{3}\\)?[-\\s]\\d{3}[-\\s]\\d{4}\\b)";
export function Linkify({text,color=C.accentText}){
  const re=new RegExp(LINK_SRC,"g");   // fresh matcher per render: lastIndex is per-call state
  const out=[];let last=0,m;
  while((m=re.exec(text))!==null){
    if(m.index>last)out.push(text.slice(last,m.index));
    const st={color,fontWeight:600};
    if(m[1])out.push(<a key={m.index} href={`mailto:${m[1]}`} style={st}>{m[1]}</a>);
    else if(m[2])out.push(<a key={m.index} href={m[2].startsWith("http")?m[2]:`https://${m[2]}`} target="_blank" rel="noopener noreferrer" style={st}>{m[2]}</a>);
    else out.push(<a key={m.index} href={`tel:+1${m[3].replace(/\D/g,"").slice(-10)}`} style={st}>{m[3]}</a>);
    last=m.index+m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

// Layout is decided by reading window.innerWidth during render in ~70 places,
// which is only correct at the instant a component happens to render. Nothing
// re-rendered on resize, so rotating a phone left three desktop columns
// squeezed into 390px, and a desktop resize did the same, until you navigated
// or reloaded. Calling this once in App re-renders the tree when a breakpoint
// is crossed, so every one of those reads is re-evaluated.
//
// Bucketed rather than raw width on purpose: dragging a window edge costs a
// couple of renders instead of one per pixel, because React bails out when the
// state it is given is unchanged.
export const readBreakpoint=()=>{
  if(typeof window==="undefined")return "d";
  const w=window.innerWidth;
  return w<=768?"m":w<=900?"t":w<=1024?"l":"d";
};
// The pages are prerendered in Node, where there is no viewport, so every
// hook below answers "desktop" for the server and for the hydrating render
// that has to match it, then switches to the real measurement. That is what
// useSyncExternalStore's third argument is for; doing it with an effect works
// but tells React the first render was a guess it now has to reconcile.
const subscribeViewport=(cb)=>{
  window.addEventListener("resize",cb);
  window.addEventListener("orientationchange",cb);
  return()=>{window.removeEventListener("resize",cb);window.removeEventListener("orientationchange",cb)};
};
export function useBreakpoint(){return useSyncExternalStore(subscribeViewport,readBreakpoint,()=>"d")}

export function useW(){return useSyncExternalStore(subscribeViewport,()=>window.innerWidth,()=>1200)}
// The one viewport question nearly every page asks.
export function useMob(){return useMaxW(768)}
/** True when the viewport is at most `px` wide -- and false on the server and
 *  in the render that hydrates it, like everything else here. Layout decisions
 *  at any breakpoint go through this; reading window.innerWidth during render
 *  disagrees with the prerendered HTML and costs the hydration. */
export function useMaxW(px){
  return useSyncExternalStore(subscribeViewport,()=>window.innerWidth<=px,()=>false);
}
export const g=(w,d,t,m)=>w>1024?d:w>768?t:m; // grid helper: desktop, tablet, mobile
// ============ CULTURAL BRANDING ELEMENTS ============
// Birch tree silhouettes for hero
export function BirchTrees({side="right",opacity=0.06}){
  return <svg aria-hidden="true" focusable="false" style={{position:"absolute",[side]:side==="right"?"-2%":"0%",bottom:0,width:400,height:"80%",opacity,pointerEvents:"none"}} viewBox="0 0 400 600" fill="none">
    {/* Birch trunk 1 */}
    <rect x="80" y="50" width="12" height="550" rx="6" fill="white"/><rect x="84" y="80" width="4" height="8" rx="2" fill="rgba(0,0,0,0.15)"/><rect x="82" y="130" width="6" height="6" rx="2" fill="rgba(0,0,0,0.12)"/><rect x="85" y="200" width="3" height="10" rx="1" fill="rgba(0,0,0,0.1)"/><rect x="81" y="280" width="5" height="7" rx="2" fill="rgba(0,0,0,0.12)"/><rect x="83" y="370" width="4" height="5" rx="2" fill="rgba(0,0,0,0.1)"/>
    {/* Birch branches 1 */}
    <line x1="86" y1="100" x2="130" y2="70" stroke="white" strokeWidth="3"/><line x1="86" y1="160" x2="45" y2="120" stroke="white" strokeWidth="2.5"/><line x1="86" y1="230" x2="135" y2="195" stroke="white" strokeWidth="2"/><line x1="86" y1="300" x2="40" y2="265" stroke="white" strokeWidth="2"/><line x1="86" y1="380" x2="125" y2="350" stroke="white" strokeWidth="1.5"/>
    {/* Birch leaves cluster 1 */}
    <ellipse cx="140" cy="60" rx="35" ry="25" fill="rgba(200,184,138,0.3)"/><ellipse cx="35" cy="110" rx="30" ry="22" fill="rgba(200,184,138,0.25)"/><ellipse cx="145" cy="185" rx="28" ry="20" fill="rgba(200,184,138,0.2)"/><ellipse cx="30" cy="255" rx="25" ry="18" fill="rgba(200,184,138,0.2)"/>
    {/* Birch trunk 2 */}
    <rect x="220" y="120" width="10" height="480" rx="5" fill="white"/><rect x="223" y="160" width="4" height="6" rx="2" fill="rgba(0,0,0,0.12)"/><rect x="222" y="240" width="5" height="8" rx="2" fill="rgba(0,0,0,0.1)"/><rect x="224" y="340" width="3" height="5" rx="1" fill="rgba(0,0,0,0.1)"/>
    {/* Birch branches 2 */}
    <line x1="225" y1="180" x2="270" y2="150" stroke="white" strokeWidth="2.5"/><line x1="225" y1="260" x2="185" y2="230" stroke="white" strokeWidth="2"/><line x1="225" y1="350" x2="275" y2="325" stroke="white" strokeWidth="1.5"/>
    {/* Birch leaves cluster 2 */}
    <ellipse cx="280" cy="140" rx="30" ry="22" fill="rgba(200,184,138,0.25)"/><ellipse cx="175" cy="220" rx="28" ry="20" fill="rgba(200,184,138,0.2)"/><ellipse cx="285" cy="315" rx="25" ry="18" fill="rgba(200,184,138,0.15)"/>
    {/* Birch trunk 3 (thin, background) */}
    <rect x="330" y="200" width="8" height="400" rx="4" fill="white" opacity="0.6"/><line x1="334" y1="260" x2="370" y2="235" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="334" y1="340" x2="305" y2="310" stroke="white" strokeWidth="1.5" opacity="0.6"/><ellipse cx="375" cy="225" rx="22" ry="16" fill="rgba(200,184,138,0.15)"/>
  </svg>;
}

// Estonian folk pattern border (muhu-inspired geometric)
export function FolkBorder({color=C.birch,opacity=0.15}){
  return <svg aria-hidden="true" focusable="false" style={{width:"100%",height:24,opacity}} viewBox="0 0 1200 24" preserveAspectRatio="none">
    {Array.from({length:60}).map((_,i)=><g key={i} transform={`translate(${i*20},0)`}>
      <rect x="2" y="2" width="8" height="8" fill={color} transform="rotate(45,6,6)"/>
      <rect x="10" y="10" width="6" height="6" fill={color} transform="rotate(45,13,13)"/>
    </g>)}
  </svg>;
}

// Cornflower (Estonia national flower) accent
export function Cornflower({size=24,color=C.accent,style={}}){
  return <svg aria-hidden="true" focusable="false" style={{width:size,height:size,...style}} viewBox="0 0 40 40">
    {[0,45,90,135,180,225,270,315].map((r,i)=><ellipse key={i} cx="20" cy="8" rx="4" ry="8" fill={color} opacity="0.7" transform={`rotate(${r},20,20)`}/>)}
    <circle cx="20" cy="20" r="5" fill={color}/>
  </svg>;
}

// Daisy (Latvia national flower) accent
export function Daisy({size=24,color="white",center=C.amber,style={}}){
  return <svg aria-hidden="true" focusable="false" style={{width:size,height:size,...style}} viewBox="0 0 40 40">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((r,i)=><ellipse key={i} cx="20" cy="7" rx="3" ry="7" fill={color} opacity="0.8" transform={`rotate(${r},20,20)`}/>)}
    <circle cx="20" cy="20" r="4.5" fill={center}/>
  </svg>;
}

// Estonian + Latvian flag stripe accent
export function FlagStripe({style={}}){
  return <div aria-hidden="true" style={{display:"flex",height:4,borderRadius:2,overflow:"hidden",...style}}>
    {/* Estonian: blue-black-white */}
    <div style={{flex:1,background:"#0072CE"}}/><div style={{flex:1,background:"#000000"}}/><div style={{flex:1,background:"#FFFFFF"}}/>
    <div style={{flex:0.3}}/>
    {/* Latvian: maroon-white-maroon */}
    <div style={{flex:1,background:"#9E3039"}}/><div style={{flex:0.5,background:"#FFFFFF"}}/><div style={{flex:1,background:"#9E3039"}}/>
  </div>;
}

export class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={failed:false}}
  static getDerivedStateFromError(){return{failed:true}}
  componentDidCatch(error,info){console.error("Northern Birch: render error",error,info)}
  render(){
    if(!this.state.failed)return this.props.children;
    // Deliberately plain: this has to render when something else could not, so
    // it depends on nothing but literals. Whatever broke, calling the branch
    // still works, so say so.
    return(
      <div role="alert" style={{background:"#FDFBF7",padding:"48px 24px",minHeight:this.props.full?"100vh":320,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{maxWidth:560,textAlign:"center"}}>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:26,color:"#1B2A4A",margin:"0 0 12px"}}>This part of the page didn&rsquo;t load</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#555",lineHeight:1.7,margin:"0 0 24px"}}>
            Something went wrong on our side. Your accounts and any request you already submitted are unaffected.
            Reload to try again, or call us and we will help you directly.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>window.location.reload()} style={{background:"#1F6FA5",border:"none",borderRadius:12,padding:"12px 28px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#fff",fontWeight:600}}>Reload the page</button>
            <a href="tel:+14164654659" style={{background:"transparent",border:"2px solid #1B2A4A",borderRadius:12,padding:"10px 26px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1B2A4A",fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center"}}>Call 416-465-4659</a>
          </div>
        </div>
      </div>
    );
  }
}

export function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const el=r.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});o.observe(el);return()=>o.disconnect()},[t]);return[r,v]}
// Keeps Tab inside an open dialog and restores focus to whatever opened it.
// aria-modal already told assistive tech the page behind was inert; without
// this, keyboard focus wandered out of the dialog anyway.
// Remembers the last thing focused while no dialog was on screen -- i.e. the
// control that opened one. Reading document.activeElement from inside the trap
// is too late: the search overlay's input carries autoFocus, which React runs
// during commit, so the overlay recorded its own input as the thing to restore
// and then focused a node that was already unmounted, dropping focus onto
// <body> every time it closed. Checking for a live dialog is what makes this
// immune to that ordering: by the time autoFocus fires, the dialog is in the
// DOM, so its focusin is ignored.
export let lastTrigger=null;
if(typeof document!=="undefined"){
  document.addEventListener("focusin",(e)=>{
    if(document.querySelector('[role="dialog"]'))return;
    const t=e.target;
    if(t&&t!==document.body)lastTrigger=t;
  },true);
}

export function useFocusTrap(open,onClose){
  const ref=useRef(null);
  const restoreRef=useRef(null);
  const closeRef=useRef(onClose);
  useEffect(()=>{closeRef.current=onClose});
  useEffect(()=>{
    if(!open)return;
    const root=ref.current;
    if(!root)return;
    restoreRef.current=lastTrigger;
    const sel='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const items=()=>[...root.querySelectorAll(sel)].filter(e=>e.offsetParent!==null);
    const first=items()[0];
    if(first)first.focus();
    const onKey=(e)=>{
      if(e.key==="Escape"){closeRef.current&&closeRef.current();return}
      if(e.key!=="Tab")return;
      const f=items();
      if(!f.length)return;
      const a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
      else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
    };
    document.addEventListener("keydown",onKey);
    return()=>{
      document.removeEventListener("keydown",onKey);
      const t=restoreRef.current;
      if(t&&t.isConnected&&t.focus)t.focus();
    };
  },[open]);
  return ref;
}

export function prefersReducedMotion(){
  try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}
}
export function Fade({children,delay=0,style={}}){const[r,v]=useInView();const rm=prefersReducedMotion();return <div ref={r} style={{opacity:rm?1:(v?1:0),transform:rm?"none":(v?"translateY(0)":"translateY(28px)"),transition:rm?"none":`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,...style}}>{children}</div>}
export const ON_DARK={"#1F6FA5":"#7FB8E0","#197A41":"#6FD79B","#8A6410":"#E8C46A","#8E44AD":"#C89BDB","#B3271A":"#F09A90","#C8B88A":"#C8B88A","#7D6C3E":"#D9C48F"};
export function onDark(c){return ON_DARK[c]||c}
export function SH({tag,tagColor,title,desc,dark}){
  tagColor=dark?onDark(tagColor||"#1F6FA5"):tagColor;return <Fade><div style={{maxWidth:700,marginBottom:48}}><span style={{fontFamily:fs,fontSize:11,color:tagColor||C.accent,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>{tag}</span><h2 style={{fontFamily:ff,fontSize:42,color:dark?"#fff":C.navy,margin:"10px 0 14px",lineHeight:1.12}}>{title}</h2>{desc&&<p style={{fontFamily:fs,fontSize:16,color:dark?"rgba(255,255,255,0.5)":"#666",lineHeight:1.75}}>{desc}</p>}</div></Fade>}
export function FAQ({items,dark}){const[o,setO]=useState(null);return <div style={{display:"flex",flexDirection:"column",gap:8}}>{items.map((q,i)=><Clickable key={i} onClick={()=>setO(o===i?null:i)} style={{background:dark?"rgba(255,255,255,0.03)":"#fff",border:`1px solid ${dark?"rgba(255,255,255,0.06)":"#eee"}`,borderRadius:14,padding:"18px 24px",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:fs,fontSize:15,color:dark?"#fff":C.navy,fontWeight:600}}>{q.q}</span><span style={{color:dark?"rgba(255,255,255,0.3)":"#707070",fontSize:18,transform:o===i?"rotate(45deg)":"none",transition:"transform 0.3s"}}>+</span></div>{o===i&&<p style={{fontFamily:fs,fontSize:14,color:dark?"rgba(255,255,255,0.5)":"#666",lineHeight:1.75,margin:"12px 0 0",paddingTop:12,borderTop:`1px solid ${dark?"rgba(255,255,255,0.05)":"#f0f0f0"}`}}>{q.a}</p>}</Clickable>)}</div>}
export function Btn({children,color=C.accentText,onClick,outline,small}){return <button onClick={onClick} style={{background:outline?"transparent":color,border:outline?`2px solid ${color}`:"none",borderRadius:small?8:12,padding:small?"8px 16px":"12px 28px",cursor:"pointer",fontFamily:fs,fontSize:small?12:14,color:outline?color:"#fff",fontWeight:600,transition:"all 0.3s"}}>{children}</button>}

export const SliderLabel=({label,value,sub:_sub})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{label}</span><span style={{fontFamily:ff,fontSize:20,color:C.navy,fontWeight:700}}>{value}</span></div>;

// The cookie preference. Read by the banner and by anything that would ever
// measure a visit, so it lives with the rest of the shared foundation.
export const COOKIE_PREF_KEY="nb-cookie-pref";
export function readCookiePref(){
  try{return window.localStorage.getItem(COOKIE_PREF_KEY)}catch(e){return null}
}
const prefListeners=new Set();
const subscribePref=(cb)=>{prefListeners.add(cb);return()=>prefListeners.delete(cb)};
export function writeCookiePref(v){
  try{window.localStorage.setItem(COOKIE_PREF_KEY,v)}catch(e){}
  prefListeners.forEach(l=>l());
}
/** The stored choice, or null if none. Answers "essential" for the server and
 *  the hydrating render, so no banner is ever part of the prerendered markup. */
export function useCookiePref(){return useSyncExternalStore(subscribePref,readCookiePref,()=>"essential")}
// Nothing reads this yet: it is the gate any future measurement should hang
// off, so the consent exists before the tracker does.
export function analyticsAllowed(){return readCookiePref()==="all"}

// Which product the visitor pressed "Apply" on, handed to /apply so the form
// arrives filled in. Module scope rather than a query parameter: the route is
// shared, and an application URL should not carry state a member might paste
// somewhere. Read once and cleared, so a later direct visit starts blank.
let applyIntent=null;
export function setApplyIntent(v){applyIntent=v||null}
export function readApplyIntent(){const v=applyIntent;applyIntent=null;return v}

// ============ MEASUREMENT ============
// Consent-gated and off by default. Nothing is loaded, requested or recorded
// unless BOTH are true: the visitor chose "Allow measurement", and a domain is
// configured at build time (VITE_PLAUSIBLE_DOMAIN). With no domain set the
// site measures nothing at all and this is dead weight, which is the state it
// ships in.
//
// Plausible is cookieless and stores no personal data, which is what makes it
// defensible under PIPEDA for a credit union. Keep it that way: event
// properties below are literals this codebase chooses, never anything a member
// typed. No names, no amounts, no search terms, no form contents.
export const MEASUREMENT_DOMAIN=(typeof import.meta!=="undefined"&&import.meta.env&&import.meta.env.VITE_PLAUSIBLE_DOMAIN)||"";
let scriptRequested=false;

/** Loads the tracker once, and only with consent. Safe to call repeatedly. */
export function initMeasurement(){
  if(scriptRequested||!MEASUREMENT_DOMAIN||!analyticsAllowed())return false;
  if(typeof document==="undefined")return false;
  scriptRequested=true;
  // queue events fired before the script finishes loading
  window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};
  const el=document.createElement("script");
  el.defer=true;
  el.dataset.domain=MEASUREMENT_DOMAIN;
  el.src="https://plausible.io/js/script.js";
  document.head.appendChild(el);
  return true;
}

/** One named event. Silently does nothing without consent or a configured domain. */
export function track(event,props){
  if(!MEASUREMENT_DOMAIN||!analyticsAllowed())return false;
  initMeasurement();
  try{window.plausible&&window.plausible(event,props?{props}:undefined);return true}
  catch(e){return false}
}

/** Route changes, so a single-page app reports more than one pageview. */
export function trackPageview(route){
  if(!MEASUREMENT_DOMAIN||!analyticsAllowed())return false;
  initMeasurement();
  try{window.plausible&&window.plausible("pageview",{u:window.location.origin+(ROUTES[route]||"/")});return true}
  catch(e){return false}
}
