const ROLE_HOME = {'主管':'../supervisor-dashboard/supervisor-dashboard.html','员工':'../employee-dashboard/employee-dashboard.html'};
const REGISTERED_USERS_KEY = 'oaRegisteredUsersV1';
let selectedRole = '主管';

function readRegisteredUsers(){
  try {
    const list = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch(e) {
    return [];
  }
}
function saveRegisteredUsers(list){
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(Array.isArray(list) ? list : []));
}
function users(){
  const seed = window.OASeed?.employees || [];
  const registered = readRegisteredUsers();
  const map = new Map();
  [...seed, ...registered].forEach(u => {
    if(u && ['主管','员工'].includes(u.role) && u.status !== '停用' && !map.has(u.jobNo)) map.set(u.jobNo, u);
  });
  return Array.from(map.values());
}
function selectRole(role){
  selectedRole = role;
  document.querySelectorAll('.role-card').forEach(el => el.classList.toggle('active', el.dataset.role === role));
  renderUserSelect();
}
function renderUserSelect(){
  const list = users().filter(u => u.role === selectedRole);
  const sel = document.getElementById('loginUser');
  if(sel){
    sel.innerHTML = list.map(u => `<option value="${u.jobNo}">${u.name} - ${u.dept || '-'} / ${u.post || '-'}</option>`).join('');
  }
  const demo = document.getElementById('demoUsers');
  if(demo){
    demo.innerHTML = `<strong>当前可选${selectedRole}用户：</strong><br>` + (list.length ? list.map(u => `${u.jobNo}｜${u.name}｜${u.dept || '-'}｜${u.post || '-'}`).join('<br>') : '暂无可选用户');
  }
}
function doLogin(){
  const jobNo = document.getElementById('loginUser').value;
  const user = users().find(u => u.jobNo === jobNo);
  if(!user){ alert('请选择登录用户。'); return; }
  sessionStorage.setItem('oaUserNo', user.jobNo);
  sessionStorage.setItem('oaRole', user.role);
  sessionStorage.setItem('oaUserName', user.name);
  sessionStorage.setItem('oaUserDept', user.dept || '');
  sessionStorage.setItem('oaUserPost', user.post || '');
  location.href = ROLE_HOME[user.role];
}
document.addEventListener('DOMContentLoaded', () => selectRole('主管'));

function scrollToLogin(){
  document.getElementById('loginSection')?.scrollIntoView({behavior:'smooth'});
}
function openRegisterModal(){
  closeRegisterModal();
  const mask = document.createElement('div');
  mask.className = 'register-mask';
  mask.innerHTML = `
    <div class="register-modal" onclick="event.stopPropagation()">
      <div class="register-head"><strong>账号注册</strong><button class="register-close" onclick="closeRegisterModal()">×</button></div>
      <div class="register-body">
        <div class="register-field"><label>姓名</label><input id="regName" placeholder="请输入姓名"></div>
        <div class="register-field"><label>手机号</label><input id="regPhone" placeholder="请输入手机号"></div>
        <div class="register-field"><label>邮箱</label><input id="regEmail" placeholder="请输入邮箱"></div>
        <div class="register-field"><label>注册角色</label><select id="regRole"><option>员工</option><option>主管</option></select></div>
        <div class="login-tip" style="margin:0;text-align:left">填写注册信息后即可完成注册，账号默认启用。</div>
      </div>
      <div class="register-footer"><button class="register-btn" onclick="closeRegisterModal()">取消</button><button class="register-btn primary" onclick="submitRegisterDemo()">提交注册</button></div>
    </div>`;
  mask.onclick = closeRegisterModal;
  document.body.appendChild(mask);
}
function closeRegisterModal(){
  document.querySelector('.register-mask')?.remove();
}
function nextJobNo(role){
  const prefix = role === '主管' ? 'M' : 'E';
  const nums = users()
    .filter(u => String(u.jobNo || '').startsWith(prefix))
    .map(u => Number(String(u.jobNo).replace(prefix,'')))
    .filter(n => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return prefix + String(next).padStart(3, '0');
}
function submitRegisterDemo(){
  const name = (document.getElementById('regName')?.value || '').trim();
  const phone = (document.getElementById('regPhone')?.value || '').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();
  const role = document.getElementById('regRole')?.value || '员工';
  if(!name){ alert('请输入姓名。'); return; }
  if(!/^1[3-9]\d{9}$/.test(phone)){ alert('请输入 11 位有效手机号。'); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ alert('请输入有效邮箱地址。'); return; }
  const allUsers = users();
  if(allUsers.some(u => u.phone === phone)){ alert('该手机号已注册。'); return; }
  if(allUsers.some(u => String(u.email || '').toLowerCase() === email.toLowerCase())){ alert('该邮箱已注册。'); return; }
  const user = {
    jobNo: nextJobNo(role),
    name,
    phone,
    email,
    dept: '未分配',
    post: role === '主管' ? '主管' : '员工',
    supervisor: '-',
    role,
    status: '启用',
    remark: '注册生成账号'
  };
  const registered = readRegisteredUsers();
  registered.push(user);
  saveRegisteredUsers(registered);
  closeRegisterModal();
  selectedRole = role;
  selectRole(role);
  const sel = document.getElementById('loginUser');
  if(sel) sel.value = user.jobNo;
  alert('注册成功，可使用该账号登录系统。');
}

function openHelpModal(){
  closeRegisterModal();
  const mask = document.createElement('div');
  mask.className = 'register-mask';
  mask.innerHTML = `
    <div class="register-modal" onclick="event.stopPropagation()">
      <div class="register-head"><strong>帮助说明</strong><button class="register-close" onclick="closeRegisterModal()">×</button></div>
      <div class="register-body">
        <div class="login-tip" style="margin:0;text-align:left;line-height:1.8;color:#475569">
          系统支持员工提交加班、调休申请，主管进行审批处理，并提供调休余额核算、报表统计、规则配置和操作日志追溯能力。<br>
          登录用户由员工信息管理维护，系统按账号角色展示对应菜单与功能范围。
        </div>
      </div>
      <div class="register-footer"><button class="register-btn primary" onclick="closeRegisterModal()">知道了</button></div>
    </div>`;
  mask.onclick = closeRegisterModal;
  document.body.appendChild(mask);
}
