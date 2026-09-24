import React from "react";
import { C, fs, Linkify, SH } from '../ui.jsx';

export default function PrivacyPage(){
  
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Legal" tagColor={C.navy} title="Privacy Policy" desc="How Northern Birch Credit Union collects, uses, and protects your personal information under PIPEDA."/>
        {[
          {t:"Our Commitment to Privacy",p:"Northern Birch Credit Union Limited ('Northern Birch', 'we', 'us') is committed to protecting the privacy and confidentiality of your personal information. This policy describes how we collect, use, disclose, and safeguard personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation."},
          {t:"Information We Collect",p:"We collect personal information necessary to provide financial and insurance services, including: name, date of birth, address, phone number, email, Social Insurance Number (for tax reporting), employment and income information, financial information (assets, liabilities, credit history), health information (for insurance underwriting, with your consent), transaction history, and digital identifiers (IP address, device information, cookies)."},
          {t:"How We Use Your Information",p:"We use your personal information to: open and manage your accounts; process transactions and provide banking services; assess eligibility for credit, insurance, and investment products; comply with legal and regulatory obligations (FSRA, FINTRAC, CRA); prevent fraud and money laundering; improve our products and services; communicate about your accounts and relevant offers (with your consent). We will not use your information for purposes beyond what is described without your consent."},
          {t:"Insurers",p:"This demonstration shares nothing with any insurer. Nothing entered on this site is stored, and nothing is sent to anyone: the forms check their own shape and discard what was typed. If Northern Birch refers you to an insurer, that insurer collects your information directly, asks for your consent itself, and handles it under its own privacy policy and PIPEDA obligations."},
          {t:"Your Rights Under PIPEDA",p:"You have the right to: access your personal information held by Northern Birch; request correction of inaccurate information; withdraw consent for non-essential uses (marketing, insurance referrals); file a complaint with our Privacy Officer or the Office of the Privacy Commissioner of Canada. To exercise these rights, contact our Privacy Officer at privacy@northernbirchcu.com or visit any branch."},
          {t:"Insurance Marketing Opt-Out",p:"You may opt out of insurance-related marketing communications at any time. This will not affect your existing banking relationship or any active insurance policies. To opt out, contact your branch, email privacy@northernbirchcu.com, or adjust your preferences in online banking settings."},
          {t:"Service Providers and Data Outside Canada",p:"This demonstration does not keep what you type into its forms: they check their own shape and discard it. Messages typed to the AI assistant are the exception \u2014 they are sent to Anthropic, in the United States, to generate a reply, and while they are there they are subject to that country's laws. This site does not store the conversation. Please do not type personal or financial information into the assistant. On a live Northern Birch service, anything processed outside Canada would be named here, with the provider and the purpose."},
          {t:"Data Retention",p:"We retain your personal information for as long as necessary to provide services and comply with legal obligations. Financial records are retained for a minimum of 7 years as required by the Income Tax Act and FINTRAC regulations. Insurance records are retained for the life of the policy plus 7 years."},
          {t:"Data Security",p:"We protect your information using industry-standard security measures including SSL/TLS encryption, multi-factor authentication, firewalls, intrusion detection systems, and regular security audits."},
          {t:"Cookies and Digital Tracking",p:"Our website uses essential cookies for functionality and analytics cookies to improve user experience. You can manage cookie preferences through your browser settings. We do not sell personal information to third parties for advertising purposes."},
          {t:"Contact",p:"Privacy Officer, Northern Birch Credit Union Limited, 4 Credit Union Drive, North York, Ontario M4A 2N8. Email: privacy@northernbirchcu.com. Phone: 416-465-4659. Office of the Privacy Commissioner of Canada: 1-800-282-1376 or www.priv.gc.ca."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
        <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:32}}>Last updated: March 2026. Northern Birch Credit Union Limited is regulated by the Financial Services Regulatory Authority of Ontario (FSRA).</p>
      </div>
    </section>
  );
}

// ============ ACCESSIBILITY PAGE (AODA) ============
