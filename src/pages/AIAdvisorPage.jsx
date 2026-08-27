import React, { useEffect, useRef, useState } from "react";
import { Btn, C, Fade, callAI, ff, fs } from '../ui.jsx';

export default function AIAdvisorPage({setPage}){
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[started,setStarted]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const send=async(text)=>{
    const m=text||input;
    if(!m.trim()||loading)return;
    setInput("");setLoading(true);
    const newMsgs=[...msgs,{from:"user",text:m}];
    setMsgs(newMsgs);
    try{
      const history=newMsgs.map(x=>({role:x.from==="user"?"user":"assistant",content:x.text}));
      const data=await callAI("insurance-advisor",history);
      const reply=data.content?.[0]?.text||"I'm having trouble right now. Please call 416-465-4659 for personalized advice.";
      setMsgs(p=>[...p,{from:"bot",text:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{from:"bot",text:"I'm having trouble connecting. Please call 416-465-4659 for personalized insurance advice."}]);
    }
    setLoading(false);
  };

  const startConversation=(scenario)=>{
    setStarted(true);
    send(scenario);
  };

  if(!started) return (
    <section style={{background:`linear-gradient(170deg,${C.dark} 0%,${C.navy} 50%,#1e4060 100%)`,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
        <Fade>
          <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.accent},${C.purple})`,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:"#fff"}}>&#9889;</span></div>
          <h1 style={{fontFamily:ff,fontSize:typeof window!=="undefined"&&window.innerWidth<=768?28:42,color:"#fff",margin:"0 0 16px"}}>AI Insurance Advisor</h1>
          <p style={{fontFamily:fs,fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:500,margin:"0 auto 48px",lineHeight:1.7}}>Tell me about your life situation and I'll recommend the right insurance products for you. Powered by Claude AI -- available 24/7 in English, Estonian, and Latvian.</p>
        </Fade>
        <Fade delay={0.15}>
          <p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",marginBottom:20}}>Choose a scenario or type your own question:</p>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12,marginBottom:32}}>
            {[
              {label:"I just bought my first home",icon:"&#127968;",desc:"Mortgage protection, home insurance, life insurance review"},
              {label:"I'm planning a trip to Estonia this summer",icon:"&#9992;",desc:"Travel medical, trip cancellation, pre-existing conditions"},
              {label:"I run a small business with 8 employees",icon:"&#128188;",desc:"Group benefits, commercial insurance, key person coverage"},
              {label:"I'm retiring soon and need an estate plan",icon:"&#127793;",desc:"Estate planning, life insurance, succession strategies"},
              {label:"I just started renting my first apartment",icon:"&#128273;",desc:"Tenant insurance, life insurance basics, auto coverage"},
              {label:"I'm moving into a co-op apartment",icon:"&#127970;",desc:"Co-op insurance (exclusive to NBCU), home coverage"},
            ].map((s,i)=>(
              <button key={i} onClick={()=>startConversation(s.label)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 24px",cursor:"pointer",textAlign:"left",transition:"all 0.3s"}}>
                <span style={{fontSize:20,display:"block",marginBottom:8}} dangerouslySetInnerHTML={{__html:s.icon}}/>
                <div style={{fontFamily:fs,fontSize:15,color:"#fff",fontWeight:600,marginBottom:4}}>{s.label}</div>
                <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{s.desc}</div>
              </button>
            ))}
          </div>
        </Fade>
        <Fade delay={0.3}>
          <div style={{display:"flex",gap:8,maxWidth:600,margin:"0 auto"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startConversation(input)} aria-label="Describe your situation" placeholder="Or describe your situation in your own words..." style={{flex:1,border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:15,outline:"none",background:"rgba(255,255,255,0.05)",color:"#fff"}}/>
            <button onClick={()=>startConversation(input)} style={{background:`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"14px 24px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>Start</button>
          </div>
        </Fade>
      </div>
    </section>
  );

  return(
    <section style={{background:"#f0f2f5",padding:"0",paddingTop:60,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{maxWidth:800,margin:"0 auto",width:"100%",flex:1,display:"flex",flexDirection:"column",padding:"0 16px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 0"}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
          <div>
            <div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>AI Insurance Advisor</div>
            <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>Powered by Claude -- Northern Birch Credit Union</div>
          </div>
          <div style={{marginLeft:"auto"}}><Btn small onClick={()=>setPage("booking")}>Book Real Advisor</Btn></div>
        </div>
        {/* Messages */}
        <div style={{flex:1,overflow:"auto",padding:"8px 0",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=><div key={i} style={{alignSelf:m.from==="user"?"flex-end":"flex-start",maxWidth:"80%"}}>
            <div style={{background:m.from==="user"?`linear-gradient(135deg,${C.accent},${C.purple})`:"#fff",color:m.from==="user"?"#fff":C.navy,borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"14px 20px",fontFamily:fs,fontSize:14,lineHeight:1.7,boxShadow:m.from==="bot"?"0 1px 4px rgba(0,0,0,0.06)":"none",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>)}
          {loading&&<div style={{alignSelf:"flex-start",maxWidth:"60%"}}><div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"14px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}><span style={{fontFamily:fs,fontSize:14,color:"#707070"}}>
            <span style={{animation:"blink 1s infinite"}}>Analyzing your needs</span><span style={{animation:"blink 1s infinite 0.2s"}}>.</span><span style={{animation:"blink 1s infinite 0.4s"}}>.</span><span style={{animation:"blink 1s infinite 0.6s"}}>.</span>
          </span></div></div>}
          <div ref={bottomRef}/>
        </div>
        {/* Input */}
        <div style={{padding:"12px 0 20px",borderTop:"1px solid #e8e8e8"}}>
          <div style={{display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type your response..." style={{flex:1,border:"1px solid #ddd",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:14,outline:"none",background:"#fff"}} disabled={loading}/>
            <button onClick={()=>send()} disabled={loading} style={{background:loading?"#ddd":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:12,padding:"14px 24px",cursor:loading?"default":"pointer",color:"#fff",fontFamily:fs,fontSize:14,fontWeight:600}}>Send</button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>AI recommendations are for informational purposes. Book an advisor for personalized quotes.</span>
            <button onClick={()=>{setStarted(false);setMsgs([])}} style={{background:"none",border:"none",fontFamily:fs,fontSize:11,color:C.accentText,cursor:"pointer"}}>Start Over</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  );
}

// ============ AI POLICY ANALYZER ============
