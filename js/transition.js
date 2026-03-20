/**
 * transition.js — Hiệu ứng chuyển trang & scroll reveal
 * Áp dụng cho toàn bộ LibraryComic
 */

/* ============================================================
   1. PAGE TRANSITION — fade out khi rời trang, fade in khi vào
============================================================ */
(function pageTransition() {
    // Thêm overlay fade vào body
    var overlay = document.createElement('div');
    overlay.id = 'pageTransOverlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:#0f0f0f',
        'z-index:99998', 'pointer-events:none',
        'opacity:1', 'transition:opacity 0.35s ease'
    ].join(';');
    document.body.appendChild(overlay);

    // Fade IN khi trang load xong
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            overlay.style.opacity = '0';
            setTimeout(function() {
                overlay.style.pointerEvents = 'none';
            }, 350);
        });
    });

    // Fade OUT khi click link nội bộ
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link) return;

        var href = link.getAttribute('href');
        if (!href) return;

        // Bỏ qua: link ngoài, anchor, javascript, blank target
        if (href.startsWith('http') && !href.includes(location.hostname)) return;
        if (href.startsWith('#') || href.startsWith('javascript')) return;
        if (link.target === '_blank') return;
        // Bỏ qua nếu có modifier key
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        e.preventDefault();

        overlay.style.pointerEvents = 'all';
        overlay.style.opacity = '1';

        setTimeout(function() {
            window.location.href = href;
        }, 320);
    });
})();


/* ============================================================
   2. SCROLL REVEAL — phần tử xuất hiện khi cuộn tới
============================================================ */
(function scrollReveal() {
    var style = document.createElement('style');
    style.textContent = [
        /* Trạng thái ẩn ban đầu */
        '.sr { opacity:0; transform:translateY(28px); transition:opacity 0.55s ease, transform 0.55s ease; }',
        '.sr.sr--left  { transform:translateX(-32px); }',
        '.sr.sr--right { transform:translateX(32px);  }',
        '.sr.sr--zoom  { transform:scale(0.92);        }',
        /* Trạng thái hiện */
        '.sr.visible { opacity:1 !important; transform:none !important; }',
        /* Delay stagger cho grid */
        '.sr[data-delay="1"] { transition-delay:0.08s; }',
        '.sr[data-delay="2"] { transition-delay:0.16s; }',
        '.sr[data-delay="3"] { transition-delay:0.24s; }',
        '.sr[data-delay="4"] { transition-delay:0.32s; }',
        '.sr[data-delay="5"] { transition-delay:0.40s; }',
        '.sr[data-delay="6"] { transition-delay:0.48s; }',
    ].join('\n');
    document.head.appendChild(style);

    // Gắn class .sr vào các phần tử cần animate
    function tagElements() {
        // Manga cards — zoom + stagger
        document.querySelectorAll('.manga-card').forEach(function(el, i) {
            if (!el.closest('[data-sr-done]')) {
                el.classList.add('sr', 'sr--zoom');
                el.setAttribute('data-delay', (i % 6) + 1);
            }
        });

        // Chapter items — từ trái
        document.querySelectorAll('.chapter-item').forEach(function(el, i) {
            el.classList.add('sr', 'sr--left');
            el.setAttribute('data-delay', Math.min(i + 1, 6));
        });

        // Manga detail section
        document.querySelectorAll('.manga-detail').forEach(function(el) {
            el.classList.add('sr');
        });

        // Comment section
        document.querySelectorAll('.comment-section').forEach(function(el) {
            el.classList.add('sr');
        });

        // Section titles
        document.querySelectorAll('.section-title').forEach(function(el) {
            el.classList.add('sr', 'sr--left');
        });

        // Banner
        document.querySelectorAll('.banner').forEach(function(el) {
            el.classList.add('sr');
        });

        // W3 cards (video, map)
        document.querySelectorAll('.w3-card, .w3-card-4').forEach(function(el) {
            el.classList.add('sr');
        });

        // Reader controls & images
        document.querySelectorAll('.reader-images img').forEach(function(el, i) {
            el.classList.add('sr');
            el.setAttribute('data-delay', Math.min((i % 3) + 1, 3));
        });

        // Stats bar (admin)
        document.querySelectorAll('.stat-card').forEach(function(el, i) {
            el.classList.add('sr', 'sr--zoom');
            el.setAttribute('data-delay', i + 1);
        });

        // Page wrap content
        document.querySelectorAll('.page-wrap > *').forEach(function(el) {
            el.classList.add('sr');
        });
    }

    // IntersectionObserver để trigger khi element vào viewport
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // chỉ animate 1 lần
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    function observeAll() {
        document.querySelectorAll('.sr').forEach(function(el) {
            observer.observe(el);
        });
    }

    // Chạy sau khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            tagElements();
            observeAll();
        });
    } else {
        tagElements();
        observeAll();
    }

    // Re-observe khi có element mới (index.js render manga grid động)
    var mutObs = new MutationObserver(function(muts) {
        var hasNew = false;
        muts.forEach(function(m) {
            if (m.addedNodes.length) hasNew = true;
        });
        if (hasNew) {
            tagElements();
            observeAll();
        }
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
})();
