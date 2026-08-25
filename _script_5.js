
function getCurrentStudent(){
 try{return JSON.parse(localStorage.getItem("tgy_user")||"null")}catch(e){return null}
}
function hasPurchasedTest(t){
 const u=getCurrentStudent(); if(!u)return false;
 const acc=u.purchasedTests||[];
 return acc.some(x=>x===t.name || x===t.id || x===t.course || x===t.exam);
}
function renderMyPurchasedTests(){
 const b=document.getElementById("myPurchasedTests"); if(!b)return;
 const u=getCurrentStudent();
 if(!u){
   b.innerHTML='<div class="card"><h3>🔐 पहले Login करें</h3><p>खरीदे हुए Tests देखने और Test देने के लिए अपने Account में Login करें।</p><button class="btn" onclick="openAuth(\'login\')">Login</button></div>';
   return;
 }
 const purchased=u.purchasedTests||[];
 const payments=JSON.parse(localStorage.getItem("tgy_payments")||"[]").filter(p=>p.email===u.email && (p.status==="Access Activated"||p.status==="Approved"));
 const mine=tests.filter(t=>purchased.includes(t.name)||purchased.includes(t.id)||purchased.includes(t.exam)||purchased.includes(t.course));
 if(!mine.length){
   b.innerHTML='<div class="card"><h3>📭 अभी कोई खरीदा हुआ Test नहीं है।</h3><p>Payment approve होने के बाद आपका खरीदा हुआ Test यहाँ दिखाई देगा।</p></div>';
   return;
 }
 b.innerHTML='<p class="muted">यहाँ केवल आपके Account को दिए गए Tests दिखाई दे रहे हैं।</p>'+
 mine.map(t=>{
   const p=payments.find(x=>x.course===t.name||x.course===t.exam||x.course===t.course);
   return `<div class="card" style="margin:10px 0"><h3>🎓 ${esc(t.name)}</h3>
   <p>${esc(t.exam||t.course||"")} • ${t.questions.length} Questions • ${t.time} मिनट</p>
   ${p?`<p class="muted">खरीदा गया Plan: ${esc(p.days?String(p.days)+" दिन":"")} ${p.amount?`• ₹${esc(p.amount)}`:""}</p>`:""}
   <button class="btn orange" onclick="openTest(${tests.indexOf(t)})">▶️ अपना Test दें</button></div>`;
 }).join("");
}

<script id="student-notes-viewer">
function getNotes(){
 try{return JSON.parse(localStorage.getItem("tgy_pdf_notes")||"[]")}catch(e){return []}
}
function renderStudentNotes(){
 const b=document.getElementById("studentNotesList"); if(!b)return;
 const notes=getNotes();
 if(!notes.length){b.innerHTML='<p>अभी कोई PDF Notes उपलब्ध नहीं है।</p>';return}
 b.innerHTML=notes.map((n,i)=>`<div class="card" style="margin:10px 0">
 <h3>📄 ${esc(n.title||("Notes "+(i+1)))}</h3>
 <p class="muted">${esc(n.exam||"")} ${n.pages?`• ${n.pages} Pages`:""} ${Number(n.mrp)||Number(n.offer)?`• MRP ₹${n.mrp||0} ${n.offer?`• Offer ₹${n.offer}`:""}`:""}</p>
 <button class="btn" onclick="viewPdfNote(${i})">📖 साइट पर पढ़ें</button>
 </div>`).join("");
}
function viewPdfNote(i){
 const n=getNotes()[i]; if(!n)return;
 const o=document.getElementById("studentPageOverlay");
 const viewer=`<div style="background:#fff;border-radius:12px;padding:10px">
 <div style="display:flex;justify-content:space-between;align-items:center"><h3>📄 ${esc(n.title||"PDF Notes")}</h3><button class="btn" onclick="closeNoteViewer()">✕ बंद करें</button></div>
 <div id="pdfNoteViewer" style="height:75vh;overflow:auto;background:#555"></div></div>`;
 o.querySelector(".student-page-body").innerHTML=viewer;
 const box=document.getElementById("pdfNoteViewer");
 if(n.url){
   const iframe=document.createElement("iframe");
   iframe.src=n.url+"#toolbar=0&navpanes=0&scrollbar=1";
   iframe.style.cssText="width:100%;height:100%;border:0;background:white";
   iframe.setAttribute("sandbox","allow-same-origin allow-scripts");
   box.appendChild(iframe);
 }else if(n.dataUrl){
   const iframe=document.createElement("iframe");
   iframe.src=n.dataUrl+"#toolbar=0&navpanes=0&scrollbar=1";
   iframe.style.cssText="width:100%;height:100%;border:0;background:white";
   iframe.setAttribute("sandbox","allow-same-origin");
   box.appendChild(iframe);
 }else{
   box.innerHTML="<p style='color:white;padding:20px'>PDF उपलब्ध नहीं है।</p>";
 }
 box.addEventListener("contextmenu",e=>e.preventDefault());
}
function closeNoteViewer(){openStudentPage("notes")}
document.addEventListener("keydown",e=>{
 const viewer=document.getElementById("pdfNoteViewer");
 if(viewer && (e.ctrlKey||e.metaKey) && ["s","p","u"].includes(e.key.toLowerCase())){e.preventDefault();e.stopPropagation()}
});
<script id="home-headline-script">
function renderHomeHeadline(){
 const el=document.getElementById("homeHeadline");if(!el)return;
 let c={};try{c=JSON.parse(localStorage.getItem("tgy_home_custom")||"{}")}catch(e){}
 const h=(c.headline||"").trim();el.innerHTML=h?`<span>${esc(h)}</span>`:"";el.style.display=h?"block":"none";
}
document.addEventListener("DOMContentLoaded",renderHomeHeadline);
