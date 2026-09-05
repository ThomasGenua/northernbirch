import React from "react";
import { Btn, C, Fade, SH, ff, fs } from '../ui.jsx';

// ============ REFERRALS PAGE ============
export default function BlogPage({setPage}){
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
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <SH tag="Blog & News" tagColor={C.accentText} title="Financial insights for our community" desc="Expert advice, product updates, and community news from Northern Birch Credit Union."/>
        <div className="grid-2-1" style={{gap:20}}>
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
