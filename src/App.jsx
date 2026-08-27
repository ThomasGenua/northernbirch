import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import AdvicePage from './pages/AdvicePage.jsx';

// Loaded on demand. Someone landing on a product page pays for none of this.
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
import { BANKING, BirchTrees, Btn, C, Clickable, Cornflower, Daisy, ErrorBoundary, FAQ, Fade, FlagStripe, FolkBorder, LANG_TAG, RATE, ROUTES, SH, TRANSLATED_PAGES, applyMeta, callAI, ff, fs, g, pageFromPath, readCookiePref, readLang, t, useBreakpoint, useFocusTrap, useW, writeCookiePref, writeLang } from './ui.jsx';

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
    {title:"Mobile Banking App",page:"mobileapp",cat:"Digital"},{title:"Estate Planning",page:"estate",cat:"Planning"},{title:"Financial Advice",page:"advice",cat:"Planning",kw:"advice advisory adviser advisor financial planning wealth management retirement planning investment advice check-up"},{title:"Financial Planning",page:"advice",cat:"Planning",kw:"plan planning retirement wealth advisor"},{title:"Retirement Planning",page:"advice",cat:"Planning",kw:"retirement rrsp rrif pension retire income"},{title:"Wealth Management",page:"advice",cat:"Planning",kw:"wealth invest portfolio aviso qtrade virtualwealth mutual funds managed"},{title:"Financial Check-Up",page:"advice",cat:"Planning",kw:"check up checkup review free advisor heili"},{title:"KESKUS Branch",page:"community",cat:"Community"},
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
  const nav=[{l:"Banking",p:"personal",kids:[{l:"Chequing & Savings",p:"accounts",d:"No-fee everyday accounts, GICs, TFSA & RRSP"},{l:"Mortgages",p:"mortgages",d:"Fixed, variable, high-ratio & co-op financing"},{l:"Credit Cards",p:"cards",d:"Collabria cash back, low rate & travel rewards"},{l:"Personal Banking",p:"personal",d:"The full member line-up in one place"},{l:"Rates",p:"rates",d:"Today's mortgage, GIC and lending rates"}]},{l:"Insurance",p:"insurance"},{l:"Advice",p:"advice"},{l:"Travel",p:"travel"},{l:"Business",p:"business"},{l:"Digital",p:"digital"},{l:"Tools",p:"quote"},{l:"Rates",p:"rates"},{l:"Community",p:"community"}];
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
/** True only if the visitor opted in to measurement. Nothing reads this yet:
 *  it is the gate any future measurement should hang off, so the consent
 *  exists before the tracker does. */

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
    home:<HomePage setPage={setPage} lang={lang}/>,insurance:<InsurancePage setPage={setPage} lang={lang}/>,advice:<AdvicePage setPage={setPage}/>,travel:<TravelPage setPage={setPage} lang={lang}/>,business:<BusinessPage setPage={setPage} lang={lang}/>,digital:<DigitalPage setPage={setPage} lang={lang}/>,
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

