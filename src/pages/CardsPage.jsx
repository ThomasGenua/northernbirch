import React from "react";
import { Btn, C, Fade, RATE, SH, ff, fs, setApplyIntent, t, track, useW } from '../ui.jsx';
import partners from '../../content/partners.json';

// The insurance that comes with a Collabria card, read from content/partners.json
// so the carriers named here are the ones recorded as live. What each benefit
// covers, its limits and which card carries it are set by the certificate of
// insurance for that card -- this page names the benefits and sends members to
// the certificate rather than restating limits it cannot keep current.
const BENEFITS = {
  "collabria-assurant": [
    ["Purchase protection","Eligible items bought with the card, against theft or damage for a period after purchase."],
    ["Extended warranty","Adds time to the manufacturer's warranty on eligible items bought with the card."],
    ["Mobile device","Eligible phones and tablets bought or financed with the card, against loss, theft or damage."],
    ["Auto rental collision","Damage to or theft of an eligible rental car paid with the card, when you decline the rental company's collision cover."],
  ],
  "collabria-desjardins": [
    ["Trip cancellation and interruption","Non-refundable travel costs when a covered reason stops or cuts short a trip charged to the card."],
    ["Baggage","Baggage lost, damaged or delayed on a trip charged to the card."],
    ["Common carrier accident","Accidental death or dismemberment while travelling on a plane, train, bus or ship paid with the card."],
    ["24/7 travel assistance","A phone line for help while away: lost documents, finding care, getting messages home."],
  ],
};
const cardCover = partners.partners.filter((r) => r.status === "live" && BENEFITS[r.id]);


// ============ CREDIT CARDS ============
export default function CardsPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const cards=[
    {n:"Cash Back Mastercard",tag:"Everyday spending",rate:RATE.mc,fee:"$0 annual fee",c:C.greenFill,perks:["2% back on groceries and gas","1% back on everything else","No cap on annual earnings","Purchase protection and extended warranty"]},
    {n:"Low Rate Mastercard",tag:"Carrying a balance",rate:RATE.mcLow,fee:"$29 annual fee",c:C.accentText,perks:["The lowest purchase APR we offer","Balance transfers accepted","Ideal for consolidating higher-rate debt","21-day interest-free grace period"]},
    {n:"Travel Rewards Mastercard",tag:"Members who fly home",rate:RATE.mc,fee:"$99 annual fee",c:C.purple,perks:["1.5 points per dollar, no blackout dates","Trip cancellation, interruption and baggage cover","24/7 travel assistance","Built for Baltic and European travel"]},
  ];
  const shared=[{t:"Instant card controls",d:"Lock, unlock, and set spend limits from the mobile app."},{t:"Zero liability",d:"You are not responsible for unauthorized transactions."},{t:"Tap and mobile wallet",d:"Apple Pay, Google Pay, and Interac Flash."},{t:"Member pricing",d:"Issued through Collabria, priced for credit union members."}];
  return <section style={{background:C.cream,padding:w<=768?"60px 16px":"80px 24px",paddingTop:w<=768?80:100}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Credit Cards")} tagColor={C.purple} title={T("Three cards. One straightforward choice.")} desc={T("Collabria Mastercard cards issued for Northern Birch members -- cash back for everyday spending, a low rate if you carry a balance, and travel rewards if you do not.")}/>
      <div className="grid-3-2-1" style={{gap:16,marginBottom:24}}>
        {cards.map((cd,i)=><Fade key={i} delay={i*0.08}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #eee",height:"100%",display:"flex",flexDirection:"column"}}>
          <div style={{background:cd.c,padding:"18px 26px"}}>
            <span style={{fontFamily:fs,fontSize:10.5,color:"rgba(255,255,255,0.95)",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700}}>{cd.tag}</span>
            <h3 style={{fontFamily:ff,fontSize:21,color:"#fff",margin:"4px 0 0"}}>{cd.n}</h3>
          </div>
          <div style={{padding:26,display:"flex",flexDirection:"column",flex:1}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontFamily:ff,fontSize:30,color:C.navy,fontWeight:700}}>{cd.rate}</span>
              <span style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>{T("purchase APR")}</span>
            </div>
            <div style={{fontFamily:fs,fontSize:13,color:"#666",margin:"4px 0 18px"}}>{cd.fee}</div>
            <div style={{flex:1,marginBottom:18}}>
              {cd.perks.map((pk,pi)=><div key={pi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:cd.c,marginTop:6,flexShrink:0}}/>
                <span style={{fontFamily:fs,fontSize:13.5,color:"#666",lineHeight:1.5}}>{pk}</span>
              </div>)}
            </div>
            <Btn color={cd.c} onClick={()=>{setApplyIntent("Credit card");track("apply_start",{from:"cards"});setPage("apply")}}>{T("Apply for this card")}</Btn>
          </div>
        </div></Fade>)}
      </div>
      <div className="grid-4-2-1" style={{gap:12,marginBottom:24}}>
        {shared.map((sh,i)=><Fade key={i} delay={i*0.05}><div style={{background:"#fff",borderRadius:16,padding:22,border:"1px solid #eee",height:"100%"}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{sh.t}</h4>
          <p style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.65,margin:0}}>{sh.d}</p>
        </div></Fade>)}
      </div>
      <div id="card-benefits" style={{background:"#fff",borderRadius:20,border:"1px solid #eee",padding:w<=768?"24px 20px":"32px 34px",marginBottom:24}}>
        <h2 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"0 0 8px"}}>{T("Insurance that comes with the card")}</h2>
        <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.75,margin:"0 0 22px",maxWidth:760}}>{T("Eligible Collabria Mastercard cards include insurance at no extra cost. Northern Birch does not sell or underwrite it; the insurers below do, through Collabria. Which card carries which benefit, the limits and the exclusions are in that card's certificate of insurance.")}</p>
        <div className="grid-2-1" style={{gap:20}}>
          {cardCover.map((r)=><div key={r.id} style={{border:"1px solid #eee",borderRadius:16,padding:"20px 22px",background:C.cream}}>
            <div style={{fontFamily:fs,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:C.purple,marginBottom:4}}>{T("Underwritten by")}</div>
            <h3 style={{fontFamily:ff,fontSize:18,color:C.navy,margin:"0 0 14px"}}>{r.carrier}</h3>
            {BENEFITS[r.id].map(([b,d])=><div key={b} style={{marginBottom:12}}>
              <h4 style={{fontFamily:fs,fontSize:14,color:C.navy,margin:"0 0 2px",fontWeight:700}}>{T(b)}</h4>
              <p style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.6,margin:0}}>{T(d)}</p>
            </div>)}
          </div>)}
        </div>
        <p style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.7,margin:"18px 0 0"}}>{T("To make a claim or get your certificate, call Collabria cardholder services at 1-855-341-4643, or the number on the back of your card.")}</p>
      </div>
      <div style={{background:`${C.purple}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.purple}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Illustrative card lineup: card names, fees and earn rates are for the proposal and must be confirmed against Collabria's current offer. Rates are subject to change and to credit approval. Cash advance and balance transfer rates differ from the purchase APR shown. Cards are issued by Collabria Financial Services. Mastercard is a registered trademark of Mastercard International Incorporated.")}</p>
      </div>
    </div>
  </section>;
}
