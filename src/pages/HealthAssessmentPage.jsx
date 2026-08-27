import React, { useState } from "react";
import { Btn, C, Fade, callAI, exportToPDF, ff, fs } from '../ui.jsx';

export default function HealthAssessmentPage({setPage}){
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const questions=[
    {id:"age",q:"What is your age?",options:["18-29","30-39","40-49","50-59","60-69","70+"]},
    {id:"family",q:"What is your family situation?",options:["Single, no dependents","Single parent","Married/partnered, no kids","Married/partnered with kids","Empty nester","Retired"]},
    {id:"housing",q:"What is your housing situation?",options:["Renting","Own a condo","Own a house","Own a co-op apartment","Living with family","Multiple properties"]},
    {id:"income",q:"What is your household income range?",options:["Under $50K","$50K-$100K","$100K-$150K","$150K-$250K","$250K+","Retired/fixed income"]},
    {id:"life_ins",q:"Do you have life insurance?",options:["No life insurance","Employer-provided only","Private term policy","Private permanent policy","Both employer + private","Not sure"]},
    {id:"home_ins",q:"Do you have home/tenant insurance?",options:["No coverage","Yes, through a bank","Yes, through an insurer","Yes, through a broker","Included in condo fees","Not sure"]},
    {id:"disability",q:"Do you have disability insurance?",options:["No coverage","Employer-provided short-term","Employer long-term disability","Private disability policy","Both employer + private","Not sure"]},
    {id:"travel",q:"How often do you travel internationally?",options:["Never","Once a year","2-3 times a year","Monthly","Snowbird (extended stays)","Baltic trips specifically"]},
    {id:"business",q:"Do you own a business?",options:["No","Self-employed/freelance","Business with 1-5 employees","Business with 6-20 employees","Business with 20+ employees","Considering starting one"]},
    {id:"estate",q:"Do you have an estate plan?",options:["No will or plan","Have a will only","Will + power of attorney","Comprehensive estate plan","Need to update my plan","Not sure where to start"]},
  ];

  const handleAnswer=(qId,answer)=>{
    const newAnswers={...answers,[qId]:answer};
    setAnswers(newAnswers);
    if(step<questions.length-1){setStep(step+1);}
    else{generateReport(newAnswers);}
  };

  const generateReport=async(allAnswers)=>{
    setLoading(true);
    try{
      const summary=Object.entries(allAnswers).map(([k,v])=>{const q=questions.find(x=>x.id===k);return `${q.q} ${v}`;}).join("\n");
      const data=await callAI("healthcheck",[{role:"user",content:`Here are my financial health quiz answers:\n\n${summary}`}]);
      setResult(data.content?.[0]?.text||"Unable to generate report.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };

  // Parse score from result
  const scoreMatch=result?.match(/SCORE:\s*(\d+)/);
  const score=scoreMatch?parseInt(scoreMatch[1]):null;
  const scoreColor=score>=75?C.green:score>=50?C.amber:C.red;

  if(loading)return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.accent},${C.purple})`,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 1.5s infinite"}}><span style={{fontSize:36,color:"#fff"}}>&#9889;</span></div>
        <h2 style={{fontFamily:ff,fontSize:28,color:"#fff",margin:"0 0 12px"}}>Analyzing your financial health...</h2>
        <p style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)"}}>Claude is reviewing your answers and generating personalized recommendations.</p>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.8}}`}</style>
    </section>
  );

  if(result)return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        {score&&<div id="health-assessment-result" style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:120,height:120,borderRadius:"50%",border:`8px solid ${scoreColor}`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",boxShadow:`0 4px 20px ${scoreColor}30`}}>
            <span style={{fontFamily:ff,fontSize:44,color:scoreColor,fontWeight:700}}>{score}</span>
          </div>
          <h2 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 4px"}}>Your Financial Health Score</h2>
          <p style={{fontFamily:fs,fontSize:14,color:scoreColor,fontWeight:600}}>{score>=75?"Well Protected":score>=50?"Some Gaps to Address":"Significant Gaps Identified"}</p>
        </div>}
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
          <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result.replace(/SCORE:\s*\d+\n?/,"")}</div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn onClick={()=>exportToPDF("health-assessment-result","Financial Health Report")} color={C.accentText}>&#128190; Download Report (PDF)</Btn>
          <Btn onClick={()=>setPage("booking")}>Book Advisor to Close Gaps</Btn>
          <Btn color={C.greenFill} onClick={()=>setPage("quote")}>Get Insurance Quotes</Btn>
          <Btn color={C.purple} onClick={()=>setPage("analyzer")}>Analyze Existing Coverage</Btn>
          <Btn outline onClick={()=>{setResult(null);setStep(0);setAnswers({})}}>Retake Assessment</Btn>
        </div>
      </div>
    </section>
  );

  const q=questions[step];
  return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {/* Progress */}
        <div style={{display:"flex",gap:4,marginBottom:40}}>
          {questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?C.accentText:"rgba(255,255,255,0.1)",transition:"background 0.3s"}}/>)}
        </div>
        <Fade>
          <div style={{textAlign:"center",marginBottom:12}}>
            <span style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)"}}>Question {step+1} of {questions.length}</span>
          </div>
          <h2 style={{fontFamily:ff,fontSize:typeof window!=="undefined"&&window.innerWidth<=768?24:32,color:"#fff",textAlign:"center",margin:"0 0 32px"}}>{q.q}</h2>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
            {q.options.map((opt,i)=>(
              <button key={i} onClick={()=>handleAnswer(q.id,opt)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"20px 24px",cursor:"pointer",textAlign:"left",transition:"all 0.3s",fontFamily:fs,fontSize:15,color:"#fff",fontWeight:500}}>
                {opt}
              </button>
            ))}
          </div>
          {step>0&&<div style={{textAlign:"center",marginTop:20}}><button onClick={()=>setStep(step-1)} style={{background:"none",border:"none",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",cursor:"pointer"}}>&#8592; Back</button></div>}
        </Fade>
      </div>
    </section>
  );
}

// ============ AI LIFE EVENT SIMULATOR ============
