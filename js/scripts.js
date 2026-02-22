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
    const val = nameInput.value.trim();
    if(val && !isValidName(val)){
      showError('name', 'השם חייב להכיל לפחות 2 תווים');
    } else if(val) {
      hideError('name');
    }
  });
  
  phoneInput?.addEventListener('invalid', (e)=>{
    e.preventDefault();
    showError('phone', 'נא למלא מספר טלפון');
  });
  phoneInput?.addEventListener('input', ()=>{
    const val = phoneInput.value.trim();
    if(val && !isValidIsraeliPhone(val)){
      showError('phone', 'נא למלא מספר טלפון ישראלי תקין (נייד או קווי)');
    } else if(val){
      hideError('phone');
    }
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
  
  function isValidIsraeliPhone(phone){
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-()]/g, '');
    
    // Must start with 0 and be 9-10 digits
    if(!/^0\d{8,9}$/.test(cleaned)) return false;
    
    // Valid prefixes for mobile: 050, 051, 052, 053, 054, 055, 058
    // Valid prefixes for landline: 02, 03, 04, 08, 09, 072, 073, 076, 077, 078
    const validPrefixes = /^(05[012345678]|0[2-4]|08|09|07[23678])/;
    return validPrefixes.test(cleaned);
  }
  
  function isValidName(name){
    // At least 2 characters, can contain letters, spaces, and Hebrew characters
    const trimmed = name.trim();
    return trimmed.length >= 2;
  }
  
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    // Clear all errors
    hideError('name');
    hideError('phone');
    hideError('email');
    
    // Validate
    let isValid = true;
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    
    if(!name){
      showError('name', 'נא למלא שם מלא');
      isValid = false;
    } else if(!isValidName(name)){
      showError('name', 'השם חייב להכיל לפחות 2 תווים');
      isValid = false;
    }
    
    if(!phone){
      showError('phone', 'נא למלא מספר טלפון');
      isValid = false;
    } else if(!isValidIsraeliPhone(phone)){
      showError('phone', 'נא למלא מספר טלפון ישראלי תקין (נייד או קווי)');
      isValid = false;
    }
    
    if(email && !emailInput.validity.valid){
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
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          <h4>קיבלנו את הפרטים שלך!</h4>
          <p>תודה שפנית אלינו. נחזור אליך בהקדם האפשרי בטלפון או בווטסאפ.</p>
        `;
        contactForm.appendChild(successDiv);
        
        contactForm.reset();
        
        setTimeout(()=>{
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          successDiv.remove();
        }, 5000);
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
