/*!
* Alex Lopez — Cybersecurity Portfolio
* Custom JavaScript
*/

/* ============================================================
   1. ACTIVE NAV LINK — auto-detects current page
   ============================================================ */
(function () {
    // Get the current filename, defaulting to index.html for root paths
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') currentPage = 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Normalize both sides — strip any leading ./ and compare
        const linkPage = href.replace(/^\.\//, '');
        const current  = currentPage.replace(/^\.\//, '');

        // Also treat root '/' as index.html
        const isMatch  = linkPage === current ||
                         (current === 'index.html' && linkPage === '/');

        if (isMatch) {
            link.classList.add('active');
            link.style.color         = '#0097b2';
            link.style.setProperty('color', '#0097b2', 'important');

            // Inject a style rule to beat any !important in the stylesheet
            const styleId = 'active-nav-style';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    .nav-link.active {
                        color: #0097b2 !important;
                        border-bottom: 1px solid #0097b2;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    });
})();


/* ============================================================
   2. SCROLL PROGRESS BAR — thin teal bar at top of page
   ============================================================ */
(function () {
    // Create the bar element
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    Object.assign(bar.style, {
        position:   'fixed',
        top:        '0',
        left:       '0',
        height:     '2px',
        width:      '0%',
        background: 'linear-gradient(90deg, #0097b2, #00c8ff)',
        zIndex:     '9999',
        transition: 'width 0.1s linear',
        boxShadow:  '0 0 6px rgba(0, 151, 178, 0.7)',
        pointerEvents: 'none',
    });
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop    = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress     = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width    = progress + '%';
    }, { passive: true });
})();


/* ============================================================
   3. SMOOTH FADE-IN ON PAGE LOAD
   ============================================================ */
(function () {
    // Hide body initially
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.4s ease';

    window.addEventListener('load', () => {
        document.documentElement.style.opacity = '1';
    });
})();


/* ============================================================
   4. TYPING / TERMINAL EFFECT — home page hero title only
   ============================================================ */
(function () {
    // Only runs on index.html
    const isHome = ['', 'index.html', '/'].some(p =>
        window.location.pathname.endsWith(p)
    );
    if (!isHome) return;

    window.addEventListener('load', () => {
        // Target the .accent span inside the hero h1
        const accentEl = document.querySelector('.hero-title .accent');
        if (!accentEl) return;

        const fullText   = accentEl.textContent.trim();
        const savedBg    = accentEl.style.background || '';
        const savedClip  = accentEl.style.webkitBackgroundClip || '';
        const savedFill  = accentEl.style.webkitTextFillColor || '';

        // Reset to plain invisible text while typing
        accentEl.textContent = '';
        accentEl.style.webkitTextFillColor = '#0097b2';
        accentEl.style.background = 'none';

        // Add blinking cursor
        const cursor = document.createElement('span');
        cursor.textContent = '█';
        cursor.style.cssText = `
            display: inline-block;
            width: 2px;
            animation: cursorBlink 0.7s step-end infinite;
            color: #00c8ff;
            margin-left: 2px;
            font-size: 0.8em;
            vertical-align: middle;
        `;
        accentEl.after(cursor);

        // Inject cursor blink keyframes once
        if (!document.getElementById('cursor-blink-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-blink-style';
            style.textContent = `
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Type out characters one by one
        let i = 0;
        const speed = 55; // ms per character — adjust to taste
        const delay = 600; // ms before typing starts

        setTimeout(() => {
            const interval = setInterval(() => {
                accentEl.textContent = fullText.slice(0, ++i);

                if (i >= fullText.length) {
                    clearInterval(interval);

                    // Short pause, then remove cursor and restore gradient
                    setTimeout(() => {
                        cursor.remove();
                        // Restore the CSS gradient text effect
                        accentEl.style.background =
                            'linear-gradient(135deg, #0097b2 0%, #00c8ff 100%)';
                        accentEl.style.webkitBackgroundClip = 'text';
                        accentEl.style.webkitTextFillColor  = 'transparent';
                        accentEl.style.backgroundClip       = 'text';
                    }, 500);
                }
            }, speed);
        }, delay);
    });
})();