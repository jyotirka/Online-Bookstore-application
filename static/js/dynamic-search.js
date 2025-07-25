// Dynamic search functionality

document.addEventListener('DOMContentLoaded', function() {
    
    const searchInput = document.querySelector('input[name="search"]');
    const searchForm = searchInput ? searchInput.closest('form') : null;
    let searchTimeout;

    if (searchInput) {
        // Real-time search on typing
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300); // Wait 300ms after user stops typing
        });

        // Search on form submit
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                performSearch(query);
            });
        }
    }

    function performSearch(query) {
        const url = new URL(window.location.origin + '/');
        if (query && query.length > 0) {
            url.searchParams.set('search', query);
        }

        // Show loading state
        showSearchLoading();

        fetch(url.toString(), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            updateSearchResults(html);
            hideSearchLoading();
            
            // Update URL without reload
            window.history.pushState({}, '', url.toString());
        })
        .catch(error => {
            console.error('Search error:', error);
            hideSearchLoading();
        });
    }

    function updateSearchResults(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update book results section
        const newResults = doc.querySelector('.row:has(.book-card), .row:has(.col-md-4)');
        const currentResults = document.querySelector('.row:has(.book-card), .row:has(.col-md-4)');
        
        if (!newResults) {
            // Fallback to last row
            const newResultsFallback = doc.querySelector('.row:last-of-type');
            const currentResultsFallback = document.querySelector('.row:last-of-type');
            if (newResultsFallback && currentResultsFallback) {
                currentResultsFallback.innerHTML = newResultsFallback.innerHTML;
            }
            return;
        }
        
        if (newResults && currentResults) {
            currentResults.innerHTML = newResults.innerHTML;
        }

        // Update search info if exists
        const newSearchInfo = doc.querySelector('.alert-info');
        const currentSearchInfo = document.querySelector('.alert-info');
        
        if (newSearchInfo && currentSearchInfo) {
            currentSearchInfo.outerHTML = newSearchInfo.outerHTML;
        } else if (newSearchInfo && !currentSearchInfo) {
            // Add search info if it doesn't exist
            const container = document.querySelector('.container');
            const searchSection = container.querySelector('.search-container');
            if (searchSection) {
                searchSection.closest('.row').insertAdjacentHTML('afterend', '<div class="row mb-3"><div class="col-12">' + newSearchInfo.outerHTML + '</div></div>');
            }
        } else if (!newSearchInfo && currentSearchInfo) {
            // Remove search info if query is empty
            currentSearchInfo.closest('.row').remove();
        }
    }

    function showSearchLoading() {
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            searchBtn.disabled = true;
        }
    }

    function hideSearchLoading() {
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            searchBtn.disabled = false;
        }
    }

    // Clear search functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href*="home"]') && e.target.textContent.includes('Clear')) {
            e.preventDefault();
            searchInput.value = '';
            performSearch('');
        }
    });
});