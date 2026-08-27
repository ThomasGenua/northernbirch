import React from "react";
import { C, Linkify, SH, fs } from '../ui.jsx';

export default function ComplaintsPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Member Advocacy" tagColor={C.redText} title="Complaint Resolution" desc="Northern Birch is committed to resolving member concerns fairly and promptly. Here is our complaint resolution process."/>
        <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
          {[
            {step:"1",title:"Contact Your Branch",desc:"Start by speaking with a staff member at your branch or calling us at 416-465-4659. Most concerns can be resolved at this level. Our team is trained to listen, investigate, and find solutions.",color:C.accentText},
            {step:"2",title:"Escalate to Management",desc:"If you're not satisfied with the branch resolution, ask to speak with the Branch Manager or contact our CEO, Anita Saar, at asaar@northernbirchcu.com. Management will review your concern and respond within 10 business days.",color:C.amberText},
            {step:"3",title:"Contact Our Ombudsperson",desc:"If the matter remains unresolved, you may contact the Ombudsman for Banking Services and Investments (OBSI) -- an independent organization that investigates complaints about financial services providers in Canada. OBSI services are free to consumers.",color:C.redText},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:"28px 32px",border:"1px solid #eee",display:"flex",gap:20,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:fs,fontSize:18,color:"#fff",fontWeight:800}}>{s.step}</span></div>
              <div><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{s.title}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.desc}/></p></div>
            </div>
          ))}
        </div>
        <div style={{background:`${C.navy}08`,borderRadius:20,padding:32}}>
          <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 16px",fontWeight:700}}>External Resolution Bodies</h3>
          {[
            {name:"Ombudsman for Banking Services and Investments (OBSI)",phone:"1-888-451-4519",web:"www.obsi.ca",url:"https://www.obsi.ca",desc:"Independent, free dispute resolution for banking and investment complaints."},
            {name:"Financial Services Regulatory Authority of Ontario (FSRA)",phone:"416-250-7250",web:"www.fsrao.ca",url:"https://www.fsrao.ca",desc:"Ontario's financial services regulator. Handles complaints about credit unions."},
            {name:"Financial Consumer Agency of Canada (FCAC)",phone:"1-866-461-3222",web:"www.canada.ca/fcac",url:"https://www.canada.ca/en/financial-consumer-agency.html",desc:"Federal agency protecting consumers of financial products and services."},
            {name:"Office of the Privacy Commissioner of Canada",phone:"1-800-282-1376",web:"www.priv.gc.ca",url:"https://www.priv.gc.ca",desc:"Handles privacy complaints under PIPEDA."},
          ].map((b,i)=>(
            <div key={i} style={{padding:"12px 0",borderBottom:i<3?"1px solid #eee":"none"}}>
              <div style={{fontFamily:fs,fontSize:15,color:C.navy,fontWeight:700}}>{b.name}</div>
              <div style={{fontFamily:fs,fontSize:13,color:"#666",marginTop:2}}>{b.desc}</div>
              <div style={{fontFamily:fs,fontSize:13,color:C.accentText,marginTop:2}}><a href={`tel:+1${b.phone.replace(/\D/g,"").slice(-10)}`} style={{color:C.accentText,fontWeight:600}}>{b.phone}</a> | <a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:C.accentText,fontWeight:600}}>{b.web}</a></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TERMS OF USE ============
