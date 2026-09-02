import React, { useState } from "react";
import { Btn, C, callAI, exportToPDF, fs, SH } from '../ui.jsx';

export default function PolicyAnalyzerPage({setPage}){
  
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("analyzer",[{role:"user",content:input}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659 for a personalized coverage review.");}
    setLoading(false);
  };
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="AI-Powered Analysis" tagColor={C.purple} title="Coverage Gap Analyzer" desc="Describe your current insurance coverage and our AI will identify gaps and recommend Northern Birch products to fill them."/>
        {!result?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
            <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Tell us about your current coverage</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6</div></div>
          </div>
          <textarea aria-label="Describe your current insurance situation" value={input} onChange={e=>setInput(e.target.value)} rows={8} placeholder={"Describe your current insurance situation. For example:\n\n\"I'm 35, married with 2 kids. I have a $500K mortgage with Northern Birch. My employer gives me basic life insurance (1x salary = $85K) and health/dental. I have home insurance with TD ($180/month) and auto with Intact ($165/month). No disability, no critical illness, no travel insurance. We visit my parents in Tallinn every summer.\"\n\nThe more detail you provide, the better our analysis."} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <div style={{display:"flex",gap:12,marginTop:16}}>
            <button onClick={analyze} disabled={loading||!input.trim()} style={{flex:1,background:loading?"#ccc":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Analyzing your coverage...":"Analyze My Coverage"}</button>
          </div>
          <div style={{marginTop:20}}>
            <div style={{fontFamily:fs,fontSize:12,color:"#707070",marginBottom:10}}>Or try a sample scenario:</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Young couple, first mortgage, no life insurance","Retiree, travelling to Estonia, no travel coverage","Small business owner, 8 employees, no group benefits","Renting downtown, no tenant insurance, drives to work"].map((s,i)=><button key={i} onClick={()=>setInput(s)} style={{background:`${C.accentText}06`,border:`1px solid ${C.accent}15`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:fs,fontSize:12,color:C.accentText}}>{s}</button>)}
            </div>
          </div>
        </div>:
        <div>
          <div id="coverage-analysis-result" style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${C.greenFill}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:C.greenText}}>&#10003;</span></div>
              <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>Coverage Analysis Complete</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>AI-generated recommendations based on your profile</div></div>
            </div>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("coverage-analysis-result","Coverage Gap Analysis")} color={C.accentText}>&#128190; Download Analysis (PDF)</Btn>
            <Btn onClick={()=>setPage("booking")}>Book Advisor to Discuss</Btn>
            <Btn onClick={()=>setPage("quote")} color={C.greenFill}>Get Quotes for Recommendations</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Analyze Again</Btn>
          </div>
          <p style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:16}}>AI analysis is for informational purposes only. Book an advisor appointment for personalized quotes and binding coverage.</p>
        </div>}
      </div>
    </section>
  );
}

// ============ AI FINANCIAL HEALTH ASSESSMENT ============
