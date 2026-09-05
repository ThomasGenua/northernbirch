import React from "react";
import { BANKING, BirchTrees, Btn, C, Clickable, Cornflower, Daisy, Fade, FlagStripe, SH, ff, fs, ratesEffectiveLabel, t, track, useMob, useW } from '../ui.jsx';


// ============ BANKING PRODUCTS (homepage) ============
function BankingProducts({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  return <section style={{background:C.birchLight,padding:w<=768?"56px 16px":"80px 24px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH tag={T("Banking Products")} tagColor={C.greenText} title={T("Everyday banking, start to finish")} desc={T("Northern Birch is a full-service credit union. Open a chequing account, finance a home, carry a card, save in a GIC or TFSA, and invest -- all in one membership.")}/>
      <div className="grid-5-2-1" style={{gap:12}}>
        {BANKING.map((b,i)=><Fade key={b.k} delay={i*0.06}>
          <Clickable onClick={()=>{track("product_card",{product:b.k,from:"home"});setPage(b.p)}} style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #EDE7D8",borderTop:`3px solid ${b.c}`,cursor:"pointer",height:"100%",display:"flex",flexDirection:"column"}}>
            <h3 style={{fontFamily:ff,fontSize:21,color:C.navy,margin:"0 0 8px"}}>{T(b.t)}</h3>
            <p style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.65,margin:"0 0 16px"}}>{b.d}</p>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:16}}>
              <span style={{fontFamily:ff,fontSize:28,color:b.tc||b.c,fontWeight:700}}>{b.rate}</span>
              <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{b.rl}</span>
            </div>
            <div style={{flex:1,marginBottom:18}}>
              {b.b.map((x,xi)=><div key={xi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:b.c,marginTop:6,flexShrink:0}}/>
                <span style={{fontFamily:fs,fontSize:13,color:"#666",lineHeight:1.5}}>{x}</span>
              </div>)}
            </div>
            <span style={{fontFamily:fs,fontSize:13,color:C.accentText,fontWeight:700}}>{T(b.cta)} &rarr;</span>
          </Clickable>
        </Fade>)}
      </div>
      <Fade delay={0.35}><div style={{display:"flex",gap:12,marginTop:28,flexWrap:"wrap"}}>
        <Btn color={C.navy} onClick={()=>setPage("rates")}>{T("See All Rates")}</Btn>
        <Btn outline color={C.navy} onClick={()=>setPage("booking")}>{T("Book an Appointment")}</Btn>
      </div></Fade>
      {/* #666 not #707070: this sits on the birch background, where the lighter grey is 4.36:1 */}
      <p style={{fontFamily:fs,fontSize:12,color:"#666",margin:"16px 0 0"}}>Rates effective {ratesEffectiveLabel()} and subject to change.</p>
    </div>
  </section>;
}

// Advice is the third product area, alongside banking and insurance, and until
// now the home page never said so. The three entries below are the ones a
// member can act on today; the full list lives on /advice.
const ADVICE_HOME=[
  {t:"Financial Check-Up",d:"A no-cost review of your saving, borrowing, retirement and protection. You leave with a written plan.",c:C.greenOnDark,go:["booking","Book a Check-Up"]},
  {t:"Retirement & Investments",d:"RRSP, TFSA, FHSA and RESP planning, plus Aviso Wealth, Qtrade and VirtualWealth portfolios.",c:C.accentOnDark,go:["advice","See how it works"]},
  {t:"Estate & Tax Planning",d:"Beneficiaries, wills, trusts and the contribution timing that keeps more of it in the family.",c:C.purpleOnDark,go:["estate","Plan ahead"]},
];

function AdviceBand({setPage,lang}){
  const T=(k)=>t(k,lang);
  const w=useW();
  return <section style={{background:C.navy,padding:w<=768?"56px 16px":"80px 24px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <SH dark tag={T("Financial Advice")} tagColor={C.birch} title={T("Advice from people you can meet")} desc={T("Planning, retirement, investments, estate and tax advice from Northern Birch's wealth team -- starting with a Financial Check-Up that costs members nothing.")}/>
      <div className="grid-3-2-1" style={{gap:16}}>
        {ADVICE_HOME.map((a,i)=><Fade key={a.t} delay={i*0.08}>
          <Clickable onClick={()=>{track("advice_card",{service:a.t});setPage(a.go[0])}} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:28,borderTop:`3px solid ${a.c}`,cursor:"pointer",height:"100%",display:"flex",flexDirection:"column"}}>
            <h3 style={{fontFamily:ff,fontSize:21,color:"#fff",margin:"0 0 10px"}}>{T(a.t)}</h3>
            <p style={{fontFamily:fs,fontSize:13.5,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:"0 0 18px"}}>{a.d}</p>
            <span style={{marginTop:"auto",fontFamily:fs,fontSize:13,color:a.c,fontWeight:700}}>{a.go[1]} &rarr;</span>
          </Clickable>
        </Fade>)}
      </div>
      <Fade delay={0.3}><div style={{display:"flex",gap:12,marginTop:28,flexWrap:"wrap"}}>
        <Btn color={C.greenFill} onClick={()=>setPage("advice")}>{T("Explore Financial Advice")}</Btn>
        <Btn outline color={C.birch} onClick={()=>setPage("booking")}>{T("Book an Appointment")}</Btn>
      </div></Fade>
    </div>
  </section>;
}

export default function HomePage({setPage,lang}){const mob=useMob();
  const T=(k)=>t(k,lang);
  return <>
    <section style={{minHeight:"100vh",background:`linear-gradient(170deg,${C.dark} 0%,${C.navy} 45%,#1e4060 100%)`,position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 75% 25%,rgba(200,184,138,0.07) 0%,transparent 55%)"}}/>
      <BirchTrees side="right" opacity={0.05}/>
      <BirchTrees side="left" opacity={0.03}/>
      {/* Cornflowers floating */}
      <Cornflower size={20} color="rgba(46,134,193,0.12)" style={{position:"absolute",top:"18%",right:"22%"}}/>
      <Cornflower size={14} color="rgba(46,134,193,0.08)" style={{position:"absolute",top:"45%",right:"12%"}}/>
      <Daisy size={16} color="rgba(255,255,255,0.06)" center="rgba(212,165,71,0.15)" style={{position:"absolute",top:"65%",right:"28%"}}/>
      <Cornflower size={12} color="rgba(46,134,193,0.06)" style={{position:"absolute",top:"75%",left:"8%"}}/>
      <div style={{maxWidth:1320,margin:"0 auto",padding:mob?"100px 16px 60px":"130px 24px 90px",position:"relative",zIndex:2}}>
        <Fade><div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(200,184,138,0.1)",border:"1px solid rgba(200,184,138,0.2)",borderRadius:40,padding:"7px 18px",marginBottom:36}}>
          <Cornflower size={14} color={C.birch}/>
          <span style={{fontFamily:fs,fontSize:11,color:C.birch,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>{T("A Full-Service Credit Union Since 1954")}</span>
          <Daisy size={14} color={C.birch} center="rgba(255,255,255,0.5)"/>
        </div></Fade>
        <Fade delay={0.08}><h1 style={{fontFamily:ff,fontSize:"clamp(36px,5vw,64px)",color:"#fff",lineHeight:1.07,maxWidth:780,margin:"0 0 24px"}}>{T("Your whole financial life.")}<br/><span style={{color:C.birch}}>{T("Under one Birch.")}</span></h1></Fade>
        <Fade delay={0.16}><p style={{fontFamily:fs,fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:560,lineHeight:1.75,margin:"0 0 40px"}}>{T("Chequing and savings. Mortgages and credit cards. GICs, TFSAs and RRSPs. Plus financial advice, investments, insurance and international transfers, all from one Toronto credit union.")}</p></Fade>
        <Fade delay={0.24}><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {[["accounts","Compare Accounts",C.accentText,false],["mortgages","Explore Mortgages",C.greenFill,false],
            ["cards","Apply for a Credit Card",C.purple,false],["quote","Get an Insurance Quote",undefined,true]]
            .map(([route,label,color,outline])=>
              <Btn key={route} color={color} outline={outline} onClick={()=>{track("hero_cta",{to:route});setPage(route)}}>{T(label)}</Btn>)}
        </div></Fade>
      </div>
    </section>
    <FlagStripe style={{margin:0}}/>
    <BankingProducts setPage={setPage} lang={lang}/>
    <AdviceBand setPage={setPage} lang={lang}/>
    <section style={{background:C.cream,padding:"64px 24px"}}><div style={{maxWidth:1320,margin:"0 auto"}}>
      <div className="grid-6-3-2" style={{gap:12}}>
        {[{l:"AI Insurance Advisor",p:"aiadvisor",c:C.purple},{l:"Life Event Simulator",p:"lifesim",c:C.amber},{l:"Coverage Analyzer",p:"analyzer",c:C.accent},{l:"Health Check",p:"healthcheck",c:C.green},{l:"Document Reader",p:"docreader",c:C.navy},{l:"My Dashboard",p:"dashboard",c:C.red}].map((qi,i)=>
          <Fade key={i} delay={i*0.05}><Clickable onClick={()=>setPage(qi.p)} style={{background:"#fff",borderRadius:16,padding:"24px 20px",border:"1px solid #eee",cursor:"pointer",textAlign:"center",transition:"all 0.3s",borderTop:`3px solid ${qi.c}`}}>
            <h4 style={{fontFamily:fs,fontSize:14,color:C.navy,margin:0,fontWeight:700}}>{qi.l}</h4>
          </Clickable></Fade>
        )}
      </div>
    </div></section>
    <section style={{background:C.cream,padding:"0 24px 64px"}}><div style={{maxWidth:1320,margin:"0 auto"}}>
      <div className="grid-4-2-1" style={{gap:12}}>
        {[{l:"Insurance",p:"insurance",d:"Life, home, auto, travel, co-op",c:C.accent},{l:"Financial Advice",p:"advice",d:"Planning, retirement, wealth, estate",c:C.greenText},{l:"Travel & FX",p:"travel",d:"Baltic travel, transfers, exchange",c:C.amber},{l:"Business",p:"business",d:"Benefits, commercial, succession",c:C.green},{l:"Digital Banking",p:"digital",d:"Dashboard, app, planning tools",c:C.accent},{l:"Estate Planning",p:"estate",d:"Wills, trusts, insurance strategies",c:C.purple},{l:"Rates",p:"rates",d:"Mortgage, GIC, lending rates",c:C.green},{l:"Blog & News",p:"blog",d:"Articles, education, updates",c:C.navy},{l:"Tax & Savings",p:"tax",d:"RRSP, TFSA, tax-smart insurance",c:C.green},{l:"Referral Program",p:"referrals",d:"Earn $50 per referral",c:C.amber}].map((s,i)=>
          <Fade key={i} delay={i*0.04}><Clickable onClick={()=>setPage(s.p)} style={{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #eee",cursor:"pointer",borderLeft:`4px solid ${s.c}`}}>
            <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 4px",fontWeight:700}}>{s.l}</h4>
            <p style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",margin:0}}>{s.d}</p>
          </Clickable></Fade>
        )}
      </div>
    </div></section>
  </>;
}
