import React, { useState } from "react";
import { Btn, C, CONSENT_VERSION, ConsentNotice, errBox, exportToPDF, ff, fs, SH, submitForm, useMob } from '../ui.jsx';

export default function BookingPage({setPage}){
  const mob=useMob();
  const[branch,setBranch]=useState("");const[service,setService]=useState("");const[date,setDate]=useState("");const[time,setTime]=useState("");const[submitted,setSubmitted]=useState(false);
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=branch&&service&&name.trim()&&email.trim()&&consent;
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("booking",{branch,service,date,time,name,email,phone,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setSubmitted(true);
    else setError("We could not send your request just now. Nothing has been booked. Please try again, or call us at 416-465-4659 and we will book it for you.");
  };
  if(submitted)return(
    <section style={{background:C.cream,padding:mob?"60px 16px":"80px 24px",paddingTop:mob?80:100}}><div style={{maxWidth:600,margin:"0 auto"}}>
      <div id="booking-confirmation" style={{textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div>
        <h2 style={{fontFamily:ff,fontSize:32,color:C.navy}}>Appointment Requested</h2>
        <p style={{fontFamily:fs,fontSize:16,color:"#666",lineHeight:1.7}}>We have received your request for the {branch} branch for {service}{date?` for ${date}`:""}{time?` at ${time}`:""}. You'll receive a confirmation email shortly. If you need to reschedule, call us at 416-465-4659.</p>
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
        <Btn onClick={()=>exportToPDF("booking-confirmation","Appointment Request")} color={C.accentText}>&#128190; Download Confirmation (PDF)</Btn>
        <Btn outline onClick={()=>setSubmitted(false)}>Book Another Appointment</Btn>
      </div>
    </div></section>
  );
  return(
    <section style={{background:C.cream,padding:mob?"60px 16px":"80px 24px",paddingTop:mob?80:100}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <SH tag="Book an Appointment" tagColor={C.greenText} title="Meet with an advisor" desc="Schedule a meeting at any branch for personalized insurance, investment, or financial planning advice."/>
        <div style={{textAlign:"center",marginTop:-28,marginBottom:28}}>
          <Btn small outline color={C.greenFill} onClick={()=>setPage("advice")}>What a Financial Check-Up covers &rarr;</Btn>
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <div style={{marginBottom:20}}><label htmlFor="sel-1" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Select Branch</label><select id="sel-1" value={branch} onChange={e=>setBranch(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">Choose a branch...</option><option>Latvian Centre Branch - North York</option><option>Tartu College Branch - Bloor St</option><option>Hamilton Branch</option><option>KESKUS Branch (Coming Soon)</option></select></div>
          <div style={{marginBottom:20}}><label htmlFor="sel-2" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Service Needed</label><select id="sel-2" value={service} onChange={e=>setService(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">What do you need help with?</option><option>Insurance Quote & Advisory</option><option>Mortgage Consultation</option><option>Investment & Wealth Review</option><option>Estate Planning</option><option>Business Insurance & Benefits</option><option>International Transfers Setup</option><option>Financial Check-Up (General)</option><option>New Member Onboarding</option></select></div>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16,marginBottom:20}}>
            <div><label htmlFor="booking-date" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Preferred Date</label><input type="date" id="booking-date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="sel-3" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Preferred Time</label><select id="sel-3" value={time} onChange={e=>setTime(e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value="">Select time...</option>{["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div style={{marginBottom:20}}><label htmlFor="appt-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="appt-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16,marginBottom:24}}>
            <div><label htmlFor="appt-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Email</label><input id="appt-email" autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="appt-phone" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Phone</label><input id="appt-phone" autoComplete="tel" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="416-XXX-XXXX" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          </div>
          <ConsentNotice id="booking-consent" checked={consent} onChange={setConsent} purpose="so a branch representative can contact me about this appointment"/>
          {error&&<div style={errBox}>{error}</div>}
          <button onClick={submit} disabled={sending||!canSubmit} style={{width:"100%",background:(sending||!canSubmit)?"#ccc":C.greenFill,border:"none",borderRadius:12,padding:"16px",cursor:(sending||!canSubmit)?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{sending?"Sending...":"Request Appointment"}</button>
          <p style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textAlign:"center",margin:"10px 0 0"}}>A branch representative will confirm your appointment by phone or email.</p>
        </div>
      </div>
    </section>
  );
}

// ============ RATES PAGE ============
