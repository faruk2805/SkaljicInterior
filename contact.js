document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('yyycontactForm');
    const formStatus = document.querySelector('.yyyform-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Šaljem...';
            submitBtn.disabled = true;
            
            // Execute reCAPTCHA
            grecaptcha.ready(function() {
                grecaptcha.execute('TUJ_SITE_KEY', {action: 'submit'}).then(function(token) {
                    document.getElementById('g-recaptcha-response').value = token;
                    
                    // Submit form via AJAX
                    const formData = new FormData(contactForm);
                    
                    fetch(contactForm.action, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        formStatus.textContent = data.message;
                        formStatus.style.display = 'block';
                        
                        if (data.status === 'success') {
                            formStatus.style.color = '#4CAF50';
                            contactForm.reset();
                        } else {
                            formStatus.style.color = '#F44336';
                        }
                    })
                    .catch(error => {
                        formStatus.textContent = 'Došlo je do greške. Molimo pokušajte ponovo.';
                        formStatus.style.color = '#F44336';
                        formStatus.style.display = 'block';
                    })
                    .finally(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        
                        // Hide status message after 5 seconds
                        setTimeout(() => {
                            formStatus.style.display = 'none';
                        }, 5000);
                    });
                });
            });
        });
    }
});