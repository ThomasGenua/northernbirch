import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";

// Loaded on demand. Someone landing on a product page pays for none of this.
const ApplyPage = lazy(() => import('./pages/ApplyPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LeadershipPage = lazy(() => import('./pages/LeadershipPage.jsx'));
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage.jsx'));
const TaxPage = lazy(() => import('./pages/TaxPage.jsx'));
const MessagesPage = lazy(() => import('./pages/MessagesPage.jsx'));
const ClaimsPage = lazy(() => import('./pages/ClaimsPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const AIAdvisorPage = lazy(() => import('./pages/AIAdvisorPage.jsx'));
const HealthAssessmentPage = lazy(() => import('./pages/HealthAssessmentPage.jsx'));
const LifeSimPage = lazy(() => import('./pages/LifeSimPage.jsx'));
const DocReaderPage = lazy(() => import('./pages/DocReaderPage.jsx'));
const PolicyAnalyzerPage = lazy(() => import('./pages/PolicyAnalyzerPage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const ReferralsPage = lazy(() => import('./pages/ReferralsPage.jsx'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage.jsx'));
const ComplaintsPage = lazy(() => import('./pages/ComplaintsPage.jsx'));
const QuotePage = lazy(() => import('./pages/QuotePage.jsx'));
const ComparePage = lazy(() => import('./pages/ComparePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const AdvicePage = lazy(() => import('./pages/AdvicePage.jsx'));
const UnderwritersPage = lazy(() => import('./pages/UnderwritersPage.jsx'));
const BorrowingPage = lazy(() => import('./pages/BorrowingPage.jsx'));
const KeskusPage = lazy(() => import('./pages/KeskusPage.jsx'));
const PhasedAskPage = lazy(() => import('./pages/PhasedAskPage.jsx'));
const RatesPage = lazy(() => import('./pages/RatesPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const MobileAppPage = lazy(() => import('./pages/MobileAppPage.jsx'));
const InsurancePage = lazy(() => import('./pages/InsurancePage.jsx'));
const TravelPage = lazy(() => import('./pages/TravelPage.jsx'));
const BusinessPage = lazy(() => import('./pages/BusinessPage.jsx'));
const DigitalPage = lazy(() => import('./pages/DigitalPage.jsx'));
const EstatePage = lazy(() => import('./pages/EstatePage.jsx'));
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'));
const PersonalPage = lazy(() => import('./pages/PersonalPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const MortgagesPage = lazy(() => import('./pages/MortgagesPage.jsx'));
const CardsPage = lazy(() => import('./pages/CardsPage.jsx'));
const AccountsPage = lazy(() => import('./pages/AccountsPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
import { AI_CHAT_UNAVAILABLE, applyMeta, C, callAI, Clickable, Cornflower, Daisy, ErrorBoundary, ff, FlagStripe, FolkBorder, fs, initMeasurement, LANG_TAG, MEASUREMENT_DOMAIN, pageFromPath, RATE, ROUTES, t, track, trackPageview, TRANSLATED_PAGES, useBreakpoint, useCookiePref, useFocusTrap, useLang, useMob, useW, writeCookiePref, writeLang } from './ui.jsx';

// ============ SEARCH OVERLAY ============
function SearchOverlay({open,onClose,setPage}){const mob=useMob();
  // Measurement note: the query itself is never recorded. A member searching
  // "am I underinsured" is telling us something private; the count is enough.
  const trapRef=useFocusTrap(open,onClose);
  const listRef=useRef(null);
  const[q,setQ]=useState("");
  const allItems=[
    {title:"Term Life Insurance",page:"insurance",cat:"Insurance"},{title:"Home Insurance",page:"insurance",cat:"Insurance"},{title:"Auto Insurance",page:"insurance",cat:"Insurance"},
    {title:"Co-op & Co-ownership Mortgages",page:"mortgages",cat:"Banking"},{title:"Tenant Insurance",page:"insurance",cat:"Insurance"},{title:"Critical Illness Insurance",page:"insurance",cat:"Insurance"},
    {title:"Disability Insurance",page:"insurance",cat:"Insurance"},{title:"Mortgage Protection",page:"insurance",cat:"Insurance"},{title:"Pet Insurance",page:"insurance",cat:"Insurance"},
    {title:"Travel Insurance",page:"travel",cat:"Travel"},{title:"International Transfers",page:"travel",cat:"Travel"},{title:"Foreign Exchange",page:"travel",cat:"Travel"},
    {title:"Group Health & Dental Benefits",page:"business",cat:"Business"},{title:"Commercial Insurance",page:"business",cat:"Business"},{title:"Key Person Insurance",page:"business",cat:"Business"},
    {title:"Business Succession Planning",page:"business",cat:"Business"},{title:"Payroll & HR",page:"business",cat:"Business"},
    {title:"Coverage Explorer",page:"quote",cat:"Digital"},{title:"Financial Planning Tools",page:"calculators",cat:"Digital"},{title:"Digital Banking",page:"digital",cat:"Digital",kw:"digital online tools hub"},
    {title:"Mobile Banking App",page:"mobileapp",cat:"Digital"},{title:"Estates",page:"estate",cat:"Planning"},{title:"Apply Online",page:"apply",cat:"Apply",kw:"apply application open an account join membership become a member sign up start pre-approval preapproval new account"},{title:"Open an Account",page:"apply",cat:"Apply",kw:"open account new chequing savings join membership"},{title:"Financial Advice",page:"advice",cat:"Planning",kw:"advice advisory adviser advisor financial planning wealth management retirement planning investment advice check-up"},{title:"Financial Planning",page:"advice",cat:"Planning",kw:"plan planning retirement wealth advisor"},{title:"Retirement Planning",page:"advice",cat:"Planning",kw:"retirement rrsp rrif pension retire income"},{title:"Wealth Management",page:"advice",cat:"Planning",kw:"wealth invest portfolio aviso qtrade virtualwealth mutual funds managed"},{title:"Financial Check-Up",page:"advice",cat:"Planning",kw:"check up checkup review free advisor heili"},{title:"KESKUS Branch",page:"community",cat:"Community"},
    {title:"Scholarships",page:"community",cat:"Community"},
    {title:"Chequing Accounts",page:"accounts",cat:"Banking",kw:"chequing checking everyday banking debit e-transfer no fee student senior us dollar"},
    {title:"Savings Accounts",page:"accounts",cat:"Banking",kw:"savings high interest hisa deposit compare accounts"},
    {title:"Mortgages",page:"mortgages",cat:"Banking",kw:"mortgage home loan pre-approval renewal refinance fixed variable high ratio co-op heloc"},
    {title:"GICs & Term Deposits",page:"accounts",cat:"Banking",kw:"gic guaranteed investment certificate term deposit 90 day 1 year 5 year"},
    {title:"Credit Cards",page:"cards",cat:"Banking",kw:"credit card mastercard collabria cash back rewards low rate apply"},
    {title:"Card Insurance Benefits",page:"cards",cat:"Banking",kw:"purchase protection extended warranty mobile device rental car collision trip cancellation baggage travel assistance"},
    {title:"Borrowing",page:"borrowing",cat:"Banking",kw:"borrow loan personal loan line of credit loc mortgage co-op co-ownership credit card"},
    {title:"KESKUS Branch",page:"keskus",cat:"About",kw:"keskus new branch flagship estonian centre madison opening"},
    {title:"Registered Accounts (TFSA, RRSP, FHSA, RESP)",page:"accounts",cat:"Banking",kw:"tfsa rrsp fhsa resp rdsp rrif registered retirement first home education tax free"},
    {title:"Compare Accounts",page:"accounts",cat:"Banking",kw:"compare accounts chequing savings fees"},
    {title:"Messages",page:"messages",cat:"Member"},{title:"Contact & Branches",page:"contact",cat:"About"},{title:"Insurance Coverage Explorer",page:"quote",cat:"Tools"},{title:"AI Insurance Advisor",page:"aiadvisor",cat:"AI"},{title:"AI Coverage Analyzer",page:"analyzer",cat:"AI"},{title:"Financial Health Check",page:"healthcheck",cat:"AI"},{title:"Life Event Simulator",page:"lifesim",cat:"AI"},{title:"Policy Document Reader",page:"docreader",cat:"AI"},{title:"Tax & Savings Optimizer",page:"tax",cat:"AI"},{title:"Claims: Who to Call",page:"claims",cat:"Tools",kw:"claim claims file a claim insurer adjuster"},{title:"Coverage Comparison",page:"compare",cat:"Tools"},
    {title:"Mortgage Calculator",page:"calculators",cat:"Tools"},{title:"Insurance Needs Calculator",page:"calculators",cat:"Tools"},{title:"Retirement Calculator",page:"calculators",cat:"Tools"},{title:"Book an Appointment",page:"booking",cat:"Tools"},
    {title:"Referral Program",page:"referrals",cat:"Rewards"},{title:"Rates",page:"rates",cat:"Banking"},{title:"Insurance Glossary",page:"glossary",cat:"Education"},
    {title:"Blog & News",page:"blog",cat:"Education"},
    {title:"Member Dashboard",page:"dashboard",cat:"Banking",kw:"member dashboard demo accounts balances policies insurance dashboard"},
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
  const go=(item)=>{track("search_result",{to:item.page});setPage(item.page);onClose();setQ("")};
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
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="Search Northern Birch" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:mob?"calc(100vw - 32px)":640,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
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
function ChatWidget({bottomInset=0}){const mob=useMob();
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
      const reply=data.error?AI_CHAT_UNAVAILABLE:data.content[0].text;
      setMsgs(p=>[...p,{from:"bot",text:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{from:"bot",text:AI_CHAT_UNAVAILABLE}]);
    }
    setLoading(false);
  };
  return(<>
    {!open&&<Clickable onClick={()=>setOpen(true)} label="Open the Northern Birch AI assistant" style={{position:"fixed",bottom:24+bottomInset,right:24,width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(46,134,193,0.4)",zIndex:1500,animation:"pulse 2s infinite"}}>
      <span aria-hidden="true" style={{fontSize:24,color:"#fff"}}>&#9889;</span>
    </Clickable>}
    {open&&<div style={{position:"fixed",bottom:24+bottomInset,right:24,width:mob?"calc(100vw - 32px)":400,height:mob?440:560,background:"#fff",borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",zIndex:1500,display:"flex",flexDirection:"column",overflow:"hidden"}}>
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

// ============ DEMO MEMBER AREA ============
// This used to be a "Member Sign In" box with member-number and password
// fields. On a lookalike of a real credit union's site that is the shape of a
// phishing page, and the demo has no accounts to sign in to anyway. It now
// says what the member area is and opens it.
function LoginModal({open,onClose,setPage}){const mob=useMob();
  const trapRef=useFocusTrap(open,onClose);
  if(!open)return null;
  const go=(p)=>{setPage(p);onClose()};
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="demo-area-title" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:mob?"calc(100vw - 32px)":440,overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"26px 32px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.accent})`,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:800,color:"#fff"}}>NB</span></div>
          <h3 id="demo-area-title" style={{fontFamily:ff,fontSize:22,color:"#fff",margin:0}}>Demo member area</h3>
        </div>
        <div style={{padding:"24px 32px 28px"}}>
          <p style={{fontFamily:fs,fontSize:14,color:"#444",lineHeight:1.7,margin:"0 0 12px"}}>There is no sign-in on this demonstration. The dashboard and messages show a made-up member, Maria, so you can see how online banking and advisor messaging could look. Nothing there is real, and nothing you do there is saved.</p>
          <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",lineHeight:1.6,margin:"0 0 20px"}}>Northern Birch members: never type your real member number or password into this site. Sign in to online banking only from Northern Birch's own website.</p>
          <button onClick={()=>go("dashboard")} style={{width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700,cursor:"pointer",marginBottom:10}}>Open the demo dashboard</button>
          <button onClick={()=>go("messages")} style={{width:"100%",background:"#fff",border:`1px solid ${C.accentText}`,borderRadius:12,padding:"12px",fontFamily:fs,fontSize:14,color:C.accentText,fontWeight:700,cursor:"pointer"}}>Open demo messages</button>
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
function NotificationsPanel({open,onClose,setPage}){const mob=useMob();
  const trapRef=useFocusTrap(open,onClose);
  const[notes,setNotes]=useState([
    {id:1,type:"renewal",icon:"\uD83D\uDD14",title:"Home Insurance Renewal in 28 Days",desc:"A home insurance renewal is coming up on April 15, 2026. Your insurer sets the price; an advisor can connect you with them if you have questions.",time:"2 hours ago",unread:true,action:"insurance",actionLabel:"Review Coverage",color:C.amberText},
    {id:2,type:"signature",icon:"\u270D\uFE0F",title:"Document Awaiting Your Signature",desc:"The insurer you were referred to has been in touch about critical illness cover. Northern Birch does not sell or activate coverage; the insurer handles the application directly.",time:"5 hours ago",unread:true,action:"dashboard",actionLabel:"Sign Now",color:C.accentText},
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
    <div ref={trapRef} role="dialog" aria-modal="true" aria-label="Notifications" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",width:mob?"calc(100vw - 32px)":420,maxHeight:"calc(100vh - 100px)",margin:mob?"0 16px":"0 24px",display:"flex",flexDirection:"column",overflow:"hidden",animation:"slideDown 0.25s ease-out"}}>
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
  const nav=[{l:"Banking",p:"personal",kids:[{l:"Chequing & Savings",p:"accounts",d:"No-fee everyday accounts, GICs, TFSA & RRSP"},{l:"Borrowing",p:"borrowing",d:"Mortgages, loans, lines of credit, co-ops & cards"},{l:"Mortgages",p:"mortgages",d:"Fixed, variable, high-ratio & co-op financing"},{l:"Credit Cards",p:"cards",d:"Collabria cash back, low rate & travel rewards"},{l:"Personal Banking",p:"personal",d:"The full member line-up in one place"},{l:"Rates",p:"rates",d:"Today's mortgage, GIC and lending rates"}]},{l:"Insurance",p:"insurance"},{l:"Advice",p:"advice"},{l:"Apply",p:"apply"},{l:"Travel",p:"travel"},{l:"Business",p:"business"},{l:"Digital",p:"digital"},{l:"Tools",p:"calculators"},{l:"Rates",p:"rates"},{l:"Community",p:"community"}];
  const langLabels={en:"EN",est:"EST",lat:"LAT"};
  const langFull={en:"English",est:"Eesti",lat:"Latviesu"};
  return(<>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:isDark&&!mobileMenu?"transparent":"rgba(253,251,247,0.98)",backdropFilter:isDark&&!mobileMenu?"none":"blur(16px)",transition:"all 0.4s",borderBottom:isDark&&!mobileMenu?"none":"1px solid rgba(200,184,138,0.15)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:isMob?"10px 16px":"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Clickable label="Northern Birch home" style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",width:"auto"}} onClick={()=>setPage("home")}>
          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:"#fff"}}>NB</span></div>
          <div><span style={{fontFamily:ff,fontSize:isMob?14:16,color:isDark&&!mobileMenu?"#fff":C.navy,fontWeight:600,display:"block",lineHeight:1.2,transition:"color 0.3s"}}>Northern Birch</span><span className="nav-tagline" style={{fontFamily:fs,fontSize:9.5,color:isDark?"rgba(255,255,255,0.5)":"#6B6B6B",letterSpacing:1,textTransform:"uppercase"}}>{t("Credit Union",lang)}</span></div>
        </Clickable>
        <div className="nav-wide">
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
          <button onClick={onLogin} style={{background:C.accentText,border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"#fff",fontWeight:600}}>{t("Access demo",lang)}</button>
        </div>
        <div className="nav-narrow">
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
        </div>
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
        <button onClick={()=>{onLogin();setMobileMenu(false)}} style={{display:"block",width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700,marginBottom:8}}>{t("Access demo",lang)}</button>
        <button onClick={()=>setPage("booking")} style={{display:"block",width:"100%",background:C.navy,border:"none",borderRadius:12,padding:"14px",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700}}>{t("Book Appointment",lang)}</button>
      </div>
    </div>}
  </>);
}

// ============ COVERAGE EXPLORER ============
// Rendered by QuotePage. Kept at module scope so React sees one stable
// component identity instead of a new one on every render.


// ============ PROPOSAL DISCLAIMER ============
// This site reproduces Northern Birch Credit Union's name, branding and
// product language. Without saying plainly what it is, a lookalike at a .ca
// address reads as the regulated institution's own site -- so this states it
// on every page, above the fold, and again in the footer.
//
// It renders unconditionally and sits in the document rather than behind a
// dismiss button: it is in the prerendered HTML, so a crawler or a visitor
// with no JavaScript sees it too. The 72px top padding clears the fixed nav,
// the way each page's own padding does.
//
// Remove this, PROPOSAL_NOINDEX in ui.jsx, and the password gate together --
// and only with written permission to use the marks.
function ProposalBanner(){
  // Dark on purpose. The nav is position:fixed and renders white and
  // transparent over the dark heroes, so it floats on top of this band's
  // background -- a light band made the nav's own text invisible (13 axe
  // contrast failures, white on #FFF8E6). On the light pages the nav is
  // opaque and covers the band entirely, so the dark treatment costs nothing.
  return <div role="note" style={{background:C.navy,borderBottom:`1px solid ${C.birch}44`,padding:"72px 24px 12px"}}>
    <p style={{maxWidth:1320,margin:"0 auto",fontFamily:fs,fontSize:13,color:C.amberOnDark,lineHeight:1.6}}>
      <strong style={{fontWeight:700}}>Demonstration only &mdash; an illustrative proposal prepared by Oodler Inc.</strong>{" "}
      <span style={{color:"rgba(255,255,255,0.78)"}}>
        Not a live Northern Birch Credit Union service. Nothing here is an offer,
        a quote, or advice, and no product shown can be bought or bound on this site.
      </span>
    </p>
  </div>;
}

// ============ FOOTER ============
function Footer({setPage}){const mob=useMob();
  return <footer style={{background:C.dark,borderTop:"1px solid rgba(200,184,138,0.08)"}}>
    <FolkBorder color={C.birch} opacity={0.1}/>
    <FlagStripe style={{margin:0,opacity:0.4}}/>
    <div style={{padding:mob?"32px 16px":"48px 24px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <div className="grid-footer-2fr1fr1fr1fr-2" style={{gap:24,marginBottom:32}}>
        <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.birch},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontWeight:800,color:"#fff"}}>NB</span></div><span style={{fontFamily:ff,fontSize:15,color:"#fff",fontWeight:600}}>Northern Birch</span></div><p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:200,marginBottom:12}}>Your whole financial life. Under one Birch.</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <Cornflower size={14} color={C.birch}/>
            {["Eesti","Latviesu","English"].map((l,i)=><span key={i} style={{fontFamily:fs,fontSize:10,color:C.birch,background:"rgba(200,184,138,0.08)",padding:"3px 10px",borderRadius:6,fontWeight:500}}>{l}</span>)}
            <Daisy size={14} color={C.birch} center="rgba(200,184,138,0.5)"/>
          </div>
        </div>
        {[
          {t:"Insurance",items:[["Insurance by Referral","insurance"],["Card Insurance","cards"],["Travel Insurance","travel"],["Claims: Who to Call","claims"],["Coverage Explorer","quote"]]},
          {t:"Tools",items:[["Compare Cover","compare"],["Mortgage Calc","calculators"],["Insurance Needs","calculators"],["Book Appointment","booking"],["Refer a Friend","referrals"],["My Dashboard","dashboard"],["Mobile App","mobileapp"]]},
          {t:"Banking",items:[["Apply Online","apply"],["Chequing & Savings","accounts"],["Borrowing","borrowing"],["Mortgages","mortgages"],["Credit Cards","cards"],["GICs & Registered","accounts"],["Investments","personal"],["Rates","rates"]]},
          {t:"Advice",items:[["Financial Advice","advice"],["Financial Check-Up","advice"],["Retirement Planning","advice"],["Estates","estate"],["Tax Planning","tax"],["Book an Advisor","booking"]]},
          {t:"About",items:[["Community","community"],["Blog & News","blog"],["Glossary","glossary"],["Contact & Branches","contact"],["KESKUS Branch","keskus"]]},
        ].map((col,i)=><div key={i}><h4 style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:"0 0 10px",textTransform:"uppercase",letterSpacing:1}}>{col.t}</h4>{col.items.map(([l,p],ii)=><div key={ii}><button onClick={()=>setPage(p)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontFamily:fs,fontSize:12,padding:"2px 0",cursor:"pointer",display:"block"}}>{l}</button></div>)}</div>)}
      </div>
      {/* Canadian Legal Links */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:16,marginBottom:12,display:"flex",gap:16,flexWrap:"wrap"}}>
        {[["Privacy Policy","privacy"],["Terms of Use","terms"],["Accessibility (AODA)","accessibility"],["Complaint Resolution","complaints"]].map(([l,p],i)=><button key={i} onClick={()=>setPage(p)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontFamily:fs,fontSize:11,cursor:"pointer",padding:0}}>{l}</button>)}
      </div>
      {/* FSRA Deposit Insurance & Regulatory */}
      <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"14px 20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:mob?"flex-start":"center",gap:16,flexDirection:mob?"column":"row"}}>
          <div style={{background:"rgba(39,174,96,0.15)",borderRadius:8,padding:"6px 14px",flexShrink:0}}>
            <span style={{fontFamily:fs,fontSize:11,color:C.greenOnDark,fontWeight:700}}>FSRA INSURED</span>
          </div>
          <p style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>Eligible deposits at Northern Birch Credit Union are insured by the Financial Services Regulatory Authority of Ontario (FSRA). Registered account deposits have unlimited coverage. Other eligible deposits are insured up to $250,000 per depositor. Insurance products are not deposits and are not insured by FSRA.</p>
        </div>
      </div>
      {/* The permanent record of what this site is, carried on every page
          alongside the banner at the top. */}
      <div style={{background:"rgba(212,165,71,0.10)",border:`1px solid rgba(212,165,71,0.35)`,borderRadius:12,padding:"14px 20px",marginBottom:16}}>
        <p style={{fontFamily:fs,fontSize:11,color:C.amberOnDark,margin:0,lineHeight:1.7}}>
          <strong style={{fontWeight:700}}>Illustrative proposal prepared by Oodler Inc. — not a live Northern Birch Credit Union service.</strong>{" "}
          This site is a design concept shown to Northern Birch for discussion. It is
          not operated by, endorsed by, or affiliated with Northern Birch Credit Union.
          Nothing on it is an offer, a quote, or financial, insurance or tax advice, and
          no product shown can be purchased or bound here. Product names, rates and
          coverage described may be illustrative and should not be relied on. For
          anything real, contact Northern Birch Credit Union directly.
        </p>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:mob?"flex-start":"center",flexDirection:mob?"column":"row",gap:8}}>
        <div>
          <span style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",display:"block"}}>Northern Birch Credit Union Limited. Member of Central 1 Credit Union. Regulated by FSRA.</span>
        </div>
        <span style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)"}}>Prepared by Thomas Genua, CEO Oodler</span>
      </div>
    </div>
    </div>
  </footer>;
}

// ============ AI INSURANCE ADVISOR PAGE ============
/** True only if the visitor opted in to measurement. Nothing reads this yet:
 *  it is the gate any future measurement should hang off, so the consent
 *  exists before the tracker does. */

function CookieBanner({onHeight}){const mob=useMob();
  // The prerendered HTML carries no banner, and neither does the render that
  // hydrates it; useCookiePref answers "essential" until the real preference
  // is readable.
  const[dismissed,setDismissed]=useState(false);
  const show=!useCookiePref()&&!dismissed;
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
  const choose=(v)=>{writeCookiePref(v);setDismissed(true);if(v==="all")initMeasurement()};
  return(
    <div ref={boxRef} role="region" aria-label="Cookie preferences" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(15,24,41,0.97)",backdropFilter:"blur(10px)",padding:mob?"16px":"16px 24px",zIndex:1600,borderTop:"1px solid rgba(200,184,138,0.2)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",display:"flex",alignItems:mob?"flex-start":"center",gap:16,flexDirection:mob?"column":"row"}}>
        <p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.75)",margin:0,flex:1,lineHeight:1.6}}>
          {MEASUREMENT_DOMAIN
            ?"This site uses only the storage it needs to work. With your permission we also count visits and which products get opened, using a service that sets no cookies and collects nothing personal -- never what you type or search for. Your preference is remembered on this device."
            :"This site uses only the storage it needs to work, and does not measure your visit today. If we add measurement later, we will use the choice you make here. Your preference is remembered on this device."}
        </p>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button ref={ref} onClick={()=>choose("all")} style={{background:C.accentText,border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Allow measurement</button>
          <button onClick={()=>choose("essential")} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.85)"}}>Essential only</button>
        </div>
      </div>
    </div>
  );
}

export default function App({ssrPath}){
  // page is derived from the URL, so a deep link, a refresh and the back
  // button all land on the same screen. ssrPath is how the build-time render
  // says which route it is producing, since there is no location there.
  const[page,setPageState]=useState(()=>typeof window!=="undefined"?pageFromPath(window.location.pathname):pageFromPath(ssrPath||"/"));
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
  useEffect(()=>{applyMeta(page);trackPageview(page)},[page]);
  const[search,setSearch]=useState(false);
  const[login,setLogin]=useState(false);
  const[notifs,setNotifs]=useState(false);
  const lang=useLang();
  const setLang=useCallback((v)=>writeLang(v),[]);
  useEffect(()=>{document.documentElement.lang=LANG_TAG[lang]||"en"},[lang]);
  const[cookieH,setCookieH]=useState(0);   // how far the cookie banner pushes the chat launcher up
  useBreakpoint();                         // re-render the tree when a layout breakpoint is crossed
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
    home:<HomePage setPage={setPage} lang={lang}/>,insurance:<InsurancePage setPage={setPage} lang={lang}/>,advice:<AdvicePage setPage={setPage}/>,apply:<ApplyPage setPage={setPage} lang={lang}/>,travel:<TravelPage setPage={setPage} lang={lang}/>,business:<BusinessPage setPage={setPage} lang={lang}/>,digital:<DigitalPage setPage={setPage} lang={lang}/>,
    estate:<EstatePage setPage={setPage} lang={lang}/>,community:<CommunityPage setPage={setPage} lang={lang}/>,personal:<PersonalPage setPage={setPage} lang={lang}/>,contact:<ContactPage lang={lang}/>,
    mortgages:<MortgagesPage setPage={setPage} lang={lang}/>,cards:<CardsPage setPage={setPage} lang={lang}/>,accounts:<AccountsPage setPage={setPage} lang={lang}/>,
    quote:<QuotePage setPage={setPage} lang={lang}/>,compare:<ComparePage setPage={setPage} lang={lang}/>,claims:<ClaimsPage setPage={setPage}/>,calculators:<CalculatorsPage setPage={setPage} lang={lang}/>,
    booking:<BookingPage setPage={setPage} lang={lang}/>,rates:<RatesPage setPage={setPage} lang={lang}/>,referrals:<ReferralsPage lang={lang}/>,blog:<BlogPage setPage={setPage} lang={lang}/>,
    glossary:<GlossaryPage lang={lang}/>,mobileapp:<MobileAppPage setPage={setPage} lang={lang}/>,dashboard:<DashboardPage setPage={setPage} lang={lang}/>,aiadvisor:<AIAdvisorPage setPage={setPage} lang={lang}/>,
    analyzer:<PolicyAnalyzerPage setPage={setPage}/>,healthcheck:<HealthAssessmentPage setPage={setPage}/>,
    lifesim:<LifeSimPage setPage={setPage}/>,docreader:<DocReaderPage setPage={setPage}/>,
    tax:<TaxPage setPage={setPage}/>,messages:<MessagesPage setPage={setPage}/>,
    privacy:<PrivacyPage lang={lang}/>,accessibility:<AccessibilityPage lang={lang}/>,complaints:<ComplaintsPage lang={lang}/>,terms:<TermsPage lang={lang}/>,leadership:<LeadershipPage setPage={setPage}/>,underwriters:<UnderwritersPage setPage={setPage}/>,
    borrowing:<BorrowingPage setPage={setPage} lang={lang}/>,keskus:<KeskusPage setPage={setPage} lang={lang}/>,phasedask:<PhasedAskPage setPage={setPage}/>,
    // Has no route on purpose: pageFromPath returns it for any URL that is not
    // in ROUTES.
    notfound:<NotFoundPage setPage={setPage}/>,
  };
  return(
    <ToastProvider>
      <div style={{background:C.cream,minHeight:"100vh"}}>
        <a href="#main" className="skip-link">Skip to main content</a>
        <Nav page={page} setPage={setPage} onSearch={()=>setSearch(true)} onLogin={()=>setLogin(true)} onNotifications={()=>setNotifs(true)} lang={lang} setLang={setLang}/>
        <ProposalBanner/>
        {/* The banner above already clears the fixed nav, so this no longer
            needs the 72px of top padding it used to carry. */}
        {lang!=="en"&&<div style={{background:C.birchLight,borderBottom:`1px solid ${C.birch}`,padding:"12px 24px"}}>
          <p style={{maxWidth:1320,margin:"0 auto",fontFamily:fs,fontSize:13,color:C.navy,lineHeight:1.6}}>
            {t("Parts of this site are still only in English. Call us and we will serve you in your language.",lang)}{" "}
            <a href="tel:+14164654659" style={{color:C.accentText,fontWeight:600,whiteSpace:"nowrap"}}>416-465-4659</a>
          </p>
        </div>}
        <main id="main" tabIndex={-1} lang={lang==="en"||TRANSLATED_PAGES.has(page)?undefined:"en"}><ErrorBoundary key={page}><Suspense fallback={<div style={{minHeight:"60vh"}} aria-busy="true" aria-live="polite"><span style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0 0 0 0)"}}>Loading</span></div>}>{pages[page]||pages.home}</Suspense></ErrorBoundary></main>
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

