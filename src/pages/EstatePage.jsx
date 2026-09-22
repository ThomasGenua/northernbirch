import React from "react";
import { Btn, C, SH, ff, fs } from '../ui.jsx';

// This page used to sell planning for estates -- wills, trusts and tax-efficient
// strategies across four life stages. Northern Birch does not do that. What it
// runs is an estates function: administering the accounts of a member who has
// died, for the family and the executor. That is administration, not planning,
// and presenting it as a planning service was a claim the credit union could
// not stand behind.
//
// So the page describes what actually happens, at the moment people actually
// need it. It deliberately does not list required documents or timelines as
// though they were Northern Birch's own process -- those were never confirmed,
// and a family working through a bereavement should get them from a person,
// not from a demonstration.
export default function EstatePage({setPage}){
  const steps=[
    {t:"Let the credit union know",d:"Contact Northern Birch when a member has died. Someone will explain what happens to the accounts and what the family or executor will need to provide."},
    {t:"The executor is identified",d:"Accounts are handled with the person named to administer the estate. They will be asked to confirm who they are and their authority to act."},
    {t:"Accounts are settled",d:"Northern Birch administers the member's accounts according to the estate. Staff can explain each step as it happens."},
  ];
  return <section className="sec" style={{background:C.cream}}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <SH tag="Estates" tagColor={C.purple} title="When a member has died" desc="Northern Birch helps families and executors settle the accounts of a member who has passed away. This is the administration of an estate, not planning one."/>

      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
        {steps.map((s,i)=>
          <div key={i} style={{background:"#fff",borderRadius:18,padding:"22px 26px",border:"1px solid #eee",display:"flex",gap:18,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.purple,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:fs,fontWeight:800}}>{i+1}</div>
            <div>
              <h3 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{s.t}</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.75}}>{s.d}</p>
            </div>
          </div>)}
      </div>

      <div style={{background:`${C.purple}0D`,borderRadius:18,padding:"24px 28px",marginBottom:24}}>
        <h3 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 8px"}}>Planning your own estate?</h3>
        <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.8,margin:0}}>
          Wills, trusts and planning for what happens after you die are legal work. Northern
          Birch does not provide them. A lawyer or notary can, and an advisor at the credit union can talk you
          through how your accounts and registered plans would be handled.
        </p>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <Btn small color={C.purple} onClick={()=>setPage("contact")}>Contact a branch &rarr;</Btn>
        <Btn small outline color={C.navy} onClick={()=>setPage("advice")}>Talk to an advisor &rarr;</Btn>
      </div>
    </div>
  </section>;
}
