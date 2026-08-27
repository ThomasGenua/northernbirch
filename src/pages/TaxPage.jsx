import React, { useState } from "react";
import { Btn, C, FAQ, SH, callAI, exportToPDF, ff, fs } from '../ui.jsx';

export default function TaxPage({setPage}){
  const[mode,setMode]=useState("optimizer");
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  // RRSP calculator
  const[rIncome,setRIncome]=useState(100000);const[rContrib,setRContrib]=useState(18000);const[rRate,setRRate]=useState(33);
  const rrspRefund=Math.round(rContrib*(rRate/100));
  const rrspGrowth20=Math.round(rContrib*Math.pow(1.06,20));
  const tfsaGrowth20=Math.round(7000*Math.pow(1.06,20));

  const analyze=async()=>{
    if(!input.trim()||loading)return;
    setLoading(true);
    try{
      const data=await callAI("tax",[{role:"user",content:input}]);
      setResult(data.content?.[0]?.text||"Unable to analyze.");
    }catch(e){setResult("Having trouble connecting. Please call 416-465-4659.");}
    setLoading(false);
  };
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  return(
    <section style={{background:C.cream,padding:isMob?"60px 16px":"80px 24px",paddingTop:isMob?80:100}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="AI Tax & Savings Optimizer" tagColor={C.greenText} title="Keep more of what you earn" desc="Canadian tax optimization strategies, RRSP/TFSA planning, and insurance tax benefits -- personalized for your situation."/>
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {[{l:"AI Tax Advisor",v:"optimizer"},{l:"RRSP/TFSA Calculator",v:"calculator"},{l:"Tax-Smart Insurance",v:"insurance"}].map(tab=><button key={tab.v} onClick={()=>{setMode(tab.v);setResult(null)}} style={{flex:1,minWidth:isMob?0:150,background:mode===tab.v?C.greenFill:"#fff",border:mode===tab.v?"none":"1px solid #ddd",borderRadius:12,padding:"14px 16px",cursor:"pointer",fontFamily:fs,fontSize:14,fontWeight:700,color:mode===tab.v?"#fff":C.navy}}>{tab.l}</button>)}
        </div>

        {mode==="optimizer"&&!result&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.green},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:"#fff"}}>&#9889;</span></div>
            <div><div style={{fontFamily:fs,fontSize:16,color:C.navy,fontWeight:700}}>AI Tax Advisor</div><div style={{fontFamily:fs,fontSize:12,color:"#6B6B6B"}}>Powered by Claude Opus 4.6 -- Canadian tax expertise</div></div>
          </div>
          <textarea aria-label="Describe your tax situation" value={input} onChange={e=>setInput(e.target.value)} rows={6} placeholder={"Describe your tax situation. For example:\n\n\"I'm 42, married, household income $180K (I earn $120K, spouse $60K). We have 2 kids (ages 5 and 8). $90K in RRSPs, $25K in TFSAs, $400K mortgage with NBCU. No RESP for the kids yet. No FHSA. My employer doesn't offer a pension. I'm paying $2,400/year in home insurance to TD. Looking to reduce our tax bill and save smarter.\""} style={{width:"100%",border:"1px solid #ddd",borderRadius:14,padding:"16px 20px",fontFamily:fs,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <button onClick={analyze} disabled={loading||!input.trim()} style={{width:"100%",marginTop:16,background:loading?"#ccc":`linear-gradient(135deg,${C.green},${C.accent})`,border:"none",borderRadius:12,padding:"16px",cursor:loading?"default":"pointer",fontFamily:fs,fontSize:16,color:"#fff",fontWeight:700}}>{loading?"Analyzing your tax situation...":"Optimize My Taxes"}</button>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Maximize RRSP deductions","Best TFSA vs RRSP strategy","Tax-efficient estate planning","Small business tax optimization","Retirement income splitting"].map((s,i)=><button key={i} onClick={()=>setInput(s+" -- please advise based on typical Ontario resident situation")} style={{background:`${C.greenFill}06`,border:`1px solid ${C.green}15`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:fs,fontSize:11,color:C.greenText}}>{s}</button>)}
          </div>
        </div>}

        {mode==="optimizer"&&result&&<div>
          <div id="tax-optimizer-result" style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee",marginBottom:24}}>
            <div style={{fontFamily:fs,fontSize:14,color:"#555",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{result}</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>exportToPDF("tax-optimizer-result","Tax Optimization Strategy")} color={C.accentText}>&#128190; Download Strategy (PDF)</Btn>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book Wealth Advisor</Btn>
            <Btn onClick={()=>setPage("rates")}>View NBCU Rates</Btn>
            <Btn outline onClick={()=>{setResult(null);setInput("")}}>Ask Another Question</Btn>
          </div>
        </div>}

        {mode==="calculator"&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 24px"}}>RRSP vs. TFSA Comparison</h3>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:24}}>
            <div><label htmlFor="calc-11" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Annual Income</label><input type="number" id="calc-11" value={rIncome} onChange={e=>setRIncome(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="calc-12" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>RRSP Contribution</label><input type="number" id="calc-12" value={rContrib} onChange={e=>setRContrib(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box"}}/></div>
            <div><label htmlFor="sel-4" style={{fontFamily:fs,fontSize:12,color:"#6B6B6B",display:"block",marginBottom:6}}>Marginal Tax Rate (%)</label><select id="sel-4" value={rRate} onChange={e=>setRRate(+e.target.value)} style={{width:"100%",border:"1px solid #ddd",borderRadius:10,padding:"12px 16px",fontFamily:fs,fontSize:16,outline:"none",boxSizing:"border-box",background:"#fff"}}><option value={20}>20.05% ($0-$51K)</option><option value={30}>29.65% ($51K-$102K)</option><option value={31}>31.48% ($102K-$150K)</option><option value={33}>33.89% ($150K-$220K)</option><option value={46}>46.41% ($220K+)</option></select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:`${C.accentText}06`,borderRadius:16,padding:24,borderTop:`3px solid ${C.accent}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 16px",fontWeight:700}}>RRSP</h4>
              {[
                {l:"Your contribution",v:`C$${rContrib.toLocaleString()}`},
                {l:"Immediate tax refund",v:`C$${rrspRefund.toLocaleString()}`},
                {l:"Effective cost after refund",v:`C$${(rContrib-rrspRefund).toLocaleString()}`},
                {l:"Value in 20 years (6% return)",v:`C$${rrspGrowth20.toLocaleString()}`},
                {l:"Tax on withdrawal",v:`Taxed as income`},
                {l:"2025 limit",v:`18% of income, max $31,560`},
              ].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?"1px solid rgba(0,0,0,0.05)":"none"}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.v}</span></div>)}
              <div style={{marginTop:12,background:`${C.accentText}10`,borderRadius:10,padding:"12px 16px"}}><p style={{fontFamily:fs,fontSize:12,color:C.accentText,margin:0,lineHeight:1.6}}>Best for: High income now, lower income in retirement. Reinvest the refund in your TFSA for maximum benefit.</p></div>
            </div>
            <div style={{background:`${C.greenFill}06`,borderRadius:16,padding:24,borderTop:`3px solid ${C.green}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 16px",fontWeight:700}}>TFSA</h4>
              {[
                {l:"Max annual contribution",v:"C$7,000"},
                {l:"Tax refund",v:"None (after-tax $)"},
                {l:"Effective cost",v:"C$7,000"},
                {l:"Value in 20 years (6% return)",v:`C$${tfsaGrowth20.toLocaleString()}`},
                {l:"Tax on withdrawal",v:"Completely tax-free"},
                {l:"Cumulative room (since 2009)",v:"Up to $95,000"},
              ].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?"1px solid rgba(0,0,0,0.05)":"none"}}><span style={{fontFamily:fs,fontSize:13,color:"#666"}}>{r.l}</span><span style={{fontFamily:fs,fontSize:13,color:C.navy,fontWeight:600}}>{r.v}</span></div>)}
              <div style={{marginTop:12,background:`${C.greenFill}10`,borderRadius:10,padding:"12px 16px"}}><p style={{fontFamily:fs,fontSize:12,color:C.greenText,margin:0,lineHeight:1.6}}>Best for: Everyone. Tax-free growth forever. Ideal emergency fund, medium-term savings, or supplement to RRSP.</p></div>
            </div>
          </div>
          <div style={{marginTop:20,background:`${C.amber}08`,borderRadius:14,padding:"16px 20px",borderLeft:`4px solid ${C.amber}`}}>
            <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:0,lineHeight:1.7}}><strong style={{color:C.navy}}>Pro tip:</strong> The optimal strategy for most Canadians is to contribute to your RRSP first (get the tax refund), then invest that refund into your TFSA. At a {rRate}% marginal rate, your C${rContrib.toLocaleString()} RRSP contribution generates a C${rrspRefund.toLocaleString()} refund -- put that into your TFSA for tax-free growth. Northern Birch offers both RRSP and TFSA GICs, mutual funds, and high-interest savings.</p>
          </div>
          <div style={{marginTop:16,textAlign:"center"}}><Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book a Wealth Review with Heili Orav</Btn></div>
        </div>}

        {mode==="insurance"&&<div style={{background:"#fff",borderRadius:24,padding:isMob?24:40,border:"1px solid #eee"}}>
          <h3 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 8px"}}>Tax-Smart Insurance Strategies</h3>
          <p style={{fontFamily:fs,fontSize:14,color:"#6B6B6B",marginBottom:24}}>Insurance isn't just protection -- it's one of the most powerful tax planning tools in Canada.</p>
          {[
            {title:"Life Insurance Proceeds Are Tax-Free",desc:"When you die, your life insurance death benefit passes to your beneficiaries completely tax-free. Unlike RRSPs (which trigger a full income tax bill at death) or investment accounts (which trigger capital gains), life insurance bypasses the estate entirely. This means no probate fees (1.5% in Ontario), no estate administration tax, and no income tax on the benefit.",product:"Term Life Insurance via CUMIS -- from C$25/month",color:C.accentText},
            {title:"Critical Illness Benefits Are Tax-Free",desc:"If you're diagnosed with cancer, have a heart attack, or suffer a stroke, your critical illness insurance pays a tax-free lump sum. Use it however you want -- medical treatment, income replacement, mortgage payments, travel for care. Because you paid premiums with after-tax dollars, the CRA doesn't tax the benefit.",product:"Critical Illness Insurance via CUMIS",color:C.greenText},
            {title:"Corporate-Owned Life Insurance",desc:"If you own a business through a corporation, the company can own a life insurance policy on you. Premiums aren't tax-deductible, but the death benefit flows into the Capital Dividend Account (CDA) and can be distributed to shareholders tax-free. This is one of the most powerful estate planning tools for business owners.",product:"Key Person Insurance via CUMIS -- business-owned policies",color:C.purple},
            {title:"Insurance Replaces Estate Tax Liability",desc:"Canada has no estate tax, but there's a deemed disposition at death that triggers capital gains on investments, rental properties, and cottages. Life insurance can be sized to cover this exact tax liability, ensuring your family inherits assets without selling them to pay the CRA.",product:"Estate Planning Advisory + Term/Permanent Life via CUMIS",color:C.amberText},
            {title:"Disability Insurance Premiums",desc:"If you pay disability insurance premiums personally (not through your employer), any benefits you receive are completely tax-free. This is important: employer-paid disability benefits are taxable income, but personally-paid benefits are not. Consider paying your own premiums for tax-free benefits.",product:"Disability Insurance via CUMIS",color:C.navy},
            {title:"RESP + Insurance = Education Security",desc:"RESPs get a 20% government grant (CESG) on contributions up to $2,500/year per child. But what if you die before fully funding the RESP? Life insurance ensures your children's education fund is completed even if you're not here. The insurance proceeds are tax-free and can be contributed to the RESP by your surviving spouse.",product:"RESP at Northern Birch + Term Life via CUMIS",color:C.redText},
          ].map((s,i)=>(
            <div key={i} style={{marginBottom:16,padding:"24px 28px",background:`${s.color}04`,borderRadius:16,borderLeft:`4px solid ${s.color}`}}>
              <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.title}</h4>
              <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 8px",lineHeight:1.75}}>{s.desc}</p>
              <span style={{fontFamily:fs,fontSize:12,color:s.color,fontWeight:600}}>{s.product}</span>
            </div>
          ))}
          <div style={{marginTop:8,display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>setPage("booking")} color={C.greenFill}>Book Tax-Smart Insurance Review</Btn>
            <Btn onClick={()=>setPage("estate")} color={C.purple}>Estate Planning</Btn>
            <Btn onClick={()=>{setMode("optimizer");setResult(null)}} outline>Ask AI Tax Advisor</Btn>
          </div>
        </div>}

        <div style={{marginTop:32}}>
          <FAQ items={[
            {q:"Is my RRSP contribution deadline the same as my tax deadline?",a:"No. Your RRSP contribution deadline is 60 days after the end of the tax year (typically March 1 or March 2). Your tax filing deadline is April 30. This means you can still make RRSP contributions in January and February and claim the deduction on the previous year's tax return. Northern Birch offers RRSP GICs, savings accounts, and mutual funds -- visit any branch or call 416-465-4659 to contribute before the deadline."},
            {q:"Should I prioritize RRSP or TFSA?",a:"It depends on your income. If your marginal tax rate is above 30% (income over $51K in Ontario), RRSP contributions give you a meaningful tax refund that you should reinvest in your TFSA. If your income is lower, the TFSA may be better since you won't pay tax on withdrawals. The optimal strategy for most people: maximize RRSP first, invest the refund in TFSA, then contribute additional savings to TFSA. Book a wealth review at Northern Birch for personalized advice."},
            {q:"How does the First Home Savings Account (FHSA) work?",a:"The FHSA combines the best of RRSP and TFSA. Contributions are tax-deductible (like RRSP) and withdrawals for a first home purchase are tax-free (like TFSA). You can contribute $8,000/year up to $40,000 lifetime. If you don't buy a home, funds can be transferred to your RRSP. Northern Birch offers FHSA accounts -- this is one of the best savings vehicles available for first-time buyers."},
            {q:"Are insurance premiums tax-deductible?",a:"Generally no -- personal insurance premiums (life, home, auto, health) are not tax-deductible. However, if you're self-employed, health and dental insurance premiums may be deductible. If your corporation owns a life insurance policy, the death benefit flows into the Capital Dividend Account for tax-free distribution. The real tax benefit of insurance is that proceeds are tax-free to beneficiaries."},
          ]}/>
        </div>
      </div>
    </section>
  );
}

// ============ MEMBER DASHBOARD MOCKUP ============
