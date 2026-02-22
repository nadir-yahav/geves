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
  
  // Hebrew validation messages
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  
  // Validate on blur and input
  nameInput?.addEventListener('invalid', (e)=>{
    e.preventDefault();
    showError('name', 'נא למלא שם מלא');
  });
  nameInput?.addEventListener('input', ()=>{
    if(nameInput.value.trim()) hideError('name');
  });
  
  phoneInput?.addEventListener('invalid', (e)=>{
    e.preventDefault();
    showError('phone', 'נא למלא מספר טלפון');
  });
  phoneInput?.addEventListener('input', ()=>{
    if(phoneInput.value.trim()) hideError('phone');
  });
  
  emailInput?.addEventListener('invalid', (e)=>{
    e.preventDefault();
    if(!emailInput.value) return; // Optional field
    showError('email', 'נא למלא כתובת אימייל תקינה');
  });
  emailInput?.addEventListener('input', ()=>{
    hideError('email');
  });
  
  function showError(fieldId, message){
    const field = document.getElementById(fieldId);
    const group = field?.closest('.form-group');
    if(!group) return;
    
    // Remove existing error
    const existingError = group.querySelector('.error-message');
    if(existingError) existingError.remove();
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    group.appendChild(errorDiv);
    field.classList.add('error');
  }
  
  function hideError(fieldId){
    const field = document.getElementById(fieldId);
    const group = field?.closest('.form-group');
    if(!group) return;
    
    const errorDiv = group.querySelector('.error-message');
    if(errorDiv) errorDiv.remove();
    field.classList.remove('error');
  }
  
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    // Clear all errors
    hideError('name');
    hideError('phone');
    hideError('email');
    
    // Validate
    let isValid = true;
    if(!nameInput.value.trim()){
      showError('name', 'נא למלא שם מלא');
      isValid = false;
    }
    if(!phoneInput.value.trim()){
      showError('phone', 'נא למלא מספר טלפון');
      isValid = false;
    }
    if(emailInput.value && !emailInput.validity.valid){
      showError('email', 'נא למלא כתובת אימייל תקינה');
      isValid = false;
    }
    
    if(!isValid) return;
    
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
