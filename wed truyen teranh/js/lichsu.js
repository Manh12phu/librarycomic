/**
 * ============================================================
 * lichsu.js — Logic riêng cho trang lịch sử đọc (lichsu.html)
 * Chức năng: Hiển thị, xóa lịch sử đọc truyện từ localStorage
 * ============================================================
 */


/* ============================================================
   LOAD VÀ RENDER LỊCH SỬ ĐỌC
   Đọc "comicHistory" từ localStorage và tạo danh sách card
============================================================ */
function loadHistory() {
    var history   = JSON.parse(localStorage.getItem("comicHistory")) || [];
    var container = document.getElementById("historyList");
    var empty     = document.getElementById("emptyHistory");

    /* Hiện trạng thái rỗng nếu chưa đọc truyện nào */
    if (history.length === 0) {
        container.style.display = "none";
        empty.style.display     = "block";
        return;
    }

    container.style.display = "";
    empty.style.display     = "none";
    container.innerHTML     = "";

    /* Tạo card cho từng bộ truyện đã đọc */
    history.forEach(function(comic) {
        container.innerHTML +=
            '<a href="' + comic.link + '" class="manga-link">' +
            '<div class="manga-card">' +
            '<img src="' + comic.img + '" alt="' + comic.title + '">' +
            '<div class="manga-info">' +
            '<div class="manga-title">' + comic.title + '</div>' +
            '<div class="manga-chapter">Da doc</div>' +
            '</div></div></a>';
    });
}


/* ============================================================
   XÓA TOÀN BỘ LỊCH SỬ
   Xóa key "comicHistory" khỏi localStorage và render lại
============================================================ */
function clearHistory() {
    if (confirm("Xoa toan bo lich su doc?")) {
        localStorage.removeItem("comicHistory");
        loadHistory();
    }
}


/* Chạy ngay khi trang load */
loadHistory();
