
const defaultTests=[
{name:"MP Patwari Mock Test - 01",time:60,questions:[
["मध्य प्रदेश की राजधानी क्या है?",["इंदौर","भोपाल","उज्जैन","जबलपुर"],1,"भोपाल मध्य प्रदेश की राजधानी है।"],
["भारत का संविधान कब लागू हुआ?",["15 अगस्त 1947","26 जनवरी 1950","26 नवंबर 1949","2 अक्टूबर 1950"],1,"भारत का संविधान 26 जनवरी 1950 को लागू हुआ।"],
["2 + 8 × 3 = ?",["30","26","24","18"],1,"गुणा पहले होगा: 8×3=24, फिर 2 जोड़ने पर 26।"]]},
{name:"MP Patwari Practice Set - 02",time:30,questions:[
["सांची स्तूप किस जिले में स्थित है?",["भोपाल","रायसेन","सीहोर","विदिशा"],1,"सांची स्तूप रायसेन जिले में स्थित है।"],
["'कमल' का पर्यायवाची कौन सा है?",["पंकज","पवन","पर्वत","पल्लव"],0,"पंकज कमल का पर्यायवाची है।"]]}
];
let tests=JSON.parse(localStorage.getItem("tgy_tests")||"null")||defaultTests;
tests=tests.map(t=>({...t,exam:t.exam||"MP पटवारी",visible:t.visible!==false,pricing:t.pricing||{oneTest:{mrp:0,offer:0},plans:{}}}));
let results=JSON.parse(localStorage.getItem("tgy_results")||"[]");

const demoQuestions = [
["मध्य प्रदेश की राजधानी क्या है?",["इंदौर","भोपाल","उज्जैन","जबलपुर"],1,"भोपाल मध्य प्रदेश की राजधानी है।"],
["भारत का संविधान कब लागू हुआ?",["15 अगस्त 1947","26 जनवरी 1950","26 नवंबर 1949","2 अक्टूबर 1950"],1,"संविधान 26 जनवरी 1950 को लागू हुआ।"],
["2 + 8 × 3 = ?",["30","26","24","18"],1,"गुणा पहले: 8×3=24, फिर 2 जोड़ने पर 26।"],
["सांची स्तूप किस जिले में है?",["भोपाल","रायसेन","सीहोर","विदिशा"],1,"सांची रायसेन जिले में है।"],
["'कमल' का पर्यायवाची है?",["पंकज","पवन","पर्वत","पल्लव"],0,"पंकज कमल का पर्यायवाची है।"]
];
const examDemo = ["MP पटवारी","MPPSC","MP पुलिस","ग्रुप 4","Hospital Assistant","अन्य परीक्षाएँ"];
function openExam(exam){
 const list=tests.filter(t=>t.exam===exam && t.visible!==false && tgyDateValid(t.availableUntil) && (t.demo===true || hasPurchasedTest(t)));
 let html=`<div class="exam-inner-head"><h2>📚 ${esc(exam)}</h2><p class="muted">इस परीक्षा के Demo और उपलब्ध Test Series यहाँ दिखाई देंगे।</p></div>`;
 html+=`<div class="card" style="border:2px solid #f07800"><h3>🎁 ${esc(exam)} Demo Test</h3><p>Demo Test उपलब्ध है।</p><button class="btn orange" onclick="startExamDemo('${esc(exam)}')">Free Demo Test दें</button></div>`;
 if(list.length){
   html+=`<h3>📚 उपलब्ध Test Series</h3>`+list.map(t=>`<div class="card"><b>${esc(t.name)}</b><p>${t.questions.length} Questions • ${t.time} मिनट</p><${hasPurchasedTest(t)?`<button class="btn" onclick="closeExam();openTest(${tests.indexOf(t)})">▶️ Test दें</button>`:`<button class="btn orange" onclick="buyTest('${esc(t.name)}',0)">💳 ₹${Number(t.pricing?.oneTest?.offer)||Number(t.pricing?.oneTest?.mrp)||"Price देखें"}</button>`}</div>`).join("");
 }else{
   html+=`<div class="card"><h3>📚 Test Series</h3><p class="muted">इस परीक्षा की Test Series अभी <b>Coming Soon</b> है। जल्द ही यहाँ Test Series जोड़ी जाएगी।</p></div>`;
 }
 html+=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn gray" onclick="closeExam()">← पीछे</button><button class="btn" onclick="closeExam();window.scrollTo({top:0,behavior:'smooth'})">🏠 Home</button><button class="btn gray" onclick="closeExam()">✕ बंद करें</button></div>`;
 document.getElementById("examContent").innerHTML=html;
 document.getElementById("examModal").style.display="flex";
}
function closeExam(){document.getElementById("examModal").style.display="none"}
function startExamDemo(exam){
  closeExam();
  window.state={t:{name:exam+" Demo Test",time:10,questions:demoQuestions},idx:0,answers:Array(demoQuestions.length).fill(null)};
  document.getElementById("modalContent").innerHTML=`<div class="timer" id="timer"></div><h2>${esc(exam)} — Free Demo Test</h2><p class="muted">यह Demo Test मुफ्त है। Option चुनना जरूरी है।</p><div id="qarea"></div><button class="btn gray" id="prev" onclick="prevQ()">← Previous</button> <button class="btn" id="next" onclick="nextQ()">Next →</button>`;
  document.getElementById("modal").style.display="flex"; renderQ();
  let sec=10*60; window.timer=setInterval(()=>{sec--;let e=document.getElementById("timer");if(e)e.textContent=`⏱️ ${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;if(sec<=0)submitDemo()},1000);
}
function submitDemo(){
  clearInterval(window.timer);
  const s=state; let correct=0,attempted=s.answers.filter(x=>x!==null).length;
  s.t.questions.forEach((q,i)=>{if(s.answers[i]===q[2])correct++});
  let wrong=attempted-correct, skipped=s.t.questions.length-attempted, percent=(correct/s.t.questions.length*100).toFixed(0);
  document.getElementById("modalContent").innerHTML=`<h2>🎉 Demo Result</h2><div class="result"><b>कुल:</b> ${s.t.questions.length} | <b>Attempt:</b> ${attempted} | <b>सही:</b> ${correct} | <b>गलत:</b> ${wrong} | <b>छोड़े:</b> ${skipped}<br><b>Percentage:</b> ${percent}%</div>
  <div class="card" style="margin-top:15px"><h3>🚀 आगे Test Series लें</h3><p>आपने Demo पूरा कर लिया है। अब पूरी Test Series में उपलब्ध सभी Tests देने के लिए Access Plan चुनें।</p><button class="btn orange" onclick="closeM();document.getElementById('plans').scrollIntoView({behavior:'smooth'})">Test Series खरीदें</button></div><button class="btn gray" onclick="closeM()">बंद करें</button>`;
}

function openAuth(mode){
 const logged=JSON.parse(localStorage.getItem("tgy_user")||"null");
 if(mode==="account" && logged){
   document.getElementById("authContent").innerHTML=`<h2>👤 My Account</h2><div class="card"><b>नाम:</b> ${esc(logged.name)}<br><b>Email:</b> ${esc(logged.email)}<br><b>Mobile:</b> ${esc(logged.mobile||"-")}</div><h3>मेरे Results</h3><div id="myres"></div><button class="btn danger" onclick="logout()">Logout</button> <button class="btn gray" onclick="closeAuth()">बंद करें</button>`;
   const rs=JSON.parse(localStorage.getItem("tgy_results")||"[]"); document.getElementById("myres").innerHTML=rs.length?rs.map(r=>`<div class="q"><b>${esc(r.test)}</b><br>सही: ${r.correct} | गलत: ${r.wrong} | ${r.percent}%</div>`).join(""):"अभी कोई Result नहीं।";
 } else if(mode==="login"){
   document.getElementById("authContent").innerHTML=`<h2>🔐 Login</h2><label>Email</label><input id="aemail" type="email"><label>Password</label><div class="password-field-wrap"><input id="apass" type="password"><button type="button" class="btn password-toggle" onclick="togglePassword('apass',this)">👁️ दिखाएँ</button></div><button class="btn" onclick="doLogin()">Login</button> <button class="btn gray" onclick="closeAuth()">बंद करें</button><p>Account नहीं है? <a href="#" onclick="openAuth('register');return false">Register करें</a></p>`;
 } else {
   document.getElementById("authContent").innerHTML=`<h2>📝 Register</h2><label>नाम</label><input id="rname"><label>Email</label><input id="remail" type="email"><label>Mobile</label><input id="rmobile"><label>Password</label><div class="password-field-wrap"><input id="rpass" type="password"><button type="button" class="btn password-toggle" onclick="togglePassword('rpass',this)">👁️ दिखाएँ</button></div><label>Confirm Password</label><div class="password-field-wrap"><input id="rcpass" type="password"><button type="button" class="btn password-toggle" onclick="togglePassword('rcpass',this)">👁️ दिखाएँ</button></div><button class="btn" onclick="doRegister()">Register</button> <button class="btn gray" onclick="closeAuth()">बंद करें</button>`;
 }
 document.getElementById("authModal").style.display="flex";
}
function closeAuth(){document.getElementById("authModal").style.display="none"}
function doRegister(){
 const name=rname.value.trim(),email=remail.value.trim().toLowerCase(),mobile=rmobile.value.trim(),pass=rpass.value,cpass=rcpass.value;
 if(!name||!email||!pass||pass!==cpass){alert("सभी जरूरी जानकारी सही भरें।");return}
 const users=JSON.parse(localStorage.getItem("tgy_users")||"[]");
 if(users.some(u=>u.email===email)){alert("इस Email से Account पहले से बना है।");return}
 users.push({name,email,mobile,password:pass,created:new Date().toLocaleString(),access:null});
 localStorage.setItem("tgy_users",JSON.stringify(users));
 localStorage.setItem("tgy_user",JSON.stringify(users[users.length-1]));
 alert("Registration सफल हुआ।"); closeAuth(); updateAuthUI(); if(typeof renderMyPurchasedTests==="function")renderMyPurchasedTests();
}
function doLogin(){
 const email=aemail.value.trim().toLowerCase(),pass=apass.value;
 const users=JSON.parse(localStorage.getItem("tgy_users")||"[]");
 const u=users.find(x=>x.email===email&&x.password===pass);
 if(!u){alert("Email या Password गलत है।");return}
 localStorage.setItem("tgy_user",JSON.stringify(u)); closeAuth(); updateAuthUI(); if(typeof renderMyPurchasedTests==="function")renderMyPurchasedTests();
}
function logout(){localStorage.removeItem("tgy_user");closeAuth();updateAuthUI()}
function updateAuthUI(){
 const box=document.getElementById("studentAuthTop"); if(!box)return;
 let u=null;try{u=JSON.parse(localStorage.getItem("tgy_user")||"null")}catch(e){}
 box.innerHTML=u
  ? `<a href="#" onclick="openAuth('account');return false">👤 ${esc(u.name||"My Account")}</a><button class="btn danger" style="padding:7px 10px" onclick="logout()">🚪 Logout</button>`
  : `<a href="#" onclick="openAuth('login');return false">🔐 Login</a><a class="register" href="#" onclick="openAuth('register');return false">📝 Register</a>`;
}

function renderTests(){
 const u=getCurrentStudent(),acc=u?.purchasedTests||[];
 const visible=tests.filter(t=>t.demo===true || acc.includes(t.name)||acc.includes(t.id)||acc.includes(t.exam)||acc.includes(t.course));
 document.getElementById("testCards").innerHTML=visible.length?visible.map(t=>`<div class="card"><h3>${esc(t.name)}</h3><p class="muted">${t.questions.length} Questions • ${t.time} मिनट</p><button class="btn" onclick="openTest(${tests.indexOf(t)})">Test दें</button></div>`).join(""):'<div class="card"><p>Login करें और अपने खरीदे हुए Tests देखने के लिए 🎓 खरीदे हुए Tests खोलें।</p></div>';
}
function tgyDateValid(until){return !until || new Date(until+"T23:59:59")>=new Date()}
function tgyPriceText(p){
 const mrp=Number(p?.mrp)||0,offer=Number(p?.offer)||0,price=offer||mrp;
 return price?`<span style="text-decoration:${mrp&&offer&&mrp>offer?"line-through": "none"};opacity:${mrp&&offer&&mrp>offer?.65:1}">₹${mrp}</span> ${offer&&mrp>offer?`<b style="color:#d35400">₹${offer}</b>`:""}`:"Price Admin में सेट नहीं है";
}
function tgyGetTestByName(name){return tests.find(t=>t.name===name)}
function tgyEffectiveOffer(test,days,code){
 const p=test?.pricing||{},base=p.plans?.[String(days)]||p.oneTest||{};
 let price=Number(base.offer)||Number(base.mrp)||0,discount=0;
 const c=(code||"").trim().toUpperCase();
 if(c && c===String(p.redeemCode||"").toUpperCase() && tgyDateValid(p.redeemUntil)){
   discount=Math.min(100,Math.max(0,Number(p.redeemDiscount)||0));
   price=Math.max(0,Math.round(price*(100-discount)/100));
 }
 return {base,price,discount};
}
function buyTest(testName,days){
 const t=tgyGetTestByName(testName); if(!t)return;
 if(t.availableUntil&&!tgyDateValid(t.availableUntil)){alert("यह Test/Offer अब उपलब्ध नहीं है।");return}
 const p=t.pricing||{},plan=p.plans?.[String(days)]||p.oneTest||{};
 const original=Number(plan.offer)||Number(plan.mrp)||0;
 document.getElementById("modalContent").innerHTML=`<h2>💳 ${esc(t.name)}</h2>
 <div class="pay"><p><b>Test:</b> ${esc(t.name)}</p><p><b>Access:</b> ${days===0?"1 Test":days+" दिन"}</p>
 <p>MRP/Offer: ${tgyPriceText(plan)}</p>
 ${p.redeemCode&&tgyDateValid(p.redeemUntil)?`<label>🎟️ Redeem Code</label><input id="redeemCode" placeholder="Code डालें"><button class="btn" onclick="applyRedeem('${esc(testName)}',${days},${original})">Code Apply करें</button><div id="redeemResult" style="margin-top:8px"></div>`:""}
 <div id="payFinal"><p><b>Payable: ₹${original}</b></p><button class="btn orange" onclick="submitPayment('${esc(testName)}',${days},${original})">Payment Details भरें</button></div>
 <button class="btn gray" onclick="closeM()">बंद करें</button></div>`;
 document.getElementById("modal").style.display="flex";
}
function applyRedeem(testName,days,original){
 const t=tgyGetTestByName(testName),code=document.getElementById("redeemCode").value.trim().toUpperCase(),p=t?.pricing||{};
 const ok=code&&code===String(p.redeemCode||"").toUpperCase()&&tgyDateValid(p.redeemUntil);
 const discount=ok?Math.min(100,Math.max(0,Number(p.redeemDiscount)||0)):0;
 const final=ok?Math.max(0,Math.round(original*(100-discount)/100)):original;
 document.getElementById("redeemResult").innerHTML=ok?`<span style="color:green">✅ ${discount}% Discount लागू हुआ।</span>`:`<span style="color:red">❌ Redeem Code गलत या Expire हो चुका है।</span>`;
 document.getElementById("payFinal").innerHTML=`<p><b>Payable: ₹${final}</b> ${ok?`<span style="text-decoration:line-through">₹${original}</span>`:""}</p><button class="btn orange" onclick="submitPayment('${esc(testName)}',${days},${final},'${esc(code)}')">Payment Details भरें</button>`;
}
function showPlanStep(){
 const c=document.getElementById("payCourse")?.value;
 const t=tgyGetTestByName(c);
 if(!t){document.getElementById("planStep").innerHTML="<p>पहले Test चुनें।</p>";return}
 const p=t.pricing||{},arr=Object.entries(p.plans||{}).filter(([d,v])=>tgyDateValid(p.availableUntil)&&((Number(v.offer)||Number(v.mrp))>0));
 let html=`<p><b>Step 2:</b> Access चुनें</p>`;
 if(Number(p.oneTest?.offer)||Number(p.oneTest?.mrp)) html+=`<div class="card"><h3>1 Test</h3><div>${tgyPriceText(p.oneTest)}</div><button class="btn orange" onclick="buyTest('${esc(c)}',0)">यह Test लें</button></div>`;
 if(arr.length) html+=`<div class="grid">${arr.map(([d,v])=>`<div class="card"><h3>${d} दिन</h3><div>${tgyPriceText(v)}</div><button class="btn orange" onclick="buyTest('${esc(c)}',${d})">Plan चुनें</button></div>`).join("")}</div>`;
 if(!Number(p.oneTest?.offer)&&!Number(p.oneTest?.mrp)&&!arr.length)html+=`<div class="card">इस Test की Price अभी Admin Panel में सेट नहीं की गई है।</div>`;
 document.getElementById("planStep").innerHTML=html;
}
function showPayment(course,days,amount){
 document.getElementById("modalContent").innerHTML=`<h2>💳 Payment</h2><div class="pay"><p><b>Test Series:</b> ${esc(course)}</p><p><b>Access:</b> ${days===0?"1 Test":days+" दिन"}</p><p><b>Amount:</b> ₹${amount}</p><img class="qr" src="upi_qr.jpeg" alt="UPI QR Code"><div class="upi">paytm.s2uiv58@pty</div><p>QR Code से ₹${amount} Payment करें और UTR भरें।</p><label>नाम</label><input id="pn"><label>Email</label><input id="pemail" type="email"><label>Transaction / UTR Number</label><input id="utr"><button class="btn" onclick="submitPayment('${esc(course)}',${days},${amount})">Payment Details Submit करें</button> <button class="btn gray" onclick="closeM()">बंद करें</button></div>`;
}
function submitPayment(course,days,amount,redeemCode=""){
 let p=JSON.parse(localStorage.getItem("tgy_payments")||"[]");
 p.push({name:document.getElementById("pn")?.value||"",email:document.getElementById("pemail")?.value||"",course,days,amount,redeemCode,utr:document.getElementById("utr")?.value||"",date:new Date().toLocaleString(),status:"Pending"});
 localStorage.setItem("tgy_payments",JSON.stringify(p));
 document.getElementById("modalContent").innerHTML=`<h2>✅ Payment Details प्राप्त हो गई हैं</h2><div class="result"><b>Test Series:</b> ${esc(course)}<br><b>Access:</b> ${days===0?"1 Test":days+" दिन"}<br><b>Amount:</b> ₹${amount}<br>${redeemCode?`<b>Redeem Code:</b> ${esc(redeemCode)}<br>`:""}<b>Status:</b> 🟡 Pending</div><p><b>आपका Access Admin approval के बाद चालू किया जाएगा।</b></p><button class="btn" onclick="closeM()">ठीक है</button>`;
}
function closeM(){document.getElementById("modal").style.display="none";clearInterval(window.timer)}
function openTest(i){
 const tCheck=tests[i],uCheck=getCurrentStudent();
 if(tCheck && tCheck.demo!==true && !hasPurchasedTest(tCheck)){
   alert("यह Test आपके Account में खरीदा/Activate नहीं हुआ है।");
   return;
 }const t=tests[i];window.state={t,idx:0,answers:Array(t.questions.length).fill(null)};document.getElementById("modalContent").innerHTML=`<div style="display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap"><div class="timer" id="timer"></div><div><button class="btn gray" onclick="closeTestModal()">← पीछे</button> <button class="btn" onclick="closeTestModal();window.scrollTo({top:0,behavior:'smooth'})">🏠 Home</button></div></div><h2>${esc(t.name)}</h2><p class="muted">Option चुनना जरूरी है। Previous से वापस जाकर उत्तर बदल सकते हैं।</p><div id="qarea"></div><button class="btn gray" id="prev" onclick="prevQ()">← Previous</button> <button class="btn" id="next" onclick="nextQ()">Next →</button>`;document.getElementById("modal").style.display="flex";renderQ();let sec=t.time*60;window.timer=setInterval(()=>{sec--;let e=document.getElementById("timer");if(e)e.textContent=`⏱️ ${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;if(sec<=0)submitTest()},1000)}
function closeTestModal(){if(window.timer)clearInterval(window.timer);const m=document.getElementById("modal");if(m)m.style.display="none";}
function renderQ(){let s=state,q=s.t.questions[s.idx];document.getElementById("qarea").innerHTML=`<div class="q"><b>प्रश्न ${s.idx+1}. ${esc(q[0])}</b>${q[1].map((o,j)=>`<label><input type="radio" name="ans" value="${j}" ${s.answers[s.idx]===j?"checked":""} onchange="state.answers[state.idx]=+this.value"> ${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join("")}</div>`;document.getElementById("prev").style.visibility=s.idx?"visible":"hidden";document.getElementById("next").textContent=s.idx===s.t.questions.length-1?"Submit Test":"Next →"}
function nextQ(){if(state.answers[state.idx]===null){alert("पहले कोई एक विकल्प चुनें।");return}if(state.idx===state.t.questions.length-1)submitTest();else{state.idx++;renderQ()}}
function prevQ(){if(state.idx){state.idx--;renderQ()}}
function submitTest(){clearInterval(window.timer);let s=state,correct=0,attempted=s.answers.filter(x=>x!==null).length;s.t.questions.forEach((q,i)=>{if(s.answers[i]===q[2])correct++});let wrong=attempted-correct,skipped=s.t.questions.length-attempted,percent=(correct/s.t.questions.length*100).toFixed(2);results.unshift({test:s.t.name,total:s.t.questions.length,attempted,correct,wrong,skipped,percent,date:new Date().toLocaleString()});localStorage.setItem("tgy_results",JSON.stringify(results));let rows=s.t.questions.map((q,i)=>`<div class="q"><b>${i+1}. ${esc(q[0])}</b><p>आपका उत्तर: ${s.answers[i]===null?"नहीं दिया":esc(q[1][s.answers[i]])} ${s.answers[i]===q[2]?"✅":"❌"}</p><p><b>सही उत्तर:</b> ${esc(q[1][q[2]])}</p><p class="muted">${esc(q[3]||"")}</p></div>`).join("");document.getElementById("modalContent").innerHTML=`<h2>🎉 आपका Result</h2><div class="result"><b>कुल प्रश्न:</b> ${s.t.questions.length}<br><b>Attempt किए:</b> ${attempted}<br><b>सही:</b> ${correct} ✅<br><b>गलत:</b> ${wrong} ❌<br><b>छोड़े:</b> ${skipped}<br><b>अंक:</b> ${correct}/${s.t.questions.length}<br><b>Percentage:</b> ${percent}%</div><h3>Answer Key & Explanation</h3>${rows}<button class="btn" onclick="closeM();renderResults()">बंद करें</button>`;renderResults()}
function renderResults(){document.getElementById("resultList").innerHTML=results.length?results.slice(0,10).map(r=>`<div class="q"><b>${esc(r.test)}</b><br>Attempt: ${r.attempted} | सही: ${r.correct} | गलत: ${r.wrong} | छोड़े: ${r.skipped} | ${r.percent}%<br><span class="muted">${esc(r.date)}</span></div>`).join(""):"अभी कोई Result नहीं है।"}
renderResults();updateAuthUI();
function sendHelp(){let a=JSON.parse(localStorage.getItem("tgy_help")||"[]");a.push({name:hname.value,email:hemail.value,type:htype.value,utr:hutr.value,msg:hmsg.value,date:new Date().toLocaleString(),status:"Pending"});localStorage.setItem("tgy_help",JSON.stringify(a));alert("शिकायत Submit हो गई है।");hname.value=hemail.value=hutr.value=hmsg.value=""}
