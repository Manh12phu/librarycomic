/**
 * ============================================================
 * script.js — JavaScript chính của toàn bộ web LibraryComic
 * Dùng cho: index.html, lichsu.html, theodoi.html,
 *           tất cả trang chi tiết truyện và trang đọc chapter
 * ============================================================
 */


/* ============================================================
   HAMBURGER MENU — thanh menu mobile
   Hiện/ẩn nav khi nhấn nút ☰ trên điện thoại
============================================================ */
function toggleMenu() {
    const menu = document.getElementById("mainMenu");
    const btn  = document.getElementById("hamburgerBtn");
    if (!menu) return;
    menu.classList.toggle("open");
    if (btn) btn.classList.toggle("active");
}

/* Đóng hamburger menu khi người dùng click ra ngoài */
document.addEventListener("click", function(e) {
    const menu = document.getElementById("mainMenu");
    const btn  = document.getElementById("hamburgerBtn");
    if (!menu) return;
    if (!menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.remove("open");
        if (btn) btn.classList.remove("active");
    }
});


/* ============================================================
   DROPDOWN THỂ LOẠI — chỉ mở khi click, không mở khi hover
   Gắn vào nút "Thể loại" trong thanh menu
============================================================ */
function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    const content = document.getElementById("dropdownContent");
    const btn     = document.getElementById("dropbtnLink");
    if (!content) return;
    content.classList.toggle("open");
    if (btn) btn.classList.toggle("open");
}

/* Đóng dropdown khi click ra ngoài vùng dropdown */
document.addEventListener("click", function(e) {
    const dropdown = document.getElementById("genreDropdown");
    const content  = document.getElementById("dropdownContent");
    const btn      = document.getElementById("dropbtnLink");
    if (!dropdown || !content) return;
    if (!dropdown.contains(e.target)) {
        content.classList.remove("open");
        if (btn) btn.classList.remove("open");
    }
});


/* ============================================================
   LỌC THỂ LOẠI — hiển thị/ẩn truyện theo thể loại
   data-filter trên mỗi link trong dropdown
   data-genre  trên mỗi .manga-link trong trang chủ
============================================================ */
const filterButtons = document.querySelectorAll(".dropdown-content a[data-filter]");
const mangaLinks    = document.querySelectorAll(".manga-link");

filterButtons.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
        const genre = this.dataset.filter;

        /* Nếu đang ở trang khác (không phải index) → chuyển về index kèm param */
        const isIndex = window.location.pathname.includes("index.html")
            || window.location.pathname === "/"
            || window.location.pathname.endsWith("/");

        if (!isIndex) {
            window.location.href = "index.html?genre=" + genre;
            return;
        }

        e.preventDefault();

        /* Đóng dropdown sau khi chọn */
        const content = document.getElementById("dropdownContent");
        const dropBtn = document.getElementById("dropbtnLink");
        if (content) content.classList.remove("open");
        if (dropBtn) dropBtn.classList.remove("open");

        /* Hiện/ẩn từng bộ truyện theo thể loại */
        mangaLinks.forEach(function(manga) {
            const g = manga.dataset.genre || "";
            manga.style.display = (genre === "all" || g.includes(genre)) ? "block" : "none";
        });
    });
});

/* Tự động lọc khi trang load có URL param ?genre=xxx */
window.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const genre  = params.get("genre");
    if (genre && genre !== "all") {
        mangaLinks.forEach(function(manga) {
            const g = manga.dataset.genre || "";
            manga.style.display = g.includes(genre) ? "block" : "none";
        });
    }
});


/* ============================================================
   TÌM KIẾM TRUYỆN — lọc theo tên khi gõ vào ô search
   Tìm kiếm live (keyup), không cần nhấn Enter
============================================================ */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", function() {
        const kw = this.value.toLowerCase();
        mangaLinks.forEach(function(manga) {
            const t = manga.querySelector(".manga-title");
            if (!t) return;
            manga.style.display = t.textContent.toLowerCase().includes(kw) ? "block" : "none";
        });
    });

    /* Nếu đang ở trang khác, focus vào search sẽ chuyển về index */
    searchInput.addEventListener("focus", function() {
        const p = window.location.pathname;
        if (!p.includes("index.html") && p !== "/" && !p.endsWith("/")) {
            window.location.href = "index.html";
        }
    });
}


/* ============================================================
   THEME TOGGLE — chuyển đổi chế độ sáng / tối
   Lưu lựa chọn vào localStorage để nhớ khi tải lại trang
============================================================ */
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    _syncThemeLabel(isLight);
}

function _syncThemeLabel(isLight) {
    document.querySelectorAll(".toggle-label").forEach(function(el) {
        el.textContent = isLight ? "Sáng" : "Tối";
    });
}

/* Áp dụng theme đã lưu ngay khi trang load */
(function applyTheme() {
    const isLight = localStorage.getItem("theme") === "light";
    if (isLight) document.body.classList.add("light-mode");
    /* Sync label sau khi DOM ready */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() { _syncThemeLabel(isLight); });
    } else {
        _syncThemeLabel(isLight);
    }
})();


/* ============================================================
   HIỆN THÔNG TIN USER ĐÃ ĐĂNG NHẬP
   Thay nút "Đăng nhập / Đăng ký" bằng tên user + nút đăng xuất
   Chạy trên mọi trang có header
============================================================ */
function showUser() {
    const user      = localStorage.getItem("loggedUser");
    const accountEl = document.getElementById("menuAccount");
    if (!accountEl) return;

    if (user) {
        /* Cập nhật vùng account trên desktop */
        accountEl.innerHTML =
            '<span class="user-greeting">' + user + '</span>' +
            '<button class="btn-logout" onclick="logout()">Dang xuat</button>';

        /* Cập nhật vùng auth trong hamburger menu (mobile) */
        const mobileAuth = document.getElementById("mobileAuthArea");
        if (mobileAuth) {
            mobileAuth.innerHTML =
                '<span style="padding:12px 20px;color:#ff4c4c;font-weight:bold;font-size:14px;">' + user + '</span>' +
                '<a href="#" onclick="logout()" class="btn-login-mobile" style="text-align:center;margin:8px 16px 12px;">Dang xuat</a>';
        }
    }
}

/* Đăng xuất: xóa loggedUser và tải lại trang */
function logout() {
    localStorage.removeItem("loggedUser");
    location.reload();
}

/* Gọi ngay khi trang load để cập nhật header */
showUser();


/* ============================================================
   LƯU LỊCH SỬ ĐỌC TRUYỆN
   Gọi mỗi khi người dùng click vào một bộ truyện
   Lưu tối đa 20 bộ gần nhất, bộ mới nhất lên đầu
============================================================ */
function saveHistory(title, img, link) {
    let history = JSON.parse(localStorage.getItem("comicHistory")) || [];

    /* Xóa nếu truyện đã tồn tại (để đưa lên đầu) */
    history = history.filter(function(i) { return i.title !== title; });

    /* Thêm vào đầu danh sách */
    history.unshift({ title: title, img: img, link: link });

    /* Giới hạn 20 bộ gần nhất */
    history = history.slice(0, 20);

    localStorage.setItem("comicHistory", JSON.stringify(history));
}


/* ============================================================
   THEO DÕI TRUYỆN
   Yêu cầu đăng nhập — lưu theo từng tài khoản riêng
   Key: "followList_[tên tài khoản]"
============================================================ */
function followManga(title, img, link) {
    const user = localStorage.getItem("loggedUser");

    /* Chưa đăng nhập → hỏi có muốn đến trang đăng nhập không */
    if (!user) {
        if (confirm("Ban can dang nhap de theo doi truyen. Den trang dang nhap?")) {
            window.location.href = "./login.html";
        }
        return;
    }

    const key     = "followList_" + user;
    let follows   = JSON.parse(localStorage.getItem(key)) || [];

    /* Kiểm tra đã theo dõi chưa */
    if (follows.find(function(m) { return m.title === title; })) {
        alert("Truyen da duoc theo doi roi.");
        return;
    }

    follows.push({ title: title, img: img, link: link });
    localStorage.setItem(key, JSON.stringify(follows));
    alert("Da them vao danh sach theo doi!");
}


/* ============================================================
   CHUYỂN CHAPTER — nút Trước / Sau và phím tắt ← →
   Chỉ chạy trên trang chapter (URL khớp pattern chapterXbotruyenY.html)
============================================================ */
(function initChapter() {
    const path  = window.location.pathname.split("/").pop();
    const match = path.match(/(chapter\d+botruyen)(\d+)\.html/);
    if (!match) return; /* Không phải trang chapter → dừng */

    const baseName      = match[1];
    const currentChapter = parseInt(match[2]);

    /* Tổng số chapter của từng bộ truyện */
    const totalMap = {
        "chapter1botruyen": 2,  /* Sắp Xuất Ngũ */
        "chapter2botruyen": 2,  /* Friend Zone */
        "chapter3botruyen": 2,  /* Dandadan */
        "chapter4botruyen": 2,  /* Bậc Thầy Thiết Kế */
        "chapter5botruyen": 2,  /* Vùng Đất Sương Mù */
    };
    const total = totalMap[baseName] || 1;

    /* Nút chương trước */
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentChapter > 1)
                window.location.href = baseName + (currentChapter - 1) + ".html";
        };
    }

    /* Nút chương sau */
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentChapter < total)
                window.location.href = baseName + (currentChapter + 1) + ".html";
        };
    }

    /* Phím tắt ← → để chuyển chapter */
    document.addEventListener("keydown", function(e) {
        if (e.key === "ArrowLeft"  && currentChapter > 1)
            window.location.href = baseName + (currentChapter - 1) + ".html";
        if (e.key === "ArrowRight" && currentChapter < total)
            window.location.href = baseName + (currentChapter + 1) + ".html";
    });

    /* Nút danh sách chapter (popup) */
    const listBtn     = document.getElementById("listBtn");
    const chapterList = document.getElementById("chapterList");
    if (listBtn && chapterList) {
        listBtn.onclick = function() {
            chapterList.style.display =
                chapterList.style.display === "block" ? "none" : "block";
        };
    }
})();


/* ============================================================
   TẢI ẢNH CHAPTER TỰ ĐỘNG
   Đọc data-manga, data-chapter, data-pages từ thẻ div
   Tạo thẻ <img> cho từng trang: manga/[tên]/[chapter]/1.jpg ...
============================================================ */
const imgContainer = document.getElementById("chapterImages");
if (imgContainer) {
    const manga   = imgContainer.dataset.manga;
    const chapter = imgContainer.dataset.chapter;
    const pages   = parseInt(imgContainer.dataset.pages);

    for (let i = 1; i <= pages; i++) {
        const img = document.createElement("img");
        img.src   = "./manga/" + manga + "/" + chapter + "/" + i + ".jpg";
        img.alt   = "Trang " + i;
        imgContainer.appendChild(img);
    }
}


/* ============================================================
   BÌNH LUẬN — thêm bình luận vào danh sách
   Hiển thị ngay lập tức, không lưu vào server
============================================================ */
function addComment() {
    const name = document.getElementById("nameInput")?.value.trim();
    const text = document.getElementById("commentInput")?.value.trim();
    if (!name || !text) return;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML =
        '<div class="comment-name">' + name + '</div>' +
        '<div class="comment-text">' + text + '</div>';

    /* Thêm bình luận mới lên đầu danh sách */
    document.getElementById("commentList").prepend(div);

    /* Xóa nội dung ô nhập sau khi gửi */
    document.getElementById("commentInput").value = "";
}
