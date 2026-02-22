document.getElementById('year').textContent = new Date().getFullYear();

// Drawer: פתיחה/סגירה בלבד (לא נוגעים בעוגנים)
const toggle = document.getElementById('drawer-toggle');
const backdrop = document.getElementById('drawer-backdrop');
const closeBtn = document.getElementById('drawer-close');
const bodyEl = document.body;

function openDrawer(){ bodyEl.classList.add('menu-open'); }
function closeDrawer(){ if(toggle) toggle.checked = false; bodyEl.classList.remove('menu-open'); }

toggle?.addEventListener('change', ()=> toggle.checked ? openDrawer() : closeDrawer());
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', (e)=>{ if(e.target===backdrop) closeDrawer(); });

// סגירה אחרי בחירה בתפריט (בלי למנוע ניווט)
document.querySelectorAll('.drawer a[href^="#"]').forEach(a=>{
  a.addEventListener('click', ()=> setTimeout(closeDrawer, 120));
});
