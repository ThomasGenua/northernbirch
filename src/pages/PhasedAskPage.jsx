import React from "react";
import { C, SH, ff, fs } from '../ui.jsx';

// ============ PHASED ASK ============
// What Oodler is asking Northern Birch to agree to, in the order it would
// happen. A proposal page: noindex, and never linked from member navigation.
//
// Phase one needs no licence and no licensing spend, because Northern Birch
// only refers; the insurer's own licensed staff advise and sell. Phase two is
// deliberately conditional: whether a credit union may hold the licences at
// all, and on what terms, is a question for counsel under Ontario's rules on
// the sale of insurance by credit unions, so the page asks it rather than
// answering it.
const TBC = "TO CONFIRM";

const PHASES = [
  {n:"Phase one",h:"Referral only",when:"Launch with the KESKUS branch",c:C.greenText,
   does:["Members read about insurance on the site and ask an advisor about it.","Northern Birch refers them to an insurer, who quotes, advises and sells.","Travel keeps going through Allianz Global Assistance, as it does today.","Card insurance through Collabria is surfaced to members who already have it."],
   costs:[["Licensing","None. Northern Birch holds no insurance licence."],["Staff time","Referrals only: no quoting, no advice on cover."],["Build",TBC]],
   measure:["Referrals made each month, by line","How many referrals the insurer reports as policies written","Member questions the advisor could not answer"]},
  {n:"Phase two",h:"Licensing, once volume justifies it",when:"Only if phase one volume clears an agreed bar",c:C.amberText,
   does:["Northern Birch decides whether to license staff for some lines.","Licensed staff could then advise within what their licence and the regulation permit.","Lines and carriers are chosen from the underwriter matrix."],
   costs:[["Licensing and training",TBC],["Compliance oversight",TBC],["What the regulation permits","Question for counsel"]],
   measure:["The volume bar that triggers phase two",TBC]},
];

const cell = (v) => v===TBC ? <em style={{color:C.amberText}}>{v}</em> : v;

export default function PhasedAskPage({setPage}){
  return <section className="sec" style={{background:C.cream}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <SH tag="For discussion" tagColor={C.purple} title="The ask, in two phases"
          desc="Phase one is referral only and costs Northern Birch nothing in licensing. Phase two, licensing, happens only if the referral volume from phase one justifies it."/>
      <div style={{display:"grid",gap:20}}>
        {PHASES.map((p)=><div key={p.n} style={{background:"#fff",borderRadius:20,border:"1px solid #eee",borderLeft:`6px solid ${p.c}`,padding:"24px 28px"}}>
          <div style={{fontFamily:fs,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:p.c}}>{p.n} &middot; {p.when}</div>
          <h2 style={{fontFamily:ff,fontSize:26,color:C.navy,margin:"6px 0 16px"}}>{p.h}</h2>
          <div className="grid-3-2-1" style={{gap:22}}>
            <div>
              <h3 style={{fontFamily:fs,fontSize:14,fontWeight:700,color:C.navy,margin:"0 0 8px"}}>What happens</h3>
              <ul style={{margin:0,paddingLeft:18}}>{p.does.map((d)=><li key={d} style={{fontFamily:fs,fontSize:13.5,color:"#555",lineHeight:1.7}}>{d}</li>)}</ul>
            </div>
            <div>
              <h3 style={{fontFamily:fs,fontSize:14,fontWeight:700,color:C.navy,margin:"0 0 8px"}}>What it costs Northern Birch</h3>
              <dl style={{margin:0}}>{p.costs.map(([k,v])=><div key={k} style={{marginBottom:8}}>
                <dt style={{fontFamily:fs,fontSize:12.5,fontWeight:700,color:"#444"}}>{k}</dt>
                <dd style={{fontFamily:fs,fontSize:13.5,color:"#555",margin:0,lineHeight:1.6}}>{cell(v)}</dd>
              </div>)}</dl>
            </div>
            <div>
              <h3 style={{fontFamily:fs,fontSize:14,fontWeight:700,color:C.navy,margin:"0 0 8px"}}>What we measure</h3>
              <ul style={{margin:0,paddingLeft:18}}>{p.measure.map((d)=><li key={d} style={{fontFamily:fs,fontSize:13.5,color:"#555",lineHeight:1.7}}>{cell(d)}</li>)}</ul>
            </div>
          </div>
        </div>)}
      </div>
      <div style={{background:"#FFF8E6",border:"1px solid #EBD49A",borderRadius:18,padding:"20px 24px",marginTop:22}}>
        <h2 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 8px"}}>The decision today</h2>
        <p style={{fontFamily:fs,fontSize:14,color:"#5A4410",lineHeight:1.75,margin:0}}>
          Approve phase one only. Phase two is a separate decision, made later, on phase one's numbers. Items marked TO CONFIRM are open questions for Northern Birch, not figures Oodler has left out.
        </p>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
        <button onClick={()=>setPage("underwriters")} style={{background:C.navy,border:"none",borderRadius:12,padding:"12px 22px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>Underwriter matrix &rarr;</button>
        <button onClick={()=>setPage("keskus")} style={{background:"#fff",border:`1px solid ${C.navy}`,borderRadius:12,padding:"12px 22px",cursor:"pointer",fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>The KESKUS launch &rarr;</button>
      </div>
    </div>
  </section>;
}
