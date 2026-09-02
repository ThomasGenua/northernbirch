import React, { useState } from "react";
import { Btn, C, callAI, exportToPDF, ff, fs, SH } from '../ui.jsx';

export default function LifeSimPage({setPage}){
  
  const[event,setEvent]=useState(null);
  const[details,setDetails]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const events=[
    {id:"baby",icon:"&#128118;",label:"Having a baby",prompt:"I'm about to have a baby (or just had one)."},
    {id:"home",icon:"&#127968;",label:"Buying a home",prompt:"I'm buying my first home."},
    {id:"marry",icon:"&#128141;",label:"Getting married",prompt:"I'm getting married."},
    {id:"divorce",icon:"&#128148;",label:"Going through a divorce",prompt:"I'm going through a divorce."},
    {id:"business",icon:"&#128188;",label:"Starting a business",prompt:"I'm starting a new business."},
    {id:"retire",icon:"&#127965;",label:"Approaching retirement",prompt:"I'm retiring within the next 2-3 years."},
    {id:"parent",icon:"&#128116;",label:"Caring for aging parents",prompt:"My elderly parents are moving to Canada from Estonia/Latvia and I need to help care for them."},
    {id:"coop",icon:"&#127970;",label:"Moving to a co-op",prompt:"I'm selling my house and moving into a co-op apartment."},
    {id:"death",icon:"&#128338;",label:"Lost a spouse",prompt:"My spouse recently passed away and I need to review everything."},
    {id:"job",icon:"&#128188;",label:"Changed jobs",prompt:"I just changed jobs and lost my employer benefits."},
  ];
  const run=async(ev)=>{
    setEvent(ev);setLoading(true);
    const context=details?`${ev.prompt} Additional context: ${details}`:ev.prompt;
    try{
      const data=await callAI("life-event",[{role:"user",content:context}]);
      setResult(data.content?.[0]?.text||"Unable to analyze. Please try again.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };

  if(loading)return(
    <section style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,padding:"80px 24px",paddingTop:100,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}} dangerouslySetInnerHTML={{__html:event?.icon||"&#9889;"}}/>
        <h2 style={{fontFamily:ff,fontSize:28,color:"#fff",margin:"0 0 12px"}}>Analyzing how this changes your needs...</h2>
        <p style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)"}}>Claude is building your personalized action plan.</p>
      </div>
    </section>
  );

  if(result)return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div id="life-event-result"><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <span style={{fontSize:32}} dangerouslySetInnerHTML={{__html:event?.icon}}/>
          <div><h2 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:0}}>Life Event: {event?.label}</h2><p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>AI-generated action plan</p></div>
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee",marginBottom:24}}>
          <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
        </div>
        </div><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn onClick={()=>exportToPDF("life-event-result","Life Event Action Plan - "+(event?.label||""))} color={C.accentText}>&#128190; Download Action Plan (PDF)</Btn>
          <Btn onClick={()=>setPage("booking")}>Book Advisor to Discuss</Btn>
          <Btn color={C.greenFill} onClick={()=>setPage("quote")}>Get Insurance Quotes</Btn>
          <Btn color={C.purple} onClick={()=>setPage("healthcheck")}>Full Health Assessment</Btn>
          <Btn outline onClick={()=>{setResult(null);setEvent(null);setDetails("")}}>Try Another Event</Btn>
        </div>
      </div>
    </section>
  );

  return(
    <section className="sec" style={{background:`linear-gradient(170deg,${C.dark},${C.navy})`,minHeight:"100vh"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH dark tag="AI Life Event Simulator" tagColor={C.amberText} title="Life is changing. Are you protected?" desc="Select a life event and our AI will show you exactly how your insurance and financial needs change -- and what to do about it."/>
        <div className="grid-5-2" style={{gap:12,marginBottom:32}}>
          {events.map(ev=>(
            <button key={ev.id} onClick={()=>run(ev)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.3s"}}>
              <span style={{fontSize:28,display:"block",marginBottom:8}} dangerouslySetInnerHTML={{__html:ev.icon}}/>
              <span style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{ev.label}</span>
            </button>
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"24px 28px"}}>
          <label style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:8}}>Add context for a more personalized analysis (optional):</label>
          <input value={details} onChange={e=>setDetails(e.target.value)} aria-label="Describe your situation" placeholder="e.g. I'm 34, married, $450K mortgage with NBCU, no life insurance..." style={{width:"100%",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:14,outline:"none",background:"rgba(255,255,255,0.04)",color:"#fff",boxSizing:"border-box"}}/>
        </div>
      </div>
    </section>
  );
}

// ============ AI DOCUMENT READER ============
