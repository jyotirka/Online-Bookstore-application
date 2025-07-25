// Main JavaScript file for the online bookstore

document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded successfully!');
    
    // You can add your JavaScript functionality here
    // For example:
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const bookId = this.getAttribute('data-book-id');
                console.log(`Adding book ${bookId} to cart`);
                // Add AJAX functionality here if needed
            });
        });
    }
    
    // Form validation example
    const forms = document.querySelectorAll('form');
    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const requiredFields = form.querySelectorAll('[required]');
                let valid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        valid = false;
                        // Add validation styling
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (!valid) {
                    e.preventDefault();
                    console.log('Form validation failed');
                }
            });
        });
    }
});