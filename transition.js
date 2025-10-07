document.body.classList.add('page-fade');
window.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('visible');
});

document.querySelectorAll('a.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        // Only fade for internal links
        if (
            link.hostname === window.location.hostname &&
            link.target !== '_blank' &&
            link.href &&
            !link.href.startsWith('javascript:')
        ) {
            e.preventDefault();
            document.body.classList.remove('visible');
            setTimeout(function() {
                window.location.href = link.href;
            }, 600); // Match transition duration
        }
    });
});
