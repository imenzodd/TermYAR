const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const en=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const jal=(d,o)=>{try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',o).format(d)}catch{return d.toLocaleDateString('fa-IR')}};
function jp(d){const p={};new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(d).forEach(x=>p[x.type]=x.value);return{y:+p.year,m:+p.month,d:+p.day}}
const key=p=>`${p.y}/${String(p.m).padStart(2,'0')}/${String(p.d).padStart(2,'0')}`;
const dkey=d=>key(jp(d)),today=()=>dkey(new Date());
const normDate=s=>{const m=en(s).trim().replace(/-/g,'/').match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);return m&&+m[2]>=1&&+m[2]<=12&&+m[3]>=1&&+m[3]<=31?key({y:+m[1],m:+m[2],d:+m[3]}):null};
const ico=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg>`;
const ICONS={dashboard:'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',week:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',courses:'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',exams:'M6 3h9l4 4v14H6zM9 14l2 2 4-4',tasks:'M4 4h16v16H4zM8 12l3 3 5-6',study:'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 8a2.5 2.5 0 1 1 0 5M17 15c2.5 0 4 1.7 4 4',reports:'M5 20V10M12 20V4M19 20v-7',settings:'M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6'};
const pageNames={dashboard:['','با برنامه‌ریزی درست، ترم رو به بهترین شکل مدیریت کن.'],week:['برنامه هفتگی','برنامه‌ات رو ببین و زمانت رو هوشمندانه مدیریت کن.'],courses:['دروس من','درس‌ها و میزان پیشرفتت رو یک‌جا مدیریت کن.'],exams:['امتحانات','برای امتحان‌های پیش رو آماده باش.'],tasks:['پروژه‌ها و تکالیف','کارها و مهلت‌های مهمت رو فراموش نکن.'],study:['مطالعه','تایمر مطالعه؛ زمان‌هات خودکار ثبت می‌شن.'],reports:['تحلیل و گزارش‌ها','پیشرفتت رو دنبال کن و برای بهتر شدن برنامه بریز.'],settings:['تنظیمات','فضای ترم‌یار رو مطابق سلیقه‌ات تنظیم کن.']};
const days=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
const cls={'تکلیف':'orange','پروژه':'purple','امتحان':'pink','مطالعه':'green'};
const nm=()=>localStorage.getItem('ty_name')||'امیر';
let tasks=load('ty_tasks',null),courses=load('ty_courses',null),study=load('ty_study',[]),weekOff=0,q='',page='dashboard',timer=null,tsec=0;
if(!tasks)tasks=[{title:'حل تمرین‌های فیزیک',time:'10:30',type:'تکلیف',done:true},{title:'جلسه پروژه (گروه ۱)',time:'14:00',type:'پروژه',done:true},{title:'مطالعه فصل ۳ ریاضی',time:'16:00',type:'مطالعه',done:false},{title:'یادداشت‌برداری درس آمار',time:'21:00',type:'تکلیف',done:false}];
if(!courses)courses=[{name:'ریاضی',p:80},{name:'فیزیک',p:55},{name:'برنامه‌نویسی',p:40},{name:'زبان انگلیسی',p:70}];
tasks=tasks.map((t,i)=>({id:Date.now()+i,priority:'متوسط',...t,date:normDate(t.date||'')||today()}));
save('ty_tasks',tasks);save('ty_courses',courses);

function persist(){save('ty_tasks',tasks);renderAll();if(page!=='dashboard')renderSecondary(page)}
const tList=()=>tasks.filter(t=>t.date===today()).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
const bars=()=>courses.map(c=>`<div><label>${esc(c.name)} <b>${fa(c.p)}٪</b></label><i><em style="width:${c.p}%"></em></i></div>`).join('')||'<p class="empty">هنوز درسی اضافه نکردی.</p>';

function renderStats(){
  const tt=tList(),dn=tt.filter(t=>t.done).length,ex=tasks.filter(t=>t.type==='امتحان'&&!t.done&&t.date>=today()).length,pr=tasks.filter(t=>t.type==='پروژه'&&!t.done).length,wk=study.filter(s=>Date.now()-s.t<6048e5).reduce((a,s)=>a+s.min,0);
  const S=[['green','✓',`${fa(dn)} / ${fa(tt.length)}`,'وظایف امروز'],['violet','◷',`${fa((wk/60).toFixed(1)).replace('.','٫')} ساعت`,'مطالعهٔ ۷ روز اخیر'],['pink','▦',fa(ex),'امتحان پیش رو'],['blue','🎓',fa(pr),'پروژه فعال']];
  $('#stats').innerHTML=S.map(s=>`<article class="stat ${s[0]}"><div class="stat-icon">${s[1]}</div><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}
function renderDash(){
  const L=tList();
  $('#agenda').innerHTML=L.slice(0,5).map(t=>`<label class="agenda-row"><input type="checkbox" data-check="${t.id}" ${t.done?'checked':''}><span>${esc(t.title)}</span><small>${fa(t.time||'—')}</small></label>`).join('')||'<p class="empty">برای امروز کاری نداری.</p>';
  $('#todayTasks').innerHTML=L.slice(0,5).map(t=>`<label class="task-row ${t.done?'done':''}"><input type="checkbox" data-check="${t.id}" ${t.done?'checked':''}><span>${esc(t.title)}</span><small>${fa(t.time||'')}</small></label>`).join('')||'<p class="empty">هنوز کاری برای امروز ثبت نکردی.</p>';
  $('#projectList').innerHTML=tasks.filter(t=>t.type==='پروژه'&&!t.done).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4).map(t=>`<div class="project"><b>${esc(t.title)}</b><span class="project-icon">▷</span><small>مهلت: ${fa(t.date)}</small></div>`).join('')||'<p class="empty">پروژهٔ فعالی نداری.</p>';
  const a=courses.length?Math.round(courses.reduce((s,c)=>s+c.p,0)/courses.length):0;
  $('.donut').style.background=`conic-gradient(#0ba987 0 ${a}%,#edf1f6 ${a}% 100%)`;$('.donut span').textContent=fa(a)+'٪';$('.progress-panel .bars').innerHTML=bars();
  const S=[],od=tasks.filter(t=>!t.done&&t.date<today()).length,ex=tasks.filter(t=>t.type==='امتحان'&&!t.done&&t.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0],low=[...courses].sort((a,b)=>a.p-b.p)[0];
  if(od)S.push([`${fa(od)} کار عقب‌افتاده داری`,'امروز زمانی برای انجام یا حذفشان بگذار.']);
  if(ex)S.push([`امتحان «${esc(ex.title)}» در ${fa(ex.date)}`,'از همین حالا مطالعه را برنامه‌ریزی کن.']);
  if(low&&low.p<60)S.push([`درس ${esc(low.name)} کمترین پیشرفت را دارد`,'این هفته وقت بیشتری به آن بده.']);
  if(!S.length)S.push(['همه‌چیز مرتب است 👌','با «کار جدید» برنامهٔ بعدی‌ات را اضافه کن.']);
  $('#suggestions').innerHTML=S.map(s=>`<div class="suggestion"><span>›</span><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('');
  $('.bell i').classList.toggle('hidden',!L.some(t=>!t.done))}
function renderCalendar(){
  const n=new Date(),sat=new Date(n.getFullYear(),n.getMonth(),n.getDate()-(n.getDay()+1)%7+weekOff*7),ds=[...Array(7)].map((_,i)=>new Date(sat.getFullYear(),sat.getMonth(),sat.getDate()+i));
  const row=t=>Math.min(22,Math.max(8,(parseInt(t.time)||8)&~1));
  let h='<div class="time-label"></div>'+ds.map((d,i)=>`<div class="day-head ${dkey(d)===today()?'now':''}">${days[i]}<small>${jal(d,{day:'numeric',month:'long'})}</small></div>`).join('');
  for(let r=8;r<=22;r+=2)h+=`<div class="time-label">${fa(r)}:۰۰</div>`+ds.map(d=>`<div class="day-col">${tasks.filter(t=>t.date===dkey(d)&&row(t)===r).map(t=>`<div class="event ${cls[t.type]||''} ${t.done?'done':''}">${esc(t.title)}<small>${fa(t.time||'')}</small></div>`).join('')}</div>`).join('');
  $$('.week-calendar').forEach(e=>e.innerHTML=h);$('#todayDate').textContent=jal(new Date(),{day:'numeric',month:'long',year:'numeric'})}
function renderAll(){renderStats();renderDash();renderCalendar()}

const taskRow=t=>`<div class="simple-item"><label class="row-l"><input type="checkbox" data-check="${t.id}" ${t.done?'checked':''}><span><b class="${t.done?'strike':''}">${esc(t.title)}</b><br><small>${esc(t.type)} · ${fa(t.date)} · ${fa(t.time||'بدون ساعت')} · اولویت ${esc(t.priority)}</small></span></label><button class="x" data-del="${t.id}" aria-label="حذف">×</button></div>`;
const clk=()=>{const e=$('#clock');if(e)e.textContent=fa(String(Math.floor(tsec/60)).padStart(2,'0')+':'+String(tsec%60).padStart(2,'0'))};
function renderSecondary(p){
  const el=$('#secondaryPage');let c='';
  if(p==='settings'){
    const bg=localStorage.getItem('ty_bg')||'';
    el.innerHTML=`<h2>تنظیمات شخصی</h2><div class="setting-grid"><div><div class="setting-field"><label>نام نمایشی</label><input id="displayName" value="${esc(nm())}"></div><button class="btn primary" id="saveName">ذخیره</button> <button class="btn danger" id="resetAll">پاک‌کردن همهٔ داده‌ها</button><p class="empty">داده‌ها فقط در همین مرورگر ذخیره می‌شوند.</p></div><div><h3>پس‌زمینه</h3><div class="setting-grid">${[['bg-blue-cream.jpg','آبی و کرم'],['bg-grid.jpg','شبکه آبی'],['bg-warm.jpg','گرادیان گرم'],['mountain.jpg','کوهستان'],['','بدون تصویر']].map(([i,l])=>`<button class="theme-option ${bg===i?'selected':''}" data-bg="${i}">${i?`<img src="${i}" alt="">`:''}<span>${l}</span></button>`).join('')}</div></div></div>`;
    $$('[data-bg]').forEach(b=>b.onclick=()=>{localStorage.setItem('ty_bg',b.dataset.bg);applyBg();renderSecondary('settings')});
    $('#saveName').onclick=()=>{localStorage.setItem('ty_name',$('#displayName').value.trim()||'امیر');$('#topName').textContent=nm();head();alert('ذخیره شد.')};
    $('#resetAll').onclick=()=>{if(confirm('همهٔ کارها، درس‌ها و تنظیمات پاک شود؟')){['ty_tasks','ty_courses','ty_study'].forEach(k=>save(k,[]));['ty_bg','ty_name'].forEach(k=>localStorage.removeItem(k));location.reload()}};return}
  if(p==='tasks'||p==='exams'){
    const L=tasks.filter(t=>(p==='exams'?t.type==='امتحان':true)&&(!q||t.title.includes(q))).sort((a,b)=>a.done-b.done||a.date.localeCompare(b.date));
    c=`<button class="btn primary" id="secondaryAdd">＋ افزودن مورد جدید</button>${q?`<p class="empty">نتایج جستجو برای «${esc(q)}»</p>`:''}<div class="simple-list" style="margin-top:15px">${L.map(taskRow).join('')||'<p class="empty">موردی پیدا نشد.</p>'}</div>`}
  else if(p==='week')c=`<div class="wk-nav" style="margin-bottom:10px;justify-content:flex-end"><button data-wk="-1" aria-label="هفته قبل">›</button><button data-wk="1" aria-label="هفته بعد">‹</button></div><div class="week-calendar"></div>`;
  else if(p==='courses')c=`<form class="inline-form" id="courseForm"><input id="cName" placeholder="نام درس" required maxlength="40"><input id="cP" type="number" min="0" max="100" value="0" style="max-width:90px" aria-label="درصد پیشرفت"><button class="btn primary">افزودن درس</button></form><div class="simple-list">${courses.map((x,i)=>`<div class="simple-item"><b>${esc(x.name)}</b><input type="range" min="0" max="100" value="${x.p}" data-cp="${i}" aria-label="پیشرفت ${esc(x.name)}"><small>${fa(x.p)}٪</small><button class="x" data-cdel="${i}" aria-label="حذف">×</button></div>`).join('')||'<p class="empty">هنوز درسی نداری.</p>'}</div>`;
  else if(p==='study')c=`<div class="timer"><strong id="clock">۰۰:۰۰</strong><button class="btn primary" id="tStart">شروع / توقف</button><button class="btn" id="tStop">پایان و ثبت</button><p class="empty">فقط مطالعهٔ بالای ۱ دقیقه ثبت می‌شود. اتاق گروهی به سرور نیاز دارد و بعداً اضافه می‌شود.</p></div>`;
  else{const dn=tasks.filter(t=>t.done).length;c=`<div class="rep-grid"><div><strong>${fa(tasks.length?Math.round(dn/tasks.length*100):0)}٪</strong><span>نرخ انجام کارها</span></div><div><strong>${fa(tasks.length-dn)}</strong><span>کار باز</span></div><div><strong>${fa(study.reduce((a,s)=>a+s.min,0))}</strong><span>دقیقهٔ مطالعه</span></div></div><h3>پیشرفت دروس</h3><div class="bars">${bars()}</div>`}
  el.innerHTML=`<h2>${pageNames[p][0]}</h2>${c}`;
  $('#secondaryAdd')&&($('#secondaryAdd').onclick=()=>openModal(p==='exams'?'امتحان':'تکلیف'));
  if(p==='week')renderCalendar();
  if(p==='study'){clk();$('#tStart').onclick=()=>{if(timer){clearInterval(timer);timer=null}else timer=setInterval(()=>{tsec++;clk()},1e3)};$('#tStop').onclick=()=>{clearInterval(timer);timer=null;if(tsec>=60){study.push({t:Date.now(),min:Math.round(tsec/60)});save('ty_study',study);renderStats()}tsec=0;clk()}}
  if(p==='courses'){
    $('#courseForm').onsubmit=e=>{e.preventDefault();courses.push({name:$('#cName').value.trim(),p:Math.min(100,Math.max(0,+$('#cP').value||0))});save('ty_courses',courses);renderAll();renderSecondary('courses')};
    $$('[data-cp]').forEach(r=>r.oninput=()=>{courses[+r.dataset.cp].p=+r.value;r.nextElementSibling.textContent=fa(r.value)+'٪';save('ty_courses',courses);renderDash()});
    $$('[data-cdel]').forEach(b=>b.onclick=()=>{if(confirm('این درس حذف شود؟')){courses.splice(+b.dataset.cdel,1);save('ty_courses',courses);renderAll();renderSecondary('courses')}})}}

function head(){const h=new Date().getHours();$('#pageTitle').textContent=page==='dashboard'?`${h<5||h>=20?'شب بخیر':h<12?'صبح بخیر':'سلام'} ${nm()}! 👋`:pageNames[page][0];$('#pageSubtitle').textContent=pageNames[page][1];document.title=(page==='dashboard'?'':pageNames[page][0]+' | ')+'ترم‌یار'}
function show(p){if(!pageNames[p])p='dashboard';page=p;$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===p));head();const d=p==='dashboard';$('#dashboardView').classList.toggle('hidden',!d);$('#stats').classList.toggle('hidden',!d);$('#secondaryPage').classList.toggle('hidden',d);d?renderAll():renderSecondary(p);scrollTo(0,0)}
function go(p){if(location.hash.slice(1)!==p)location.hash=p;else show(p)}
function openModal(type='کار جدید'){$('#modalTitle').textContent=type==='کار جدید'?'افزودن کار جدید':`افزودن ${type}`;$('#taskType').value=['تکلیف','پروژه','امتحان','مطالعه'].includes(type)?type:'تکلیف';$('#taskDate').value=fa(today());$('#modal').classList.remove('hidden');$('#taskTitle').focus()}
function applyBg(){const bg=localStorage.getItem('ty_bg');document.body.style.setProperty('--bg-image',bg?`url('${bg}')`:'none')}

document.addEventListener('change',e=>{const c=e.target.closest('[data-check]');if(c){const t=tasks.find(x=>x.id==c.dataset.check);if(t){t.done=c.checked;persist()}}});
document.addEventListener('click',e=>{const d=e.target.closest('[data-del]');if(d&&confirm('این مورد حذف شود؟')){tasks=tasks.filter(x=>x.id!=d.dataset.del);persist()}const w=e.target.closest('[data-wk]');if(w){weekOff+=+w.dataset.wk;renderCalendar()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').classList.add('hidden')});
$$('.nav-item').forEach(b=>{b.onclick=()=>go(b.dataset.page);b.title=b.textContent.trim();b.querySelector('span').innerHTML=ico(ICONS[b.dataset.page])});
$('.bell').innerHTML=ico('M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0')+'<i></i>';$('.bell').onclick=()=>go('tasks');
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
$$('[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='room')return go('study');if(a==='course'){go('courses');setTimeout(()=>$('#cName')?.focus(),150);return}openModal(a==='exam'?'امتحان':a==='task'?'پروژه':'کار جدید')});
$('#newTask').onclick=()=>openModal();$('#closeModal').onclick=()=>$('#modal').classList.add('hidden');$('#modal').onclick=e=>{if(e.target===$('#modal'))$('#modal').classList.add('hidden')};
$('#taskForm').onsubmit=e=>{e.preventDefault();const d=normDate($('#taskDate').value);if(!d){alert('تاریخ را به شکل ۱۴۰۵/۰۸/۰۲ وارد کن.');return}tasks.unshift({id:Date.now(),title:$('#taskTitle').value.trim(),type:$('#taskType').value,time:$('#taskTime').value,date:d,done:false,priority:$('#taskPriority').value});persist();$('#modal').classList.add('hidden');$('#taskTitle').value=''};
$('#search').oninput=e=>{q=e.target.value.trim();if(q&&page!=='exams'&&page!=='tasks')go('tasks');else if(page==='tasks'||page==='exams')renderSecondary(page)};
onhashchange=()=>show(location.hash.slice(1));
applyBg();$('#topName').textContent=nm();show(location.hash.slice(1)||'dashboard');
