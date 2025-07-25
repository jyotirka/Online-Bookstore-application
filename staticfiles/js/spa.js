// Single Page Application functionality - no page reloads

document.addEventListener('DOMContentLoaded', function() {
    
    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !link.download) {
            // Skip external links and special links
            if (link.href.startsWith(window.location.origin) && 
                !link.href.includes('logout') && 
                !link.href.includes('login') && 
                !link.href.includes('register') && 
                !link.href.includes('admin')) {
                e.preventDefault();
                loadPage(link.href);
            }
        }
    });

    // Intercept form submissions (except login/register)
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const isAuthForm = form.action.includes('login') || form.action.includes('register');
        
        if (!isAuthForm) {
            e.preventDefault();
            submitForm(form);
        }
    });

    // Load page content via AJAX
    function loadPage(url) {
        showLoading();
        
        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            updateContent(html);
            window.history.pushState({}, '', url);
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            hideLoading();
        });
    }

    // Submit form via AJAX
    function submitForm(form) {
        const formData = new FormData(form);
        showLoading();

        fetch(form.action || window.location.href, {
            method: form.method || 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            if (html.includes('alert-success')) {
                // Success - redirect or update content
                updateContent(html);
            } else {
                // Form has errors - update content
                updateContent(html);
            }
            hideLoading();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            hideLoading();
        });
    }

    // Update page content
    function updateContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update main content
        const newContent = doc.querySelector('.container').innerHTML;
        document.querySelector('.container').innerHTML = newContent;
        
        // Update navbar if authentication state changed
        const newNavbar = doc.querySelector('.navbar-nav');
        const currentNavbar = document.querySelector('.navbar-nav');
        if (newNavbar && currentNavbar) {
            currentNavbar.innerHTML = newNavbar.innerHTML;
        }
        
        // Update title
        const newTitle = doc.querySelector('title').textContent;
        document.title = newTitle;
        
        // Reinitialize scripts for new content
        reinitializeScripts();
    }

    // Reinitialize JavaScript for new content
    function reinitializeScripts() {
        // Reinitialize form validation
        if (window.setupRealTimeValidation) {
            setupRealTimeValidation();
            setupFormValidation();
        }
        
        // Reinitialize other scripts
        const event = new Event('contentLoaded');
        document.dispatchEvent(event);
    }

    // Show loading indicator
    function showLoading() {
        let loader = document.querySelector('.spa-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'spa-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            loader.querySelector('.spinner').style.cssText = `
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;
            document.body.appendChild(loader);
            
            // Add spinner animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        loader.style.display = 'flex';
    }

    // Hide loading indicator
    function hideLoading() {
        const loader = document.querySelector('.spa-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        loadPage(window.location.href);
    });

    // Add to cart without page reload
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href*="add_to_cart"]')) {
            e.preventDefault();
            const link = e.target.closest('a');
            
            fetch(link.href, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(data.message, 'success');
                } else {
                    showAlert(data.message, 'danger');
                }
            })
            .catch(error => {
                showAlert('Error adding to cart', 'danger');
            });
        }
    });

    // Show alert without page reload
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto dismiss
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
});