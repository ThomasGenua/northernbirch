import React from "react";
import { Btn, C, SH, ff, fs } from '../ui.jsx';

// ============ GLOSSARY PAGE ============
export default function MobileAppPage({setPage}){
  return(
    <section className="sec" style={{background:C.dark,minHeight:"100vh"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH dark tag="Mobile Banking" tagColor={C.accentOnDark} title="Northern Birch in your pocket" desc="Download the Northern Birch mobile app for full-service banking, insurance management, international transfers, and more -- 24/7 from anywhere."/>
        <div className="grid-2-1" style={{gap:32}}>
          <div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {title:"Full Account Management",desc:"View balances, transaction history, transfer between accounts, and pay bills."},
                {title:"Deposit Cheques",desc:"Snap a photo of your cheque and deposit it instantly from your phone."},
                {title:"Insurance Dashboard",desc:"View all policies, coverage details, and file claims directly from the app."},
                {title:"Insurance Quotes",desc:"Get home, auto, tenant, or travel insurance quotes in under 2 minutes."},
                {title:"International Transfers",desc:"Send money to Estonia, Latvia, or worldwide with real-time tracking."},
                {title:"Interac e-Transfer",desc:"Send and receive money instantly to any Canadian bank account."},
                {title:"Branch & ATM Locator",desc:"Find your nearest branch or surcharge-free ATM using GPS."},
                {title:"Biometric Login",desc:"Sign in securely with Face ID, Touch ID, or fingerprint."},
                {title:"Real-Time Notifications",desc:"Get alerts for transactions, payments, transfers, and insurance renewals."},
                {title:"Apple Pay & Google Pay",desc:"Add your Northern Birch debit and credit cards to your mobile wallet."},
              ].map((f,i)=><div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.accentText}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontFamily:fs,fontSize:11,color:C.accentOnDark,fontWeight:800}}>{String(i+1).padStart(2,"0")}</span></div>
                <div><h4 style={{fontFamily:fs,fontSize:14,color:"#fff",margin:"0 0 4px",fontWeight:700}}>{f.title}</h4><p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>{f.desc}</p></div>
              </div>)}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:24}}>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:32,padding:"48px 40px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{width:80,height:80,borderRadius:20,background:`linear-gradient(135deg,${C.birch},${C.accent})`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:28,fontWeight:800,color:"#fff"}}>NB</span></div>
              <h3 style={{fontFamily:ff,fontSize:24,color:"#fff",margin:"0 0 8px"}}>Northern Birch App</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"rgba(255,255,255,0.6)",margin:"0 0 24px",lineHeight:1.6}}>Available for iOS and Android. Free to download with your Northern Birch membership.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:16}}>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 20px"}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>App Store</span></div>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 20px"}}><span style={{fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>Google Play</span></div>
              </div>
              <p style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.55)",margin:"0 0 20px",lineHeight:1.6}}>Search &ldquo;Northern Birch Credit Union&rdquo; in the App Store or Google Play, or ask us to walk you through setup.</p>
              <Btn color={C.accentText} onClick={()=>setPage("booking")}>Book a setup appointment &rarr;</Btn>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,padding:"20px 24px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
              <p style={{fontFamily:fs,fontSize:13,color:"rgba(255,255,255,0.6)",margin:0}}>Need help? 24/7 online banking support: <a href="tel:+18669922490" style={{color:C.accentOnDark,fontWeight:600}}>1-866-992-2490</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
