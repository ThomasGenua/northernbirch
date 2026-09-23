import React from "react";
import { C, SH, ff, fs } from '../ui.jsx';
import data from '../../content/partners.json';

// The underwriter matrix for the pitch. Rendered straight from
// content/partners.json -- the same file scripts/check-partners.mjs reads to
// decide which insurers the rest of the site may name -- so this table and the
// site cannot disagree about who is live.
//
// "TO CONFIRM" and "TO CHOOSE" cells are shown, not hidden. They are the
// questions for Northern Birch, and a matrix that filled them with plausible
// guesses would be worth less in the meeting than one that is honest about
// what is not known yet.
const COLS = [
  ["line", "Line"],
  ["carrier", "Carrier"],
  ["licence", "Who holds the licence"],
  ["bearsCost", "Who bears the cost"],
  ["nbCost", "Northern Birch cost"],
  ["revenue", "Revenue mechanic"],
  ["status", "Status"],
];

const open = (v) => /^TO (CONFIRM|CHOOSE)/.test(v);

function Cell({k, v}){
  if (k === "status") {
    const live = v === "live";
    return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:999,fontFamily:fs,fontSize:12,fontWeight:700,
      background:live?"#E6F4EC":"#FFF4DD",color:live?C.greenText:C.amberText,border:`1px solid ${live?"#B7DDC6":"#EBD49A"}`}}>{live?"Live":"Proposed"}</span>;
  }
  return <span style={{fontFamily:fs,fontSize:13,lineHeight:1.55,
    color:open(v)?C.amberText:C.navy,fontStyle:open(v)?"italic":"normal",fontWeight:k==="line"?600:400}}>{v}</span>;
}

export default function UnderwritersPage({setPage}){
  const rows = data.partners;
  const live = rows.filter((r) => r.status === "live");
  const proposed = rows.filter((r) => r.status === "proposed");
  const questions = rows.flatMap((r) => COLS.filter(([k]) => open(r[k])).map(([, label]) => `${r.line}: ${label.toLowerCase()}`));

  return <section className="sec" style={{background:C.cream}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <SH tag="For discussion" tagColor={C.purple} title="Underwriter matrix"
          desc={`Who underwrites each insurance line, who holds the licence, who pays, and what Northern Birch earns. ${live.length} live today, ${proposed.length} proposed by Oodler. Reviewed ${data.reviewed}.`}/>

      <div style={{background:"#fff",border:"1px solid #eee",borderRadius:18,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:980}}>
            <caption style={{position:"absolute",left:-9999}}>Insurance lines, carriers and whether each is live or proposed</caption>
            <thead>
              <tr style={{background:C.navy}}>
                {COLS.map(([k,label]) => <th key={k} scope="col" style={{textAlign:"left",padding:"12px 14px",fontFamily:fs,fontSize:11,fontWeight:700,color:"#fff",letterSpacing:0.6,textTransform:"uppercase"}}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => <tr key={r.id} style={{borderTop:"1px solid #f0ede5",background:r.status==="live"?"#fff":"#FFFCF4"}}>
                {COLS.map(([k]) => {
                  const Tag = k === "line" ? "th" : "td";
                  return <Tag key={k} scope={k === "line" ? "row" : undefined} style={{textAlign:"left",verticalAlign:"top",padding:"14px",width:k==="line"?"22%":undefined}}><Cell k={k} v={r[k]}/></Tag>;
                })}
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2-1" style={{gap:20,marginTop:24}}>
        <div style={{background:"#fff",border:"1px solid #eee",borderRadius:18,padding:"22px 24px"}}>
          <h2 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 10px"}}>How to read it</h2>
          <p style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.8,margin:0}}>
            <strong style={{color:C.greenText}}>Live</strong> lines exist today and were confirmed in the content review.{" "}
            <strong style={{color:C.amberText}}>Proposed</strong> lines are part of Oodler's pitch; Northern Birch has agreed to none of them.
            Every proposed line starts referral-only, so the insurer holds the licence and Northern Birch spends nothing on licensing.
          </p>
        </div>
        <div style={{background:"#FFF8E6",border:"1px solid #EBD49A",borderRadius:18,padding:"22px 24px"}}>
          <h2 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 10px"}}>Questions for Northern Birch</h2>
          <p style={{fontFamily:fs,fontSize:13,color:"#6b5a2a",margin:"0 0 10px"}}>{questions.length} cells are open. They are marked in italics above.</p>
          <ul style={{margin:0,paddingLeft:18}}>
            {questions.slice(0, 6).map((q, i) => <li key={i} style={{fontFamily:fs,fontSize:13,color:"#5A4410",lineHeight:1.8}}>{q}</li>)}
          </ul>
        </div>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>
        <button onClick={()=>setPage("cards")} style={{background:C.navy,border:"none",borderRadius:12,padding:"12px 22px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>See the card benefits members already have &rarr;</button>
        <button onClick={()=>setPage("phasedask")} style={{background:"#fff",border:`1px solid ${C.navy}`,borderRadius:12,padding:"12px 22px",cursor:"pointer",fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>The phased ask &rarr;</button>
      </div>
    </div>
  </section>;
}
