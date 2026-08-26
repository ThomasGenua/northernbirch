import React from "react";
import { C, Linkify, SH, fs } from '../ui.jsx';

export default function AccessibilityPage(){
  return(
    <section style={{background:C.cream,padding:typeof window!=="undefined"&&window.innerWidth<=768?"60px 16px":"80px 24px",paddingTop:typeof window!=="undefined"&&window.innerWidth<=768?80:100}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <SH tag="Accessibility" tagColor={C.greenText} title="Accessibility Commitment" desc="Northern Birch is committed to providing accessible services to all members in accordance with the Accessibility for Ontarians with Disabilities Act (AODA)."/>
        {[
          {t:"Our Commitment",p:"Northern Birch Credit Union is committed to meeting the accessibility needs of people with disabilities in a timely manner. We comply with the Accessibility for Ontarians with Disabilities Act, 2005 (AODA) and the Integrated Accessibility Standards Regulation (Ontario Regulation 191/11)."},
          {t:"Accessible Customer Service",p:"We provide accessible customer service to people with disabilities. Our staff are trained on serving members with various disabilities, including how to interact with people who use assistive devices, service animals, or support persons. If our usual methods of communication don't work for you, we'll work with you to find an alternative."},
          {t:"Website Accessibility",p:"We strive to make our website accessible to WCAG 2.0 Level AA standards. Features include: keyboard navigation support, screen reader compatibility, sufficient colour contrast, resizable text, descriptive alt text for images, and clear navigation structure. If you encounter any accessibility barriers on our website, please contact us."},
          {t:"Accessible Formats",p:"Documents, statements, and communications are available in accessible formats upon request. This includes large print, electronic text, audio format, and other formats as agreed upon. Please allow a reasonable timeframe for conversion."},
          {t:"Branch Accessibility",p:"All Northern Birch branches are physically accessible, including: wheelchair-accessible entrances and counters, accessible parking, accessible washrooms, TTY/TTD telephone service, and assistive listening devices available upon request. Our new KESKUS flagship branch is being designed to exceed current accessibility standards."},
          {t:"Service Animals and Support Persons",p:"We welcome service animals and support persons in all our branches. If a support person accompanies a member, we will ensure that both persons can enter the premises together and that the member can access their support person while receiving services."},
          {t:"Feedback and Complaints",p:"We welcome feedback about how we provide accessible services. Feedback can be provided in person at any branch, by phone at 416-465-4659, by email at accessibility@northernbirchcu.com, or by mail. All feedback will be reviewed and responded to within 15 business days."},
        ].map((s,i)=>(<div key={i} style={{marginBottom:24}}><h3 style={{fontFamily:fs,fontSize:17,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3><p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:0}}><Linkify text={s.p}/></p></div>))}
      </div>
    </section>
  );
}

// ============ COMPLAINT RESOLUTION / OMBUDSMAN ============
