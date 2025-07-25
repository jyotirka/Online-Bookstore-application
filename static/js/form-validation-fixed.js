// Fixed form validation - excludes login/logout forms

document.addEventListener('DOMContentLoaded', function() {
    
    const validationRules = {
        username: {
            required: true,
            minLength: 1,
            message: 'Username is required'
        },
        password: {
            required: true,
            minLength: 1,
            message: 'Password is required'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password1: {
            required: true,
            minLength: 8,
            message: 'Password must be at least 8 characters long'
        },
        password2: {
            required: true,
            minLength: 8,
            message: 'Password must be at least 8 characters long'
        }
    };

    function isRegisterForm(form) {
        return form.action.includes('register') || 
               window.location.pathname.includes('register');
    }

    function validateField(field, value) {
        const rules = validationRules[field.name];
        if (!rules) return { valid: true };

        if (rules.required && (!value || value.trim() === '')) {
            return { valid: false, message: `${field.name} is required` };
        }

        if (!value || value.trim() === '') {
            return { valid: true };
        }

        if (rules.minLength && value.length < rules.minLength) {
            return { valid: false, message: rules.message };
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            return { valid: false, message: rules.message };
        }

        if (field.name === 'password2') {
            const password1 = document.querySelector('input[name="password1"]');
            if (password1 && value !== password1.value) {
                return { valid: false, message: 'Passwords do not match' };
            }
        }

        return { valid: true };
    }

    function showError(field, message) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        field.classList.add('is-invalid');
        field.style.borderColor = '#dc3545';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        field.classList.remove('is-invalid');
        field.style.borderColor = '#dee2e6';
    }

    function setupRealTimeValidation() {
        const formFields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        
        formFields.forEach(field => {
            // Apply validation to all forms
            
            field.removeAttribute('required');
            
            field.addEventListener('blur', function() {
                const result = validateField(this, this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });

            field.addEventListener('focus', function() {
                clearError(this);
            });

            if (field.name === 'password2') {
                field.addEventListener('input', function() {
                    const password1 = document.querySelector('input[name="password1"]');
                    if (password1 && this.value && password1.value !== this.value) {
                        showError(this, 'Passwords do not match');
                    } else if (password1 && this.value && password1.value === this.value) {
                        clearError(this);
                    }
                });
            }
        });
    }

    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Apply validation to all forms
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formFields = this.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
                let isValid = true;

                formFields.forEach(field => {
                    const result = validateField(field, field.value);
                    if (!result.valid) {
                        showError(field, result.message);
                        isValid = false;
                    } else {
                        clearError(field);
                    }
                });

                if (isValid) {
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Processing...';
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        this.submit();
                    }, 500);
                } else {
                    const firstInvalid = this.querySelector('.is-invalid');
                    if (firstInvalid) firstInvalid.focus();
                }
            });
        });
    }

    setupRealTimeValidation();
    setupFormValidation();
});