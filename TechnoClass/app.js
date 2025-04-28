document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Prevent clicks inside sidebar from closing it
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = themeToggle.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            themeToggle.setAttribute('data-theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            themeToggle.setAttribute('data-theme', savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    // Responsive sidebar
    function handleResize() {
        if (window.innerWidth < 768) {
            sidebar.classList.add('sidebar-hidden');
            contentWrapper.style.marginLeft = '0';
        } else {
            sidebar.classList.remove('sidebar-hidden');
            contentWrapper.style.marginLeft = '280px';
        }
    }

    if (sidebar && contentWrapper) {
        window.addEventListener('resize', handleResize);
        handleResize(); // Execute on initial load
    }

    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars.length > 0) {
        setTimeout(() => {
            progressBars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 300);
            });
        }, 500);
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Failed to register Service Worker:', error);
            });
    });
}
