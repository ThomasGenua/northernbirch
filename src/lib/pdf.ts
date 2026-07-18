"use client";

// Browser print-to-PDF. Opens a clean printable view with NBCU branding.
export function exportToPDF(elementId: string, title = "Northern Birch Document") {
  const el = document.getElementById(elementId);
  if (!el) { window.print(); return; }
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { alert("Please allow pop-ups to download PDF."); return; }
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const cleaned = el.innerHTML
    .replace(/<button[^>]*>[\s\S]*?<\/button>/g, "")
    .replace(/<input[^>]*\/?>/g, "")
    .replace(/<select[\s\S]*?<\/select>/g, "");
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    @page { size: letter; margin: 0.75in; }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1B2A4A; line-height: 1.6; }
    .header { border-bottom: 3px solid #1B2A4A; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 22px; font-weight: 700; color: #1B2A4A; }
    .logo span { color: #C8B88A; }
    .meta { font-size: 11px; color: #999; text-align: right; }
    h1, h2, h3 { color: #1B2A4A; margin-bottom: 8px; }
    p { margin-bottom: 8px; font-size: 13px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center; }
  </style></head><body>
    <div class="header">
      <div class="logo">Northern Birch <span>Credit Union</span></div>
      <div class="meta">${title}<br/>${date}</div>
    </div>
    ${cleaned}
    <div class="footer">Northern Birch Credit Union Limited &middot; FSRA Insured &middot; northernbirchcu.com &middot; 416-465-4659<br/>Insurance via The Personal, CUMIS, and Manulife.</div>
    <scr` + `ipt>setTimeout(() => { window.print(); setTimeout(() => window.close(), 500); }, 250);</scr` + `ipt>
  </body></html>`);
  w.document.close();
}
