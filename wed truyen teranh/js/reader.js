/**
 * ============================================================
 * reader.js — Logic riêng cho trang đọc truyện (chapter*.html)
 * Chức năng: Dropdown chọn chương, phím tắt ← →
 * Lưu ý: script.js vẫn xử lý tải ảnh (chapterImages)
 * ============================================================
 */


/* ============================================================
   DROPDOWN DANH SÁCH CHƯƠNG
   Hiện/ẩn popup chọn chương khi nhấn nút "Chương X / Y"
============================================================ */
function toggleChapterDrop(e) {
    e.stopPropagation(); /* Ngăn sự kiện lan ra ngoài làm đóng ngay */
    var drop = document.getElementById("chapterDrop");
    if (drop) drop.classList.toggle("open");
}

/* Đóng dropdown khi click ra ngoài */
document.addEventListener("click", function() {
    var drop = document.getElementById("chapterDrop");
    if (drop) drop.classList.remove("open");
});


/* ============================================================
   PHÍM TẮT CHUYỂN CHƯƠNG
   ← : chương trước   → : chương sau
   prevHref / nextHref được nhúng từ HTML khi tạo file
============================================================ */
document.addEventListener("keydown", function(e) {
    /* Lấy href từ nút Prev/Next để chuyển trang */
    var prevLink = document.getElementById("prevLink");
    var nextLink = document.getElementById("nextLink");

    if (e.key === "ArrowLeft"  && prevLink && prevLink.href && !prevLink.href.endsWith("#")) {
        window.location.href = prevLink.href;
    }
    if (e.key === "ArrowRight" && nextLink && nextLink.href && !nextLink.href.endsWith("#")) {
        window.location.href = nextLink.href;
    }
});
