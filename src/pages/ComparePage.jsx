import React, { useState } from "react";
import { C, SH, ff, fs } from '../ui.jsx';

export default function ComparePage({setPage}){
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
