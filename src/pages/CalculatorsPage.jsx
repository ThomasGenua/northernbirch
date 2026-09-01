import React, { useState } from "react";
import { Btn, C, RATE, SH, exportToPDF, ff, fs } from '../ui.jsx';

export default function CalculatorsPage({setPage}){
  const[calc,setCalc]=useState("mortgage");
  const[calcErr,setCalcErr]=useState("");
  // Mortgage
  const[mAmt,setMAmt]=useState(500000);const[mRate,setMRate]=useState(4.39);const[mYrs,setMYrs]=useState(25);const[mResult,setMResult]=useState(null);
  // Insurance needs
  const[income,setIncome]=useState(100000);const[deps,setDeps]=useState(2);const[mortgage,setMortgage]=useState(400000);const[insResult,setInsResult]=useState(null);
  // Retirement
  const[rAge,setRAge]=useState(35);const[rRetire,setRRetire]=useState(65);const[rIncome,setRIncome]=useState(80000);const[rSaved,setRSaved]=useState(50000);const[rMonthly,setRMonthly]=useState(500);const[rReturn,setRReturn]=useState(6);const[rResult,setRResult]=useState(null);
  // Canadian fixed-rate mortgages compound semi-annually, not in advance
  // (Interest Act), so the monthly rate is not simply annual/12 -- that is the
  // US convention and it overstated the payment on every calculation here.
  const monthlyRateCA=(annualPct)=>annualPct===0?0:Math.pow(1+annualPct/100/2,1/6)-1;
  const calcMortgage=()=>{
    if(!(mAmt>0)){setMResult(null);setCalcErr("Enter a mortgage amount greater than zero.");return}
    if(mRate<0||mRate>25){setMResult(null);setCalcErr("Enter an interest rate between 0% and 25%.");return}
    setCalcErr("");
    const r=monthlyRateCA(mRate);const n=mYrs*12;
    const pmt=r===0?mAmt/n:mAmt*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    setMResult(Math.round(pmt*100)/100);
  };
  const calcInsurance=()=>{
    if(income<0||mortgage<0||deps<0){setInsResult(null);setCalcErr("Income, mortgage and dependants cannot be negative.");return}
    if(!(income>0)){setInsResult(null);setCalcErr("Enter an annual household income greater than zero.");return}
    setCalcErr("");
    const incomeNeed=income*10;const debtCover=mortgage;const education=deps*80000;
    setInsResult({total:incomeNeed+debtCover+education,income:incomeNeed,debt:debtCover,edu:education});
  };
  const calcRetirement=()=>{
    if(rRetire<=rAge){setRResult(null);setCalcErr("Your target retirement age has to be later than your current age.");return}
    if(rRetire>=90){setRResult(null);setCalcErr("This projection runs to age 90, so pick a retirement age below that.");return}
    if(rReturn<0||rReturn>15){setRResult(null);setCalcErr("Enter an expected annual return between 0% and 15%.");return}
    if(rSaved<0||rMonthly<0||rIncome<0){setRResult(null);setCalcErr("Savings, contributions and income cannot be negative.");return}
    setCalcErr("");
    const years=rRetire-rAge;const retYears=90-rRetire;const monthlyR=rReturn/100/12;const months=years*12;
    // Future value of current savings
    const fvSaved=rSaved*Math.pow(1+monthlyR,months);
    // Future value of monthly contributions
    const fvContrib=monthlyR===0?rMonthly*months:rMonthly*((Math.pow(1+monthlyR,months)-1)/monthlyR);
    const totalAtRetire=Math.round(fvSaved+fvContrib);
    // How much they need (4% rule)
    const annualNeed=rIncome*0.7;const totalNeed=Math.round(annualNeed*retYears);
    // CPP + OAS estimate (annual)
    const cppOas=18000;const govTotal=Math.round(cppOas*retYears);
    // Monthly income from savings (4% rule)
    const monthlyFromSavings=Math.round(totalAtRetire*0.04/12);
    const monthlyGov=Math.round(cppOas/12);
    const monthlyTotal=monthlyFromSavings+monthlyGov;
    const monthlyTarget=Math.round(annualNeed/12);
    const gap=monthlyTarget-monthlyTotal;
    // Insurance gap: if they die before retirement
    const insGap=Math.max(0,totalNeed-totalAtRetire-govTotal);
    setRResult({totalAtRetire,totalNeed,govTotal,monthlyFromSavings,monthlyGov,monthlyTotal,monthlyTarget,gap,annualNeed,insGap,years,retYears});
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="Financial Calculators" tagColor={C.greenText} title="Plan with confidence" desc="Mortgage payments, insurance needs, and retirement projections -- all the numbers you need to make informed decisions."/>
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {[{l:"Mortgage",v:"mortgage"},{l:"Insurance Needs",v:"insurance"},{l:"Retirement",v:"retirement"}].map(tab=><button key={tab.v} onClick={()=>{setCalc(tab.v);setCalcErr("")}} style={{flex:1,minWidth:isMob?0:150,background:calc===tab.v?C.navy:"#fff",border:calc===tab.v?"none":"1px solid #ddd",borderRadius:12,padding:"14px 16px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:calc===tab.v?"#fff":C.navy}}>{tab.l}</button>)}
        </div>
        <div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          {calcErr&&<div role="alert" style={{background:`${C.redText}0D`,border:`1px solid ${C.redText}33`,borderRadius:12,padding:"12px 16px",marginBottom:20,fontFamily:fs,fontSize:14,color:C.redText}}>{calcErr}</div>}
          {calc==="mortgage"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
              <div><label htmlFor="calc-0" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Mortgage Amount</label><input type="number" id="calc-0" min="0" step="1000" value={mAmt} onChange={e=>setMAmt(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-1" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Interest Rate (%)</label><input type="number" id="calc-1" min="0" max="25" step="0.01" value={mRate} onChange={e=>setMRate(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="sel-0" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Amortization (Years)</label><select id="sel-0" value={mYrs} onChange={e=>setMYrs(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box",background:"#fff"}}>{[15,20,25,30].map(y=><option key={y} value={y}>{y} years</option>)}</select></div>
            </div>
            <button onClick={calcMortgage} style={{width:"100%",background:C.greenFill,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Payment</button>
            {mResult&&<div id="mortgage-result" style={{marginTop:24,background:`${C.greenFill}08`,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
              <div style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Estimated Monthly Payment</div>
              <div style={{fontFamily:ff,fontSize:48,color:C.greenText,fontWeight:700,margin:"8px 0"}}>C${mResult.toLocaleString()}</div>
              <p style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",margin:"8px 0 12px"}}>Based on {mRate}% rate, {mYrs}-year amortization. Current NBCU rates: 3-year closed {RATE.m3}, 5-year high ratio {RATE.m5hr}.</p>
              <button onClick={()=>exportToPDF("mortgage-result","Mortgage Calculation")} style={{background:C.greenFill,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download PDF</button>
            </div>}
          </>}
          {calc==="insurance"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
              <div><label htmlFor="calc-2" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Annual Household Income</label><input type="number" id="calc-2" min="0" step="1000" value={income} onChange={e=>setIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-3" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Number of Dependents</label><input type="number" id="calc-3" min="0" max="20" step="1" value={deps} onChange={e=>setDeps(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-4" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Outstanding Mortgage</label><input type="number" id="calc-4" min="0" step="1000" value={mortgage} onChange={e=>setMortgage(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            </div>
            <button onClick={calcInsurance} style={{width:"100%",background:C.accentText,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Insurance Need</button>
            {insResult&&<div id="insurance-needs-result" style={{marginTop:24,background:`${C.accentText}08`,borderRadius:16,padding:"28px 32px"}}>
              <div style={{textAlign:"center",marginBottom:20}}><div style={{fontFamily:fs,fontSize:13,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Recommended Life Insurance Coverage</div><div style={{fontFamily:ff,fontSize:48,color:C.accentText,fontWeight:700,margin:"8px 0"}}>C${(insResult.total/1000).toFixed(0)}K</div></div>
              <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:16}}>
                {[{l:"Income Replacement (10x)",v:`C$${(insResult.income/1000).toFixed(0)}K`},{l:"Mortgage Payoff",v:`C$${(insResult.debt/1000).toFixed(0)}K`},{l:`Education (${deps} children)`,v:`C$${(insResult.edu/1000).toFixed(0)}K`}].map((m,i)=><div key={i} style={{textAlign:"center",background:"#fff",borderRadius:12,padding:16}}><div style={{fontFamily:ff,fontSize:22,color:C.navy,fontWeight:700}}>{m.v}</div><div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:2}}>{m.l}</div></div>)}
              </div>
              <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>exportToPDF("insurance-needs-result","Insurance Needs Analysis")} style={{background:C.accentText,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download PDF</button></div>
            </div>}
          </>}
          {calc==="retirement"&&<>
            <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:20}}>
              <div><label htmlFor="calc-5" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Your Current Age</label><input type="number" id="calc-5" min="16" max="89" step="1" value={rAge} onChange={e=>setRAge(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-6" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Target Retirement Age</label><input type="number" id="calc-6" min="17" max="89" step="1" value={rRetire} onChange={e=>setRRetire(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-7" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Current Annual Income</label><input type="number" id="calc-7" min="0" step="1000" value={rIncome} onChange={e=>setRIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-8" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Current Retirement Savings</label><input type="number" id="calc-8" min="0" step="1000" value={rSaved} onChange={e=>setRSaved(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-9" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Monthly Contribution</label><input type="number" id="calc-9" min="0" step="50" value={rMonthly} onChange={e=>setRMonthly(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
              <div><label htmlFor="calc-10" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Expected Annual Return (%)</label><input type="number" id="calc-10" min="0" max="15" step="0.5" value={rReturn} onChange={e=>setRReturn(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            </div>
            <button onClick={calcRetirement} style={{width:"100%",background:C.purple,border:"none",borderRadius:12,padding:"16px",cursor:"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>Calculate Retirement Plan</button>
            {rResult&&<div id="retirement-result" style={{marginTop:24}}>
              {/* Projected Savings */}
              <div style={{background:`${C.purple}08`,borderRadius:16,padding:"28px 32px",marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:20}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Projected Savings at {rRetire}</div>
                    <div style={{fontFamily:ff,fontSize:42,color:C.purple,fontWeight:700,margin:"8px 0"}}>C${(rResult.totalAtRetire/1000).toFixed(0)}K</div>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>{rResult.years} years of growth at {rReturn}% return</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",textTransform:"uppercase",letterSpacing:1}}>Total Retirement Need (to age 90)</div>
                    <div style={{fontFamily:ff,fontSize:42,color:C.navy,fontWeight:700,margin:"8px 0"}}>C${(rResult.totalNeed/1000).toFixed(0)}K</div>
                    <div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>70% of income x {rResult.retYears} years</div>
                  </div>
                </div>
              </div>
              {/* Monthly Income Breakdown */}
              <div style={{background:"#fff",borderRadius:16,padding:"28px 32px",border:"1px solid #eee",marginBottom:16}}>
                <h4 style={{fontFamily:fs,fontSize:15,color:C.navy,margin:"0 0 16px",fontWeight:700}}>Projected Monthly Retirement Income</h4>
                <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr 1fr",gap:12}}>
                  {[
                    {l:"From Savings (4% rule)",v:`C$${rResult.monthlyFromSavings.toLocaleString()}`,c:C.purple},
                    {l:"CPP + OAS (estimate)",v:`C$${rResult.monthlyGov.toLocaleString()}`,c:C.green},
                    {l:"Total Monthly Income",v:`C$${rResult.monthlyTotal.toLocaleString()}`,c:C.accent},
                    {l:"Monthly Target (70%)",v:`C$${rResult.monthlyTarget.toLocaleString()}`,c:C.navy},
                  ].map((m,i)=><div key={i} style={{textAlign:"center",background:`${m.c}06`,borderRadius:12,padding:"16px 12px"}}>
                    <div style={{fontFamily:ff,fontSize:22,color:m.c,fontWeight:700}}>{m.v}</div>
                    <div style={{fontFamily:fs,fontSize:11,color:"#6B6B6B",marginTop:4}}>{m.l}</div>
                  </div>)}
                </div>
              </div>
              {/* Gap or Surplus */}
              <div style={{background:rResult.gap>0?`${C.red}08`:`${C.greenFill}08`,borderRadius:16,padding:"24px 32px",borderLeft:`4px solid ${rResult.gap>0?C.red:C.green}`,marginBottom:16}}>
                {rResult.gap>0?<>
                  <h4 style={{fontFamily:fs,fontSize:15,color:C.redText,margin:"0 0 8px",fontWeight:700}}>Monthly Gap: C${rResult.gap.toLocaleString()}</h4>
                  <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 12px",lineHeight:1.7}}>Based on current savings and contributions, you'll have a shortfall of C${rResult.gap.toLocaleString()}/month in retirement. Here's how to close it:</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      `Increase monthly contributions by C$${Math.round(rResult.gap*0.6)} to close the gap through savings growth`,
                      "Open or maximize your TFSA (C$7,000/year tax-free growth) at Northern Birch",
                      "Maximize RRSP contributions for tax deductions and compound growth",
                      `Consider term life insurance (C$${(rResult.insGap/1000).toFixed(0)}K) to protect your family if you pass before building sufficient savings`,
                      "Book a Financial Check-Up with our wealth team led by Heili Orav",
                    ].map((tip,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.amber,flexShrink:0,marginTop:7}}/><span style={{fontFamily:fs,fontSize:13,color:"#555",lineHeight:1.6}}>{tip}</span></div>)}
                  </div>
                </>:<>
                  <h4 style={{fontFamily:fs,fontSize:15,color:C.greenText,margin:"0 0 8px",fontWeight:700}}>On Track: Monthly Surplus of C${Math.abs(rResult.gap).toLocaleString()}</h4>
                  <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>Great news -- at your current pace, you'll have more than enough for retirement. Consider using the surplus for travel to Estonia and Latvia, maximizing your TFSA, or exploring estate planning strategies to pass wealth to the next generation tax-efficiently.</p>
                </>}
              </div>
              <p style={{fontFamily:fs,fontSize:11,color:"#707070",lineHeight:1.6}}>Estimates assume {rReturn}% annual return, 2% inflation, 70% income replacement target, CPP/OAS at ~C$18,000/year combined, and living to age 90. Actual results will vary. This calculator does not account for employer pensions, rental income, or other assets. Book a Financial Check-Up with our wealth team for a comprehensive retirement plan.</p>
              <div style={{textAlign:"center",marginTop:16}}><button onClick={()=>exportToPDF("retirement-result","Retirement Plan Projection")} style={{background:C.purple,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:fs,fontSize:13,color:"#fff",fontWeight:600}}>&#128190; Download Retirement Plan (PDF)</button></div>
            </div>}
          </>}
        </div>
        <div style={{textAlign:"center",marginTop:28,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn small color={C.greenFill} onClick={()=>setPage("advice")}>Take this to an advisor &rarr;</Btn>
          <Btn small outline color={C.navy} onClick={()=>setPage("booking")}>Book a Financial Check-Up &rarr;</Btn>
        </div>
      </div>
    </section>
  );
}

// ============ BOOKING PAGE ============
