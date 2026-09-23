import React from "react";
import { Btn, C, Fade, SH, ff, fs, t, useW } from '../ui.jsx';

// ============ KESKUS ============
// The launch page for the new branch at the KESKUS International Estonian
// Centre. The opening date, street number and hours are not confirmed, so the
// page says so instead of inventing them; everything under "What we plan" is a
// plan, and the page labels it that way.
const OPEN = "TO CONFIRM";

export default function KeskusPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const plans=[
    ["Everyday banking","Accounts, deposits, mortgages and lending, the same as at our other branches."],
    ["Advice in three languages","Meetings with an advisor in English, Estonian or Latvian."],
    ["Part of KESKUS","A branch inside the community centre, so banking is next door to the events, classes and gatherings the building hosts."],
  ];
  const branches=[["Toronto","416-922-2551"],["Toronto","416-465-4659"],["Hamilton","905-527-4344"],["Toll-free","1-866-844-3828"]];
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <SH tag={T("Coming to KESKUS")} tagColor={C.greenText} title={T("Our new branch at the KESKUS International Estonian Centre")} desc={T("A flagship branch on Madison Avenue in Toronto, inside the new home of the Estonian community.")}/>
      <div style={{background:C.navy,borderRadius:20,padding:w<=768?"22px 20px":"26px 30px",display:"flex",gap:28,flexWrap:"wrap",marginBottom:24}}>
        {[["Opening date",OPEN],["Hours",OPEN],["Phone",OPEN]].map(([l,v])=><div key={l}>
          <div style={{fontFamily:fs,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"rgba(255,255,255,0.8)"}}>{T(l)}</div>
          <div style={{fontFamily:ff,fontSize:22,color:"#fff",marginTop:4}}>{v===OPEN?T("To be announced"):v}</div>
        </div>)}
      </div>
      <h2 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 6px"}}>{T("What we plan")}</h2>
      <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:"0 0 16px"}}>{T("Plans may change before opening.")}</p>
      <div className="grid-3-2-1" style={{gap:14,marginBottom:28}}>
        {plans.map(([h,d],i)=><Fade key={h} delay={i*0.05}><div style={{background:"#fff",borderRadius:16,border:"1px solid #eee",padding:"20px 22px",height:"100%"}}>
          <h3 style={{fontFamily:fs,fontSize:16,fontWeight:700,color:C.navy,margin:"0 0 6px"}}>{T(h)}</h3>
          <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.7,margin:0}}>{T(d)}</p>
        </div></Fade>)}
      </div>
      <div style={{background:"#fff",borderRadius:18,border:"1px solid #eee",padding:"22px 26px"}}>
        <h2 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 10px"}}>{T("Until it opens")}</h2>
        <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.7,margin:"0 0 14px"}}>{T("Our Toronto and Hamilton branches are open as usual.")}</p>
        <ul style={{listStyle:"none",padding:0,margin:"0 0 18px",display:"flex",gap:"8px 24px",flexWrap:"wrap"}}>
          {branches.map(([n,p])=><li key={p} style={{fontFamily:fs,fontSize:14,color:C.navy}}><strong>{T(n)}</strong> <a href={`tel:${p.replace(/-/g,"")}`} style={{color:C.accentText}}>{p}</a></li>)}
        </ul>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn small color={C.navy} onClick={()=>setPage("contact")}>{T("Branches and hours")}</Btn>
          <Btn small outline color={C.navy} onClick={()=>setPage("booking")}>{T("Book an advisor")}</Btn>
        </div>
      </div>
    </div>
  </section>;
}
