import React, { useSyncExternalStore } from "react";
import { Btn, C, Fade, ff, fs, SH } from '../ui.jsx';

// The address the visitor actually asked for. Read through
// useSyncExternalStore with a server snapshot of null -- the same shape the
// viewport and language hooks in ui.jsx use -- because React renders the
// server snapshot during hydration too. That is what keeps the client's first
// pass identical to the markup prerendered into dist/404.html, where there is
// no location to read; rendering the path directly would reintroduce the
// hydration mismatch (#418) that prerendering already cost us once.
const subscribeNav=(cb)=>{window.addEventListener("popstate",cb);return()=>window.removeEventListener("popstate",cb)};
const readPath=()=>window.location.pathname+window.location.search;

// Shown for any URL that is not a route. Before this the site had no 404 at
// all: netlify.toml sent every unmatched path to index.html with status 200,
// and pageFromPath fell back to "home", so a mistyped or retired URL returned
// the homepage, at the wrong address, under the homepage's title.
export default function NotFoundPage({setPage}){
  const path=useSyncExternalStore(subscribeNav,readPath,()=>null);

  const go=[
    {t:"Personal banking",d:"Chequing, savings, borrowing and investing.",p:"personal",c:C.greenText},
    {t:"Mortgages",d:"Fixed, variable, high-ratio and co-op financing.",p:"mortgages",c:C.accentText},
    {t:"Current rates",d:"Today's posted mortgage, GIC and savings rates.",p:"rates",c:C.amberText},
    {t:"Accounts",d:"Compare chequing, savings, GICs and registered plans.",p:"accounts",c:C.greenText},
    {t:"Financial advice",d:"Planning, wealth and estate services.",p:"advice",c:C.purple},
    {t:"Contact us",d:"Branch hours, phone numbers and locations.",p:"contact",c:C.navy},
  ];

  return(
    <section className="sec" style={{background:C.cream,minHeight:"70vh"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <SH tag="Page not found" tagColor={C.redText} title="We couldn't find that page"
            desc="The address may have been mistyped, or the page may have moved since it was linked. Nothing is wrong with your account, and everything below still works."/>

        {path&&
          <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:"0 0 28px",lineHeight:1.7}}>
            You asked for <code style={{fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace",fontSize:13.5,background:"#fff",border:"1px solid #e6e6e6",borderRadius:6,padding:"2px 7px",color:C.navy,wordBreak:"break-all"}}>{path}</code>, which is not a page on this site.
          </p>}

        <h2 style={{fontFamily:ff,fontSize:22,color:C.navy,margin:"0 0 16px"}}>Where you might have been going</h2>
        <div className="grid-3-2-1" style={{gap:16,marginBottom:32}}>
          {go.map((s,i)=>
            <Fade key={i} delay={i*0.05}>
              <div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #eee",borderTop:`3px solid ${s.c}`,height:"100%",display:"flex",flexDirection:"column"}}>
                <h3 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>{s.t}</h3>
                <p style={{fontFamily:fs,fontSize:13,color:"#666",margin:"0 0 16px",lineHeight:1.7}}>{s.d}</p>
                <div style={{marginTop:"auto"}}>
                  <Btn small outline color={s.c} onClick={()=>setPage(s.p)}>Go there &rarr;</Btn>
                </div>
              </div>
            </Fade>)}
        </div>

        <div style={{background:`${C.navy}08`,borderRadius:20,padding:"28px 32px"}}>
          <h3 style={{fontFamily:fs,fontSize:16,color:C.navy,margin:"0 0 8px",fontWeight:700}}>Still stuck?</h3>
          <p style={{fontFamily:fs,fontSize:14,color:"#666",lineHeight:1.8,margin:"0 0 18px"}}>
            If you followed a link from our site or an email and landed here, that link is broken and we would like to fix it. Call us at <a href="tel:+14164654659" style={{color:C.accentText,fontWeight:600}}>416-465-4659</a> or use the contact page to tell us where it was.
          </p>
          <Btn color={C.accentText} onClick={()=>setPage("home")}>Back to the homepage &rarr;</Btn>
        </div>
      </div>
    </section>
  );
}
