import React from "react";
import { Btn, C, Fade, RATE, SH, ff, fs, setApplyIntent, t, track, useW } from '../ui.jsx';


// ============ HOME PAGE ============
// ============ MORTGAGES ============
export default function MortgagesPage({setPage,lang}){
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
          <Btn color={C.greenFill} onClick={()=>{setApplyIntent("Mortgage pre-approval");track("apply_start",{from:"mortgages"});setPage("apply")}}>{T("Get Pre-Approved")}</Btn>
          <Btn outline color={C.navy} onClick={()=>setPage("calculators")}>{T("Payment Calculator")}</Btn>
        </div>
      </div></Fade>
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("Choose the structure that fits")}</h3>
      <div className="grid-3-2-1" style={{gap:16,marginBottom:40}}>
        {options.map((o,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,padding:26,border:"1px solid #eee",borderTop:`3px solid ${o.c}`,height:"100%"}}>
          <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{o.t}</h4>
          <p style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.7,margin:0}}>{o.d}</p>
        </div></Fade>)}
      </div>
      <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 16px"}}>{T("How it works")}</h3>
      <div className="grid-3-2-1" style={{gap:16,marginBottom:32}}>
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
