import React, { useState } from "react";
import { Btn, C, Clickable, ff, fs, SH } from '../ui.jsx';
import facts from '../../content/facts.json';

// ============ CLAIMS: WHO TO CALL ============
// This used to be a claim-filing wizard that took a policy number, the
// incident and health details, then said the insurer had been told and an
// adjuster would call within two days. None of that was true: the demo
// discards what it is sent, and Northern Birch refers members to insurers --
// it does not hold their policies or open claims. What a member mid-claim
// actually needs is the right number, so that is what this page gives.
//
// Numbers come from content/facts.json. Where the insurer's own claims number
// is not recorded there, the page says where to find it rather than guessing.
const PHONE = Object.fromEntries(facts.phones.map((p) => [p.id, p.number]));
const tel = (n) => `tel:+1${n.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")}`;

const TYPES = [
  {v:"card",l:"Insurance on my Collabria card",d:"Purchase protection, extended warranty, mobile device, rental car, trip cancellation, baggage",
   who:"Collabria cardholder service",phone:PHONE.collabria,
   say:"Call Collabria, or the number on the back of your card. They will send the claim to the insurer named in your card's certificate of insurance."},
  {v:"travel",l:"Travel insurance",d:"Medical emergency, trip cancellation or interruption, baggage",
   who:"Allianz Global Assistance",phone:null,
   say:"Travel insurance bought through a Northern Birch referral is underwritten by Allianz Global Assistance. Call the claims or assistance number on your Allianz policy documents. In a medical emergency abroad, call them as soon as you can, before treatment where possible."},
  {v:"own",l:"Home, auto, tenant, life, critical illness or disability",d:"A policy you hold with an insurer",
   who:"Your insurer",phone:null,
   say:"Call the claims number on your policy documents. Northern Birch does not hold your policy and cannot open a claim for you. If you are not sure which insurer you are with, call Northern Birch and we will help you find out."},
  {v:"creditor",l:"Insurance on a Northern Birch loan or mortgage",d:"Life or disability cover tied to a balance",
   who:"Your branch",phone:PHONE["latvian-centre"],
   say:"Mortgage and loan protection through Northern Birch is proposed and not available yet. If you already have cover on a Northern Birch loan, your branch can tell you who provides it."},
];

export default function ClaimsPage({setPage}){
  const[type,setType]=useState(null);
  const t=TYPES.find((x)=>x.v===type);
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <SH tag="Claims" tagColor={C.redText} title="Who to call about a claim" desc="Claims are made to the insurer, not to Northern Birch. Choose what the claim is about and we will tell you who to call."/>
        {!t?<div className="grid-2-1" style={{gap:16}}>
          {TYPES.map((x)=><Clickable key={x.v} onClick={()=>setType(x.v)} style={{background:"#fff",border:"1px solid #eee",borderRadius:16,padding:"22px 24px",cursor:"pointer"}}>
            <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 4px",fontWeight:700}}>{x.l}</h3>
            <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0,lineHeight:1.55}}>{x.d}</p>
          </Clickable>)}
        </div>:<div role="region" aria-labelledby="claim-who" style={{background:"#fff",borderRadius:24,padding:"32px 36px",border:"1px solid #eee"}}>
          <div style={{fontFamily:fs,fontSize:12,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:C.redText,marginBottom:6}}>{t.l}</div>
          <h3 id="claim-who" style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 10px"}}>Call {t.who}</h3>
          {t.phone&&<a href={tel(t.phone)} style={{display:"inline-block",fontFamily:ff,fontSize:28,color:C.accentText,fontWeight:700,textDecoration:"none",margin:"0 0 12px"}}>{t.phone}</a>}
          <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.75,margin:"0 0 22px"}}>{t.say}</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Btn outline onClick={()=>setType(null)}>Choose a different claim</Btn>
            {t.v==="card"&&<Btn onClick={()=>setPage("cards")}>What my card covers</Btn>}
          </div>
        </div>}
        <div style={{marginTop:28,background:`${C.amber}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.amber}`}}>
          <p style={{fontFamily:fs,fontSize:14,color:"#555",margin:0,lineHeight:1.7}}>
            Not sure who to call? Northern Birch can help you work out which insurer holds your policy: <a href={tel(PHONE["latvian-centre"])} style={{color:C.accentText,fontWeight:700}}>{PHONE["latvian-centre"]}</a> or toll-free <a href={tel(PHONE["toll-free"])} style={{color:C.accentText,fontWeight:700}}>{PHONE["toll-free"]}</a>.
            {" "}If a member has died, see <button onClick={()=>setPage("estate")} style={{background:"none",border:"none",padding:0,color:C.accentText,fontWeight:700,fontFamily:fs,fontSize:14,cursor:"pointer",textDecoration:"underline"}}>Estates</button>.
          </p>
        </div>
      </div>
    </section>
  );
}
