import React, { useState } from "react";
import { Btn, C, ff, fs, money, prefersReducedMotion, useMob } from '../ui.jsx';

export default function DashboardPage({setPage}){
  const mob=useMob();
  const[transferAmt,setTransferAmt]=useState("200");
  // The field accepted anything: "abc" produced "Recipient Gets EUR NaN" beside a
  // live "Send C$abc" button. Parse strictly and gate the send on the result.
  const scrollTo=(id)=>{const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:prefersReducedMotion()?"auto":"smooth",block:"center"});const f=el.querySelector("input,button");if(f)f.focus({preventScroll:true})};
  const scrollToTransfer=()=>scrollTo("dash-transfer");
  const scrollToDocs=()=>scrollTo("dash-documents");
  const transferNum=/^\d{1,7}(\.\d{1,2})?$/.test(transferAmt.trim())?parseFloat(transferAmt.trim()):NaN;
  const transferOk=Number.isFinite(transferNum)&&transferNum>=1&&transferNum<=25000;
  const[transferTo,setTransferTo]=useState("Grandmother Maija - Riga, Latvia");
  const[transferRef]=useState(()=>"NB-TXN-"+Math.floor(Math.random()*900000+100000));
  const[transferSent,setTransferSent]=useState(false);
  const[signedDocs,setSignedDocs]=useState({});
  const isMob=mob;
  // Spending data
  const spending=[{cat:"Housing",amt:2132,pct:42,c:C.navy},{cat:"Food & Grocery",amt:847,pct:17,c:C.green},{cat:"Transportation",amt:435,pct:9,c:C.amber},{cat:"Insurance",amt:343,pct:7,c:C.accent},{cat:"Int'l Transfers",amt:275,pct:5,c:C.purple},{cat:"Entertainment",amt:234,pct:5,c:"#E91E63"},{cat:"Shopping",amt:198,pct:4,c:"#FF9800"},{cat:"Utilities",amt:187,pct:4,c:"#607D8B"},{cat:"Other",amt:389,pct:7,c:"#9E9E9E"}];
  const totalSpend=spending.reduce((s,x)=>s+x.amt,0);
  return(
    <section style={{background:"#f0f2f5",padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100,minHeight:"100vh"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:isMob?"flex-start":"center",marginBottom:24,flexDirection:isMob?"column":"row",gap:12}}>
          <div>
            <h2 style={{fontFamily:ff,fontSize:isMob?22:28,color:C.navy,margin:"0 0 4px"}}>Welcome back, Maria</h2>
            <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:0}}>Member since 2018 -- Last login: March 19, 2026 -- <span style={{color:C.greenText,fontWeight:600}}>Identity Verified</span> &#9989;</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn small color={C.accentText} onClick={()=>setPage&&setPage("quote")}>Get a Quote</Btn>
            <Btn small color={C.greenFill} onClick={scrollToTransfer}>Send Transfer</Btn>
            <Btn small color={C.purple} onClick={()=>setPage&&setPage("messages")}>Messages</Btn>
            <Btn small outline color={C.navy} onClick={()=>setPage&&setPage("contact")}>Account Settings</Btn>
          </div>
        </div>
        {/* Notifications */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          <div style={{background:`${C.amber}10`,border:`1px solid ${C.amber}30`,borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:16}}>&#128276;</span>
            <span style={{fontFamily:fs,fontSize:13,color:C.navy,flex:1}}>Your home insurance renewal is coming up on <strong>April 15, 2026</strong>. Review your coverage to ensure you're still adequately protected.</span>
            <button onClick={()=>setPage("compare")} style={{background:C.amberFill,border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600,whiteSpace:"nowrap"}}>Review Now</button>
          </div>
          <div style={{background:`${C.accentText}08`,border:`1px solid ${C.accent}20`,borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:16}}>&#9997;</span>
            <span style={{fontFamily:fs,fontSize:13,color:C.navy,flex:1}}>2 documents pending your electronic signature. Sign now to complete your insurance application.</span>
            <button onClick={scrollToDocs} style={{background:C.accentText,border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600,whiteSpace:"nowrap"}}>Sign Now</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"2fr 1fr",gap:24}}>
          {/* ======= LEFT COLUMN ======= */}
          <div>
            {/* Account Summary */}
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr",gap:12,marginBottom:24}}>
              {[{label:"Chequing",balance:"C$4,237.89",num:"****6742",c:C.navy},{label:"TFSA Savings",balance:"C$18,450.00",num:"****3891",c:C.green},{label:"RRSP",balance:"C$47,200.00",num:"****4510",c:C.purple},{label:"Mortgage",balance:"-C$387,200",num:"****1205",c:C.accent}].map((a,i)=>
                <div key={i} style={{background:"#fff",borderRadius:16,padding:"20px",borderTop:`3px solid ${a.c}`}}>
                  <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>{a.label}</div>
                  <div style={{fontFamily:ff,fontSize:isMob?18:20,color:C.navy,fontWeight:700,margin:"6px 0 4px"}}>{a.balance}</div>
                  <div style={{fontFamily:fs,fontSize:11,color:"#707070"}}>{a.num}</div>
                </div>
              )}
            </div>

            {/* Credit Score Widget */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Credit Score</h3>
                <span style={{fontFamily:fs,fontSize:11,color:"#707070"}}>Via Equifax -- Updated Mar 1, 2026</span>
              </div>
              <div style={{display:"flex",alignItems:isMob?"flex-start":"center",gap:24,flexDirection:isMob?"column":"row"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:110,height:110,borderRadius:"50%",background:`conic-gradient(${C.greenFill} 0% 78%, #eee 78% 100%)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                    <div style={{width:88,height:88,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                      <span style={{fontFamily:ff,fontSize:32,color:C.navy,fontWeight:700}}>782</span>
                    </div>
                  </div>
                  <div style={{fontFamily:fs,fontSize:12,color:C.greenText,fontWeight:600,marginTop:8}}>Excellent</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[{l:"Payment History",v:"100%",s:"Excellent"},{l:"Credit Utilization",v:"18%",s:"Good"},{l:"Credit Age",v:"8 years",s:"Good"},{l:"Recent Inquiries",v:"1",s:"Low Impact"}].map((f,i)=>
                      <div key={i} style={{padding:"8px 12px",background:"#f8f8f8",borderRadius:10}}>
                        <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>{f.l}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
                          <span style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{f.v}</span>
                          <span style={{fontFamily:fs,fontSize:10,color:C.greenText,fontWeight:600}}>{f.s}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{fontFamily:fs,fontSize:11,color:"#707070",margin:"12px 0 0"}}>Your score has increased 12 points since January. Keep it up! Credit monitoring is free for all Northern Birch members.</p>
                </div>
              </div>
            </div>

            {/* Spending & Budgeting */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Monthly Spending</h3>
                <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>C${totalSpend.toLocaleString()} <span style={{color:"#707070",fontWeight:400}}>this month</span></span>
              </div>
              {/* Visual bar chart */}
              <div style={{marginBottom:16}}>
                {spending.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                    <span style={{fontFamily:fs,fontSize:12,color:"#666",width:110,flexShrink:0}}>{s.cat}</span>
                    <div style={{flex:1,height:20,background:"#f5f5f5",borderRadius:10,overflow:"hidden"}}>
                      <div style={{width:`${s.pct}%`,height:"100%",background:s.c,borderRadius:10,transition:"width 1s ease"}}/>
                    </div>
                    <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600,width:70,textAlign:"right"}}>C${s.amt}</span>
                  </div>
                ))}
              </div>
              <div style={{background:`${C.accentText}06`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>&#128161;</span>
                <span style={{fontFamily:fs,fontSize:12,color:C.navy}}>You spent <strong>C$435</strong> on transportation this month -- 15% more than last month. Consider bundling auto insurance with home for savings.</span>
              </div>
            </div>

            {/* Insurance Policies */}
            <div style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>My Insurance Policies</h3>
                <span style={{fontFamily:fs,fontSize:12,color:C.accentText,fontWeight:600,cursor:"pointer"}}>View All Details</span>
              </div>
              {[
                {type:"Home Insurance",provider:"The Personal",policy:"HP-2024-88721",status:"Active",renewal:"Apr 15, 2026",premium:"C$142.50/mo",coverage:"C$650,000 Replacement Cost",c:C.green},
                {type:"Auto Insurance",provider:"The Personal",policy:"AP-2024-34219",status:"Active",renewal:"Jun 1, 2026",premium:"C$168.00/mo",coverage:"C$2M Liability + Collision + Ajusto",c:C.amber},
                {type:"Term Life Insurance",provider:"CUMIS",policy:"TL-2025-11087",status:"Active",renewal:"Guaranteed 20yr",premium:"C$32.50/mo",coverage:"C$500,000 - 20 Year Term",c:C.accent},
                {type:"Mortgage Protection",provider:"CUMIS",policy:"MP-2024-55432",status:"Active",renewal:"Tied to Mortgage",premium:"Included",coverage:"Life + Disability on Mortgage",c:C.navy},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<3?"1px solid #f5f5f5":"none"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`${p.c}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:p.c}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:700}}>{p.type}</div>
                      <span style={{fontFamily:fs,fontSize:10,color:C.greenText,fontWeight:600,background:`${C.greenFill}10`,padding:"3px 8px",borderRadius:6}}>{p.status}</span>
                    </div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:2}}>{p.provider} -- {p.coverage} -- <span style={{color:C.accentText,fontWeight:600}}>{p.premium}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Signing */}
            <div id="dash-documents" style={{background:"#fff",borderRadius:20,padding:28,marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:0,fontWeight:700}}>Documents & E-Signatures</h3>
                <span style={{background:C.redText,color:"#fff",fontFamily:fs,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>2 Pending</span>
              </div>
              {[
                {name:"Critical Illness Insurance Application",provider:"CUMIS",date:"Mar 15, 2026",status:"pending",type:"Insurance"},
                {name:"TFSA Beneficiary Designation Update",provider:"Northern Birch",date:"Mar 12, 2026",status:"pending",type:"Account"},
                {name:"Home Insurance Policy Renewal",provider:"The Personal",date:"Feb 28, 2026",status:"signed",type:"Insurance"},
                {name:"Mortgage Renewal Agreement",provider:"Northern Birch",date:"Jan 15, 2026",status:"signed",type:"Mortgage"},
              ].map((doc,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<3?"1px solid #f5f5f5":"none"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:doc.status==="pending"?`${C.amber}10`:`${C.greenFill}08`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:16}}>{doc.status==="pending"?"&#9997;":"&#9989;"}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:600}}>{doc.name}</div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>{doc.provider} -- {doc.date}</div>
                  </div>
                  {doc.status==="pending"?
                    <button onClick={()=>setSignedDocs(p=>({...p,[i]:true}))} style={{background:signedDocs[i]?C.greenFill:C.accentText,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"#fff",fontWeight:600}}>{signedDocs[i]?"Signed ✓":"Sign Now"}</button>:
                    <span style={{fontFamily:fs,fontSize:11,color:C.greenText,fontWeight:600}}>Signed &#9989;</span>
                  }
                </div>
              ))}
              <p style={{fontFamily:fs,fontSize:11,color:"#707070",margin:"12px 0 0"}}>E-signatures are legally binding under Canada's Electronic Commerce Act. Documents are encrypted and stored securely.</p>
            </div>

            {/* Recent Transactions */}
            <div style={{background:"#fff",borderRadius:20,padding:28}}>
              <h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 20px",fontWeight:700}}>Recent Transactions</h3>
              {[
                {desc:"Interac e-Transfer sent to Laila J.",amount:"-C$150.00",date:"Mar 19",type:"transfer",cat:"Transfer"},
                {desc:"Apple Pay - Loblaws",amount:"-C$87.43",date:"Mar 18",type:"purchase",cat:"Food & Grocery"},
                {desc:"Mortgage Payment",amount:"-C$1,847.22",date:"Mar 15",type:"payment",cat:"Housing"},
                {desc:"Home Insurance - The Personal",amount:"-C$142.50",date:"Mar 15",type:"insurance",cat:"Insurance"},
                {desc:"Payroll Deposit - TechCorp Inc.",amount:"+C$3,245.00",date:"Mar 14",type:"deposit",cat:"Income"},
                {desc:"Google Pay - Uber",amount:"-C$18.45",date:"Mar 13",type:"purchase",cat:"Transportation"},
                {desc:"International Transfer to Riga",amount:"-C$275.00",date:"Mar 10",type:"transfer",cat:"Int'l Transfer"},
                {desc:"GIC Interest Credited",amount:"+C$112.50",date:"Mar 1",type:"deposit",cat:"Investment Income"},
              ].map((tx,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<7?"1px solid #f8f8f8":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:tx.type==="deposit"?`${C.greenFill}10`:tx.type==="insurance"?`${C.accentText}10`:tx.type==="transfer"?`${C.purple}10`:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:11}} dangerouslySetInnerHTML={{__html:tx.type==="deposit"?"&#8593;":tx.type==="insurance"?"&#9737;":tx.type==="transfer"?"&#8644;":"&#8595;"}}/>
                    </div>
                    <div>
                      <div style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:500}}>{tx.desc}</div>
                      <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{tx.date} -- <span style={{color:"#707070"}}>{tx.cat}</span></div>
                    </div>
                  </div>
                  <span style={{fontFamily:fs,fontSize:14,color:tx.amount.startsWith("+")?C.greenText:C.navy,fontWeight:600}}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ======= RIGHT COLUMN ======= */}
          <div>
            {/* Quick International Transfer */}
            <div id="dash-transfer" style={{background:`linear-gradient(135deg,${C.navy},#2a4a6a)`,borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.7)",margin:"0 0 16px",fontWeight:700}}>&#127757; Quick Transfer to Baltics</h3>
              {!transferSent?<>
                <div style={{marginBottom:12}}>
                  <label htmlFor="sel-5" style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:4}}>To</label>
                  <select id="sel-5" value={transferTo} onChange={e=>setTransferTo(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px",fontFamily:fs,fontSize:13,color:"#fff",outline:"none",boxSizing:"border-box"}}>
                    <option>Grandmother Maija - Riga, Latvia</option>
                    <option>Uncle Toomas - Tallinn, Estonia</option>
                    <option>Estonian Song Festival Fund</option>
                    <option>New Recipient...</option>
                  </select>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:4}}>Amount (CAD)</label>
                  <input aria-label="Transfer amount in Canadian dollars" inputMode="decimal" value={transferAmt} onChange={e=>setTransferAmt(e.target.value)} aria-invalid={transferAmt!==""&&!transferOk} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:`1px solid ${transferAmt!==""&&!transferOk?C.redOnDark:"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 14px",fontFamily:fs,fontSize:18,color:"#fff",outline:"none",fontWeight:700,boxSizing:"border-box"}}/>
                  {transferAmt!==""&&!transferOk&&<div role="alert" style={{fontFamily:fs,fontSize:11,color:C.redOnDark,marginTop:6}}>Enter an amount between C$1 and C$25,000.</div>}
                </div>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Exchange Rate</span><span style={{fontFamily:fs,fontSize:12,color:"#fff"}}>1 CAD = 0.6821 EUR</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Recipient Gets</span><span style={{fontFamily:fs,fontSize:14,color:C.greenOnDark,fontWeight:700}}>{"\u20AC"}{transferOk?money(transferNum*0.6821):"--"}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>Fee</span><span style={{fontFamily:fs,fontSize:12,color:"#fff"}}>C$4.99</span></div>
                </div>
                <button onClick={()=>setTransferSent(true)} disabled={!transferOk} style={{width:"100%",background:transferOk?C.greenFill:"rgba(255,255,255,0.12)",border:"none",borderRadius:10,padding:"12px",cursor:transferOk?"pointer":"not-allowed",fontFamily:fs,fontSize:14,color:transferOk?"#fff":"rgba(255,255,255,0.5)",fontWeight:700}}>{transferOk?`Send C$${money(transferNum)} to ${transferTo.split(" - ")[0]}`:"Enter an amount to send"}</button>
              </>:<div style={{textAlign:"center",padding:"12px 0"}}>
                <div style={{fontSize:32,marginBottom:8}}>&#9989;</div>
                <div style={{fontFamily:fs,fontSize:15,color:"#fff",fontWeight:700}}>Transfer Sent!</div>
                <div style={{fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>C${money(transferNum)} to {transferTo}</div>
                <div style={{fontFamily:fs,fontSize:12,color:C.greenOnDark,marginTop:2}}>Estimated arrival: 1-2 business days</div>
                <div style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:8}}>Tracking ID: {transferRef}</div>
                <button onClick={()=>setTransferSent(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:fs,fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:12}}>Send Another</button>
              </div>}
            </div>

            {/* Quick Actions */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Quick Actions</h3>
              {/* These were ten buttons with no onClick between them. The six
                  that have somewhere real to go now go there; the rest are
                  online-banking functions this site does not implement, so
                  they are listed rather than dressed up as working buttons. */}
              {[
                {l:"Get Insurance Quote",c:C.accent,go:"quote"},
                {l:"Send International Transfer",c:C.green,go:"transfer"},
                {l:"File Insurance Claim",c:C.red,go:"claims"},
                {l:"Book Advisor Meeting",c:C.amber,go:"booking"},
                {l:"Update Beneficiaries",c:C.accent,go:"booking"},
                {l:"Apply for Credit Card",c:C.purple,go:"cards"},
              ].map((a,i,arr)=>(
                <button key={i} onClick={()=>a.go==="transfer"?scrollToTransfer():setPage(a.go)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",background:"none",border:"none",padding:"9px 8px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #f8f8f8":"none",textAlign:"left"}}>
                  <div style={{width:8,height:8,borderRadius:2,background:a.c,flexShrink:0}}/>
                  <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:500}}>{a.l}</span>
                  <span style={{marginLeft:"auto",fontFamily:fs,fontSize:12,color:C.accentText}} aria-hidden="true">&rarr;</span>
                </button>
              ))}
              <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"14px 0 6px",fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}}>In online banking</p>
              <ul style={{listStyle:"none",margin:0,padding:0}}>
                {["Pay a bill","Send an Interac e-Transfer","Download tax slips (T5, T3, RRSP)","Order foreign currency cash"].map((l,i)=>
                  <li key={i} style={{fontFamily:fs,fontSize:12,color:"#666",padding:"5px 8px"}}>{l}</li>)}
              </ul>
              <p style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",margin:"8px 0 0"}}>Need a hand with one of these? <button onClick={()=>setPage("contact")} style={{background:"none",border:"none",padding:"6px 2px",minHeight:24,fontFamily:fs,fontSize:11,color:C.accentText,fontWeight:600,cursor:"pointer",textDecoration:"underline"}}>Call your branch</button>.</p>
            </div>

            {/* Upcoming Payments */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Upcoming Payments</h3>
              {[
                {l:"Home Insurance",d:"Apr 1",a:"C$142.50",c:C.green},
                {l:"Auto Insurance",d:"Apr 1",a:"C$168.00",c:C.amber},
                {l:"Term Life Premium",d:"Apr 1",a:"C$32.50",c:C.accent},
                {l:"Mortgage Payment",d:"Apr 1",a:"C$1,847.22",c:C.navy},
                {l:"Recurring Transfer (Riga)",d:"Apr 5",a:"C$200.00",c:C.purple},
                {l:"Collabria Mastercard",d:"Apr 12",a:"C$487.33",c:C.red},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<5?"1px solid #f8f8f8":"none"}}>
                  <div>
                    <div style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:500}}>{p.l}</div>
                    <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{p.d}</div>
                  </div>
                  <span style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600}}>{p.a}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"10px",background:"#f8f8f8",borderRadius:10,textAlign:"center"}}>
                <span style={{fontFamily:fs,fontSize:11,color:"#6B6B6B"}}>Total upcoming: </span>
                <span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:700}}>C$2,877.55</span>
              </div>
            </div>

            {/* Digital ID Verification Status */}
            <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Identity Verification</h3>
              {[{l:"Photo ID Verified",s:true,d:"Ontario Driver's Licence -- Verified Feb 2024"},{l:"Address Verified",s:true,d:"4 Credit Union Dr, North York"},{l:"KYC / AML Compliant",s:true,d:"FINTRAC compliant -- Next review: Feb 2027"},{l:"Biometric Login",s:true,d:"Face ID enabled on iPhone"}].map((v,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid #f8f8f8":"none"}}>
                  <span style={{fontSize:14,color:C.greenText}}>&#9989;</span>
                  <div>
                    <div style={{fontFamily:fs,fontSize:12,color:C.navy,fontWeight:600}}>{v.l}</div>
                    <div style={{fontFamily:fs,fontSize:10,color:"#707070"}}>{v.d}</div>
                  </div>
                </div>
              ))}
              <p style={{fontFamily:fs,fontSize:10,color:"#707070",margin:"10px 0 0"}}>Identity verification powered by Jumio. Compliant with FINTRAC and FSRA requirements.</p>
            </div>

            {/* Coverage Score */}
            <div style={{background:C.navy,borderRadius:20,padding:24,marginBottom:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:"rgba(255,255,255,0.6)",margin:"0 0 16px",fontWeight:700}}>Coverage Score</h3>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{width:90,height:90,borderRadius:"50%",border:`5px solid ${C.green}`,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:ff,fontSize:28,color:"#fff",fontWeight:700}}>87</span>
                </div>
                <div style={{fontFamily:fs,fontSize:11,color:C.greenOnDark,marginTop:6,fontWeight:600}}>Well Protected</div>
              </div>
              {[{l:"Life Insurance",v:true},{l:"Home Insurance",v:true},{l:"Auto Insurance",v:true},{l:"Disability",v:false},{l:"Critical Illness",v:false},{l:"Travel Insurance",v:true}].map((c2,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
                  <span style={{fontFamily:fs,fontSize:11,color:"rgba(255,255,255,0.6)"}}>{c2.l}</span>
                  <span style={{fontFamily:fs,fontSize:11,color:c2.v?C.greenOnDark:C.redOnDark,fontWeight:600}}>{c2.v?"Covered":"Gap"}</span>
                </div>
              ))}
              <button onClick={()=>setPage("analyzer")} style={{width:"100%",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:500,marginTop:12}}>Close Coverage Gaps</button>
            </div>

            {/* Next Advisor Appointment */}
            <div style={{background:`${C.greenFill}08`,border:`1px solid ${C.green}20`,borderRadius:20,padding:24}}>
              <h3 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 12px",fontWeight:700}}>Next Appointment</h3>
              <div style={{fontFamily:fs,fontSize:14,color:C.navy,fontWeight:600}}>Insurance Review with Heili Orav</div>
              <div style={{fontFamily:fs,fontSize:12,color:"#666",marginTop:4}}>March 25, 2026 at 10:30 AM</div>
              <div style={{fontFamily:fs,fontSize:12,color:"#666"}}>Latvian Centre Branch, North York</div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={()=>setPage("messages")} style={{flex:1,background:C.greenFill,border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontFamily:fs,fontSize:11,color:"#fff",fontWeight:600}}>Message Heili</button>
                <button onClick={()=>setPage("booking")} style={{flex:1,background:"#fff",border:`1px solid ${C.greenText}`,borderRadius:8,padding:"8px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.greenText,fontWeight:600}}>Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FOR LEADERSHIP - BUSINESS CASE ============
