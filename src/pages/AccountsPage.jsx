import React from "react";
import { Btn, C, Fade, RATE, SH, ff, fs, setApplyIntent, t, track, useW } from '../ui.jsx';

// ============ CHEQUING, SAVINGS & REGISTERED ============
export default function AccountsPage({setPage,lang}){
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
  const grid=(list)=><div className="grid-3-2-1" style={{gap:16,marginBottom:32}}>
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
      <div className="grid-3-2-1" style={{gap:16,marginBottom:32}}>
        {registered.map((r,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #eee",height:"100%"}}>
          <span style={{display:"inline-block",padding:"4px 10px",borderRadius:8,background:`${C.navy}0F`,fontFamily:fs,fontSize:12,fontWeight:700,color:C.navy,marginBottom:10}}>{r.n}</span>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{r.f}</h4>
          <p style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.7,margin:0}}>{r.d}</p>
        </div></Fade>)}
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
        <Btn color={C.accentText} onClick={()=>{setApplyIntent("Chequing account");track("apply_start",{from:"accounts"});setPage("apply")}}>{T("Open an Account")}</Btn>
        <Btn outline color={C.navy} onClick={()=>setPage("rates")}>{T("See All Rates")}</Btn>
      </div>
      <div style={{background:`${C.accentText}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.accent}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Rates are subject to change without notice. Eligible deposits are insured by FSRA; registered account deposits have unlimited coverage. Contact your branch for current rates and account terms.")}</p>
      </div>
    </div>
  </section>;
}
