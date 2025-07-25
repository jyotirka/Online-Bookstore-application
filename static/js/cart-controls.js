// Cart quantity controls

document.addEventListener('DOMContentLoaded', function() {
    
    // Handle remove button confirmation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-btn')) {
            e.preventDefault();
            const link = e.target.closest('.remove-btn');
            const bookTitle = link.dataset.bookTitle;
            
            if (confirm(`Are you sure you want to remove ${bookTitle} from your cart?`)) {
                window.location.href = link.href;
            }
            return;
        }
        
        if (e.target.classList.contains('quantity-btn')) {
            e.preventDefault();
            
            const button = e.target;
            const action = button.dataset.action;
            const bookId = button.dataset.bookId;
            const currentQty = parseInt(button.dataset.current);
            
            let newQty = currentQty;
            if (action === 'increase') {
                newQty = currentQty + 1;
            } else if (action === 'decrease') {
                newQty = currentQty - 1;
            }
            
            if (newQty !== currentQty) {
                updateQuantity(bookId, newQty, button);
            }
        }
    });
    
    function updateQuantity(bookId, quantity, button) {
        // Show loading state
        const originalText = button.textContent;
        button.textContent = '...';
        button.disabled = true;
        
        const action = button.dataset.action;
        
        if (action === 'increase') {
            // Check stock before adding
            const bookCard = button.closest('.card');
            const stockText = bookCard.querySelector('.card-text').textContent;
            const stockMatch = stockText.match(/Stock: (\d+)/);
            const availableStock = stockMatch ? parseInt(stockMatch[1]) : 999;
            
            if (quantity >= availableStock) {
                showAlert('Stock is now empty! Cannot add more items.', 'warning');
                button.textContent = originalText;
                button.disabled = false;
                return;
            }
            
            fetch(`/add-to-cart/${bookId}/`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                if (html.includes('Cannot add more')) {
                    showAlert('Stock is now empty! Cannot add more items.', 'warning');
                } else {
                    location.reload();
                }
            })
            .catch(error => {
                showAlert('Error updating cart', 'danger');
            })
            .finally(() => {
                button.textContent = originalText;
                button.disabled = false;
            });
        } else {
            // Decrease quantity
            decreaseQuantity(bookId, quantity, button, originalText);
        }
    }
    
    function decreaseQuantity(bookId, currentQty, button, originalText) {
        const formData = new FormData();
        formData.append('action', 'decrease');
        formData.append('csrfmiddlewaretoken', getCsrfToken());
        
        fetch(`/update-cart-quantity/${bookId}/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                showAlert('Error updating cart', 'danger');
            }
        })
        .catch(error => {
            showAlert('Error updating cart', 'danger');
        })
        .finally(() => {
            button.textContent = originalText;
            button.disabled = false;
        });
    }
    
    function updateCartDisplay(bookId, newQuantity, itemTotal, cartTotal, totalItems) {
        // Update quantity display
        const quantitySpan = document.querySelector(`[data-book-id="${bookId}"]`).parentNode.querySelector('span');
        quantitySpan.textContent = newQuantity;
        
        // Update data attributes
        const buttons = document.querySelectorAll(`[data-book-id="${bookId}"]`);
        buttons.forEach(btn => btn.dataset.current = newQuantity);
        
        // Update item total
        const itemCard = document.querySelector(`[data-book-id="${bookId}"]`).closest('.card');
        const totalElement = itemCard.querySelector('strong:last-of-type');
        if (totalElement) {
            totalElement.innerHTML = `Total: ₹${itemTotal}`;
        }
        
        // Update quantity text
        const quantityElement = itemCard.querySelector('strong:nth-of-type(2)');
        if (quantityElement) {
            quantityElement.innerHTML = `Quantity: ${newQuantity}`;
        }
        
        // Update cart summary
        const totalItemsElement = document.querySelector('.card-body p:first-child strong');
        if (totalItemsElement) {
            totalItemsElement.textContent = `Total Items: ${totalItems}`;
        }
        
        const totalPriceElement = document.querySelector('.card-body p:nth-child(2) strong');
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total Price: ₹${cartTotal}`;
        }
    }
    
    function getCsrfToken() {
        // Try multiple ways to get CSRF token
        let token = document.querySelector('[name=csrfmiddlewaretoken]');
        if (token) return token.value;
        
        // Try from meta tag
        token = document.querySelector('meta[name="csrf-token"]');
        if (token) return token.getAttribute('content');
        
        // Try from cookie
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') return value;
        }
        
        return '';
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }
});