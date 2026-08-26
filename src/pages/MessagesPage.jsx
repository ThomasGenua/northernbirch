import React, { useState } from "react";
import { C, Clickable, RATE, callAI, ff, fs } from '../ui.jsx';

export default function MessagesPage({setPage:_setPage}){
  const[thread,setThread]=useState("heili");
  const[mobileView,setMobileView]=useState("threads");// threads | chat
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[messages,setMessages]=useState({
    heili:[
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:"Hi Maria! I just reviewed your TFSA situation. You have C$22,500 of unused contribution room from prior years -- that's a great opportunity for tax-free growth. Want to set up a transfer?",time:"Yesterday, 2:14 PM"},
      {from:"member",text:"That sounds great! Can we do C$15,000 from my chequing into the TFSA?",time:"Yesterday, 3:42 PM"},
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:`Absolutely. I'll set up the transfer for you. Question: would you like to invest it in our high-interest savings (currently ${RATE.hisa}) or our 1-year GIC at ${RATE.gic1}? The GIC ladder strategy might also be worth discussing if you don't need access to the funds.`,time:"Yesterday, 3:55 PM"},
      {from:"member",text:"Let's do the GIC. Should we book a call to talk about the ladder strategy?",time:"Today, 9:12 AM"},
      {from:"advisor",author:"Heili Orav",role:"Wealth & Estate Advisor",text:"Perfect. I have time Tuesday at 10:30 AM at the Latvian Centre branch, or we can do video. Either works for you?",time:"Today, 9:38 AM"},
    ],
    insurance:[
      {from:"advisor",author:"Andres Tamm",role:"Insurance Advisor",text:"Hi Maria, I noticed your home insurance is up for renewal April 15. The Personal is offering an enhanced bundle with auto -- you'd save approximately C$340/year by combining. Want me to run the numbers?",time:"2 days ago, 11:20 AM"},
      {from:"member",text:"Yes please! Also, can you tell me about critical illness coverage? Heili mentioned it.",time:"2 days ago, 12:05 PM"},
      {from:"advisor",author:"Andres Tamm",role:"Insurance Advisor",text:"Great question. Critical illness is often overlooked. CUMIS offers a 25-condition policy starting at about C$45/month for someone in your age bracket. Lump-sum payout if you're diagnosed. Should we discuss at your appointment with Heili next week, or earlier?",time:"2 days ago, 1:15 PM"},
    ],
    branch:[
      {from:"advisor",author:"Northern Birch Support",role:"Branch Services",text:"Hi Maria, your debit card replacement has been processed and will arrive within 5-7 business days. The temporary card you can use through online banking is now active.",time:"4 days ago, 3:00 PM"},
      {from:"member",text:"Thanks!",time:"4 days ago, 3:15 PM"},
    ],
  });
  const send=async()=>{
    if(!input.trim()||loading)return;
    const newMsg={from:"member",text:input,time:"Just now"};
    setMessages(p=>({...p,[thread]:[...p[thread],newMsg]}));
    setInput("");setLoading(true);
    try{
      const advisorContext={heili:{name:"Heili Orav",role:"Wealth & Estate Advisor",feature:"advisor-heili"},insurance:{name:"Andres Tamm",role:"Insurance Advisor",feature:"advisor-insurance"},branch:{name:"Northern Birch Support",role:"Branch Services",feature:"advisor-branch"}}[thread];
      const history=messages[thread].slice(-4).map(m=>({role:m.from==="member"?"user":"assistant",content:m.text}));
      history.push({role:"user",content:input});
      const data=await callAI(advisorContext.feature,history);
      const reply=data.content?.[0]?.text||"Thanks for your message. I'll get back to you shortly.";
      setMessages(p=>({...p,[thread]:[...p[thread],{from:"advisor",author:advisorContext.name,role:advisorContext.role,text:reply,time:"Just now"}]}));
    }catch(e){
      setMessages(p=>({...p,[thread]:[...p[thread],{from:"advisor",author:"System",role:"Notice",text:"I'm offline right now -- I'll respond by end of business day.",time:"Just now"}]}));
    }
    setLoading(false);
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  const threads=[
    {id:"heili",name:"Heili Orav",role:"Wealth & Estate",unread:0,last:"Perfect. I have time Tuesday at 10:30 AM..."},
    {id:"insurance",name:"Andres Tamm",role:"Insurance Advisor",unread:0,last:"CUMIS offers a 25-condition policy..."},
    {id:"branch",name:"Northern Birch Support",role:"Branch Services",unread:0,last:"Debit card replacement processed..."},
  ];
  return <section style={{background:"#f0f2f5",padding:isMob?"60px 0 0":"80px 0 0",paddingTop:isMob?64:80,minHeight:"100vh"}}>
    <div style={{maxWidth:1100,margin:"0 auto",height:"calc(100vh - 80px)",display:"grid",gridTemplateColumns:isMob?"1fr":"320px 1fr",gap:0,background:"#fff"}}>
      {/* Sidebar */}
      {(!isMob||mobileView==="threads")&&<div style={{borderRight:isMob?"none":"1px solid #eee",overflow:"auto",background:"#fafafa"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:18,color:C.navy,margin:0}}>Messages</h3>
          <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"4px 0 0"}}>Direct line to your Northern Birch team</p>
        </div>
        {threads.map(th=><Clickable key={th.id} onClick={()=>{setThread(th.id);if(isMob)setMobileView("chat")}} style={{padding:"14px 20px",cursor:"pointer",background:thread===th.id?"#fff":"transparent",borderLeft:thread===th.id?`3px solid ${C.accent}`:"3px solid transparent",borderBottom:"1px solid #f5f5f5"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:700}}>{th.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>{th.name}</div>
              <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:1}}>{th.role}</div>
              <div style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{th.last}</div>
            </div>
          </div>
        </Clickable>)}
      </div>}
      {/* Chat */}
      {(!isMob||mobileView==="chat")&&<div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 24px",borderBottom:"1px solid #eee",background:"#fff",display:"flex",alignItems:"center",gap:12}}>
          {isMob&&<button onClick={()=>setMobileView("threads")} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.navy,padding:4}}>&larr;</button>}
          <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700}}>{threads.find(t=>t.id===thread).name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{threads.find(t=>t.id===thread).name}</div>
            <div style={{fontFamily:fs,fontSize:11,color:C.greenText,display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.greenFill,display:"inline-block"}}/>Online -- typically replies within 1 hour
            </div>
          </div>
        </div>
        <div tabIndex={0} role="log" aria-label="Conversation transcript" style={{flex:1,overflow:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:12,background:"#fafafa"}}>
          {messages[thread].map((m,i)=><div key={i} style={{alignSelf:m.from==="member"?"flex-end":"flex-start",maxWidth:"75%"}}>
            {m.from==="advisor"&&<div style={{fontFamily:fs,fontSize:10,color:"#6B6B6B",marginBottom:3,marginLeft:4}}>{m.author} -- {m.role}</div>}
            <div style={{background:m.from==="member"?`linear-gradient(135deg,${C.accent},${C.purple})`:"#fff",color:m.from==="member"?"#fff":C.navy,borderRadius:m.from==="member"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 16px",fontFamily:fs,fontSize:13,lineHeight:1.6,boxShadow:m.from==="advisor"?"0 1px 3px rgba(0,0,0,0.06)":"none"}}>{m.text}</div>
            <div style={{fontFamily:fs,fontSize:10,color:"#707070",marginTop:3,textAlign:m.from==="member"?"right":"left",paddingLeft:m.from==="member"?0:4,paddingRight:m.from==="member"?4:0}}>{m.time}</div>
          </div>)}
          {loading&&<div style={{alignSelf:"flex-start",background:"#fff",borderRadius:"16px 16px 16px 4px",padding:"10px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <span style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",animation:"blink 1.4s infinite"}}>{threads.find(t=>t.id===thread).name.split(" ")[0]} is typing...</span>
          </div>}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #eee",background:"#fff",display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} aria-label="Type a message" placeholder="Type a message..." style={{flex:1,border:"1px solid #eee",borderRadius:20,padding:"10px 18px",fontFamily:fs,fontSize:13,outline:"none",background:"#f8f8f8"}} disabled={loading}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"#ddd":`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:20,padding:"10px 20px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Send</button>
        </div>
        <p style={{fontFamily:fs,fontSize:10,color:"#707070",margin:0,padding:"0 16px 12px",textAlign:"center"}}>Messages are encrypted end-to-end. AI may assist advisors with replies during off-hours.</p>
      </div>}
    </div>
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
  </section>;
}

// ============ NAV ============
