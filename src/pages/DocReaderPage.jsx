import React, { useState } from "react";
import { Btn, C, SH, callAI, exportToPDF, fs } from '../ui.jsx';

export default function DocReaderPage({setPage}){
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("doc-reader",[{role:"user",content:`Please analyze this insurance document/policy:\n\n${input}`}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="AI Document Reader" tagColor={C.accentText} title="Understand your existing coverage" desc="Paste text from any insurance policy, renewal notice, or coverage summary. Our AI will extract the key details, compare with Northern Birch rates, and flag any gaps."/>
        {!result?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <textarea aria-label="Paste your policy text or coverage details" value={input} onChange={e=>setInput(e.target.value)} rows={12} placeholder={"Paste your policy text, renewal notice, or coverage details here. For example:\n\n\"TD Insurance Home Policy #HO-2024-887721\nDwelling: $650,000 replacement cost\nContents: $325,000\nDeductible: $1,000\nPersonal Liability: $1,000,000\nAdditional Living Expenses: $130,000\nWater damage: Sewer backup included\nPremium: $2,340/year ($195/month)\nRenewal: April 15, 2026\"\n\nYou can also paste a description in your own words, or copy text from a PDF renewal notice."} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <button onClick={analyze} disabled={loading||!input.trim()} style={{width:"100%",marginTop:16,background:loading?"#ccc":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Reading and analyzing your document...":"Analyze My Policy"}</button>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:fs,fontSize:12,color:"#707070"}}>Try with:</span>
            {["Home insurance renewal","Auto policy summary","Life insurance certificate","Group benefits booklet"].map((s,i)=><button key={i} onClick={()=>setInput(`I have a ${s.toLowerCase()} from my current provider. Here are the details: [paste your ${s.toLowerCase()} details here]`)} style={{background:`${C.accentText}06`,border:`1px solid ${C.accent}15`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.accentText}}>{s}</button>)}
          </div>
        </div>:
        <div>
          <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
            <div id="doc-reader-result"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${C.greenFill}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:C.greenText}}>&#10003;</span></div>
              <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Policy Analysis Complete</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6</div></div>
            </div>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div></div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("doc-reader-result","Policy Analysis Report")} color={C.accentText}>&#128190; Download Analysis (PDF)</Btn>
            <Btn onClick={()=>setPage("quote")}>Get NBCU Comparison Quote</Btn>
            <Btn color={C.greenFill} onClick={()=>setPage("booking")}>Book Advisor to Switch</Btn>
            <Btn color={C.purple} onClick={()=>setPage("analyzer")}>Full Coverage Analysis</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Analyze Another Document</Btn>
          </div>
        </div>}
      </div>
    </section>
  );
}

// ============ AI TAX OPTIMIZER ============
