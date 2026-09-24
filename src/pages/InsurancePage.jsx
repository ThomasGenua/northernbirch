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
                  <div><h4 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{p.t} <span style={{fontFamily:fs,fontSize:11,fontWeight:700,verticalAlign:"middle",padding:"2px 8px",borderRadius:999,marginLeft:6,background:p.live?"#E6F4EC":"#FFF4DD",color:p.live?C.greenText:C.amberText}}>{p.live?"Available":"Proposed"}</span></h4><p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",margin:0,lineHeight:1.6}}>{p.d}</p></div>
                  <span style={{color:open?color:"#707070",fontSize:18,fontWeight:600,transform:open?"rotate(45deg)":"none",transition:"transform 0.3s",marginLeft:12}}>+</span>
                </div>
                {open&&<div className="grid-2-1" style={{marginTop:16,paddingTop:16,borderTop:"1px solid #f0f0f0",gap:8}}>
                  {p.f.map((feat,fi)=><div key={fi} style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:16,height:16,borderRadius:4,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:color,fontWeight:700}}>{feat.endsWith("?")?"?":"\u2713"}</span></div><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{feat}</span></div>)}
                  <div style={{gridColumn:"1/-1",marginTop:8,display:"flex",gap:8}}>{p.link?<Btn small color={color} onClick={e=>{e.stopPropagation();setPage(p.link)}}>{p.link==="cards"?"See card benefits":"See co-op lending"}</Btn>:<><Btn small color={color} onClick={e=>{e.stopPropagation();setPage("booking")}}>Talk to an advisor</Btn><Btn small outline color={color} onClick={e=>{e.stopPropagation();setPage("compare")}}>Compare kinds of cover</Btn></>}</div>
                </div>}
              </Clickable>
            );
}

export default function InsurancePage({setPage}){const mob=useMob();
  // Only travel (Allianz) and the insurance built into Collabria cards exist
  // today. Every other line is part of Oodler's proposal -- see
  // content/partners.json and /underwriters. The bullets are questions to take
  // to an insurer, not features: Northern Birch neither sets nor knows them.
  const cats=[
    {name:"Life & Health",color:C.accentText,products:[
      {t:"Term Life Insurance",live:false,d:"Cover for a set number of years. An insurer quotes and underwrites it; Northern Birch would refer you.",f:["How long do I need cover for?","What happens when the term ends?","Can it be converted to permanent cover?","Does it need a medical exam?"]},
      {t:"Critical Illness",live:false,d:"A lump sum if you are diagnosed with an illness the policy lists. Which illnesses, and how much, are set by the insurer.",f:["Which conditions are covered?","Is there a survival period?","Is part paid for early-stage illness?","Can premiums be returned?"]},
      {t:"Disability Insurance",live:false,d:"Replaces part of your income if you cannot work. How much, and for how long, is set by the insurer.",f:["What share of income is replaced?","How long is the waiting period?","Own occupation or any occupation?","Does it cover illness as well as injury?"]},
      {t:"Mortgage Protection",live:false,d:"Life or disability cover tied to your mortgage balance, usually offered when you take the mortgage.",f:["Does the cover shrink with the balance?","Who is the beneficiary?","Is it cheaper than term life for the same amount?","Can it move with me at renewal?"]},
    ]},
    {name:"Home & Auto",color:C.greenText,products:[
      {t:"Home Insurance",live:false,d:"Cover for your home and belongings, and your liability. An insurer quotes and underwrites it; Northern Birch would refer you.",f:["Replacement cost or actual cash value?","What is the liability limit?","Is water damage covered?","What is the deductible?"]},
      {t:"Co-op & Co-ownership",live:true,link:"mortgages",d:"Not insurance: Northern Birch's co-op offering is mortgage lending for co-op and co-ownership homes, which most lenders decline.",f:["Co-op mortgages","Co-ownership mortgages","See the mortgages page"]},
      {t:"Auto Insurance",live:false,d:"Ontario auto cover. An insurer quotes and underwrites it; Northern Birch would refer you.",f:["What is the liability limit?","Is collision included?","Is there accident forgiveness?","How are claims made?"]},
      {t:"Tenant Insurance",live:false,d:"Cover for a renter's belongings and liability. An insurer quotes and underwrites it; Northern Birch would refer you.",f:["What are my belongings worth?","What is the liability limit?","Are extra living costs covered?","What is the deductible?"]},
    ]},
    {name:"Travel & Card Cover",color:C.amberText,products:[
      {t:"Travel Insurance",live:true,d:"Referral to Allianz Global Assistance (agency code 8528). Quoted by Allianz online or through their contact centre -- not by Northern Birch.",f:["Underwritten by Allianz Global Assistance","Agency code 8528","Coverage and eligibility set by Allianz","Quoted online or by phone"]},
      {t:"Insurance on your Collabria card",live:true,link:"cards",d:"Eligible Collabria Mastercard cards include purchase, device, rental car and travel cover. You may already have it.",f:["Purchase protection and extended warranty","Mobile device","Auto rental collision","Trip cancellation, baggage, travel assistance"]},
    ]},
  ];
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SH tag="Insurance Protection" tagColor={C.accentText} title="Protection for every stage of your life" desc="Northern Birch refers members to insurers, who quote and underwrite. Travel and card cover are available today; the other lines are proposed. Open any one for the questions worth asking."/>
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
          <div style={{flex:1}}><div style={{fontFamily:fs,fontSize:11,color:C.birchText,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Referral only &mdash; see the underwriter matrix for which insurers are live and which are proposed</div><h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Not sure what you need?</h3><p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.75)",margin:0,lineHeight:1.7}}>Set out roughly what you are looking for in the Coverage Explorer, then bring it to an advisor. It is not a quote, and it asks for nothing personal.</p></div>
          <Btn onClick={()=>setPage("quote")}>Open the Coverage Explorer</Btn>
        </div></Fade>
        <div style={{marginTop:48}}><h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 24px"}}>Insurance FAQ</h3>
          <FAQ items={[{q:"How do I get insurance through Northern Birch?",a:"Northern Birch does not quote or sell insurance directly. Tell an advisor what you need and they connect you with an insurer who can quote it. Start online, or visit any branch."},{q:"Do I need to be a member?",a:"Referrals are a service for Northern Birch members. Ask any branch about joining."},{q:"Who is the insurer?",a:"Travel insurance is Allianz Global Assistance. The insurance on Collabria cards is underwritten by American Bankers Insurance Company of Florida (Assurant) and Desjardins Financial Security. For every other line the insurer has not been chosen: those lines are proposed and not available yet."},{q:"How do I file a claim?",a:"Claims go to the insurer, not to Northern Birch. The Claims page says who to call; if you are not sure which insurer holds your policy, call Northern Birch on 416-465-4659."}]}/>
        </div>
      </div>
    </section>
  );
}
