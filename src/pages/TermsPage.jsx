import React from "react";
import { C, fs, Linkify, SH } from '../ui.jsx';

export default function TermsPage(){
  
  return(
    <section className="sec" style={{background:C.cream,}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Legal" tagColor={C.navy} title="Terms of Use" desc="Terms governing the use of Northern Birch Credit Union's website and digital services."/>
        {[
          {t:"Acceptance of Terms",p:"By accessing or using the Northern Birch Credit Union website and digital banking services, you agree to these Terms of Use. If you do not agree, please do not use our services. These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein."},
          {t:"Insurance Products Disclaimer",p:"Insurance products displayed on this website are distributed by Northern Birch Credit Union on behalf of our manufacturing partners: The Personal Insurance Company (a Desjardins subsidiary), CUMIS (a Co-operators company), and Manulife Financial. Insurance products are not deposits, are not insured by the Financial Services Regulatory Authority of Ontario (FSRA), and are not guaranteed by Northern Birch Credit Union. Quote estimates are illustrative only and do not constitute an offer of insurance. Actual premiums are determined by the insurer based on underwriting criteria."},
          {t:"Deposit Insurance",p:"Eligible deposits at Northern Birch Credit Union are insured by the Financial Services Regulatory Authority of Ontario (FSRA). Registered account deposits (RRSP, RRIF, TFSA, RESP, RDSP, FHSA, LIRA, LIF) have unlimited coverage. Other eligible deposits are insured up to $250,000 per depositor. For full details, visit www.fsrao.ca."},
          {t:"Rate Disclaimers",p:"Interest rates and terms displayed on this website are subject to change without notice. Posted rates are for informational purposes only and may not reflect the actual rate offered to you. Mortgage rates displayed may not include applicable insurance premiums or other charges. GIC rates are subject to minimum deposit requirements. Please contact your branch for the most current rates."},
          {t:"Investment Risk Disclosure",p:"Mutual funds and other investment products are offered through Aviso Wealth, Qtrade Direct Investing, and VirtualWealth. Mutual funds, securities, and other investment products are not deposits, are not insured by FSRA, are not guaranteed by Northern Birch Credit Union, and may fluctuate in value. Commissions, trailing commissions, management fees, and expenses may all be associated with mutual fund investments. Please read the prospectus before investing."},
          {t:"Electronic Communications",p:"By using our online and mobile banking services, you consent to receiving electronic communications including account statements, transaction confirmations, policy documents, and notices. You may revoke this consent at any time by contacting your branch. Electronic communications are governed by the Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada's Anti-Spam Legislation (CASL)."},
          {t:"Limitation of Liability",p:"Northern Birch Credit Union provides this website and its tools (including quote calculators, financial calculators, and other estimators) on an 'as is' basis. We do not warrant the accuracy, completeness, or reliability of any information or calculations. Northern Birch shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website."},
          {t:"Anti-Money Laundering",p:"Northern Birch Credit Union complies with the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) and is registered with the Financial Transactions and Reports Analysis Centre of Canada (FINTRAC). We are required to verify the identity of our members and report certain transactions."},
          {t:"Governing Law",p:"These Terms of Use are governed by the laws of the Province of Ontario and the federal laws of Canada. Any disputes arising from or relating to these terms shall be resolved in the courts of Ontario."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
        <p style={{fontFamily:fs,fontSize:12,color:"#707070",marginTop:32}}>Last updated: March 2026. Northern Birch Credit Union Limited. Ontario Corporation. Regulated by FSRA.</p>
      </div>
    </section>
  );
}

// ============ MAIN APP ============
