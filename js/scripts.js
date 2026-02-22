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

// Contact Form - שליחה לווטסאפ
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    let whatsappMessage = `שלום, אני ${name}%0A`;
    whatsappMessage += `טלפון: ${phone}%0A`;
    if(email) whatsappMessage += `אימייל: ${email}%0A`;
    if(message) whatsappMessage += `%0Aפרטים:%0A${message}`;
    
    const whatsappUrl = `https://wa.me/972548640933?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  });
}
