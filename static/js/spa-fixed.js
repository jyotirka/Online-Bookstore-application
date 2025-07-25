// Fixed SPA - excludes auth forms and handles authentication properly

document.addEventListener('DOMContentLoaded', function() {
    
    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !link.download) {
            if (link.href.startsWith(window.location.origin) && !link.href.includes('admin/')) {
                e.preventDefault();
                loadPage(link.href);
            }
        }
    });

    // Intercept all form submissions
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        submitForm(form);
    });

    function loadPage(url) {
        showLoading();
        
        fetch(url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => response.text())
        .then(html => {
            updateContent(html);
            window.history.pushState({ url: url }, '', url);
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            window.location.href = url; // Fallback
            hideLoading();
        });
    }

    function submitForm(form) {
        const formData = new FormData(form);
        showLoading();

        fetch(form.action || window.location.href, {
            method: form.method || 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => response.text())
        .then(html => {
            // Check if login was successful (redirect to home)
            if (form.action.includes('login') && html.includes('Welcome')) {
                window.location.href = '/';
            } else {
                updateContent(html);
            }
            hideLoading();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            form.submit(); // Fallback
            hideLoading();
        });
    }

    function updateContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update main content
        const newContent = doc.querySelector('.container').innerHTML;
        document.querySelector('.container').innerHTML = newContent;
        
        // Update navbar for auth state changes
        const newNavbar = doc.querySelector('.navbar-nav');
        const currentNavbar = document.querySelector('.navbar-nav');
        if (newNavbar && currentNavbar) {
            currentNavbar.innerHTML = newNavbar.innerHTML;
        }
        
        // Update title
        const newTitle = doc.querySelector('title').textContent;
        document.title = newTitle;
        
        // Reinitialize scripts
        const event = new Event('contentLoaded');
        document.dispatchEvent(event);
    }

    function showLoading() {
        let loader = document.querySelector('.spa-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'spa-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            loader.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(255,255,255,0.8); display: flex;
                justify-content: center; align-items: center; z-index: 9999;
            `;
            loader.querySelector('.spinner').style.cssText = `
                width: 40px; height: 40px; border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db; border-radius: 50%;
                animation: spin 1s linear infinite;
            `;
            document.body.appendChild(loader);
            
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

    function hideLoading() {
        const loader = document.querySelector('.spa-loader');
        if (loader) loader.style.display = 'none';
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        loadPage(window.location.href);
    });
    
    // Push initial state
    window.history.replaceState({}, document.title, window.location.href);
});