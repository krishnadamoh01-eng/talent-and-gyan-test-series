
const HC_DEFAULTS={
 title:"Talent And Gyan Test Series",
 subtitle:"प्रतियोगी परीक्षाओं की तैयारी के लिए Test Series",
 announcement:"",
 examInfo:{examDate:true,applyStart:true,applyLast:true,admitCard:true,examDate2:true,pattern:true,syllabus:true,result:true},
 courses:true, demo:true, latest:true
};
function hcGet(){try{return {...HC_DEFAULTS,...JSON.parse(localStorage.getItem("tgy_home_custom")||"{}")}}catch(e){return {...HC_DEFAULTS}}}
function hcSave(v){localStorage.setItem("tgy_home_custom",JSON.stringify(v)); hcApply();}
function hcApply(){
 const c=hcGet();
 const title=document.getElementById("siteTitle"); if(title&&c.title) title.textContent=c.title;
 const sub=document.getElementById("siteSubtitle"); if(sub&&c.subtitle) sub.textContent=c.subtitle;
 const ann=document.getElementById("homeAnnouncement"); if(ann){ann.textContent=c.announcement||"";ann.style.display=c.announcement?"block":"none";}
 document.querySelectorAll("[data-hc-key]").forEach(el=>{const k=el.getAttribute("data-hc-key"); if(k in c.examInfo) el.style.display=c.examInfo[k]?"":"none";});
}
function openHomeCustomizer(){
 const c=hcGet();
 document.getElementById("modalContent").innerHTML=`<h2>🏠 Home Page Customize</h2>
 <p>यहाँ से आप Home Page पर क्या दिखाना है, खुद तय कर सकते हैं।</p>
 <div class="hc-grid">
 <div><label>Home Title</label><input id="hcTitle" value="${esc(c.title)}"></div>
 <div><label>Subtitle</label><input id="hcSubtitle" value="${esc(c.subtitle)}"></div>
 </div>
 <label style="display:block;margin-top:12px;font-weight:700">📢 Latest Announcement</label>
 <textarea id="hcAnn" rows="3" placeholder="जैसे: MP पटवारी परीक्षा की नई जानकारी...">${esc(c.announcement||"")}</textarea>
 <h3>Home Page पर क्या दिखाना है?</h3>
 <div class="hc-checks">
 ${[
 ["examDate","परीक्षा कब होगी"],["applyStart","आवेदन कब शुरू हुआ"],["applyLast","आवेदन की अंतिम तारीख"],
 ["admitCard","Admit Card"],["examDate2","Exam Date"],["pattern","Exam Pattern"],
 ["syllabus","Syllabus"],["result","Result"]
 ].map(x=>`<label class="hc-check"><input type="checkbox" id="hc_${x[0]}" ${c.examInfo[x[0]]?"checked":""}> ${x[1]}</label>`).join("")}
 </div>
 <div class="hc-actions">
 <button class="btn" onclick="saveHomeCustomizer()">💾 Save Home Settings</button>
 <button class="btn gray" onclick="closeM()">बंद करें</button>
 </div>`;
 document.getElementById("modal").style.display="flex";
}
function saveHomeCustomizer(){
 const v=hcGet();
 v.title=document.getElementById("hcTitle").value.trim()||HC_DEFAULTS.title;
 v.subtitle=document.getElementById("hcSubtitle").value.trim()||HC_DEFAULTS.subtitle;
 v.announcement=document.getElementById("hcAnn").value.trim();
 Object.keys(v.examInfo).forEach(k=>{const el=document.getElementById("hc_"+k); if(el)v.examInfo[k]=el.checked;});
 hcSave(v);
 document.getElementById("modalContent").innerHTML=`<h2>✅ Home Page Update हो गया</h2><p>आपकी चुनी हुई जानकारी Home Page पर दिखाई जाएगी।</p><button class="btn" onclick="closeM()">ठीक है</button>`;
}
document.addEventListener("DOMContentLoaded",hcApply);
