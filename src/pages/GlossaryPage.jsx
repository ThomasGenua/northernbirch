import React, { useState } from "react";
import { C, fs, SH, useMob } from '../ui.jsx';

export default function GlossaryPage(){
  const mob=useMob();
  const[filter,setFilter]=useState("");
  const terms=[
    {term:"Beneficiary",def:"The person or entity designated to receive the proceeds of an insurance policy or investment account upon the policyholder's death."},
    {term:"Co-op Insurance",def:"Specialized insurance coverage designed for co-operative housing structures, covering unit improvements, loss assessments, and personal property under co-op bylaws."},
    {term:"Coverage Limit",def:"The maximum amount an insurance company will pay for a covered claim. Higher limits mean more protection but typically higher premiums."},
    {term:"Creditor Insurance",def:"Life and disability insurance tied to a loan or mortgage. If the borrower dies or becomes disabled, the insurance pays off or reduces the outstanding balance."},
    {term:"Critical Illness Insurance",def:"Coverage that pays a tax-free lump sum upon diagnosis of a specified illness such as cancer, heart attack, or stroke."},
    {term:"Deductible",def:"The amount you pay out of pocket before your insurance coverage kicks in. Higher deductibles usually mean lower premiums."},
    {term:"Disability Insurance",def:"Coverage that replaces a portion of your income (typically 60-70%) if you become unable to work due to illness or injury."},
    {term:"Endorsement",def:"An addition or modification to an insurance policy that changes the terms or coverage. Also called a rider."},
    {term:"Exclusion",def:"A specific condition, hazard, or activity not covered by an insurance policy. Always read exclusions before purchasing."},
    {term:"Group Insurance",def:"Insurance coverage provided to a group of people, typically employees of a company. Usually less expensive than individual policies due to group buying power."},
    {term:"Key Person Insurance",def:"Life or disability insurance purchased by a business on a key employee or owner. The business pays premiums and receives the benefit."},
    {term:"Liability Coverage",def:"Insurance that protects you if you're legally responsible for injuries to others or damage to their property."},
    {term:"Living Benefit",def:"A feature that allows a policyholder to access a portion of their death benefit while still alive, typically due to terminal illness."},
    {term:"Premium",def:"The amount you pay for insurance coverage, usually monthly or annually. Premiums vary based on coverage type, amount, and personal risk factors."},
    {term:"Replacement Cost",def:"Coverage that pays to replace damaged property with new items of similar kind and quality, without deducting for depreciation."},
    {term:"Rider",def:"An optional add-on to an insurance policy that provides additional coverage or benefits for an extra premium."},
    {term:"Term Life Insurance",def:"Life insurance that provides coverage for a specific period (10, 20, or 30 years). If the insured dies during the term, beneficiaries receive the death benefit."},
    {term:"Underwriting",def:"The process by which an insurer evaluates risk and determines whether to offer coverage, and at what premium."},
    {term:"Waiver of Premium",def:"A rider that waives premium payments if the policyholder becomes totally disabled, keeping the policy in force without payment."},
    {term:"Whole Life Insurance",def:"Permanent life insurance that provides coverage for the insured's entire lifetime and includes a cash value component that grows over time."},
  ];
  const filtered=filter?terms.filter(t=>t.term.toLowerCase().includes(filter.toLowerCase())||t.def.toLowerCase().includes(filter.toLowerCase())):terms;
  return(
    <section style={{background:C.cream,padding:mob?"60px 16px":"80px 24px",paddingTop:mob?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Insurance Glossary" tagColor={C.purple} title="Insurance terms explained" desc="Understanding insurance terminology helps you make better decisions. Search or browse our glossary of common insurance terms."/>
        <div style={{marginBottom:24}}><input value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Search glossary terms" placeholder="Search terms..." style={{width:"100%",border:"1px solid #ddd",borderRadius:12,padding:"14px 20px",fontFamily:fs,fontSize:15,outline:"none",boxSizing:"border-box",background:"#fff"}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((t,i)=><div key={i} style={{background:"#fff",borderRadius:14,padding:"20px 24px",border:"1px solid #eee"}}>
            <h4 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 6px",fontWeight:700}}>{t.term}</h4>
            <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>{t.def}</p>
          </div>)}
        </div>
      </div>
    </section>
  );
}

// ============ MOBILE APP PAGE ============
