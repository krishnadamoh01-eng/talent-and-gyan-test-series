
function openStudentPage(key){
 let overlay=document.getElementById("studentPageOverlay");
 if(!overlay){overlay=document.createElement("div");overlay.id="studentPageOverlay";overlay.className="student-page";document.body.appendChild(overlay)}
 const titles={home:"🏠 Home",mock:"🎯 Mock Tests",series:"📚 Test Series",plans:"💳 Access Plans",results:"📊 My Results",info:"ℹ️ Exam Information",help:"📞 सहायता"};
 let body="";
 if(key==="home"){body='<div class="card"><h2>Talent And Gyan Test Series</h2><p>अपनी परीक्षा चुनें और Demo/Test Series देखें।</p></div>'}
 if(key==="mock"){body='<div class="card"><h2>🎯 Mock Tests</h2><div id="studentMockPageList"></div></div>'}
 if(key==="series"){body='<div class="card"><h2>📚 Test Series</h2><div id="studentSeriesPageList"></div></div>'}
 if(key==="plans"){body='<div class="card"><h2>💳 Access Plans</h2><p>पहले Test Series चुनें, फिर अपना Plan चुनें और Payment करें।</p><button class="btn orange" onclick="pay()">Plan चुनें / Payment</button></div>'}
 if(key==="results"){body='<div class="card"><h2>📊 My Results</h2><p>Login करने के बाद आपके दिए गए Tests के Results यहाँ दिखाई देंगे।</p></div>'}
 if(key==="info"){body='<div class="card"><h2>ℹ️ Exam Information</h2><p>परीक्षा की तारीख, आवेदन, Admit Card, Exam Pattern, Syllabus, Result और Latest Updates यहाँ दिखाई देंगे।</p></div>'}
 if(key==="purchased"){body='<div class="card"><h2>🎓 My Purchased Tests</h2><div id="myPurchasedTests"></div></div>'}
 if(key==="notes"){body='<div class="card"><h2>📄 PDF Notes</h2><p>यहाँ Notes साइट पर पढ़े जा सकते हैं। Notes को डाउनलोड करने का विकल्प उपलब्ध नहीं होगा।</p><div id="studentNotesList"></div></div>'}
 if(key==="help"){body='<div class="card"><h2>📞 सहायता</h2><p>Payment, Login या Test से संबंधित सहायता के लिए यहाँ जानकारी दी जाएगी।</p></div>'}
 overlay.innerHTML='<div class="student-page-head"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="student-close" onclick="studentGoBack()">← पीछे</button><button class="student-close" onclick="studentGoHome()">🏠 Home</button><h2>'+titles[key]+'</h2></div><button class="student-close" onclick="closeStudentPage()">✕ बंद करें</button></div><div class="student-page-body">'+body+'</div>';
 overlay.style.display="block"; window.scrollTo(0,0);
 if(key==="mock") renderStudentMockPage();
 if(key==="series") renderStudentSeriesPage();
 if(key==="purchased") renderMyPurchasedTests();
 if(key==="notes") renderStudentNotes();
}
function closeStudentPage(){let o=document.getElementById("studentPageOverlay");if(o)o.style.display="none";document.body.style.overflow=""}
function studentGoHome(){closeStudentPage();window.scrollTo({top:0,behavior:"smooth"});}
function studentGoBack(){
 const o=document.getElementById("studentPageOverlay");
 if(o){o.style.display="none";}
 window.scrollTo({top:0,behavior:"smooth"});
}
function renderStudentMockPage(){
 let b=document.getElementById("studentMockPageList");if(!b)return;
 let names=["MP पटवारी","MPPSC","MP पुलिस","ग्रुप 4","Hospital Assistant"];
 b.innerHTML='<div class="grid">'+names.map(n=>`<div class="card"><h3>${esc(n)}</h3><p>Demo Mock Test</p><button class="btn orange" onclick="openExam('${esc(n)}')">🎯 Test खोलें</button></div>`).join('')+'</div>';
}
