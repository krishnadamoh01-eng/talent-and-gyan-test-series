
const HC_COLORS_DEFAULT={
 pageBg:"#f7f9fc",headerBg:"#0b5ed7",headerText:"#ffffff",
 newsBg:"#d90429",newsText:"#ffffff",heading:"#123b66",
 cardBg:"#ffffff",cardText:"#222222",buttonBg:"#f07800",buttonText:"#ffffff"
};
function hcColors(){try{return {...HC_COLORS_DEFAULT,...JSON.parse(localStorage.getItem("tgy_home_colors")||"{}")}}catch(e){return {...HC_COLORS_DEFAULT}}}
function applyHomeColors(){
 const c=hcColors(), root=document.documentElement;
 const map={pageBg:"--hc-page-bg",headerBg:"--hc-header-bg",headerText:"--hc-header-text",newsBg:"--hc-news-bg",newsText:"--hc-news-text",heading:"--hc-heading",cardBg:"--hc-card-bg",cardText:"--hc-card-text",buttonBg:"--hc-button-bg",buttonText:"--hc-button-text"};
 Object.keys(map).forEach(k=>root.style.setProperty(map[k],c[k]));
}
function openColorCustomizer(){
 const c=hcColors();
 const items=[
  ["pageBg","पूरे Home Page का Background"],
  ["headerBg","Header / ऊपर की पट्टी का Background"],
  ["headerText","Header का Font Color"],
  ["newsBg","News पट्टी का Background"],
  ["newsText","News पट्टी का Font Color"],
  ["heading","Heading का Font Color"],
  ["cardBg","Course / Information Card का Background"],
  ["cardText","Card का Font Color"],
  ["buttonBg","Button का Background"],
  ["buttonText","Button का Font Color"]
 ];
 document.getElementById("modalContent").innerHTML=`<h2>🎨 Multi-Color Home Customize</h2>
 <p>हर हिस्से के लिए अलग-अलग रंग चुनें।</p>
 <div class="hcm-grid">${items.map(([k,l])=>`<div class="hcm-item"><label>${l}</label><input type="color" id="hcColor_${k}" value="${c[k]}"><small>${c[k]}</small></div>`).join("")}</div>
 <div class="hcm-actions"><button class="btn" onclick="saveHomeColors()">💾 Save Colors</button><button class="btn gray" onclick="closeM()">बंद करें</button></div>`;
 document.getElementById("modal").style.display="flex";
}
function saveHomeColors(){
 const c={};
 ["pageBg","headerBg","headerText","newsBg","newsText","heading","cardBg","cardText","buttonBg","buttonText"].forEach(k=>{c[k]=document.getElementById("hcColor_"+k).value});
 localStorage.setItem("tgy_home_colors",JSON.stringify(c));
 applyHomeColors();
 document.getElementById("modalContent").innerHTML=`<h2>✅ Colors Save हो गए</h2><p>अब Home Page में अलग-अलग रंग लागू हो गए हैं।</p><button class="btn" onclick="closeM()">ठीक है</button>`;
}
document.addEventListener("DOMContentLoaded",applyHomeColors);
