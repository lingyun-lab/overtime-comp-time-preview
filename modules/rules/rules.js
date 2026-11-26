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
document.addEventListener('DOMContentLoaded', renderShell);

/* ===== 当前模块交互逻辑：规则流程配置 ===== */
let rules=clone(OASeed.rules);
let editingRule=null;
const templates=['加班时长规则','调休时长规则','剩余调休时长计算规则','审批流程规则','消息触发规则'];
document.addEventListener('DOMContentLoaded', renderRules);
function renderRules(){
  const group=document.getElementById('qGroup').value, template=document.getElementById('qTemplate').value, name=document.getElementById('qName').value.trim(), status=document.getElementById('qStatus').value;
  const rows=rules.filter(r=>(!group||r.group===group)&&(!template||r.template===template)&&(!name||r.name.includes(name))&&(!status||r.status===status));
  renderTable('ruleTable', [
    {title:'规则编号',key:'id'}, {title:'规则分组',key:'group'}, {title:'规则模板',key:'template'}, {title:'规则名称',key:'name'}, {title:'适用对象',key:'object'}, {title:'适用范围',key:'scope'},
    {title:'核心参数',key:'params'}, {title:'引用页面',key:'ref'}, {title:'版本',key:'version'}, {title:'状态',render:r=>badge(r.status)},
    {title:'操作',render:r=>`<div class="actions"><button class="btn text" onclick="showRule('${r.id}')">详情</button><button class="btn text" onclick="openRuleForm('${r.id}')">编辑</button><button class="btn text" onclick="copyRule('${r.id}')">复制新版本</button><button class="btn text ${r.status==='停用'?'':'danger'}" onclick="toggleRule('${r.id}')">${r.status==='停用'?'启用':'停用'}</button></div>`}
  ], rows);
}
function resetRules(){ ['qGroup','qTemplate','qName','qStatus'].forEach(id=>document.getElementById(id).value=''); renderRules(); }
function openRuleForm(id=null){
  editingRule=id;
  const r=id?rules.find(x=>x.id===id):{id:'系统自动生成',group:'时长规则',template:'加班时长规则',name:'',object:'加班申请',scope:'全公司',params:'',ref:'',version:'V1',status:'草稿',effective:'2026-06-15',expire:'长期',priority:'10'};
  const body=`<form id="ruleForm" class="form-grid">
    ${field('规则编号','id',r.id,'text')}
    ${field('规则分组','group',r.group,'text',['时长规则','余额规则','审批流程规则','消息触发规则'],true)}
    ${field('规则模板','template',r.template,'text',templates,true)}
    ${field('规则名称','name',r.name,'text',null,true)}
    ${field('适用对象','object',r.object,'text',null,true)}
    ${field('适用范围','scope',r.scope,'text',null,true)}
    ${field('生效日期','effective',r.effective,'date',null,true)}
    ${field('失效日期','expire',r.expire,'text')}
    ${field('优先级','priority',r.priority,'number')}
    ${field('状态','status',r.status,'text',['草稿','启用','停用'],true)}
    <div class="full"><h3>参数配置区</h3><div id="ruleParamArea"></div></div>
    ${field('引用页面','ref',r.ref,'textarea')}
    <div class="full warn-note">已启用规则建议使用“复制新版本”后修改；保存并启用后，仅影响生效日期之后的新申请，历史记录不重新计算。</div>
  </form>`;
  openModal(id?'编辑规则':'新增规则', body, `<button class="btn" onclick="closeModal()">取消</button><button class="btn" onclick="saveRule('草稿')">保存草稿</button><button class="btn primary" onclick="saveRule('启用')">保存并启用</button>`, 980);
  document.querySelector('#ruleForm [name=id]').disabled=true;
  document.querySelector('#ruleForm [name=template]').onchange=()=>renderRuleParams();
  renderRuleParams(r.params);
}
function renderRuleParams(value=''){
  const t=document.querySelector('#ruleForm [name=template]').value;
  let html='';
  if(t==='加班时长规则') html=`<div class="form-grid"><div class="field"><label class="required">单次最大加班时长(h)</label><input name="pMax" type="number" value="8"></div><div class="field"><label class="required">最小申请单位(h)</label><input name="pUnit" type="number" value="1"></div><div class="field"><label>部门覆盖</label><select name="pDept"><option>允许</option><option>不允许</option></select></div><div class="field"><label>超上限处理</label><select name="pOver"><option>禁止提交</option><option>允许提交但提醒</option></select></div></div>`;
  if(t==='调休时长规则') html=`<div class="form-grid"><div class="field"><label>是否允许跨日</label><select name="pCross"><option>是</option><option>否</option></select></div><div class="field"><label>跨日拆分方式</label><select name="pSplit"><option>按日期拆分</option></select></div><div class="field"><label>调休明细必填</label><select name="pRequired"><option>是</option><option>否</option></select></div><div class="field"><label>最小申请单位(h)</label><input name="pUnit" type="number" value="1"></div></div>`;
  if(t==='剩余调休时长计算规则') html=`<div class="form-grid"><div class="field"><label>计算公式</label><input name="pFormula" value="历史剩余余额 + 年度加班时长 - 年度调休时长"></div><div class="field"><label>余额不足允许提交</label><select name="pAllow"><option>是</option><option>否</option></select></div><div class="field"><label>提交提醒</label><select name="pSubmitTip"><option>开启</option><option>关闭</option></select></div><div class="field"><label>审批提醒</label><select name="pApproveTip"><option>开启</option><option>关闭</option></select></div></div>`;
  if(t==='审批流程规则') html=`<div class="form-grid"><div class="field"><label>审批节点</label><select name="pNode"><option>直属主管</option></select></div><div class="field"><label>审批级数</label><select name="pLevel"><option>一级审批</option></select></div><div class="field"><label>适用时长范围</label><input name="pHourRange" value="全部时长"></div><div class="field"><label>超时提醒</label><select name="pTimeout"><option>不启用</option><option>24小时提醒</option></select></div></div>`;
  if(t==='消息触发规则') html=`<div class="form-grid"><div class="field"><label>触发节点</label><select name="pNode"><option>提交审批、审批通过、审批驳回、撤回</option></select></div><div class="field"><label>发送渠道</label><select name="pChannel"><option>钉钉、邮件、短信</option></select></div><div class="field"><label>失败重发次数</label><input name="pRetry" type="number" value="3"></div><div class="field"><label>消息模板来源</label><select name="pTpl"><option>消息管理模板</option></select></div></div>`;
  document.getElementById('ruleParamArea').innerHTML=html+`<div class="note" style="margin-top:10px">当前参数摘要：${h(value||'保存时系统按模板参数生成核心参数说明。')}</div>`;
}
function paramSummary(){
  const t=document.querySelector('#ruleForm [name=template]').value;
  if(t==='加班时长规则') return `默认最大${document.querySelector('[name=pMax]').value}h；最小单位${document.querySelector('[name=pUnit]').value}h；超上限${document.querySelector('[name=pOver]').value}`;
  if(t==='调休时长规则') return `${document.querySelector('[name=pCross]').value==='是'?'允许跨日':'不允许跨日'}；${document.querySelector('[name=pSplit]').value}；最小单位${document.querySelector('[name=pUnit]').value}h；调休明细必填`;
  if(t==='剩余调休时长计算规则') return `累计剩余调休余额=历史余额+年度加班-年度调休；余额不足${document.querySelector('[name=pAllow]').value==='是'?'允许提交':'禁止提交'}；提交提醒；审批提醒`;
  if(t==='审批流程规则') return `审批节点=${document.querySelector('[name=pNode]').value}；${document.querySelector('[name=pLevel]').value}`;
  return `审批通过/驳回/提交/撤回节点通知；失败重发${document.querySelector('[name=pRetry]').value}次`;
}
function saveRule(status){
  const d=formData('ruleForm'); d.status=status; d.params=paramSummary();
  if(!d.name||!d.object||!d.scope){ toast('请补全必填项。','error'); return; }
  if(editingRule){ d.id=editingRule; rules=rules.map(r=>r.id===editingRule?{...r,...d}:r); }
  else {d.id='R'+String(rules.length+1).padStart(3,'0'); rules.unshift(d);}
  closeModal(); renderRules(); toast(status==='启用'?'规则已保存并启用。':'规则草稿已保存。','success');
}
function showRule(id){
  const r=rules.find(x=>x.id===id);
  openModal('规则详情', detailGrid([
    ['规则编号',h(r.id)],['规则分组',h(r.group)],['规则模板',h(r.template)],['规则名称',h(r.name)],
    ['适用对象',h(r.object)],['适用范围',h(r.scope)],['核心参数',h(r.params)],['引用页面',h(r.ref)],
    ['版本',h(r.version)],['状态',badge(r.status)],['生效日期',h(r.effective)],['失效日期',h(r.expire)]
  ]), '', 920);
}
function copyRule(id){
  const r=rules.find(x=>x.id===id);
  const n=clone(r); n.id='R'+String(rules.length+1).padStart(3,'0'); n.version='V'+(parseInt(r.version.replace(/\D/g,''))+1); n.status='草稿'; n.name=r.name+'（复制）';
  rules.unshift(n); renderRules(); toast('已复制为新版本草稿，可继续编辑后启用。','success');
}
function toggleRule(id){
  const r=rules.find(x=>x.id===id);
  const next = r.status === '停用' ? '启用' : '停用';
  const msg = next === '停用' ? `确认停用规则【${h(r.name)}】？历史数据不重新计算，新申请不再引用该规则。` : `确认启用规则【${h(r.name)}】？启用后仅影响后续新提交申请，历史数据不重新计算。`;
  confirmAction(`${next}规则确认`, msg,()=>{r.status=next;renderRules();toast(`规则已${next}。`,'success');},`确认${next}`);
}
