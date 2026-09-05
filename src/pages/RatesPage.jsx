import React from "react";
import { Btn, C, Fade, RATE_TABLES, SH, ff, fs, ratesEffectiveLabel } from '../ui.jsx';

export default function RatesPage({setPage}){
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="Current Rates" tagColor={C.greenText} title="Competitive rates for members" desc="All rates are subject to change. Contact your branch for the most current rates and special offers."/>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:"-32px 0 24px"}}>Rates effective {ratesEffectiveLabel()}.</p>
        {[
          {title:"Mortgage Rates",color:C.accentText,go:["mortgages","Explore mortgages"],rates:RATE_TABLES.mortgage},
          {title:"Deposit & Savings Rates",color:C.greenText,go:["accounts","Compare accounts"],rates:RATE_TABLES.deposit},
          {title:"Lending Rates",color:C.amberText,go:["cards","Compare credit cards"],rates:RATE_TABLES.lending},
        ].map((section,si)=>(
          <Fade key={si} delay={si*0.1}><div style={{marginBottom:32}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>{section.title}</h3>
            <div style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #eee"}}>
              {section.rates.map(([term,rate],ri)=><div key={term} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 24px",borderBottom:ri<section.rates.length-1?"1px solid #f5f5f5":"none",background:ri%2===0?"#fff":"#fafafa"}}>
                <span style={{fontFamily:fs,fontSize:14,color:C.navy}}>{term}</span>
                <span style={{fontFamily:fs,fontSize:16,color:section.color,fontWeight:700}}>{rate}</span>
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
