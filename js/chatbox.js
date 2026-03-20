/**
 * chatbox.js — Floating chatbox LibraryComic
 * Manga Editorial Dark — tự làm, không widget ngoài
 * Lưu tin nhắn vào localStorage theo từng user
 */
document.addEventListener('DOMContentLoaded', function() {
(function () {
    'use strict';

    /* ── CẤU HÌNH ── */
    var MAX_MSG   = 200;   // tin nhắn tối đa lưu
    var BOT_NAME  = 'ROLAND';
    var BOT_AVT   = '🦊';
    var STORE_KEY = 'lc_chat_messages';
    var NAME_KEY  = 'lc_chat_username';

    /* ── INJECT CSS ── */
    var css = `
/* ============ CHATBOX FLOATING ============ */
#lc-chat-fab {
    position: fixed;
    bottom: 28px; right: 28px;
    width: 54px; height: 54px;
    background: #ff4c4c;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255,76,76,0.5), 0 0 0 0 rgba(255,76,76,0.3);
    z-index: 9000;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    animation: fabPulse 2.5s ease-in-out infinite;
}
#lc-chat-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 28px rgba(255,76,76,0.65), 0 0 0 8px rgba(255,76,76,0.12);
    animation: none;
}
#lc-chat-fab svg { width: 24px; height: 24px; fill: white; pointer-events: none; }
#lc-chat-fab .fab-badge {
    position: absolute; top: -4px; right: -4px;
    background: #fff; color: #ff4c4c;
    font-size: 10px; font-weight: 900;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: none; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif;
    border: 1.5px solid #ff4c4c;
    line-height: 1;
}
@keyframes fabPulse {
    0%,100% { box-shadow: 0 4px 20px rgba(255,76,76,0.5), 0 0 0 0 rgba(255,76,76,0.3); }
    50%      { box-shadow: 0 4px 20px rgba(255,76,76,0.5), 0 0 0 10px rgba(255,76,76,0); }
}

/* ── PANEL ── */
#lc-chat-panel {
    position: fixed;
    bottom: 94px; right: 28px;
    width: 340px;
    height: 480px;
    background: #141414;
    border-radius: 16px;
    border: 1.5px solid #2e2e2e;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,76,76,0.1);
    display: flex; flex-direction: column;
    z-index: 8999;
    overflow: hidden;
    transform: scale(0.88) translateY(20px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), opacity 0.22s ease;
    font-family: 'Noto Sans', 'Segoe UI', sans-serif;
}
#lc-chat-panel.open {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: all;
}

/* ── HEADER ── */
.lc-chat-head {
    display: flex; align-items: center; gap: 11px;
    padding: 13px 16px;
    background: linear-gradient(90deg, #1c0a0a 0%, #1e1e1e 50%, #1c0a0a 100%);
    border-bottom: 2px solid #ff4c4c;
    position: relative; flex-shrink: 0;
    cursor: default;
}
.lc-chat-head::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,76,76,0.02) 2px, rgba(255,76,76,0.02) 4px);
}
.lc-head-icon {
    width: 36px; height: 36px;
    background: #ff4c4c;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(255,76,76,0.45);
    position: relative; z-index: 1;
}
.lc-head-info { flex: 1; position: relative; z-index: 1; }
.lc-head-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px; font-weight: 700;
    color: #eee; letter-spacing: 1.2px;
    text-transform: uppercase; line-height: 1;
}
.lc-head-status {
    display: flex; align-items: center; gap: 5px;
    margin-top: 3px;
}
.lc-status-dot {
    width: 6px; height: 6px;
    background: #4caf50; border-radius: 50%;
    position: relative;
}
.lc-status-dot::before {
    content: ''; position: absolute; inset: -3px;
    border-radius: 50%; background: rgba(76,175,80,0.3);
    animation: dotPulse 1.8s ease-in-out infinite;
}
@keyframes dotPulse {
    0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.8);opacity:0}
}
.lc-status-text {
    font-size: 10px; color: #4caf50;
    font-weight: 600; letter-spacing: 0.5px;
}
.lc-head-close {
    width: 28px; height: 28px;
    background: rgba(255,255,255,0.06);
    border: 1px solid #333;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #666; font-size: 14px;
    transition: all 0.18s ease;
    position: relative; z-index: 1;
    user-select: none;
}
.lc-head-close:hover { background: #ff4c4c; color: white; border-color: #ff4c4c; }

/* ── SCANLINE ── */
.lc-scanline {
    height: 2px; flex-shrink: 0;
    background: linear-gradient(90deg, transparent, rgba(255,76,76,0.4) 50%, transparent);
}

/* ── MESSAGES ── */
.lc-messages {
    flex: 1; overflow-y: auto;
    padding: 14px 14px 8px;
    display: flex; flex-direction: column; gap: 10px;
    scroll-behavior: smooth;
}
.lc-messages::-webkit-scrollbar { width: 3px; }
.lc-messages::-webkit-scrollbar-track { background: transparent; }
.lc-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
.lc-messages::-webkit-scrollbar-thumb:hover { background: #ff4c4c; }

/* Tin nhắn người dùng khác / system */
.lc-msg { display: flex; gap: 8px; align-items: flex-end; }
.lc-msg.own { flex-direction: row-reverse; }

.lc-avt {
    width: 28px; height: 28px;
    background: #2a2a2a;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    border: 1px solid #333;
}
.lc-avt.own-avt { background: rgba(255,76,76,0.15); border-color: rgba(255,76,76,0.3); }

.lc-bubble-wrap { display: flex; flex-direction: column; gap: 3px; max-width: 72%; }
.lc-msg.own .lc-bubble-wrap { align-items: flex-end; }

.lc-sender {
    font-size: 10px; color: #555;
    font-weight: 600; letter-spacing: 0.3px;
    padding: 0 6px;
}
.lc-msg.own .lc-sender { color: rgba(255,76,76,0.6); }

.lc-bubble {
    padding: 8px 12px;
    border-radius: 12px 12px 12px 4px;
    font-size: 13px; line-height: 1.5; color: #ddd;
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    word-break: break-word;
    position: relative;
}
.lc-msg.own .lc-bubble {
    background: rgba(255,76,76,0.12);
    border-color: rgba(255,76,76,0.25);
    color: #eee;
    border-radius: 12px 12px 4px 12px;
}

.lc-time {
    font-size: 9px; color: #444;
    padding: 0 6px; letter-spacing: 0.2px;
}

/* Tin nhắn system */
.lc-msg-sys {
    text-align: center; font-size: 10px;
    color: #444; letter-spacing: 0.4px;
    padding: 2px 0;
}

/* Typing indicator */
.lc-typing .lc-bubble {
    padding: 10px 14px;
}
.lc-dots { display: flex; gap: 4px; align-items: center; height: 14px; }
.lc-dots span {
    width: 5px; height: 5px;
    background: #555; border-radius: 50%;
    animation: typing 1.2s ease-in-out infinite;
}
.lc-dots span:nth-child(2) { animation-delay: 0.2s; }
.lc-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
    0%,60%,100% { transform: translateY(0); background: #444; }
    30%          { transform: translateY(-5px); background: #ff4c4c; }
}

/* ── NAME PROMPT ── */
.lc-name-prompt {
    padding: 16px;
    background: #1a1a1a;
    border-top: 1px solid #222;
    flex-shrink: 0;
    display: flex; flex-direction: column; gap: 8px;
}
.lc-name-label {
    font-size: 11px; color: #666;
    font-weight: 600; letter-spacing: 0.5px;
    text-transform: uppercase;
}
.lc-name-row { display: flex; gap: 8px; }
.lc-name-input {
    flex: 1; padding: 9px 12px;
    background: #111; border: 1.5px solid #2e2e2e;
    border-radius: 8px; color: #eee;
    font-size: 13px; font-family: inherit; outline: none;
    transition: border-color 0.2s;
}
.lc-name-input:focus { border-color: #ff4c4c; }
.lc-name-input::placeholder { color: #444; }
.lc-name-btn {
    padding: 9px 16px;
    background: #ff4c4c; color: white;
    border: none; border-radius: 8px;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background 0.18s, transform 0.18s;
    white-space: nowrap;
}
.lc-name-btn:hover { background: #e03030; transform: translateY(-1px); }

/* ── INPUT BAR ── */
.lc-input-bar {
    padding: 10px 12px;
    background: #1a1a1a;
    border-top: 1px solid #222;
    display: flex; gap: 8px; align-items: flex-end;
    flex-shrink: 0;
}
.lc-text-input {
    flex: 1; padding: 9px 12px;
    background: #111; border: 1.5px solid #2e2e2e;
    border-radius: 10px; color: #eee;
    font-size: 13px; font-family: inherit; outline: none;
    resize: none; max-height: 80px; line-height: 1.4;
    transition: border-color 0.2s;
    scrollbar-width: none;
}
.lc-text-input:focus { border-color: #ff4c4c; }
.lc-text-input::placeholder { color: #444; }
.lc-send-btn {
    width: 38px; height: 38px; flex-shrink: 0;
    background: #ff4c4c; color: white;
    border: none; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
}
.lc-send-btn:hover {
    background: #e03030;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(255,76,76,0.4);
}
.lc-send-btn:active { transform: translateY(0); }
.lc-send-btn svg { width: 16px; height: 16px; fill: white; }

/* ── CORNER BRACKETS ── */
.lc-corner {
    position: absolute; width: 12px; height: 12px;
    pointer-events: none; z-index: 2;
}
.lc-corner.tl { top:-1px; left:-1px;   border-top:2px solid #ff4c4c; border-left:2px solid #ff4c4c;  border-radius:16px 0 0 0; }
.lc-corner.tr { top:-1px; right:-1px;  border-top:2px solid #ff4c4c; border-right:2px solid #ff4c4c; border-radius:0 16px 0 0; }
.lc-corner.bl { bottom:-1px; left:-1px; border-bottom:2px solid #ff4c4c; border-left:2px solid #ff4c4c; border-radius:0 0 0 16px; }
.lc-corner.br { bottom:-1px; right:-1px; border-bottom:2px solid #ff4c4c; border-right:2px solid #ff4c4c; border-radius:0 0 16px 0; }

/* ── LIGHT MODE ── */
.light-mode #lc-chat-panel {
    background: #fff;
    border-color: #e8e8e8;
    box-shadow: 0 16px 60px rgba(180,80,60,0.15), 0 0 0 1px rgba(255,76,76,0.08);
}
.light-mode .lc-chat-head {
    background: linear-gradient(90deg, #fff5f5 0%, #fff 50%, #fff5f5 100%);
}
.light-mode .lc-messages { background: #fafafa; }
.light-mode .lc-bubble { background: #f0f0f0; border-color: #e0e0e0; color: #222; }
.light-mode .lc-msg.own .lc-bubble { background: rgba(255,76,76,0.08); border-color: rgba(255,76,76,0.2); color: #111; }
.light-mode .lc-name-prompt,
.light-mode .lc-input-bar { background: #f5f5f5; border-top-color: #e8e8e8; }
.light-mode .lc-name-input,
.light-mode .lc-text-input { background: #fff; border-color: #ddd; color: #111; }
.light-mode .lc-head-close { background: #f0f0f0; border-color: #ddd; color: #888; }
.light-mode .lc-sender { color: #aaa; }
.light-mode .lc-time { color: #bbb; }
.light-mode .lc-msg-sys { color: #bbb; }
.light-mode .lc-avt { background: #eee; border-color: #ddd; }

/* ── MOBILE ── */
@media (max-width: 520px) {
    #lc-chat-panel {
        width: calc(100vw - 32px);
        right: 16px; bottom: 86px;
        height: 420px;
    }
    #lc-chat-fab { right: 16px; bottom: 20px; }
}
`;

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ── HELPERS ── */
    function fmt(d) {
        return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    }
    function esc(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function loadMsgs() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch(e) { return []; }
    }
    function saveMsgs(msgs) {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(msgs.slice(-MAX_MSG))); } catch(e) {}
    }
    function getUsername() { return localStorage.getItem(NAME_KEY) || ''; }
    function setUsername(n) { localStorage.setItem(NAME_KEY, n); }

    /* ── BUILD HTML ── */
    var fab = document.createElement('div');
    fab.id = 'lc-chat-fab';
    fab.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/></svg>
        <div class="fab-badge" id="lcBadge">0</div>
    `;

    var panel = document.createElement('div');
    panel.id = 'lc-chat-panel';
    panel.innerHTML = `
        <span class="lc-corner tl"></span>
        <span class="lc-corner tr"></span>
        <span class="lc-corner bl"></span>
        <span class="lc-corner br"></span>

        <div class="lc-chat-head">
            <div class="lc-head-icon">${BOT_AVT}</div>
            <div class="lc-head-info">
                <div class="lc-head-title">Chat Cộng Đồng</div>
                <div class="lc-head-status">
                    <span class="lc-status-dot"></span>
                    <span class="lc-status-text">LibraryComic Online</span>
                </div>
            </div>
            <div class="lc-head-close" id="lcClose">✕</div>
        </div>

        <div class="lc-scanline"></div>

        <div class="lc-messages" id="lcMessages"></div>

        <div class="lc-name-prompt" id="lcNamePrompt">
            <div class="lc-name-label">Nhập tên để chat</div>
            <div class="lc-name-row">
                <input class="lc-name-input" id="lcNameInput" placeholder="Tên của bạn..." maxlength="20">
                <button class="lc-name-btn" id="lcNameBtn">Vào chat</button>
            </div>
        </div>

        <div class="lc-input-bar" id="lcInputBar" style="display:none;">
            <textarea class="lc-text-input" id="lcTextInput" placeholder="Nhắn gì đó..." rows="1" maxlength="300"></textarea>
            <button class="lc-send-btn" id="lcSendBtn">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    /* ── STATE ── */
    var isOpen   = false;
    var unread   = 0;
    var username = getUsername();

    /* ── RENDER MESSAGES ── */
    function renderAll() {
        var box = document.getElementById('lcMessages');
        var msgs = loadMsgs();
        if (msgs.length === 0) {
            box.innerHTML = '<div class="lc-msg-sys">— Chưa có tin nhắn nào —</div>';
            return;
        }
        box.innerHTML = msgs.map(function(m) {
            if (m.type === 'sys') {
                return '<div class="lc-msg-sys">' + esc(m.text) + '</div>';
            }
            var isOwn = (m.name === username);
            return `<div class="lc-msg ${isOwn ? 'own' : ''}">
                <div class="lc-avt ${isOwn ? 'own-avt' : ''}">${esc(m.name.charAt(0).toUpperCase())}</div>
                <div class="lc-bubble-wrap">
                    <div class="lc-sender">${esc(m.name)}</div>
                    <div class="lc-bubble">${esc(m.text)}</div>
                    <div class="lc-time">${m.time}</div>
                </div>
            </div>`;
        }).join('');
        scrollBottom();
    }

    function scrollBottom() {
        var box = document.getElementById('lcMessages');
        box.scrollTop = box.scrollHeight;
    }

    function addMsg(name, text, type) {
        var msgs = loadMsgs();
        msgs.push({ name: name, text: text, time: fmt(new Date()), type: type || 'user' });
        saveMsgs(msgs);
        renderAll();
        if (!isOpen) {
            unread++;
            var badge = document.getElementById('lcBadge');
            badge.style.display = 'flex';
            badge.textContent = unread > 9 ? '9+' : unread;
        }
    }

    /* ── SHOW / HIDE ── */
    function openPanel() {
        isOpen = true;
        panel.classList.add('open');
        // Reset badge
        unread = 0;
        var badge = document.getElementById('lcBadge');
        badge.style.display = 'none';
        // Cập nhật input area
        updateInputArea();
        renderAll();
        setTimeout(function() {
            if (username) document.getElementById('lcTextInput').focus();
            else document.getElementById('lcNameInput').focus();
        }, 280);
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('open');
    }

    function updateInputArea() {
        var prompt = document.getElementById('lcNamePrompt');
        var bar    = document.getElementById('lcInputBar');
        if (username) {
            prompt.style.display = 'none';
            bar.style.display    = 'flex';
        } else {
            prompt.style.display = 'flex';
            bar.style.display    = 'none';
        }
    }

    /* ── BOT AUTO-REPLY ── */
    var BOT_REPLIES = [
        /* Chào hỏi */
        { keys: ['xin chào','chào','hello','hi','hey','alo','ơi'],
          res: ['Chào bạn! 👋 Mình là ROLAND, hỗ trợ cộng đồng LibraryComic. Bạn cần gì không?',
                'Heyyy! Chào mừng đến LibraryComic 🎌 Có thể giúp gì cho bạn?',
                'Alo alo! ROLAND đây~ Bạn đang tìm truyện gì thế? 😄'] },

        /* Hỏi truyện */
        { keys: ['truyện','truyen','manga','comic','đọc','doc','tìm','tim'],
          res: ['Bạn có thể xem danh sách truyện ngay trên trang chủ nhé! Hiện có: Sắp Xuất Ngũ Thì Isekai, Dandadan, Friend Zone, Bậc Thầy Thiết Kế Điền Trang, Vùng Đất Sương Mù 📚',
                'LibraryComic cập nhật chapter mới hằng ngày! Bạn thích thể loại gì — Action, Isekai, Romance hay Comedy? 🤔',
                'Tìm truyện à? Dùng ô tìm kiếm trên thanh menu là nhanh nhất nha! 🔍'] },

        /* Isekai */
        { keys: ['isekai'],
          res: ['Isekai thì có "Sắp Xuất Ngũ Thì Isekai" và "Bậc Thầy Thiết Kế Điền Trang" — cả hai đều đang cập nhật! 🗡️',
                'Fan Isekai à? "Sắp Xuất Ngũ Thì Isekai" đang rất hot, bạn thử đọc chưa? 😏'] },

        /* Dandadan */
        { keys: ['dandadan','danda'],
          res: ['Dandadan 🔥 Truyện cực hay! Hiện có 2 chapter, nội dung về học sinh gặp những cuộc phiêu lưu kỳ lạ. Bạn đọc chưa?',
                'Dandadan của Yukinobu Tatsu siêu đỉnh! Action + Comedy + Supernatural mix lại rất cuốn 😎'] },

        /* Chapter / cập nhật */
        { keys: ['chapter','chuong','chương','cập nhật','cap nhat','mới nhất','moi nhat','update'],
          res: ['Trang web cập nhật chapter mới hằng ngày! Bạn có thể vào từng bộ truyện để xem chapter mới nhất nhé 📖',
                'Chapter mới được cập nhật liên tục. Nhớ đăng nhập để theo dõi bộ truyện yêu thích nha! ⭐'] },

        /* Đăng nhập / tài khoản */
        { keys: ['đăng nhập','dang nhap','login','tài khoản','tai khoan','đăng ký','dang ky','register','mật khẩu','mat khau'],
          res: ['Bạn có thể đăng nhập/đăng ký ở nút góc trên bên phải màn hình nhé! Hoàn toàn miễn phí 😊',
                'Đăng ký tài khoản để theo dõi truyện và lưu lịch sử đọc nhé! Chỉ cần tên và mật khẩu thôi 🔑'] },

        /* Theo dõi */
        { keys: ['theo dõi','theo doi','follow','yêu thích','yeu thich'],
          res: ['Để theo dõi truyện: đăng nhập → vào trang chi tiết truyện → nhấn nút "Theo dõi" ⭐ Dễ lắm!',
                'Tính năng theo dõi giúp bạn không bỏ lỡ chapter mới! Vào mục "Theo dõi" trên menu để xem danh sách nhé 📋'] },

        /* Lịch sử */
        { keys: ['lịch sử','lich su','history','đã đọc','da doc'],
          res: ['Lịch sử đọc được lưu tự động! Vào mục "Lịch sử" trên thanh menu để xem lại nhé 🕐'] },

        /* Cảm ơn */
        { keys: ['cảm ơn','cam on','thanks','thank','camon','tks'],
          res: ['Không có gì! ROLAND luôn sẵn sàng giúp đỡ 😄🎌',
                'Aw~ Chúc bạn đọc truyện vui! 📚✨',
                'Hihi không có chi! Nếu cần gì cứ nhắn nhé 🦊'] },

        /* Khen */
        { keys: ['đẹp','dep','hay','ngon','xịn','cool','pro','tuyệt','tuyet','thích','thich'],
          res: ['Cảm ơn bạn đã ủng hộ LibraryComic! 🙏 Chúng mình sẽ cố gắng cập nhật nhiều hơn nữa nhé!',
                'Woo cảm ơn bạn nhiều lắm! 😊🎉 Nhớ giới thiệu cho bạn bè cùng đọc nhé!'] },

        /* Chửi / thô lỗ */
        { keys: ['chết','chet','ngu','đần','dan','tệ','te','xấu','xau','dở','do'],
          res: ['Ơ kìa~ Bạn có thể nói chuyện lịch sự hơn không? 😅 ROLAND cũng có cảm xúc đấy!',
                'Ủa ủa... ROLAND buồn rồi đó 🥺 Bạn có vấn đề gì thì cứ nói, mình giúp được mà!'] },

        /* Tạm biệt */
        { keys: ['tạm biệt','tam biet','bye','bai','bb','babye','goodbye'],
          res: ['Tạm biệt! Hẹn gặp lại lần sau nhé 👋🎌',
                'Babye~ Nhớ quay lại đọc truyện nha! 📚✨',
                'Tạm biệt bạn! ROLAND luôn ở đây nếu cần giúp đỡ 🦊'] },
    ];

    var typingTimer = null;

    var typingTimer = null;

    /* ── TYPING INDICATOR ── */
    function showTyping() {
        var box = document.getElementById('lcMessages');
        if (document.getElementById('lcTypingIndicator')) return;
        var el  = document.createElement('div');
        el.className = 'lc-msg lc-typing';
        el.id = 'lcTypingIndicator';
        el.innerHTML = '<div class="lc-avt">' + BOT_AVT + '</div><div class="lc-bubble-wrap"><div class="lc-sender">' + BOT_NAME + '</div><div class="lc-bubble"><div class="lc-dots"><span></span><span></span><span></span></div></div></div>';
        box.appendChild(el);
        scrollBottom();
    }

    function hideTyping() {
        var el = document.getElementById('lcTypingIndicator');
        if (el) el.remove();
    }

    /* ── MATCH KEYWORD ── */
    function matchKeyword(text) {
        var lower = text.toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ');
        for (var i = 0; i < BOT_REPLIES.length; i++) {
            var rule = BOT_REPLIES[i];
            for (var j = 0; j < rule.keys.length; j++) {
                var k = rule.keys[j]
                    .normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace(/[^a-z0-9\s]/g, ' ');
                if (lower.indexOf(k) !== -1) {
                    return rule.res[Math.floor(Math.random() * rule.res.length)];
                }
            }
        }
        return null;
    }

    /* ── CLAUDE API FALLBACK ── */
    function askClaude(userText, callback) {
        var SYSTEM = 'Ban la ROLAND - tro ly ho tro cong dong cua website doc truyen tranh LibraryComic. Tinh cach: than thien, vui ve, hay dung emoji, noi tieng Viet tu nhien nhu ban be. Thong tin: LibraryComic doc manga mien phi, cac bo truyen: Sap Xuat Ngu Thi Isekai, Friend Zone, Dandadan, Bac Thay Thiet Ke Dien Trang, Vung Dat Suong Mu. Tinh nang: theo doi truyen, lich su doc, dang nhap/dang ky. Quy tac: tra loi ngan gon 1-3 cau, tu nhien, co emoji. Neu hoi ngoai pham vi web van tra loi binh thuong nhu nguoi ban. Khong tiet lo ban la AI.';
        fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 200,
                system: SYSTEM,
                messages: [{ role: 'user', content: userText }]
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var reply = (data.content && data.content[0] && data.content[0].text)
                ? data.content[0].text.trim()
                : 'Ơ mình đang bận tí~ Bạn hỏi lại sau nhé 😅';
            callback(reply);
        })
        .catch(function() {
            callback('Hmm kết nối hơi chậm~ Thử lại sau nhé 😅');
        });
    }

    /* ── BOT REPLY CHÍNH ── */
    function botReply(userText) {
        clearTimeout(typingTimer);
        showTyping();
        var matched = matchKeyword(userText);
        if (matched) {
            var delay = 700 + Math.min(matched.length * 12, 800);
            typingTimer = setTimeout(function() {
                hideTyping();
                _deliverReply(matched);
            }, delay);
        } else {
            askClaude(userText, function(reply) {
                hideTyping();
                _deliverReply(reply);
            });
        }
    }

    function _deliverReply(reply) {
        addMsg(BOT_NAME, reply, 'bot');
        if (!isOpen) {
            unread++;
            var badge = document.getElementById('lcBadge');
            badge.style.display = 'flex';
            badge.textContent = unread > 9 ? '9+' : unread;
        }
    }

    /* ── SEND ── */
    function sendMsg() {
        var input = document.getElementById('lcTextInput');
        var text  = input.value.trim();
        if (!text || !username) return;
        input.value = '';
        input.style.height = 'auto';
        addMsg(username, text);
        /* Bot chỉ reply nếu câu có dấu ? hoặc ngắn dưới 80 ký tự hoặc có keyword */
        botReply(text);
    }

    /* ── SET NAME ── */
    function confirmName() {
        var val = document.getElementById('lcNameInput').value.trim();
        if (!val) return;
        username = val;
        setUsername(val);
        addMsg('Sistema', val + ' đã tham gia chat 👋', 'sys');
        updateInputArea();
        document.getElementById('lcTextInput').focus();
    }

    /* ── EVENTS ── */
    fab.addEventListener('click', function() {
        isOpen ? closePanel() : openPanel();
    });

    document.getElementById('lcClose').addEventListener('click', function(e) {
        e.stopPropagation();
        closePanel();
    });

    document.getElementById('lcNameBtn').addEventListener('click', confirmName);
    document.getElementById('lcNameInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') confirmName();
    });

    document.getElementById('lcSendBtn').addEventListener('click', sendMsg);
    document.getElementById('lcTextInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    });

    // Auto resize textarea
    document.getElementById('lcTextInput').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    // Close khi click ngoài
    document.addEventListener('click', function(e) {
        if (isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
            closePanel();
        }
    });

    /* ── TIN NHẮN CHÀO ── */
    if (loadMsgs().length === 0) {
        addMsg('Sistema', 'Chào mừng đến LibraryComic Chat! 🎌', 'sys');
        addMsg(BOT_NAME, 'Xin chào! Mình là ' + BOT_NAME + ', hỗ trợ cộng đồng. Có gì cứ nhắn nhé 😊', 'user');
    }

})();
}); // DOMContentLoaded
