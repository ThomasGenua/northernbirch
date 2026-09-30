import React from "react";
import { C, Clickable, SH, ff, fs } from '../ui.jsx';

// The front door to the pitch. Before this page the four proposal pages could
// only be found from each other, or from a small link on the Community page:
// someone who came for the proposal had no path to it. This lists them in the
// order to read them. It says nothing new of its own -- every claim lives on
// the page it links to -- so there is one place to keep each fact true.
const STEPS = [
  {k:"leadership", t:"The business case", d:"What an insurance referral program would earn and cost Northern Birch, and the legal framework around it. Oodler's projections, not Northern Birch figures."},
  {k:"underwriters", t:"Who underwrites what", d:"Every insurance line, its carrier, who holds the licence, who pays, and what Northern Birch would earn: live today or proposed. Open cells are questions for Northern Birch."},
  {k:"phasedask", t:"The ask, in two phases", d:"Phase one is referral only, with no licensing spend. Phase two, licensing, only if the volume from phase one justifies it."},
  {k:"keskus", t:"The KESKUS launch", d:"The new flagship branch is the timing for all of it: what is known today and what is still to be announced."},
  {k:"dashboard", t:"Try it as a member", d:"The demo member area: a made-up member's dashboard, plus their messages with an advisor."},
];

export default function ProposalPage({setPage}){
  return <section className="sec" style={{background:C.cream}}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <SH tag="For Northern Birch leadership" tagColor={C.purple} title="The proposal, in reading order"
          desc="An illustrative proposal prepared by Oodler Inc. Five pages, in the order to read them. Northern Birch has agreed to none of it."/>
      <ol style={{listStyle:"none",margin:0,padding:0,display:"grid",gap:14}}>
        {STEPS.map((s,i)=><li key={s.k}>
          <Clickable onClick={()=>setPage(s.k)} style={{background:"#fff",border:"1px solid #eee",borderRadius:18,padding:"20px 24px",cursor:"pointer",display:"flex",gap:18,alignItems:"flex-start"}}>
            <span aria-hidden="true" style={{flexShrink:0,width:38,height:38,borderRadius:"50%",background:C.navy,color:"#fff",fontFamily:ff,fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</span>
            <span style={{flex:1}}>
              <span style={{display:"block",fontFamily:ff,fontSize:21,color:C.navy,marginBottom:4}}>{s.t}</span>
              <span style={{display:"block",fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.7}}>{s.d}</span>
              <span style={{display:"block",fontFamily:fs,fontSize:13,color:C.accentText,fontWeight:700,marginTop:8}}>Open &rarr;</span>
            </span>
          </Clickable>
        </li>)}
      </ol>
      <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",lineHeight:1.7,margin:"22px 0 0"}}>
        Everything outside these five pages is the member site the proposal would sit inside. The banner on every page says so.
      </p>
    </div>
  </section>;
}
