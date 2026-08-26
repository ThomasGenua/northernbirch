import React, { useState } from "react";
import { Btn, C, SH, ff, fs } from '../ui.jsx';

export default function LeadershipPage({setPage}){
  const[tab,setTab]=useState("overview");
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  const tabs=[{l:"Overview",v:"overview"},{l:"Costs",v:"costs"},{l:"Legal & Regulatory",v:"legal"},{l:"Value & ROI",v:"roi"},{l:"Competitive Edge",v:"competitive"},{l:"Implementation",v:"implementation"}];
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <SH tag="For Northern Birch Leadership" tagColor={C.navy} title="The business case for digital transformation" desc="Everything Anita Saar and the Board need to evaluate this partnership. Costs, legal framework, value proposition, and implementation plan."/>
        <div style={{display:"flex",gap:6,marginBottom:32,flexWrap:"wrap"}}>
          {tabs.map(tb=><button key={tb.v} onClick={()=>setTab(tb.v)} style={{background:tab===tb.v?C.navy:"#fff",border:tab===tb.v?"none":"1px solid #ddd",borderRadius:10,padding:isMob?"10px 14px":"12px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,fontWeight:tab===tb.v?700:500,color:tab===tb.v?"#fff":C.navy,transition:"all 0.3s"}}>{tb.l}</button>)}
        </div>

        {tab==="overview"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>The Opportunity</h3>
            <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.8,marginBottom:16}}>Northern Birch offers zero insurance products. Every competitor of meaningful size -- Desjardins, Meridian, DUCA, FirstOntario -- offers insurance. NBCU members who need life, home, auto, or travel insurance must leave the credit union entirely, creating an opening for competitors to cross-sell banking products.</p>
            <p style={{fontFamily:fs,fontSize:15,color:"#555",lineHeight:1.8,marginBottom:24}}>This platform adds insurance distribution, international transfers, AI-powered financial tools, estate planning, and business services to Northern Birch's offering -- turning a ~$200M credit union into a comprehensive financial services provider that competes with institutions 100x its size.</p>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr 1fr":"repeat(4,1fr)",gap:16}}>
              {[{v:"C$4.05M",l:"5-Year Net Revenue",c:C.greenText},{v:"C$56K",l:"3-Year Total Cost to NBCU",c:C.accentText},{v:"Day 1",l:"Profitable From",c:C.amberText},{v:"1%",l:"Year 5 Cost-to-Revenue",c:C.purple}].map((m,i)=>
                <div key={i} style={{background:`${m.c}06`,borderRadius:16,padding:20,textAlign:"center",borderTop:`3px solid ${m.c}`}}>
                  <div style={{fontFamily:ff,fontSize:28,color:m.c,fontWeight:700}}>{m.v}</div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#666",marginTop:4}}>{m.l}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{background:`${C.navy}06`,borderRadius:20,padding:isMob?24:32,border:`1px solid ${C.navy}12`}}>
            <h3 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 12px"}}>What This Website Demonstrates</h3>
            <p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.7,marginBottom:16}}>This is not a mockup. Every feature on this site is functional:</p>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:10}}>
              {["7 AI features powered by Claude Opus 4.6 (real API calls, real conversations)","Real-time insurance quote calculator with actuarial math","Trilingual experience (English, Estonian, Latvian) -- 80+ translated strings","Credit score monitoring, budgeting, and spending categorization","International transfer widget with live EUR exchange rates","Digital document signing and identity verification","Claims filing wizard, appointment booking, coverage comparison","Canadian regulatory compliance (PIPEDA, AODA, FSRA, FINTRAC)","Estonian/Latvian cultural branding (birch trees, cornflowers, daisies, folk patterns)","Tax & savings optimizer with RRSP/TFSA calculators"].map((f,i)=>
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:C.greenText,fontSize:14,flexShrink:0}}>&#10003;</span><span style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.6}}>{f}</span></div>
              )}
            </div>
          </div>
        </div>}

        {tab==="costs"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 8px"}}>What Northern Birch Actually Pays</h3>
            <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",marginBottom:24}}>The insurance distribution model is dramatically cheaper than most board members expect.</p>
            {/* Cost table */}
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #eee",marginBottom:24}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",background:C.navy,padding:"14px 20px"}}>
                {["Cost Item","Year 1","Year 2","Year 3","3-Year Total"].map((h,i)=><span key={i} style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:700}}>{h}</span>)}
              </div>
              {[
                {item:"Oodler Technology & Consulting",y1:"C$0",y2:"C$0",y3:"C$0",total:"C$0 (pro bono)",highlight:true},
                {item:"Insurance Partner (The Personal, CUMIS, Manulife)",y1:"C$0",y2:"C$0",y3:"C$0",total:"C$0",highlight:true},
                {item:"RIBO Licensing (if subsidiary route)",y1:"C$3,000",y2:"C$2,000",y3:"C$2,000",total:"C$7,000"},
                {item:"One-Time Legal Counsel",y1:"C$5,000",y2:"-",y3:"-",total:"C$5,000"},
                {item:"Optional KESKUS Launch Marketing",y1:"C$5,000",y2:"C$3,000",y3:"C$3,000",total:"C$11,000"},
                {item:"E&O Insurance (subsidiary)",y1:"-",y2:"C$2,500",y3:"C$2,500",total:"C$5,000"},
                {item:"Staff Time (opportunity cost)",y1:"C$8,000",y2:"C$10,000",y3:"C$10,000",total:"C$28,000"},
                {item:"TOTAL",y1:"C$21,000",y2:"C$17,500",y3:"C$17,500",total:"C$56,000",bold:true},
              ].map((row,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:row.highlight?`${C.greenFill}06`:row.bold?`${C.navy}06`:i%2===0?"#fff":"#fafafa",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.item}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y1}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y2}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:row.bold||row.highlight?700:400}}>{row.y3}</span>
                  <span style={{fontFamily:fs,fontSize:13,color:row.highlight?C.green:C.navy,fontWeight:700}}>{row.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:16,marginBottom:24}}>
            {[
              {title:"What Oodler Provides Free",color:C.greenText,items:["Insurance partner negotiation","KESKUS launch strategy","Regulatory navigation (FSRA/RIBO)","Website & digital UX audit","Cybersecurity assessment","Payments modernization advisory","Quarterly performance analytics","Ongoing technology advisory"],value:"C$75K-100K estimated value"},
              {title:"What Insurers Provide Free",color:C.accentText,items:["Insurance products & underwriting","Quoting tools & digital infrastructure","Staff training & certification","Marketing materials & co-branding","Policy administration","Claims processing","Dedicated partnership manager","Regulatory compliance support"],value:"They want NBCU's distribution"},
              {title:"What NBCU Provides",color:C.amberText,items:["Member relationships & trust","Branch staff for referrals","Community network","Access to member data (with consent)","Board approval & alignment","RIBO licensing fees","Optional marketing spend","Commitment to offer insurance"],value:"C$56K over 3 years"},
            ].map((col,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee",borderTop:`3px solid ${col.color}`}}>
                <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>{col.title}</h4>
                {col.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><div style={{width:5,height:5,borderRadius:"50%",background:col.color,flexShrink:0}}/><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{item}</span></div>)}
                <div style={{marginTop:12,padding:"8px 12px",background:`${col.color}08`,borderRadius:8}}><span style={{fontFamily:fs,fontSize:12,color:col.color,fontWeight:600}}>{col.value}</span></div>
              </div>
            ))}
          </div>
          <div style={{background:`${C.greenFill}08`,borderRadius:16,padding:"20px 28px",borderLeft:`4px solid ${C.green}`}}>
            <p style={{fontFamily:fs,fontSize:14,color:"#555",margin:0,lineHeight:1.7}}><strong style={{color:C.navy}}>Bottom line:</strong> Northern Birch's total 3-year cost is C$56,000 for projected revenue of C$1.49 million. That's a 26x return on investment. The program is profitable from Day 1 because both Oodler and the insurer provide their services at no cost to NBCU.</p>
          </div>
        </div>}

        {tab==="legal"&&<div>
          {[
            {title:"Insurance Distribution Model",color:C.accentText,content:"Northern Birch becomes an insurance distributor, NOT an insurance company. NBCU does not manufacture products, underwrite risk, process claims, or hold insurance capital reserves. All of that is done by the insurance manufacturing partners (The Personal, CUMIS, Manulife). NBCU refers members to insurance products and earns commissions on policies sold.",items:["No underwriting risk to NBCU","No claims liability","No insurance capital requirements","No impact on NBCU's capital adequacy ratios"]},
            {title:"FSRA (Financial Services Regulatory Authority of Ontario)",color:C.greenText,content:"Northern Birch is regulated by FSRA as an Ontario credit union. FSRA permits credit unions to distribute insurance products through referral arrangements or licensed subsidiaries. The recommended approach starts with a referral arrangement (operational in 6-8 weeks, no RIBO license required) before transitioning to a RIBO-licensed subsidiary as volume justifies.",items:["Referral model: operational in 6-8 weeks","No RIBO license required for referrals","FSRA notification required (not approval)","Full RIBO subsidiary as volume grows"]},
            {title:"RIBO (Registered Insurance Brokers of Ontario)",color:C.amberText,content:"RIBO regulates insurance brokers in Ontario. Under a referral model, NBCU staff refer members to the insurer's licensed agents -- no RIBO license needed. Under a subsidiary model, NBCU creates a RIBO-licensed entity with at least one licensed principal broker. CUMIS and The Personal provide full RIBO navigation support.",items:["Phase 1: Referral (no RIBO needed)","Phase 2: Licensed subsidiary","CUMIS provides regulatory guidance","Annual RIBO fees ~C$2,000-3,000"]},
            {title:"PIPEDA (Privacy)",color:C.purple,content:"All member data handling complies with the Personal Information Protection and Electronic Documents Act. Insurance referrals require member consent before sharing information with insurance partners. Members can opt out of insurance marketing at any time. Health information for underwriting requires explicit consent. All data is encrypted and stored in Canada.",items:["Consent required before data sharing","Opt-out available at any time","Health data requires explicit consent","All data stored in Canada"]},
            {title:"FINTRAC (Anti-Money Laundering)",color:C.navy,content:"Northern Birch already complies with FINTRAC for banking operations. Insurance distribution adds minimal AML requirements since the insurers handle their own FINTRAC obligations. International transfer services through partners like Wise are FINTRAC-registered. Digital identity verification (Jumio) satisfies KYC requirements.",items:["Existing FINTRAC compliance covers banking","Insurers handle their own AML","Transfer partners are FINTRAC-registered","Digital ID verification for KYC"]},
            {title:"AODA (Accessibility)",color:C.redText,content:"The Accessibility for Ontarians with Disabilities Act requires all digital services to meet WCAG 2.0 Level AA standards. This website and all member-facing digital tools are designed with accessibility in mind: keyboard navigation, screen reader support, sufficient color contrast, and resizable text. The new KESKUS branch will exceed current physical accessibility standards.",items:["WCAG 2.0 Level AA compliance","Keyboard and screen reader support","Accessible branch design","Staff training on accessible service"]},
          ].map((section,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:isMob?24:32,border:"1px solid #eee",marginBottom:16,borderLeft:`4px solid ${section.color}`}}>
              <h3 style={{fontFamily:fs,fontSize:18,color:C.navy,margin:"0 0 10px",fontWeight:700}}>{section.title}</h3>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,marginBottom:12}}>{section.content}</p>
              <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:8}}>
                {section.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,alignItems:"center"}}><span style={{color:section.color,fontSize:12}}>&#10003;</span><span style={{fontFamily:fs,fontSize:13,color:"#555"}}>{item}</span></div>)}
              </div>
            </div>
          ))}
        </div>}

        {tab==="roi"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>Five-Year Revenue Projection</h3>
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #eee",marginBottom:24}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",background:C.navy,padding:"14px 20px"}}>
                {["","Year 1","Year 2","Year 3","Year 4","Year 5"].map((h,i)=><span key={i} style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:700}}>{h}</span>)}
              </div>
              {[
                {item:"Insurance Revenue",vals:["C$165K","C$465K","C$860K","C$1.17M","C$1.49M"],c:C.green},
                {item:"Total Costs",vals:["(C$21K)","(C$17.5K)","(C$17.5K)","(C$20K)","(C$20.5K)"],c:C.red},
                {item:"Net Annual Impact",vals:["C$144K","C$447.5K","C$842.5K","C$1.15M","C$1.47M"],c:C.accent,bold:true},
                {item:"Cumulative Net",vals:["C$144K","C$591.5K","C$1.43M","C$2.58M","C$4.05M"],c:C.navy,bold:true},
                {item:"Cost as % of Revenue",vals:["13%","4%","2%","2%","1%"],c:"#6B6B6B"},
              ].map((row,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:i%2===0?"#fff":"#fafafa",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:row.bold?700:400}}>{row.item}</span>
                  {row.vals.map((v,vi)=><span key={vi} style={{fontFamily:fs,fontSize:13,color:row.c,fontWeight:row.bold?700:400}}>{v}</span>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee"}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Revenue Sources</h4>
              {[
                {l:"Creditor Insurance (mortgage life/disability)",v:"C$45K-$120K/yr",d:"30-40% take rate on new mortgages"},
                {l:"Term Life & Critical Illness",v:"C$35K-$200K/yr",d:"Commissions on new policies + renewals"},
                {l:"Home & Auto Insurance (The Personal)",v:"C$50K-$400K/yr",d:"Exclusive group rates drive adoption"},
                {l:"Travel Insurance",v:"C$10K-$75K/yr",d:"Baltic community = high travel frequency"},
                {l:"Group Benefits (Manulife)",v:"C$15K-$150K/yr",d:"5-10 business accounts per year"},
                {l:"Additional Revenue Streams",v:"C$10K-$300K/yr",d:"International transfers, FX, estate, referrals"},
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<5?"1px solid #f5f5f5":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.greenText,fontWeight:700}}>{r.v}</span></div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#707070",marginTop:2}}>{r.d}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #eee"}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Non-Revenue Value</h4>
              {[
                {l:"Member Retention",d:"Members with 3+ products have 97%+ retention. Insurance is the stickiest product in financial services."},
                {l:"Competitive Defense",d:"Every month without insurance is a month Lemonade, Sonnet, and PolicyMe are acquiring NBCU members."},
                {l:"Data Intelligence",d:"Insurance data improves lending decisions. Lending data improves insurance targeting. The data flywheel compounds."},
                {l:"KESKUS Brand Moment",d:"Launching insurance alongside the new flagship branch creates a once-in-a-generation brand event."},
                {l:"Multi-Generational Deepening",d:"Insuring a family's home, auto, and life ties them to NBCU across 40+ years and multiple generations."},
                {l:"Community Leadership",d:"Being the first heritage credit union with AI-powered insurance advisory positions NBCU as an innovation leader."},
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<5?"1px solid #f5f5f5":"none"}}>
                  <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600,marginBottom:2}}>{r.l}</div>
                  <div style={{fontFamily:fs,fontSize:12,color:"#666",lineHeight:1.6}}>{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {tab==="competitive"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 16px"}}>What No Competitor Can Replicate</h3>
            {[
              {title:"AI Insurance Advisor in Estonian & Latvian",desc:"No bank, credit union, or insurer in Canada has an AI advisor that speaks Estonian and Latvian. This isn't a translation -- it's a culturally informed advisor that understands Baltic travel patterns, co-op housing, and cross-border family needs.",color:C.purple},
              {title:"Co-op Apartment Insurance",desc:"Northern Birch is one of the few Ontario institutions with both co-op mortgage expertise AND co-op insurance products. Standard condo policies don't fit co-op structures. This is a genuinely ownable niche.",color:C.accentText},
              {title:"Baltic Travel Insurance + Transfers",desc:"Annual multi-trip coverage designed for members who visit Estonia and Latvia regularly, combined with in-app international transfers to the Baltics. No competitor bundles these.",color:C.amberText},
              {title:"Multi-Generational Family Intelligence",desc:"NBCU knows members' parents, children, and grandchildren across 70+ years. A home insurance renewal for Juri triggers a life insurance review for his daughter Maria. No big bank has this depth of relationship.",color:C.greenText},
              {title:"Community Network Effect",desc:"In tight-knit Estonian and Latvian communities, one satisfied insurance customer generates 3-4 referrals. Juri tells everyone at the Latvian Centre. This word-of-mouth multiplier doesn't exist at TD or Scotiabank.",color:C.navy},
            ].map((s,i)=>(
              <div key={i} style={{padding:"16px 0",borderBottom:i<4?"1px solid #f0f0f0":"none"}}>
                <h4 style={{fontFamily:fs,fontSize:16,color:s.color,margin:"0 0 6px",fontWeight:700}}>{s.title}</h4>
                <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:C.navy,borderRadius:20,padding:isMob?24:32}}>
            <h4 style={{fontFamily:fs,fontSize:16,color:"#fff",margin:"0 0 16px",fontWeight:700}}>Competitor Comparison</h4>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr 1fr",gap:12}}>
              {[
                {name:"Northern Birch\n(with Oodler)",features:["AI advisor","Estonian/Latvian","Co-op insurance","Baltic transfers","Community trust"],score:"10/10",c:C.green},
                {name:"Desjardins /\nMeridian",features:["Insurance products","Large scale","No AI advisor","No Baltic focus","No co-op specialty"],score:"6/10",c:C.amber},
                {name:"Big Banks\n(TD, RBC, CIBC)",features:["Basic insurance","Scale","No personalization","No heritage focus","Branch closures"],score:"4/10",c:C.amber},
                {name:"Digital Insurers\n(Lemonade, Sonnet)",features:["Fast quotes","Modern UX","No banking","No community","No advice"],score:"5/10",c:C.amber},
                {name:"Insurance Brokers",features:["Product choice","Advice","No banking","No digital","No AI"],score:"5/10",c:C.amber},
              ].map((comp,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:`1px solid ${i===0?C.green:"rgba(255,255,255,0.06)"}40`,textAlign:"center"}}>
                  <div style={{fontFamily:fs,fontSize:12,color:"#fff",fontWeight:700,whiteSpace:"pre-line",marginBottom:8,minHeight:36}}>{comp.name}</div>
                  <div style={{fontFamily:ff,fontSize:20,color:comp.c,fontWeight:700,marginBottom:8}}>{comp.score}</div>
                  {comp.features.map((f,fi)=><div key={fi} style={{fontFamily:fs,fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:3}}>{f}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>}

        {tab==="implementation"&&<div>
          <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <h3 style={{fontFamily:ff,fontSize:24,color:C.navy,margin:"0 0 20px"}}>18-Month Implementation Roadmap</h3>
            {[
              {phase:"Month 1-2",title:"Discovery & Partner Selection",color:C.accentText,items:["Insurance partner RFP (CUMIS, The Personal, Manulife)","Commission structure negotiation","Regulatory review with FSRA","Member needs survey","KESKUS timeline alignment"]},
              {phase:"Month 2-3",title:"Licensing & Compliance",color:C.greenText,items:["FSRA notification filed","Referral agreement with insurers","Privacy assessment (PIPEDA)","Compliance framework established","Staff training program begins"]},
              {phase:"Month 3-6",title:"Phase 1 Launch: Creditor & Life",color:C.amberText,items:["Creditor insurance embedded in mortgage applications","Term life and critical illness referrals begin","Staff certified on insurance products","KESKUS pre-launch marketing","Digital platform soft launch"]},
              {phase:"Month 6-10",title:"Phase 2: Home, Auto & Travel",color:C.purple,items:["The Personal P&C quote engine live","Co-op apartment insurance product","Auto insurance referrals active","Baltic travel insurance package","Tenant insurance via mobile app"]},
              {phase:"Month 10-14",title:"Phase 3: Group Benefits & Digital",color:C.navy,items:["Manulife group benefits for business members","Commercial property & liability insurance","International transfer service live","Full insurance dashboard in online banking","AI advisor launched"]},
              {phase:"Month 14-18",title:"Optimization & Expansion",color:C.redText,items:["RIBO subsidiary transition (if volume justifies)","Estate planning advisory program","Payroll partnerships active","Cross-sell analytics and optimization","Board performance reporting"]},
            ].map((phase,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:i<5?24:0,paddingBottom:i<5?24:0,borderBottom:i<5?"1px solid #f0f0f0":"none"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:phase.color,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:fs,fontSize:12,color:"#fff",fontWeight:800}}>{i+1}</span></div>
                  {i<5&&<div style={{width:2,flex:1,background:"#eee",marginTop:8}}/>}
                </div>
                <div>
                  <div style={{fontFamily:fs,fontSize:12,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{phase.phase}</div>
                  <h4 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"4px 0 10px",fontWeight:700}}>{phase.title}</h4>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {phase.items.map((item,ii)=><span key={ii} style={{fontFamily:fs,fontSize:12,color:"#666",background:"#f5f5f5",padding:"4px 10px",borderRadius:8}}>{item}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Schedule Strategic Alignment Meeting</Btn>
          </div>
        </div>}
      </div>
    </section>
  );
}

// ============ COOKIE CONSENT BANNER ============
// Cookie preference.
//
// The previous banner claimed the site analyses usage, offered "Accept All"
// and "Essential Only" — both wired to the same setShow(false) — and stored
// nothing, so it reappeared on every load and the choice meant nothing. The
// site also sets no cookies and loads no analytics, so it was asking consent
// for something that does not happen.
//
// This keeps the choice, makes it real, and states what is true today. If
// analytics is added later, gate it on analyticsAllowed() and the stored
// answer already applies.
