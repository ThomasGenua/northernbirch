import React, { useState } from "react";
import { Btn, C, CONSENT_VERSION, ConsentNotice, errBox, Fade, ff, fs, SH, submitForm, useMob } from '../ui.jsx';

export default function ReferralsPage(){
  const mob=useMob();
  const[submitted,setSubmitted]=useState(false);
  const[yourName,setYourName]=useState("");const[memberNo,setMemberNo]=useState("");
  const[friendName,setFriendName]=useState("");const[friendEmail,setFriendEmail]=useState("");
  const[sending,setSending]=useState(false);const[error,setError]=useState("");
  const[consent,setConsent]=useState(false);
  const canSubmit=yourName.trim()&&friendName.trim()&&friendEmail.trim()&&consent;
  const submit=async()=>{
    setError("");setSending(true);
    const ok=await submitForm("referral",{yourName,memberNo,friendName,friendEmail,consent:"yes",consentVersion:CONSENT_VERSION});
    setSending(false);
    if(ok)setSubmitted(true);
    else setError("We could not send that referral. Please try again, or call us at 416-465-4659.");
  };
  return(
    <section style={{background:C.birchLight,padding:mob?"60px 16px":"80px 24px",paddingTop:mob?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Member Referral Program" tagColor={C.amberText} title="Friends don't let friends go to big banks" desc="Refer a friend to Northern Birch and you both earn $50. There's no limit to the number of friends you can refer."/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16,marginBottom:32}}>
          {[{step:"1",title:"Refer a Friend",desc:"Share your unique referral link or tell a friend to mention your name when they join."},{step:"2",title:"They Join",desc:"Your friend opens an account and completes their first qualifying transaction."},{step:"3",title:"You Both Earn $50",desc:"$50 is deposited into both your account and your friend's account. Win-win!"}].map((s,i)=>
            <Fade key={i} delay={i*0.1}><div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee",textAlign:"center"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.amber,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:fs,fontSize:16,color:"#fff",fontWeight:800}}>{s.step}</span></div>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.title}</h4>
              <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.6}}>{s.desc}</p>
            </div></Fade>
          )}
        </div>
        {!submitted?<div style={{background:"#fff",borderRadius:24,padding:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 20px"}}>Refer Someone Now</h3>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
            <div><label htmlFor="ref-your-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Name</label><input id="ref-your-name" value={yourName} onChange={e=>setYourName(e.target.value)} placeholder="Your full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-member-no" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Member Number</label><input id="ref-member-no" value={memberNo} onChange={e=>setMemberNo(e.target.value)} placeholder="Member #" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-friend-name" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Friend's Name</label><input id="ref-friend-name" value={friendName} onChange={e=>setFriendName(e.target.value)} placeholder="Their full name" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="ref-friend-email" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Friend's Email</label><input id="ref-friend-email" value={friendEmail} onChange={e=>setFriendEmail(e.target.value)} placeholder="their@email.com" style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          </div>
          <ConsentNotice id="referral-consent" checked={consent} onChange={setConsent} purpose="so we can contact the person I am referring" extra="I confirm I have their permission to share their name and email with Northern Birch."/>
          {error&&<div style={errBox}>{error}</div>}
          <button onClick={submit} disabled={sending||!canSubmit} style={{width:"100%",background:(sending||!canSubmit)?"#ccc":C.amber,border:"none",borderRadius:12,padding:"16px",cursor:(sending||!canSubmit)?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{sending?"Sending...":"Send Referral"}</button>
        </div>:<div style={{textAlign:"center",padding:40}}><div style={{width:80,height:80,borderRadius:"50%",background:`${C.greenFill}12`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,color:C.greenText}}>&#10003;</span></div><h3 style={{fontFamily:ff,fontSize:28,color:C.navy}}>Referral Sent!</h3><p style={{fontFamily:fs,fontSize:15,color:"#666"}}>Your friend will receive an invitation email. Once they join and complete a qualifying transaction, you'll both earn $50.</p><Btn onClick={()=>setSubmitted(false)}>Refer Another Friend</Btn></div>}
      </div>
    </section>
  );
}

// ============ BLOG PAGE ============
