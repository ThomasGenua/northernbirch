import React from "react";
import { Btn, C, Fade, SH, ff, fs } from '../ui.jsx';

export default function PersonalPage({setPage}){return <section className="sec" style={{background:C.cream,}}><div style={{maxWidth:1320,margin:"0 auto"}}><SH tag="Personal Banking" tagColor={C.greenText} title="Banking designed around you"/><div className="grid-3-2-1" style={{gap:16}}>{[{t:"Daily Banking",c:C.greenFill,go:["accounts","Compare chequing & savings"],items:["No-fee chequing","High-interest savings","Trust accounts","Student banking","e-Transfer","Debit card","Mobile app","Online banking"]},{t:"Borrowing",c:C.accentText,go:["mortgages","Explore mortgages"],items:["Fixed/variable mortgages","Co-op mortgages","HELOCs","Personal loans","Credit lines","Mastercard credit cards","Student loans","Pre-approval"]},{t:"Investing",c:C.amberFill,go:["accounts","See GICs & registered plans"],items:["GICs & term deposits","TFSA","RRSP","FHSA","RESP","RDSP","Mutual funds","Qtrade trading","VirtualWealth"]}].map((cat,i)=><Fade key={i} delay={i*0.08}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #eee"}}><div style={{background:cat.c,padding:"20px 28px"}}><h3 style={{fontFamily:ff,fontSize:22,color:"#fff",margin:0}}>{cat.t}</h3></div><div style={{padding:"12px 28px"}}>{cat.items.map((item,ii)=><div key={ii} style={{padding:"8px 0",borderBottom:ii<cat.items.length-1?"1px solid #f5f5f5":"none",display:"flex",gap:8,alignItems:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:cat.c}}/><span style={{fontFamily:fs,fontSize:14,color:"#555"}}>{item}</span></div>)}</div><div style={{padding:"4px 28px 24px"}}>
                <Btn small color={cat.c} onClick={()=>setPage(cat.go[0])}>{cat.go[1]} &rarr;</Btn>
              </div></div></Fade>)}</div>
    <Fade delay={0.3}><div style={{background:"#fff",borderRadius:20,padding:"24px 28px",border:"1px solid #eee",borderLeft:`4px solid ${C.greenFill}`,marginTop:24,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:240}}>
        <h3 style={{fontFamily:ff,fontSize:20,color:C.navy,margin:"0 0 4px"}}>Not sure which of these you need?</h3>
        <p style={{fontFamily:fs,fontSize:14,color:"#666",margin:0,lineHeight:1.7}}>A Financial Check-Up looks at all three together -- saving, borrowing and investing -- and costs members nothing.</p>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <Btn small color={C.greenFill} onClick={()=>setPage("advice")}>Financial advice &rarr;</Btn>
        <Btn small outline color={C.navy} onClick={()=>setPage("booking")}>Book a Check-Up &rarr;</Btn>
      </div>
    </div></Fade>
  </div></section>}
