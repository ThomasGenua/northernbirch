import React from "react";
import { Btn, C, Fade, RATE, SH, ff, fs, setApplyIntent, t, track, useW } from '../ui.jsx';


// ============ CREDIT CARDS ============
export default function CardsPage({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  const cards=[
    {n:"Cash Back Mastercard",tag:"Everyday spending",rate:RATE.mc,fee:"$0 annual fee",c:C.greenFill,perks:["2% back on groceries and gas","1% back on everything else","No cap on annual earnings","Purchase protection and extended warranty"]},
    {n:"Low Rate Mastercard",tag:"Carrying a balance",rate:RATE.mcLow,fee:"$29 annual fee",c:C.accentText,perks:["The lowest purchase APR we offer","Balance transfers accepted","Ideal for consolidating higher-rate debt","21-day interest-free grace period"]},
    {n:"Travel Rewards Mastercard",tag:"Members who fly home",rate:RATE.mc,fee:"$99 annual fee",c:C.purple,perks:["1.5 points per dollar, no blackout dates","Included travel medical coverage","Built for Baltic and European travel","Airport lounge access twice a year"]},
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
      <div style={{background:`${C.purple}08`,borderRadius:16,padding:"20px 24px",borderLeft:`4px solid ${C.purple}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{T("Rates are subject to change and to credit approval. Cash advance and balance transfer rates differ from the purchase APR shown. Cards are issued by Collabria Financial Services. Mastercard is a registered trademark of Mastercard International Incorporated.")}</p>
      </div>
    </div>
  </section>;
}
