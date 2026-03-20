/**
 * decor.js — Trang trí hình ảnh cho LibraryComic
 * Bao gồm: floating particles, speed lines, ink splatter,
 * sakura petals, manga panel corners, cursor trail
 */
(function () {
    'use strict';

    /* ── CSS ── */
    var style = document.createElement('style');
    style.textContent = `
/* ======== CANVAS NỀN ======== */
#lc-decor-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.55;
}

/* ======== SPEED LINES (góc màn hình) ======== */
.lc-speed-lines {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    opacity: 0;
    animation: slFadeIn 1.2s ease 0.5s forwards;
}
@keyframes slFadeIn { to { opacity: 1; } }

.lc-speed-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(255,76,76,0.035), transparent);
    height: 1px;
    transform-origin: left center;
    animation: speedLine var(--dur, 4s) ease-in-out var(--delay, 0s) infinite;
}
@keyframes speedLine {
    0%   { opacity: 0; transform: scaleX(0) rotate(var(--rot,0deg)); }
    20%  { opacity: 1; }
    80%  { opacity: 0.6; }
    100% { opacity: 0; transform: scaleX(1.4) rotate(var(--rot,0deg)); }
}

/* ======== INK DROPS ======== */
.lc-ink {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,76,76,0.12) 0%, transparent 70%);
    animation: inkBreath var(--dur,8s) ease-in-out var(--delay,0s) infinite;
}
@keyframes inkBreath {
    0%,100% { transform: scale(1) translate(0,0); opacity: 0.4; }
    33%      { transform: scale(1.15) translate(10px,-8px); opacity: 0.7; }
    66%      { transform: scale(0.9) translate(-8px,6px); opacity: 0.3; }
}

/* ======== FLOATING KANJI ======== */
.lc-kanji {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    font-family: 'Noto Sans', serif;
    font-weight: 900;
    color: rgba(255,76,76,0.06);
    user-select: none;
    animation: kanjiFloat var(--dur,20s) linear var(--delay,0s) infinite;
    line-height: 1;
}
@keyframes kanjiFloat {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 0.6; }
    100% { transform: translateY(-100vh) rotate(15deg); opacity: 0; }
}

/* ======== CORNER MANGA MARKS ======== */
.lc-manga-mark {
    position: fixed;
    pointer-events: none;
    z-index: 1;
    opacity: 0.12;
}
.lc-manga-mark svg { display: block; }

/* ======== CURSOR TRAIL ======== */
.lc-cursor-dot {
    position: fixed;
    width: 6px; height: 6px;
    background: #ff4c4c;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
    mix-blend-mode: screen;
}

/* ======== LIGHT MODE ======== */
.light-mode #lc-decor-canvas { opacity: 0.18; }
.light-mode .lc-kanji { color: rgba(255,76,76,0.04); }
.light-mode .lc-ink { background: radial-gradient(circle, rgba(255,76,76,0.06) 0%, transparent 70%); }
.light-mode .lc-manga-mark { opacity: 0.06; }

/* Performance: tắt animation khi prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    .lc-kanji, .lc-speed-line, .lc-ink { animation: none !important; opacity: 0.03 !important; }
}
    `;
    document.head.appendChild(style);

    /* ── PARTICLE CANVAS ── */
    var canvas = document.createElement('canvas');
    canvas.id = 'lc-decor-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* Particles */
    var particles = [];
    var PARTICLE_COUNT = window.innerWidth < 600 ? 28 : 55;

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
        var types = ['dot', 'cross', 'diamond', 'line'];
        var type  = types[Math.floor(Math.random() * types.length)];
        return {
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height,
            vx:    randBetween(-0.3, 0.3),
            vy:    randBetween(-0.5, -0.1),
            size:  randBetween(1, type === 'line' ? 12 : 3.5),
            alpha: randBetween(0.04, 0.18),
            type:  type,
            rot:   Math.random() * Math.PI * 2,
            vrot:  randBetween(-0.01, 0.01),
            life:  Math.random(),
            speed: randBetween(0.002, 0.006),
        };
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        var p = createParticle();
        p.y = Math.random() * canvas.height; // start spread
        particles.push(p);
    }

    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.alpha * Math.sin(p.life * Math.PI);
        ctx.strokeStyle = '#ff4c4c';
        ctx.fillStyle   = '#ff4c4c';
        ctx.lineWidth   = 1;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        switch (p.type) {
            case 'dot':
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'cross':
                ctx.beginPath();
                ctx.moveTo(-p.size, 0); ctx.lineTo(p.size, 0);
                ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
                ctx.stroke();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.lineTo(p.size * 0.6, 0);
                ctx.lineTo(0, p.size);
                ctx.lineTo(-p.size * 0.6, 0);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'line':
                ctx.beginPath();
                ctx.moveTo(-p.size, 0);
                ctx.lineTo(p.size, 0);
                ctx.stroke();
                break;
        }
        ctx.restore();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(function (p) {
            p.life += p.speed;
            p.x   += p.vx;
            p.y   += p.vy;
            p.rot += p.vrot;

            if (p.life >= 1 || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
                var fresh = createParticle();
                fresh.y = canvas.height + 10;
                Object.assign(p, fresh);
            }
            drawParticle(p);
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ── SPEED LINES ── */
    var slContainer = document.createElement('div');
    slContainer.className = 'lc-speed-lines';
    document.body.insertBefore(slContainer, document.body.firstChild);

    var LINE_COUNT = 18;
    for (var li = 0; li < LINE_COUNT; li++) {
        var line = document.createElement('div');
        line.className = 'lc-speed-line';
        var angle = randBetween(-8, 8);
        var topPct = randBetween(5, 95);
        var widthPct = randBetween(25, 75);
        line.style.cssText = [
            'top:' + topPct + '%',
            'left:' + randBetween(-10, 20) + '%',
            'width:' + widthPct + '%',
            '--rot:' + angle + 'deg',
            '--dur:' + randBetween(3, 8) + 's',
            '--delay:' + randBetween(0, 6) + 's',
        ].join(';');
        slContainer.appendChild(line);
    }

    /* ── INK DROPS ── */
    var inkData = [
        { top:'8%',  right:'5%',  size: 260 },
        { bottom:'12%', left:'3%',   size: 200 },
        { top:'45%', right:'2%',  size: 150 },
        { top:'25%', left:'8%',   size: 120 },
    ];
    inkData.forEach(function (d, i) {
        var ink = document.createElement('div');
        ink.className = 'lc-ink';
        var css = 'width:' + d.size + 'px;height:' + d.size + 'px;';
        css += '--dur:' + (7 + i * 2.5) + 's;--delay:' + (i * 1.8) + 's;';
        if (d.top)    css += 'top:'    + d.top    + ';';
        if (d.bottom) css += 'bottom:' + d.bottom + ';';
        if (d.left)   css += 'left:'   + d.left   + ';';
        if (d.right)  css += 'right:'  + d.right  + ';';
        ink.style.cssText = css;
        document.body.appendChild(ink);
    });

    /* ── FLOATING KANJI ── */
    var kanjiChars = ['漫','画','読','書','英','雄','戦','夢','力','愛','星','風','炎','剣','龍'];
    var kanjiCount = window.innerWidth < 600 ? 5 : 10;
    for (var ki = 0; ki < kanjiCount; ki++) {
        var k = document.createElement('div');
        k.className = 'lc-kanji';
        var sz = Math.floor(randBetween(28, 90));
        k.style.cssText = [
            'left:' + randBetween(2, 95) + '%',
            'top:' + randBetween(20, 110) + '%',
            'font-size:' + sz + 'px',
            '--dur:' + randBetween(18, 40) + 's',
            '--delay:-' + randBetween(0, 30) + 's',
        ].join(';');
        k.textContent = kanjiChars[ki % kanjiChars.length];
        document.body.appendChild(k);
    }

    /* ── MANGA CORNER MARKS ── */
    var corners = [
        { top:'0',    left:'0',    cls:'tl' },
        { top:'0',    right:'0',   cls:'tr' },
        { bottom:'0', left:'0',    cls:'bl' },
        { bottom:'0', right:'0',   cls:'br' },
    ];
    corners.forEach(function (c) {
        var mark = document.createElement('div');
        mark.className = 'lc-manga-mark';
        var s = 80;
        var css = 'width:' + s + 'px;height:' + s + 'px;';
        if (c.top)    css += 'top:'    + c.top    + ';';
        if (c.bottom) css += 'bottom:' + c.bottom + ';';
        if (c.left)   css += 'left:'   + c.left   + ';';
        if (c.right)  css += 'right:'  + c.right  + ';';

        var rot = c.cls === 'tl' ? 0 : c.cls === 'tr' ? 90 : c.cls === 'bl' ? 270 : 180;
        mark.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(' + rot + 'deg)">'
            + '<path d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z" fill="#ff4c4c"/>'
            + '<path d="M0 0 L16 0 L16 2 L2 2 L2 16 L0 16 Z" fill="#ff4c4c" opacity="0.5"/>'
            + '<circle cx="6" cy="6" r="2" fill="#ff4c4c" opacity="0.7"/>'
            + '</svg>';
        mark.style.cssText = css;
        document.body.appendChild(mark);
    });

    /* ── CURSOR TRAIL ── */
    var trail = [];
    var TRAIL_LEN = 8;
    for (var ti = 0; ti < TRAIL_LEN; ti++) {
        var dot = document.createElement('div');
        dot.className = 'lc-cursor-dot';
        dot.style.opacity = (1 - ti / TRAIL_LEN) * 0.7;
        dot.style.width  = Math.max(2, 6 - ti) + 'px';
        dot.style.height = Math.max(2, 6 - ti) + 'px';
        dot.style.background = 'rgba(255,' + Math.floor(76 + ti * 10) + ',' + Math.floor(76 + ti * 10) + ',0.8)';
        document.body.appendChild(dot);
        trail.push({ el: dot, x: -100, y: -100 });
    }

    var mouseX = -100, mouseY = -100;
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Ẩn trail trên mobile
    if ('ontouchstart' in window) {
        trail.forEach(function (t) { t.el.style.display = 'none'; });
    }

    function animateTrail() {
        trail[0].x = mouseX;
        trail[0].y = mouseY;
        for (var i = 1; i < trail.length; i++) {
            trail[i].x += (trail[i-1].x - trail[i].x) * 0.35;
            trail[i].y += (trail[i-1].y - trail[i].y) * 0.35;
        }
        trail.forEach(function (t) {
            t.el.style.left = t.x + 'px';
            t.el.style.top  = t.y + 'px';
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

})();
