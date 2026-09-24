import React, { useState } from "react";
import { C, exportToPDF, ff, fs, SH, SliderLabel, useMob } from '../ui.jsx';

export default function QuotePage({setPage}){
  const mob=useMob();
  const[type,setType]=useState("life");
  const[age,setAge]=useState(35);
  const[coverage,setCoverage]=useState(500000);
  const[term,setTerm]=useState(20);
  const[smoker,setSmoker]=useState(false);
  const[homeVal,setHomeVal]=useState(600000);
  const[deductible,setDeductible]=useState(1000);
  const[carYear,setCarYear]=useState(2022);
  const[drivingRecord,setDrivingRecord]=useState("clean");
  const[tripDays,setTripDays]=useState(30);
  const[travellers,setTravellers]=useState(1);
  // There is deliberately no premium here any more. This page used to compute
  // one from invented multipliers and show it as "your estimated premium",
  // which is quoting -- something an unlicensed credit union may not do under
  // Ontario's Sale of Insurance regulation -- on a number that was made up.
  // The inputs stay, because what a member is looking for is worth capturing;
  // the number is gone, and the page hands off to an advisor instead.
  const sliderStyle=(color)=>({WebkitAppearance:"none",width:"100%",height:8,borderRadius:4,background:`linear-gradient(90deg,${color} 0%,#eee 100%)`,outline:"none",cursor:"pointer"});
  const types=[{l:"Term Life",v:"life",icon:"&#9829;",c:C.accentText},{l:"Home",v:"home",icon:"&#9750;",c:C.greenFill},{l:"Auto",v:"auto",icon:"&#9881;",c:C.amber},{l:"Travel",v:"travel",icon:"&#9992;",c:C.purple}];
  const activeType=types.find(t=>t.v===type);
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="Coverage Explorer" tagColor={C.accentText} title="Tell us what you are looking for" desc="Set out roughly what you need. Northern Birch does not quote or sell insurance directly -- an advisor uses this to connect you with an insurer who can. No personal information required."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:32}}>
          {types.map(t=>(
            <button key={t.v} onClick={()=>setType(t.v)} style={{background:type===t.v?t.c:"#fff",border:type===t.v?"none":"1px solid #ddd",borderRadius:16,padding:"20px 16px",cursor:"pointer",transition:"all 0.3s",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:6}} dangerouslySetInnerHTML={{__html:t.icon}}/>
              <div style={{fontFamily:fs,fontSize:14,fontWeight:700,color:type===t.v?"#fff":C.navy}}>{t.l}</div>
            </button>
          ))}
        </div>
        <div className="grid-main-panel-1" style={{gap:24}}>
          {/* LEFT: Sliders */}
          <div style={{background:"#fff",borderRadius:24,padding:"36px 40px",border:"1px solid #eee"}}>
            <h3 style={{fontFamily:fs,fontSize:18,color:C.navy,margin:"0 0 28px",fontWeight:700}}>Customize your coverage</h3>
            {type==="life"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Your Age" value={age}/>
                <input type="range" aria-label="Your age" min={18} max={70} value={age} onChange={e=>setAge(+e.target.value)} style={sliderStyle(C.accent)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>18</span><span>70</span></div>
              </div>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Coverage Amount" value={`C$${(coverage/1000).toLocaleString()}K`}/>
                <input type="range" aria-label="Coverage amount" min={100000} max={2000000} step={50000} value={coverage} onChange={e=>setCoverage(+e.target.value)} style={sliderStyle(C.accent)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>$100K</span><span>$2M</span></div>
              </div>
              <div style={{marginBottom:28}}>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Term Length</div>
                <div style={{display:"flex",gap:8}}>{[10,20,30].map(t=><button key={t} onClick={()=>setTerm(t)} style={{flex:1,background:term===t?C.accentText:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:term===t?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{t} Years</button>)}</div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Tobacco Use</div>
                <div style={{display:"flex",gap:8}}>{[{l:"Non-Smoker",v:false},{l:"Smoker",v:true}].map(s=><button key={String(s.v)} onClick={()=>setSmoker(s.v)} style={{flex:1,background:smoker===s.v?C.navy:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:smoker===s.v?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{s.l}</button>)}</div>
              </div>
            </>}
            {type==="home"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Home Value" value={`C$${(homeVal/1000).toLocaleString()}K`}/>
                <input type="range" aria-label="Home value" min={200000} max={2000000} step={25000} value={homeVal} onChange={e=>setHomeVal(+e.target.value)} style={sliderStyle(C.green)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>$200K</span><span>$2M</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Deductible</div>
                <div style={{display:"flex",gap:8}}>{[500,1000,2500,5000].map(d=><button key={d} onClick={()=>setDeductible(d)} style={{flex:1,background:deductible===d?C.greenFill:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:13,color:deductible===d?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>${d.toLocaleString()}</button>)}</div>
                <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:8}}>Higher deductible = lower premium. Choose the amount you're comfortable paying out of pocket.</p>
              </div>
            </>}
            {type==="auto"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Vehicle Year" value={carYear}/>
                <input type="range" aria-label="Vehicle year" min={2010} max={2026} value={carYear} onChange={e=>setCarYear(+e.target.value)} style={sliderStyle(C.amber)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>2010</span><span>2026</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Driving Record</div>
                <div style={{display:"flex",gap:8}}>{[{l:"Clean",v:"clean"},{l:"1-2 Minor",v:"minor"},{l:"At-Fault Accident",v:"accident"}].map(r=><button key={r.v} onClick={()=>setDrivingRecord(r.v)} style={{flex:1,background:drivingRecord===r.v?C.amber:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:12,color:drivingRecord===r.v?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{r.l}</button>)}</div>
              </div>
            </>}
            {type==="travel"&&<>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Your Age" value={age}/>
                <input type="range" min={18} max={85} value={age} onChange={e=>setAge(+e.target.value)} style={sliderStyle(C.purple)}/>
              </div>
              <div style={{marginBottom:28}}>
                <SliderLabel label="Trip Duration" value={`${tripDays} days`}/>
                <input type="range" min={7} max={180} value={tripDays} onChange={e=>setTripDays(+e.target.value)} style={sliderStyle(C.purple)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:fs,fontSize:11,color:"#707070",marginTop:4}}><span>7 days</span><span>180 days</span></div>
              </div>
              <div>
                <div style={{fontFamily:fs,fontSize:13,color:"#666",marginBottom:10}}>Travellers</div>
                <div style={{display:"flex",gap:8}}>{[1,2,3,4].map(n=><button key={n} onClick={()=>setTravellers(n)} style={{flex:1,background:travellers===n?C.purple:"#f5f5f5",border:"none",borderRadius:10,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:14,color:travellers===n?"#fff":C.navy,fontWeight:600,transition:"all 0.2s"}}>{n}</button>)}</div>
              </div>
            </>}
          </div>
          {/* RIGHT: Live Result */}
          <div>
            <div id="quote-result-panel" style={{background:C.navy,borderRadius:24,padding:"36px 32px",textAlign:"center",position:mob?"relative":"sticky",top:80}}>
              <div style={{width:56,height:56,borderRadius:16,background:`${activeType.c}25`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24,color:activeType.c}} dangerouslySetInnerHTML={{__html:activeType.icon}}/></div>
              <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>What you are looking for</div>
              <div style={{fontFamily:ff,fontSize:26,color:"#fff",fontWeight:700,margin:"0 0 6px",lineHeight:1.25}}>{activeType.l}</div>
              <div style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:20,lineHeight:1.6}}>Northern Birch does not quote or price this. An advisor refers you to an insurer who does.</div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"16px",marginBottom:20}}>
                {type==="life"&&<div className="grid-2-1" style={{gap:8,textAlign:"left"}}>
                  {[["Coverage",`C$${(coverage/1000)}K`],["Term",`${term} years`],["Age",age],["Tobacco",smoker?"Yes":"No"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
                {type==="home"&&<div className="grid-2-1" style={{gap:8,textAlign:"left"}}>
                  {[["Home Value",`C$${(homeVal/1000)}K`],["Deductible",`C$${deductible}`],["Coverage","Ask the insurer"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
                {type==="auto"&&<div className="grid-2-1" style={{gap:8,textAlign:"left"}}>
                  {[["Vehicle",carYear],["Record",drivingRecord],["Liability","Ask the insurer"],["Collision","Ask the insurer"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600,textTransform:"capitalize"}}>{v}</div></div>)}
                </div>}
                {type==="travel"&&<div className="grid-2-1" style={{gap:8,textAlign:"left"}}>
                  {[["Age",age],["Duration",`${tripDays} days`],["Travellers",travellers],["Medical","Set by Allianz"]].map(([k,v],i)=><div key={i}><div style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:fs,fontSize:14,color:"#fff",fontWeight:600}}>{v}</div></div>)}
                </div>}
              </div>
              <button onClick={()=>setPage("booking")} style={{width:"100%",background:activeType.c,border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:fs,fontSize:14,color:"#fff",fontWeight:700,marginBottom:8}}>Book an Advisor Appointment</button>
              <button onClick={()=>exportToPDF("quote-result-panel",`${activeType.l} — what I am looking for`)} style={{width:"100%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600,marginBottom:8}}>&#128190; Download summary (PDF)</button>
              <button onClick={()=>setPage("compare")} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",fontWeight:500}}>Compare Coverage Options</button>
              <p style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",margin:"16px 0 0",lineHeight:1.6}}>Not a quote and not an offer. Northern Birch refers members to insurers; the insurer sets eligibility, coverage and price.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ COVERAGE COMPARISON ============
