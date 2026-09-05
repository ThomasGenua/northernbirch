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
                  <div style={{gridColumn:"1/-1",marginTop:8,display:"flex",gap:8}}><Btn small color={color} onClick={e=>{e.stopPropagation();setPage("quote")}}>Get a Quote</Btn><Btn small outline color={color} onClick={e=>{e.stopPropagation();setPage("compare")}}>Compare Plans</Btn></div>
                </div>}
              </Clickable>
            );
}

export default function InsurancePage({setPage}){const mob=useMob();
  const cats=[
    {name:"Life & Health",color:C.accentText,products:[
      {t:"Term Life Insurance",d:"Flexible 10/20/30-year coverage from $100K to $2M. Competitive credit union rates through CUMIS.",f:["Guaranteed level premiums","Convertible to permanent","Spousal and child riders","No exam up to $500K"]},
      {t:"Critical Illness",d:"Tax-free lump sum for 25+ conditions. Use however you choose.",f:["25+ covered conditions","Return of premium option","Partial early-stage payout","Coverage up to $500K"]},
      {t:"Disability Insurance",d:"Replace up to 70% of income. Short and long-term options.",f:["Own-occupation available","Choice of waiting periods","Cost-of-living rider","Covers illness and injury"]},
      {t:"Mortgage Protection",d:"Life and disability tied to your mortgage balance. Easy application.",f:["Apply at mortgage signing","No medical exam","Life, disability, CI options","Joint borrower coverage"]},
    ]},
    {name:"Home & Auto",color:C.greenText,products:[
      {t:"Home Insurance",d:"Exclusive group rates through The Personal. 98% renewal rate.",f:["Exclusive member rates","Replacement cost","Liability up to $2M","Bundle discounts up to 20%"]},
      {t:"Co-op Insurance",d:"Specialized co-op coverage only Northern Birch can provide.",f:["Unit improvement coverage","Loss assessment protection","Co-op bylaw specific","Expert underwriting"]},
      {t:"Auto Insurance",d:"Full Ontario coverage with Ajusto telematics discounts.",f:["Ajusto safe-driving savings","Multi-vehicle discounts","Accident forgiveness","24/7 claims"]},
      {t:"Tenant Insurance",d:"From $25/month. Quote in 2 minutes on the app.",f:["Personal property coverage","Liability up to $2M","Additional living expenses","Quick mobile quoting"]},
    ]},
    {name:"Travel & Specialty",color:C.amberText,products:[
      {t:"Annual Multi-Trip Travel",d:"Emergency medical up to $5M. Perfect for Baltic travellers.",f:["Up to $5M medical","24/7 multilingual assistance","Pre-existing condition options","Group cultural event rates"]},
      {t:"Single-Trip Travel",d:"Flexible coverage for individual trips up to 365 days.",f:["Customizable coverage","Medical evacuation","Cancel for any reason upgrade","Last-minute purchase OK"]},
      {t:"Pet Insurance",d:"Bronze, Silver, Gold plans. 80% reimbursement.",f:["Three plan tiers","No breed restrictions","One annual deductible","Direct vet payment"]},
      {t:"Recreational Vehicle",d:"Boats, ATVs, snowmobiles, motorcycles, campers.",f:["All vehicle types","Seasonal payments","Agreed value coverage","Multi-policy discounts"]},
    ]},
  ];
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SH tag="Insurance Protection" tagColor={C.accentText} title="Protection for every stage of your life" desc="Exclusive member rates through The Personal, CUMIS, and Co-operators. Click any product to learn more."/>
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
          <div style={{flex:1}}><div style={{fontFamily:fs,fontSize:11,color:C.birchText,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Powered by The Personal (Desjardins) + CUMIS (Co-operators) + Manulife</div><h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Exclusive rates for Northern Birch members</h3><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.7}}>650+ organization partnerships. 380+ credit union partnerships. 98% policy renewal rate. Best-in-class partners for every insurance line.</p></div>
          <Btn onClick={()=>setPage("quote")}>Get Your Quote</Btn>
        </div></Fade>
        <div style={{marginTop:48}}><h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 24px"}}>Insurance FAQ</h3>
          <FAQ items={[{q:"How do I get a quote?",a:"Use our online quote calculator for instant estimates, get a quote through the mobile app, or visit any branch. Start online, finish in branch -- your quote follows you."},{q:"Do I need to be a member?",a:"Yes, our insurance is exclusive to Northern Birch members. Join online or at any branch -- membership is open to all Canadians."},{q:"What makes our rates different?",a:"As a member, you get exclusive group rates through The Personal that aren't available to the general public, plus credit union-specific rates through CUMIS."},{q:"How do I file a claim?",a:"Visit our Claims Centre page, call The Personal at 1-888-476-8737 (home/auto/travel), CUMIS at 1-800-263-9120 (life/creditor), or visit your branch."}]}/>
        </div>
      </div>
    </section>
  );
}
