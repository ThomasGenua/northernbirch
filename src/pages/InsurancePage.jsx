import React, { useState } from "react";
import { Btn, C, Clickable, FAQ, Fade, SH, ff, fs, useMob } from '../ui.jsx';

// ============ REUSE EXISTING PAGES (condensed) ============
// One insurance product row. This used to be an inline map callback that
// called useState per item, so the number of hooks changed with the length of
// the list — the rule React actually cares about, not a style preference.
function InsuranceProductRow({p,color,setPage}){
  const[open,setOpen]=useState(false);
  return(
              <Clickable onClick={()=>setOpen(!open)} style={{background:"#fff",borderRadius:20,padding:"28px 32px",border:open?`2px solid ${color}25`:"1px solid #eee",cursor:"pointer",transition:"all 0.3s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><h4 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{p.t}</h4><p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",margin:0,lineHeight:1.6}}>{p.d}</p></div>
                  <span style={{color:open?color:"#707070",fontSize:18,fontWeight:600,transform:open?"rotate(45deg)":"none",transition:"transform 0.3s",marginLeft:12}}>+</span>
                </div>
                {open&&<div className="grid-2-1" style={{marginTop:16,paddingTop:16,borderTop:"1px solid #f0f0f0",gap:8}}>
                  {p.f.map((feat,fi)=><div key={fi} style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:16,height:16,borderRadius:4,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:color,fontWeight:700}}>{"\u2713"}</span></div><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{feat}</span></div>)}
                  <div style={{gridColumn:"1/-1",marginTop:8,display:"flex",gap:8}}><Btn small color={color} onClick={e=>{e.stopPropagation();setPage("quote")}}>Talk to an advisor</Btn><Btn small outline color={color} onClick={e=>{e.stopPropagation();setPage("compare")}}>Compare Plans</Btn></div>
                </div>}
              </Clickable>
            );
}

export default function InsurancePage({setPage}){const mob=useMob();
  const cats=[
    {name:"Life & Health",color:C.accentText,products:[
      {t:"Term Life Insurance",d:"Term life cover is quoted and underwritten by an insurer. Northern Birch refers you; it does not set terms, amounts or price.",f:["Guaranteed level premiums","Convertible to permanent","Spousal and child riders","No exam up to $500K"]},
      {t:"Critical Illness",d:"Tax-free lump sum for 25+ conditions. Use however you choose.",f:["25+ covered conditions","Return of premium option","Partial early-stage payout","Coverage up to $500K"]},
      {t:"Disability Insurance",d:"Replace up to 70% of income. Short and long-term options.",f:["Own-occupation available","Choice of waiting periods","Cost-of-living rider","Covers illness and injury"]},
      {t:"Mortgage Protection",d:"Life and disability tied to your mortgage balance. Easy application.",f:["Apply at mortgage signing","No medical exam","Life, disability, CI options","Joint borrower coverage"]},
    ]},
    {name:"Home & Auto",color:C.greenText,products:[
      {t:"Home Insurance",d:"Referred to an insurer, who quotes and underwrites it.",f:["Exclusive member rates","Replacement cost","Liability up to $2M","Bundle discounts up to 20%"]},
      {t:"Co-op & Co-ownership",d:"Not insurance: Northern Birch's co-op offering is mortgage lending for co-op and co-ownership homes, which most lenders decline.",f:["Co-op mortgages","Co-ownership mortgages","See the mortgages page"]},
      {t:"Auto Insurance",d:"Full Ontario coverage with Ajusto telematics discounts.",f:["Ajusto safe-driving savings","Multi-vehicle discounts","Accident forgiveness","24/7 claims"]},
      {t:"Tenant Insurance",d:"Quoted and underwritten by an insurer. Northern Birch can refer you.",f:["Personal property coverage","Liability up to $2M","Additional living expenses","Quick mobile quoting"]},
    ]},
    {name:"Travel & Specialty",color:C.amberText,products:[
      {t:"Travel Insurance",d:"Referral to Allianz Global Assistance (agency code 8528). Quoted by Allianz online or through their contact centre -- not by Northern Birch.",f:["Underwritten by Allianz Global Assistance","Agency code 8528","Coverage and eligibility set by Allianz"]},
      {t:"Single-Trip Travel",d:"Flexible coverage for individual trips up to 365 days.",f:["Customizable coverage","Medical evacuation","Cancel for any reason upgrade","Last-minute purchase OK"]},
      {t:"Pet Insurance",d:"Bronze, Silver, Gold plans. 80% reimbursement.",f:["Three plan tiers","No breed restrictions","One annual deductible","Direct vet payment"]},
      {t:"Recreational Vehicle",d:"Boats, ATVs, snowmobiles, motorcycles, campers.",f:["All vehicle types","Seasonal payments","Agreed value coverage","Multi-policy discounts"]},
    ]},
  ];
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SH tag="Insurance Protection" tagColor={C.accentText} title="Protection for every stage of your life" desc="Northern Birch refers members to insurers, who quote and underwrite. Click any product to learn more."/>
        {cats.map((cat,ci)=><Fade key={ci} delay={ci*0.08}><div style={{marginBottom:40}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${cat.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:cat.color,fontSize:18,fontWeight:800}}>{ci+1}</span></div>
            <h3 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:0}}>{cat.name}</h3>
          </div>
          <div className="grid-2-1" style={{gap:16}}>
            {cat.products.map((p,pi)=><InsuranceProductRow key={pi} p={p} color={cat.color} setPage={setPage}/>)}
          </div>
        </div></Fade>)}
        <Fade><div style={{background:`linear-gradient(135deg,${C.navy},#2a4a6a)`,borderRadius:24,padding:mob?"28px 24px":"44px 52px",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",alignItems:"center",gap:mob?24:40}}>
          <div style={{flex:1}}><div style={{fontFamily:fs,fontSize:11,color:C.birchText,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Referral only &mdash; see the underwriter matrix for which insurers are live and which are proposed</div><h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Exclusive rates for Northern Birch members</h3><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.7}}>650+ organization partnerships. 380+ credit union partnerships. 98% policy renewal rate. Best-in-class partners for every insurance line.</p></div>
          <Btn onClick={()=>setPage("quote")}>Get Your Quote</Btn>
        </div></Fade>
        <div style={{marginTop:48}}><h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 24px"}}>Insurance FAQ</h3>
          <FAQ items={[{q:"How do I get insurance through Northern Birch?",a:"Northern Birch does not quote or sell insurance directly. Tell an advisor what you need and they connect you with an insurer who can quote it. Start online, or visit any branch."},{q:"Do I need to be a member?",a:"Yes, our insurance is exclusive to Northern Birch members. Join online or at any branch -- membership is open to all Canadians."},{q:"What makes our rates different?",a:"Member pricing and carrier arrangements are part of this proposal and are not confirmed. Contact Northern Birch for what is actually available."},{q:"How do I file a claim?",a:"Visit our Claims Centre page, call Northern Birch on 416-465-4659, or visit your branch. They will tell you which insurer holds your policy and how to reach them."}]}/>
        </div>
      </div>
    </section>
  );
}
