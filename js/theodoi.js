/**
 * ============================================================
 * theodoi.js — Logic riêng cho trang theo dõi (theodoi.html)
 * Chức năng: Hiển thị, bỏ theo dõi, xóa danh sách theo dõi
 *            Yêu cầu đăng nhập mới xem được
 * ============================================================
 */


/* ============================================================
   RENDER TRANG THEO DÕI
   Kiểm tra đăng nhập → hiển thị danh sách hoặc yêu cầu login
============================================================ */
function renderFollowPage() {
    var user = localStorage.getItem("loggedUser");
    var page = document.getElementById("pageContent");

    /* Chưa đăng nhập → hiện thông báo */
    if (!user) {
        page.innerHTML =
            '<div class="empty-state">' +
            '<p>Ban can dang nhap de xem danh sach theo doi.</p>' +
            '<a href="./login.html">Dang nhap ngay</a>' +
            '</div>';
        return;
    }

    /* Lấy danh sách theo dõi của tài khoản này */
    var follows = JSON.parse(localStorage.getItem("followList_" + user)) || [];

    /* Thanh tiêu đề + nút xóa tất cả */
    var html =
        '<div class="page-top">' +
        '<h1>Truyen dang theo doi</h1>' +
        '<button class="clear-btn" onclick="clearFollow()">Xoa tat ca</button>' +
        '</div>';

    /* Hiện trạng thái rỗng nếu chưa theo dõi truyện nào */
    if (follows.length === 0) {
        html +=
            '<div class="empty-state">' +
            '<p>Ban chua theo doi truyen nao.</p>' +
            '<a href="./index.html">Kham pha truyen</a>' +
            '</div>';
    } else {
        /* Tạo grid card cho từng bộ đang theo dõi */
        html += '<div class="manga-list" id="followGrid">';
        follows.forEach(function(manga, index) {
            html +=
                '<div style="position:relative;">' +
                '<a href="' + manga.link + '" class="manga-link">' +
                '<div class="manga-card">' +
                '<img src="' + manga.img + '" alt="' + manga.title + '">' +
                '<div class="manga-info">' +
                '<div class="manga-title">' + manga.title + '</div>' +
                '<div class="manga-chapter">Dang theo doi</div>' +
                '</div></div></a>' +
                /* Nút X bỏ theo dõi, truyền index để xóa đúng phần tử */
                '<button class="unfollow-btn" onclick="unfollow(' + index + ')" title="Bo theo doi">x</button>' +
                '</div>';
        });
        html += '</div>';
    }

    page.innerHTML = html;
}


/* ============================================================
   BỎ THEO DÕI MỘT BỘ TRUYỆN
   Xóa theo index trong mảng và render lại trang
============================================================ */
function unfollow(index) {
    var user = localStorage.getItem("loggedUser");
    if (!user) return;

    var key     = "followList_" + user;
    var follows = JSON.parse(localStorage.getItem(key)) || [];
    follows.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(follows));

    /* Render lại danh sách */
    renderFollowPage();
}


/* ============================================================
   XÓA TOÀN BỘ DANH SÁCH THEO DÕI
   Xóa key followList_[user] và render lại
============================================================ */
function clearFollow() {
    var user = localStorage.getItem("loggedUser");
    if (!user) return;

    if (confirm("Xoa tat ca truyen dang theo doi?")) {
        localStorage.removeItem("followList_" + user);
        renderFollowPage();
    }
}


/* Chạy ngay khi trang load */
renderFollowPage();
