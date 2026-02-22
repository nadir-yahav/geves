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

// Contact Form - שליחה למייל דרך EmailJS
const contactForm = document.getElementById('contactForm');
if(contactForm){
  // Initialize EmailJS with your public key
  emailjs.init('ccYmTTZEOc7oOHa56');
  
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> שולח...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS
    emailjs.sendForm('service_m9i4jfb', 'template_zxccyt6', contactForm)
      .then(function() {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> נשלח בהצלחה!';
        submitBtn.style.background = '#10b981';
        contactForm.reset();
        
        setTimeout(()=>{
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, function(error) {
        console.error('Failed to send email:', error);
        submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> שגיאה, נסה שוב';
        submitBtn.style.background = '#ef4444';
        
        setTimeout(()=>{
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}
