/**
 * ============================================================
 * index.js — Logic riêng cho trang chủ (index.html)
 * Chức năng: Khởi tạo dữ liệu mặc định, render danh sách
 *            truyện, lọc thể loại, tìm kiếm
 * ============================================================
 */


/* ============================================================
   DỮ LIỆU MẶC ĐỊNH
   Chỉ chạy 1 lần khi chưa có mangaList trong localStorage
   Sau đó admin.html sẽ quản lý dữ liệu này
============================================================ */
function initDefaultManga() {
    if (localStorage.getItem("mangaList")) return;

    var defaults = [
        {
            id: "1",
            title: "Sap Xuat Ngu Thi Isekai",
            author: "Dang cap nhat",
            folder: "sap-xuat-ngu-then-isekai",
            img: "./images/poste1.jpg",
            status: "ongoing",
            genres: ["isekai", "action"],
            desc: "Sau khi sap xuat ngu thi bi dich chuyen sang the gioi khac.",
            detailLink: "./xap_xuat_ngu.html",
            chapters: [
                { title: "Chapter 1: Su xui xeo tot do", file: "./chapter1botruyen1.html", pages: 66 },
                { title: "Chapter 2: Su gap go",          file: "./chapter1botruyen2.html", pages: 45 }
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
                { title: "Chapter 1", file: "./chapter2botruyen1.html", pages: 10 },
                { title: "Chapter 2", file: "./chapter2botruyen2.html", pages: 10 }
            ]
        },
        {
            id: "3",
            title: "Dandadan",
            author: "Yukinobu Tatsu",
            folder: "dandadan",
            img: "./images/dandadan.jpg",
            status: "ongoing",
            genres: ["action", "comedy"],
            desc: "Cuoc song hang ngay cua cau hoc sinh voi nhung cuoc gap go ky la.",
            detailLink: "./dandadan.html",
            chapters: [
                { title: "Chapter 1: Su gap go",      file: "./chapter3botruyen1.html", pages: 62 },
                { title: "Chapter 2: Alien dau sumo", file: "./chapter3botruyen2.html", pages: 49 }
            ]
        },
        {
            id: "4",
            title: "Bac Thay Thiet Ke Dien Trang",
            author: "Dang cap nhat",
            folder: "Bậc Thầy Thiết Kế Điền Trang",
            img: "./images/bttdt.jpg",
            status: "ongoing",
            genres: ["isekai", "comedy"],
            desc: "Chuyen ve mot nguoi bi dich chuyen den the gioi khac.",
            detailLink: "./Bac_Thay_Thiet_Ke_Dien_Trang.html",
            chapters: [
                { title: "Chapter 1: The gioi moi",   file: "./chapter4botruyen1.html", pages: 116 },
                { title: "Chapter 2: Dien trang dau", file: "./chapter4botruyen2.html", pages: 70 }
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
                { title: "Chapter 1: Su xui xeo tot do", file: "./chapter5botruyen1.html", pages: 105 },
                { title: "Chapter 2: Su gap go",          file: "./chapter5botruyen2.html", pages: 73 }
            ]
        }
    ];

    localStorage.setItem("mangaList", JSON.stringify(defaults));
}


/* ============================================================
   RENDER DANH SÁCH TRUYỆN
   Đọc từ localStorage, tạo HTML card cho từng bộ truyện
   filterGenre: lọc theo thể loại, null = hiển thị tất cả
============================================================ */
function renderMangaGrid(filterGenre) {
    var list = JSON.parse(localStorage.getItem("mangaList")) || [];
    var grid = document.getElementById("mangaGrid");

    /* Lọc theo thể loại nếu có */
    var filtered = list;
    if (filterGenre && filterGenre !== "all") {
        filtered = list.filter(function(m) {
            return (m.genres || []).includes(filterGenre);
        });
    }

    /* Hiện thông báo nếu không có truyện */
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:#555; padding:20px 0;">Khong co truyen nao.</p>';
        return;
    }

    /* Tạo HTML card cho từng bộ truyện */
    grid.innerHTML = filtered.map(function(m) {
        var genres = (m.genres || []).join(" ");
        var titleSafe = m.title.replace(/'/g, "\\'");
        return '<a href="' + (m.detailLink || "#") + '" class="manga-link" data-genre="' + genres + '"' +
               ' onclick="saveHistory(\'' + titleSafe + '\',\'' + m.img + '\',\'' + m.detailLink + '\')">' +
               '<div class="manga-card">' +
               '<img src="' + m.img + '" alt="' + m.title + '" onerror="this.style.background=\'#333\';this.style.height=\'200px\'">' +
               '<div class="manga-info">' +
               '<div class="manga-title">' + m.title + '</div>' +
               '<div class="manga-chapter">' + (m.chapters || []).length + ' chuong</div>' +
               '</div></div></a>';
    }).join("");
}


/* ============================================================
   LỌC THỂ LOẠI TRÊN TRANG CHỦ
   Ghi đè sự kiện click của dropdown để render lại grid
   thay vì ẩn/hiện DOM (vì grid được tạo động)
============================================================ */
document.querySelectorAll(".dropdown-content a[data-filter]").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
        e.preventDefault();
        var g = this.dataset.filter;

        /* Đóng dropdown sau khi chọn */
        var content = document.getElementById("dropdownContent");
        var dropBtn = document.getElementById("dropbtnLink");
        if (content) content.classList.remove("open");
        if (dropBtn) dropBtn.classList.remove("open");

        /* Render lại với thể loại đã chọn */
        renderMangaGrid(g);
    });
});


/* ============================================================
   TÌM KIẾM TRỰC TIẾP TRÊN TRANG CHỦ
   Ghi đè sự kiện keyup của searchInput để lọc từ mangaList
   thay vì lọc DOM (vì grid được tạo động)
============================================================ */
var searchEl = document.getElementById("searchInput");
if (searchEl) {
    searchEl.addEventListener("keyup", function() {
        var kw = this.value.toLowerCase();
        var list = JSON.parse(localStorage.getItem("mangaList")) || [];

        /* Lọc theo tên truyện */
        var filtered = kw
            ? list.filter(function(m) { return m.title.toLowerCase().includes(kw); })
            : list;

        var grid = document.getElementById("mangaGrid");
        grid.innerHTML = filtered.map(function(m) {
            var titleSafe = m.title.replace(/'/g, "\\'");
            return '<a href="' + (m.detailLink || "#") + '" class="manga-link" data-genre="' + (m.genres || []).join(" ") + '"' +
                   ' onclick="saveHistory(\'' + titleSafe + '\',\'' + m.img + '\',\'' + m.detailLink + '\')">' +
                   '<div class="manga-card">' +
                   '<img src="' + m.img + '" alt="' + m.title + '" onerror="this.style.background=\'#333\';this.style.height=\'200px\'">' +
                   '<div class="manga-info">' +
                   '<div class="manga-title">' + m.title + '</div>' +
                   '<div class="manga-chapter">' + (m.chapters || []).length + ' chuong</div>' +
                   '</div></div></a>';
        }).join("");
    });
}


/* ============================================================
   KHỞI CHẠY KHI TRANG LOAD
   1. Nạp dữ liệu mặc định nếu chưa có
   2. Render danh sách truyện (có thể lọc theo URL param)
============================================================ */
initDefaultManga();

var urlParams = new URLSearchParams(window.location.search);
renderMangaGrid(urlParams.get("genre"));
