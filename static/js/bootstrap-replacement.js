// Bootstrap replacement JavaScript - maintains exact same functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar collapse functionality
    const navbarTogglers = document.querySelectorAll('.navbar-toggler');
    navbarTogglers.forEach(toggler => {
        toggler.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-bs-target') || this.getAttribute('data-target'));
            if (target) {
                target.classList.toggle('show');
            }
        });
    });

    // Alert auto-dismiss (if data-bs-dismiss="alert" is present)
    const alertDismissButtons = document.querySelectorAll('[data-bs-dismiss="alert"], [data-dismiss="alert"]');
    alertDismissButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.remove();
                }, 150);
            }
        });
    });

    // Modal functionality (basic)
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"], [data-toggle="modal"]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('data-target');
            const modal = document.querySelector(targetSelector);
            if (modal) {
                modal.style.display = 'block';
                modal.classList.add('show');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Modal close functionality
    const modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"], [data-dismiss="modal"]');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"], [data-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.toggle('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('[data-bs-toggle="dropdown"], [data-toggle="dropdown"]')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Tooltip functionality (basic)
    const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"], [data-toggle="tooltip"]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const title = this.getAttribute('title') || this.getAttribute('data-bs-title');
            if (title) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    background: #000;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                `;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
                
                this._tooltip = tooltip;
            }
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });

    // Tab functionality
    const tabTriggers = document.querySelectorAll('[data-bs-toggle="tab"], [data-toggle="tab"]');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all tabs in this group
            const tabGroup = this.closest('.nav-tabs') || this.closest('.nav-pills');
            if (tabGroup) {
                const allTabs = tabGroup.querySelectorAll('.nav-link');
                allTabs.forEach(tab => tab.classList.remove('active'));
            }
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab pane
            const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('data-target') || this.getAttribute('href');
            const targetPane = document.querySelector(targetSelector);
            if (targetPane) {
                // Hide all tab panes in this group
                const tabContent = targetPane.closest('.tab-content');
                if (tabContent) {
                    const allPanes = tabContent.querySelectorAll('.tab-pane');
                    allPanes.forEach(pane => {
                        pane.classList.remove('show', 'active');
                    });
                }
                
                // Show target pane
                targetPane.classList.add('show', 'active');
            }
        });
    });

    // Collapse functionality
    const collapseTriggers = document.querySelectorAll('[data-bs-toggle="collapse"], [data-toggle="collapse"]');
    collapseTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('data-target');
            const target = document.querySelector(targetSelector);
            if (target) {
                if (target.classList.contains('show')) {
                    target.style.height = target.scrollHeight + 'px';
                    target.offsetHeight; // Force reflow
                    target.style.height = '0px';
                    target.classList.remove('show');
                } else {
                    target.classList.add('show');
                    target.style.height = target.scrollHeight + 'px';
                    setTimeout(() => {
                        target.style.height = 'auto';
                    }, 350);
                }
            }
        });
    });
});