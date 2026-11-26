const NAV_GROUPS = [
  {key:'supervisor-dashboard', title:'主管工作台', icon:'▦', href:'../supervisor-dashboard/supervisor-dashboard.html', direct:true},
  {key:'employee-dashboard', title:'员工工作台', icon:'▦', href:'../employee-dashboard/employee-dashboard.html', direct:true},
  {key:'applications', title:'加班调休申请', icon:'◷', href:'../applications/applications.html', direct:true},
  {title:'审批管理', icon:'☑', children:[
    {key:'todo', title:'我的待办', href:'../todo/todo.html'},
    {key:'approval-records', title:'审批记录查询', href:'../approval-records/approval-records.html'}
  ]},
  {key:'reports', title:'报表统计', icon:'▣', href:'../reports/reports.html', direct:true},
  {title:'系统管理', icon:'⚙', children:[
    {key:'employees', title:'员工信息管理', href:'../employees/employees.html'},
    {key:'roles', title:'角色权限配置', href:'../roles/roles.html'},
    {key:'departments', title:'部门管理', href:'../departments/departments.html'},
    {key:'rules', title:'规则流程配置', href:'../rules/rules.html'},
    {key:'messages', title:'消息管理', href:'../messages/messages.html'},
    {key:'logs', title:'操作日志管理', href:'../logs/logs.html'}
  ]}
];

const ROLE_NAV_KEYS = {
  '员工': new Set(['employee-dashboard','applications']),
  '主管': new Set(['supervisor-dashboard','applications','todo','approval-records','reports','employees','roles','departments','rules','messages','logs'])
};

function h(v){
  return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function clone(v){ return JSON.parse(JSON.stringify(v)); }
function getRegisteredUsers(){
  try {
    const list = JSON.parse(localStorage.getItem('oaRegisteredUsersV1') || '[]');
    return Array.isArray(list) ? list : [];
  } catch(e) {
    return [];
  }
}
function getDemoUsers(){
  const seedUsers = (window.OASeed && Array.isArray(window.OASeed.employees)) ? window.OASeed.employees : [];
  const registeredUsers = getRegisteredUsers();
  const fixedUsers = [
    {jobNo:'M001', name:'演示主管甲', phone:'138****0001', email:'m001@example.com', dept:'研发中心', post:'研发经理', supervisor:'总经理', role:'主管', status:'启用', remark:'主管账号'},
    {jobNo:'M002', name:'演示主管乙', phone:'138****0002', email:'m002@example.com', dept:'运营部', post:'运营主管', supervisor:'总经理', role:'主管', status:'启用', remark:'主管账号'},
    {jobNo:'E001', name:'演示员工甲', phone:'138****8901', email:'e001@example.com', dept:'产品部', post:'产品经理', supervisor:'演示主管甲', role:'员工', status:'启用', remark:'员工账号'},
    {jobNo:'E002', name:'演示员工乙', phone:'139****8902', email:'e002@example.com', dept:'研发一部', post:'前端工程师', supervisor:'演示主管甲', role:'员工', status:'启用', remark:'员工账号'},
    {jobNo:'E003', name:'演示员工丙', phone:'137****8903', email:'e003@example.com', dept:'研发二部', post:'后端工程师', supervisor:'演示主管丙', role:'员工', status:'启用', remark:'员工账号'}
  ];
  const map = new Map();
  [...fixedUsers, ...seedUsers, ...registeredUsers].forEach(u => {
    if(u && ['主管','员工'].includes(u.role) && u.status !== '停用' && !map.has(u.jobNo)) map.set(u.jobNo, u);
  });
  return Array.from(map.values());
}
function defaultUserForActive(){
  const active = document.body.dataset.active || '';
  const role = active === 'employee-dashboard' ? '员工' : '主管';
  return getDemoUsers().find(u => u.role === role) || getDemoUsers()[0];
}
function currentUser(){
  const users = getDemoUsers();
  let jobNo = sessionStorage.getItem('oaUserNo');
  let user = users.find(u => u.jobNo === jobNo);
  if(!user){
    user = defaultUserForActive();
    if(user) persistLoginUser(user);
  }
  return user || {jobNo:'M001', name:'演示主管甲', dept:'研发中心', post:'研发经理', role:'主管', status:'启用'};
}
function currentRole(){
  return currentUser().role || '主管';
}
function persistLoginUser(user){
  sessionStorage.setItem('oaUserNo', user.jobNo);
  sessionStorage.setItem('oaRole', user.role);
  sessionStorage.setItem('oaUserName', user.name);
  sessionStorage.setItem('oaUserDept', user.dept || '');
  sessionStorage.setItem('oaUserPost', user.post || '');
}
function navItemAllowed(key, role){
  const keys = ROLE_NAV_KEYS[role] || ROLE_NAV_KEYS['主管'];
  return keys.has(key);
}
function visibleNavGroups(role){
  return NAV_GROUPS.map(item => {
    if(item.direct){
      return navItemAllowed(item.key, role) ? item : null;
    }
    const children = (item.children || []).filter(c => navItemAllowed(c.key, role));
    return children.length ? {...item, children} : null;
  }).filter(Boolean);
}
function findNavItem(active, groups = NAV_GROUPS){
  for(const item of groups){
    if(item.direct && item.key === active) return {group:null,item};
    if(item.children){
      const child = item.children.find(c=>c.key===active);
      if(child) return {group:item,item:child};
    }
  }
  return {group:null,item:groups[0] || NAV_GROUPS[0]};
}
function roleHome(role){
  return role === '员工' ? '../employee-dashboard/employee-dashboard.html' : '../supervisor-dashboard/supervisor-dashboard.html';
}
function loginAsUser(jobNo){
  const user = getDemoUsers().find(u => u.jobNo === jobNo);
  if(!user){ toast('未找到该登录用户。','error'); return; }
  persistLoginUser(user);
  const target = roleHome(user.role);
  location.href = target;
}
function switchRole(role){
  const user = getDemoUsers().find(u => u.role === role);
  if(user) loginAsUser(user.jobNo);
}

function toggleAccountMenu(event){
  event?.stopPropagation?.();
  document.getElementById('accountDropdown')?.classList.toggle('open');
}
function closeAccountMenu(){
  document.getElementById('accountDropdown')?.classList.remove('open');
}
document.addEventListener('click', e => {
  if(!e.target.closest('.account-menu-wrap')) closeAccountMenu();
});
function openPasswordModal(){
  const body = `
    <div class="form-grid two">
      <div class="field"><label class="required">原密码</label><input type="password" id="oldPassword" placeholder="请输入原密码"></div>
      <div class="field"><label class="required">新密码</label><input type="password" id="newPassword" placeholder="请输入新密码"></div>
      <div class="field"><label class="required">确认新密码</label><input type="password" id="confirmPassword" placeholder="请再次输入新密码"></div>
    </div>
    <div class="note" style="margin-top:12px">密码修改后需重新登录。</div>`;
  openModal('修改密码', body, '<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitPasswordChange()">保存</button>', 560);
}
function submitPasswordChange(){
  const newPwd = document.getElementById('newPassword')?.value || '';
  const confirmPwd = document.getElementById('confirmPassword')?.value || '';
  if(!newPwd || !confirmPwd){ toast('请填写完整密码信息。','error'); return; }
  if(newPwd !== confirmPwd){ toast('两次输入的新密码不一致。','error'); return; }
  closeModal();
  toast('密码已更新，请重新登录。','success');
  setTimeout(logout, 700);
}

function openSwitchUserModal(){
  const users = getDemoUsers();
  const activeUser = currentUser();
  const body = `
    <div class="note" style="margin-bottom:12px">角色由登录用户决定，不在页面内单独切换角色。选择不同登录用户后，系统会进入该用户对应的工作台并刷新左侧可用菜单。</div>
    <div class="user-login-grid">
      ${users.map(u => `
        <button class="login-user-card ${u.jobNo===activeUser.jobNo?'active':''}" onclick="loginAsUser('${h(u.jobNo)}')">
          <div class="login-user-avatar">${h((u.name||'?').slice(0,1))}</div>
          <div class="login-user-main">
            <strong>${h(u.name)}</strong>
            <span>${h(u.role)}｜${h(u.dept)}｜${h(u.post || '-')}</span>
            <em>${h(u.jobNo)}｜${h(u.phone || '-')}</em>
          </div>
          <div class="login-user-tag">${h(u.role)}</div>
        </button>
      `).join('')}
    </div>`;
  openModal('切换登录用户', body, '<button class="btn" onclick="closeModal()">取消</button>', 780);
}
function renderShell(){
  const active = document.body.dataset.active || '';
  const user = currentUser();
  const role = user.role || '主管';
  if(active && !navItemAllowed(active, role)){
    location.replace(roleHome(role));
    return;
  }
  persistLoginUser(user);
  const groups = visibleNavGroups(role);
  const found = findNavItem(active, groups);
  const breadcrumbText = found.group ? `${found.group.title} / ${found.item.title}` : found.item.title;
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  if(sidebar){
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">勤</div>
        <div>
          <div class="brand-title">加班调休管理系统</div>
          <div class="brand-sub">V7.4-3</div>
        </div>
      </div>
      <nav class="nav">
        ${groups.map(item => {
          if(item.direct){
            return `<a class="nav-item nav-root ${item.key===active?'active':''}" href="${item.href}"><span>${item.icon}</span><span>${item.title}</span></a>`;
          }
          const isOpen = item.children.some(c=>c.key===active);
          return `<div class="nav-group ${isOpen?'':'collapsed'}">
            <div class="nav-group-title" onclick="this.parentElement.classList.toggle('collapsed')">
              <span>${item.icon}</span><span>${item.title}</span><span class="caret">›</span>
            </div>
            <div class="nav-children">
              ${item.children.map(c => `<a class="nav-item ${c.key===active?'active':''}" href="${c.href}">${c.title}</a>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </nav>`;
  }
  if(topbar){
    topbar.innerHTML = `
      <div class="breadcrumb">${h(breadcrumbText)}</div>
      <div class="top-actions">
        <button class="icon-btn" onclick="location.reload()" title="刷新">↻</button>
        <button class="icon-btn" onclick="toast('设置入口已打开。')" title="设置">⚙</button>
        <div class="account-menu-wrap">
          <button class="user-trigger" onclick="toggleAccountMenu(event)" title="账号菜单">
            <div class="avatar">${h((user.name||'?').slice(0,1))}</div>
            <div class="user-text"><div>${h(user.name)}</div><div>${h(user.dept || '-')}｜当前角色：${h(role)}</div></div>
          </button>
          <div class="account-dropdown" id="accountDropdown">
            <div class="account-summary">
              <div class="avatar large">${h((user.name||'?').slice(0,1))}</div>
              <div><strong>${h(user.name)}</strong><span>${h(user.dept || '-')}｜${h(user.post || '-')}｜${h(role)}</span></div>
            </div>
            <button class="account-menu-item" onclick="closeAccountMenu();openSwitchUserModal()"><span>↔</span>切换登录用户</button>
            <button class="account-menu-item" onclick="closeAccountMenu();openPasswordModal()"><span>🔑</span>修改密码</button>
            <div class="account-divider"></div>
            <button class="account-menu-item danger" onclick="closeAccountMenu();logout()"><span>↪</span>退出登录</button>
          </div>
        </div>
      </div>`;
  }
}

function badge(status){
  const s = String(status || '');
  let cls = 'gray';
  if(['待审批','发送中'].includes(s)) cls='blue';
  if(['已通过','启用','成功','通过','已发送'].includes(s)) cls='green';
  if(['已驳回','停用','失败','驳回','已停用'].includes(s)) cls='red';
  if(['草稿','余额不足提醒'].includes(s)) cls='orange';
  return `<span class="badge ${cls}">${h(s)}</span>`;
}
function renderTable(targetId, columns, rows, emptyText='暂无数据'){
  const target = document.getElementById(targetId);
  if(!target) return;
  window.__tablePager = window.__tablePager || {};
  const prev = window.__tablePager[targetId] || {};
  const perPage = Number(prev.perPage || 10);
  window.__tablePager[targetId] = {columns, rows: rows || [], emptyText, page: 1, perPage};
  renderTablePage(targetId);
}
function renderTablePage(targetId){
  const state = (window.__tablePager || {})[targetId];
  const target = document.getElementById(targetId);
  if(!state || !target) return;
  const columns = state.columns || [];
  const rows = state.rows || [];
  const total = rows.length;
  const perPage = Math.max(1, Number(state.perPage || 10));
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  state.page = Math.min(Math.max(1, Number(state.page || 1)), totalPages);
  const start = (state.page - 1) * perPage;
  const pageRows = rows.slice(start, start + perPage);
  const bodyHtml = pageRows.length ? pageRows.map((row,idx)=>`<tr>${columns.map(c=>{
    const val = typeof c.render === 'function' ? c.render(row,start+idx) : row[c.key];
    return `<td>${val == null ? '' : val}</td>`;
  }).join('')}</tr>`).join('') : `<tr><td colspan="${columns.length}" style="text-align:center;color:#667085;padding:34px">${h(state.emptyText || '暂无数据')}</td></tr>`;
  target.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr>${columns.map(c=>`<th>${h(c.title)}</th>`).join('')}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
    ${renderPagination(targetId,total,state.page,totalPages,perPage)}`;
}
function renderPagination(targetId,total,page,totalPages,perPage){
  const pages = [];
  for(let i=1;i<=Math.min(9,totalPages);i++) pages.push(i);
  if(totalPages>9 && !pages.includes(totalPages)) pages.push(totalPages);
  return `<div class="pagination">
    <div class="pagination-left">共 ${total} 条数据 第 ${page} / ${totalPages} 页</div>
    <div class="pagination-pages">
      <button class="btn small page-btn" ${page<=1?'disabled':''} onclick="changeTablePage('${targetId}',${page-1})">‹</button>
      ${pages.map((p,i)=> i>0 && p-pages[i-1]>1 ? `<span>…</span><button class="btn small page-btn ${p===page?'active':''}" onclick="changeTablePage('${targetId}',${p})">${p}</button>` : `<button class="btn small page-btn ${p===page?'active':''}" onclick="changeTablePage('${targetId}',${p})">${p}</button>`).join('')}
      <button class="btn small page-btn" ${page>=totalPages?'disabled':''} onclick="changeTablePage('${targetId}',${page+1})">›</button>
    </div>
    <div class="pagination-right">
      <select class="page-size" onchange="changeTableSize('${targetId}',this.value)"><option ${perPage===10?'selected':''}>10</option><option ${perPage===20?'selected':''}>20</option><option ${perPage===50?'selected':''}>50</option></select><span>条/页</span>
      <span>跳至</span><input class="page-jump" type="number" min="1" max="${totalPages}" value="${page}" onkeydown="if(event.key==='Enter') jumpTablePage('${targetId}',this.value)"><span>页</span>
      <button class="btn small" onclick="jumpTablePage('${targetId}',this.previousElementSibling.previousElementSibling.value)">确定</button>
    </div>
  </div>`;
}
function changeTablePage(targetId,page){
  const state=(window.__tablePager||{})[targetId]; if(!state) return;
  state.page=Number(page)||1; renderTablePage(targetId);
}
function changeTableSize(targetId,size){
  const state=(window.__tablePager||{})[targetId]; if(!state) return;
  state.perPage=Number(size)||10; state.page=1; renderTablePage(targetId);
}
function jumpTablePage(targetId,page){ changeTablePage(targetId,page); }

function toast(message,type='info'){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(8px)';},2600);
  setTimeout(()=>el.remove(),3200);
}
function openModal(title, body, footer='', width=720){
  closeModal();
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal" style="width:${width}px" onclick="event.stopPropagation()">
      <div class="modal-head"><div class="modal-title">${h(title)}</div><button class="modal-close" onclick="closeModal()">×</button></div>
      <div class="modal-body">${body}</div>
      <div class="modal-footer">${footer || `<button class="btn" onclick="closeModal()">关闭</button>`}</div>
    </div>`;
  mask.onclick = closeModal;
  document.body.appendChild(mask);
}
function closeModal(){
  const m = document.querySelector('.modal-mask');
  if(m) m.remove();
}
function confirmAction(title,message,onOk,okText='确认'){
  openModal(title, `<div class="warn-note">${message}</div>`, `
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" id="confirmOk">${okText}</button>
  `, 520);
  document.getElementById('confirmOk').onclick = () => { closeModal(); onOk && onOk(); };
}
function formData(id){
  const form = document.getElementById(id);
  const data = {};
  new FormData(form).forEach((v,k)=> data[k]=v);
  return data;
}
function field(label,name,value='',type='text',options=null,required=false){
  const labelClass = required ? 'required' : '';
  if(options){
    return `<div class="field"><label class="${labelClass}">${h(label)}</label><select name="${h(name)}">${options.map(o=>`<option value="${h(o)}" ${o===value?'selected':''}>${h(o)}</option>`).join('')}</select></div>`;
  }
  if(type==='textarea'){
    return `<div class="field full"><label class="${labelClass}">${h(label)}</label><textarea name="${h(name)}">${h(value)}</textarea></div>`;
  }
  const inputType = type === 'date' ? 'text' : type;
  const dateAttrs = type === 'date' ? ' class="date-input" placeholder="yyyy-mm-dd" pattern="\\d{4}-\\d{2}-\\d{2}"' : '';
  return `<div class="field"><label class="${labelClass}">${h(label)}</label><input name="${h(name)}" type="${h(inputType)}"${dateAttrs} value="${h(value)}"></div>`;
}
function detailGrid(items){
  return `<div class="detail-grid">${items.map(([k,v])=>`<div>${h(k)}</div><div>${v == null ? '' : v}</div>`).join('')}</div>`;
}
function parseDate(v){
  if(!v) return null;
  const m = String(v).match(/\d{4}-\d{2}-\d{2}/);
  return m ? new Date(m[0] + 'T00:00:00') : null;
}
function endOfDate(v){
  const d = parseDate(v);
  if(!d) return null;
  d.setHours(23,59,59,999);
  return d;
}
function dateRangeOverlap(rowStart,rowEnd,qStart,qEnd){
  const s = parseDate(rowStart), e = endOfDate(rowEnd || rowStart), qs = parseDate(qStart), qe = endOfDate(qEnd);
  if(qs && e && e < qs) return false;
  if(qe && s && s > qe) return false;
  return true;
}
function dateInRange(value,qStart,qEnd){
  const d = parseDate(value), qs = parseDate(qStart), qe = endOfDate(qEnd);
  if(qs && d && d < qs) return false;
  if(qe && d && d > qe) return false;
  return true;
}
function readRange(startId,endId){
  return {start:(document.getElementById(startId)||{}).value || '', end:(document.getElementById(endId)||{}).value || ''};
}
function cleanText(v){ return String(v || '').replace(/\s+/g,' ').trim(); }
function tableToAoA(table){
  const headers = Array.from(table.querySelectorAll('thead th')).map(th=>cleanText(th.textContent));
  const keep = headers.map((t,i)=>t === '操作' ? -1 : i).filter(i=>i>=0);
  const aoa = [keep.map(i=>headers[i])];
  Array.from(table.querySelectorAll('tbody tr')).forEach(tr=>{
    const cells = Array.from(tr.children);
    aoa.push(keep.map(i=>cleanText((cells[i]||{}).textContent)));
  });
  return aoa;
}
function xmlEscape(v){ return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[s])); }
function colName(n){ let s=''; while(n>=0){ s=String.fromCharCode(n%26+65)+s; n=Math.floor(n/26)-1; } return s; }
function sheetXml(aoa){
  const rows = aoa.map((row,r)=>`<row r="${r+1}">${row.map((v,c)=>{
    const ref = `${colName(c)}${r+1}`;
    const num = String(v).match(/^-?\d+(\.\d+)?$/);
    return num ? `<c r="${ref}"><v>${v}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(v)}</t></is></c>`;
  }).join('')}</row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows}</sheetData></worksheet>`;
}
const crcTable = (()=>{let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=((c&1)?(0xedb88320^(c>>>1)):(c>>>1));t[n]=c>>>0;}return t;})();
function crc32(bytes){ let c=0xffffffff; for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8); return (c^0xffffffff)>>>0; }
function u16(v){ return [v&255,(v>>>8)&255]; }
function u32(v){ return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]; }
function concatBytes(parts){ const len=parts.reduce((a,b)=>a+b.length,0), out=new Uint8Array(len); let o=0; parts.forEach(p=>{out.set(p,o);o+=p.length;}); return out; }
function zipStore(files){
  const enc = new TextEncoder(); let offset=0; const locals=[], centrals=[];
  files.forEach(f=>{
    const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc=crc32(data), size=data.length;
    const local = concatBytes([new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(name.length),...u16(0)]), name, data]);
    locals.push(local);
    const central = concatBytes([new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)]), name]);
    centrals.push(central); offset += local.length;
  });
  const cdSize=centrals.reduce((a,b)=>a+b.length,0), cdOffset=offset;
  const end = new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cdSize),...u32(cdOffset),...u16(0)]);
  return concatBytes([...locals,...centrals,end]);
}
function downloadXlsx(filename, sheetName, aoa){
  const safeSheet = (sheetName || 'Sheet1').slice(0,31).replace(/[\\/\?\*\[\]:]/g,'');
  const files = [
    {name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
    {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(safeSheet)}" sheetId="1" r:id="rId1"/></sheets></workbook>`},
    {name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:'xl/styles.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Microsoft YaHei"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>'},
    {name:'xl/worksheets/sheet1.xml',data:sheetXml(aoa)}
  ];
  const blob = new Blob([zipStore(files)], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 200);
}

function downloadXlsxWorkbook(filename, sheets){
  const safeSheets = sheets.map((s,idx)=>({
    name: (s.name || `Sheet${idx+1}`).slice(0,31).replace(/[\\/\?\*\[\]:]/g,'') || `Sheet${idx+1}`,
    aoa: s.aoa || [[]]
  }));
  const overrides = safeSheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('');
  const sheetDefs = safeSheets.map((s,i)=>`<sheet name="${xmlEscape(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('');
  const relDefs = safeSheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('') + `<Relationship Id="rId${safeSheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;
  const files = [
    {name:'[Content_Types].xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${overrides}</Types>`},
    {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheetDefs}</sheets></workbook>`},
    {name:'xl/_rels/workbook.xml.rels',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relDefs}</Relationships>`},
    {name:'xl/styles.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Microsoft YaHei"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>'}
  ];
  safeSheets.forEach((s,i)=>files.push({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s.aoa)}));
  const blob = new Blob([zipStore(files)], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 200);
}

function exportVisibleTable(scope){
  const table = document.querySelector('.card:not(:first-of-type) .table-wrap table') || document.querySelector('.table-wrap table');
  const aoa = table ? tableToAoA(table) : [['导出范围','导出时间'],[scope,new Date().toLocaleString()]];
  const ts = new Date().toISOString().slice(0,19).replace(/[-:T]/g,'');
  downloadXlsx(`${String(scope).replace(/[\\/:*?"<>|]/g,'_')}_${ts}.xlsx`, String(scope).slice(0,31), aoa);
}
function exportConfirm(scope){
  confirmAction('导出确认', `确认按当前筛选条件导出【${h(scope)}】数据？系统将生成 .xlsx 表格文件。`, () => { exportVisibleTable(scope); toast(`${scope}已导出为 .xlsx 文件。`, 'success'); }, '确认导出');
}
function matchText(row, keyword){
  if(!keyword) return true;
  return JSON.stringify(row).toLowerCase().includes(String(keyword).toLowerCase());
}
function renderBars(targetId, months, overtime, leave){
  const target = document.getElementById(targetId);
  if(!target) return;
  const max = Math.max(...overtime,...leave,1);
  const chartMax = Math.max(10, Math.ceil(max / 10) * 10);
  const ticks = [4,3,2,1,0].map(i => Math.round(chartMax * i / 4));
  target.innerHTML = `
    <div class="chart-unit">单位：h</div>
    <div class="bar-chart-with-axis">
      <div class="y-axis">${ticks.map(t=>`<div>${t}</div>`).join('')}</div>
      <div class="bar-chart">
        ${ticks.slice(1).map((_,i)=>`<span class="grid-line" style="bottom:${25*(i+1)}%"></span>`).join('')}
        ${months.map((m,i)=>`
          <div class="bar-group">
            <div class="bar" title="加班 ${overtime[i]}h" style="height:${Math.max(4,overtime[i]/chartMax*100)}%"></div>
            <div class="bar alt" title="调休 ${leave[i]}h" style="height:${Math.max(4,leave[i]/chartMax*100)}%"></div>
            <div class="bar-label">${m}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="legend"><span>加班时长</span><span class="alt">调休时长</span></div>`;
}



function approvalFlowRows(r){
  const approvals = Array.isArray(r && r.approval) ? r.approval : [];
  if(approvals.length){
    return approvals.map((a,i)=>({
      node: a.node || (i + 1),
      approver: a.approver || '-',
      role: a.role || a.approverRole || '直属主管',
      result: a.result || (r.status || '-'),
      opinion: a.opinion || '-',
      time: a.time || '-'
    }));
  }
  if(r && r.status === '待审批'){
    const emp = (OASeed.employees || []).find(e => e.jobNo === r.jobNo) || {};
    return [{node:1, approver: emp.supervisor || '直属主管', role:'直属主管', result:'待审批', opinion:'-', time:'-'}];
  }
  return [];
}
function approvalFlowTable(r, options={}){
  const rows = approvalFlowRows(r);
  const emptyText = r && r.status === '草稿' ? '草稿尚未提交，暂无审批流程记录。' : '当前申请尚未产生审批处理记录。';
  if(!rows.length) return `<h3>审批流程记录</h3><div class="note">${emptyText}</div>`;
  return `<h3>审批流程记录</h3><div class="table-wrap"><table class="mini-table"><thead><tr><th>节点</th><th>审批人</th><th>审批角色</th><th>审批结果</th><th>审批意见</th><th>处理时间</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${h(x.node)}</td><td>${h(x.approver)}</td><td>${h(x.role)}</td><td>${badge(x.result)}</td><td>${h(x.opinion)}</td><td>${h(x.time)}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ===== V7.4-3 七次调整：自定义日期选择组件 ===== */
(function(){
  let activeInput = null;
  let viewYear = 2026;
  let viewMonth = 0;
  const WEEK_LABELS = ['日','一','二','三','四','五','六'];
  function pad2(n){ return String(n).padStart(2,'0'); }
  function formatDateObj(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
  function parseIsoDate(v){
    const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if(d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
    return d;
  }
  function closeDatePicker(){
    const old = document.querySelector('.date-picker-popover');
    if(old) old.remove();
    activeInput = null;
  }
  function placePicker(pop, input){
    const rect = input.getBoundingClientRect();
    const width = 286;
    let left = Math.min(rect.left, window.innerWidth - width - 12);
    left = Math.max(12, left);
    let top = rect.bottom + 6;
    if(top + 330 > window.innerHeight) top = Math.max(12, rect.top - 330);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  function renderDatePicker(){
    const pop = document.querySelector('.date-picker-popover');
    if(!pop || !activeInput) return;
    const selected = parseIsoDate(activeInput.value);
    const first = new Date(viewYear, viewMonth, 1);
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const blanks = first.getDay();
    const cells = [];
    for(let i=0;i<blanks;i++) cells.push('<button class="dp-cell empty" type="button" tabindex="-1"></button>');
    for(let day=1;day<=days;day++){
      const d = new Date(viewYear, viewMonth, day);
      const val = formatDateObj(d);
      const isSelected = selected && formatDateObj(selected) === val;
      const today = formatDateObj(new Date()) === val;
      cells.push(`<button class="dp-cell ${isSelected?'selected':''} ${today?'today':''}" type="button" data-date="${val}">${day}</button>`);
    }
    pop.innerHTML = `
      <div class="dp-head">
        <button class="dp-nav" type="button" data-act="prev">‹</button>
        <div class="dp-title">${viewYear}年${pad2(viewMonth+1)}月</div>
        <button class="dp-nav" type="button" data-act="next">›</button>
      </div>
      <div class="dp-week">${WEEK_LABELS.map(w=>`<span>${w}</span>`).join('')}</div>
      <div class="dp-grid">${cells.join('')}</div>
      <div class="dp-foot">
        <button class="dp-link" type="button" data-act="clear">清空</button>
        <button class="dp-link" type="button" data-act="today">今天</button>
      </div>`;
    pop.querySelector('[data-act="prev"]').onclick = () => { viewMonth--; if(viewMonth < 0){ viewMonth = 11; viewYear--; } renderDatePicker(); };
    pop.querySelector('[data-act="next"]').onclick = () => { viewMonth++; if(viewMonth > 11){ viewMonth = 0; viewYear++; } renderDatePicker(); };
    pop.querySelector('[data-act="clear"]').onclick = () => { activeInput.value = ''; activeInput.dispatchEvent(new Event('change', {bubbles:true})); closeDatePicker(); };
    pop.querySelector('[data-act="today"]').onclick = () => { const d = new Date(); activeInput.value = formatDateObj(d); activeInput.dispatchEvent(new Event('change', {bubbles:true})); closeDatePicker(); };
    pop.querySelectorAll('[data-date]').forEach(btn => btn.onclick = () => { activeInput.value = btn.dataset.date; activeInput.dispatchEvent(new Event('change', {bubbles:true})); closeDatePicker(); });
  }
  function openDatePicker(input){
    closeDatePicker();
    activeInput = input;
    const base = parseIsoDate(input.value) || new Date(2026,0,1);
    viewYear = base.getFullYear();
    viewMonth = base.getMonth();
    const pop = document.createElement('div');
    pop.className = 'date-picker-popover';
    document.body.appendChild(pop);
    placePicker(pop, input);
    renderDatePicker();
  }
  function initDatePickers(){
    document.querySelectorAll('.date-input').forEach(input => {
      input.setAttribute('readonly','readonly');
      input.setAttribute('inputmode','none');
      input.setAttribute('autocomplete','off');
      input.placeholder = 'yyyy-mm-dd';
    });
  }
  document.addEventListener('focusin', e => {
    if(e.target && e.target.classList && e.target.classList.contains('date-input')){
      initDatePickers();
      openDatePicker(e.target);
    }
  });
  document.addEventListener('click', e => {
    if(e.target && e.target.classList && e.target.classList.contains('date-input')){
      e.preventDefault();
      initDatePickers();
      openDatePicker(e.target);
      return;
    }
    if(!e.target.closest || !e.target.closest('.date-picker-popover')) closeDatePicker();
  });
  window.addEventListener('scroll', closeDatePicker, true);
  window.addEventListener('resize', closeDatePicker);
  document.addEventListener('DOMContentLoaded', initDatePickers);
})();

function logout(){
  sessionStorage.removeItem('oaUserNo');
  sessionStorage.removeItem('oaRole');
  sessionStorage.removeItem('oaUserName');
  sessionStorage.removeItem('oaUserDept');
  sessionStorage.removeItem('oaUserPost');
  location.href = '../login/login.html';
}

function getRuleBasis(r){
  const raw = r.ruleBasis || r.ruleHit || '';
  if(raw) return String(raw);
  if(r.type === '调休申请') return 'R002 调休拆分规则：跨日调休按日期拆分；R003 余额提醒规则：余额不足允许提交并提示；R004 审批流程规则：直属主管一级审批';
  return 'R001 加班时长规则：单次最大加班8h；最小申请单位1h；R004 审批流程规则：直属主管一级审批';
}
function getRuleProcessResult(r){
  if(r.ruleProcessNote) return r.ruleProcessNote;
  const hours = Number(r.hours || 0);
  const detailCount = (r.details || []).length;
  if(r.type === '调休申请'){
    const balance = Number(r.balance || 0);
    const split = detailCount > 1 ? `已按日期拆分为${detailCount}条调休时间明细` : '已生成调休时间明细';
    const balanceText = hours > balance ? `当前剩余调休余额${balance}h，不足本次调休，审批时同步提示` : `当前剩余调休余额${balance}h，满足本次调休`;
    return `本次调休申请时长${hours}h，${split}；${balanceText}；已进入直属主管一级审批流程。`;
  }
  return `本次加班申请时长${hours}h，符合最小申请单位1h和单次最大加班8h规则；已进入直属主管一级审批流程。`;
}
function renderRuleProcessBlock(title,r,expanded=false){
  const open = expanded ? ' open' : '';
  return `<h3>${h(title)}</h3><div class="note rule-note"><div><strong>处理结果：</strong>${h(getRuleProcessResult(r))}</div><details${open}><summary>查看依据规则</summary><div class="rule-basis">${h(getRuleBasis(r))}</div></details></div>`;
}
function renderStatRuleBlock(r){
  const basis = getRuleBasis(r);
  return `<h3>统计规则说明</h3><div class="note rule-note"><div>该明细来源于已通过申请，并按加班/调休时间明细统计；跨日调休按日期拆分后参与统计。</div><details><summary>查看依据规则</summary><div class="rule-basis">${h(basis)}</div></details></div>`;
}

document.addEventListener('DOMContentLoaded', renderShell);

/* ===== 当前模块交互逻辑：报表统计 ===== */
let mainTab='summary';
let subTab='core';
document.addEventListener('DOMContentLoaded', renderReport);
function switchMain(tab){
  mainTab=tab; subTab = tab==='summary'?'core':'overtime';
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.main===tab));
  renderReport();
}
function switchSub(tab){ subTab=tab; renderReport(); }
function renderSubTabs(){
  const tabs = mainTab==='summary' ? [['core','汇总表'],['overtimeMonth','加班月度分布'],['leaveMonth','调休月度分布']] : [['overtime','加班申请明细'],['leave','调休申请明细']];
  document.getElementById('subTabs').innerHTML = tabs.map(t=>`<div class="secondary-tab ${subTab===t[0]?'active':''}" onclick="switchSub('${t[0]}')">${t[1]}</div>`).join('');
}
function renderReport(){
  renderSubTabs();
  const dept=document.getElementById('qDept').value.trim(), name=document.getElementById('qName').value.trim();
  const {start,end}=readRange('qStart','qEnd');
  if(mainTab==='summary' && subTab==='core'){
    let rows = clone(OASeed.reportSummary).filter(r=>(!dept||r.dept.includes(dept))&&(!name||r.name.includes(name)));
    if(start || end){
      const passed = clone(OASeed.applications).filter(a=>a.status==='已通过' && dateRangeOverlap(a.start,a.end,start,end));
      rows = rows.map(r=>{
        const own = passed.filter(a=>a.jobNo===r.jobNo);
        return {...r, overtime: own.filter(a=>a.type==='加班申请').reduce((sum,a)=>sum+a.hours,0), leave: own.filter(a=>a.type==='调休申请').reduce((sum,a)=>sum+a.hours,0)};
      });
    }
    renderTable('reportArea', [
      {title:'序号',key:'seq'}, {title:'员工工号',key:'jobNo'}, {title:'员工姓名',key:'name'}, {title:'所属部门',key:'dept'},
      {title:'年度加班时长(h)',key:'overtime'}, {title:'年度调休时长(h)',key:'leave'}, {title:'累计剩余调休余额(h)',key:'balance'},
      {title:'操作',render:r=>`<button class="btn text" onclick="showEmployeeSummaryDetail('${r.jobNo}')">详情</button>`}
    ], rows);
  } else if(mainTab==='summary' && (subTab==='overtimeMonth'||subTab==='leaveMonth')){
    const months=OASeed.monthly.months;
    const rows = clone(OASeed.reportSummary).filter(r=>(!dept||r.dept.includes(dept))&&(!name||r.name.includes(name))).map((r,idx)=>{
      const arr = months.map((_,i)=> Math.max(0, Math.round(((subTab==='overtimeMonth'?r.overtime:r.leave) * (i<6?[.07,.09,.15,.12,.2,.37][i]:0)))));
      const total = arr.reduce((a,b)=>a+b,0);
      return {...r, months:arr, total};
    });
    renderTable('reportArea', [
      {title:'员工工号',key:'jobNo'}, {title:'员工姓名',key:'name'}, {title:'所属部门',key:'dept'},
      ...months.map((m,i)=>({title:m,render:r=>r.months[i]})),
      {title:subTab==='overtimeMonth'?'年度加班合计(h)':'年度调休合计(h)',key:'total'}, {title:'备注',render:()=>subTab==='overtimeMonth'?'按已通过加班明细聚合':'按已通过调休时间明细聚合'}
    ], rows);
  } else {
    const base = clone(OASeed.applications).filter(a=>a.status==='已通过' && (subTab==='overtime'?a.type==='加班申请':a.type==='调休申请') && (!dept||a.dept.includes(dept)) && (!name||a.applicant.includes(name)) && dateRangeOverlap(a.start,a.end,start,end));
    if(subTab==='leave'){
      const rows = base.flatMap(a => (a.details || []).map((d,idx)=>({
        ...a,
        appId:a.id,
        detailNo:`${a.no}-${idx+1}`,
        detailDate:d.date,
        detailPeriod:d.period,
        detailStart:d.start,
        detailEnd:d.end,
        detailHours:d.hours,
        approvedAt:(a.approval && a.approval[0] && a.approval[0].time) || '-'
      })));
      renderTable('reportArea', [
        {title:'申请单号',key:'no'}, {title:'明细日期',key:'detailDate'}, {title:'申请人',key:'applicant'}, {title:'员工工号',key:'jobNo'}, {title:'所属部门',key:'dept'},
        {title:'开始时间',key:'detailStart'}, {title:'结束时间',key:'detailEnd'}, {title:'调休时长(h)',key:'detailHours'}, {title:'申请事由',key:'reason'}, {title:'审批通过时间',key:'approvedAt'},
        {title:'操作',render:r=>`<button class="btn text" onclick="showReportDetail('${r.appId}')">详情</button>`}
      ], rows);
    } else {
      renderTable('reportArea', [
        {title:'申请单号',key:'no'}, {title:'申请类型',key:'type'}, {title:'申请人',key:'applicant'}, {title:'员工工号',key:'jobNo'}, {title:'所属部门',key:'dept'},
        {title:'申请时间段',key:'period'}, {title:'申请时长(h)',key:'hours'}, {title:'申请事由',key:'reason'}, {title:'提交时间',key:'submittedAt'},
        {title:'操作',render:r=>`<button class="btn text" onclick="showReportDetail('${r.id}')">详情</button>`}
      ], base);
    }
  }
}

function getReportFilters(){
  return {
    dept:(document.getElementById('qDept')||{}).value?.trim() || '',
    name:(document.getElementById('qName')||{}).value?.trim() || '',
    ...readRange('qStart','qEnd')
  };
}
function filteredSummaryRows(){
  const {dept,name,start,end} = getReportFilters();
  let rows = clone(OASeed.reportSummary).filter(r=>(!dept||r.dept.includes(dept))&&(!name||r.name.includes(name)));
  if(start || end){
    const passed = clone(OASeed.applications).filter(a=>a.status==='已通过' && dateRangeOverlap(a.start,a.end,start,end));
    rows = rows.map(r=>{
      const own = passed.filter(a=>a.jobNo===r.jobNo);
      return {...r, overtime: own.filter(a=>a.type==='加班申请').reduce((sum,a)=>sum+a.hours,0), leave: own.filter(a=>a.type==='调休申请').reduce((sum,a)=>sum+a.hours,0)};
    });
  }
  return rows;
}
function filteredApprovedApplications(type){
  const {dept,name,start,end} = getReportFilters();
  return clone(OASeed.applications).filter(a=>a.status==='已通过' && (!type||a.type===type) && (!dept||a.dept.includes(dept)) && (!name||a.applicant.includes(name)) && dateRangeOverlap(a.start,a.end,start,end));
}
function aoaCore(){
  return [['序号','员工工号','员工姓名','所属部门','年度加班时长(h)','年度调休时长(h)','累计剩余调休余额(h)'], ...filteredSummaryRows().map((r,i)=>[i+1,r.jobNo,r.name,r.dept,r.overtime,r.leave,r.balance])];
}
function monthlyRows(kind){
  const months=OASeed.monthly.months;
  return filteredSummaryRows().map(r=>{
    const arr = months.map((_,i)=> Math.max(0, Math.round(((kind==='overtime'?r.overtime:r.leave) * (i<6?[.07,.09,.15,.12,.2,.37][i]:0)))));
    const total = arr.reduce((a,b)=>a+b,0);
    return {r, arr, total};
  });
}
function aoaMonth(kind){
  const months=OASeed.monthly.months;
  const title = kind==='overtime' ? '年度加班合计(h)' : '年度调休合计(h)';
  const remark = kind==='overtime' ? '按已通过加班明细聚合' : '按已通过调休时间明细聚合';
  return [['员工工号','员工姓名','所属部门',...months,title,'备注'], ...monthlyRows(kind).map(x=>[x.r.jobNo,x.r.name,x.r.dept,...x.arr,x.total,remark])];
}
function aoaOvertimeDetails(){
  return [['申请单号','申请类型','申请人','员工工号','所属部门','申请时间段','申请时长(h)','申请事由','提交时间'], ...filteredApprovedApplications('加班申请').map(a=>[a.no,a.type,a.applicant,a.jobNo,a.dept,a.period,a.hours,a.reason,a.submittedAt])];
}
function aoaLeaveDetails(){
  const rows = filteredApprovedApplications('调休申请').flatMap(a => (a.details || []).map(d=>[a.no,d.date,a.applicant,a.jobNo,a.dept,d.start,d.end,d.hours,a.reason,(a.approval && a.approval[0] && a.approval[0].time) || '-']));
  return [['申请单号','明细日期','申请人','员工工号','所属部门','开始时间','结束时间','调休时长(h)','申请事由','审批通过时间'], ...rows];
}
function exportReportWorkbook(){
  const ts = new Date().toISOString().slice(0,19).replace(/[-:T]/g,'');
  if(mainTab === 'summary'){
    downloadXlsxWorkbook(`汇总统计报表_${ts}.xlsx`, [
      {name:'汇总表', aoa:aoaCore()},
      {name:'加班月度分布', aoa:aoaMonth('overtime')},
      {name:'调休月度分布', aoa:aoaMonth('leave')}
    ]);
    toast('已导出汇总统计工作簿，包含汇总表、加班月度分布、调休月度分布。','success');
  }else{
    downloadXlsxWorkbook(`明细记录报表_${ts}.xlsx`, [
      {name:'加班申请明细', aoa:aoaOvertimeDetails()},
      {name:'调休申请明细', aoa:aoaLeaveDetails()}
    ]);
    toast('已导出明细记录工作簿，包含加班申请明细、调休申请明细。','success');
  }
}

function resetReport(){ ['qDept','qName','qStart','qEnd'].forEach(id=>document.getElementById(id).value=''); renderReport(); }
function exportCurrentReport(){
  const scope = mainTab==='summary' ? '汇总统计工作簿（3个Sheet：汇总表、加班月度分布、调休月度分布）' : '明细记录工作簿（2个Sheet：加班申请明细、调休申请明细）';
  confirmAction('导出确认', `确认按当前筛选条件导出【${h(scope)}】？`, () => exportReportWorkbook(), '确认导出');
}
function buildMonthlyByTotal(total, type){
  const weights = type === 'leave' ? [0,0.12,0.25,0,0.5,0.38,0,0,0,0,0,0] : [0.08,0.12,0.22,0.18,0.28,0.34,0,0,0,0,0,0];
  const maxWeight = weights.reduce((a,b)=>a+b,0) || 1;
  let arr = weights.map(w => Math.round(total * w / maxWeight));
  let diff = total - arr.reduce((a,b)=>a+b,0);
  for(let i=0; diff!==0 && i<arr.length*3; i++){
    const idx = i % arr.length;
    if(weights[idx] > 0){ arr[idx] += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; }
  }
  return arr.map(v => Math.max(0,v));
}
function showEmployeeSummaryDetail(jobNo){
  const r = OASeed.reportSummary.find(x=>x.jobNo===jobNo);
  if(!r){ toast('未找到该员工汇总数据。','error'); return; }
  const emp = (OASeed.employees || []).find(x=>x.jobNo===jobNo) || {};
  const overtimeMonths = buildMonthlyByTotal(Number(r.overtime || 0), 'overtime');
  const leaveMonths = buildMonthlyByTotal(Number(r.leave || 0), 'leave');
  const body = `
    <div class="summary-detail-meta">
      <div><span>员工：</span>${h(r.name)}（${h(r.jobNo)}）</div>
      <div><span>所属部门 / 岗位：</span>${h(r.dept)} / ${h(emp.post || '-')}</div>
      <div><span>直属主管：</span>${h(emp.supervisor || '-')}</div>
      <div><span>统计规则：</span>仅统计已通过申请</div>
    </div>
    <div class="summary-detail-grid">
      <div class="summary-detail-item"><span>年度加班时长</span><strong>${h(r.overtime)}h</strong></div>
      <div class="summary-detail-item"><span>年度调休时长</span><strong>${h(r.leave)}h</strong></div>
      <div class="summary-detail-item"><span>累计剩余调休余额</span><strong>${h(r.balance)}h</strong></div>
      <div class="summary-detail-item"><span>余额计算规则</span><strong>历史余额 + 加班 - 调休</strong></div>
    </div>
    <div id="employeeSummaryChart" class="chart"></div>
    <div class="note" style="margin-top:12px">汇总表用于查看员工维度汇总结果；加班月度分布、调休月度分布仍在二级页签中独立查看。</div>`;
  openModal('员工汇总详情', body, '', 900);
  renderBars('employeeSummaryChart', OASeed.monthly.months, overtimeMonths, leaveMonths);
}
function showReportDetail(id){
  const r=OASeed.applications.find(x=>x.id===id);
  const details = `<h3>加班/调休时间明细</h3><div class="table-wrap"><table class="mini-table"><thead><tr><th>明细日期</th><th>加班/调休时段</th><th>开始时间</th><th>结束时间</th><th>明细时长(h)</th></tr></thead><tbody>${r.details.map(d=>`<tr><td>${h(d.date)}</td><td>${h(d.period)}</td><td>${h(d.start)}</td><td>${h(d.end)}</td><td>${h(d.hours)}</td></tr>`).join('')}</tbody></table></div>`;
  openModal(`报表明细详情（${r.type}）`, detailGrid([
    ['申请单号',h(r.no)],['申请类型',h(r.type)],['申请人',h(r.applicant)],['所属部门',h(r.dept)],
    ['申请时间段',h(r.period)],['申请时长(h)',h(r.hours)],['申请状态',badge(r.status)],['申请事由',h(r.reason)],
    ['提交时间',h(r.submittedAt)],['备注',h(r.remark||'-')]
  ]) + details + renderStatRuleBlock(r) + approvalFlowTable(r), '', 980);
}
