import React, { useState } from "react";
import { Btn, C, SH, ff, fs } from '../ui.jsx';

export default function EstatePage({setPage}){const[s,setS]=useState(0);const stages=["Young Family","Mid-Career","Pre-Retirement","Senior"];return <section className="sec" style={{background:C.cream,}}><div style={{maxWidth:1000,margin:"0 auto"}}><SH tag="Estate Planning" tagColor={C.purple} title="Protect your family across generations"/><div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>{stages.map((st,i)=><button key={i} onClick={()=>setS(i)} style={{flex:1,background:s===i?C.purple:"#fff",border:s===i?"none":"1px solid #ddd",borderRadius:12,padding:14,cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:s===i?"#fff":C.navy}}>{st}</button>)}</div><div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}><h3 style={{fontFamily:ff,fontSize:24,color:C.navy}}>Planning for: {stages[s]}</h3><p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.8}}>Northern Birch advisors combine insurance, investments, and professional referrals to build comprehensive estate plans. Contact Heili Orav, Manager of Wealth &amp; Estate Services, to get started.</p>
<div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20}}>
  <Btn small color={C.purple} onClick={()=>setPage("advice")}>See our advice services &rarr;</Btn>
  <Btn small outline color={C.navy} onClick={()=>setPage("booking")}>Book a Financial Check-Up &rarr;</Btn>
</div></div></div></section>}
