import React from "react";
import { Btn, C, Fade, SH, ff, fs } from '../ui.jsx';

// ============ REFERRALS PAGE ============
export default function BlogPage({setPage}){
  const posts=[
    {title:"Introducing Northern Birch Insurance Shield",go:["insurance","See insurance products"],date:"March 2026",cat:"Announcement",excerpt:"How Northern Birch refers members to insurers for life, home, auto and travel cover -- and why the insurer, not the credit union, quotes and underwrites it.",color:C.accentText},
    {title:"Why Every Homeowner Needs Mortgage Protection",go:["mortgages","Explore mortgages"],date:"March 2026",cat:"Insurance Education",excerpt:"Your home is likely your family's biggest asset. Mortgage protection insurance ensures your family keeps their home if the unexpected happens. Here's what you need to know about creditor insurance.",color:C.greenText},
    {title:"Travelling to Estonia or Latvia This Summer?",go:["travel","Travel & FX services"],date:"March 2026",cat:"Travel",excerpt:"Travel insurance for Northern Birch members comes by referral to Allianz Global Assistance, who quote it online or by phone and set the coverage and eligibility. Plus how to order euros before you go.",color:C.amberText},
    {title:"Co-op & Co-ownership Mortgages: What You Need to Know",go:["mortgages","Co-op and co-ownership lending"],date:"March 2026",cat:"Insurance Education",excerpt:"Many lenders will not finance a co-op or co-ownership apartment. Northern Birch does. What the building's documents need to show, and what to ask before you make an offer.",color:C.purple},
    {title:"5 Insurance Mistakes Young Professionals Make",go:["healthcheck","Take the financial check-up"],date:"February 2026",cat:"Financial Literacy",excerpt:"From skipping tenant insurance to underestimating disability risk, young professionals often overlook critical coverage. Here are the five most common mistakes and how to avoid them.",color:C.redText},
    {title:"KESKUS Branch: What to Expect",go:["keskus","About the KESKUS branch"],date:"February 2026",cat:"Community",excerpt:"Our new flagship branch at the KESKUS International Estonian Centre is under construction. Here's a preview of the services, technology, and community features you'll find when we open.",color:C.birchText},
    {title:"Group Benefits: A Small Business Owner's Guide",go:["business","Business solutions"],date:"February 2026",cat:"Business",excerpt:"What small employers should look for in group health and dental benefits, and the questions to ask an insurer before signing up.",color:C.greenText},
    {title:"When a Member Dies: What Families Need to Know",go:["estate","Estates"],date:"January 2026",cat:"Estates",excerpt:"Losing someone is hard enough without paperwork you don't understand. What happens to a member's accounts, who handles them, and who to call first.",color:C.navy},
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
