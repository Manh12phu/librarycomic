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

function editManga(id) {
    const list = getMangaList();
    const m = list.find(x => x.id === id);
    if (!m) return;

    document.getElementById("editId").value = m.id;
    document.getElementById("fTitle").value = m.title;
    document.getElementById("fAuthor").value = m.author;
    document.getElementById("fFolder").value = m.folder;
    document.getElementById("fImg").value = m.img;
    document.getElementById("fDesc").value = m.desc || "";
    document.getElementById("fStatus").value = m.status;
    document.getElementById("formTitle").textContent = "Chinh sua truyen: " + m.title;
    previewImg(m.img);

    // Genres
    document.querySelectorAll(".genre-check").forEach(l => {
        const val = l.querySelector("input").value;
        const checked = (m.genres || []).includes(val);
        l.querySelector("input").checked = checked;
        l.classList.toggle("checked", checked);
    });

    // Chapters
    document.getElementById("chaptersBuilder").innerHTML = "";
    chapterCount = 0;
    (m.chapters || []).forEach(c => addChapterRow(c.title, c.pages || ""));
    if (!m.chapters || m.chapters.length === 0) addChapterRow();

    // Scroll to form
    document.querySelector(".add-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteManga(id) {
    if (!confirm("Ban co chac muon xoa truyen nay?")) return;
    let list = getMangaList();
    list = list.filter(m => m.id !== id);
    saveMangaList(list);
    renderStats();
    renderTable();
    showToast("Da xoa truyen.");
}

// ===== TOAST =====
function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show" + (type === "error" ? " error" : "");
    setTimeout(() => t.className = "toast", 2800);
}

// ===== TẢI FILE TRANG CHI TIẾT =====
// CSS dùng: style.css (không cần admin.css — đó là CSS riêng cho trang admin)
function downloadDetailPage(id) {
    const list = getMangaList();
    const m = list.find(x => x.id === id);
    if (!m) return;

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${m.title} - Library Comic</title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>
<header>
    <a href="./index.html" class="logo">
        <img src="./images/librarycomic-logo.svg" alt="LibraryComic" height="48" style="display:block;">
    </a>
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
    <div class="theme-toggle">
        <div class="toggle-track" onclick="toggleTheme()" title="Chuyển chế độ sáng/tối">
            <div class="toggle-thumb">
                <svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
        </div>
        <span class="toggle-label" id="themeLabel">Tối</span>
    </div>
    <div class="account" id="menuAccount">
        <a href="./login.html?tab=register" class="btn-register">Dang ky</a>
        <a href="./login.html" class="btn-login">Dang nhap</a>
    </div>
</header>
<main>
    <section class="manga-detail">
        <img src="${m.img}" class="detail-img" alt="${m.title}">
        <div class="detail-info">
            <h1 class="detail-title">${m.title}</h1>
            <p><b>Tac gia:</b> ${m.author}</p>
            <p><b>The loai:</b> ${(m.genres||[]).map(g => `<span class="tag">${g}</span>`).join(" ")}</p>
            <p><b>Tinh trang:</b> ${m.status === "completed" ? "Hoan thanh" : "Dang cap nhat"}</p>
            <p><b>Mo ta:</b> ${m.desc||""}</p>
            <button class="follow-btn" onclick="followManga('${m.title}','${m.img}','${m.detailLink}')">Theo doi</button>
        </div>
    </section>
    <section class="chapter-list">
        <h2>Danh sach chuong</h2>
        <div class="chapters">
            ${(m.chapters||[]).map((c,i) => `<a href="./${m.id}_chapter${i+1}.html" class="chapter-item"><span>${c.title}</span></a>`).join("\n            ")}
        </div>
    </section>
</main>
<footer class="w3-container w3-dark-grey w3-padding-32">
    <div class="w3-row-padding">
        <div class="w3-third w3-margin-bottom">
            <h3 class="w3-text-red">&#128213; LibraryComic</h3>
            <p class="w3-text-light-grey">Website doc truyen tranh anime/manga mien phi. Cap nhat chapter moi nhanh nhat.</p>
            <div class="w3-margin-top">
                <a href="https://facebook.com" target="_blank" class="w3-button w3-circle w3-red w3-small w3-margin-right"><i class="fa fa-facebook"></i></a>
                <a href="https://youtube.com" target="_blank" class="w3-button w3-circle w3-red w3-small w3-margin-right"><i class="fa fa-youtube"></i></a>
                <a href="https://discord.com" target="_blank" class="w3-button w3-circle w3-red w3-small"><i class="fa fa-commenting"></i></a>
            </div>
        </div>
        <div class="w3-third w3-margin-bottom">
            <h4 class="w3-text-white">&#128279; Lien ket nhanh</h4>
            <ul style="list-style:none;padding:0;margin:0;">
                <li class="w3-padding-small"><a href="./index.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Trang chu</a></li>
                <li class="w3-padding-small"><a href="./theodoi.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Theo doi</a></li>
                <li class="w3-padding-small"><a href="./lichsu.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Lich su doc</a></li>
                <li class="w3-padding-small"><a href="./login.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Dang nhap</a></li>
                <li class="w3-padding-small"><a href="./login.html?tab=register" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Dang ky</a></li>
            </ul>
        </div>
        <div class="w3-third w3-margin-bottom">
            <h4 class="w3-text-white">&#128214; The loai</h4>
            <div class="w3-margin-bottom">
                <a href="index.html?genre=action" class="w3-tag w3-red w3-small w3-margin-bottom w3-margin-right">Hanh dong</a>
                <a href="index.html?genre=isekai" class="w3-tag w3-red w3-small w3-margin-bottom w3-margin-right">Isekai</a>
                <a href="index.html?genre=romance" class="w3-tag w3-red w3-small w3-margin-bottom w3-margin-right">Romance</a>
                <a href="index.html?genre=comedy" class="w3-tag w3-red w3-small w3-margin-bottom w3-margin-right">Hai</a>
                <a href="index.html?genre=adventure" class="w3-tag w3-red w3-small w3-margin-bottom w3-margin-right">Phieu luu</a>
            </div>
            <h4 class="w3-text-white">&#128205; Lien he</h4>
            <p class="w3-text-light-grey w3-small">
                <i class="fa fa-map-marker"></i> 72 Binh Hung Hoa, Binh Tan, TP.HCM<br>
                <i class="fa fa-envelope"></i> librarycomic@gmail.com<br>
                <i class="fa fa-clock-o"></i> Cap nhat: Hang ngay
            </p>
        </div>
    </div>
    <div class="w3-border-top w3-border-grey w3-padding-top w3-margin-top w3-center">
        <p class="w3-text-grey w3-small">&#169; 2026 LibraryComic &nbsp;|&nbsp; Khong luu tru noi dung ban quyen</p>
    </div>
</footer>
<script src="./js/script.js"><\/script>
</body>
</html>`;

    const fname = m.id + "_detail.html";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Da tai file " + fname);
}

// ===== TẠO FILE CHAPTER HTML =====
// CSS dùng: style.css + reader.css (tách riêng, không dùng inline style)
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

    // Tạo dropdown chương
    const chapterDropItems = manga.chapters.map((c, i) =>
        `<a href="./${manga.id}_chapter${i+1}.html" class="${i+1===chapNum?'active':''}">${c.title}</a>`
    ).join("");

    // CSS chỉ dùng link tag — không có inline style
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chap.title} - ${manga.title} - Library Comic</title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/reader.css">
</head>
<body class="reader-wrap">
<header>
    <a href="./index.html" class="logo">
        <img src="./images/librarycomic-logo.svg" alt="LibraryComic" height="48" style="display:block;">
    </a>
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
    <div class="theme-toggle">
        <div class="toggle-track" onclick="toggleTheme()" title="Chuyển chế độ sáng/tối">
            <div class="toggle-thumb">
                <svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
        </div>
        <span class="toggle-label" id="themeLabel">Tối</span>
    </div>
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
        <a href="${prevHref}" id="prevLink"><button class="nav-btn" ${prevDisabled}>&lsaquo; Truoc</button></a>
        <div class="chapter-select-wrap">
            <button class="chapter-select-btn" onclick="toggleChapterDrop(event)">Chuong ${chapNum} / ${total}</button>
            <div class="chapter-dropdown" id="chapterDrop">
                ${chapterDropItems}
            </div>
        </div>
        <a href="${nextHref}" id="nextLink"><button class="nav-btn" ${nextDisabled}>Sau &rsaquo;</button></a>
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

<footer class="w3-container w3-dark-grey w3-padding-32">
    <div class="w3-row-padding">
        <div class="w3-third w3-margin-bottom">
            <h3 class="w3-text-red">&#128213; LibraryComic</h3>
            <p class="w3-text-light-grey">Website doc truyen tranh anime/manga mien phi. Cap nhat chapter moi nhanh nhat.</p>
        </div>
        <div class="w3-third w3-margin-bottom">
            <h4 class="w3-text-white">&#128279; Lien ket nhanh</h4>
            <ul style="list-style:none;padding:0;margin:0;">
                <li class="w3-padding-small"><a href="./index.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Trang chu</a></li>
                <li class="w3-padding-small"><a href="./theodoi.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Theo doi</a></li>
                <li class="w3-padding-small"><a href="./lichsu.html" class="w3-text-light-grey" style="text-decoration:none;">&#8250; Lich su doc</a></li>
            </ul>
        </div>
        <div class="w3-third w3-margin-bottom">
            <h4 class="w3-text-white">&#128205; Lien he</h4>
            <p class="w3-text-light-grey w3-small">
                <i class="fa fa-map-marker"></i> 72 Binh Hung Hoa, Binh Tan, TP.HCM<br>
                <i class="fa fa-envelope"></i> librarycomic@gmail.com
            </p>
        </div>
    </div>
    <div class="w3-border-top w3-border-grey w3-padding-top w3-margin-top w3-center">
        <p class="w3-text-grey w3-small">&#169; 2026 LibraryComic</p>
    </div>
</footer>

<script src="./js/script.js"><\/script>
<script src="./js/reader.js"><\/script>
</body>
</html>`;
}
