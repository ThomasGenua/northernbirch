import React from "react";
import { Btn, C, Fade, RATE, SH, ff, fs, t, useW } from '../ui.jsx';
import ratesData from '../data/rates.json';

// ============ BORROWING ============
// One place for everything a member can borrow: mortgages, loans and lines of
// credit, co-op and co-ownership mortgages, and Collabria credit cards. Each
// card sends the member to the page that already covers that product in depth.
//
// Only rates confirmed in the content review are quoted here (see the
// "verified" block in src/data/rates.json). Loan and line-of-credit rates are
// still unverified, so this page sends members to the rates table and an
// advisor rather than repeating a number nobody has checked.
export default function BorrowingPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const items=[
    {k:"mortgages",c:C.navy,tag:"Mortgages",h:"Buy, renew or refinance a home",
     d:"Fixed and variable terms, high-ratio mortgages for smaller down payments, and pre-approval before you shop.",
     facts:[[RATE.m3,"3-year closed"],[RATE.m5hr,"5-year variable, high ratio"]],note:ratesData.guarantee,cta:"See mortgages"},
    {k:"rates",c:C.accentText,tag:"Loans and lines of credit",h:"Borrow for a car, a renovation or to consolidate debt",
     d:"Personal loans with a fixed repayment schedule, and lines of credit you draw on and repay as you need. An advisor sets the rate with you when you apply.",
     facts:[],note:"Posted loan and line-of-credit rates are on the rates page.",cta:"See today's rates"},
    {k:"mortgages",c:C.greenText,tag:"Co-ops and co-ownerships",h:"Financing most lenders turn down",
     d:"Toronto has many co-operative and co-ownership apartments, and many banks will not lend on them. Northern Birch does. Ask about the building before you make an offer.",
     facts:[],note:"Lending depends on the building and its documents.",cta:"Co-op and co-ownership lending"},
    {k:"cards",c:C.purple,tag:"Credit cards",h:"Collabria Mastercard",
     d:"Credit cards issued by Collabria for credit union members, with purchase, device, rental car and travel insurance built into eligible cards.",
     facts:[],note:"Cardholder service: 1-855-341-4643.",cta:"See cards and their benefits"},
  ];
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <SH tag={T("Borrowing")} tagColor={C.navy} title={T("Borrow from your credit union")} desc={T("Mortgages, loans and lines of credit, co-op and co-ownership mortgages, and credit cards. Talk to one advisor about all of it.")}/>
      <div className="grid-2-1" style={{gap:18,marginBottom:28}}>
        {items.map((it,i)=><Fade key={i} delay={i*0.06}><div style={{background:"#fff",borderRadius:20,border:"1px solid #eee",borderTop:`4px solid ${it.c}`,padding:"24px 26px",height:"100%",display:"flex",flexDirection:"column"}}>
          <span style={{fontFamily:fs,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:it.c}}>{T(it.tag)}</span>
          <h2 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"6px 0 10px"}}>{T(it.h)}</h2>
          <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.75,margin:"0 0 14px"}}>{T(it.d)}</p>
          {it.facts.length>0&&<div style={{display:"flex",gap:22,flexWrap:"wrap",marginBottom:10}}>
            {it.facts.map(([v,l])=><div key={l}><div style={{fontFamily:ff,fontSize:26,fontWeight:700,color:C.navy}}>{v}</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>{T(l)}</div></div>)}
          </div>}
          <p style={{fontFamily:fs,fontSize:12.5,color:"#6B6B6B",margin:"0 0 18px"}}>{T(it.note)}</p>
          <div style={{marginTop:"auto"}}><Btn small outline color={it.c} onClick={()=>setPage(it.k)}>{T(it.cta)} &rarr;</Btn></div>
        </div></Fade>)}
      </div>
      <div style={{background:"#fff",borderRadius:18,border:"1px solid #eee",padding:"22px 26px",display:"flex",gap:18,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
        <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.7,margin:0,maxWidth:640}}>{T("Not sure which fits? An advisor can look at a mortgage, a line of credit and a card together, in English, Estonian or Latvian.")}</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn small color={C.navy} onClick={()=>setPage("booking")}>{T("Book an advisor")}</Btn>
          <Btn small outline color={C.navy} onClick={()=>setPage("apply")}>{T("Start an application")}</Btn>
        </div>
      </div>
    </div>
  </section>;
}
