// Complete JavaScript form validation

document.addEventListener('DOMContentLoaded', function() {
    
    // Validation rules
    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            required: true,
            minLength: 8,
            message: 'Password must be at least 8 characters long'
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

    // Validate single field
    function validateField(field, value) {
        const rules = validationRules[field.name];
        if (!rules) return { valid: true };

        // Required check
        if (rules.required && (!value || value.trim() === '')) {
            return { valid: false, message: `${field.name} is required` };
        }

        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            return { valid: true };
        }

        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            return { valid: false, message: rules.message };
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            return { valid: false, message: rules.message };
        }

        // Password confirmation check
        if (field.name === 'password2') {
            const password1 = document.querySelector('input[name="password1"]');
            if (password1 && value !== password1.value) {
                return { valid: false, message: 'Passwords do not match' };
            }
        }

        return { valid: true };
    }

    // Show error message
    function showError(field, message) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling
        field.classList.add('is-invalid');
        field.style.borderColor = '#dc3545';

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear error message
    function clearError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('is-invalid');
        field.style.borderColor = '#dee2e6';
    }

    // Real-time validation
    function setupRealTimeValidation() {
        const formFields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        
        formFields.forEach(field => {
            // Skip login form fields
            if (field.closest('form').action.includes('login')) {
                return;
            }
            
            // Remove HTML5 validation
            field.removeAttribute('required');
            
            // Validate on blur
            field.addEventListener('blur', function() {
                const result = validateField(this, this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });

            // Clear error on focus
            field.addEventListener('focus', function() {
                clearError(this);
            });

            // Real-time validation for password confirmation
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

    // Form submission validation
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Skip login form
            if (form.action.includes('login')) {
                return;
            }
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formFields = this.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
                let isValid = true;

                // Validate all fields
                formFields.forEach(field => {
                    const result = validateField(field, field.value);
                    if (!result.valid) {
                        showError(field, result.message);
                        isValid = false;
                    } else {
                        clearError(field);
                    }
                });

                // Submit if valid
                if (isValid) {
                    // Show loading state
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Processing...';
                    submitBtn.disabled = true;

                    // Submit form
                    setTimeout(() => {
                        this.submit();
                    }, 500);
                } else {
                    // Focus first invalid field
                    const firstInvalid = this.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });
        });
    }

    // Initialize validation
    setupRealTimeValidation();
    setupFormValidation();
});