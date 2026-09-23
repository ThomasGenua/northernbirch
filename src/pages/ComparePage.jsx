import React, { useState } from "react";
import { C, ff, fs, SH } from '../ui.jsx';

// This page used to be a table of insurance "plans" -- Essential, Standard and
// Premium life tiers, home and travel tiers, each with a monthly or yearly
// price, coverage limits, a "most popular" badge and a quote button. Every tier,
// price and limit was invented, and Northern Birch does not sell insurance: it
// refers members to insurers, who quote and underwrite.
//
// What a referral-only credit union can honestly publish is what the KINDS of
// cover differ on, and what to ask the insurer. That is what this is now. It
// names no product, no price and no limit.
export default function ComparePage({setPage}){
  const[cat,setCat]=useState(0);
  const topics=[
    {name:"Life",pairs:[
      {a:"Term",b:"Permanent",
       diff:"Term cover lasts a set number of years and ends; permanent cover lasts your whole life and some kinds build a cash value.",
       ask:["How long do I need cover for, and why?","What happens when the term ends?","Can I convert term to permanent later?"]},
    ]},
    {name:"Home",pairs:[
      {a:"Actual cash value",b:"Replacement cost",
       diff:"Actual cash value pays what the damaged thing was worth after depreciation; replacement cost pays what it costs to replace it new.",
       ask:["Which one does this policy use, for the building and for contents?","Are there limits on particular items?","What is and isn't covered for water damage?"]},
    ]},
    {name:"Travel",pairs:[
      {a:"One trip",b:"A year of trips",
       diff:"Some plans cover a single trip; others cover every trip in a year up to a length each. Northern Birch refers members to Allianz Global Assistance, who explain the options and quote them.",
       ask:["Does a condition I already have affect my cover?","What is the longest single trip covered?","What does the plan pay for if I have to cut a trip short?"]},
    ]},
  ];
  const t=topics[cat];
  return(
    <section className="sec" style={{background:C.cream}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="Understanding cover" tagColor={C.accentText} title="What the kinds of cover differ on" desc="Northern Birch does not sell or quote insurance. It refers members to insurers. Before you talk to one, it helps to know what to ask."/>
        <div role="tablist" style={{display:"flex",gap:8,marginBottom:28}}>
          {topics.map((tb,i)=><button key={i} role="tab" aria-selected={cat===i} onClick={()=>setCat(i)} style={{flex:1,background:cat===i?C.navy:"#fff",border:cat===i?"none":"1px solid #ddd",borderRadius:12,padding:"12px 8px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:cat===i?"#fff":C.navy}}>{tb.name}</button>)}
        </div>
        {t.pairs.map((pr,i)=>
          <div key={i} style={{background:"#fff",borderRadius:20,padding:"28px 30px",border:"1px solid #eee"}}>
            <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 12px"}}>{pr.a} <span style={{color:"#707070",fontWeight:400}}>vs</span> {pr.b}</h3>
            <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.8,margin:"0 0 20px"}}>{pr.diff}</p>
            <h4 style={{fontFamily:fs,fontSize:13,color:C.navy,margin:"0 0 10px",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Questions to ask the insurer</h4>
            <ul style={{margin:0,paddingLeft:20}}>
              {pr.ask.map((q,qi)=><li key={qi} style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.9}}>{q}</li>)}
            </ul>
          </div>)}
        <div style={{textAlign:"center",marginTop:28}}>
          <button onClick={()=>setPage("booking")} style={{background:C.navy,border:"none",borderRadius:12,padding:"14px 28px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>Talk to an advisor &rarr;</button>
        </div>
      </div>
    </section>
  );
}

// ============ CLAIMS WIZARD ============
