
(async()=>{
  const $=s=>document.querySelector(s);
  try{
    const r=await fetch("data/findings.json",{cache:"no-store"});
    const d=await r.json();
    $("[data-responses]").textContent=d.responses ?? 0;
    $("[data-countries]").textContent=d.countries ?? 0;
    $("[data-sectors]").textContent=d.sectors ?? 0;
    $("[data-updated]").textContent=d.updated_at ?? "—";
    const list=$("[data-finding-list]");
    if(Array.isArray(d.findings)&&d.findings.length){
      list.innerHTML=d.findings.map(x=>`<div class="legal-row"><strong>${x.title||""}</strong>${x.value||""}</div>`).join("");
    }else{
      list.innerHTML='<div class="legal-row"><strong>Study opening soon</strong>Public findings will appear here only after verified employer responses are reviewed and aggregated.</div>';
    }
  }catch(e){}
})();
