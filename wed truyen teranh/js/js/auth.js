/**
 * ============================================================
 * auth.js — Xử lý đăng nhập & đăng ký
 * Dùng cho: login.html
 * ============================================================
 */

/* ----------------------------------------------------------
   KHỞI TẠO: đọc URL param để mở đúng tab khi vào trang
   Ví dụ: login.html?tab=register → mở tab Đăng ký
---------------------------------------------------------- */
function initTab() {
    const params = new URLSearchParams(window.location.search);
    switchTab(params.get("tab") || "login");
}

/* ----------------------------------------------------------
   CHUYỂN TAB giữa Đăng nhập và Đăng ký
   tab: "login" | "register"
---------------------------------------------------------- */
function switchTab(tab) {
    // Ẩn tất cả form và bỏ active khỏi tất cả tab
    ["formLogin", "formRegister"].forEach(function(id) {
        document.getElementById(id).classList.remove("active");
    });
    ["tabLogin", "tabRegister"].forEach(function(id) {
        document.getElementById(id).classList.remove("active");
    });

    // Hiện form và tab được chọn
    if (tab === "register") {
        document.getElementById("formRegister").classList.add("active");
        document.getElementById("tabRegister").classList.add("active");
    } else {
        document.getElementById("formLogin").classList.add("active");
        document.getElementById("tabLogin").classList.add("active");
    }
}

/* ----------------------------------------------------------
   HIỆN THÔNG BÁO lỗi hoặc thành công trong form
   id   : ID của thẻ thông báo (loginMessage / registerMessage)
   msg  : Nội dung hiển thị
   type : "success" | "error"
---------------------------------------------------------- */
function showMsg(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = "auth-message " + type;
    // Tự xóa thông báo sau 3.5 giây
    setTimeout(function() {
        el.className = "auth-message";
    }, 3500);
}

/* ----------------------------------------------------------
   ĐĂNG KÝ tài khoản mới
   - Kiểm tra dữ liệu hợp lệ
   - Lưu vào localStorage với key: "user_[tên tài khoản]"
   - Tự chuyển sang tab đăng nhập sau khi thành công
---------------------------------------------------------- */
function register() {
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();

    // Kiểm tra không được để trống
    if (!user || !pass) {
        showMsg("registerMessage", "Vui long nhap day du thong tin!", "error");
        return;
    }

    // Mật khẩu tối thiểu 6 ký tự
    if (pass.length < 6) {
        showMsg("registerMessage", "Mat khau phai it nhat 6 ky tu!", "error");
        return;
    }

    // Kiểm tra tên tài khoản đã tồn tại chưa
    if (localStorage.getItem("user_" + user)) {
        showMsg("registerMessage", "Ten tai khoan da ton tai!", "error");
        return;
    }

    // Lưu tài khoản vào localStorage
    localStorage.setItem("user_" + user, pass);
    showMsg("registerMessage", "Dang ky thanh cong! Chuyen sang dang nhap...", "success");

    // Sau 1.4 giây chuyển sang tab đăng nhập và điền sẵn tên
    setTimeout(function() {
        switchTab("login");
        document.getElementById("loginUser").value = user;
    }, 1400);
}

/* ----------------------------------------------------------
   ĐĂNG NHẬP
   - So sánh mật khẩu với dữ liệu đã lưu trong localStorage
   - Lưu tên người dùng vào "loggedUser" khi thành công
   - Chuyển về trang chủ sau khi đăng nhập
---------------------------------------------------------- */
function login() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    // Kiểm tra không được để trống
    if (!user || !pass) {
        showMsg("loginMessage", "Vui long nhap day du thong tin!", "error");
        return;
    }

    // Lấy mật khẩu đã lưu và so sánh
    const saved = localStorage.getItem("user_" + user);
    if (saved === pass) {
        // Lưu trạng thái đã đăng nhập
        localStorage.setItem("loggedUser", user);
        showMsg("loginMessage", "Dang nhap thanh cong! Dang chuyen huong...", "success");

        // Chuyển về trang chủ sau 1.2 giây
        setTimeout(function() {
            window.location.href = "./index.html";
        }, 1200);
    } else {
        showMsg("loginMessage", "Sai ten tai khoan hoac mat khau!", "error");
    }
}

/* ----------------------------------------------------------
   AUTO REDIRECT: nếu đã đăng nhập rồi thì không cần vào
   trang này nữa → tự chuyển thẳng về trang chủ
---------------------------------------------------------- */
(function checkAlreadyLoggedIn() {
    if (localStorage.getItem("loggedUser")) {
        window.location.href = "./index.html";
    }
})();

/* ----------------------------------------------------------
   CHẠY KHI TRANG LOAD XONG: khởi tạo tab đúng
---------------------------------------------------------- */
initTab();
