import React, { useState, useEffect, useRef, useCallback } from "react";
import './index.css';

const C={navy:"#1B2A4A",accent:"#2E86C1",dark:"#0C1829",green:"#27AE60",amber:"#D4A547",amberText:"#8A6410",red:"#E74C3C",redText:"#B3271A",birch:"#C8B88A",birchLight:"#F5F0E6",cream:"#FDFBF7",purple:"#8E44AD",accentText:"#1F6FA5",accentOnDark:"#7FB8E0",greenOnDark:"#6FD79B",amberOnDark:"#E8C46A",purpleOnDark:"#C89BDB",redOnDark:"#F5A99F",amberFill:"#8A6410",birchText:"#7D6C3E",greenText:"#197A41",greenFill:"#177A41",lightBlue:"#EBF5FB"};
const ff="'Playfair Display',Georgia,serif",fs="'DM Sans',sans-serif";

// ============ POSTED RATES (single source: RatesPage + homepage banking cards read this) ============
const RATE={m3:"4.39%",m5:"4.34%",m5hr:"3.89%",mvar:"Prime - 0.50%",heloc:"Prime + 0.50%",hisa:"2.00%",gic1:"2.70%",gic5:"2.50%",mc:"19.99%",mcLow:"12.99%",chq:"$0"};

// ============ CORE BANKING PRODUCTS (homepage cards, nav, search) ============
const BANKING=[
  {k:"mortgages",t:"Mortgages",p:"mortgages",c:C.green,tc:C.greenText,d:"Fixed, variable, and high-ratio mortgages -- including co-op apartment financing few lenders offer.",rate:RATE.m5,rl:"5-year fixed",b:["Free pre-approval, held 120 days","Co-op and multi-unit financing","C$3,500 cash back offer available"],cta:"Explore Mortgages",kw:"mortgage home loan pre-approval renewal refinance fixed variable high ratio co-op heloc"},
  {k:"cards",t:"Credit Cards",p:"cards",c:C.purple,tc:C.purple,d:"Collabria Mastercard cards with cash back, low-rate, and travel rewards options.",rate:RATE.mcLow,rl:"Low Rate APR",b:["No-annual-fee options","Cash back up to 2%","Lock and unlock in the app"],cta:"Apply for a Credit Card",kw:"credit card mastercard collabria cash back rewards low rate apply"},
  {k:"chequing",t:"Chequing Accounts",p:"accounts",c:C.accent,tc:C.accentText,d:"No-fee everyday banking with unlimited e-Transfers and free member cheques.",rate:RATE.chq,rl:"Monthly fee",b:["$0 monthly fee for members","Unlimited e-Transfers","THE EXCHANGE ATM network"],cta:"Compare Accounts",kw:"chequing checking everyday banking debit e-transfer account fees student senior"},
  {k:"savings",t:"Savings & GICs",p:"accounts",c:C.amber,tc:C.amberText,d:"High-interest savings, GIC terms from 90 days to 5 years, and registered TFSA, RRSP, FHSA and RESP plans.",rate:RATE.gic1,rl:"1-year GIC",b:["No minimum balance","GIC terms from 90 days","TFSA, RRSP, FHSA, RESP eligible"],cta:"Compare Accounts",kw:"savings gic tfsa rrsp fhsa resp rdsp registered high interest term deposit"},
  {k:"invest",t:"Investments",p:"personal",c:C.navy,tc:C.navy,d:"Mutual funds, Qtrade direct investing, and VirtualWealth portfolios inside your registered accounts.",rate:RATE.hisa,rl:"Savings rate",b:["Self-directed or advisor-managed","Held in TFSA, RRSP or cash","Aviso Wealth partnership"],cta:"Explore Investing",kw:"invest investments portfolio mutual funds qtrade virtualwealth etf stocks wealth retirement"},
];

// ============ TRANSLATION SYSTEM ============
const TX={
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
function t(key,lang){if(!lang||lang==="en")return key;return TX[key]?.[lang==="est"?"est":"lat"]||key;}

// The language switcher only lived in React state, so a refresh, a bookmark or
// a shared link always came back in English -- the choice was silently thrown
// away every time. Keep it next to the cookie preference, and tell assistive
// technology which language the page chrome is actually in.
const LANG_KEY="nb-lang";
// The pages that actually read the translation table. Everything else renders
// English regardless of the switcher, so it is marked lang="en" rather than
// inheriting the selected language and being read out with the wrong voice.
const TRANSLATED_PAGES=new Set(["home","mortgages","cards","accounts"]);
const LANG_TAG={en:"en",est:"et",lat:"lv"};
function readLang(){
  try{const v=window.localStorage.getItem(LANG_KEY);return v==="est"||v==="lat"?v:"en"}catch(e){return "en"}
}
function writeLang(v){
  try{window.localStorage.setItem(LANG_KEY,v)}catch(e){}
}

// ============ ROUTES ============
// Every page has a real URL, so it can be linked, shared, bookmarked and
// indexed. Navigation still goes through setPage(key): the router turns that
// into a history entry, which is why the existing call sites are unchanged.
const ROUTES={
  home:"/",personal:"/personal",accounts:"/accounts",mortgages:"/mortgages",cards:"/cards",
  insurance:"/insurance",travel:"/travel",business:"/business",digital:"/digital",estate:"/estate",
  community:"/community",contact:"/contact",rates:"/rates",quote:"/quote",compare:"/compare",
  claims:"/claims",calculators:"/calculators",booking:"/booking",referrals:"/referrals",
  blog:"/blog",glossary:"/glossary",mobileapp:"/mobile-app",dashboard:"/dashboard",
  aiadvisor:"/ai-advisor",analyzer:"/coverage-analyzer",healthcheck:"/financial-health-check",
  lifesim:"/life-event-simulator",docreader:"/policy-document-reader",tax:"/tax-optimizer",
  messages:"/messages",privacy:"/privacy",accessibility:"/accessibility",complaints:"/complaints",
  terms:"/terms",leadership:"/leadership",
};
const PATH_TO_PAGE=Object.fromEntries(Object.entries(ROUTES).map(([k,v])=>[v,k]));
function pageFromPath(path){return PATH_TO_PAGE[path.replace(/\/+$/,"")||"/"]||"home"}

// Per-page title and description. Without these every URL shared the one
// <title> in index.html, so nothing was distinguishable in search or when
// pasted into a chat.
const META={
  home:["Northern Birch Credit Union | Banking & Insurance in Toronto","Chequing, savings, mortgages, credit cards, GICs and registered plans from a full-service Toronto credit union serving the Estonian and Latvian communities since 1954."],
  accounts:["Chequing, Savings & Registered Accounts | Northern Birch","Compare no-fee chequing, high-interest savings, GIC terms and TFSA, RRSP, FHSA, RESP and RRIF plans at Northern Birch Credit Union."],
  mortgages:["Mortgages | Northern Birch Credit Union","Fixed, variable and high-ratio mortgages, plus co-op apartment financing most lenders decline. Free pre-approval from a Toronto credit union."],
  cards:["Credit Cards | Northern Birch Credit Union","Collabria Mastercard cards for members: cash back, low rate and travel rewards, with no-annual-fee options."],
  personal:["Personal Banking | Northern Birch Credit Union","Everyday accounts, borrowing and investing for Northern Birch members."],
  rates:["Current Rates | Northern Birch Credit Union","Today's posted mortgage, GIC, savings and lending rates at Northern Birch Credit Union."],
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
const META_DEFAULT=["Northern Birch Credit Union","A full-service Toronto credit union: everyday banking, mortgages, credit cards, investments and insurance."];

function setTag(selector,attr,value){
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

function applyMeta(page){
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
async function submitForm(formName,fields){
  const body=new URLSearchParams({"form-name":formName,"bot-field":"",...fields});
  try{
    const res=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body.toString()});
    return res.ok;
  }catch(e){return false}
}

// Consent at the point of collection. Until the forms actually submitted,
// nothing left the browser and there was nothing to consent to. Now that they
// reach a processor, PIPEDA requires telling people what is collected, why,
// and who handles it — before they hand it over, not in a policy page they
// never open.
//
// CONSENT_VERSION travels with each submission so there is a record of which
// wording someone actually agreed to.
const CONSENT_VERSION="2026-08-collection-notice-v1";

function ConsentNotice({checked,onChange,purpose,extra,id}){
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
const money=(n,dp=2)=>Number(n).toLocaleString("en-CA",{minimumFractionDigits:dp,maximumFractionDigits:dp});

const errBox={background:"#FDECEA",border:"1px solid #F5C6C2",borderRadius:12,padding:"14px 18px",marginBottom:16,fontFamily:fs,fontSize:13.5,color:"#8B2B22",lineHeight:1.6};

// AI caller. The server owns the model, the system prompt, and the token budget;
// we send only which feature is asking and the conversation so far.
async function callAI(feature,messages){
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({feature,messages})});
    if(res.ok)return await res.json();
  }catch(e){}
  return {content:[{text:"I'm having trouble connecting. Please call 416-465-4659."}]};
}

// PDF export via browser print-to-PDF
function exportToPDF(elementId,title="Northern Birch Document"){
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
function Clickable({onClick,style={},label,children,...rest}){
  return <button type="button" onClick={onClick} aria-label={label} style={{background:"none",border:"none",padding:0,margin:0,font:"inherit",color:"inherit",textAlign:"inherit",display:"block",width:"100%",cursor:"pointer",...style}} {...rest}>{children}</button>;
}

// The privacy, accessibility, terms and complaints pages tell members to phone
// a regulator, email the Privacy Officer or visit OBSI -- and printed every one
// of those as plain text, so the pages whose entire job is "here is how to
// reach someone" had nothing to click. This turns emails, phone numbers and
// web addresses inside a paragraph into real links.
const LINK_SRC="([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})|((?:https?://|www\\.)[^\\s,;)]*[^\\s,;.)])|(\\b1?[-\\s]?\\(?\\d{3}\\)?[-\\s]\\d{3}[-\\s]\\d{4}\\b)";
function Linkify({text,color=C.accentText}){
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

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:1200);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);return w}
const g=(w,d,t,m)=>w>1024?d:w>768?t:m; // grid helper: desktop, tablet, mobile
// ============ CULTURAL BRANDING ELEMENTS ============
// Birch tree silhouettes for hero
function BirchTrees({side="right",opacity=0.06}){
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
function FolkBorder({color=C.birch,opacity=0.15}){
  return <svg aria-hidden="true" focusable="false" style={{width:"100%",height:24,opacity}} viewBox="0 0 1200 24" preserveAspectRatio="none">
    {Array.from({length:60}).map((_,i)=><g key={i} transform={`translate(${i*20},0)`}>
      <rect x="2" y="2" width="8" height="8" fill={color} transform="rotate(45,6,6)"/>
      <rect x="10" y="10" width="6" height="6" fill={color} transform="rotate(45,13,13)"/>
    </g>)}
  </svg>;
}

// Cornflower (Estonia national flower) accent
function Cornflower({size=24,color=C.accent,style={}}){
  return <svg aria-hidden="true" focusable="false" style={{width:size,height:size,...style}} viewBox="0 0 40 40">
    {[0,45,90,135,180,225,270,315].map((r,i)=><ellipse key={i} cx="20" cy="8" rx="4" ry="8" fill={color} opacity="0.7" transform={`rotate(${r},20,20)`}/>)}
    <circle cx="20" cy="20" r="5" fill={color}/>
  </svg>;
}

// Daisy (Latvia national flower) accent
function Daisy({size=24,color="white",center=C.amber,style={}}){
  return <svg aria-hidden="true" focusable="false" style={{width:size,height:size,...style}} viewBox="0 0 40 40">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((r,i)=><ellipse key={i} cx="20" cy="7" rx="3" ry="7" fill={color} opacity="0.8" transform={`rotate(${r},20,20)`}/>)}
    <circle cx="20" cy="20" r="4.5" fill={center}/>
  </svg>;
}

// Estonian + Latvian flag stripe accent
function FlagStripe({style={}}){
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

function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const el=r.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});o.observe(el);return()=>o.disconnect()},[t]);return[r,v]}
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
let lastTrigger=null;
if(typeof document!=="undefined"){
  document.addEventListener("focusin",(e)=>{
    if(document.querySelector('[role="dialog"]'))return;
    const t=e.target;
    if(t&&t!==document.body)lastTrigger=t;
  },true);
}

function useFocusTrap(open,onClose){
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

function prefersReducedMotion(){
  try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}
}
function Fade({children,delay=0,style={}}){const[r,v]=useInView();const rm=prefersReducedMotion();return <div ref={r} style={{opacity:rm?1:(v?1:0),transform:rm?"none":(v?"translateY(0)":"translateY(28px)"),transition:rm?"none":`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,...style}}>{children}</div>}
const ON_DARK={"#1F6FA5":"#7FB8E0","#197A41":"#6FD79B","#8A6410":"#E8C46A","#8E44AD":"#C89BDB","#B3271A":"#F09A90","#C8B88A":"#C8B88A","#7D6C3E":"#D9C48F"};
function onDark(c){return ON_DARK[c]||c}
function SH({tag,tagColor,title,desc,dark}){
  tagColor=dark?onDark(tagColor||"#1F6FA5"):tagColor;return <Fade><div style={{maxWidth:700,marginBottom:48}}><span style={{fontFamily:fs,fontSize:11,color:tagColor||C.accent,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>{tag}</span><h2 style={{fontFamily:ff,fontSize:42,color:dark?"#fff":C.navy,margin:"10px 0 14px",lineHeight:1.12}}>{title}</h2>{desc&&<p style={{fontFamily:fs,fontSize:16,color:dark?"rgba(255,255,255,0.5)":"#666",lineHeight:1.75}}>{desc}</p>}</div></Fade>}
function FAQ({items,dark}){const[o,setO]=useState(null);return <div style={{display:"flex",flexDirection:"column",gap:8}}>{items.map((q,i)=><Clickable key={i} onClick={()=>setO(o===i?null:i)} style={{background:dark?"rgba(255,255,255,0.03)":"#fff",border:`1px solid ${dark?"rgba(255,255,255,0.06)":"#eee"}`,borderRadius:14,padding:"18px 24px",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:fs,fontSize:15,color:dark?"#fff":C.navy,fontWeight:600}}>{q.q}</span><span style={{color:dark?"rgba(255,255,255,0.3)":"#707070",fontSize:18,transform:o===i?"rotate(45deg)":"none",transition:"transform 0.3s"}}>+</span></div>{o===i&&<p style={{fontFamily:fs,fontSize:14,color:dark?"rgba(255,255,255,0.5)":"#666",lineHeight:1.75,margin:"12px 0 0",paddingTop:12,borderTop:`1px solid ${dark?"rgba(255,255,255,0.05)":"#f0f0f0"}`}}>{q.a}</p>}</Clickable>)}</div>}
function Btn({children,color=C.accentText,onClick,outline,small}){return <button onClick={onClick} style={{background:outline?"transparent":color,border:outline?`2px solid ${color}`:"none",borderRadius:small?8:12,padding:small?"8px 16px":"12px 28px",cursor:"pointer",fontFamily:fs,fontSize:small?12:14,color:outline?color:"#fff",fontWeight:600,transition:"all 0.3s"}}>{children}</button>}

// ============ SEARCH OVERLAY ============
function SearchOverlay({open,onClose,setPage}){
  const trapRef=useFocusTrap(open,onClose);
  const listRef=useRef(null);
  const[q,setQ]=useState("");
  const allItems=[
    {title:"Term Life Insurance",page:"insurance",cat:"Insurance"},{title:"Home Insurance",page:"insurance",cat:"Insurance"},{title:"Auto Insurance",page:"insurance",cat:"Insurance"},
    {title:"Co-op Apartment Insurance",page:"insurance",cat:"Insurance"},{title:"Tenant Insurance",page:"insurance",cat:"Insurance"},{title:"Critical Illness Insurance",page:"insurance",cat:"Insurance"},
    {title:"Disability Insurance",page:"insurance",cat:"Insurance"},{title:"Mortgage Protection",page:"insurance",cat:"Insurance"},{title:"Pet Insurance",page:"insurance",cat:"Insurance"},
    {title:"Travel Insurance",page:"travel",cat:"Travel"},{title:"International Transfers",page:"travel",cat:"Travel"},{title:"Foreign Exchange",page:"travel",cat:"Travel"},
    {title:"Group Health & Dental Benefits",page:"business",cat:"Business"},{title:"Commercial Insurance",page:"business",cat:"Business"},{title:"Key Person Insurance",page:"business",cat:"Business"},
    {title:"Business Succession Planning",page:"business",cat:"Business"},{title:"Payroll & HR",page:"business",cat:"Business"},
    {title:"Insurance Dashboard",page:"dashboard",cat:"Digital"},{title:"Smart Quote Engine",page:"quote",cat:"Digital"},{title:"Financial Planning Tools",page:"calculators",cat:"Digital"},{title:"Digital Banking",page:"digital",cat:"Digital",kw:"digital online tools hub"},
    {title:"Mobile Banking App",page:"mobileapp",cat:"Digital"},{title:"Estate Planning",page:"estate",cat:"Planning"},{title:"KESKUS Branch",page:"community",cat:"Community"},
    {title:"Scholarships",page:"community",cat:"Community"},
    {title:"Chequing Accounts",page:"accounts",cat:"Banking",kw:"chequing checking everyday banking debit e-transfer no fee student senior us dollar"},
    {title:"Savings Accounts",page:"accounts",cat:"Banking",kw:"savings high interest hisa deposit compare accounts"},
    {title:"Mortgages",page:"mortgages",cat:"Banking",kw:"mortgage home loan pre-approval renewal refinance fixed variable high ratio co-op heloc"},
    {title:"GICs & Term Deposits",page:"accounts",cat:"Banking",kw:"gic guaranteed investment certificate term deposit 90 day 1 year 5 year"},
    {title:"Credit Cards",page:"cards",cat:"Banking",kw:"credit card mastercard collabria cash back rewards low rate apply"},
    {title:"Registered Accounts (TFSA, RRSP, FHSA, RESP)",page:"accounts",cat:"Banking",kw:"tfsa rrsp fhsa resp rdsp rrif registered retirement first home education tax free"},
    {title:"Compare Accounts",page:"accounts",cat:"Banking",kw:"compare accounts chequing savings fees"},
    {title:"Messages",page:"messages",cat:"Member"},{title:"Contact & Branches",page:"contact",cat:"About"},{title:"Insurance Quote Calculator",page:"quote",cat:"Tools"},{title:"AI Insurance Advisor",page:"aiadvisor",cat:"AI"},{title:"AI Coverage Analyzer",page:"analyzer",cat:"AI"},{title:"Financial Health Check",page:"healthcheck",cat:"AI"},{title:"Life Event Simulator",page:"lifesim",cat:"AI"},{title:"Policy Document Reader",page:"docreader",cat:"AI"},{title:"Tax & Savings Optimizer",page:"tax",cat:"AI"},{title:"Claims Centre",page:"claims",cat:"Tools"},{title:"Coverage Comparison",page:"compare",cat:"Tools"},
    {title:"Mortgage Calculator",page:"calculators",cat:"Tools"},{title:"Insurance Needs Calculator",page:"calculators",cat:"Tools"},{title:"Retirement Calculator",page:"calculators",cat:"Tools"},{title:"Book an Appointment",page:"booking",cat:"Tools"},
    {title:"Referral Program",page:"referrals",cat:"Rewards"},{title:"Rates",page:"rates",cat:"Banking"},{title:"Insurance Glossary",page:"glossary",cat:"Education"},
    {title:"Blog & News",page:"blog",cat:"Education"},
    {title:"Member Dashboard",page:"dashboard",cat:"Banking"},
    {title:"Privacy Policy",page:"privacy",cat:"Legal"},{title:"Accessibility (AODA)",page:"accessibility",cat:"Legal"},
    {title:"Complaint Resolution",page:"complaints",cat:"Legal"},{title:"Terms of Use",page:"terms",cat:"Legal"},{title:"Business Case (For Leadership)",page:"leadership",cat:"Leadership"},
  ];
  // Rank by how the query matched, not by index order: typing "mortgage" used
  // to put "Mortgage Protection" (an insurance page) above "Mortgages".
  const score=(i,ql)=>{
    const t=i.title.toLowerCase();
    if(t===ql)return 0;
    if(t.startsWith(ql))return 1;
    if(t.includes(ql))return 2;
    return 3;
  };
  const filtered=q.length>1?(()=>{
    const ql=q.toLowerCase();
    return allItems
      .filter(i=>`${i.title} ${i.kw||""}`.toLowerCase().includes(ql))
      .map((i,n)=>({i,n,s:score(i,ql)}))
      .sort((a,b)=>a.s-b.s||a.i.title.length-b.i.title.length||a.n-b.n)
      .map(x=>x.i);
  })():[];
  const go=(item)=>{setPage(item.page);onClose();setQ("")};
  // Enter and the arrow keys did nothing here: a search box that shows results
  // and then makes you reach for the mouse is not finished. Focus rolls through
  // the result buttons, which are already real buttons, so Tab still works too.
  const opts=()=>Array.from(listRef.current?.querySelectorAll("button[data-result]")||[]);
  const focusAt=(i)=>{const o=opts();if(!o.length)return;const n=(i+o.length)%o.length;o[n].focus();o[n].scrollIntoView({block:"nearest"})};
  const onInputKey=(e)=>{
    if(e.key==="Enter"&&filtered.length){e.preventDefault();go(filtered[0])}
    else if(e.key==="ArrowDown"){e.preventDefault();focusAt(0)}
    else if(e.key==="ArrowUp"){e.preventDefault();focusAt(-1)}
  };
  const onResultKey=(e,i)=>{
    if(e.key==="ArrowDown"){e.preventDefault();focusAt(i+1)}
    else if(e.key==="ArrowUp"){e.preventDefault();if(i===0)trapRef.current?.querySelector("input")?.focus();else focusAt(i-1)}
  };
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:120}}>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="Search Northern Birch" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:typeof window!=="undefined"&&window.innerWidth<=768?"calc(100vw - 32px)":640,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"24px 28px",borderBottom:"1px solid #eee",display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:20,color:"#707070"}}>&#128269;</span>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onInputKey} aria-label="Search products, services and tools" placeholder="Search products, services, tools..." autoFocus style={{flex:1,border:"none",outline:"none",fontFamily:fs,fontSize:17,color:C.navy}}/>
          <span aria-hidden="true" style={{fontFamily:fs,fontSize:11,color:"#5C5C5C",background:"#f0f0f0",padding:"3px 8px",borderRadius:6,fontWeight:600}}>esc</span>
          <button onClick={onClose} style={{background:"#f5f5f5",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>ESC</button>
        </div>
        {q.length>1&&<div ref={listRef} style={{maxHeight:400,overflow:"auto",padding:"8px 0"}}>
          {filtered.length===0?<p style={{padding:"24px 28px",fontFamily:fs,fontSize:14,color:"#6B6B6B",textAlign:"center"}}>No results found for "{q}"</p>:
          filtered.map((item,i)=>(
            <Clickable key={i} data-result="" onClick={()=>go(item)} onKeyDown={e=>onResultKey(e,i)} style={{padding:"14px 28px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f8f8f8"}}>
              <span style={{fontFamily:fs,fontSize:15,color:C.navy,fontWeight:500}}>{item.title}</span>
              <span style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",background:"#f5f5f5",padding:"3px 10px",borderRadius:6}}>{item.cat}</span>
            </Clickable>
          ))}
        </div>}
        {q.length<=1&&<div style={{padding:"24px 28px"}}><p style={{fontFamily:fs,fontSize:13,color:"#707070",margin:0}}>Try searching for "insurance", "mortgage", "travel", "claims", or "quote". Press Enter to open the first result.</p></div>}
        <p aria-live="polite" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0 0 0 0)",whiteSpace:"nowrap"}}>{q.length>1?`${filtered.length} result${filtered.length===1?"":"s"} for ${q}`:""}</p>
      </div>
    </div>
  );
}

// ============ AI CHAT WIDGET (Powered by Claude) ============
function ChatWidget({bottomInset=0}){
  const[open,setOpen]=useState(false);
  const[msgs,setMsgs]=useState([{from:"bot",text:"Hello! I'm Northern Birch's AI assistant, powered by Claude. I can help you with insurance questions, branch info, product recommendations, mortgage rates, travel services, and more. How can I help today?"}]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const m=input;setInput("");setLoading(true);
    setMsgs(p=>[...p,{from:"user",text:m}]);
    try{
      const history=msgs.filter(x=>x.from!=="system").map(x=>({role:x.from==="user"?"user":"assistant",content:x.text}));
      history.push({role:"user",content:m});
      const data=await callAI("chat",history);
      const reply=data.content?.[0]?.text||"I'm having trouble connecting right now. Please call us at 416-465-4659 or try again in a moment.";
      setMsgs(p=>[...p,{from:"bot",text:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{from:"bot",text:"I'm having trouble connecting right now. Please call us at 416-465-4659 for immediate assistance."}]);
    }
    setLoading(false);
  };
  return(<>
    {!open&&<Clickable onClick={()=>setOpen(true)} label="Open the Northern Birch AI assistant" style={{position:"fixed",bottom:24+bottomInset,right:24,width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(46,134,193,0.4)",zIndex:1500,animation:"pulse 2s infinite"}}>
      <span aria-hidden="true" style={{fontSize:24,color:"#fff"}}>&#9889;</span>
    </Clickable>}
    {open&&<div style={{position:"fixed",bottom:24+bottomInset,right:24,width:typeof window!=="undefined"&&window.innerWidth<=768?"calc(100vw - 32px)":400,height:typeof window!=="undefined"&&window.innerWidth<=768?440:560,background:"#fff",borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",zIndex:1500,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:`linear-gradient(135deg,${C.navy},#2a4060)`,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div aria-hidden="true" style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:14,color:"#fff"}}>&#9889;</span></div>
          <div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>AI Insurance Advisor</div><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)"}}>Powered by Claude -- Available 24/7</div></div>
        </div>
        <button onClick={()=>setOpen(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",color:"#fff",fontSize:16}}>x</button>
      </div>
      <div style={{flex:1,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=><div key={i} style={{alignSelf:m.from==="user"?"flex-end":"flex-start",maxWidth:"82%"}}>
          <div style={{background:m.from==="user"?`linear-gradient(135deg,${C.accent},${C.purple})`:"#f5f5f5",color:m.from==="user"?"#fff":C.navy,borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 16px",fontFamily:fs,fontSize:13,lineHeight:1.65}}>{m.text}</div>
        </div>)}
        {loading&&<div style={{alignSelf:"flex-start",maxWidth:"60%"}}><div style={{background:"#f5f5f5",borderRadius:"14px 14px 14px 4px",padding:"12px 16px"}}><span style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",animation:"blink 1s infinite"}}>Thinking...</span></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"8px 12px",borderTop:"1px solid #eee"}}>
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          {msgs.length<=2&&["What insurance do I need?","Branch hours","Travel to Estonia","Mortgage rates","How to file a claim"].map((q,i)=><button key={i} onClick={()=>{setInput(q);}} style={{background:`${C.accentText}08`,border:`1px solid ${C.accent}20`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.accentText,fontWeight:500}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} aria-label="Ask the Northern Birch assistant a question" placeholder="Ask me anything about Northern Birch..." style={{flex:1,border:"1px solid #eee",borderRadius:10,padding:"10px 14px",fontFamily:fs,fontSize:13,outline:"none"}} disabled={loading}/>
          <button onClick={send} disabled={loading} style={{background:loading?"#ccc":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:10,padding:"10px 16px",cursor:loading?"default":"pointer",color:"#fff",fontFamily:fs,fontSize:13,fontWeight:600}}>Send</button>
        </div>
      </div>
    </div>}
    <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
  </>);
}

// ============ MEMBER LOGIN MODAL ============
function LoginModal({open,onClose,setPage}){
  const trapRef=useFocusTrap(open,onClose);
  const[tab,setTab]=useState(0);
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="Member sign in" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:typeof window!=="undefined"&&window.innerWidth<=768?"calc(100vw - 32px)":420,overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"28px 32px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.accent})`,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:800,color:"#fff"}}>NB</span></div>
          <h3 style={{fontFamily:ff,fontSize:22,color:"#fff",margin:0}}>Member Sign In</h3>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #eee"}}>
          {["Online Banking","Insurance Portal"].map((t,i)=><button key={i} onClick={()=>setTab(i)} style={{flex:1,background:"none",border:"none",padding:"14px",fontFamily:fs,fontSize:13,fontWeight:tab===i?700:400,color:tab===i?C.accentText:"#6B6B6B",borderBottom:tab===i?`2px solid ${C.accentText}`:"2px solid transparent",cursor:"pointer"}}>{t}</button>)}
        </div>
        <div style={{padding:"28px 32px"}}>
          <div style={{marginBottom:16}}>
            <label htmlFor="login-id" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>{tab===0?"Member Number":"Policy Number"}</label>
            <input id="login-id" name="username" autoComplete="username" placeholder={tab===0?"Enter your member number":"Enter your policy number"} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label htmlFor="login-password" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Password</label>
            <input id="login-password" name="password" autoComplete="current-password" type="password" placeholder="Enter your password" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <button onClick={()=>{setPage("dashboard");onClose()}} style={{width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700,cursor:"pointer",marginBottom:16}}>Sign In</button>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <button style={{background:"none",border:"none",fontFamily:fs,fontSize:12,color:C.accentText,cursor:"pointer"}}>Forgot Password?</button>
            <button style={{background:"none",border:"none",fontFamily:fs,fontSize:12,color:C.accentText,cursor:"pointer"}}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TOAST NOTIFICATION SYSTEM ============
const ToastContext = React.createContext(null);
function ToastProvider({children}){
  const[toasts,setToasts]=useState([]);
  const showToast=(message,type="success")=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),4000);
  };
  return <ToastContext.Provider value={showToast}>
    {children}
    <div style={{position:"fixed",top:80,right:24,zIndex:2000,display:"flex",flexDirection:"column",gap:10}}>
      {toasts.map(t=><div key={t.id} style={{background:"#fff",borderRadius:12,padding:"14px 20px",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderLeft:`4px solid ${t.type==="success"?C.green:t.type==="error"?C.red:C.accent}`,minWidth:280,maxWidth:380,display:"flex",alignItems:"center",gap:10,animation:"slideIn 0.3s ease-out"}}>
        <span style={{fontSize:18}}>{t.type==="success"?"\u2705":t.type==="error"?"\u26A0":"\u2139\uFE0F"}</span>
        <span style={{fontFamily:fs,fontSize:13,color:C.navy,flex:1,lineHeight:1.5}}>{t.message}</span>
      </div>)}
    </div>
    <style>{`@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
  </ToastContext.Provider>;
}
// eslint-disable-next-line no-unused-vars -- public hook for ToastProvider consumers
function useToast(){return React.useContext(ToastContext)||((m)=>console.log(m))}

// ============ NOTIFICATIONS PANEL ============
function NotificationsPanel({open,onClose,setPage}){
  const trapRef=useFocusTrap(open,onClose);
  const[notes,setNotes]=useState([
    {id:1,type:"renewal",icon:"\uD83D\uDD14",title:"Home Insurance Renewal in 28 Days",desc:"Your home insurance with The Personal renews April 15, 2026 at C$142.50/month. Review coverage to ensure you're still adequately protected.",time:"2 hours ago",unread:true,action:"insurance",actionLabel:"Review Coverage",color:C.amberText},
    {id:2,type:"signature",icon:"\u270D\uFE0F",title:"Document Awaiting Your Signature",desc:"Critical Illness Insurance Application from CUMIS is ready for e-signature. Sign now to activate coverage.",time:"5 hours ago",unread:true,action:"dashboard",actionLabel:"Sign Now",color:C.accentText},
    {id:3,type:"life-event",icon:"\uD83C\uDF89",title:"Life Event Reminder: Mortgage Anniversary",desc:"It's been one year since your mortgage with Northern Birch. Time for a coverage review -- your equity has likely increased.",time:"Yesterday",unread:true,action:"healthcheck",actionLabel:"Run Health Check",color:C.purple},
    {id:4,type:"advisor",icon:"\uD83D\uDCAC",title:"New Message from Heili Orav",desc:"Heili replied to your question about TFSA contribution room. \"You have C$22,500 of unused TFSA room from prior years...\"",time:"Yesterday",unread:false,action:"messages",actionLabel:"Read Message",color:C.greenText},
    {id:5,type:"transfer",icon:"\u2705",title:"International Transfer Delivered",desc:"Your C$200 transfer to Maija in Riga has been received. Tracking ID: NB-TXN-487291.",time:"2 days ago",unread:false,action:"dashboard",actionLabel:"View Transfer",color:C.greenText},
    {id:6,type:"rate-alert",icon:"\uD83D\uDCC8",title:"GIC Rates Updated",desc:`Our posted 5-year GIC rate is now ${RATE.gic5} and the 1-year is ${RATE.gic1}. See the full rate table for every term.`,time:"3 days ago",unread:false,action:"rates",actionLabel:"View Rates",color:C.accentText},
    {id:7,type:"claim",icon:"\u2611\uFE0F",title:"Claim #CL-2024-3387 Approved",desc:"Your auto insurance claim for windshield damage has been approved. C$847 will be deposited within 3 business days.",time:"1 week ago",unread:false,action:"claims",actionLabel:"View Details",color:C.greenText},
    {id:8,type:"appointment",icon:"\uD83D\uDCC5",title:"Upcoming: Insurance Review",desc:"Your insurance review with Heili Orav is scheduled for March 25 at 10:30 AM at the Latvian Centre Branch.",time:"1 week ago",unread:false,action:"booking",actionLabel:"View Appointment",color:C.amberText},
  ]);
  const unreadCount=notes.filter(n=>n.unread).length;
  const markRead=(id)=>setNotes(p=>p.map(n=>n.id===id?{...n,unread:false}:n));
  const markAllRead=()=>setNotes(p=>p.map(n=>({...n,unread:false})));
  const handleAction=(note)=>{markRead(note.id);setPage(note.action);onClose()};
  if(!open)return null;
  return <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1500,background:"rgba(0,0,0,0.3)",display:"flex",justifyContent:"flex-end",alignItems:"flex-start",paddingTop:64}}>
    <div ref={trapRef} role="dialog" aria-modal="true" aria-label="Notifications" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",width:typeof window!=="undefined"&&window.innerWidth<=768?"calc(100vw - 32px)":420,maxHeight:"calc(100vh - 100px)",margin:typeof window!=="undefined"&&window.innerWidth<=768?"0 16px":"0 24px",display:"flex",flexDirection:"column",overflow:"hidden",animation:"slideDown 0.25s ease-out"}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <h3 style={{fontFamily:ff,fontSize:18,color:C.navy,margin:0}}>Notifications</h3>
          {unreadCount>0&&<span style={{background:C.red,color:"#fff",fontFamily:fs,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10}}>{unreadCount}</span>}
        </div>
        <button onClick={markAllRead} style={{background:"none",border:"none",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.accentText,fontWeight:600}}>Mark all read</button>
      </div>
      <div style={{overflow:"auto",flex:1}}>
        {notes.map(n=><Clickable key={n.id} onClick={()=>handleAction(n)} style={{padding:"14px 20px",borderBottom:"1px solid #f5f5f5",cursor:"pointer",background:n.unread?`${C.accentText}04`:"transparent",display:"flex",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${n.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>{n.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:n.unread?700:500,lineHeight:1.4}}>{n.title}</div>
              {n.unread&&<div style={{width:7,height:7,borderRadius:"50%",background:C.accentText,flexShrink:0,marginTop:5}}/>}
            </div>
            <div style={{fontFamily:fs,fontSize:12,color:"#666",marginTop:4,lineHeight:1.5}}>{n.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{n.time}</span>
              <span style={{fontFamily:fs,fontSize:11,color:n.color,fontWeight:600}}>{n.actionLabel} &rarr;</span>
            </div>
          </div>
        </Clickable>)}
      </div>
      <div style={{padding:"12px 20px",borderTop:"1px solid #f0f0f0",textAlign:"center"}}>
        <button onClick={()=>{setPage("dashboard");onClose()}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:fs,fontSize:12,color:C.accentText,fontWeight:600}}>View all in dashboard &rarr;</button>
      </div>
    </div>
    <style>{`@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
  </div>;
}

// ============ ADVISOR MESSAGING ============
function MessagesPage({setPage:_setPage}){
  const[thread,setThread]=useState("heili");
  const[mobileView,setMobileView]=useState("threads");// threads | chat
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[messages,setMessages]=useState({
    heili:[
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:"Hi Maria! I just reviewed your TFSA situation. You have C$22,500 of unused contribution room from prior years -- that's a great opportunity for tax-free growth. Want to set up a transfer?",time:"Yesterday, 2:14 PM"},
      {from:"member",text:"That sounds great! Can we do C$15,000 from my chequing into the TFSA?",time:"Yesterday, 3:42 PM"},
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:`Absolutely. I'll set up the transfer for you. Question: would you like to invest it in our high-interest savings (currently ${RATE.hisa}) or our 1-year GIC at ${RATE.gic1}? The GIC ladder strategy might also be worth discussing if you don't need access to the funds.`,time:"Yesterday, 3:55 PM"},
      {from:"member",text:"Let's do the GIC. Should we book a call to talk about the ladder strategy?",time:"Today, 9:12 AM"},
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:"Perfect. I have time Tuesday at 10:30 AM at the Latvian Centre branch, or we can do video. Either works for you?",time:"Today, 9:38 AM"},
    ],
    insurance:[
      {from:"advisor",author:"Andres Tamm",role:"Insurance Advisor",text:"Hi Maria, I noticed your home insurance is up for renewal April 15. The Personal is offering an enhanced bundle with auto -- you'd save approximately C$340/year by combining. Want me to run the numbers?",time:"2 days ago, 11:20 AM"},
      {from:"member",text:"Yes please! Also, can you tell me about critical illness coverage? Heili mentioned it.",time:"2 days ago, 12:05 PM"},
      {from:"advisor",author:"Andres Tamm",role:"Insurance Advisor",text:"Great question. Critical illness is often overlooked. CUMIS offers a 25-condition policy starting at about C$45/month for someone in your age bracket. Lump-sum payout if you're diagnosed. Should we discuss at your appointment with Heili next week, or earlier?",time:"2 days ago, 1:15 PM"},
    ],
    branch:[
      {from:"advisor",author:"Northern Birch Support",role:"Branch Services",text:"Hi Maria, your debit card replacement has been processed and will arrive within 5-7 business days. The temporary card you can use through online banking is now active.",time:"4 days ago, 3:00 PM"},
      {from:"member",text:"Thanks!",time:"4 days ago, 3:15 PM"},
    ],
  });
  const send=async()=>{
    if(!input.trim()||loading)return;
    const newMsg={from:"member",text:input,time:"Just now"};
    setMessages(p=>({...p,[thread]:[...p[thread],newMsg]}));
    setInput("");setLoading(true);
    try{
      const advisorContext={heili:{name:"Heili Orav",role:"Wealth & Estate Advisor",feature:"advisor-heili"},insurance:{name:"Andres Tamm",role:"Insurance Advisor",feature:"advisor-insurance"},branch:{name:"Northern Birch Support",role:"Branch Services",feature:"advisor-branch"}}[thread];
      const history=messages[thread].slice(-4).map(m=>({role:m.from==="member"?"user":"assistant",content:m.text}));
      history.push({role:"user",content:input});
      const data=await callAI(advisorContext.feature,history);
      const reply=data.content?.[0]?.text||"Thanks for your message. I'll get back to you shortly.";
      setMessages(p=>({...p,[thread]:[...p[thread],{from:"advisor",author:advisorContext.name,role:advisorContext.role,text:reply,time:"Just now"}]}));
    }catch(e){
      setMessages(p=>({...p,[thread]:[...p[thread],{from:"advisor",author:"System",role:"Notice",text:"I'm offline right now -- I'll respond by end of business day.",time:"Just now"}]}));
    }
    setLoading(false);
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  const threads=[
    {id:"heili",name:"Heili Orav",role:"Wealth & Estate",unread:0,last:"Perfect. I have time Tuesday at 10:30 AM..."},
    {id:"insurance",name:"Andres Tamm",role:"Insurance Advisor",unread:0,last:"CUMIS offers a 25-condition policy..."},
    {id:"branch",name:"Northern Birch Support",role:"Branch Services",unread:0,last:"Debit card replacement processed..."},
  ];
  return <section style={{background:"#f0f2f5",padding:isMob?"60px 0 0":"80px 0 0",paddingTop:isMob?64:80,minHeight:"100vh"}}>
    <div style={{maxWidth:1100,margin:"0 auto",height:"calc(100vh - 80px)",display:"grid",gridTemplateColumns:isMob?"1fr":"320px 1fr",gap:0,background:"#fff"}}>
      {/* Sidebar */}
      {(!isMob||mobileView==="threads")&&<div style={{borderRight:isMob?"none":"1px solid #eee",overflow:"auto",background:"#fafafa"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:18,color:C.navy,margin:0}}>Messages</h3>
          <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"4px 0 0"}}>Direct line to your Northern Birch team</p>
        </div>
        {threads.map(th=><Clickable key={th.id} onClick={()=>{setThread(th.id);if(isMob)setMobileView("chat")}} style={{padding:"14px 20px",cursor:"pointer",background:thread===th.id?"#fff":"transparent",borderLeft:thread===th.id?`3px solid ${C.accent}`:"3px solid transparent",borderBottom:"1px solid #f5f5f5"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:700}}>{th.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>{th.name}</div>
              <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:1}}>{th.role}</div>
              <div style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{th.last}</div>
            </div>
          </div>
        </Clickable>)}
      </div>}
      {/* Chat */}
      {(!isMob||mobileView==="chat")&&<div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 24px",borderBottom:"1px solid #eee",background:"#fff",display:"flex",alignItems:"center",gap:12}}>
          {isMob&&<button onClick={()=>setMobileView("threads")} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.navy,padding:4}}>&larr;</button>}
          <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>{threads.find(t=>t.id===thread).name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{threads.find(t=>t.id===thread).name}</div>
            <div style={{fontFamily:fs,fontSize:11,color:C.greenText,display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.greenFill,display:"inline-block"}}/>Online -- typically replies within 1 hour
            </div>
          </div>
        </div>
        <div tabIndex={0} role="log" aria-label="Conversation transcript" style={{flex:1,overflow:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:12,background:"#fafafa"}}>
          {messages[thread].map((m,i)=><div key={i} style={{alignSelf:m.from==="member"?"flex-end":"flex-start",maxWidth:"75%"}}>
            {m.from==="advisor"&&<div style={{fontFamily:fs,fontSize:10,color:"#6B6B6B",marginBottom:3,marginLeft:4}}>{m.author} -- {m.role}</div>}
            <div style={{background:m.from==="member"?`linear-gradient(135deg,${C.accent},${C.purple})`:"#fff",color:m.from==="member"?"#fff":C.navy,borderRadius:m.from==="member"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 16px",fontFamily:fs,fontSize:13,lineHeight:1.6,boxShadow:m.from==="advisor"?"0 1px 3px rgba(0,0,0,0.06)":"none"}}>{m.text}</div>
            <div style={{fontFamily:fs,fontSize:10,color:"#707070",marginTop:3,textAlign:m.from==="member"?"right":"left",paddingLeft:m.from==="member"?0:4,paddingRight:m.from==="member"?4:0}}>{m.time}</div>
          </div>)}
          {loading&&<div style={{alignSelf:"flex-start",background:"#fff",borderRadius:"16px 16px 16px 4px",padding:"10px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <span style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",animation:"blink 1.4s infinite"}}>{threads.find(t=>t.id===thread).name.split(" ")[0]} is typing...</span>
          </div>}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #eee",background:"#fff",display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} aria-label="Type a message" placeholder="Type a message..." style={{flex:1,border:"1px solid #eee",borderRadius:20,padding:"10px 18px",fontFamily:fs,fontSize:13,outline:"none",background:"#f8f8f8"}} disabled={loading}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"#ddd":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:20,padding:"10px 20px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Send</button>
        </div>
        <p style={{fontFamily:fs,fontSize:10,color:"#707070",margin:0,padding:"0 16px 12px",textAlign:"center"}}>Messages are encrypted end-to-end. AI may assist advisors with replies during off-hours.</p>
      </div>}
    </div>
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
  </section>;
}

// ============ NAV ============
function Nav({page,setPage,onSearch,onLogin,onNotifications,lang,setLang}){
  const[sc,setSc]=useState(false);
  const[mobileMenu,setMobileMenu]=useState(false);
  const[langMenu,setLangMenu]=useState(false);
  const[menu,setMenu]=useState(null);
  const w=useW();
  const isMob=w<=900;
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{window.scrollTo({top:0})},[page]);
  // Close the menus when the route changes. Done during render rather than in
  // an effect, which would queue a second render pass on every navigation.
  const[lastPage,setLastPage]=useState(page);
  if(page!==lastPage){setLastPage(page);setMobileMenu(false);setMenu(null)}
  const isDark=page==="home"&&!sc;
  // Banking leads: chequing, savings, mortgages and cards are what most visitors arrive looking for.
  const nav=[{l:"Banking",p:"personal",kids:[{l:"Chequing & Savings",p:"accounts",d:"No-fee everyday accounts, GICs, TFSA & RRSP"},{l:"Mortgages",p:"mortgages",d:"Fixed, variable, high-ratio & co-op financing"},{l:"Credit Cards",p:"cards",d:"Collabria cash back, low rate & travel rewards"},{l:"Personal Banking",p:"personal",d:"The full member line-up in one place"},{l:"Rates",p:"rates",d:"Today's mortgage, GIC and lending rates"}]},{l:"Insurance",p:"insurance"},{l:"Travel",p:"travel"},{l:"Business",p:"business"},{l:"Digital",p:"digital"},{l:"Tools",p:"quote"},{l:"Rates",p:"rates"},{l:"Community",p:"community"}];
  const langLabels={en:"EN",est:"EST",lat:"LAT"};
  const langFull={en:"English",est:"Eesti",lat:"Latviesu"};
  return(<>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:isDark&&!mobileMenu?"transparent":"rgba(253,251,247,0.98)",backdropFilter:isDark&&!mobileMenu?"none":"blur(16px)",transition:"all 0.4s",borderBottom:isDark&&!mobileMenu?"none":"1px solid rgba(200,184,138,0.15)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:isMob?"10px 16px":"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Clickable label="Northern Birch home" style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",width:"auto"}} onClick={()=>setPage("home")}>
          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:"#fff"}}>NB</span></div>
          <div><span style={{fontFamily:ff,fontSize:isMob?14:16,color:isDark&&!mobileMenu?"#fff":C.navy,fontWeight:600,display:"block",lineHeight:1.2,transition:"color 0.3s"}}>Northern Birch</span>{!isMob&&<span style={{fontFamily:fs,fontSize:9.5,color:isDark?"rgba(255,255,255,0.5)":"#6B6B6B",letterSpacing:1,textTransform:"uppercase"}}>{t("Credit Union",lang)}</span>}</div>
        </Clickable>
        {!isMob&&<div style={{display:"flex",gap:1,alignItems:"center"}}>
          {nav.map(n=>{
            const act=page===n.p||(n.kids||[]).some(k=>k.p===page);
            const st={background:act?`${C.accentText}10`:"transparent",border:"none",color:act?C.accentText:(isDark?"rgba(255,255,255,0.8)":C.navy),padding:"8px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:fs,fontWeight:act?700:500,transition:"all 0.3s"};
            if(!n.kids)return <button key={n.l} onClick={()=>setPage(n.p)} style={st}>{t(n.l,lang)}</button>;
            return <div key={n.l} onMouseEnter={()=>setMenu(n.l)} onMouseLeave={()=>setMenu(null)} onKeyDown={e=>{if(e.key==="Escape")setMenu(null)}} style={{position:"relative"}}>
              <button onClick={()=>setMenu(menu===n.l?null:n.l)} aria-expanded={menu===n.l} aria-haspopup="true" style={{...st,display:"flex",alignItems:"center",gap:4}}>{t(n.l,lang)}<span style={{fontSize:8,opacity:0.6}}>&#9660;</span></button>
              {menu===n.l&&<div style={{position:"absolute",top:"100%",left:0,paddingTop:8}}>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 8px 32px rgba(12,24,41,0.16)",overflow:"hidden",minWidth:300,border:"1px solid #f0ece0"}}>
                  {n.kids.map(k=><button key={k.l} onClick={()=>{setPage(k.p);setMenu(null)}} style={{display:"block",width:"100%",textAlign:"left",background:page===k.p?`${C.accentText}08`:"#fff",border:"none",borderBottom:"1px solid #f8f8f8",padding:"12px 18px",cursor:"pointer"}}>
                    <span style={{display:"block",fontFamily:fs,fontSize:13.5,fontWeight:700,color:page===k.p?C.accent:C.navy}}>{t(k.l,lang)}</span>
                    <span style={{display:"block",fontFamily:fs,fontSize:11.5,color:"#6B6B6B",marginTop:2}}>{k.d}</span>
                  </button>)}
                </div>
              </div>}
            </div>;
          })}
          <div style={{width:1,height:20,background:isDark?"rgba(255,255,255,0.15)":"#ddd",margin:"0 6px"}}/>
          {/* Language Picker */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setLangMenu(!langMenu)} style={{background:isDark?"rgba(255,255,255,0.08)":"#f5f5f5",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:11,color:isDark?"rgba(255,255,255,0.7)":C.navy,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:14}}>&#127760;</span> {langLabels[lang]}
            </button>
            {langMenu&&<div style={{position:"absolute",top:"100%",right:0,marginTop:4,background:"#fff",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",overflow:"hidden",minWidth:140,border:"1px solid #eee"}}>
              {Object.entries(langFull).map(([code,name])=>(
                <button key={code} onClick={()=>{setLang(code);setLangMenu(false)}} style={{display:"block",width:"100%",textAlign:"left",background:lang===code?`${C.accentText}08`:"#fff",border:"none",padding:"10px 16px",cursor:"pointer",fontFamily:fs,fontSize:13,color:lang===code?C.accentText:C.navy,fontWeight:lang===code?700:400,borderBottom:"1px solid #f5f5f5"}}>
                  <span style={{fontWeight:700,marginRight:8}}>{langLabels[code]}</span>{name}
                </button>
              ))}
            </div>}
          </div>
          <button onClick={onSearch} aria-label="Search Northern Birch" style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:16,color:isDark?"rgba(255,255,255,0.6)":"#6B6B6B"}}><span aria-hidden="true">&#128269;</span></button>
          <button onClick={onNotifications} aria-label="Notifications" style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:16,color:isDark?"rgba(255,255,255,0.6)":"#6B6B6B",position:"relative"}}><span aria-hidden="true">&#128276;</span><span aria-hidden="true" style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:C.red,border:"2px solid "+(isDark?C.dark:"#fdfbf7")}}/></button>
          <button onClick={onLogin} style={{background:C.accentText,border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"#fff",fontWeight:600}}>{t("Sign In",lang)}</button>
        </div>}
        {isMob&&<div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <button onClick={()=>setLangMenu(!langMenu)} style={{background:"#f0f0f0",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontFamily:fs,fontSize:10,color:C.navy,fontWeight:700}}>
              &#127760; {langLabels[lang]}
            </button>
            {langMenu&&<div style={{position:"absolute",top:"100%",right:0,marginTop:4,background:"#fff",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",overflow:"hidden",minWidth:120,zIndex:100,border:"1px solid #eee"}}>
              {Object.entries(langFull).map(([code,name])=>(
                <button key={code} onClick={()=>{setLang(code);setLangMenu(false)}} style={{display:"block",width:"100%",textAlign:"left",background:lang===code?`${C.accentText}08`:"#fff",border:"none",padding:"8px 14px",cursor:"pointer",fontFamily:fs,fontSize:12,color:lang===code?C.accentText:C.navy,fontWeight:lang===code?700:400}}>
                  {langLabels[code]} {name}
                </button>
              ))}
            </div>}
          </div>
          <button onClick={onSearch} aria-label="Search Northern Birch" style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:16,color:"#6B6B6B"}}><span aria-hidden="true">&#128269;</span></button>
          <button onClick={onNotifications} aria-label="Notifications" style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:16,color:"#6B6B6B",position:"relative"}}><span aria-hidden="true">&#128276;</span><span aria-hidden="true" style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:C.red,border:"2px solid #fdfbf7"}}/></button>
          <button onClick={()=>setMobileMenu(!mobileMenu)} aria-label={mobileMenu?"Close menu":"Open menu"} aria-expanded={mobileMenu} style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:20,color:C.navy}}>
            <span aria-hidden="true">{mobileMenu?"\u2715":"\u2630"}</span>
          </button>
        </div>}
      </div>
    </nav>
    {isMob&&mobileMenu&&<div style={{position:"fixed",top:56,left:0,right:0,bottom:0,background:"rgba(253,251,247,0.99)",zIndex:999,padding:"16px",overflow:"auto"}}>
      {nav.map(n=><div key={n.l}>
        {n.kids
          ?<div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,padding:"16px 20px 6px"}}>{t(n.l,lang)}</div>
          :<button onClick={()=>setPage(n.p)} style={{display:"block",width:"100%",textAlign:"left",background:page===n.p?`${C.accentText}10`:"transparent",border:"none",padding:"16px 20px",borderRadius:12,fontFamily:fs,fontSize:16,color:page===n.p?C.accent:C.navy,fontWeight:page===n.p?700:500,marginBottom:4}}>{t(n.l,lang)}</button>}
        {(n.kids||[]).map(k=><button key={k.l} onClick={()=>setPage(k.p)} style={{display:"block",width:"100%",textAlign:"left",background:page===k.p?`${C.accentText}10`:"transparent",border:"none",padding:"14px 20px",borderRadius:12,fontFamily:fs,fontSize:15,color:page===k.p?C.accent:C.navy,fontWeight:page===k.p?700:500,marginBottom:4}}>{t(k.l,lang)}</button>)}
      </div>)}
      <div style={{borderTop:"1px solid #eee",marginTop:12,paddingTop:12}}>
        <button onClick={()=>{onLogin();setMobileMenu(false)}} style={{display:"block",width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700,marginBottom:8}}>{t("Sign In",lang)}</button>
        <button onClick={()=>setPage("booking")} style={{display:"block",width:"100%",background:C.navy,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700}}>{t("Book Appointment",lang)}</button>
      </div>
    </div>}
  </>);
}

// ============ QUOTE CALCULATOR ============
// Rendered by QuotePage. Kept at module scope so React sees one stable
// component identity instead of a new one on every render.
const SliderLabel=({label,value,sub:_sub})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{label}</span><span style={{fontFamily:ff,fontSize:20,color:C.navy,fontWeight:700}}>{value}</span></div>;

function QuotePage({setPage}){
  const[type,setType]=useState("life");
  const[age,setAge]=useState(35);
  const[coverage,setCoverage]=useState(500000);
  const[term,setTerm]=useState(20);
  const[smoker,setSmoker]=useState(false);
  const[homeVal,setHomeVal]=useState(600000);
  const[deductible,setDeductible]=useState(1000);
  const[carYear,setCarYear]=useState(2022);
  const[drivingRecord,setDrivingRecord]=useState("clean");
  const[tripDays,setTripDays]=useState(30);
  const[travellers,setTravellers]=useState(1);
  // Real-time calc
  const calc=()=>{
    if(type==="life"){const base=coverage/1000*0.08;const af=1+(age-25)*0.04;const tf=term===10?0.7:term===20?1:1.4;const sf=smoker?2.2:1;return Math.round(base*af*tf*sf*100)/100;}
    if(type==="home"){const df=deductible===500?1.15:deductible===1000?1:deductible===2500?0.85:0.75;return Math.round(homeVal*0.004/12*df*100)/100;}
    if(type==="auto"){const yf=carYear>=2022?1.2:carYear>=2018?1:0.85;const rf=drivingRecord==="clean"?0.85:drivingRecord==="minor"?1:1.4;return Math.round(145*yf*rf*100)/100;}
    if(type==="travel"){const af=age>65?3.2:age>50?1.8:1;return Math.round(af*tripDays*0.95*travellers*100)/100;}
    return 0;
  };
  const monthly=calc();
  const annual=Math.round(monthly*12*100)/100;
  const sliderStyle=(color)=>({WebkitAppearance:"none",width:"100%",height:8,borderRadius:4,background:`linear-gradient(90deg,${color} 0%,#eee 100%)`,outline:"none",cursor:"pointer"});
  const types=[{l:"Term Life",v:"life",icon:"&#9829;",c:C.accentText},{l:"Home",v:"home",icon:"&#9750;",c:C.greenFill},{l:"Auto",v:"auto",icon:"&#9881;",c:C.amber},{l:"Travel",v:"travel",icon:"&#9992;",c:C.purple}];
  const activeType=types.find(t=>t.v===type);
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="Interactive Quote Calculator" tagColor={C.accentText} title="See your estimated premium instantly" desc="Drag the sliders to adjust coverage. Your estimated premium updates in real-time. No personal information required."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:32}}>
          {types.map(t=>(
            <button key={t.v} onClick={()=>setType(t.v)} style={{background:type===t.v?t.c:"#fff",border:type===t.v?"none":"1px solid #ddd",borderRadius:16,padding:"20px 16px",cursor:"pointer",transition:"all 0.3s",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:6}} dangerouslySetInnerHTML={{__html:t.icon}}/>
              <div style={{fontFamily:fs,fontSize:14,fontWeight:700,color:type===t.v?"#fff":C.navy}}>{t.l}</div>
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 340px",gap:24}}>
          {/* LEFT: Sliders */}
          <div style={{background:"#fff",borderRadius:24,padding:"36px 40px",border:"1px solid #eee"}}>
            <h3 style={{fontFamily:fs,fontSize:18,color:C.navy,margin:"0 0 28px",fontWeight:700}}>Customize your coverage</h3>
            {type==="life"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Your Age" value={age}/>
                <input type="range" aria-label="Your age" min={18} max={70} value={age} onChange={e=>setAge(+e.target.value)} style={sliderStyle(C.accent)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>18</span><span>70</span></div>
              </div>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Coverage Amount" value={`C$${(coverage/1000).toLocaleString()}K`}/>
                <input type="range" aria-label="Coverage amount" min={100000} max={2000000} step={50000} value={coverage} onChange={e=>setCoverage(+e.target.value)} style={sliderStyle(C.accent)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>$100K</span><span>$2M</span></div>
              </div>
              <div style={{marginBottom:28}}>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Term Length</div>
                <div style={{display:"flex",gap:8}}>{[10,20,30].map(t=><button key={t} onClick={()=>setTerm(t)} style={{flex:1,background:term===t?C.accentText:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:term===t?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{t} Years</button>)}</div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Tobacco Use</div>
                <div style={{display:"flex",gap:8}}>{[{l:"Non-Smoker",v:false},{l:"Smoker",v:true}].map(s=><button key={String(s.v)} onClick={()=>setSmoker(s.v)} style={{flex:1,background:smoker===s.v?C.navy:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:smoker===s.v?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{s.l}</button>)}</div>
              </div>
            </>}
            {type==="home"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Home Value" value={`C$${(homeVal/1000).toLocaleString()}K`}/>
                <input type="range" aria-label="Home value" min={200000} max={2000000} step={25000} value={homeVal} onChange={e=>setHomeVal(+e.target.value)} style={sliderStyle(C.green)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>$200K</span><span>$2M</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Deductible</div>
                <div style={{display:"flex",gap:8}}>{[500,1000,2500,5000].map(d=><button key={d} onClick={()=>setDeductible(d)} style={{flex:1,background:deductible===d?C.greenFill:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:13,color:deductible===d?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>${d.toLocaleString()}</button>)}</div>
                <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:8}}>Higher deductible = lower premium. Choose the amount you're comfortable paying out of pocket.</p>
              </div>
            </>}
            {type==="auto"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Vehicle Year" value={carYear}/>
                <input type="range" aria-label="Vehicle year" min={2010} max={2026} value={carYear} onChange={e=>setCarYear(+e.target.value)} style={sliderStyle(C.amber)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>2010</span><span>2026</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Driving Record</div>
                <div style={{display:"flex",gap:8}}>{[{l:"Clean",v:"clean"},{l:"1-2 Minor",v:"minor"},{l:"At-Fault Accident",v:"accident"}].map(r=><button key={r.v} onClick={()=>setDrivingRecord(r.v)} style={{flex:1,background:drivingRecord===r.v?C.amber:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:12,color:drivingRecord===r.v?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{r.l}</button>)}</div>
              </div>
            </>}
            {type==="travel"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Your Age" value={age}/>
                <input type="range" min={18} max={85} value={age} onChange={e=>setAge(+e.target.value)} style={sliderStyle(C.purple)}/>
              </div>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Trip Duration" value={`${tripDays} days`}/>
                <input type="range" min={7} max={180} value={tripDays} onChange={e=>setTripDays(+e.target.value)} style={sliderStyle(C.purple)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>7 days</span><span>180 days</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Travellers</div>
                <div style={{display:"flex",gap:8}}>{[1,2,3,4].map(n=><button key={n} onClick={()=>setTravellers(n)} style={{flex:1,background:travellers===n?C.purple:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:travellers===n?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{n}</button>)}</div>
              </div>
            </>}
          </div>
          {/* RIGHT: Live Result */}
          <div>
            <div id="quote-result-panel" style={{background:C.navy,borderRadius:24,padding:"36px 32px",textAlign:"center",position:typeof window!=="undefined"&&window.innerWidth<=768?"relative":"sticky",top:80}}>
              <div style={{width:56,height:56,borderRadius:16,background:`${activeType.c}25`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24,color:activeType.c}} dangerouslySetInnerHTML={{__html:activeType.icon}}/></div>
              <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>Estimated Monthly Premium</div>
              <div style={{fontFamily:ff,fontSize:52,color:"#fff",fontWeight:700,margin:"0 0 4px",transition:"all 0.3s"}}>C${money(monthly)}</div>
              <div style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",marginBottom:20}}>C${money(annual)} / year</div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"16px",marginBottom:20}}>
                {type==="life"&&<div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8,textAlign:"left"}}>
                  {[["Coverage",`C$${(coverage/1000)}K`],["Term",`${term} years`],["Age",age],["Tobacco",smoker?"Yes":"No"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
                {type==="home"&&<div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8,textAlign:"left"}}>
                  {[["Home Value",`C$${(homeVal/1000)}K`],["Deductible",`C$${deductible}`],["Coverage","Replacement Cost"],["Liability","C$2M"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
                {type==="auto"&&<div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8,textAlign:"left"}}>
                  {[["Vehicle",carYear],["Record",drivingRecord],["Liability","C$1M"],["Collision","Included"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600,textTransform:"capitalize"}}>{v}</div></div>)}
                </div>}
                {type==="travel"&&<div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8,textAlign:"left"}}>
                  {[["Age",age],["Duration",`${tripDays} days`],["Travellers",travellers],["Medical","C$5M"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
              </div>
              <button onClick={()=>setPage("booking")} style={{width:"100%",background:activeType.c,border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700,marginBottom:8}}>Book an Advisor Appointment</button>
              <button onClick={()=>exportToPDF("quote-result-panel",`${activeType.l} Insurance Quote`)} style={{width:"100%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600,marginBottom:8}}>&#128190; Download Quote (PDF)</button>
              <button onClick={()=>setPage("compare")} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",fontWeight:500}}>Compare Coverage Options</button>
              <p style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:"16px 0 0",lineHeight:1.6}}>Estimate only. Actual premiums may vary. Exclusive NBCU member rates may be lower.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ COVERAGE COMPARISON ============
function ComparePage({setPage}){
  const[cat,setCat]=useState(0);
  const tables=[
    {name:"Term Life Insurance",plans:[
      {tier:"Essential",price:"From $18/mo",features:{"Coverage":"$100K-$500K","Term":"10 or 20 years","Conversion":"Yes","Spousal rider":"No","Child rider":"No","Waiver of premium":"No","Accelerated death":"Yes","Living benefit":"No"}},
      {tier:"Standard",price:"From $28/mo",features:{"Coverage":"$250K-$1M","Term":"10, 20, or 30 years","Conversion":"Yes","Spousal rider":"Yes","Child rider":"Yes","Waiver of premium":"Yes","Accelerated death":"Yes","Living benefit":"No"}},
      {tier:"Premium",price:"From $45/mo",features:{"Coverage":"$500K-$2M","Term":"10, 20, or 30 years","Conversion":"Yes","Spousal rider":"Yes","Child rider":"Yes","Waiver of premium":"Yes","Accelerated death":"Yes","Living benefit":"Yes"}},
    ]},
    {name:"Home Insurance",plans:[
      {tier:"Basic",price:"From $85/mo",features:{"Dwelling":"Actual cash value","Contents":"$50K","Liability":"$1M","Water damage":"Standard","Identity theft":"No","Equipment breakdown":"No","Replacement cost":"No","Bundle discount":"10%"}},
      {tier:"Enhanced",price:"From $120/mo",features:{"Dwelling":"Replacement cost","Contents":"$100K","Liability":"$2M","Water damage":"Enhanced","Identity theft":"Yes","Equipment breakdown":"Yes","Replacement cost":"Yes","Bundle discount":"15%"}},
      {tier:"Comprehensive",price:"From $165/mo",features:{"Dwelling":"Guaranteed replacement","Contents":"$150K+","Liability":"$2M","Water damage":"Full (incl. overland)","Identity theft":"Yes","Equipment breakdown":"Yes","Replacement cost":"Yes","Bundle discount":"20%"}},
    ]},
    {name:"Travel Insurance",plans:[
      {tier:"Single Trip",price:"From $29",features:{"Emergency medical":"$5M","Trip cancellation":"Yes","Baggage":"$1,500","Trip interruption":"Yes","Travel delay":"$500","Pre-existing conditions":"With stability","Duration":"Up to 60 days","24/7 assistance":"Yes"}},
      {tier:"Annual Multi-Trip",price:"From $149/yr",features:{"Emergency medical":"$5M","Trip cancellation":"Yes","Baggage":"$2,000","Trip interruption":"Yes","Travel delay":"$1,000","Pre-existing conditions":"With stability","Duration":"Multiple trips/yr","24/7 assistance":"Yes"}},
      {tier:"Annual Premium",price:"From $249/yr",features:{"Emergency medical":"$10M","Trip cancellation":"Enhanced","Baggage":"$3,000","Trip interruption":"Enhanced","Travel delay":"$2,000","Pre-existing conditions":"Included","Duration":"Unlimited trips","24/7 assistance":"Yes + concierge"}},
    ]},
  ];
  const t=tables[cat];
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <SH tag="Compare Plans" tagColor={C.accentText} title="Coverage comparison" desc="Compare plan tiers side-by-side to find the right level of protection for your needs."/>
        <div style={{display:"flex",gap:8,marginBottom:32}}>
          {tables.map((tb,i)=><button key={i} onClick={()=>setCat(i)} style={{flex:1,background:cat===i?C.navy:"#fff",border:cat===i?"none":"1px solid #ddd",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:cat===i?"#fff":C.navy}}>{tb.name}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${t.plans.length},1fr)`,gap:16}}>
          {t.plans.map((plan,i)=><div key={i} style={{background:"#fff",borderRadius:20,overflow:"hidden",border:i===1?`2px solid ${C.accent}`:"1px solid #eee"}}>
            {i===1&&<div style={{background:C.accentText,padding:"6px",textAlign:"center"}}><span style={{fontFamily:fs,fontSize:11,color:"#fff",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Most Popular</span></div>}
            <div style={{padding:"28px 24px",textAlign:"center",borderBottom:"1px solid #eee"}}>
              <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 8px"}}>{plan.tier}</h3>
              <div style={{fontFamily:fs,fontSize:20,color:C.accentText,fontWeight:700}}>{plan.price}</div>
            </div>
            <div style={{padding:"16px 24px"}}>
              {Object.entries(plan.features).map(([k,v],fi)=><div key={fi} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:fi<Object.keys(plan.features).length-1?"1px solid #f5f5f5":"none"}}>
                <span style={{fontFamily:fs,fontSize:13,color:"#6B6B6B"}}>{k}</span>
                <span style={{fontFamily:fs,fontSize:13,color:v==="No"?"#707070":C.navy,fontWeight:v==="No"?400:600}}>{v}</span>
              </div>)}
            </div>
            <div style={{padding:"16px 24px 24px"}}><button onClick={()=>setPage("quote")} style={{width:"100%",background:i===1?C.accentText:C.navy,border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Get a Quote</button></div>
          </div>)}
        </div>
      </div>
    </section>
  );
}

// ============ CLAIMS WIZARD ============
function ClaimsPage(){
  const[step,setStep]=useState(0);
  const[claimType,setClaimType]=useState("");
  const[policy,setPolicy]=useState("");const[incidentDate,setIncidentDate]=useState("");const[details,setDetails]=useState("");
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=policy.trim()&&details.trim()&&name.trim()&&(email.trim()||phone.trim())&&consent;
  // No claim number is invented here. Only the insurer can open a claim and
  // issue a number; this form starts that conversation.
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("claim",{claimType,policy,incidentDate,details,name,email,phone,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setStep(2);
    else setError("We could not send your claim request. Nothing has been filed. Please try again, or call your insurer directly using the numbers below — for an urgent claim, always call.");
  };
  const steps=[
    {title:"Select Claim Type",content:<div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(2,1fr)",gap:16}}>
      {[{l:"Home Insurance Claim",v:"home",d:"Property damage, theft, water damage, liability"},{l:"Auto Insurance Claim",v:"auto",d:"Accident, collision, theft, vandalism"},{l:"Travel Insurance Claim",v:"travel",d:"Emergency medical, trip cancellation, baggage"},{l:"Life / CI / Disability Claim",v:"life",d:"Death benefit, critical illness, disability"},{l:"Mortgage Protection Claim",v:"mortgage",d:"Creditor life, disability, critical illness"},{l:"Commercial Insurance Claim",v:"commercial",d:"Business property, liability, business interruption"}].map((t,i)=>
        <Clickable key={i} onClick={()=>{setClaimType(t.v);setStep(1)}} style={{background:claimType===t.v?`${C.accentText}08`:"#fff",border:claimType===t.v?`2px solid ${C.accent}`:"1px solid #eee",borderRadius:16,padding:"24px",cursor:"pointer",transition:"all 0.3s"}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 4px",fontWeight:700}}>{t.l}</h4>
          <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>{t.d}</p>
        </Clickable>
      )}
    </div>},
    {title:"Provide Details",content:<div>
      <div style={{marginBottom:16}}><label htmlFor="claim-policy" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Policy Number</label><input id="claim-policy" value={policy} onChange={e=>setPolicy(e.target.value)} placeholder="Enter your policy number" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label htmlFor="claim-date" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Date of Incident</label><input type="date" id="claim-date" value={incidentDate} onChange={e=>setIncidentDate(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label htmlFor="claim-details" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Description of Claim</label><textarea id="claim-details" rows={4} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Please describe what happened..." style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box"}}/></div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
        <div><label htmlFor="booking-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="booking-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
        <div><label htmlFor="booking-phone" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Phone</label><input id="booking-phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="416-XXX-XXXX" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
      </div>
      <div style={{marginBottom:16}}><label htmlFor="booking-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Email</label><input id="booking-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
      <div style={{background:`${C.amber}08`,borderRadius:12,padding:"14px 18px",marginBottom:16,borderLeft:`4px solid ${C.amber}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.6}}>Have photos, receipts, or a police report ready. Documents are not uploaded through this form &mdash; the adjuster will tell you where to send them when they call.</p>
      </div>
      <><ConsentNotice id="claim-consent" checked={consent} onChange={setConsent} purpose="so it can be passed to the insurer to open my claim" extra="Claim details may include information about my health or property."/>
      {error&&<div style={errBox}>{error}</div>}
      <div style={{display:"flex",gap:12}}><Btn outline onClick={()=>setStep(0)}>Back</Btn><Btn color={sending||!canSubmit?"#ccc":C.accent} onClick={sending||!canSubmit?undefined:submit}>{sending?"Sending...":"Submit Claim Request"}</Btn></div></>
    </div>},
    {title:"Request Sent",content:<div id="claim-confirmation" style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div>
      <h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 12px"}}>Claim Request Sent</h3>
      <p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.7,maxWidth:500,margin:"0 auto 8px"}}>We have passed your details to the insurer. Your claim number is issued by them, not by us, and comes with their first call.</p>
      <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",lineHeight:1.7,maxWidth:500,margin:"0 auto 24px"}}>A claims adjuster will contact you within 1-2 business days. You can track your claim status through the Insurance Dashboard in your online banking.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn onClick={()=>exportToPDF("claim-confirmation","Claim Request")} color={C.accentText}>&#128190; Download Request (PDF)</Btn>
        <Btn outline onClick={()=>{setStep(0);setClaimType("");setPolicy("");setDetails("")}}>File Another Claim</Btn>
      </div>
    </div>},
  ];
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Claims Centre" tagColor={C.redText} title="File an insurance claim" desc="Start your claim online. We'll guide you through the process step by step."/>
        <div style={{display:"flex",gap:0,marginBottom:32}}>
          {steps.map((s,i)=><div key={i} style={{flex:1,display:"flex",alignItems:"center"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:i<=step?C.accentText:"#ddd",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:700}}>{i+1}</span></div>
            <div style={{fontFamily:fs,fontSize:12,color:i<=step?C.navy:"#707070",marginLeft:8,fontWeight:i===step?700:400}}>{s.title}</div>
            {i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?C.accentText:"#eee",margin:"0 12px"}}/>}
          </div>)}
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>{steps[step].content}</div>
        <div style={{marginTop:32,background:`${C.amber}08`,borderRadius:16,padding:"24px 28px",borderLeft:`4px solid ${C.amber}`}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 8px",fontWeight:700}}>Claim Contact Numbers</h4>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(2,1fr)":"repeat(3,1fr)",gap:16}}>
            {[{n:"The Personal (Home/Auto/Travel)",p:"1-888-476-8737"},{n:"CUMIS (Life/Creditor)",p:"1-800-263-9120"},{n:"Manulife (Group Benefits)",p:"1-800-268-6195"}].map((c2,i)=><div key={i}><div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{c2.n}</div><div style={{fontFamily:fs,fontSize:14,color:C.accentText,fontWeight:700}}>{c2.p}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CALCULATORS ============
function CalculatorsPage(){
  const[calc,setCalc]=useState("mortgage");
  const[calcErr,setCalcErr]=useState("");
  // Mortgage
  const[mAmt,setMAmt]=useState(500000);const[mRate,setMRate]=useState(4.39);const[mYrs,setMYrs]=useState(25);const[mResult,setMResult]=useState(null);
  // Insurance needs
  const[income,setIncome]=useState(100000);const[deps,setDeps]=useState(2);const[mortgage,setMortgage]=useState(400000);const[insResult,setInsResult]=useState(null);
  // Retirement
  const[rAge,setRAge]=useState(35);const[rRetire,setRRetire]=useState(65);const[rIncome,setRIncome]=useState(80000);const[rSaved,setRSaved]=useState(50000);const[rMonthly,setRMonthly]=useState(500);const[rReturn,setRReturn]=useState(6);const[rResult,setRResult]=useState(null);
  // Canadian fixed-rate mortgages compound semi-annually, not in advance
  // (Interest Act), so the monthly rate is not simply annual/12 -- that is the
  // US convention and it overstated the payment on every calculation here.
  const monthlyRateCA=(annualPct)=>annualPct===0?0:Math.pow(1+annualPct/100/2,1/6)-1;
  const calcMortgage=()=>{
    if(!(mAmt>0)){setMResult(null);setCalcErr("Enter a mortgage amount greater than zero.");return}
    if(mRate<0||mRate>25){setMResult(null);setCalcErr("Enter an interest rate between 0% and 25%.");return}
    setCalcErr("");
    const r=monthlyRateCA(mRate);const n=mYrs*12;
    const pmt=r===0?mAmt/n:mAmt*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    setMResult(Math.round(pmt*100)/100);
  };
  const calcInsurance=()=>{
    if(income<0||mortgage<0||deps<0){setInsResult(null);setCalcErr("Income, mortgage and dependants cannot be negative.");return}
    if(!(income>0)){setInsResult(null);setCalcErr("Enter an annual household income greater than zero.");return}
    setCalcErr("");
    const incomeNeed=income*10;const debtCover=mortgage;const education=deps*80000;
    setInsResult({total:incomeNeed+debtCover+education,income:incomeNeed,debt:debtCover,edu:education});
  };
  const calcRetirement=()=>{
    if(rRetire<=rAge){setRResult(null);setCalcErr("Your target retirement age has to be later than your current age.");return}
    if(rRetire>=90){setRResult(null);setCalcErr("This projection runs to age 90, so pick a retirement age below that.");return}
    if(rReturn<0||rReturn>15){setRResult(null);setCalcErr("Enter an expected annual return between 0% and 15%.");return}
    if(rSaved<0||rMonthly<0||rIncome<0){setRResult(null);setCalcErr("Savings, contributions and income cannot be negative.");return}
    setCalcErr("");
    const years=rRetire-rAge;const retYears=90-rRetire;const monthlyR=rReturn/100/12;const months=years*12;
    // Future value of current savings
    const fvSaved=rSaved*Math.pow(1+monthlyR,months);
    // Future value of monthly contributions
    const fvContrib=monthlyR===0?rMonthly*months:rMonthly*((Math.pow(1+monthlyR,months)-1)/monthlyR);
    const totalAtRetire=Math.round(fvSaved+fvContrib);
    // How much they need (4% rule)
    const annualNeed=rIncome*0.7;const totalNeed=Math.round(annualNeed*retYears);
    // CPP + OAS estimate (annual)
    const cppOas=18000;const govTotal=Math.round(cppOas*retYears);
    // Monthly income from savings (4% rule)
    const monthlyFromSavings=Math.round(totalAtRetire*0.04/12);
    const monthlyGov=Math.round(cppOas/12);
    const monthlyTotal=monthlyFromSavings+monthlyGov;
    const monthlyTarget=Math.round(annualNeed/12);
    const gap=monthlyTarget-monthlyTotal;
    // Insurance gap: if they die before retirement
    const insGap=Math.max(0,totalNeed-totalAtRetire-govTotal);
    setRResult({totalAtRetire,totalNeed,govTotal,monthlyFromSavings,monthlyGov,monthlyTotal,monthlyTarget,gap,annualNeed,insGap,years,retYears});
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="Financial Calculators" tagColor={C.greenText} title="Plan with confidence" desc="Mortgage payments, insurance needs, and retirement projections -- all the numbers you need to make informed decisions."/>
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {[{l:"Mortgage",v:"mortgage"},{l:"Insurance Needs",v:"insurance"},{l:"Retirement",v:"retirement"}].map(tab=><button key={tab.v} onClick={()=>{setCalc(tab.v);setCalcErr("")}} style={{flex:1,minWidth:isMob?0:150,background:calc===tab.v?C.navy:"#fff",border:calc===tab.v?"none":"1px solid #ddd",borderRadius:12,padding:"14px 16px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:calc===tab.v?"#fff":C.navy}}>{tab.l}</button>)}
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          {calcErr&&<div role="alert" style={{background:`${C.redText}0D`,border:`1px solid ${C.redText}33`,borderRadius:12,padding:"12px 16px",marginBottom:20,fontFamily:fs,fontSize:14,color:C.redText}}>{calcErr}</div>}
          {calc==="mortgage"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
              <div><label htmlFor="calc-0" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Mortgage Amount</label><input type="number" id="calc-0" min="0" step="1000" value={mAmt} onChange={e=>setMAmt(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-1" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Interest Rate (%)</label><input type="number" id="calc-1" min="0" max="25" step="0.01" value={mRate} onChange={e=>setMRate(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="sel-0" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Amortization (Years)</label><select id="sel-0" value={mYrs} onChange={e=>setMYrs(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box",background:"#fff"}}>{[15,20,25,30].map(y=><option key={y} value={y}>{y} years</option>)}</select></div>
            </div>
            <button onClick={calcMortgage} style={{width:"100%",background:C.greenFill,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Payment</button>
            {mResult&&<div id="mortgage-result" style={{marginTop:24,background:`${C.greenFill}08`,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
              <div style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Estimated Monthly Payment</div>
              <div style={{fontFamily:ff,fontSize:48,color:C.greenText,fontWeight:700,margin:"8px 0"}}>C${mResult.toLocaleString()}</div>
              <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:"8px 0 12px"}}>Based on {mRate}% rate, {mYrs}-year amortization. Current NBCU rates: 3-year closed {RATE.m3}, 5-year high ratio {RATE.m5hr}.</p>
              <button onClick={()=>exportToPDF("mortgage-result","Mortgage Calculation")} style={{background:C.greenFill,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download PDF</button>
            </div>}
          </>}
          {calc==="insurance"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
              <div><label htmlFor="calc-2" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Annual Household Income</label><input type="number" id="calc-2" min="0" step="1000" value={income} onChange={e=>setIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-3" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Number of Dependents</label><input type="number" id="calc-3" min="0" max="20" step="1" value={deps} onChange={e=>setDeps(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-4" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Outstanding Mortgage</label><input type="number" id="calc-4" min="0" step="1000" value={mortgage} onChange={e=>setMortgage(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            </div>
            <button onClick={calcInsurance} style={{width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Insurance Need</button>
            {insResult&&<div id="insurance-needs-result" style={{marginTop:24,background:`${C.accentText}08`,borderRadius:16,padding:"28px 32px"}}>
              <div style={{textAlign:"center",marginBottom:20}}><div style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Recommended Life Insurance Coverage</div><div style={{fontFamily:ff,fontSize:48,color:C.accentText,fontWeight:700,margin:"8px 0"}}>C${(insResult.total/1000).toFixed(0)}K</div></div>
              <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:16}}>
                {[{l:"Income Replacement (10x)",v:`C$${(insResult.income/1000).toFixed(0)}K`},{l:"Mortgage Payoff",v:`C$${(insResult.debt/1000).toFixed(0)}K`},{l:`Education (${deps} children)`,v:`C$${(insResult.edu/1000).toFixed(0)}K`}].map((m,i)=><div key={i} style={{textAlign:"center",background:"#fff",borderRadius:12,padding:16}}><div style={{fontFamily:ff,fontSize:22,color:C.navy,fontWeight:700}}>{m.v}</div><div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:2}}>{m.l}</div></div>)}
              </div>
              <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>exportToPDF("insurance-needs-result","Insurance Needs Analysis")} style={{background:C.accentText,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download PDF</button></div>
            </div>}
          </>}
          {calc==="retirement"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:20}}>
              <div><label htmlFor="calc-5" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Current Age</label><input type="number" id="calc-5" min="16" max="89" step="1" value={rAge} onChange={e=>setRAge(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-6" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Target Retirement Age</label><input type="number" id="calc-6" min="17" max="89" step="1" value={rRetire} onChange={e=>setRRetire(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-7" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Current Annual Income</label><input type="number" id="calc-7" min="0" step="1000" value={rIncome} onChange={e=>setRIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-8" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Current Retirement Savings</label><input type="number" id="calc-8" min="0" step="1000" value={rSaved} onChange={e=>setRSaved(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-9" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Monthly Contribution</label><input type="number" id="calc-9" min="0" step="50" value={rMonthly} onChange={e=>setRMonthly(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-10" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Expected Annual Return (%)</label><input type="number" id="calc-10" min="0" max="15" step="0.5" value={rReturn} onChange={e=>setRReturn(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            </div>
            <button onClick={calcRetirement} style={{width:"100%",background:C.purple,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Retirement Plan</button>
            {rResult&&<div id="retirement-result" style={{marginTop:24}}>
              {/* Projected Savings */}
              <div style={{background:`${C.purple}08`,borderRadius:16,padding:"28px 32px",marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:20}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Projected Savings at {rRetire}</div>
                    <div style={{fontFamily:ff,fontSize:42,color:C.purple,fontWeight:700,margin:"8px 0"}}>C${(rResult.totalAtRetire/1000).toFixed(0)}K</div>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>{rResult.years} years of growth at {rReturn}% return</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Total Retirement Need (to age 90)</div>
                    <div style={{fontFamily:ff,fontSize:42,color:C.navy,fontWeight:700,margin:"8px 0"}}>C${(rResult.totalNeed/1000).toFixed(0)}K</div>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>70% of income x {rResult.retYears} years</div>
                  </div>
                </div>
              </div>
              {/* Monthly Income Breakdown */}
              <div style={{background:"#fff",borderRadius:16,padding:"28px 32px",border:"1px solid #eee",marginBottom:16}}>
                <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Projected Monthly Retirement Income</h4>
                <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr",gap:12}}>
                  {[
                    {l:"From Savings (4% rule)",v:`C$${rResult.monthlyFromSavings.toLocaleString()}`,c:C.purple},
                    {l:"CPP + OAS (estimate)",v:`C$${rResult.monthlyGov.toLocaleString()}`,c:C.green},
                    {l:"Total Monthly Income",v:`C$${rResult.monthlyTotal.toLocaleString()}`,c:C.accent},
                    {l:"Monthly Target (70%)",v:`C$${rResult.monthlyTarget.toLocaleString()}`,c:C.navy},
                  ].map((m,i)=><div key={i} style={{textAlign:"center",background:`${m.c}06`,borderRadius:12,padding:"16px 12px"}}>
                    <div style={{fontFamily:ff,fontSize:22,color:m.c,fontWeight:700}}>{m.v}</div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:4}}>{m.l}</div>
                  </div>)}
                </div>
              </div>
              {/* Gap or Surplus */}
              <div style={{background:rResult.gap>0?`${C.red}08`:`${C.greenFill}08`,borderRadius:16,padding:"24px 32px",borderLeft:`4px solid ${rResult.gap>0?C.red:C.green}`,marginBottom:16}}>
                {rResult.gap>0?<>
                  <h4 style={{fontFamily:fs,fontSize:15,color:C.redText,margin:"0 0 8px",fontWeight:700}}>Monthly Gap: C${rResult.gap.toLocaleString()}</h4>
                  <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 12px",lineHeight:1.7}}>Based on current savings and contributions, you'll have a shortfall of C${rResult.gap.toLocaleString()}/month in retirement. Here's how to close it:</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      `Increase monthly contributions by C$${Math.round(rResult.gap*0.6)} to close the gap through savings growth`,
                      "Open or maximize your TFSA (C$7,000/year tax-free growth) at Northern Birch",
                      "Maximize RRSP contributions for tax deductions and compound growth",
                      `Consider term life insurance (C$${(rResult.insGap/1000).toFixed(0)}K) to protect your family if you pass before building sufficient savings`,
                      "Book a Financial Check-Up with our wealth team led by Heili Orav",
                    ].map((tip,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.amber,flexShrink:0,marginTop:7}}/><span style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.6}}>{tip}</span></div>)}
                  </div>
                </>:<>
                  <h4 style={{fontFamily:fs,fontSize:15,color:C.greenText,margin:"0 0 8px",fontWeight:700}}>On Track: Monthly Surplus of C${Math.abs(rResult.gap).toLocaleString()}</h4>
                  <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>Great news -- at your current pace, you'll have more than enough for retirement. Consider using the surplus for travel to Estonia and Latvia, maximizing your TFSA, or exploring estate planning strategies to pass wealth to the next generation tax-efficiently.</p>
                </>}
              </div>
              <p style={{fontFamily:fs,fontSize:11,color:"#707070",lineHeight:1.6}}>Estimates assume {rReturn}% annual return, 2% inflation, 70% income replacement target, CPP/OAS at ~C$18,000/year combined, and living to age 90. Actual results will vary. This calculator does not account for employer pensions, rental income, or other assets. Book a Financial Check-Up with our wealth team for a comprehensive retirement plan.</p>
              <div style={{textAlign:"center",marginTop:16}}><button onClick={()=>exportToPDF("retirement-result","Retirement Plan Projection")} style={{background:C.purple,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download Retirement Plan (PDF)</button></div>
            </div>}
          </>}
        </div>
      </div>
    </section>
  );
}

// ============ BOOKING PAGE ============
function BookingPage(){
  const[branch,setBranch]=useState("");const[service,setService]=useState("");const[date,setDate]=useState("");const[time,setTime]=useState("");const[submitted,setSubmitted]=useState(false);
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=branch&&service&&name.trim()&&email.trim()&&consent;
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("booking",{branch,service,date,time,name,email,phone,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setSubmitted(true);
    else setError("We could not send your request just now. Nothing has been booked. Please try again, or call us at 416-465-4659 and we will book it for you.");
  };
  if(submitted)return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}><div style={{maxWidth:600,margin:"0 auto"}}>
      <div id="booking-confirmation" style={{textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div>
        <h2 style={{fontFamily:ff,fontSize:32,color:C.navy}}>Appointment Requested</h2>
        <p style={{fontFamily:fs,fontSize:16,color:"#666",lineHeight:1.7}}>We have received your request for the {branch} branch for {service}{date?` for ${date}`:""}{time?` at ${time}`:""}. You'll receive a confirmation email shortly. If you need to reschedule, call us at 416-465-4659.</p>
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
        <Btn onClick={()=>exportToPDF("booking-confirmation","Appointment Request")} color={C.accentText}>&#128190; Download Confirmation (PDF)</Btn>
        <Btn outline onClick={()=>setSubmitted(false)}>Book Another Appointment</Btn>
      </div>
    </div></section>
  );
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <SH tag="Book an Appointment" tagColor={C.greenText} title="Meet with an advisor" desc="Schedule a meeting at any branch for personalized insurance, investment, or financial planning advice."/>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <div style={{marginBottom:20}}><label htmlFor="sel-1" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Select Branch</label><select id="sel-1" value={branch} onChange={e=>setBranch(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">Choose a branch...</option><option>Latvian Centre Branch - North York</option><option>Tartu College Branch - Bloor St</option><option>Hamilton Branch</option><option>KESKUS Branch (Coming Soon)</option></select></div>
          <div style={{marginBottom:20}}><label htmlFor="sel-2" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Service Needed</label><select id="sel-2" value={service} onChange={e=>setService(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">What do you need help with?</option><option>Insurance Quote & Advisory</option><option>Mortgage Consultation</option><option>Investment & Wealth Review</option><option>Estate Planning</option><option>Business Insurance & Benefits</option><option>International Transfers Setup</option><option>Financial Check-Up (General)</option><option>New Member Onboarding</option></select></div>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:20}}>
            <div><label htmlFor="booking-date" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Preferred Date</label><input type="date" id="booking-date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="sel-3" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Preferred Time</label><select id="sel-3" value={time} onChange={e=>setTime(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">Select time...</option>{["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div style={{marginBottom:20}}><label htmlFor="appt-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="appt-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:24}}>
            <div><label htmlFor="appt-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Email</label><input id="appt-email" autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="appt-phone" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Phone</label><input id="appt-phone" autoComplete="tel" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="416-XXX-XXXX" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          </div>
          <ConsentNotice id="booking-consent" checked={consent} onChange={setConsent} purpose="so a branch representative can contact me about this appointment"/>
          {error&&<div style={errBox}>{error}</div>}
          <button onClick={submit} disabled={sending||!canSubmit} style={{width:"100%",background:(sending||!canSubmit)?"#ccc":C.greenFill,border:"none",borderRadius:12,padding:"16px",cursor:(sending||!canSubmit)?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{sending?"Sending...":"Request Appointment"}</button>
          <p style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textAlign:"center",margin:"10px 0 0"}}>A branch representative will confirm your appointment by phone or email.</p>
        </div>
      </div>
    </section>
  );
}

// ============ RATES PAGE ============
function RatesPage({setPage}){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="Current Rates" tagColor={C.greenText} title="Competitive rates for members" desc="All rates are subject to change. Contact your branch for the most current rates and special offers."/>
        {[
          {title:"Mortgage Rates",color:C.accentText,go:["mortgages","Explore mortgages"],rates:[{term:"1-Year Fixed",rate:"5.54%"},{term:"2-Year Fixed",rate:"4.69%"},{term:"3-Year Fixed",rate:RATE.m3},{term:"4-Year Fixed",rate:"4.29%"},{term:"5-Year Fixed",rate:RATE.m5},{term:"5-Year High Ratio",rate:RATE.m5hr},{term:"Variable Rate",rate:RATE.mvar},{term:"HELOC",rate:RATE.heloc}]},
          {title:"Deposit & Savings Rates",color:C.greenText,go:["accounts","Compare accounts"],rates:[{term:"High-Interest Savings",rate:RATE.hisa},{term:"90-Day GIC",rate:"2.25%"},{term:"6-Month GIC",rate:"2.50%"},{term:"1-Year GIC",rate:RATE.gic1},{term:"2-Year GIC",rate:"2.60%"},{term:"3-Year GIC",rate:"2.55%"},{term:"4-Year GIC",rate:"2.50%"},{term:"5-Year GIC",rate:RATE.gic5}]},
          {title:"Lending Rates",color:C.amberText,go:["cards","Compare credit cards"],rates:[{term:"Personal Loan",rate:"From 7.45%"},{term:"Personal Line of Credit",rate:"From Prime + 2%"},{term:"Collabria Mastercard",rate:RATE.mc},{term:"Collabria Low Rate",rate:RATE.mcLow},{term:"Commercial Mortgage",rate:"Contact us"},{term:"Commercial LOC",rate:"Contact us"},{term:"Equipment Financing",rate:"Contact us"},{term:"CEBA Loan",rate:"0% (govt program)"}]},
        ].map((section,si)=>(
          <Fade key={si} delay={si*0.1}><div style={{marginBottom:32}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>{section.title}</h3>
            <div style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #eee"}}>
              {section.rates.map((r,ri)=><div key={ri} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 24px",borderBottom:ri<section.rates.length-1?"1px solid #f5f5f5":"none",background:ri%2===0?"#fff":"#fafafa"}}>
                <span style={{fontFamily:fs,fontSize:14,color:C.navy}}>{r.term}</span>
                <span style={{fontFamily:fs,fontSize:16,color:section.color,fontWeight:700}}>{r.rate}</span>
              </div>)}
            </div>
            <div style={{marginTop:12}}><Btn small color={section.color} outline onClick={()=>setPage(section.go[0])}>{section.go[1]} &rarr;</Btn></div>
          </div></Fade>
        ))}
        <div style={{background:`${C.accentText}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.accent}`}}>
          <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>Rates are subject to change at any time without notice. For the latest rates, please contact our branches directly at <a href="tel:+14164654659" style={{color:C.accentText,fontWeight:600}}>416-465-4659</a> or <a href="tel:+14169222551" style={{color:C.accentText,fontWeight:600}}>416-922-2551</a>. Special offers including C$3,500 cash back on mortgages and promotional GIC rates may be available -- ask your advisor.</p>
        </div>
      </div>
    </section>
  );
}

// ============ REFERRALS PAGE ============
function ReferralsPage(){
  const[submitted,setSubmitted]=useState(false);
  const[yourName,setYourName]=useState("");const[memberNo,setMemberNo]=useState("");
  const[friendName,setFriendName]=useState("");const[friendEmail,setFriendEmail]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=yourName.trim()&&friendName.trim()&&friendEmail.trim()&&consent;
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("referral",{yourName,memberNo,friendName,friendEmail,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setSubmitted(true);
    else setError("We could not send that referral. Please try again, or call us at 416-465-4659.");
  };
  return(
    <section style={{background:C.birchLight,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Member Referral Program" tagColor={C.amberText} title="Friends don't let friends go to big banks" desc="Refer a friend to Northern Birch and you both earn $50. There's no limit to the number of friends you can refer."/>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr 1fr",gap:16,marginBottom:32}}>
          {[{step:"1",title:"Refer a Friend",desc:"Share your unique referral link or tell a friend to mention your name when they join."},{step:"2",title:"They Join",desc:"Your friend opens an account and completes their first qualifying transaction."},{step:"3",title:"You Both Earn $50",desc:"$50 is deposited into both your account and your friend's account. Win-win!"}].map((s,i)=>
            <Fade key={i} delay={i*0.1}><div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee",textAlign:"center"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.amber,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:fs,fontSize:16,color:"#fff",fontWeight:800}}>{s.step}</span></div>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.title}</h4>
              <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.6}}>{s.desc}</p>
            </div></Fade>
          )}
        </div>
        {!submitted?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 20px"}}>Refer Someone Now</h3>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
            <div><label htmlFor="ref-your-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="ref-your-name" value={yourName} onChange={e=>setYourName(e.target.value)} placeholder="Your full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-member-no" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Member Number</label><input id="ref-member-no" value={memberNo} onChange={e=>setMemberNo(e.target.value)} placeholder="Member #" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-friend-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Friend's Name</label><input id="ref-friend-name" value={friendName} onChange={e=>setFriendName(e.target.value)} placeholder="Their full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-friend-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Friend's Email</label><input id="ref-friend-email" value={friendEmail} onChange={e=>setFriendEmail(e.target.value)} placeholder="their@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          </div>
          <ConsentNotice id="referral-consent" checked={consent} onChange={setConsent} purpose="so we can contact the person I am referring" extra="I confirm I have their permission to share their name and email with Northern Birch."/>
          {error&&<div style={errBox}>{error}</div>}
          <button onClick={submit} disabled={sending||!canSubmit} style={{width:"100%",background:(sending||!canSubmit)?"#ccc":C.amber,border:"none",borderRadius:12,padding:"16px",cursor:(sending||!canSubmit)?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{sending?"Sending...":"Send Referral"}</button>
        </div>:<div style={{textAlign:"center",padding:40}}><div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div><h3 style={{fontFamily:ff,fontSize:28,color:C.navy}}>Referral Sent!</h3><p style={{fontFamily:fs,fontSize:15,color:"#666"}}>Your friend will receive an invitation email. Once they join and complete a qualifying transaction, you'll both earn $50.</p><Btn onClick={()=>setSubmitted(false)}>Refer Another Friend</Btn></div>}
      </div>
    </section>
  );
}

// ============ BLOG PAGE ============
function BlogPage({setPage}){
  const posts=[
    {title:"Introducing Northern Birch Insurance Shield",go:["insurance","See insurance products"],date:"March 2026",cat:"Announcement",excerpt:"We're excited to announce comprehensive insurance services for all Northern Birch members. Life, home, auto, travel, and business insurance -- all with exclusive member rates through The Personal, CUMIS, and Manulife.",color:C.accentText},
    {title:"Why Every Homeowner Needs Mortgage Protection",go:["mortgages","Explore mortgages"],date:"March 2026",cat:"Insurance Education",excerpt:"Your home is likely your family's biggest asset. Mortgage protection insurance ensures your family keeps their home if the unexpected happens. Here's what you need to know about creditor insurance.",color:C.greenText},
    {title:"Travelling to Estonia or Latvia This Summer?",go:["travel","Travel & FX services"],date:"March 2026",cat:"Travel",excerpt:"Annual multi-trip travel insurance now available for Northern Birch members. Emergency medical up to $5M, pre-existing condition coverage for seniors, and 24/7 assistance in Estonian and Latvian.",color:C.amberText},
    {title:"Co-op Apartment Insurance: What You Need to Know",go:["insurance","See insurance products"],date:"March 2026",cat:"Insurance Education",excerpt:"Living in a co-op? Standard condo insurance won't adequately cover you. Northern Birch is one of the few institutions offering specialized co-op insurance in Ontario. Here's why it matters.",color:C.purple},
    {title:"5 Insurance Mistakes Young Professionals Make",go:["healthcheck","Take the financial check-up"],date:"February 2026",cat:"Financial Literacy",excerpt:"From skipping tenant insurance to underestimating disability risk, young professionals often overlook critical coverage. Here are the five most common mistakes and how to avoid them.",color:C.redText},
    {title:"KESKUS Branch: What to Expect",go:["contact","Find a branch"],date:"February 2026",cat:"Community",excerpt:"Our new flagship branch at the KESKUS International Estonian Centre is under construction. Here's a preview of the services, technology, and community features you'll find when we open.",color:C.birchText},
    {title:"Group Benefits: A Small Business Owner's Guide",go:["business","Business solutions"],date:"February 2026",cat:"Business",excerpt:"Offering employee benefits doesn't have to be complicated or expensive. Northern Birch now offers group health and dental plans for businesses with as few as 2 employees through Manulife.",color:C.greenText},
    {title:"Estate Planning at Every Life Stage",go:["estate","Estate planning"],date:"January 2026",cat:"Planning",excerpt:"Estate planning isn't just for retirees. From your first will to your final legacy plan, here's what you need at each life stage -- and how insurance plays a critical role.",color:C.navy},
  ];
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <SH tag="Blog & News" tagColor={C.accentText} title="Financial insights for our community" desc="Expert advice, product updates, and community news from Northern Birch Credit Union."/>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(2,1fr)",gap:20}}>
          {posts.map((p,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #eee",display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{height:6,background:p.color}}/>
            <div style={{padding:"28px 28px 24px",display:"flex",flexDirection:"column",flex:1}}>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <span style={{fontFamily:fs,fontSize:11,color:p.color,fontWeight:700,background:`${p.color}10`,padding:"3px 10px",borderRadius:6}}>{p.cat}</span>
                <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{p.date}</span>
              </div>
              <h3 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 8px",lineHeight:1.3}}>{p.title}</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 16px",lineHeight:1.7}}>{p.excerpt}</p>
              <div style={{marginTop:"auto"}}><Btn small outline color={p.color} onClick={()=>setPage(p.go[0])}>{p.go[1]} &rarr;</Btn></div>
            </div>
          </div></Fade>)}
        </div>
      </div>
    </section>
  );
}

// ============ GLOSSARY PAGE ============
function GlossaryPage(){
  const[filter,setFilter]=useState("");
  const terms=[
    {term:"Beneficiary",def:"The person or entity designated to receive the proceeds of an insurance policy or investment account upon the policyholder's death."},
    {term:"Co-op Insurance",def:"Specialized insurance coverage designed for co-operative housing structures, covering unit improvements, loss assessments, and personal property under co-op bylaws."},
    {term:"Coverage Limit",def:"The maximum amount an insurance company will pay for a covered claim. Higher limits mean more protection but typically higher premiums."},
    {term:"Creditor Insurance",def:"Life and disability insurance tied to a loan or mortgage. If the borrower dies or becomes disabled, the insurance pays off or reduces the outstanding balance."},
    {term:"Critical Illness Insurance",def:"Coverage that pays a tax-free lump sum upon diagnosis of a specified illness such as cancer, heart attack, or stroke."},
    {term:"Deductible",def:"The amount you pay out of pocket before your insurance coverage kicks in. Higher deductibles usually mean lower premiums."},
    {term:"Disability Insurance",def:"Coverage that replaces a portion of your income (typically 60-70%) if you become unable to work due to illness or injury."},
    {term:"Endorsement",def:"An addition or modification to an insurance policy that changes the terms or coverage. Also called a rider."},
    {term:"Exclusion",def:"A specific condition, hazard, or activity not covered by an insurance policy. Always read exclusions before purchasing."},
    {term:"Group Insurance",def:"Insurance coverage provided to a group of people, typically employees of a company. Usually less expensive than individual policies due to group buying power."},
    {term:"Key Person Insurance",def:"Life or disability insurance purchased by a business on a key employee or owner. The business pays premiums and receives the benefit."},
    {term:"Liability Coverage",def:"Insurance that protects you if you're legally responsible for injuries to others or damage to their property."},
    {term:"Living Benefit",def:"A feature that allows a policyholder to access a portion of their death benefit while still alive, typically due to terminal illness."},
    {term:"Premium",def:"The amount you pay for insurance coverage, usually monthly or annually. Premiums vary based on coverage type, amount, and personal risk factors."},
    {term:"Replacement Cost",def:"Coverage that pays to replace damaged property with new items of similar kind and quality, without deducting for depreciation."},
    {term:"Rider",def:"An optional add-on to an insurance policy that provides additional coverage or benefits for an extra premium."},
    {term:"Term Life Insurance",def:"Life insurance that provides coverage for a specific period (10, 20, or 30 years). If the insured dies during the term, beneficiaries receive the death benefit."},
    {term:"Underwriting",def:"The process by which an insurer evaluates risk and determines whether to offer coverage, and at what premium."},
    {term:"Waiver of Premium",def:"A rider that waives premium payments if the policyholder becomes totally disabled, keeping the policy in force without payment."},
    {term:"Whole Life Insurance",def:"Permanent life insurance that provides coverage for the insured's entire lifetime and includes a cash value component that grows over time."},
  ];
  const filtered=filter?terms.filter(t=>t.term.toLowerCase().includes(filter.toLowerCase())||t.def.toLowerCase().includes(filter.toLowerCase())):terms;
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Insurance Glossary" tagColor={C.purple} title="Insurance terms explained" desc="Understanding insurance terminology helps you make better decisions. Search or browse our glossary of common insurance terms."/>
        <div style={{marginBottom:24}}><input value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Search glossary terms" placeholder="Search terms..." style={{width:"100%",border:"1px solid #ddd",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:15,outline:"none",boxSizing:"border-box",background:"#fff"}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((t,i)=><div key={i} style={{background:"#fff",borderRadius:14,padding:"20px 24px",border:"1px solid #eee"}}>
            <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{t.term}</h4>
            <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>{t.def}</p>
          </div>)}
        </div>
      </div>
    </section>
  );
}

// ============ MOBILE APP PAGE ============
function MobileAppPage({setPage}){
  return(
    <section style={{background:C.dark,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH dark tag="Mobile Banking" tagColor={C.accentOnDark} title="Northern Birch in your pocket" desc="Download the Northern Birch mobile app for full-service banking, insurance management, international transfers, and more -- 24/7 from anywhere."/>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:32}}>
          <div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {title:"Full Account Management",desc:"View balances, transaction history, transfer between accounts, and pay bills."},
                {title:"Deposit Cheques",desc:"Snap a photo of your cheque and deposit it instantly from your phone."},
                {title:"Insurance Dashboard",desc:"View all policies, coverage details, and file claims directly from the app."},
                {title:"Insurance Quotes",desc:"Get home, auto, tenant, or travel insurance quotes in under 2 minutes."},
                {title:"International Transfers",desc:"Send money to Estonia, Latvia, or worldwide with real-time tracking."},
                {title:"Interac e-Transfer",desc:"Send and receive money instantly to any Canadian bank account."},
                {title:"Branch & ATM Locator",desc:"Find your nearest branch or surcharge-free ATM using GPS."},
                {title:"Biometric Login",desc:"Sign in securely with Face ID, Touch ID, or fingerprint."},
                {title:"Real-Time Notifications",desc:"Get alerts for transactions, payments, transfers, and insurance renewals."},
                {title:"Apple Pay & Google Pay",desc:"Add your Northern Birch debit and credit cards to your mobile wallet."},
              ].map((f,i)=><div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.accentText}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontFamily:fs,fontSize:11,color:C.accentOnDark,fontWeight:800}}>{String(i+1).padStart(2,"0")}</span></div>
                <div><h4 style={{fontFamily:fs,fontSize:14,color:"#fff",margin:"0 0 4px",fontWeight:700}}>{f.title}</h4><p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>{f.desc}</p></div>
              </div>)}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:24}}>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:32,padding:"48px 40px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{width:80,height:80,borderRadius:20,background:`linear-gradient(135deg,${C.birch},${C.accent})`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:28,fontWeight:800,color:"#fff"}}>NB</span></div>
              <h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Northern Birch App</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:"0 0 24px",lineHeight:1.6}}>Available for iOS and Android. Free to download with your Northern Birch membership.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:16}}>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 20px"}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>App Store</span></div>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 20px"}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Google Play</span></div>
              </div>
              <p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.55)",margin:"0 0 20px",lineHeight:1.6}}>Search &ldquo;Northern Birch Credit Union&rdquo; in the App Store or Google Play, or ask us to walk you through setup.</p>
              <Btn color={C.accentText} onClick={()=>setPage("booking")}>Book a setup appointment &rarr;</Btn>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,padding:"20px 24px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
              <p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",margin:0}}>Need help? 24/7 online banking support: <a href="tel:+18669922490" style={{color:C.accentOnDark,fontWeight:600}}>1-866-992-2490</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ REUSE EXISTING PAGES (condensed) ============
// One insurance product row. This used to be an inline map callback that
// called useState per item, so the number of hooks changed with the length of
// the list — the rule React actually cares about, not a style preference.
function InsuranceProductRow({p,color,setPage}){
  const[open,setOpen]=useState(false);
  return(
              <Clickable onClick={()=>setOpen(!open)} style={{background:"#fff",borderRadius:20,padding:"28px 32px",border:open?`2px solid ${color}25`:"1px solid #eee",cursor:"pointer",transition:"all 0.3s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><h4 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{p.t}</h4><p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",margin:0,lineHeight:1.6}}>{p.d}</p></div>
                  <span style={{color:open?color:"#707070",fontSize:18,fontWeight:600,transform:open?"rotate(45deg)":"none",transition:"transform 0.3s",marginLeft:12}}>+</span>
                </div>
                {open&&<div style={{marginTop:16,paddingTop:16,borderTop:"1px solid #f0f0f0",display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8}}>
                  {p.f.map((feat,fi)=><div key={fi} style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:16,height:16,borderRadius:4,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:color,fontWeight:700}}>{"\u2713"}</span></div><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{feat}</span></div>)}
                  <div style={{gridColumn:"1/-1",marginTop:8,display:"flex",gap:8}}><Btn small color={color} onClick={e=>{e.stopPropagation();setPage("quote")}}>Get a Quote</Btn><Btn small outline color={color} onClick={e=>{e.stopPropagation();setPage("compare")}}>Compare Plans</Btn></div>
                </div>}
              </Clickable>
            );
}

function InsurancePage({setPage}){
  const cats=[
    {name:"Life & Health",color:C.accentText,products:[
      {t:"Term Life Insurance",d:"Flexible 10/20/30-year coverage from $100K to $2M. Competitive credit union rates through CUMIS.",f:["Guaranteed level premiums","Convertible to permanent","Spousal and child riders","No exam up to $500K"]},
      {t:"Critical Illness",d:"Tax-free lump sum for 25+ conditions. Use however you choose.",f:["25+ covered conditions","Return of premium option","Partial early-stage payout","Coverage up to $500K"]},
      {t:"Disability Insurance",d:"Replace up to 70% of income. Short and long-term options.",f:["Own-occupation available","Choice of waiting periods","Cost-of-living rider","Covers illness and injury"]},
      {t:"Mortgage Protection",d:"Life and disability tied to your mortgage balance. Easy application.",f:["Apply at mortgage signing","No medical exam","Life, disability, CI options","Joint borrower coverage"]},
    ]},
    {name:"Home & Auto",color:C.greenText,products:[
      {t:"Home Insurance",d:"Exclusive group rates through The Personal. 98% renewal rate.",f:["Exclusive member rates","Replacement cost","Liability up to $2M","Bundle discounts up to 20%"]},
      {t:"Co-op Insurance",d:"Specialized co-op coverage only Northern Birch can provide.",f:["Unit improvement coverage","Loss assessment protection","Co-op bylaw specific","Expert underwriting"]},
      {t:"Auto Insurance",d:"Full Ontario coverage with Ajusto telematics discounts.",f:["Ajusto safe-driving savings","Multi-vehicle discounts","Accident forgiveness","24/7 claims"]},
      {t:"Tenant Insurance",d:"From $25/month. Quote in 2 minutes on the app.",f:["Personal property coverage","Liability up to $2M","Additional living expenses","Quick mobile quoting"]},
    ]},
    {name:"Travel & Specialty",color:C.amberText,products:[
      {t:"Annual Multi-Trip Travel",d:"Emergency medical up to $5M. Perfect for Baltic travellers.",f:["Up to $5M medical","24/7 multilingual assistance","Pre-existing condition options","Group cultural event rates"]},
      {t:"Single-Trip Travel",d:"Flexible coverage for individual trips up to 365 days.",f:["Customizable coverage","Medical evacuation","Cancel for any reason upgrade","Last-minute purchase OK"]},
      {t:"Pet Insurance",d:"Bronze, Silver, Gold plans. 80% reimbursement.",f:["Three plan tiers","No breed restrictions","One annual deductible","Direct vet payment"]},
      {t:"Recreational Vehicle",d:"Boats, ATVs, snowmobiles, motorcycles, campers.",f:["All vehicle types","Seasonal payments","Agreed value coverage","Multi-policy discounts"]},
    ]},
  ];
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SH tag="Insurance Protection" tagColor={C.accentText} title="Protection for every stage of your life" desc="Exclusive member rates through The Personal, CUMIS, and Co-operators. Click any product to learn more."/>
        {cats.map((cat,ci)=><Fade key={ci} delay={ci*0.08}><div style={{marginBottom:40}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${cat.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:cat.color,fontSize:18,fontWeight:800}}>{ci+1}</span></div>
            <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:0}}>{cat.name}</h3>
          </div>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(2,1fr)",gap:16}}>
            {cat.products.map((p,pi)=><InsuranceProductRow key={pi} p={p} color={cat.color} setPage={setPage}/>)}
          </div>
        </div></Fade>)}
        <Fade><div style={{background:`linear-gradient(135deg,${C.navy},#2a4a6a)`,borderRadius:24,padding:typeof window!=="undefined"&&window.innerWidth<=768?"28px 24px":"44px 52px",display:"flex",flexDirection:typeof window!=="undefined"&&window.innerWidth<=768?"column":"row",justifyContent:"space-between",alignItems:"center",gap:typeof window!=="undefined"&&window.innerWidth<=768?24:40}}>
          <div style={{flex:1}}><div style={{fontFamily:fs,fontSize:11,color:C.birchText,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Powered by The Personal (Desjardins) + CUMIS (Co-operators) + Manulife</div><h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Exclusive rates for Northern Birch members</h3><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.7}}>650+ organization partnerships. 380+ credit union partnerships. 98% policy renewal rate. Best-in-class partners for every insurance line.</p></div>
          <Btn onClick={()=>setPage("quote")}>Get Your Quote</Btn>
        </div></Fade>
        <div style={{marginTop:48}}><h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 24px"}}>Insurance FAQ</h3>
          <FAQ items={[{q:"How do I get a quote?",a:"Use our online quote calculator for instant estimates, get a quote through the mobile app, or visit any branch. Start online, finish in branch -- your quote follows you."},{q:"Do I need to be a member?",a:"Yes, our insurance is exclusive to Northern Birch members. Join online or at any branch -- membership is open to all Canadians."},{q:"What makes our rates different?",a:"As a member, you get exclusive group rates through The Personal that aren't available to the general public, plus credit union-specific rates through CUMIS."},{q:"How do I file a claim?",a:"Visit our Claims Centre page, call The Personal at 1-888-476-8737 (home/auto/travel), CUMIS at 1-800-263-9120 (life/creditor), or visit your branch."}]}/>
        </div>
      </div>
    </section>
  );
}

// ============ SIMPLIFIED OTHER PAGES (keep routing) ============
function TravelPage({setPage}){return <section style={{background:C.navy,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH dark tag="Connected to Your Heritage" tagColor={C.birch} title="Travel, transfers & foreign exchange" desc="Baltic travel insurance, international money transfers, and competitive FX -- built for our community."/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr 1fr",gap:16}}>{[{t:"Travel Insurance",d:"Annual multi-trip coverage. Emergency medical up to $5M. 24/7 assistance in Estonian & Latvian. Pre-existing condition coverage for seniors.",c:C.amber,bc:C.amberFill,go:["quote","Get a travel quote"]},{t:"International Transfers",d:"Send money to Estonia & Latvia from the app. Competitive EUR rates, real-time tracking, recurring transfers, transparent fees.",c:C.accent,bc:C.accentText,go:["mobileapp","See the mobile app"]},{t:"Foreign Exchange",d:"Competitive EUR/CAD rates. Cash and draft services. Transparent pricing with no hidden markups. In-branch assistance available.",c:C.green,bc:C.greenFill,go:["contact","Find a branch"]}].map((s,i)=><Fade key={i} delay={i*0.1}><div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:24,padding:36,height:"100%",display:"flex",flexDirection:"column"}}><div style={{width:40,height:40,borderRadius:12,background:`${s.c}20`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><span style={{color:s.c,fontSize:16,fontWeight:800}}>{i+1}</span></div><h3 style={{fontFamily:ff,fontSize:22,color:"#fff",margin:"0 0 10px"}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.75,margin:"0 0 20px"}}>{s.d}</p><div style={{marginTop:"auto"}}><Btn small color={s.bc} onClick={()=>setPage(s.go[0])}>{s.go[1]} &rarr;</Btn></div></div></Fade>)}</div></div></section>}
function BusinessPage({setPage}){return <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH tag="Business Solutions" tagColor={C.greenText} title="Everything your business needs" desc="Group benefits, commercial insurance, key person coverage, payroll, and succession planning."/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(2,1fr)":"repeat(3,1fr)",gap:16}}>{[{t:"Group Health & Dental",d:"Plans for 2-50 employees via Manulife. Health, dental, vision, disability.",c:C.greenText,go:["insurance","See coverage"]},{t:"Commercial Insurance",d:"Property, liability, and business interruption via Co-operators.",c:C.accentText,go:["insurance","See coverage"]},{t:"Key Person Insurance",d:"Protect your business if a critical person can't work.",c:C.amberText,go:["quote","Get a quote"]},{t:"Succession Planning",d:"Funded buy-sell agreements and ownership transitions.",c:C.purple,go:["estate","Estate & succession"]},{t:"Payroll & HR",d:"Integrated payroll connected to your NBCU business account.",c:C.navy,go:["accounts","Compare accounts"]},{t:"Commercial Lending",d:"Mortgages, loans, lines of credit with personalized underwriting.",c:C.redText,go:["rates","See current rates"]}].map((s,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee",borderTop:`3px solid ${s.c}`,height:"100%",display:"flex",flexDirection:"column"}}><h3 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:13,color:"#666",margin:"0 0 16px",lineHeight:1.7}}>{s.d}</p><div style={{marginTop:"auto"}}><Btn small outline color={s.c} onClick={()=>setPage(s.go[0])}>{s.go[1]} &rarr;</Btn></div></div></Fade>)}</div><div style={{textAlign:"center",marginTop:32}}><Btn color={C.greenFill} onClick={()=>setPage("booking")}>Book a business advisor &rarr;</Btn></div></div></section>}
function DigitalPage({setPage}){return <section style={{background:C.dark,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH dark tag="Digital Banking" tagColor={C.accentOnDark} title="Heritage values. Digital convenience." desc="Insurance dashboard, smart quotes, financial planning, mobile banking, and more -- every tool below is live. Select one to open it."/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(2,1fr)":"repeat(4,1fr)",gap:16}}>{[["Insurance Dashboard","dashboard"],["Smart Quote Engine","quote"],["Financial Planning","calculators"],["Life Event Intelligence","lifesim"],["International Transfers","travel"],["Mobile Banking","mobileapp"],["Estate Planning Portal","estate"],["Business Hub","business"]].map(([f,route],i)=><Fade key={i} delay={i*0.04}><Clickable onClick={()=>setPage(route)} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,padding:24,borderTop:`2px solid ${[C.accentOnDark,C.greenOnDark,C.amberOnDark,C.purpleOnDark][i%4]}30`,cursor:"pointer",height:"100%"}}><span style={{fontFamily:fs,fontSize:11,color:[C.accentOnDark,C.greenOnDark,C.amberOnDark,C.purpleOnDark][i%4],fontWeight:700}}>{String(i+1).padStart(2,"0")}</span><h3 style={{fontFamily:fs,fontSize:15,color:"#fff",margin:"8px 0",fontWeight:700}}>{f}</h3><span style={{fontFamily:fs,fontSize:12,color:C.accentOnDark,fontWeight:600}}>Open &rarr;</span></Clickable></Fade>)}</div></div></section>}
function EstatePage(){const[s,setS]=useState(0);const stages=["Young Family","Mid-Career","Pre-Retirement","Senior"];return <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}><div style={{maxWidth:1000,margin:"0 auto"}}><SH tag="Estate Planning" tagColor={C.purple} title="Protect your family across generations"/><div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>{stages.map((st,i)=><button key={i} onClick={()=>setS(i)} style={{flex:1,background:s===i?C.purple:"#fff",border:s===i?"none":"1px solid #ddd",borderRadius:12,padding:14,cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:s===i?"#fff":C.navy}}>{st}</button>)}</div><div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}><h3 style={{fontFamily:ff,fontSize:24,color:C.navy}}>Planning for: {stages[s]}</h3><p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.8}}>Northern Birch advisors combine insurance, investments, and professional referrals to build comprehensive estate plans. Contact Heili Orav, Manager of Wealth & Estate Services, to get started.</p></div></div></section>}
function CommunityPage({setPage}){return <section style={{background:C.birchLight,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH tag="Our Community" tagColor={C.amberText} title="70 years of trust"/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:24}}><Fade><div style={{background:"#fff",borderRadius:24,padding:40,height:"100%",display:"flex",flexDirection:"column"}}><h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>Our Heritage</h3><p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.8,margin:"0 0 20px"}}>Founded through the merger of the Estonian and Latvian Credit Unions in 2020, Northern Birch carries forward 70+ years of serving our community. We invest $50,000+ annually in scholarships, cultural sponsorships, and heritage programs.</p><div style={{marginTop:"auto"}}><Btn small outline color={C.accentText} onClick={()=>setPage("leadership")}>Meet our board &amp; leadership &rarr;</Btn></div></div></Fade><Fade delay={0.1}><div style={{background:"#fff",borderRadius:24,padding:40,height:"100%",display:"flex",flexDirection:"column"}}><h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>KESKUS Flagship</h3><p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.8,margin:"0 0 20px"}}>Our new branch at the KESKUS International Estonian Centre in downtown Toronto -- full-service banking and insurance advisory, digital kiosks, community event space, and multilingual staff.</p><div style={{marginTop:"auto"}}><Btn small outline color={C.greenText} onClick={()=>setPage("contact")}>Branch hours &amp; locations &rarr;</Btn></div></div></Fade></div><div style={{textAlign:"center",marginTop:32}}><Btn color={C.amberFill} onClick={()=>setPage("referrals")}>Refer a friend, you both earn $50 &rarr;</Btn></div></div></section>}
function PersonalPage({setPage}){return <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH tag="Personal Banking" tagColor={C.greenText} title="Banking designed around you"/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(2,1fr)":"repeat(3,1fr)",gap:16}}>{[{t:"Daily Banking",c:C.greenFill,go:["accounts","Compare chequing & savings"],items:["No-fee chequing","High-interest savings","Trust accounts","Student banking","e-Transfer","Debit card","Mobile app","Online banking"]},{t:"Borrowing",c:C.accentText,go:["mortgages","Explore mortgages"],items:["Fixed/variable mortgages","Co-op mortgages","HELOCs","Personal loans","Credit lines","Mastercard credit cards","Student loans","Pre-approval"]},{t:"Investing",c:C.amberFill,go:["accounts","See GICs & registered plans"],items:["GICs & term deposits","TFSA","RRSP","FHSA","RESP","RDSP","Mutual funds","Qtrade trading","VirtualWealth"]}].map((cat,i)=><Fade key={i} delay={i*0.08}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #eee"}}><div style={{background:cat.c,padding:"20px 28px"}}><h3 style={{fontFamily:ff,fontSize:22,color:"#fff",margin:0}}>{cat.t}</h3></div><div style={{padding:"12px 28px"}}>{cat.items.map((item,ii)=><div key={ii} style={{padding:"8px 0",borderBottom:ii<cat.items.length-1?"1px solid #f5f5f5":"none",display:"flex",gap:8,alignItems:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:cat.c}}/><span style={{fontFamily:fs,fontSize:14,color:"#555"}}>{item}</span></div>)}</div><div style={{padding:"4px 28px 24px"}}>
                <Btn small color={cat.c} onClick={()=>setPage(cat.go[0])}>{cat.go[1]} &rarr;</Btn>
              </div></div></Fade>)}</div></div></section>}
function ContactPage(){return <section style={{background:C.navy,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH dark tag="Contact Us" tagColor={C.birch} title="We're here for you"/><div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(2,1fr)",gap:24}}>{[{n:"Latvian Centre (HQ)",a:"4 Credit Union Dr, North York",h:"M-W 10-3, Th 10-7, F 10-3, Sa 9-1",p:"416-465-4659"},{n:"Tartu College",a:"310 Bloor St W, Toronto",h:"M-F 10-3 (Cashless)",p:"416-922-2551"},{n:"Hamilton",a:"16 Queen St N",h:"Tu-F 10-3, Th 10-7",p:"905-527-4344"},{n:"KESKUS",a:"Madison Ave, Toronto",h:"Coming Soon",p:"TBD"}].map((b,i)=><Fade key={i} delay={i*0.08}><div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:28}}><h3 style={{fontFamily:fs,fontSize:18,color:"#fff",margin:"0 0 4px",fontWeight:700}}>{b.n}</h3><p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",margin:"0 0 2px"}}>{b.a}</p><p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",margin:"0 0 8px"}}>{b.h}</p><p style={{fontFamily:fs,fontSize:15,color:C.accentOnDark,fontWeight:600,margin:0}}>{b.p==="TBD"?b.p:<a href={`tel:${b.p.replace(/[^0-9+]/g,"")}`} style={{color:C.accentOnDark}}>{b.p}</a>}</p></div></Fade>)}</div><Fade delay={0.3}><div style={{marginTop:24,background:"rgba(255,255,255,0.03)",borderRadius:20,padding:"24px 32px"}}><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:0}}>Toll-Free: <a href="tel:18668443828" style={{color:C.accentOnDark}}>1-866-844-3828</a> | 24/7 Support: <a href="tel:18669922490" style={{color:C.accentOnDark}}>1-866-992-2490</a> | Financial Check-Up: <a href="mailto:FinancialCheckup@northernbirchcu.com" style={{color:C.accentOnDark}}>FinancialCheckup@northernbirchcu.com</a></p></div></Fade></div></section>}

// ============ HOME PAGE ============
// ============ MORTGAGES ============
function MortgagesPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const posted=[{term:"3-Year Closed Fixed",rate:RATE.m3},{term:"5-Year Closed Fixed",rate:RATE.m5},{term:"5-Year High Ratio (insured, 5% down)",rate:RATE.m5hr},{term:"Variable Rate",rate:RATE.mvar},{term:"HELOC",rate:RATE.heloc}];
  const options=[
    {t:"Fixed-Rate Closed",d:"Your rate and payment stay the same for the whole term. The simplest way to budget.",c:C.green},
    {t:"Variable-Rate",d:"Priced off prime. Your payment moves with rates, and you can convert to fixed at any time.",c:C.accent},
    {t:"High-Ratio Insured",d:"Buy with as little as 5% down. We arrange default insurance through CMHC or Sagen.",c:C.amber},
    {t:"Co-op Apartment",d:"Financing for Toronto housing co-ops -- a niche most lenders decline, and one we have served for decades.",c:C.purple},
    {t:"HELOC",d:"Revolving credit secured by your home, for renovations, tuition, or consolidating higher-rate debt.",c:C.navy},
    {t:"Renewals & Switches",d:"Bring your mortgage from another lender at renewal. We cover standard transfer costs.",c:C.red},
  ];
  const steps=[{n:"01",t:"Get pre-approved",d:"A short conversation gives you a budget and a rate hold while you shop."},{n:"02",t:"Find your home",d:"Your advisor is reachable directly, not through a call centre."},{n:"03",t:"Close with us",d:"We coordinate with your lawyer and fund on your closing date."}];
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Mortgages")} tagColor={C.greenText} title={T("A mortgage from people you can meet")} desc={T("Fixed, variable, and high-ratio mortgages -- plus co-op apartment financing most lenders will not touch. Decisions are made in Toronto, by the same advisor who takes your call.")}/>
      <Fade><div style={{background:"#fff",borderRadius:20,padding:w<=768?24:32,border:"1px solid #eee",marginBottom:32}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:20}}>
          <span style={{fontFamily:ff,fontSize:44,color:C.greenText,fontWeight:700}}>{RATE.m5}</span>
          <span style={{fontFamily:fs,fontSize:13,color:"#6B6B6B"}}>{T("5-year closed fixed")}</span>
        </div>
        {posted.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:i<posted.length-1?"1px solid #f5f5f5":"none"}}>
          <span style={{fontFamily:fs,fontSize:14,color:C.navy}}>{r.term}</span>
          <span style={{fontFamily:fs,fontSize:16,color:C.greenText,fontWeight:700}}>{r.rate}</span>
        </div>)}
        <div style={{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}}>
          <Btn color={C.greenFill} onClick={()=>setPage("booking")}>{T("Get Pre-Approved")}</Btn>
          <Btn outline color={C.navy} onClick={()=>setPage("calculators")}>{T("Payment Calculator")}</Btn>
        </div>
      </div></Fade>
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("Choose the structure that fits")}</h3>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(3,1fr)","repeat(2,1fr)","1fr"),gap:16,marginBottom:40}}>
        {options.map((o,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,padding:26,border:"1px solid #eee",borderTop:`3px solid ${o.c}`,height:"100%"}}>
          <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{o.t}</h4>
          <p style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.7,margin:0}}>{o.d}</p>
        </div></Fade>)}
      </div>
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("How it works")}</h3>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(3,1fr)","repeat(2,1fr)","1fr"),gap:16,marginBottom:32}}>
        {steps.map((st,i)=><Fade key={i} delay={i*0.08}><div style={{background:"#fff",borderRadius:20,padding:26,border:"1px solid #eee",height:"100%"}}>
          <span style={{fontFamily:fs,fontSize:12,color:C.greenText,fontWeight:700}}>{st.n}</span>
          <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"6px 0 8px",fontWeight:700}}>{st.t}</h4>
          <p style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.7,margin:0}}>{st.d}</p>
        </div></Fade>)}
      </div>
      <div style={{background:`${C.greenFill}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.green}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Rates are subject to change without notice and are subject to credit approval. Special offers including C$3,500 cash back on mortgages may be available -- ask your advisor. Call 416-465-4659 for today's rate.")}</p>
      </div>
    </div>
  </section>;
}

// ============ CREDIT CARDS ============
function CardsPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const cards=[
    {n:"Cash Back Mastercard",tag:"Everyday spending",rate:RATE.mc,fee:"$0 annual fee",c:C.greenFill,perks:["2% back on groceries and gas","1% back on everything else","No cap on annual earnings","Purchase protection and extended warranty"]},
    {n:"Low Rate Mastercard",tag:"Carrying a balance",rate:RATE.mcLow,fee:"$29 annual fee",c:C.accentText,perks:["The lowest purchase APR we offer","Balance transfers accepted","Ideal for consolidating higher-rate debt","21-day interest-free grace period"]},
    {n:"Travel Rewards Mastercard",tag:"Members who fly home",rate:RATE.mc,fee:"$99 annual fee",c:C.purple,perks:["1.5 points per dollar, no blackout dates","Included travel medical coverage","Built for Baltic and European travel","Airport lounge access twice a year"]},
  ];
  const shared=[{t:"Instant card controls",d:"Lock, unlock, and set spend limits from the mobile app."},{t:"Zero liability",d:"You are not responsible for unauthorized transactions."},{t:"Tap and mobile wallet",d:"Apple Pay, Google Pay, and Interac Flash."},{t:"Member pricing",d:"Issued through Collabria, priced for credit union members."}];
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Credit Cards")} tagColor={C.purple} title={T("Three cards. One straightforward choice.")} desc={T("Collabria Mastercard cards issued for Northern Birch members -- cash back for everyday spending, a low rate if you carry a balance, and travel rewards if you do not.")}/>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(3,1fr)","repeat(2,1fr)","1fr"),gap:16,marginBottom:24}}>
        {cards.map((cd,i)=><Fade key={i} delay={i*0.08}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #eee",height:"100%",display:"flex",flexDirection:"column"}}>
          <div style={{background:cd.c,padding:"18px 26px"}}>
            <span style={{fontFamily:fs,fontSize:10.5,color:"rgba(255,255,255,0.95)",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700}}>{cd.tag}</span>
            <h3 style={{fontFamily:ff,fontSize:21,color:"#fff",margin:"4px 0 0"}}>{cd.n}</h3>
          </div>
          <div style={{padding:26,display:"flex",flexDirection:"column",flex:1}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontFamily:ff,fontSize:30,color:C.navy,fontWeight:700}}>{cd.rate}</span>
              <span style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>{T("purchase APR")}</span>
            </div>
            <div style={{fontFamily:fs,fontSize:13,color:"#666",margin:"4px 0 18px"}}>{cd.fee}</div>
            <div style={{flex:1,marginBottom:18}}>
              {cd.perks.map((pk,pi)=><div key={pi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:cd.c,marginTop:6,flexShrink:0}}/>
                <span style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.5}}>{pk}</span>
              </div>)}
            </div>
            <Btn color={cd.c} onClick={()=>setPage("booking")}>{T("Apply for this card")}</Btn>
          </div>
        </div></Fade>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(4,1fr)","repeat(2,1fr)","1fr"),gap:12,marginBottom:24}}>
        {shared.map((sh,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:16,padding:22,border:"1px solid #eee",height:"100%"}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{sh.t}</h4>
          <p style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.65,margin:0}}>{sh.d}</p>
        </div></Fade>)}
      </div>
      <div style={{background:`${C.purple}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.purple}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Rates are subject to change and to credit approval. Cash advance and balance transfer rates differ from the purchase APR shown. Cards are issued by Collabria Financial Services. Mastercard is a registered trademark of Mastercard International Incorporated.")}</p>
      </div>
    </div>
  </section>;
}

// ============ CHEQUING, SAVINGS & REGISTERED ============
function AccountsPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const chequing=[
    {n:"Everyday Chequing",h:RATE.chq,hl:"monthly fee",c:C.accent,tc:C.accentText,items:["Unlimited debits and e-Transfers","Free personalized cheques","THE EXCHANGE surcharge-free ATMs","No minimum balance"]},
    {n:"Senior & Student Chequing",h:RATE.chq,hl:"monthly fee",c:C.accent,tc:C.accentText,items:["Everything in Everyday Chequing","Free drafts and money orders","Paper statements at no charge","Built for fixed and part-time incomes"]},
    {n:"US Dollar Chequing",h:"$3",hl:"monthly fee",c:C.accent,tc:C.accentText,items:["Hold and spend USD without conversion","USD cheques and drafts","Waived with $1,000 minimum balance","For cross-border property and tuition"]},
  ];
  const savings=[
    {n:"High-Interest Savings",h:RATE.hisa,hl:"annual interest",c:C.amber,tc:C.amberText,items:["Interest calculated daily, paid monthly","No minimum balance, no monthly fee","Unlimited transfers to your chequing","FSRA deposit protection"]},
    {n:"Guaranteed Investment Certificates",h:RATE.gic1,hl:"1-year term",c:C.amber,tc:C.amberText,items:["Terms from 90 days to 5 years","Registered and non-registered options","Principal fully guaranteed","Redeemable options available"]},
    {n:"Trust & Estate Accounts",h:"",hl:"",c:C.amber,tc:C.amberText,items:["In-trust-for and estate accounts","Multi-signatory arrangements","Supported by our estate advisors","Common for family and community groups"]},
  ];
  const registered=[
    {n:"TFSA",f:"Tax-Free Savings Account",d:"Tax-free growth on savings, GICs, or investments. Withdraw any time; room is restored the following year."},
    {n:"RRSP",f:"Registered Retirement Savings Plan",d:"Deduct contributions from taxable income today and defer tax until retirement. Home Buyers' Plan eligible."},
    {n:"FHSA",f:"First Home Savings Account",d:"Deductible going in, tax-free coming out for a first home. Up to $8,000 a year, $40,000 lifetime."},
    {n:"RESP",f:"Registered Education Savings Plan",d:"Government grants of up to 20% on the first $2,500 contributed each year per child."},
    {n:"RDSP",f:"Registered Disability Savings Plan",d:"Government grants and bonds for long-term savings for a person with a disability."},
    {n:"RRIF",f:"Registered Retirement Income Fund",d:"Converts your RRSP into scheduled retirement income while the balance keeps growing tax-deferred."},
  ];
  const grid=(list)=><div style={{display:"grid",gridTemplateColumns:g(w,"repeat(3,1fr)","repeat(2,1fr)","1fr"),gap:16,marginBottom:32}}>
    {list.map((a,i)=><Fade key={i} delay={i*0.06}><div style={{background:"#fff",borderRadius:20,padding:26,border:"1px solid #eee",borderTop:`3px solid ${a.c}`,height:"100%"}}>
      <h4 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 12px"}}>{a.n}</h4>
      {a.h&&<div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:16}}>
        <span style={{fontFamily:ff,fontSize:28,color:a.tc||a.c,fontWeight:700}}>{a.h}</span>
        <span style={{fontFamily:fs,fontSize:12,color:"#707070"}}>{a.hl}</span>
      </div>}
      {a.items.map((x,xi)=><div key={xi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:a.c,marginTop:6,flexShrink:0}}/>
        <span style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.5}}>{x}</span>
      </div>)}
    </div></Fade>)}
  </div>;
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Chequing, Savings & Registered")} tagColor={C.accentText} title={T("Compare accounts side by side")} desc={T("No-fee everyday chequing, high-interest savings, GIC terms from 90 days to 5 years, and every registered plan a Canadian household needs.")}/>
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("Chequing")}</h3>
      {grid(chequing)}
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("Savings & GICs")}</h3>
      {grid(savings)}
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 6px"}}>{T("Registered accounts")}</h3>
      <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 16px"}}>{T("Each plan can hold savings, a GIC, or an investment portfolio -- the wrapper is the tax treatment, not the product.")}</p>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(3,1fr)","repeat(2,1fr)","1fr"),gap:16,marginBottom:32}}>
        {registered.map((r,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #eee",height:"100%"}}>
          <span style={{display:"inline-block",padding:"4px 10px",borderRadius:8,background:`${C.navy}0F`,fontFamily:fs,fontSize:12,fontWeight:700,color:C.navy,marginBottom:10}}>{r.n}</span>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{r.f}</h4>
          <p style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.7,margin:0}}>{r.d}</p>
        </div></Fade>)}
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
        <Btn color={C.accentText} onClick={()=>setPage("booking")}>{T("Open an Account")}</Btn>
        <Btn outline color={C.navy} onClick={()=>setPage("rates")}>{T("See All Rates")}</Btn>
      </div>
      <div style={{background:`${C.accentText}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.accent}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Rates are subject to change without notice. Eligible deposits are insured by FSRA; registered account deposits have unlimited coverage. Contact your branch for current rates and account terms.")}</p>
      </div>
    </div>
  </section>;
}

// ============ BANKING PRODUCTS (homepage) ============
function BankingProducts({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  return <section style={{background:C.birchLight,padding:w<=768?"56px 16px":"80px 24px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Banking Products")} tagColor={C.greenText} title={T("Everyday banking, start to finish")} desc={T("Northern Birch is a full-service credit union. Open a chequing account, finance a home, carry a card, save in a GIC or TFSA, and invest -- all in one membership.")}/>
      <div style={{display:"grid",gridTemplateColumns:g(w,"repeat(5,1fr)","repeat(2,1fr)","1fr"),gap:12}}>
        {BANKING.map((b,i)=><Fade key={b.k} delay={i*0.06}>
          <Clickable onClick={()=>setPage(b.p)} style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #EDE7D8",borderTop:`3px solid ${b.c}`,cursor:"pointer",height:"100%",display:"flex",flexDirection:"column"}}>
            <h3 style={{fontFamily:ff,fontSize:21,color:C.navy,margin:"0 0 8px"}}>{T(b.t)}</h3>
            <p style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.65,margin:"0 0 16px"}}>{b.d}</p>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:16}}>
              <span style={{fontFamily:ff,fontSize:28,color:b.tc||b.c,fontWeight:700}}>{b.rate}</span>
              <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{b.rl}</span>
            </div>
            <div style={{flex:1,marginBottom:18}}>
              {b.b.map((x,xi)=><div key={xi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:b.c,marginTop:6,flexShrink:0}}/>
                <span style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.5}}>{x}</span>
              </div>)}
            </div>
            <span style={{fontFamily:fs,fontSize:13,color:C.accentText,fontWeight:700}}>{T(b.cta)} &rarr;</span>
          </Clickable>
        </Fade>)}
      </div>
      <Fade delay={0.35}><div style={{display:"flex",gap:12,marginTop:28,flexWrap:"wrap"}}>
        <Btn color={C.navy} onClick={()=>setPage("rates")}>{T("See All Rates")}</Btn>
        <Btn outline color={C.navy} onClick={()=>setPage("booking")}>{T("Book an Appointment")}</Btn>
      </div></Fade>
    </div>
  </section>;
}

function HomePage({setPage,lang}){
  const T=(k)=>t(k,lang);
  return <>
    <section style={{minHeight:"100vh",background:`linear-gradient(170deg,${C.dark} 0%,${C.navy} 45%,#1e4060 100%)`,position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 75% 25%,rgba(200,184,138,0.07) 0%,transparent 55%)"}}/>
      <BirchTrees side="right" opacity={0.05}/>
      <BirchTrees side="left" opacity={0.03}/>
      {/* Cornflowers floating */}
      <Cornflower size={20} color="rgba(46,134,193,0.12)" style={{position:"absolute",top:"18%",right:"22%"}}/>
      <Cornflower size={14} color="rgba(46,134,193,0.08)" style={{position:"absolute",top:"45%",right:"12%"}}/>
      <Daisy size={16} color="rgba(255,255,255,0.06)" center="rgba(212,165,71,0.15)" style={{position:"absolute",top:"65%",right:"28%"}}/>
      <Cornflower size={12} color="rgba(46,134,193,0.06)" style={{position:"absolute",top:"75%",left:"8%"}}/>
      <div style={{maxWidth:1320,margin:"0 auto",padding:typeof window!=="undefined"&&window.innerWidth<=768?"100px 16px 60px":"130px 24px 90px",position:"relative",zIndex:2}}>
        <Fade><div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(200,184,138,0.1)",border:"1px solid rgba(200,184,138,0.2)",borderRadius:40,padding:"7px 18px",marginBottom:36}}>
          <Cornflower size={14} color={C.birch}/>
          <span style={{fontFamily:fs,fontSize:11,color:C.birch,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>{T("A Full-Service Credit Union Since 1954")}</span>
          <Daisy size={14} color={C.birch} center="rgba(255,255,255,0.5)"/>
        </div></Fade>
        <Fade delay={0.08}><h1 style={{fontFamily:ff,fontSize:"clamp(36px,5vw,64px)",color:"#fff",lineHeight:1.07,maxWidth:780,margin:"0 0 24px"}}>{T("Your whole financial life.")}<br/><span style={{color:C.birch}}>{T("Under one Birch.")}</span></h1></Fade>
        <Fade delay={0.16}><p style={{fontFamily:fs,fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:560,lineHeight:1.75,margin:"0 0 40px"}}>{T("Chequing and savings. Mortgages and credit cards. GICs, TFSAs and RRSPs. Plus investments, insurance and international transfers, all from one Toronto credit union.")}</p></Fade>
        <Fade delay={0.24}><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn color={C.accentText} onClick={()=>setPage("accounts")}>{T("Compare Accounts")}</Btn>
          <Btn color={C.greenFill} onClick={()=>setPage("mortgages")}>{T("Explore Mortgages")}</Btn>
          <Btn color={C.purple} onClick={()=>setPage("cards")}>{T("Apply for a Credit Card")}</Btn>
          <Btn outline onClick={()=>setPage("quote")}>{T("Get an Insurance Quote")}</Btn>
        </div></Fade>
      </div>
    </section>
    <FlagStripe style={{margin:0}}/>
    <BankingProducts setPage={setPage} lang={lang}/>
    <section style={{background:C.cream,padding:"64px 24px"}}><div style={{maxWidth:1320,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(3,1fr)":"repeat(6,1fr)",gap:12}}>
        {[{l:"AI Insurance Advisor",p:"aiadvisor",c:C.purple},{l:"Life Event Simulator",p:"lifesim",c:C.amber},{l:"Coverage Analyzer",p:"analyzer",c:C.accent},{l:"Health Check",p:"healthcheck",c:C.green},{l:"Document Reader",p:"docreader",c:C.navy},{l:"My Dashboard",p:"dashboard",c:C.red}].map((qi,i)=>
          <Fade key={i} delay={i*0.05}><Clickable onClick={()=>setPage(qi.p)} style={{background:"#fff",borderRadius:16,padding:"24px 20px",border:"1px solid #eee",cursor:"pointer",textAlign:"center",transition:"all 0.3s",borderTop:`3px solid ${qi.c}`}}>
            <h4 style={{fontFamily:fs,fontSize:14,color:C.navy,margin:0,fontWeight:700}}>{qi.l}</h4>
          </Clickable></Fade>
        )}
      </div>
    </div></section>
    <section style={{background:C.cream,padding:"0 24px 64px"}}><div style={{maxWidth:1320,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"repeat(2,1fr)":"repeat(4,1fr)",gap:12}}>
        {[{l:"Insurance",p:"insurance",d:"Life, home, auto, travel, co-op",c:C.accent},{l:"Travel & FX",p:"travel",d:"Baltic travel, transfers, exchange",c:C.amber},{l:"Business",p:"business",d:"Benefits, commercial, succession",c:C.green},{l:"Digital Banking",p:"digital",d:"Dashboard, app, planning tools",c:C.accent},{l:"Estate Planning",p:"estate",d:"Wills, trusts, insurance strategies",c:C.purple},{l:"Rates",p:"rates",d:"Mortgage, GIC, lending rates",c:C.green},{l:"Blog & News",p:"blog",d:"Articles, education, updates",c:C.navy},{l:"Tax & Savings",p:"tax",d:"RRSP, TFSA, tax-smart insurance",c:C.green},{l:"Referral Program",p:"referrals",d:"Earn $50 per referral",c:C.amber}].map((s,i)=>
          <Fade key={i} delay={i*0.04}><Clickable onClick={()=>setPage(s.p)} style={{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #eee",cursor:"pointer",borderLeft:`4px solid ${s.c}`}}>
            <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 4px",fontWeight:700}}>{s.l}</h4>
            <p style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",margin:0}}>{s.d}</p>
          </Clickable></Fade>
        )}
      </div>
    </div></section>
  </>;
}

// ============ FOOTER ============
function Footer({setPage}){
  return <footer style={{background:C.dark,borderTop:"1px solid rgba(200,184,138,0.08)"}}>
    <FolkBorder color={C.birch} opacity={0.1}/>
    <FlagStripe style={{margin:0,opacity:0.4}}/>
    <div style={{padding:typeof window!=="undefined"&&window.innerWidth<=768?"32px 16px":"48px 24px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr 1fr":typeof window!=="undefined"&&window.innerWidth<=1024?"2fr 1fr 1fr 1fr":"2fr 1fr 1fr 1fr 1fr 1fr",gap:24,marginBottom:32}}>
        <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontWeight:800,color:"#fff"}}>NB</span></div><span style={{fontFamily:ff,fontSize:15,color:"#fff",fontWeight:600}}>Northern Birch</span></div><p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:200,marginBottom:12}}>Your whole financial life. Under one Birch.</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <Cornflower size={14} color={C.birch}/>
            {["Eesti","Latviesu","English"].map((l,i)=><span key={i} style={{fontFamily:fs,fontSize:10,color:C.birch,background:"rgba(200,184,138,0.08)",padding:"3px 10px",borderRadius:6,fontWeight:500}}>{l}</span>)}
            <Daisy size={14} color={C.birch} center="rgba(200,184,138,0.5)"/>
          </div>
        </div>
        {[
          {t:"Insurance",items:[["Life Insurance","insurance"],["Home Insurance","insurance"],["Auto Insurance","insurance"],["Travel Insurance","travel"],["Claims Centre","claims"],["Quote Calculator","quote"]]},
          {t:"Tools",items:[["Compare Plans","compare"],["Mortgage Calc","calculators"],["Insurance Needs","calculators"],["Book Appointment","booking"],["Refer a Friend","referrals"],["My Dashboard","dashboard"],["Mobile App","mobileapp"]]},
          {t:"Banking",items:[["Chequing & Savings","accounts"],["Mortgages","mortgages"],["Credit Cards","cards"],["GICs & Registered","accounts"],["Investments","personal"],["Rates","rates"]]},
          {t:"About",items:[["Community","community"],["Blog & News","blog"],["Glossary","glossary"],["Contact & Branches","contact"],["Careers","contact"],["KESKUS Branch","community"]]},
        ].map((col,i)=><div key={i}><h4 style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:"0 0 10px",textTransform:"uppercase",letterSpacing:1}}>{col.t}</h4>{col.items.map(([l,p],ii)=><div key={ii}><button onClick={()=>setPage(p)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontFamily:fs,fontSize:12,padding:"2px 0",cursor:"pointer",display:"block"}}>{l}</button></div>)}</div>)}
      </div>
      {/* Canadian Legal Links */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:16,marginBottom:12,display:"flex",gap:16,flexWrap:"wrap"}}>
        {[["Privacy Policy","privacy"],["Terms of Use","terms"],["Accessibility (AODA)","accessibility"],["Complaint Resolution","complaints"]].map(([l,p],i)=><button key={i} onClick={()=>setPage(p)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontFamily:fs,fontSize:11,cursor:"pointer",padding:0}}>{l}</button>)}
      </div>
      {/* FSRA Deposit Insurance & Regulatory */}
      <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"14px 20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:typeof window!=="undefined"&&window.innerWidth<=768?"flex-start":"center",gap:16,flexDirection:typeof window!=="undefined"&&window.innerWidth<=768?"column":"row"}}>
          <div style={{background:"rgba(39,174,96,0.15)",borderRadius:8,padding:"6px 14px",flexShrink:0}}>
            <span style={{fontFamily:fs,fontSize:11,color:C.greenOnDark,fontWeight:700}}>FSRA INSURED</span>
          </div>
          <p style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>Eligible deposits at Northern Birch Credit Union are insured by the Financial Services Regulatory Authority of Ontario (FSRA). Registered account deposits have unlimited coverage. Other eligible deposits are insured up to $250,000 per depositor. Insurance products are not deposits and are not insured by FSRA.</p>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:typeof window!=="undefined"&&window.innerWidth<=768?"flex-start":"center",flexDirection:typeof window!=="undefined"&&window.innerWidth<=768?"column":"row",gap:8}}>
        <div>
          <span style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",display:"block"}}>Northern Birch Credit Union Limited. Member of Central 1 Credit Union. Regulated by FSRA.</span>
          <span style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",display:"block"}}>Insurance distributed on behalf of The Personal Insurance Company, CUMIS/Co-operators, and Manulife Financial.</span>
        </div>
        <span style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)"}}>Prepared by Thomas Genua, CEO Oodler</span>
      </div>
    </div>
    </div>
  </footer>;
}

// ============ AI INSURANCE ADVISOR PAGE ============
function AIAdvisorPage({setPage}){
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[started,setStarted]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const send=async(text)=>{
    const m=text||input;
    if(!m.trim()||loading)return;
    setInput("");setLoading(true);
    const newMsgs=[...msgs,{from:"user",text:m}];
    setMsgs(newMsgs);
    try{
      const history=newMsgs.map(x=>({role:x.from==="user"?"user":"assistant",content:x.text}));
      const data=await callAI("insurance-advisor",history);
      const reply=data.content?.[0]?.text||"I'm having trouble right now. Please call 416-465-4659 for personalized advice.";
      setMsgs(p=>[...p,{from:"bot",text:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{from:"bot",text:"I'm having trouble connecting. Please call 416-465-4659 for personalized insurance advice."}]);
    }
    setLoading(false);
  };

  const startConversation=(scenario)=>{
    setStarted(true);
    send(scenario);
  };

  if(!started) return (
    <section style={{background:`linear-gradient(170deg,${C.dark} 0%,${C.navy} 50%,#1e4060 100%)`,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
        <Fade>
          <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.accent},${C.purple})`,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:"#fff"}}>&#9889;</span></div>
          <h1 style={{fontFamily:ff,fontSize:typeof window!=="undefined"&&window.innerWidth<=768?28:42,color:"#fff",margin:"0 0 16px"}}>AI Insurance Advisor</h1>
          <p style={{fontFamily:fs,fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:500,margin:"0 auto 48px",lineHeight:1.7}}>Tell me about your life situation and I'll recommend the right insurance products for you. Powered by Claude AI -- available 24/7 in English, Estonian, and Latvian.</p>
        </Fade>
        <Fade delay={0.15}>
          <p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",marginBottom:20}}>Choose a scenario or type your own question:</p>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12,marginBottom:32}}>
            {[
              {label:"I just bought my first home",icon:"&#127968;",desc:"Mortgage protection, home insurance, life insurance review"},
              {label:"I'm planning a trip to Estonia this summer",icon:"&#9992;",desc:"Travel medical, trip cancellation, pre-existing conditions"},
              {label:"I run a small business with 8 employees",icon:"&#128188;",desc:"Group benefits, commercial insurance, key person coverage"},
              {label:"I'm retiring soon and need an estate plan",icon:"&#127793;",desc:"Estate planning, life insurance, succession strategies"},
              {label:"I just started renting my first apartment",icon:"&#128273;",desc:"Tenant insurance, life insurance basics, auto coverage"},
              {label:"I'm moving into a co-op apartment",icon:"&#127970;",desc:"Co-op insurance (exclusive to NBCU), home coverage"},
            ].map((s,i)=>(
              <button key={i} onClick={()=>startConversation(s.label)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 24px",cursor:"pointer",textAlign:"left",transition:"all 0.3s"}}>
                <span style={{fontSize:20,display:"block",marginBottom:8}} dangerouslySetInnerHTML={{__html:s.icon}}/>
                <div style={{fontFamily:fs,fontSize:15,color:"#fff",fontWeight:600,marginBottom:4}}>{s.label}</div>
                <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{s.desc}</div>
              </button>
            ))}
          </div>
        </Fade>
        <Fade delay={0.3}>
          <div style={{display:"flex",gap:8,maxWidth:600,margin:"0 auto"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startConversation(input)} aria-label="Describe your situation" placeholder="Or describe your situation in your own words..." style={{flex:1,border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:15,outline:"none",background:"rgba(255,255,255,0.05)",color:"#fff"}}/>
            <button onClick={()=>startConversation(input)} style={{background:`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"14px 24px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>Start</button>
          </div>
        </Fade>
      </div>
    </section>
  );

  return(
    <section style={{background:"#f0f2f5",padding:"0",paddingTop:60,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{maxWidth:800,margin:"0 auto",width:"100%",flex:1,display:"flex",flexDirection:"column",padding:"0 16px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 0"}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
          <div>
            <div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>AI Insurance Advisor</div>
            <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>Powered by Claude -- Northern Birch Credit Union</div>
          </div>
          <div style={{marginLeft:"auto"}}><Btn small onClick={()=>setPage("booking")}>Book Real Advisor</Btn></div>
        </div>
        {/* Messages */}
        <div style={{flex:1,overflow:"auto",padding:"8px 0",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=><div key={i} style={{alignSelf:m.from==="user"?"flex-end":"flex-start",maxWidth:"80%"}}>
            <div style={{background:m.from==="user"?`linear-gradient(135deg,${C.accent},${C.purple})`:"#fff",color:m.from==="user"?"#fff":C.navy,borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"14px 20px",fontFamily:fs,fontSize:14,lineHeight:1.7,boxShadow:m.from==="bot"?"0 1px 4px rgba(0,0,0,0.06)":"none",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>)}
          {loading&&<div style={{alignSelf:"flex-start",maxWidth:"60%"}}><div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"14px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}><span style={{fontFamily:fs,fontSize:14,color:"#707070"}}>
            <span style={{animation:"blink 1s infinite"}}>Analyzing your needs</span><span style={{animation:"blink 1s infinite 0.2s"}}>.</span><span style={{animation:"blink 1s infinite 0.4s"}}>.</span><span style={{animation:"blink 1s infinite 0.6s"}}>.</span>
          </span></div></div>}
          <div ref={bottomRef}/>
        </div>
        {/* Input */}
        <div style={{padding:"12px 0 20px",borderTop:"1px solid #e8e8e8"}}>
          <div style={{display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type your response..." style={{flex:1,border:"1px solid #ddd",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:14,outline:"none",background:"#fff"}} disabled={loading}/>
            <button onClick={()=>send()} disabled={loading} style={{background:loading?"#ddd":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"14px 24px",cursor:loading?"default":"pointer",color:"#fff",fontFamily:fs,fontSize:14,fontWeight:600}}>Send</button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>AI recommendations are for informational purposes. Book an advisor for personalized quotes.</span>
            <button onClick={()=>{setStarted(false);setMsgs([])}} style={{background:"none",border:"none",fontFamily:fs,fontSize:11,color:C.accentText,cursor:"pointer"}}>Start Over</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  );
}

// ============ AI POLICY ANALYZER ============
function PolicyAnalyzerPage({setPage}){
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("analyzer",[{role:"user",content:input}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659 for a personalized coverage review.");}
    setLoading(false);
  };
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="AI-Powered Analysis" tagColor={C.purple} title="Coverage Gap Analyzer" desc="Describe your current insurance coverage and our AI will identify gaps and recommend Northern Birch products to fill them."/>
        {!result?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
            <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Tell us about your current coverage</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6</div></div>
          </div>
          <textarea aria-label="Describe your current insurance situation" value={input} onChange={e=>setInput(e.target.value)} rows={8} placeholder={"Describe your current insurance situation. For example:\n\n\"I'm 35, married with 2 kids. I have a $500K mortgage with Northern Birch. My employer gives me basic life insurance (1x salary = $85K) and health/dental. I have home insurance with TD ($180/month) and auto with Intact ($165/month). No disability, no critical illness, no travel insurance. We visit my parents in Tallinn every summer.\"\n\nThe more detail you provide, the better our analysis."} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <div style={{display:"flex",gap:12,marginTop:16}}>
            <button onClick={analyze} disabled={loading||!input.trim()} style={{flex:1,background:loading?"#ccc":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Analyzing your coverage...":"Analyze My Coverage"}</button>
          </div>
          <div style={{marginTop:20}}>
            <div style={{fontFamily:fs,fontSize:12,color:"#707070",marginBottom:10}}>Or try a sample scenario:</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Young couple, first mortgage, no life insurance","Retiree, travelling to Estonia, no travel coverage","Small business owner, 8 employees, no group benefits","Renting downtown, no tenant insurance, drives to work"].map((s,i)=><button key={i} onClick={()=>setInput(s)} style={{background:`${C.accentText}06`,border:`1px solid ${C.accent}15`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:fs,fontSize:12,color:C.accentText}}>{s}</button>)}
            </div>
          </div>
        </div>:
        <div>
          <div id="coverage-analysis-result" style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${C.greenFill}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:C.greenText}}>&#10003;</span></div>
              <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Coverage Analysis Complete</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>AI-generated recommendations based on your profile</div></div>
            </div>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("coverage-analysis-result","Coverage Gap Analysis")} color={C.accentText}>&#128190; Download Analysis (PDF)</Btn>
            <Btn onClick={()=>setPage("booking")}>Book Advisor to Discuss</Btn>
            <Btn onClick={()=>setPage("quote")} color={C.greenFill}>Get Quotes for Recommendations</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Analyze Again</Btn>
          </div>
          <p style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:16}}>AI analysis is for informational purposes only. Book an advisor appointment for personalized quotes and binding coverage.</p>
        </div>}
      </div>
    </section>
  );
}

// ============ AI FINANCIAL HEALTH ASSESSMENT ============
function HealthAssessmentPage({setPage}){
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const questions=[
    {id:"age",q:"What is your age?",options:["18-29","30-39","40-49","50-59","60-69","70+"]},
    {id:"family",q:"What is your family situation?",options:["Single, no dependents","Single parent","Married/partnered, no kids","Married/partnered with kids","Empty nester","Retired"]},
    {id:"housing",q:"What is your housing situation?",options:["Renting","Own a condo","Own a house","Own a co-op apartment","Living with family","Multiple properties"]},
    {id:"income",q:"What is your household income range?",options:["Under $50K","$50K-$100K","$100K-$150K","$150K-$250K","$250K+","Retired/fixed income"]},
    {id:"life_ins",q:"Do you have life insurance?",options:["No life insurance","Employer-provided only","Private term policy","Private permanent policy","Both employer + private","Not sure"]},
    {id:"home_ins",q:"Do you have home/tenant insurance?",options:["No coverage","Yes, through a bank","Yes, through an insurer","Yes, through a broker","Included in condo fees","Not sure"]},
    {id:"disability",q:"Do you have disability insurance?",options:["No coverage","Employer-provided short-term","Employer long-term disability","Private disability policy","Both employer + private","Not sure"]},
    {id:"travel",q:"How often do you travel internationally?",options:["Never","Once a year","2-3 times a year","Monthly","Snowbird (extended stays)","Baltic trips specifically"]},
    {id:"business",q:"Do you own a business?",options:["No","Self-employed/freelance","Business with 1-5 employees","Business with 6-20 employees","Business with 20+ employees","Considering starting one"]},
    {id:"estate",q:"Do you have an estate plan?",options:["No will or plan","Have a will only","Will + power of attorney","Comprehensive estate plan","Need to update my plan","Not sure where to start"]},
  ];

  const handleAnswer=(qId,answer)=>{
    const newAnswers={...answers,[qId]:answer};
    setAnswers(newAnswers);
    if(step<questions.length-1){setStep(step+1);}
    else{generateReport(newAnswers);}
  };

  const generateReport=async(allAnswers)=>{
    setLoading(true);
    try{
      const summary=Object.entries(allAnswers).map(([k,v])=>{const q=questions.find(x=>x.id===k);return `${q.q} ${v}`;}).join("\n");
      const data=await callAI("healthcheck",[{role:"user",content:`Here are my financial health quiz answers:\n\n${summary}`}]);
      setResult(data.content?.[0]?.text||"Unable to generate report.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };

  // Parse score from result
  const scoreMatch=result?.match(/SCORE:\s*(\d+)/);
  const score=scoreMatch?parseInt(scoreMatch[1]):null;
  const scoreColor=score>=75?C.green:score>=50?C.amber:C.red;

  if(loading)return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.accent},${C.purple})`,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 1.5s infinite"}}><span style={{fontSize:36,color:"#fff"}}>&#9889;</span></div>
        <h2 style={{fontFamily:ff,fontSize:28,color:"#fff",margin:"0 0 12px"}}>Analyzing your financial health...</h2>
        <p style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)"}}>Claude is reviewing your answers and generating personalized recommendations.</p>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.8}}`}</style>
    </section>
  );

  if(result)return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        {score&&<div id="health-assessment-result" style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:120,height:120,borderRadius:"50%",border:`8px solid ${scoreColor}`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",boxShadow:`0 4px 20px ${scoreColor}30`}}>
            <span style={{fontFamily:ff,fontSize:44,color:scoreColor,fontWeight:700}}>{score}</span>
          </div>
          <h2 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 4px"}}>Your Financial Health Score</h2>
          <p style={{fontFamily:fs,fontSize:14,color:scoreColor,fontWeight:600}}>{score>=75?"Well Protected":score>=50?"Some Gaps to Address":"Significant Gaps Identified"}</p>
        </div>}
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
          <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result.replace(/SCORE:\s*\d+\n?/,"")}</div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn onClick={()=>exportToPDF("health-assessment-result","Financial Health Report")} color={C.accentText}>&#128190; Download Report (PDF)</Btn>
          <Btn onClick={()=>setPage("booking")}>Book Advisor to Close Gaps</Btn>
          <Btn color={C.greenFill} onClick={()=>setPage("quote")}>Get Insurance Quotes</Btn>
          <Btn color={C.purple} onClick={()=>setPage("analyzer")}>Analyze Existing Coverage</Btn>
          <Btn outline onClick={()=>{setResult(null);setStep(0);setAnswers({})}}>Retake Assessment</Btn>
        </div>
      </div>
    </section>
  );

  const q=questions[step];
  return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {/* Progress */}
        <div style={{display:"flex",gap:4,marginBottom:40}}>
          {questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?C.accentText:"rgba(255,255,255,0.1)",transition:"background 0.3s"}}/>)}
        </div>
        <Fade>
          <div style={{textAlign:"center",marginBottom:12}}>
            <span style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)"}}>Question {step+1} of {questions.length}</span>
          </div>
          <h2 style={{fontFamily:ff,fontSize:typeof window!=="undefined"&&window.innerWidth<=768?24:32,color:"#fff",textAlign:"center",margin:"0 0 32px"}}>{q.q}</h2>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
            {q.options.map((opt,i)=>(
              <button key={i} onClick={()=>handleAnswer(q.id,opt)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"20px 24px",cursor:"pointer",textAlign:"left",transition:"all 0.3s",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:500}}>
                {opt}
              </button>
            ))}
          </div>
          {step>0&&<div style={{textAlign:"center",marginTop:20}}><button onClick={()=>setStep(step-1)} style={{background:"none",border:"none",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",cursor:"pointer"}}>&#8592; Back</button></div>}
        </Fade>
      </div>
    </section>
  );
}

// ============ AI LIFE EVENT SIMULATOR ============
function LifeSimPage({setPage}){
  const[event,setEvent]=useState(null);
  const[details,setDetails]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const events=[
    {id:"baby",icon:"&#128118;",label:"Having a baby",prompt:"I'm about to have a baby (or just had one)."},
    {id:"home",icon:"&#127968;",label:"Buying a home",prompt:"I'm buying my first home."},
    {id:"marry",icon:"&#128141;",label:"Getting married",prompt:"I'm getting married."},
    {id:"divorce",icon:"&#128148;",label:"Going through a divorce",prompt:"I'm going through a divorce."},
    {id:"business",icon:"&#128188;",label:"Starting a business",prompt:"I'm starting a new business."},
    {id:"retire",icon:"&#127965;",label:"Approaching retirement",prompt:"I'm retiring within the next 2-3 years."},
    {id:"parent",icon:"&#128116;",label:"Caring for aging parents",prompt:"My elderly parents are moving to Canada from Estonia/Latvia and I need to help care for them."},
    {id:"coop",icon:"&#127970;",label:"Moving to a co-op",prompt:"I'm selling my house and moving into a co-op apartment."},
    {id:"death",icon:"&#128338;",label:"Lost a spouse",prompt:"My spouse recently passed away and I need to review everything."},
    {id:"job",icon:"&#128188;",label:"Changed jobs",prompt:"I just changed jobs and lost my employer benefits."},
  ];
  const run=async(ev)=>{
    setEvent(ev);setLoading(true);
    const context=details?`${ev.prompt} Additional context: ${details}`:ev.prompt;
    try{
      const data=await callAI("life-event",[{role:"user",content:context}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };

  if(loading)return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}} dangerouslySetInnerHTML={{__html:event?.icon||"&#9889;"}}/>
        <h2 style={{fontFamily:ff,fontSize:28,color:"#fff",margin:"0 0 12px"}}>Analyzing how this changes your needs...</h2>
        <p style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)"}}>Claude is building your personalized action plan.</p>
      </div>
    </section>
  );

  if(result)return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div id="life-event-result"><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <span style={{fontSize:32}} dangerouslySetInnerHTML={{__html:event?.icon}}/>
          <div><h2 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:0}}>Life Event: {event?.label}</h2><p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>AI-generated action plan</p></div>
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
          <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
        </div>
        </div><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn onClick={()=>exportToPDF("life-event-result","Life Event Action Plan - "+(event?.label||""))} color={C.accentText}>&#128190; Download Action Plan (PDF)</Btn>
          <Btn onClick={()=>setPage("booking")}>Book Advisor to Discuss</Btn>
          <Btn color={C.greenFill} onClick={()=>setPage("quote")}>Get Insurance Quotes</Btn>
          <Btn color={C.purple} onClick={()=>setPage("healthcheck")}>Full Health Assessment</Btn>
          <Btn outline onClick={()=>{setResult(null);setEvent(null);setDetails("")}}>Try Another Event</Btn>
        </div>
      </div>
    </section>
  );

  return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH dark tag="AI Life Event Simulator" tagColor={C.amberText} title="Life is changing. Are you protected?" desc="Select a life event and our AI will show you exactly how your insurance and financial needs change -- and what to do about it."/>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr 1fr":"repeat(5,1fr)",gap:12,marginBottom:32}}>
          {events.map(ev=>(
            <button key={ev.id} onClick={()=>run(ev)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.3s"}}>
              <span style={{fontSize:28,display:"block",marginBottom:8}} dangerouslySetInnerHTML={{__html:ev.icon}}/>
              <span style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{ev.label}</span>
            </button>
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"24px 28px"}}>
          <label style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:8}}>Add context for a more personalized analysis (optional):</label>
          <input value={details} onChange={e=>setDetails(e.target.value)} aria-label="Describe your situation" placeholder="e.g. I'm 34, married, $450K mortgage with NBCU, no life insurance..." style={{width:"100%",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:14,outline:"none",background:"rgba(255,255,255,0.04)",color:"#fff",boxSizing:"border-box"}}/>
        </div>
      </div>
    </section>
  );
}

// ============ AI DOCUMENT READER ============
function DocReaderPage({setPage}){
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("doc-reader",[{role:"user",content:`Please analyze this insurance document/policy:\n\n${input}`}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="AI Document Reader" tagColor={C.accentText} title="Understand your existing coverage" desc="Paste text from any insurance policy, renewal notice, or coverage summary. Our AI will extract the key details, compare with Northern Birch rates, and flag any gaps."/>
        {!result?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <textarea aria-label="Paste your policy text or coverage details" value={input} onChange={e=>setInput(e.target.value)} rows={12} placeholder={"Paste your policy text, renewal notice, or coverage details here. For example:\n\n\"TD Insurance Home Policy #HO-2024-887721\nDwelling: $650,000 replacement cost\nContents: $325,000\nDeductible: $1,000\nPersonal Liability: $1,000,000\nAdditional Living Expenses: $130,000\nWater damage: Sewer backup included\nPremium: $2,340/year ($195/month)\nRenewal: April 15, 2026\"\n\nYou can also paste a description in your own words, or copy text from a PDF renewal notice."} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <button onClick={analyze} disabled={loading||!input.trim()} style={{width:"100%",marginTop:16,background:loading?"#ccc":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Reading and analyzing your document...":"Analyze My Policy"}</button>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:fs,fontSize:12,color:"#707070"}}>Try with:</span>
            {["Home insurance renewal","Auto policy summary","Life insurance certificate","Group benefits booklet"].map((s,i)=><button key={i} onClick={()=>setInput(`I have a ${s.toLowerCase()} from my current provider. Here are the details: [paste your ${s.toLowerCase()} details here]`)} style={{background:`${C.accentText}06`,border:`1px solid ${C.accent}15`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.accentText}}>{s}</button>)}
          </div>
        </div>:
        <div>
          <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
            <div id="doc-reader-result"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${C.greenFill}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:C.greenText}}>&#10003;</span></div>
              <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Policy Analysis Complete</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6</div></div>
            </div>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div></div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("doc-reader-result","Policy Analysis Report")} color={C.accentText}>&#128190; Download Analysis (PDF)</Btn>
            <Btn onClick={()=>setPage("quote")}>Get NBCU Comparison Quote</Btn>
            <Btn color={C.greenFill} onClick={()=>setPage("booking")}>Book Advisor to Switch</Btn>
            <Btn color={C.purple} onClick={()=>setPage("analyzer")}>Full Coverage Analysis</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Analyze Another Document</Btn>
          </div>
        </div>}
      </div>
    </section>
  );
}

// ============ AI TAX OPTIMIZER ============
function TaxPage({setPage}){
  const[mode,setMode]=useState("optimizer");
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  // RRSP calculator
  const[rIncome,setRIncome]=useState(100000);const[rContrib,setRContrib]=useState(18000);const[rRate,setRRate]=useState(33);
  const rrspRefund=Math.round(rContrib*(rRate/100));
  const rrspGrowth20=Math.round(rContrib*Math.pow(1.06,20));
  const tfsaGrowth20=Math.round(7000*Math.pow(1.06,20));

  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("tax",[{role:"user",content:input}]);
      setResult(data.content?.[0]?.text||"Unable to analyze.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="AI Tax & Savings Optimizer" tagColor={C.greenText} title="Keep more of what you earn" desc="Canadian tax optimization strategies, RRSP/TFSA planning, and insurance tax benefits -- personalized for your situation."/>
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {[{l:"AI Tax Advisor",v:"optimizer"},{l:"RRSP/TFSA Calculator",v:"calculator"},{l:"Tax-Smart Insurance",v:"insurance"}].map(tab=><button key={tab.v} onClick={()=>{setMode(tab.v);setResult(null)}} style={{flex:1,minWidth:isMob?0:150,background:mode===tab.v?C.greenFill:"#fff",border:mode===tab.v?"none":"1px solid #ddd",borderRadius:12,padding:"14px 16px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:mode===tab.v?"#fff":C.navy}}>{tab.l}</button>)}
        </div>

        {mode==="optimizer"&&!result&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.green},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
            <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>AI Tax Advisor</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6 -- Canadian tax expertise</div></div>
          </div>
          <textarea aria-label="Describe your tax situation" value={input} onChange={e=>setInput(e.target.value)} rows={6} placeholder={"Describe your tax situation. For example:\n\n\"I'm 42, married, household income $180K (I earn $120K, spouse $60K). We have 2 kids (ages 5 and 8). $90K in RRSPs, $25K in TFSAs, $400K mortgage with NBCU. No RESP for the kids yet. No FHSA. My employer doesn't offer a pension. I'm paying $2,400/year in home insurance to TD. Looking to reduce our tax bill and save smarter.\""} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <button onClick={analyze} disabled={loading||!input.trim()} style={{width:"100%",marginTop:16,background:loading?"#ccc":`linear-gradient(135deg,${C.green},${C.accent})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Analyzing your tax situation...":"Optimize My Taxes"}</button>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Maximize RRSP deductions","Best TFSA vs RRSP strategy","Tax-efficient estate planning","Small business tax optimization","Retirement income splitting"].map((s,i)=><button key={i} onClick={()=>setInput(s+" -- please advise based on typical Ontario resident situation")} style={{background:`${C.greenFill}06`,border:`1px solid ${C.green}15`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.greenText}}>{s}</button>)}
          </div>
        </div>}

        {mode==="optimizer"&&result&&<div>
          <div id="tax-optimizer-result" style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("tax-optimizer-result","Tax Optimization Strategy")} color={C.accentText}>&#128190; Download Strategy (PDF)</Btn>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book Wealth Advisor</Btn>
            <Btn onClick={()=>setPage("rates")}>View NBCU Rates</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Ask Another Question</Btn>
          </div>
        </div>}

        {mode==="calculator"&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 24px"}}>RRSP vs. TFSA Comparison</h3>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
            <div><label htmlFor="calc-11" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Annual Income</label><input type="number" id="calc-11" value={rIncome} onChange={e=>setRIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="calc-12" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>RRSP Contribution</label><input type="number" id="calc-12" value={rContrib} onChange={e=>setRContrib(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="sel-4" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Marginal Tax Rate (%)</label><select id="sel-4" value={rRate} onChange={e=>setRRate(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value={20}>20.05% ($0-$51K)</option><option value={30}>29.65% ($51K-$102K)</option><option value={31}>31.48% ($102K-$150K)</option><option value={33}>33.89% ($150K-$220K)</option><option value={46}>46.41% ($220K+)</option></select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:`${C.accentText}06`,borderRadius:16,padding:24,borderTop:`3px solid ${C.accent}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 16px",fontWeight:700}}>RRSP</h4>
              {[
                {l:"Your contribution",v:`C$${rContrib.toLocaleString()}`},
                {l:"Immediate tax refund",v:`C$${rrspRefund.toLocaleString()}`},
                {l:"Effective cost after refund",v:`C$${(rContrib-rrspRefund).toLocaleString()}`},
                {l:"Value in 20 years (6% return)",v:`C$${rrspGrowth20.toLocaleString()}`},
                {l:"Tax on withdrawal",v:`Taxed as income`},
                {l:"2025 limit",v:`18% of income, max $31,560`},
              ].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?"1px solid rgba(0,0,0,0.05)":"none"}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.v}</span></div>)}
              <div style={{marginTop:12,background:`${C.accentText}10`,borderRadius:10,padding:"12px 16px"}}><p style={{fontFamily:fs,fontSize:12,color:C.accentText,margin:0,lineHeight:1.6}}>Best for: High income now, lower income in retirement. Reinvest the refund in your TFSA for maximum benefit.</p></div>
            </div>
            <div style={{background:`${C.greenFill}06`,borderRadius:16,padding:24,borderTop:`3px solid ${C.green}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 16px",fontWeight:700}}>TFSA</h4>
              {[
                {l:"Max annual contribution",v:"C$7,000"},
                {l:"Tax refund",v:"None (after-tax $)"},
                {l:"Effective cost",v:"C$7,000"},
                {l:"Value in 20 years (6% return)",v:`C$${tfsaGrowth20.toLocaleString()}`},
                {l:"Tax on withdrawal",v:"Completely tax-free"},
                {l:"Cumulative room (since 2009)",v:"Up to $95,000"},
              ].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?"1px solid rgba(0,0,0,0.05)":"none"}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.v}</span></div>)}
              <div style={{marginTop:12,background:`${C.greenFill}10`,borderRadius:10,padding:"12px 16px"}}><p style={{fontFamily:fs,fontSize:12,color:C.greenText,margin:0,lineHeight:1.6}}>Best for: Everyone. Tax-free growth forever. Ideal emergency fund, medium-term savings, or supplement to RRSP.</p></div>
            </div>
          </div>
          <div style={{marginTop:20,background:`${C.amber}08`,borderRadius:14,padding:"16px 20px",borderLeft:`4px solid ${C.amber}`}}>
            <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}><strong style={{color:C.navy}}>Pro tip:</strong> The optimal strategy for most Canadians is to contribute to your RRSP first (get the tax refund), then invest that refund into your TFSA. At a {rRate}% marginal rate, your C${rContrib.toLocaleString()} RRSP contribution generates a C${rrspRefund.toLocaleString()} refund -- put that into your TFSA for tax-free growth. Northern Birch offers both RRSP and TFSA GICs, mutual funds, and high-interest savings.</p>
          </div>
          <div style={{marginTop:16,textAlign:"center"}}><Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book a Wealth Review with Heili Orav</Btn></div>
        </div>}

        {mode==="insurance"&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 8px"}}>Tax-Smart Insurance Strategies</h3>
          <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",marginBottom:24}}>Insurance isn't just protection -- it's one of the most powerful tax planning tools in Canada.</p>
          {[
            {title:"Life Insurance Proceeds Are Tax-Free",desc:"When you die, your life insurance death benefit passes to your beneficiaries completely tax-free. Unlike RRSPs (which trigger a full income tax bill at death) or investment accounts (which trigger capital gains), life insurance bypasses the estate entirely. This means no probate fees (1.5% in Ontario), no estate administration tax, and no income tax on the benefit.",product:"Term Life Insurance via CUMIS -- from C$25/month",color:C.accentText},
            {title:"Critical Illness Benefits Are Tax-Free",desc:"If you're diagnosed with cancer, have a heart attack, or suffer a stroke, your critical illness insurance pays a tax-free lump sum. Use it however you want -- medical treatment, income replacement, mortgage payments, travel for care. Because you paid premiums with after-tax dollars, the CRA doesn't tax the benefit.",product:"Critical Illness Insurance via CUMIS",color:C.greenText},
            {title:"Corporate-Owned Life Insurance",desc:"If you own a business through a corporation, the company can own a life insurance policy on you. Premiums aren't tax-deductible, but the death benefit flows into the Capital Dividend Account (CDA) and can be distributed to shareholders tax-free. This is one of the most powerful estate planning tools for business owners.",product:"Key Person Insurance via CUMIS -- business-owned policies",color:C.purple},
            {title:"Insurance Replaces Estate Tax Liability",desc:"Canada has no estate tax, but there's a deemed disposition at death that triggers capital gains on investments, rental properties, and cottages. Life insurance can be sized to cover this exact tax liability, ensuring your family inherits assets without selling them to pay the CRA.",product:"Estate Planning Advisory + Term/Permanent Life via CUMIS",color:C.amberText},
            {title:"Disability Insurance Premiums",desc:"If you pay disability insurance premiums personally (not through your employer), any benefits you receive are completely tax-free. This is important: employer-paid disability benefits are taxable income, but personally-paid benefits are not. Consider paying your own premiums for tax-free benefits.",product:"Disability Insurance via CUMIS",color:C.navy},
            {title:"RESP + Insurance = Education Security",desc:"RESPs get a 20% government grant (CESG) on contributions up to $2,500/year per child. But what if you die before fully funding the RESP? Life insurance ensures your children's education fund is completed even if you're not here. The insurance proceeds are tax-free and can be contributed to the RESP by your surviving spouse.",product:"RESP at Northern Birch + Term Life via CUMIS",color:C.redText},
          ].map((s,i)=>(
            <div key={i} style={{marginBottom:16,padding:"24px 28px",background:`${s.color}04`,borderRadius:16,borderLeft:`4px solid ${s.color}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.title}</h4>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 8px",lineHeight:1.75}}>{s.desc}</p>
              <span style={{fontFamily:fs,fontSize:12,color:s.color,fontWeight:600}}>{s.product}</span>
            </div>
          ))}
          <div style={{marginTop:8,display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book Tax-Smart Insurance Review</Btn>
            <Btn onClick={()=>setPage("estate")} color={C.purple}>Estate Planning</Btn>
            <Btn onClick={()=>{setMode("optimizer");setResult(null)}} outline>Ask AI Tax Advisor</Btn>
          </div>
        </div>}

        <div style={{marginTop:32}}>
          <FAQ items={[
            {q:"Is my RRSP contribution deadline the same as my tax deadline?",a:"No. Your RRSP contribution deadline is 60 days after the end of the tax year (typically March 1 or March 2). Your tax filing deadline is April 30. This means you can still make RRSP contributions in January and February and claim the deduction on the previous year's tax return. Northern Birch offers RRSP GICs, savings accounts, and mutual funds -- visit any branch or call 416-465-4659 to contribute before the deadline."},
            {q:"Should I prioritize RRSP or TFSA?",a:"It depends on your income. If your marginal tax rate is above 30% (income over $51K in Ontario), RRSP contributions give you a meaningful tax refund that you should reinvest in your TFSA. If your income is lower, the TFSA may be better since you won't pay tax on withdrawals. The optimal strategy for most people: maximize RRSP first, invest the refund in TFSA, then contribute additional savings to TFSA. Book a wealth review at Northern Birch for personalized advice."},
            {q:"How does the First Home Savings Account (FHSA) work?",a:"The FHSA combines the best of RRSP and TFSA. Contributions are tax-deductible (like RRSP) and withdrawals for a first home purchase are tax-free (like TFSA). You can contribute $8,000/year up to $40,000 lifetime. If you don't buy a home, funds can be transferred to your RRSP. Northern Birch offers FHSA accounts -- this is one of the best savings vehicles available for first-time buyers."},
            {q:"Are insurance premiums tax-deductible?",a:"Generally no -- personal insurance premiums (life, home, auto, health) are not tax-deductible. However, if you're self-employed, health and dental insurance premiums may be deductible. If your corporation owns a life insurance policy, the death benefit flows into the Capital Dividend Account for tax-free distribution. The real tax benefit of insurance is that proceeds are tax-free to beneficiaries."},
          ]}/>
        </div>
      </div>
    </section>
  );
}

// ============ MEMBER DASHBOARD MOCKUP ============
function DashboardPage({setPage}){
  const[transferAmt,setTransferAmt]=useState("200");
  // The field accepted anything: "abc" produced "Recipient Gets EUR NaN" beside a
  // live "Send C$abc" button. Parse strictly and gate the send on the result.
  const scrollTo=(id)=>{const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:prefersReducedMotion()?"auto":"smooth",block:"center"});const f=el.querySelector("input,button");if(f)f.focus({preventScroll:true})};
  const scrollToTransfer=()=>scrollTo("dash-transfer");
  const scrollToDocs=()=>scrollTo("dash-documents");
  const transferNum=/^\d{1,7}(\.\d{1,2})?$/.test(transferAmt.trim())?parseFloat(transferAmt.trim()):NaN;
  const transferOk=Number.isFinite(transferNum)&&transferNum>=1&&transferNum<=25000;
  const[transferTo,setTransferTo]=useState("Grandmother Maija - Riga, Latvia");
  const[transferRef]=useState(()=>"NB-TXN-"+Math.floor(Math.random()*900000+100000));
  const[transferSent,setTransferSent]=useState(false);
  const[signedDocs,setSignedDocs]=useState({});
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  // Spending data
  const spending=[{cat:"Housing",amt:2132,pct:42,c:C.navy},{cat:"Food & Grocery",amt:847,pct:17,c:C.green},{cat:"Transportation",amt:435,pct:9,c:C.amber},{cat:"Insurance",amt:343,pct:7,c:C.accent},{cat:"Int'l Transfers",amt:275,pct:5,c:C.purple},{cat:"Entertainment",amt:234,pct:5,c:"#E91E63"},{cat:"Shopping",amt:198,pct:4,c:"#FF9800"},{cat:"Utilities",amt:187,pct:4,c:"#607D8B"},{cat:"Other",amt:389,pct:7,c:"#9E9E9E"}];
  const totalSpend=spending.reduce((s,x)=>s+x.amt,0);
  return(
    <section style={{background:"#f0f2f5",padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:isMob?"flex-start":"center",marginBottom:24,flexDirection:isMob?"column":"row",gap:12}}>
          <div>
            <h2 style={{fontFamily:ff,fontSize:isMob?22:28,color:C.navy,margin:"0 0 4px"}}>Welcome back, Maria</h2>
            <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>Member since 2018 -- Last login: March 19, 2026 -- <span style={{color:C.greenText,fontWeight:600}}>Identity Verified</span> &#9989;</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn small color={C.accentText} onClick={()=>setPage&&setPage("quote")}>Get a Quote</Btn>
            <Btn small color={C.greenFill} onClick={scrollToTransfer}>Send Transfer</Btn>
            <Btn small color={C.purple} onClick={()=>setPage&&setPage("messages")}>Messages</Btn>
            <Btn small outline color={C.navy} onClick={()=>setPage&&setPage("contact")}>Account Settings</Btn>
          </div>
        </div>
        {/* Notifications */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          <div style={{background:`${C.amber}10`,border:`1px solid ${C.amber}30`,borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:16}}>&#128276;</span>
            <span style={{fontFamily:fs,fontSize:13,color:C.navy,flex:1}}>Your home insurance renewal is coming up on <strong>April 15, 2026</strong>. Review your coverage to ensure you're still adequately protected.</span>
            <button onClick={()=>setPage("compare")} style={{background:C.amberFill,border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600,whiteSpace:"nowrap"}}>Review Now</button>
          </div>
          <div style={{background:`${C.accentText}08`,border:`1px solid ${C.accent}20`,borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:16}}>&#9997;</span>
            <span style={{fontFamily:fs,fontSize:13,color:C.navy,flex:1}}>2 documents pending your electronic signature. Sign now to complete your insurance application.</span>
            <button onClick={scrollToDocs} style={{background:C.accentText,border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600,whiteSpace:"nowrap"}}>Sign Now</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"2fr 1fr",gap:24}}>
          {/* ======= LEFT COLUMN ======= */}
          <div>
            {/* Account Summary */}
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr",gap:12,marginBottom:24}}>
              {[{label:"Chequing",balance:"C$4,237.89",num:"****6742",c:C.navy},{label:"TFSA Savings",balance:"C$18,450.00",num:"****3891",c:C.green},{label:"RRSP",balance:"C$47,200.00",num:"****4510",c:C.purple},{label:"Mortgage",balance:"-C$387,200",num:"****1205",c:C.accent}].map((a,i)=>
                <div key={i} style={{background:"#fff",borderRadius:16,padding:"20px",borderTop:`3px solid ${a.c}`}}>
                  <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>{a.label}</div>
                  <div style={{fontFamily:ff,fontSize:isMob?18:20,color:C.navy,fontWeight:700,margin:"6px 0 4px"}}>{a.balance}</div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{a.num}</div>
                </div>
              )}
            </div>

            {/* Credit Score Widget */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Credit Score</h3>
                <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>Via Equifax -- Updated Mar 1, 2026</span>
              </div>
              <div style={{display:"flex",alignItems:isMob?"flex-start":"center",gap:24,flexDirection:isMob?"column":"row"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:110,height:110,borderRadius:"50%",background:`conic-gradient(${C.greenFill} 0% 78%, #eee 78% 100%)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                    <div style={{width:88,height:88,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                      <span style={{fontFamily:ff,fontSize:32,color:C.navy,fontWeight:700}}>782</span>
                    </div>
                  </div>
                  <div style={{fontFamily:fs,fontSize:12,color:C.greenText,fontWeight:600,marginTop:8}}>Excellent</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[{l:"Payment History",v:"100%",s:"Excellent"},{l:"Credit Utilization",v:"18%",s:"Good"},{l:"Credit Age",v:"8 years",s:"Good"},{l:"Recent Inquiries",v:"1",s:"Low Impact"}].map((f,i)=>
                      <div key={i} style={{padding:"8px 12px",background:"#f8f8f8",borderRadius:10}}>
                        <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>{f.l}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
                          <span style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{f.v}</span>
                          <span style={{fontFamily:fs,fontSize:10,color:C.greenText,fontWeight:600}}>{f.s}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{fontFamily:fs,fontSize:11,color:"#707070",margin:"12px 0 0"}}>Your score has increased 12 points since January. Keep it up! Credit monitoring is free for all Northern Birch members.</p>
                </div>
              </div>
            </div>

            {/* Spending & Budgeting */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Monthly Spending</h3>
                <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>C${totalSpend.toLocaleString()} <span style={{color:"#707070",fontWeight:400}}>this month</span></span>
              </div>
              {/* Visual bar chart */}
              <div style={{marginBottom:16}}>
                {spending.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                    <span style={{fontFamily:fs,fontSize:12,color:"#666",width:110,flexShrink:0}}>{s.cat}</span>
                    <div style={{flex:1,height:20,background:"#f5f5f5",borderRadius:10,overflow:"hidden"}}>
                      <div style={{width:`${s.pct}%`,height:"100%",background:s.c,borderRadius:10,transition:"width 1s ease"}}/>
                    </div>
                    <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600,width:70,textAlign:"right"}}>C${s.amt}</span>
                  </div>
                ))}
              </div>
              <div style={{background:`${C.accentText}06`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>&#128161;</span>
                <span style={{fontFamily:fs,fontSize:12,color:C.navy}}>You spent <strong>C$435</strong> on transportation this month -- 15% more than last month. Consider bundling auto insurance with home for savings.</span>
              </div>
            </div>

            {/* Insurance Policies */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>My Insurance Policies</h3>
                <span style={{fontFamily:fs,fontSize:12,color:C.accentText,fontWeight:600,cursor:"pointer"}}>View All Details</span>
              </div>
              {[
                {type:"Home Insurance",provider:"The Personal",policy:"HP-2024-88721",status:"Active",renewal:"Apr 15, 2026",premium:"C$142.50/mo",coverage:"C$650,000 Replacement Cost",c:C.green},
                {type:"Auto Insurance",provider:"The Personal",policy:"AP-2024-34219",status:"Active",renewal:"Jun 1, 2026",premium:"C$168.00/mo",coverage:"C$2M Liability + Collision + Ajusto",c:C.amber},
                {type:"Term Life Insurance",provider:"CUMIS",policy:"TL-2025-11087",status:"Active",renewal:"Guaranteed 20yr",premium:"C$32.50/mo",coverage:"C$500,000 - 20 Year Term",c:C.accent},
                {type:"Mortgage Protection",provider:"CUMIS",policy:"MP-2024-55432",status:"Active",renewal:"Tied to Mortgage",premium:"Included",coverage:"Life + Disability on Mortgage",c:C.navy},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<3?"1px solid #f5f5f5":"none"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`${p.c}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:p.c}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{p.type}</div>
                      <span style={{fontFamily:fs,fontSize:10,color:C.greenText,fontWeight:600,background:`${C.greenFill}10`,padding:"3px 8px",borderRadius:6}}>{p.status}</span>
                    </div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:2}}>{p.provider} -- {p.coverage} -- <span style={{color:C.accentText,fontWeight:600}}>{p.premium}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Signing */}
            <div id="dash-documents" style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Documents & E-Signatures</h3>
                <span style={{background:C.redText,color:"#fff",fontFamily:fs,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>2 Pending</span>
              </div>
              {[
                {name:"Critical Illness Insurance Application",provider:"CUMIS",date:"Mar 15, 2026",status:"pending",type:"Insurance"},
                {name:"TFSA Beneficiary Designation Update",provider:"Northern Birch",date:"Mar 12, 2026",status:"pending",type:"Account"},
                {name:"Home Insurance Policy Renewal",provider:"The Personal",date:"Feb 28, 2026",status:"signed",type:"Insurance"},
                {name:"Mortgage Renewal Agreement",provider:"Northern Birch",date:"Jan 15, 2026",status:"signed",type:"Mortgage"},
              ].map((doc,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<3?"1px solid #f5f5f5":"none"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:doc.status==="pending"?`${C.amber}10`:`${C.greenFill}08`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:16}}>{doc.status==="pending"?"&#9997;":"&#9989;"}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:600}}>{doc.name}</div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>{doc.provider} -- {doc.date}</div>
                  </div>
                  {doc.status==="pending"?
                    <button onClick={()=>setSignedDocs(p=>({...p,[i]:true}))} style={{background:signedDocs[i]?C.greenFill:C.accentText,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"#fff",fontWeight:600}}>{signedDocs[i]?"Signed ✓":"Sign Now"}</button>:
                    <span style={{fontFamily:fs,fontSize:11,color:C.greenText,fontWeight:600}}>Signed &#9989;</span>
                  }
                </div>
              ))}
              <p style={{fontFamily:fs,fontSize:11,color:"#707070",margin:"12px 0 0"}}>E-signatures are legally binding under Canada's Electronic Commerce Act. Documents are encrypted and stored securely.</p>
            </div>

            {/* Recent Transactions */}
            <div style={{background:"#fff",borderRadius:20,padding:28}}>
              <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 20px",fontWeight:700}}>Recent Transactions</h3>
              {[
                {desc:"Interac e-Transfer sent to Laila J.",amount:"-C$150.00",date:"Mar 19",type:"transfer",cat:"Transfer"},
                {desc:"Apple Pay - Loblaws",amount:"-C$87.43",date:"Mar 18",type:"purchase",cat:"Food & Grocery"},
                {desc:"Mortgage Payment",amount:"-C$1,847.22",date:"Mar 15",type:"payment",cat:"Housing"},
                {desc:"Home Insurance - The Personal",amount:"-C$142.50",date:"Mar 15",type:"insurance",cat:"Insurance"},
                {desc:"Payroll Deposit - TechCorp Inc.",amount:"+C$3,245.00",date:"Mar 14",type:"deposit",cat:"Income"},
                {desc:"Google Pay - Uber",amount:"-C$18.45",date:"Mar 13",type:"purchase",cat:"Transportation"},
                {desc:"International Transfer to Riga",amount:"-C$275.00",date:"Mar 10",type:"transfer",cat:"Int'l Transfer"},
                {desc:"GIC Interest Credited",amount:"+C$112.50",date:"Mar 1",type:"deposit",cat:"Investment Income"},
              ].map((tx,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<7?"1px solid #f8f8f8":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:tx.type==="deposit"?`${C.greenFill}10`:tx.type==="insurance"?`${C.accentText}10`:tx.type==="transfer"?`${C.purple}10`:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:11}} dangerouslySetInnerHTML={{__html:tx.type==="deposit"?"&#8593;":tx.type==="insurance"?"&#9737;":tx.type==="transfer"?"&#8644;":"&#8595;"}}/>
                    </div>
                    <div>
                      <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:500}}>{tx.desc}</div>
                      <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{tx.date} -- <span style={{color:"#707070"}}>{tx.cat}</span></div>
                    </div>
                  </div>
                  <span style={{fontFamily:fs,fontSize:14,color:tx.amount.startsWith("+")?C.greenText:C.navy,fontWeight:600}}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ======= RIGHT COLUMN ======= */}
          <div>
            {/* Quick International Transfer */}
            <div id="dash-transfer" style={{background:`linear-gradient(135deg,${C.navy},#2a4a6a)`,borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.7)",margin:"0 0 16px",fontWeight:700}}>&#127757; Quick Transfer to Baltics</h3>
              {!transferSent?<>
                <div style={{marginBottom:12}}>
                  <label htmlFor="sel-5" style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:4}}>To</label>
                  <select id="sel-5" value={transferTo} onChange={e=>setTransferTo(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px",fontFamily:fs,fontSize:13,color:"#fff",outline:"none",boxSizing:"border-box"}}>
                    <option>Grandmother Maija - Riga, Latvia</option>
                    <option>Uncle Toomas - Tallinn, Estonia</option>
                    <option>Estonian Song Festival Fund</option>
                    <option>New Recipient...</option>
                  </select>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:4}}>Amount (CAD)</label>
                  <input aria-label="Transfer amount in Canadian dollars" inputMode="decimal" value={transferAmt} onChange={e=>setTransferAmt(e.target.value)} aria-invalid={transferAmt!==""&&!transferOk} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:`1px solid ${transferAmt!==""&&!transferOk?C.redOnDark:"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 14px",fontFamily:fs,fontSize:18,color:"#fff",outline:"none",fontWeight:700,boxSizing:"border-box"}}/>
                  {transferAmt!==""&&!transferOk&&<div role="alert" style={{fontFamily:fs,fontSize:11,color:C.redOnDark,marginTop:6}}>Enter an amount between C$1 and C$25,000.</div>}
                </div>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Exchange Rate</span><span style={{fontFamily:fs,fontSize:12,color:"#fff"}}>1 CAD = 0.6821 EUR</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Recipient Gets</span><span style={{fontFamily:fs,fontSize:14,color:C.greenOnDark,fontWeight:700}}>{"\u20AC"}{transferOk?money(transferNum*0.6821):"--"}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Fee</span><span style={{fontFamily:fs,fontSize:12,color:"#fff"}}>C$4.99</span></div>
                </div>
                <button onClick={()=>setTransferSent(true)} disabled={!transferOk} style={{width:"100%",background:transferOk?C.greenFill:"rgba(255,255,255,0.12)",border:"none",borderRadius:10,padding:"12px",cursor:transferOk?"pointer":"not-allowed",fontFamily:fs,fontSize:14,color:transferOk?"#fff":"rgba(255,255,255,0.5)",fontWeight:700}}>{transferOk?`Send C$${money(transferNum)} to ${transferTo.split(" - ")[0]}`:"Enter an amount to send"}</button>
              </>:<div style={{textAlign:"center",padding:"12px 0"}}>
                <div style={{fontSize:32,marginBottom:8}}>&#9989;</div>
                <div style={{fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700}}>Transfer Sent!</div>
                <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>C${money(transferNum)} to {transferTo}</div>
                <div style={{fontFamily:fs,fontSize:12,color:C.greenOnDark,marginTop:2}}>Estimated arrival: 1-2 business days</div>
                <div style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:8}}>Tracking ID: {transferRef}</div>
                <button onClick={()=>setTransferSent(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:12}}>Send Another</button>
              </div>}
            </div>

            {/* Quick Actions */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Quick Actions</h3>
              {/* These were ten buttons with no onClick between them. The six
                  that have somewhere real to go now go there; the rest are
                  online-banking functions this site does not implement, so
                  they are listed rather than dressed up as working buttons. */}
              {[
                {l:"Get Insurance Quote",c:C.accent,go:"quote"},
                {l:"Send International Transfer",c:C.green,go:"transfer"},
                {l:"File Insurance Claim",c:C.red,go:"claims"},
                {l:"Book Advisor Meeting",c:C.amber,go:"booking"},
                {l:"Update Beneficiaries",c:C.accent,go:"booking"},
                {l:"Apply for Credit Card",c:C.purple,go:"cards"},
              ].map((a,i,arr)=>(
                <button key={i} onClick={()=>a.go==="transfer"?scrollToTransfer():setPage(a.go)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",background:"none",border:"none",padding:"9px 8px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #f8f8f8":"none",textAlign:"left"}}>
                  <div style={{width:8,height:8,borderRadius:2,background:a.c,flexShrink:0}}/>
                  <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:500}}>{a.l}</span>
                  <span style={{marginLeft:"auto",fontFamily:fs,fontSize:12,color:C.accentText}} aria-hidden="true">&rarr;</span>
                </button>
              ))}
              <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"14px 0 6px",fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}}>In online banking</p>
              <ul style={{listStyle:"none",margin:0,padding:0}}>
                {["Pay a bill","Send an Interac e-Transfer","Download tax slips (T5, T3, RRSP)","Order foreign currency cash"].map((l,i)=>
                  <li key={i} style={{fontFamily:fs,fontSize:12,color:"#666",padding:"5px 8px"}}>{l}</li>)}
              </ul>
              <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"8px 0 0"}}>Need a hand with one of these? <button onClick={()=>setPage("contact")} style={{background:"none",border:"none",padding:"6px 2px",minHeight:24,fontFamily:fs,fontSize:11,color:C.accentText,fontWeight:600,cursor:"pointer",textDecoration:"underline"}}>Call your branch</button>.</p>
            </div>

            {/* Upcoming Payments */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Upcoming Payments</h3>
              {[
                {l:"Home Insurance",d:"Apr 1",a:"C$142.50",c:C.green},
                {l:"Auto Insurance",d:"Apr 1",a:"C$168.00",c:C.amber},
                {l:"Term Life Premium",d:"Apr 1",a:"C$32.50",c:C.accent},
                {l:"Mortgage Payment",d:"Apr 1",a:"C$1,847.22",c:C.navy},
                {l:"Recurring Transfer (Riga)",d:"Apr 5",a:"C$200.00",c:C.purple},
                {l:"Collabria Mastercard",d:"Apr 12",a:"C$487.33",c:C.red},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<5?"1px solid #f8f8f8":"none"}}>
                  <div>
                    <div style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:500}}>{p.l}</div>
                    <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{p.d}</div>
                  </div>
                  <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600}}>{p.a}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"10px",background:"#f8f8f8",borderRadius:10,textAlign:"center"}}>
                <span style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>Total upcoming: </span>
                <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>C$2,877.55</span>
              </div>
            </div>

            {/* Digital ID Verification Status */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Identity Verification</h3>
              {[{l:"Photo ID Verified",s:true,d:"Ontario Driver's Licence -- Verified Feb 2024"},{l:"Address Verified",s:true,d:"4 Credit Union Dr, North York"},{l:"KYC / AML Compliant",s:true,d:"FINTRAC compliant -- Next review: Feb 2027"},{l:"Biometric Login",s:true,d:"Face ID enabled on iPhone"}].map((v,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid #f8f8f8":"none"}}>
                  <span style={{fontSize:14,color:C.greenText}}>&#9989;</span>
                  <div>
                    <div style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600}}>{v.l}</div>
                    <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{v.d}</div>
                  </div>
                </div>
              ))}
              <p style={{fontFamily:fs,fontSize:10,color:"#707070",margin:"10px 0 0"}}>Identity verification powered by Jumio. Compliant with FINTRAC and FSRA requirements.</p>
            </div>

            {/* Coverage Score */}
            <div style={{background:C.navy,borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)",margin:"0 0 16px",fontWeight:700}}>Coverage Score</h3>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{width:90,height:90,borderRadius:"50%",border:`5px solid ${C.green}`,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:ff,fontSize:28,color:"#fff",fontWeight:700}}>87</span>
                </div>
                <div style={{fontFamily:fs,fontSize:11,color:C.greenOnDark,marginTop:6,fontWeight:600}}>Well Protected</div>
              </div>
              {[{l:"Life Insurance",v:true},{l:"Home Insurance",v:true},{l:"Auto Insurance",v:true},{l:"Disability",v:false},{l:"Critical Illness",v:false},{l:"Travel Insurance",v:true}].map((c2,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
                  <span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>{c2.l}</span>
                  <span style={{fontFamily:fs,fontSize:11,color:c2.v?C.greenOnDark:C.redOnDark,fontWeight:600}}>{c2.v?"Covered":"Gap"}</span>
                </div>
              ))}
              <button onClick={()=>setPage("analyzer")} style={{width:"100%",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:500,marginTop:12}}>Close Coverage Gaps</button>
            </div>

            {/* Next Advisor Appointment */}
            <div style={{background:`${C.greenFill}08`,border:`1px solid ${C.green}20`,borderRadius:20,padding:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Next Appointment</h3>
              <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:600}}>Insurance Review with Heili Orav</div>
              <div style={{fontFamily:fs,fontSize:12,color:"#666",marginTop:4}}>March 25, 2026 at 10:30 AM</div>
              <div style={{fontFamily:fs,fontSize:12,color:"#666"}}>Latvian Centre Branch, North York</div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={()=>setPage("messages")} style={{flex:1,background:C.greenFill,border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600}}>Message Heili</button>
                <button onClick={()=>setPage("booking")} style={{flex:1,background:"#fff",border:`1px solid ${C.greenText}`,borderRadius:8,padding:"8px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.greenText,fontWeight:600}}>Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FOR LEADERSHIP - BUSINESS CASE ============
function LeadershipPage({setPage}){
  const[tab,setTab]=useState("overview");
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  const tabs=[{l:"Overview",v:"overview"},{l:"Costs",v:"costs"},{l:"Legal & Regulatory",v:"legal"},{l:"Value & ROI",v:"roi"},{l:"Competitive Edge",v:"competitive"},{l:"Implementation",v:"implementation"}];
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <SH tag="For Northern Birch Leadership" tagColor={C.navy} title="The business case for digital transformation" desc="Everything Anita Saar and the Board need to evaluate this partnership. Costs, legal framework, value proposition, and implementation plan."/>
        <div style={{display:"flex",gap:6,marginBottom:32,flexWrap:"wrap"}}>
          {tabs.map(tb=><button key={tb.v} onClick={()=>setTab(tb.v)} style={{background:tab===tb.v?C.navy:"#fff",border:tab===tb.v?"none":"1px solid #ddd",borderRadius:10,padding:isMob?"10px 14px":"12px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,fontWeight:tab===tb.v?700:500,color:tab===tb.v?"#fff":C.navy,transition:"all 0.3s"}}>{tb.l}</button>)}
        </div>

        {tab==="overview"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>The Opportunity</h3>
            <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.8,marginBottom:16}}>Northern Birch offers zero insurance products. Every competitor of meaningful size -- Desjardins, Meridian, DUCA, FirstOntario -- offers insurance. NBCU members who need life, home, auto, or travel insurance must leave the credit union entirely, creating an opening for competitors to cross-sell banking products.</p>
            <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.8,marginBottom:24}}>This platform adds insurance distribution, international transfers, AI-powered financial tools, estate planning, and business services to Northern Birch's offering -- turning a ~$200M credit union into a comprehensive financial services provider that competes with institutions 100x its size.</p>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr 1fr":"repeat(4,1fr)",gap:16}}>
              {[{v:"C$4.05M",l:"5-Year Net Revenue",c:C.greenText},{v:"C$56K",l:"3-Year Total Cost to NBCU",c:C.accentText},{v:"Day 1",l:"Profitable From",c:C.amberText},{v:"1%",l:"Year 5 Cost-to-Revenue",c:C.purple}].map((m,i)=>
                <div key={i} style={{background:`${m.c}06`,borderRadius:16,padding:20,textAlign:"center",borderTop:`3px solid ${m.c}`}}>
                  <div style={{fontFamily:ff,fontSize:28,color:m.c,fontWeight:700}}>{m.v}</div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#666",marginTop:4}}>{m.l}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{background:`${C.navy}06`,borderRadius:20,padding:isMob?24:32,border:`1px solid ${C.navy}12`}}>
            <h3 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 12px"}}>What This Website Demonstrates</h3>
            <p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.7,marginBottom:16}}>This is not a mockup. Every feature on this site is functional:</p>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:10}}>
              {["7 AI features powered by Claude Opus 4.6 (real API calls, real conversations)","Real-time insurance quote calculator with actuarial math","Trilingual experience (English, Estonian, Latvian) -- 80+ translated strings","Credit score monitoring, budgeting, and spending categorization","International transfer widget with live EUR exchange rates","Digital document signing and identity verification","Claims filing wizard, appointment booking, coverage comparison","Canadian regulatory compliance (PIPEDA, AODA, FSRA, FINTRAC)","Estonian/Latvian cultural branding (birch trees, cornflowers, daisies, folk patterns)","Tax & savings optimizer with RRSP/TFSA calculators"].map((f,i)=>
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:C.greenText,fontSize:14,flexShrink:0}}>&#10003;</span><span style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.6}}>{f}</span></div>
              )}
            </div>
          </div>
        </div>}

        {tab==="costs"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 8px"}}>What Northern Birch Actually Pays</h3>
            <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",marginBottom:24}}>The insurance distribution model is dramatically cheaper than most board members expect.</p>
            {/* Cost table */}
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #eee",marginBottom:24}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",background:C.navy,padding:"14px 20px"}}>
                {["Cost Item","Year 1","Year 2","Year 3","3-Year Total"].map((h,i)=><span key={i} style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:700}}>{h}</span>)}
              </div>
              {[
                {item:"Oodler Technology & Consulting",y1:"C$0",y2:"C$0",y3:"C$0",total:"C$0 (pro bono)",highlight:true},
                {item:"Insurance Partner (The Personal, CUMIS, Manulife)",y1:"C$0",y2:"C$0",y3:"C$0",total:"C$0",highlight:true},
                {item:"RIBO Licensing (if subsidiary route)",y1:"C$3,000",y2:"C$2,000",y3:"C$2,000",total:"C$7,000"},
                {item:"One-Time Legal Counsel",y1:"C$5,000",y2:"-",y3:"-",total:"C$5,000"},
                {item:"Optional KESKUS Launch Marketing",y1:"C$5,000",y2:"C$3,000",y3:"C$3,000",total:"C$11,000"},
                {item:"E&O Insurance (subsidiary)",y1:"-",y2:"C$2,500",y3:"C$2,500",total:"C$5,000"},
                {item:"Staff Time (opportunity cost)",y1:"C$8,000",y2:"C$10,000",y3:"C$10,000",total:"C$28,000"},
                {item:"TOTAL",y1:"C$21,000",y2:"C$17,500",y3:"C$17,500",total:"C$56,000",bold:true},
              ].map((row,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:row.highlight?`${C.greenFill}06`:row.bold?`${C.navy}06`:i%2===0?"#fff":"#fafafa",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.item}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y1}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y2}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y3}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:700}}>{row.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:16,marginBottom:24}}>
            {[
              {title:"What Oodler Provides Free",color:C.greenText,items:["Insurance partner negotiation","KESKUS launch strategy","Regulatory navigation (FSRA/RIBO)","Website & digital UX audit","Cybersecurity assessment","Payments modernization advisory","Quarterly performance analytics","Ongoing technology advisory"],value:"C$75K-100K estimated value"},
              {title:"What Insurers Provide Free",color:C.accentText,items:["Insurance products & underwriting","Quoting tools & digital infrastructure","Staff training & certification","Marketing materials & co-branding","Policy administration","Claims processing","Dedicated partnership manager","Regulatory compliance support"],value:"They want NBCU's distribution"},
              {title:"What NBCU Provides",color:C.amberText,items:["Member relationships & trust","Branch staff for referrals","Community network","Access to member data (with consent)","Board approval & alignment","RIBO licensing fees","Optional marketing spend","Commitment to offer insurance"],value:"C$56K over 3 years"},
            ].map((col,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee",borderTop:`3px solid ${col.color}`}}>
                <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>{col.title}</h4>
                {col.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><div style={{width:5,height:5,borderRadius:"50%",background:col.color,flexShrink:0}}/><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{item}</span></div>)}
                <div style={{marginTop:12,padding:"8px 12px",background:`${col.color}08`,borderRadius:8}}><span style={{fontFamily:fs,fontSize:12,color:col.color,fontWeight:600}}>{col.value}</span></div>
              </div>
            ))}
          </div>
          <div style={{background:`${C.greenFill}08`,borderRadius:16,padding:"20px 28px",borderLeft:`4px solid ${C.green}`}}>
            <p style={{fontFamily:fs,fontSize:14,color:"#555",margin:0,lineHeight:1.7}}><strong style={{color:C.navy}}>Bottom line:</strong> Northern Birch's total 3-year cost is C$56,000 for projected revenue of C$1.49 million. That's a 26x return on investment. The program is profitable from Day 1 because both Oodler and the insurer provide their services at no cost to NBCU.</p>
          </div>
        </div>}

        {tab==="legal"&&<div>
          {[
            {title:"Insurance Distribution Model",color:C.accentText,content:"Northern Birch becomes an insurance distributor, NOT an insurance company. NBCU does not manufacture products, underwrite risk, process claims, or hold insurance capital reserves. All of that is done by the insurance manufacturing partners (The Personal, CUMIS, Manulife). NBCU refers members to insurance products and earns commissions on policies sold.",items:["No underwriting risk to NBCU","No claims liability","No insurance capital requirements","No impact on NBCU's capital adequacy ratios"]},
            {title:"FSRA (Financial Services Regulatory Authority of Ontario)",color:C.greenText,content:"Northern Birch is regulated by FSRA as an Ontario credit union. FSRA permits credit unions to distribute insurance products through referral arrangements or licensed subsidiaries. The recommended approach starts with a referral arrangement (operational in 6-8 weeks, no RIBO license required) before transitioning to a RIBO-licensed subsidiary as volume justifies.",items:["Referral model: operational in 6-8 weeks","No RIBO license required for referrals","FSRA notification required (not approval)","Full RIBO subsidiary as volume grows"]},
            {title:"RIBO (Registered Insurance Brokers of Ontario)",color:C.amberText,content:"RIBO regulates insurance brokers in Ontario. Under a referral model, NBCU staff refer members to the insurer's licensed agents -- no RIBO license needed. Under a subsidiary model, NBCU creates a RIBO-licensed entity with at least one licensed principal broker. CUMIS and The Personal provide full RIBO navigation support.",items:["Phase 1: Referral (no RIBO needed)","Phase 2: Licensed subsidiary","CUMIS provides regulatory guidance","Annual RIBO fees ~C$2,000-3,000"]},
            {title:"PIPEDA (Privacy)",color:C.purple,content:"All member data handling complies with the Personal Information Protection and Electronic Documents Act. Insurance referrals require member consent before sharing information with insurance partners. Members can opt out of insurance marketing at any time. Health information for underwriting requires explicit consent. All data is encrypted and stored in Canada.",items:["Consent required before data sharing","Opt-out available at any time","Health data requires explicit consent","All data stored in Canada"]},
            {title:"FINTRAC (Anti-Money Laundering)",color:C.navy,content:"Northern Birch already complies with FINTRAC for banking operations. Insurance distribution adds minimal AML requirements since the insurers handle their own FINTRAC obligations. International transfer services through partners like Wise are FINTRAC-registered. Digital identity verification (Jumio) satisfies KYC requirements.",items:["Existing FINTRAC compliance covers banking","Insurers handle their own AML","Transfer partners are FINTRAC-registered","Digital ID verification for KYC"]},
            {title:"AODA (Accessibility)",color:C.redText,content:"The Accessibility for Ontarians with Disabilities Act requires all digital services to meet WCAG 2.0 Level AA standards. This website and all member-facing digital tools are designed with accessibility in mind: keyboard navigation, screen reader support, sufficient color contrast, and resizable text. The new KESKUS branch will exceed current physical accessibility standards.",items:["WCAG 2.0 Level AA compliance","Keyboard and screen reader support","Accessible branch design","Staff training on accessible service"]},
          ].map((section,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:isMob?24:32,border:"1px solid #eee",marginBottom:16,borderLeft:`4px solid ${section.color}`}}>
              <h3 style={{fontFamily:fs,fontSize:18,color:C.navy,margin:"0 0 10px",fontWeight:700}}>{section.title}</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,marginBottom:12}}>{section.content}</p>
              <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:8}}>
                {section.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,alignItems:"center"}}><span style={{color:section.color,fontSize:12}}>&#10003;</span><span style={{fontFamily:fs,fontSize:13,color:"#555"}}>{item}</span></div>)}
              </div>
            </div>
          ))}
        </div>}

        {tab==="roi"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>Five-Year Revenue Projection</h3>
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #eee",marginBottom:24}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",background:C.navy,padding:"14px 20px"}}>
                {["","Year 1","Year 2","Year 3","Year 4","Year 5"].map((h,i)=><span key={i} style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:700}}>{h}</span>)}
              </div>
              {[
                {item:"Insurance Revenue",vals:["C$165K","C$465K","C$860K","C$1.17M","C$1.49M"],c:C.green},
                {item:"Total Costs",vals:["(C$21K)","(C$17.5K)","(C$17.5K)","(C$20K)","(C$20.5K)"],c:C.red},
                {item:"Net Annual Impact",vals:["C$144K","C$447.5K","C$842.5K","C$1.15M","C$1.47M"],c:C.accent,bold:true},
                {item:"Cumulative Net",vals:["C$144K","C$591.5K","C$1.43M","C$2.58M","C$4.05M"],c:C.navy,bold:true},
                {item:"Cost as % of Revenue",vals:["13%","4%","2%","2%","1%"],c:"#6B6B6B"},
              ].map((row,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:i%2===0?"#fff":"#fafafa",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:row.bold?700:400}}>{row.item}</span>
                  {row.vals.map((v,vi)=><span key={vi} style={{fontFamily:fs,fontSize:13,color:row.c,fontWeight:row.bold?700:400}}>{v}</span>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee"}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Revenue Sources</h4>
              {[
                {l:"Creditor Insurance (mortgage life/disability)",v:"C$45K-$120K/yr",d:"30-40% take rate on new mortgages"},
                {l:"Term Life & Critical Illness",v:"C$35K-$200K/yr",d:"Commissions on new policies + renewals"},
                {l:"Home & Auto Insurance (The Personal)",v:"C$50K-$400K/yr",d:"Exclusive group rates drive adoption"},
                {l:"Travel Insurance",v:"C$10K-$75K/yr",d:"Baltic community = high travel frequency"},
                {l:"Group Benefits (Manulife)",v:"C$15K-$150K/yr",d:"5-10 business accounts per year"},
                {l:"Additional Revenue Streams",v:"C$10K-$300K/yr",d:"International transfers, FX, estate, referrals"},
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<5?"1px solid #f5f5f5":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.greenText,fontWeight:700}}>{r.v}</span></div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:2}}>{r.d}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee"}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Non-Revenue Value</h4>
              {[
                {l:"Member Retention",d:"Members with 3+ products have 97%+ retention. Insurance is the stickiest product in financial services."},
                {l:"Competitive Defense",d:"Every month without insurance is a month Lemonade, Sonnet, and PolicyMe are acquiring NBCU members."},
                {l:"Data Intelligence",d:"Insurance data improves lending decisions. Lending data improves insurance targeting. The data flywheel compounds."},
                {l:"KESKUS Brand Moment",d:"Launching insurance alongside the new flagship branch creates a once-in-a-generation brand event."},
                {l:"Multi-Generational Deepening",d:"Insuring a family's home, auto, and life ties them to NBCU across 40+ years and multiple generations."},
                {l:"Community Leadership",d:"Being the first heritage credit union with AI-powered insurance advisory positions NBCU as an innovation leader."},
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<5?"1px solid #f5f5f5":"none"}}>
                  <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600,marginBottom:2}}>{r.l}</div>
                  <div style={{fontFamily:fs,fontSize:12,color:"#666",lineHeight:1.6}}>{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {tab==="competitive"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>What No Competitor Can Replicate</h3>
            {[
              {title:"AI Insurance Advisor in Estonian & Latvian",desc:"No bank, credit union, or insurer in Canada has an AI advisor that speaks Estonian and Latvian. This isn't a translation -- it's a culturally informed advisor that understands Baltic travel patterns, co-op housing, and cross-border family needs.",color:C.purple},
              {title:"Co-op Apartment Insurance",desc:"Northern Birch is one of the few Ontario institutions with both co-op mortgage expertise AND co-op insurance products. Standard condo policies don't fit co-op structures. This is a genuinely ownable niche.",color:C.accentText},
              {title:"Baltic Travel Insurance + Transfers",desc:"Annual multi-trip coverage designed for members who visit Estonia and Latvia regularly, combined with in-app international transfers to the Baltics. No competitor bundles these.",color:C.amberText},
              {title:"Multi-Generational Family Intelligence",desc:"NBCU knows members' parents, children, and grandchildren across 70+ years. A home insurance renewal for Juri triggers a life insurance review for his daughter Maria. No big bank has this depth of relationship.",color:C.greenText},
              {title:"Community Network Effect",desc:"In tight-knit Estonian and Latvian communities, one satisfied insurance customer generates 3-4 referrals. Juri tells everyone at the Latvian Centre. This word-of-mouth multiplier doesn't exist at TD or Scotiabank.",color:C.navy},
            ].map((s,i)=>(
              <div key={i} style={{padding:"16px 0",borderBottom:i<4?"1px solid #f0f0f0":"none"}}>
                <h4 style={{fontFamily:fs,fontSize:16,color:s.color,margin:"0 0 6px",fontWeight:700}}>{s.title}</h4>
                <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:C.navy,borderRadius:20,padding:isMob?24:32}}>
            <h4 style={{fontFamily:fs,fontSize:16,color:"#fff",margin:"0 0 16px",fontWeight:700}}>Competitor Comparison</h4>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr 1fr",gap:12}}>
              {[
                {name:"Northern Birch\n(with Oodler)",features:["AI advisor","Estonian/Latvian","Co-op insurance","Baltic transfers","Community trust"],score:"10/10",c:C.green},
                {name:"Desjardins /\nMeridian",features:["Insurance products","Large scale","No AI advisor","No Baltic focus","No co-op specialty"],score:"6/10",c:C.amber},
                {name:"Big Banks\n(TD, RBC, CIBC)",features:["Basic insurance","Scale","No personalization","No heritage focus","Branch closures"],score:"4/10",c:C.amber},
                {name:"Digital Insurers\n(Lemonade, Sonnet)",features:["Fast quotes","Modern UX","No banking","No community","No advice"],score:"5/10",c:C.amber},
                {name:"Insurance Brokers",features:["Product choice","Advice","No banking","No digital","No AI"],score:"5/10",c:C.amber},
              ].map((comp,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:`1px solid ${i===0?C.green:"rgba(255,255,255,0.06)"}40`,textAlign:"center"}}>
                  <div style={{fontFamily:fs,fontSize:12,color:"#fff",fontWeight:700,whiteSpace:"pre-line",marginBottom:8,minHeight:36}}>{comp.name}</div>
                  <div style={{fontFamily:ff,fontSize:20,color:comp.c,fontWeight:700,marginBottom:8}}>{comp.score}</div>
                  {comp.features.map((f,fi)=><div key={fi} style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:3}}>{f}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>}

        {tab==="implementation"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 20px"}}>18-Month Implementation Roadmap</h3>
            {[
              {phase:"Month 1-2",title:"Discovery & Partner Selection",color:C.accentText,items:["Insurance partner RFP (CUMIS, The Personal, Manulife)","Commission structure negotiation","Regulatory review with FSRA","Member needs survey","KESKUS timeline alignment"]},
              {phase:"Month 2-3",title:"Licensing & Compliance",color:C.greenText,items:["FSRA notification filed","Referral agreement with insurers","Privacy assessment (PIPEDA)","Compliance framework established","Staff training program begins"]},
              {phase:"Month 3-6",title:"Phase 1 Launch: Creditor & Life",color:C.amberText,items:["Creditor insurance embedded in mortgage applications","Term life and critical illness referrals begin","Staff certified on insurance products","KESKUS pre-launch marketing","Digital platform soft launch"]},
              {phase:"Month 6-10",title:"Phase 2: Home, Auto & Travel",color:C.purple,items:["The Personal P&C quote engine live","Co-op apartment insurance product","Auto insurance referrals active","Baltic travel insurance package","Tenant insurance via mobile app"]},
              {phase:"Month 10-14",title:"Phase 3: Group Benefits & Digital",color:C.navy,items:["Manulife group benefits for business members","Commercial property & liability insurance","International transfer service live","Full insurance dashboard in online banking","AI advisor launched"]},
              {phase:"Month 14-18",title:"Optimization & Expansion",color:C.redText,items:["RIBO subsidiary transition (if volume justifies)","Estate planning advisory program","Payroll partnerships active","Cross-sell analytics and optimization","Board performance reporting"]},
            ].map((phase,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:i<5?24:0,paddingBottom:i<5?24:0,borderBottom:i<5?"1px solid #f0f0f0":"none"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:phase.color,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:fs,fontSize:12,color:"#fff",fontWeight:800}}>{i+1}</span></div>
                  {i<5&&<div style={{width:2,flex:1,background:"#eee",marginTop:8}}/>}
                </div>
                <div>
                  <div style={{fontFamily:fs,fontSize:12,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{phase.phase}</div>
                  <h4 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"4px 0 10px",fontWeight:700}}>{phase.title}</h4>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {phase.items.map((item,ii)=><span key={ii} style={{fontFamily:fs,fontSize:12,color:"#666",background:"#f5f5f5",padding:"4px 10px",borderRadius:8}}>{item}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Schedule Strategic Alignment Meeting</Btn>
          </div>
        </div>}
      </div>
    </section>
  );
}

// ============ COOKIE CONSENT BANNER ============
// Cookie preference.
//
// The previous banner claimed the site analyses usage, offered "Accept All"
// and "Essential Only" — both wired to the same setShow(false) — and stored
// nothing, so it reappeared on every load and the choice meant nothing. The
// site also sets no cookies and loads no analytics, so it was asking consent
// for something that does not happen.
//
// This keeps the choice, makes it real, and states what is true today. If
// analytics is added later, gate it on analyticsAllowed() and the stored
// answer already applies.
const COOKIE_PREF_KEY="nb-cookie-pref";

function readCookiePref(){
  try{return window.localStorage.getItem(COOKIE_PREF_KEY)}catch(e){return null}
}
function writeCookiePref(v){
  try{window.localStorage.setItem(COOKIE_PREF_KEY,v)}catch(e){}
}
/** True only if the visitor opted in to measurement. Nothing reads this yet:
 *  it is the gate any future measurement should hang off, so the consent
 *  exists before the tracker does. */
// eslint-disable-next-line no-unused-vars
function analyticsAllowed(){return readCookiePref()==="all"}

function CookieBanner({onHeight}){
  const[show,setShow]=useState(()=>typeof window!=="undefined"&&!readCookiePref());
  const ref=useRef(null);
  const boxRef=useRef(null);
  useEffect(()=>{if(show&&ref.current)ref.current.focus()},[show]);
  // The banner is fixed to the bottom of the viewport and sits above the chat
  // launcher, so it swallowed every click on it -- on a phone the launcher was
  // entirely inside the banner. Report the height so the launcher can clear it.
  useEffect(()=>{
    if(!show){onHeight&&onHeight(0);return}
    const el=boxRef.current;
    if(!el)return;
    const report=()=>onHeight&&onHeight(el.getBoundingClientRect().height);
    report();
    const ro=new ResizeObserver(report);
    ro.observe(el);
    return()=>{ro.disconnect();onHeight&&onHeight(0)};
  },[show,onHeight]);
  if(!show)return null;
  const choose=(v)=>{writeCookiePref(v);setShow(false)};
  return(
    <div ref={boxRef} role="region" aria-label="Cookie preferences" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(15,24,41,0.97)",backdropFilter:"blur(10px)",padding:typeof window!=="undefined"&&window.innerWidth<=768?"16px":"16px 24px",zIndex:1600,borderTop:"1px solid rgba(200,184,138,0.2)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",display:"flex",alignItems:typeof window!=="undefined"&&window.innerWidth<=768?"flex-start":"center",gap:16,flexDirection:typeof window!=="undefined"&&window.innerWidth<=768?"column":"row"}}>
        <p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.75)",margin:0,flex:1,lineHeight:1.6}}>
          This site uses only the storage it needs to work, and does not measure your visit today. If we add measurement later, we will use the choice you make here. Your preference is remembered on this device.
        </p>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button ref={ref} onClick={()=>choose("all")} style={{background:C.accentText,border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Allow measurement</button>
          <button onClick={()=>choose("essential")} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.85)"}}>Essential only</button>
        </div>
      </div>
    </div>
  );
}

function PrivacyPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Legal" tagColor={C.navy} title="Privacy Policy" desc="How Northern Birch Credit Union collects, uses, and protects your personal information under PIPEDA."/>
        {[
          {t:"Our Commitment to Privacy",p:"Northern Birch Credit Union Limited ('Northern Birch', 'we', 'us') is committed to protecting the privacy and confidentiality of your personal information. This policy describes how we collect, use, disclose, and safeguard personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation."},
          {t:"Information We Collect",p:"We collect personal information necessary to provide financial and insurance services, including: name, date of birth, address, phone number, email, Social Insurance Number (for tax reporting), employment and income information, financial information (assets, liabilities, credit history), health information (for insurance underwriting, with your consent), transaction history, and digital identifiers (IP address, device information, cookies)."},
          {t:"How We Use Your Information",p:"We use your personal information to: open and manage your accounts; process transactions and provide banking services; assess eligibility for credit, insurance, and investment products; comply with legal and regulatory obligations (FSRA, FINTRAC, CRA); prevent fraud and money laundering; improve our products and services; communicate about your accounts and relevant offers (with your consent). We will not use your information for purposes beyond what is described without your consent."},
          {t:"Sharing with Insurance Partners",p:"When you request insurance quotes or purchase insurance products, we share the minimum necessary information with our insurance manufacturing partners: The Personal Insurance Company (Desjardins), CUMIS (Co-operators), and Manulife Financial. These partners are bound by their own privacy policies and PIPEDA obligations. We obtain your consent before sharing health or sensitive information for insurance underwriting."},
          {t:"Your Rights Under PIPEDA",p:"You have the right to: access your personal information held by Northern Birch; request correction of inaccurate information; withdraw consent for non-essential uses (marketing, insurance referrals); file a complaint with our Privacy Officer or the Office of the Privacy Commissioner of Canada. To exercise these rights, contact our Privacy Officer at privacy@northernbirchcu.com or visit any branch."},
          {t:"Insurance Marketing Opt-Out",p:"You may opt out of insurance-related marketing communications at any time. This will not affect your existing banking relationship or any active insurance policies. To opt out, contact your branch, email privacy@northernbirchcu.com, or adjust your preferences in online banking settings."},
          {t:"Service Providers and Data Outside Canada",p:"Some information you submit through this website \u2014 appointment requests, claim requests and referrals \u2014 is processed and stored by service providers located outside Canada, including in the United States. While it is in another country it is subject to that country's laws, and may be accessible to its courts, law enforcement and national security authorities. We share only what the form collects, and only for the purpose stated at the point of collection. If you would rather not have your information handled this way, call us at 416-465-4659 or visit a branch and we will take your request in person."},
          {t:"Data Retention",p:"We retain your personal information for as long as necessary to provide services and comply with legal obligations. Financial records are retained for a minimum of 7 years as required by the Income Tax Act and FINTRAC regulations. Insurance records are retained for the life of the policy plus 7 years."},
          {t:"Data Security",p:"We protect your information using industry-standard security measures including SSL/TLS encryption, multi-factor authentication, firewalls, intrusion detection systems, and regular security audits. Our core banking platform (Celero/CGI) meets the security standards required by our regulator, the Financial Services Regulatory Authority of Ontario (FSRA)."},
          {t:"Cookies and Digital Tracking",p:"Our website uses essential cookies for functionality and analytics cookies to improve user experience. You can manage cookie preferences through your browser settings. We do not sell personal information to third parties for advertising purposes."},
          {t:"Contact",p:"Privacy Officer, Northern Birch Credit Union Limited, 4 Credit Union Drive, North York, Ontario M4A 2N8. Email: privacy@northernbirchcu.com. Phone: 416-465-4659. Office of the Privacy Commissioner of Canada: 1-800-282-1376 or www.priv.gc.ca."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
        <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:32}}>Last updated: March 2026. Northern Birch Credit Union Limited is regulated by the Financial Services Regulatory Authority of Ontario (FSRA).</p>
      </div>
    </section>
  );
}

// ============ ACCESSIBILITY PAGE (AODA) ============
function AccessibilityPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Accessibility" tagColor={C.greenText} title="Accessibility Commitment" desc="Northern Birch is committed to providing accessible services to all members in accordance with the Accessibility for Ontarians with Disabilities Act (AODA)."/>
        {[
          {t:"Our Commitment",p:"Northern Birch Credit Union is committed to meeting the accessibility needs of people with disabilities in a timely manner. We comply with the Accessibility for Ontarians with Disabilities Act, 2005 (AODA) and the Integrated Accessibility Standards Regulation (Ontario Regulation 191/11)."},
          {t:"Accessible Customer Service",p:"We provide accessible customer service to people with disabilities. Our staff are trained on serving members with various disabilities, including how to interact with people who use assistive devices, service animals, or support persons. If our usual methods of communication don't work for you, we'll work with you to find an alternative."},
          {t:"Website Accessibility",p:"We strive to make our website accessible to WCAG 2.0 Level AA standards. Features include: keyboard navigation support, screen reader compatibility, sufficient colour contrast, resizable text, descriptive alt text for images, and clear navigation structure. If you encounter any accessibility barriers on our website, please contact us."},
          {t:"Accessible Formats",p:"Documents, statements, and communications are available in accessible formats upon request. This includes large print, electronic text, audio format, and other formats as agreed upon. Please allow a reasonable timeframe for conversion."},
          {t:"Branch Accessibility",p:"All Northern Birch branches are physically accessible, including: wheelchair-accessible entrances and counters, accessible parking, accessible washrooms, TTY/TTD telephone service, and assistive listening devices available upon request. Our new KESKUS flagship branch is being designed to exceed current accessibility standards."},
          {t:"Service Animals and Support Persons",p:"We welcome service animals and support persons in all our branches. If a support person accompanies a member, we will ensure that both persons can enter the premises together and that the member can access their support person while receiving services."},
          {t:"Feedback and Complaints",p:"We welcome feedback about how we provide accessible services. Feedback can be provided in person at any branch, by phone at 416-465-4659, by email at accessibility@northernbirchcu.com, or by mail. All feedback will be reviewed and responded to within 15 business days."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
      </div>
    </section>
  );
}

// ============ COMPLAINT RESOLUTION / OMBUDSMAN ============
function ComplaintsPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Member Advocacy" tagColor={C.redText} title="Complaint Resolution" desc="Northern Birch is committed to resolving member concerns fairly and promptly. Here is our complaint resolution process."/>
        <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
          {[
            {step:"1",title:"Contact Your Branch",desc:"Start by speaking with a staff member at your branch or calling us at 416-465-4659. Most concerns can be resolved at this level. Our team is trained to listen, investigate, and find solutions.",color:C.accentText},
            {step:"2",title:"Escalate to Management",desc:"If you're not satisfied with the branch resolution, ask to speak with the Branch Manager or contact our CEO, Anita Saar, at asaar@northernbirchcu.com. Management will review your concern and respond within 10 business days.",color:C.amberText},
            {step:"3",title:"Contact Our Ombudsperson",desc:"If the matter remains unresolved, you may contact the Ombudsman for Banking Services and Investments (OBSI) -- an independent organization that investigates complaints about financial services providers in Canada. OBSI services are free to consumers.",color:C.redText},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:"28px 32px",border:"1px solid #eee",display:"flex",gap:20,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:fs,fontSize:18,color:"#fff",fontWeight:800}}>{s.step}</span></div>
              <div><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{s.title}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.desc}/></p></div>
            </div>
          ))}
        </div>
        <div style={{background:`${C.navy}08`,borderRadius:20,padding:32}}>
          <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 16px",fontWeight:700}}>External Resolution Bodies</h3>
          {[
            {name:"Ombudsman for Banking Services and Investments (OBSI)",phone:"1-888-451-4519",web:"www.obsi.ca",url:"https://www.obsi.ca",desc:"Independent, free dispute resolution for banking and investment complaints."},
            {name:"Financial Services Regulatory Authority of Ontario (FSRA)",phone:"416-250-7250",web:"www.fsrao.ca",url:"https://www.fsrao.ca",desc:"Ontario's financial services regulator. Handles complaints about credit unions."},
            {name:"Financial Consumer Agency of Canada (FCAC)",phone:"1-866-461-3222",web:"www.canada.ca/fcac",url:"https://www.canada.ca/en/financial-consumer-agency.html",desc:"Federal agency protecting consumers of financial products and services."},
            {name:"Office of the Privacy Commissioner of Canada",phone:"1-800-282-1376",web:"www.priv.gc.ca",url:"https://www.priv.gc.ca",desc:"Handles privacy complaints under PIPEDA."},
          ].map((b,i)=>(
            <div key={i} style={{padding:"12px 0",borderBottom:i<3?"1px solid #eee":"none"}}>
              <div style={{fontFamily:fs,fontSize:15,color:C.navy,fontWeight:700}}>{b.name}</div>
              <div style={{fontFamily:fs,fontSize:13,color:"#666",marginTop:2}}>{b.desc}</div>
              <div style={{fontFamily:fs,fontSize:13,color:C.accentText,marginTop:2}}><a href={`tel:+1${b.phone.replace(/\D/g,"").slice(-10)}`} style={{color:C.accentText,fontWeight:600}}>{b.phone}</a> | <a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:C.accentText,fontWeight:600}}>{b.web}</a></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TERMS OF USE ============
function TermsPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Legal" tagColor={C.navy} title="Terms of Use" desc="Terms governing the use of Northern Birch Credit Union's website and digital services."/>
        {[
          {t:"Acceptance of Terms",p:"By accessing or using the Northern Birch Credit Union website and digital banking services, you agree to these Terms of Use. If you do not agree, please do not use our services. These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein."},
          {t:"Insurance Products Disclaimer",p:"Insurance products displayed on this website are distributed by Northern Birch Credit Union on behalf of our manufacturing partners: The Personal Insurance Company (a Desjardins subsidiary), CUMIS (a Co-operators company), and Manulife Financial. Insurance products are not deposits, are not insured by the Financial Services Regulatory Authority of Ontario (FSRA), and are not guaranteed by Northern Birch Credit Union. Quote estimates are illustrative only and do not constitute an offer of insurance. Actual premiums are determined by the insurer based on underwriting criteria."},
          {t:"Deposit Insurance",p:"Eligible deposits at Northern Birch Credit Union are insured by the Financial Services Regulatory Authority of Ontario (FSRA). Registered account deposits (RRSP, RRIF, TFSA, RESP, RDSP, FHSA, LIRA, LIF) have unlimited coverage. Other eligible deposits are insured up to $250,000 per depositor. For full details, visit www.fsrao.ca."},
          {t:"Rate Disclaimers",p:"Interest rates and terms displayed on this website are subject to change without notice. Posted rates are for informational purposes only and may not reflect the actual rate offered to you. Mortgage rates displayed may not include applicable insurance premiums or other charges. GIC rates are subject to minimum deposit requirements. Please contact your branch for the most current rates."},
          {t:"Investment Risk Disclosure",p:"Mutual funds and other investment products are offered through Aviso Wealth, Qtrade Direct Investing, and VirtualWealth. Mutual funds, securities, and other investment products are not deposits, are not insured by FSRA, are not guaranteed by Northern Birch Credit Union, and may fluctuate in value. Commissions, trailing commissions, management fees, and expenses may all be associated with mutual fund investments. Please read the prospectus before investing."},
          {t:"Electronic Communications",p:"By using our online and mobile banking services, you consent to receiving electronic communications including account statements, transaction confirmations, policy documents, and notices. You may revoke this consent at any time by contacting your branch. Electronic communications are governed by the Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada's Anti-Spam Legislation (CASL)."},
          {t:"Limitation of Liability",p:"Northern Birch Credit Union provides this website and its tools (including quote calculators, financial calculators, and other estimators) on an 'as is' basis. We do not warrant the accuracy, completeness, or reliability of any information or calculations. Northern Birch shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website."},
          {t:"Anti-Money Laundering",p:"Northern Birch Credit Union complies with the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) and is registered with the Financial Transactions and Reports Analysis Centre of Canada (FINTRAC). We are required to verify the identity of our members and report certain transactions."},
          {t:"Governing Law",p:"These Terms of Use are governed by the laws of the Province of Ontario and the federal laws of Canada. Any disputes arising from or relating to these terms shall be resolved in the courts of Ontario."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
        <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:32}}>Last updated: March 2026. Northern Birch Credit Union Limited. Ontario Corporation. Regulated by FSRA.</p>
      </div>
    </section>
  );
}

// ============ MAIN APP ============
export default function App(){
  // page is derived from the URL, so a deep link, a refresh and the back
  // button all land on the same screen.
  const[page,setPageState]=useState(()=>typeof window!=="undefined"?pageFromPath(window.location.pathname):"home");
  const setPage=useCallback((key)=>{
    const path=ROUTES[key]||"/";
    if(window.location.pathname!==path)window.history.pushState({},"",path);
    setPageState(ROUTES[key]?key:"home");
  },[]);
  useEffect(()=>{
    const onPop=()=>setPageState(pageFromPath(window.location.pathname));
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);
  useEffect(()=>{applyMeta(page)},[page]);
  const[search,setSearch]=useState(false);
  const[login,setLogin]=useState(false);
  const[notifs,setNotifs]=useState(false);
  const[lang,setLangState]=useState(()=>typeof window!=="undefined"?readLang():"en");
  const setLang=useCallback((v)=>{writeLang(v);setLangState(v)},[]);
  useEffect(()=>{document.documentElement.lang=LANG_TAG[lang]||"en"},[lang]);
  const[cookieH,setCookieH]=useState(0);   // how far the cookie banner pushes the chat launcher up
  // Cmd+K opens search
  useEffect(()=>{
    const h=(e)=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearch(true)}
      if(e.key==="Escape"){setSearch(false);setLogin(false);setNotifs(false)}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);
  const pages={
    home:<HomePage setPage={setPage} lang={lang}/>,insurance:<InsurancePage setPage={setPage} lang={lang}/>,travel:<TravelPage setPage={setPage} lang={lang}/>,business:<BusinessPage setPage={setPage} lang={lang}/>,digital:<DigitalPage setPage={setPage} lang={lang}/>,
    estate:<EstatePage lang={lang}/>,community:<CommunityPage setPage={setPage} lang={lang}/>,personal:<PersonalPage setPage={setPage} lang={lang}/>,contact:<ContactPage lang={lang}/>,
    mortgages:<MortgagesPage setPage={setPage} lang={lang}/>,cards:<CardsPage setPage={setPage} lang={lang}/>,accounts:<AccountsPage setPage={setPage} lang={lang}/>,
    quote:<QuotePage setPage={setPage} lang={lang}/>,compare:<ComparePage setPage={setPage} lang={lang}/>,claims:<ClaimsPage lang={lang}/>,calculators:<CalculatorsPage lang={lang}/>,
    booking:<BookingPage lang={lang}/>,rates:<RatesPage setPage={setPage} lang={lang}/>,referrals:<ReferralsPage lang={lang}/>,blog:<BlogPage setPage={setPage} lang={lang}/>,
    glossary:<GlossaryPage lang={lang}/>,mobileapp:<MobileAppPage setPage={setPage} lang={lang}/>,dashboard:<DashboardPage setPage={setPage} lang={lang}/>,aiadvisor:<AIAdvisorPage setPage={setPage} lang={lang}/>,
    analyzer:<PolicyAnalyzerPage setPage={setPage}/>,healthcheck:<HealthAssessmentPage setPage={setPage}/>,
    lifesim:<LifeSimPage setPage={setPage}/>,docreader:<DocReaderPage setPage={setPage}/>,
    tax:<TaxPage setPage={setPage}/>,messages:<MessagesPage setPage={setPage}/>,
    privacy:<PrivacyPage lang={lang}/>,accessibility:<AccessibilityPage lang={lang}/>,complaints:<ComplaintsPage lang={lang}/>,terms:<TermsPage lang={lang}/>,leadership:<LeadershipPage setPage={setPage}/>,
  };
  return(
    <ToastProvider>
      <div style={{background:C.cream,minHeight:"100vh"}}>
        <a href="#main" className="skip-link">Skip to main content</a>
        <Nav page={page} setPage={setPage} onSearch={()=>setSearch(true)} onLogin={()=>setLogin(true)} onNotifications={()=>setNotifs(true)} lang={lang} setLang={setLang}/>
        {/* The nav is position:fixed and 57-60px tall at every breakpoint, so this
            band has to clear it itself the way each page's paddingTop does. */}
        {lang!=="en"&&<div style={{background:C.birchLight,borderBottom:`1px solid ${C.birch}`,padding:"72px 24px 12px"}}>
          <p style={{maxWidth:1320,margin:"0 auto",fontFamily:fs,fontSize:13,color:C.navy,lineHeight:1.6}}>
            {t("Parts of this site are still only in English. Call us and we will serve you in your language.",lang)}{" "}
            <a href="tel:+14164654659" style={{color:C.accentText,fontWeight:600,whiteSpace:"nowrap"}}>416-465-4659</a>
          </p>
        </div>}
        <main id="main" tabIndex={-1} lang={lang==="en"||TRANSLATED_PAGES.has(page)?undefined:"en"}><ErrorBoundary key={page}>{pages[page]||pages.home}</ErrorBoundary></main>
        <Footer setPage={setPage}/>
        <ChatWidget bottomInset={cookieH}/>
        <SearchOverlay open={search} onClose={()=>setSearch(false)} setPage={setPage}/>
        <LoginModal open={login} onClose={()=>setLogin(false)} setPage={setPage}/>
        <NotificationsPanel open={notifs} onClose={()=>setNotifs(false)} setPage={setPage}/>
        <CookieBanner onHeight={setCookieH}/>
      </div>
    </ToastProvider>
  );
}
