/**
 * ============================================================
 * admin.js — Logic trang quản trị
 * Chức năng: đăng nhập admin, quản lý truyện (thêm/sửa/xóa),
 *            tạo file HTML chapter tự động, tải file chi tiết
 * ============================================================
 */
// ===== CẤU HÌNH ADMIN =====
// ĐỔI MẬT KHẨU Ở ĐÂY
const ADMIN_USER = "admin";
const ADMIN_PASS = "comic2026";

// ===== LOGIN GATE =====
function checkAdminLogin() {
    const u = document.getElementById("gateUser").value.trim();
    const p = document.getElementById("gatePass").value.trim();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        sessionStorage.setItem("adminAuth", "1");
        document.getElementById("adminGate").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadPanel();
    } else {
        document.getElementById("gateError").style.display = "block";
        document.getElementById("gatePass").value = "";
    }
}

function adminLogout() {
    sessionStorage.removeItem("adminAuth");
    location.reload();
}

// Auto-login nếu đã login trong session
if (sessionStorage.getItem("adminAuth") === "1") {
    document.getElementById("adminGate").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
}

// ===== DATA =====
function getMangaList() {
    return JSON.parse(localStorage.getItem("mangaList")) || getDefaultManga();
}

function saveMangaList(list) {
    localStorage.setItem("mangaList", JSON.stringify(list));
}

// Dữ liệu mặc định (truyện đã có sẵn)
function getDefaultManga() {
    const defaults = [
        {
            id: "1",
            title: "Sap Xuat Ngu Thi Isekai",
            author: "Dang cap nhat",
            folder: "sap-xuat-ngu-then-isekai",
            img: "./images/poste1.jpg",
            status: "ongoing",
            genres: ["isekai","action"],
            desc: "Sau khi sap xuat ngu thi bi dich chuyen sang the gioi khac.",
            detailLink: "./xap_xuat_ngu.html",
            chapters: [
                { title: "Chapter 1: Su xui xeo tot do", file: "./chapter1botruyen1.html" },
                { title: "Chapter 2: Su gap go",         file: "./chapter1botruyen2.html" }
            ]
        },
        {
            id: "2",
            title: "Friend Zone",
            author: "Dang cap nhat",
            folder: "friendzone",
            img: "./images/fiend zone.jpg",
            status: "ongoing",
            genres: ["romance"],
            desc: "Cau chuyen ve tinh ban va tinh yeu.",
            detailLink: "./friendzone.html",
            chapters: [
                { title: "Chapter 1", file: "./chapter2botruyen1.html" },
                { title: "Chapter 2", file: "./chapter2botruyen2.html" }
            ]
        },
        {
            id: "3",
            title: "Dandadan",
            author: "Yukinobu Tatsu",
            folder: "dandadan",
            img: "./images/dandadan.jpg",
            status: "ongoing",
            genres: ["action","comedy"],
            desc: "Cuoc song hang ngay cua cau hoc sinh voi nhung cuoc gap go ky la.",
            detailLink: "./dandadan.html",
            chapters: [
                { title: "Chapter 1: Su gap go",       file: "./chapter3botruyen1.html" },
                { title: "Chapter 2: Alien dau sumo",  file: "./chapter3botruyen2.html" }
            ]
        },
        {
            id: "4",
            title: "Bac Thay Thiet Ke Dien Trang",
            author: "Dang cap nhat",
            folder: "Bậc Thầy Thiết Kế Điền Trang",
            img: "./images/bttdt.jpg",
            status: "ongoing",
            genres: ["isekai","comedy"],
            desc: "Chuyen ve mot nguoi bi dich chuyen den the gioi khac.",
            detailLink: "./Bac_Thay_Thiet_Ke_Dien_Trang.html",
            chapters: [
                { title: "Chapter 1: The gioi moi",   file: "./chapter4botruyen1.html" },
                { title: "Chapter 2: Dien trang dau", file: "./chapter4botruyen2.html" }
            ]
        },
        {
            id: "5",
            title: "Vung Dat Suong Mu",
            author: "Dang cap nhat",
            folder: "Vùng Đất Sương Mù",
            img: "./images/limpo.jpg",
            status: "ongoing",
            genres: ["adventure"],
            desc: "Mot the gioi bi bao phu boi suong mu huyen bi.",
            detailLink: "./Vung_Dat_Suong_Mu.html",
            chapters: [
                { title: "Chapter 1: Su xui xeo tot do", file: "./chapter5botruyen1.html" },
                { title: "Chapter 2: Su gap go",          file: "./chapter5botruyen2.html" }
            ]
        }
    ];
    saveMangaList(defaults);
    return defaults;
}

// ===== LOAD PANEL =====
function loadPanel() {
    renderStats();
    renderTable();
    addChapterRow(); // 1 chapter row mặc định
}

function renderStats() {
    const list = getMangaList();
    document.getElementById("statTotal").textContent = list.length;
    document.getElementById("statChapters").textContent = list.reduce((s, m) => s + (m.chapters?.length || 0), 0);
    document.getElementById("statOngoing").textContent = list.filter(m => m.status === "ongoing").length;
    document.getElementById("statCompleted").textContent = list.filter(m => m.status === "completed").length;
    document.getElementById("mangaCount").textContent = list.length;
}

function renderTable() {
    const list = getMangaList();
    const body = document.getElementById("mangaTableBody");

    if (list.length === 0) {
        body.innerHTML = '<div class="empty-table">Chua co truyen nao.</div>';
        return;
    }

    body.innerHTML = list.map(m => `
        <div class="manga-row">
            <img src="${m.img}" alt="${m.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2242%22 height=%2258%22><rect fill=%22%23333%22 width=%2242%22 height=%2258%22/></svg>'">
            <div>
                <div class="manga-name">${m.title}</div>
                <div class="manga-sub">${m.author} &bull; ${(m.chapters||[]).length} chuong &bull; <span style="color:#ff8c00">manga/${m.folder}/</span></div>
            </div>
            <div class="genre-tags">
                ${(m.genres||[]).map(g => `<span class="genre-tag">${g}</span>`).join("")}
            </div>
            <div>
                <span class="status-badge ${m.status === 'completed' ? 'status-completed' : 'status-ongoing'}">
                    ${m.status === 'completed' ? 'Hoan thanh' : 'Dang cap nhat'}
                </span>
            </div>
            <div class="row-actions">
                <button class="btn-edit" onclick="editManga('${m.id}')">Sua</button>
                <button class="btn-edit" onclick="downloadDetailPage('${m.id}')" style="color:#ffaa44;border-color:#5533001a;">Tai file</button>
                <button class="btn-delete" onclick="deleteManga('${m.id}')">Xoa</button>
            </div>
        </div>
    `).join("");
}

// ===== FORM =====
let chapterCount = 0;

function addChapterRow(title = "", pages = "") {
    chapterCount++;
    const builder = document.getElementById("chaptersBuilder");
    const row = document.createElement("div");
    row.className = "chapter-row";
    row.id = "chrow-" + chapterCount;
    row.innerHTML = `
        <input type="text" placeholder="Ten chuong (Vi du: Chapter 1: Mo dau)" value="${title}" class="ch-title" style="flex:2">
        <input type="number" placeholder="So trang" value="${pages}" class="ch-pages" min="1" style="flex:0 0 90px; max-width:90px;" title="So luong anh (trang) trong chuong nay">
        <button class="rm-btn" onclick="removeChapterRow('chrow-${chapterCount}')">&times;</button>
    `;
    builder.appendChild(row);
}

function removeChapterRow(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function toggleGenre(label) {
    const cb = label.querySelector("input");
    cb.checked = !cb.checked;
    label.classList.toggle("checked", cb.checked);
}

function previewImg(src) {
    const el = document.getElementById("imgPreview");
    if (src.trim()) {
        el.src = src;
        el.style.display = "block";
    } else {
        el.style.display = "none";
    }
}

function resetForm() {
    document.getElementById("editId").value = "";
    document.getElementById("fTitle").value = "";
    document.getElementById("fAuthor").value = "";
    document.getElementById("fFolder").value = "";
    document.getElementById("fImg").value = "";
    document.getElementById("fDesc").value = "";
    document.getElementById("fStatus").value = "ongoing";
    document.getElementById("imgPreview").style.display = "none";
    document.getElementById("formTitle").textContent = "Them truyen moi";

    // Reset genres
    document.querySelectorAll(".genre-check").forEach(l => {
        l.querySelector("input").checked = false;
        l.classList.remove("checked");
    });

    // Reset chapters
    document.getElementById("chaptersBuilder").innerHTML = "";
    chapterCount = 0;
    addChapterRow();
}

function saveManga() {
    const title   = document.getElementById("fTitle").value.trim();
    const folder  = document.getElementById("fFolder").value.trim();
    const img     = document.getElementById("fImg").value.trim();

    if (!title || !folder || !img) {
        showToast("Vui long nhap day du: Ten, Thu muc, Anh bia!", "error");
        return;
    }

    const genres = [];
    document.querySelectorAll(".genre-check input:checked").forEach(cb => genres.push(cb.value));

    const chapters = [];
    document.querySelectorAll(".chapter-row").forEach((row, idx) => {
        const t = row.querySelector(".ch-title").value.trim();
        const p = parseInt(row.querySelector(".ch-pages").value) || 0;
        if (t) chapters.push({ title: t, pages: p, index: idx + 1 });
    });

    const editId = document.getElementById("editId").value;
    const list = getMangaList();

    const manga = {
        id: editId || Date.now().toString(),
        title,
        author:    document.getElementById("fAuthor").value.trim() || "Dang cap nhat",
        folder,
        img,
        status:    document.getElementById("fStatus").value,
        genres,
        desc:      document.getElementById("fDesc").value.trim(),
        detailLink: `./${folder.replace(/\s+/g, "_")}.html`,
        chapters
    };

    if (editId) {
        const idx = list.findIndex(m => m.id === editId);
        if (idx !== -1) list[idx] = manga;
        showToast("Da cap nhat truyen thanh cong!");
    } else {
        list.push(manga);
        showToast("Da them truyen moi thanh cong!");
    }

    saveMangaList(list);

    // Tạo file HTML cho các chapter mới
    generateChapterFiles(manga);

    renderStats();
    renderTable();
    resetForm();
}

// ===== TẠO FILE CHAPTER HTML =====
function generateChapterFiles(manga) {
    if (!manga.chapters || manga.chapters.length === 0) return;

    const mangaKey = manga.folder;
    const total = manga.chapters.length;

    manga.chapters.forEach(function(chap, idx) {
        const chapNum = idx + 1;
        const prevFile = idx > 0 ? `./${manga.id}_chapter${idx}.html` : "#";
        const nextFile = idx < total - 1 ? `./${manga.id}_chapter${chapNum + 1}.html` : "#";
        const fileName = `${manga.id}_chapter${chapNum}.html`;

        // Cập nhật file link vào chapter data
        manga.chapters[idx].file = `./${fileName}`;

        const html = buildChapterHTML(manga, chap, chapNum, total, mangaKey, prevFile, nextFile);

        // Tạo blob và link download
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Cập nhật lại list với file links
    const list = getMangaList();
    const idx2 = list.findIndex(m => m.id === manga.id);
    if (idx2 !== -1) {
        list[idx2].chapters = manga.chapters;
        saveMangaList(list);
    }
}

function buildChapterHTML(manga, chap, chapNum, total, mangaKey, prevFile, nextFile) {
    const prevDisabled = prevFile === "#" ? "disabled" : "";
    const nextDisabled = nextFile === "#" ? "disabled" : "";
    const prevHref = prevFile === "#" ? "#" : prevFile;
    const nextHref = nextFile === "#" ? "#" : nextFile;

    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chap.title} - ${manga.title} - Library Comic</title>
    <link rel="stylesheet" href="./css/style.css">
    <style>
        .reader-wrap { background: #0d0d0d; min-height: 100vh; }
        .breadcrumb { display:flex; align-items:center; gap:8px; padding:12px 20px; background:#161616; border-bottom:1px solid #222; font-size:13px; color:#666; flex-wrap:wrap; }
        .breadcrumb a { color:#999; transition:color 0.2s; } .breadcrumb a:hover { color:#ff4c4c; }
        .breadcrumb .sep { color:#444; } .breadcrumb .current { color:#ff4c4c; font-weight:bold; }
        .reader-controls { display:flex; align-items:center; justify-content:space-between; padding:10px 20px; background:#161616; border-bottom:1px solid #1e1e1e; gap:10px; flex-wrap:wrap; position:sticky; top:58px; z-index:100; }
        .reader-title { font-size:14px; color:#ccc; font-weight:bold; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .reader-title span { color:#ff4c4c; }
        .reader-nav { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .nav-btn { padding:7px 16px; background:#2a2a2a; color:#ccc; border:1px solid #333; border-radius:5px; font-size:13px; cursor:pointer; transition:0.2s; font-family:inherit; white-space:nowrap; }
        .nav-btn:hover:not(:disabled) { background:#ff4c4c; color:white; border-color:#ff4c4c; }
        .nav-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .chapter-select-wrap { position:relative; }
        .chapter-select-btn { padding:7px 14px; background:#222; color:#ccc; border:1px solid #333; border-radius:5px; font-size:13px; cursor:pointer; transition:0.2s; font-family:inherit; }
        .chapter-select-btn:hover { background:#333; color:white; }
        .chapter-dropdown { display:none; position:absolute; top:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#1e1e1e; border:1px solid #333; border-radius:8px; min-width:160px; z-index:500; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.6); }
        .chapter-dropdown.open { display:block; }
        .chapter-dropdown a { display:block; padding:11px 16px; color:#ccc; font-size:13px; transition:0.15s; border-bottom:1px solid #252525; }
        .chapter-dropdown a:last-child { border-bottom:none; } .chapter-dropdown a:hover { background:#ff4c4c; color:white; } .chapter-dropdown a.active { color:#ff4c4c; font-weight:bold; }
        .reader-images { display:flex; flex-direction:column; align-items:center; background:#0d0d0d; }
        .reader-images img { width:720px; max-width:100%; display:block; margin:0 auto; }
        .reader-bottom { display:flex; align-items:center; justify-content:center; gap:12px; padding:24px 20px; background:#161616; border-top:1px solid #222; }
        .reader-bottom .nav-btn { padding:10px 28px; font-size:14px; }
        .comment-section { max-width:760px; margin:0 auto; padding:28px 20px 40px; }
        @media(max-width:768px){ .reader-controls{top:56px;padding:8px 12px;} .nav-btn{padding:7px 10px;font-size:12px;} .chapter-dropdown{left:auto;right:0;transform:none;} .breadcrumb{padding:10px 14px;font-size:12px;} }
    </style>
</head>
<body class="reader-wrap">
<header>
    <a href="./index.html" class="logo"><span class="logo-text">Library<span class="logo-accent">Comic</span></span></a>
    <button class="hamburger" id="hamburgerBtn" onclick="toggleMenu()"><span></span><span></span><span></span></button>
    <nav class="menu" id="mainMenu">
        <a href="./index.html">Trang chu</a>
        <a href="./theodoi.html">Theo doi</a>
        <a href="./lichsu.html">Lich su</a>
        <div class="dropdown" id="genreDropdown">
            <a href="#" class="dropbtn" id="dropbtnLink" onclick="toggleDropdown(event)">The loai</a>
            <div class="dropdown-content" id="dropdownContent">
                <a href="index.html?genre=all">Tat ca</a>
                <a href="index.html?genre=action">Hanh dong</a>
                <a href="index.html?genre=adventure">Phieu luu</a>
                <a href="index.html?genre=isekai">Isekai</a>
                <a href="index.html?genre=romance">Romance</a>
                <a href="index.html?genre=comedy">Hai</a>
            </div>
        </div>
        <div class="menu-auth-mobile" id="mobileAuthArea">
            <a href="./login.html" class="btn-login-mobile">Dang nhap</a>
            <a href="./login.html?tab=register" class="btn-register-mobile">Dang ky</a>
        </div>
    </nav>
    <div class="search"><input type="text" id="searchInput" placeholder="Tim truyen..."></div>
    <div class="theme-toggle"><button onclick="toggleTheme()">&#9728;</button></div>
    <div class="account" id="menuAccount">
        <a href="./login.html?tab=register" class="btn-register">Dang ky</a>
        <a href="./login.html" class="btn-login">Dang nhap</a>
    </div>
</header>

<div class="breadcrumb">
    <a href="./index.html">Trang chu</a>
    <span class="sep">&rsaquo;</span>
    <a href="${manga.detailLink}">${manga.title}</a>
    <span class="sep">&rsaquo;</span>
    <span class="current">${chap.title}</span>
</div>

<div class="reader-controls">
    <div class="reader-title"><span>${manga.title}</span> &mdash; ${chap.title}</div>
    <div class="reader-nav">
        <a href="${prevHref}"><button class="nav-btn" ${prevDisabled}>&lsaquo; Truoc</button></a>
        <div class="chapter-select-wrap">
            <button class="chapter-select-btn" onclick="toggleChapterDrop(event)">Chuong ${chapNum} / ${total}</button>
            <div class="chapter-dropdown" id="chapterDrop">
                ${manga.chapters.map((c, i) => `<a href="./${manga.id}_chapter${i+1}.html" class="${i+1===chapNum?'active':''}">${c.title}</a>`).join("")}
            </div>
        </div>
        <a href="${nextHref}"><button class="nav-btn" ${nextDisabled}>Sau &rsaquo;</button></a>
    </div>
</div>

<div class="reader-images" id="chapterImages"
    data-manga="${mangaKey}"
    data-chapter="chapter${chapNum}"
    data-pages="${chap.pages}">
</div>

<div class="reader-bottom">
    <a href="${prevHref}"><button class="nav-btn" ${prevDisabled}>&lsaquo; Chuong truoc</button></a>
    <a href="${manga.detailLink}"><button class="nav-btn">Danh sach chuong</button></a>
    <a href="${nextHref}"><button class="nav-btn" ${nextDisabled}>Chuong sau &rsaquo;</button></a>
</div>

<div class="comment-section">
    <h2 style="border-left:4px solid #ff4c4c;padding-left:12px;font-size:16px;margin-bottom:16px;">Binh luan</h2>
    <div class="comment-input">
        <input type="text" id="nameInput" placeholder="Ten cua ban">
        <textarea id="commentInput" placeholder="Viet binh luan..."></textarea>
        <button onclick="addComment()">Gui</button>
    </div>
    <div id="commentList"></div>
</div>

<footer><p>&#169; 2026 LibraryComic</p></footer>
<script src="./js/script.js">

function toggleChapterDrop(e) { e.stopPropagation(); document.getElementById("chapterDrop").classList.toggle("open"); }
    document.addEventListener("click", function() { const d=document.getElementById("chapterDrop"); if(d) d.classList.remove("open"); });
    document.addEventListener("keydown", function(e) {
        if(e.key==="ArrowLeft" && "${prevHref}"!=="#") window.location.href="${prevHref}";
        if(e.key==="ArrowRight" && "${nextHref}"!=="#") window.location.href="${nextHref}";
    });