import React, { useState } from "react";
import { Btn, C, Clickable, CONSENT_VERSION, ConsentNotice, errBox, exportToPDF, ff, fs, SH, submitForm } from '../ui.jsx';

export default function ClaimsPage(){
  
  const[step,setStep]=useState(0);
  const[claimType,setClaimType]=useState("");
  const[policy,setPolicy]=useState("");const[incidentDate,setIncidentDate]=useState("");const[details,setDetails]=useState("");
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=policy.trim()&&details.trim()&&name.trim()&&(email.trim()||phone.trim())&&consent;
  // No claim number is invented here. Only the insurer can open a claim and
  // issue a number; this form starts that conversation.
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("claim",{claimType,policy,incidentDate,details,name,email,phone,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setStep(2);
    else setError("We could not send your claim request. Nothing has been filed. Please try again, or call your insurer directly using the numbers below — for an urgent claim, always call.");
  };
  const steps=[
    {title:"Select Claim Type",content:<div className="grid-2-1" style={{gap:16}}>
      {[{l:"Home Insurance Claim",v:"home",d:"Property damage, theft, water damage, liability"},{l:"Auto Insurance Claim",v:"auto",d:"Accident, collision, theft, vandalism"},{l:"Travel Insurance Claim",v:"travel",d:"Emergency medical, trip cancellation, baggage"},{l:"Life / CI / Disability Claim",v:"life",d:"Death benefit, critical illness, disability"},{l:"Mortgage Protection Claim",v:"mortgage",d:"Creditor life, disability, critical illness"},{l:"Commercial Insurance Claim",v:"commercial",d:"Business property, liability, business interruption"}].map((t,i)=>
        <Clickable key={i} onClick={()=>{setClaimType(t.v);setStep(1)}} style={{background:claimType===t.v?`${C.accentText}08`:"#fff",border:claimType===t.v?`2px solid ${C.accent}`:"1px solid #eee",borderRadius:16,padding:"24px",cursor:"pointer",transition:"all 0.3s"}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 4px",fontWeight:700}}>{t.l}</h4>
          <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>{t.d}</p>
        </Clickable>
      )}
    </div>},
    {title:"Provide Details",content:<div>
      <div style={{marginBottom:16}}><label htmlFor="claim-policy" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Policy Number</label><input id="claim-policy" value={policy} onChange={e=>setPolicy(e.target.value)} placeholder="Enter your policy number" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label htmlFor="claim-date" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Date of Incident</label><input type="date" id="claim-date" value={incidentDate} onChange={e=>setIncidentDate(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label htmlFor="claim-details" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Description of Claim</label><textarea id="claim-details" rows={4} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Please describe what happened..." style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box"}}/></div>
      <div className="grid-2-1" style={{gap:16,marginBottom:16}}>
        <div><label htmlFor="booking-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="booking-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
        <div><label htmlFor="booking-phone" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Phone</label><input id="booking-phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="416-XXX-XXXX" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
      </div>
      <div style={{marginBottom:16}}><label htmlFor="booking-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Email</label><input id="booking-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none"}}/></div>
      <div style={{background:`${C.amber}08`,borderRadius:12,padding:"14px 18px",marginBottom:16,borderLeft:`4px solid ${C.amber}`}}>
        <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.6}}>Have photos, receipts, or a police report ready. Documents are not uploaded through this form &mdash; the adjuster will tell you where to send them when they call.</p>
      </div>
      <><ConsentNotice id="claim-consent" checked={consent} onChange={setConsent} purpose="so it can be passed to the insurer to open my claim" extra="Claim details may include information about my health or property."/>
      {error&&<div style={errBox}>{error}</div>}
      <div style={{display:"flex",gap:12}}><Btn outline onClick={()=>setStep(0)}>Back</Btn><Btn color={sending||!canSubmit?"#ccc":C.accent} onClick={sending||!canSubmit?undefined:submit}>{sending?"Sending...":"Submit Claim Request"}</Btn></div></>
    </div>},
    {title:"Request Sent",content:<div id="claim-confirmation" style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div>
      <h3 style={{fontFamily:ff,fontSize:28,color:C.navy,margin:"0 0 12px"}}>Claim Request Sent</h3>
      <p style={{fontFamily:fs,fontSize:15,color:"#666",lineHeight:1.7,maxWidth:500,margin:"0 auto 8px"}}>We have passed your details to the insurer. Your claim number is issued by them, not by us, and comes with their first call.</p>
      <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",lineHeight:1.7,maxWidth:500,margin:"0 auto 24px"}}>A claims adjuster will contact you within 1-2 business days. You can track your claim status through the Insurance Dashboard in your online banking.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn onClick={()=>exportToPDF("claim-confirmation","Claim Request")} color={C.accentText}>&#128190; Download Request (PDF)</Btn>
        <Btn outline onClick={()=>{setStep(0);setClaimType("");setPolicy("");setDetails("")}}>File Another Claim</Btn>
      </div>
    </div>},
  ];
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Claims Centre" tagColor={C.redText} title="File an insurance claim" desc="Start your claim online. We'll guide you through the process step by step."/>
        <div style={{display:"flex",gap:0,marginBottom:32}}>
          {steps.map((s,i)=><div key={i} style={{flex:1,display:"flex",alignItems:"center"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:i<=step?C.accentText:"#ddd",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:700}}>{i+1}</span></div>
            <div style={{fontFamily:fs,fontSize:12,color:i<=step?C.navy:"#707070",marginLeft:8,fontWeight:i===step?700:400}}>{s.title}</div>
            {i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?C.accentText:"#eee",margin:"0 12px"}}/>}
          </div>)}
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>{steps[step].content}</div>
        <div style={{marginTop:32,background:`${C.amber}08`,borderRadius:16,padding:"24px 28px",borderLeft:`4px solid ${C.amber}`}}>
          <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 8px",fontWeight:700}}>Claim Contact Numbers</h4>
          <div className="grid-3-2-1" style={{gap:16}}>
            {[{n:"The Personal (Home/Auto/Travel)",p:"1-888-476-8737"},{n:"CUMIS (Life/Creditor)",p:"1-800-263-9120"},{n:"Manulife (Group Benefits)",p:"1-800-268-6195"}].map((c2,i)=><div key={i}><div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{c2.n}</div><div style={{fontFamily:fs,fontSize:14,color:C.accentText,fontWeight:700}}>{c2.p}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CALCULATORS ============
