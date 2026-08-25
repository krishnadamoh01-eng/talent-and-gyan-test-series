
function tgyGetNews(){
 try{return JSON.parse(localStorage.getItem("tgy_news_items")||"[]").filter(x=>x&&x.text&&x.enabled!==false)}
 catch(e){return []}
}
function tgyApplyNews(){
 const box=document.getElementById("homeNewsTicker"); if(!box)return;
 const items=tgyGetNews();
 if(!items.length){box.innerHTML='<div class="ticker-label">📢 महत्वपूर्ण जानकारी</div><div class="ticker-window"><div class="ticker-track"><span class="ticker-item">अभी कोई महत्वपूर्ण जानकारी उपलब्ध नहीं है।</span></div></div>';box.style.display="flex";return}
 box.style.display="flex";
 box.innerHTML='<div class="ticker-label">📢 महत्वपूर्ण जानकारी</div><div class="ticker-window"><div class="ticker-track">'+items.map(x=>`<span class="ticker-item">${esc(x.text)}</span>`).join("")+'</div></div>';
}
document.addEventListener("DOMContentLoaded",tgyApplyNews);
window.addEventListener("storage",tgyApplyNews);
