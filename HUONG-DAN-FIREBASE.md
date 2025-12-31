# 🔥 Hướng Dẫn Cấu Hình Firebase

## 📌 Firebase là gì?

Firebase là dịch vụ **MIỄN PHÍ** của Google giúp bạn:
- ✅ Lưu trữ dữ liệu trên cloud
- ✅ Đăng nhập/Đăng ký người dùng
- ✅ Đồng bộ dữ liệu giữa các thiết bị
- ✅ Hoạt động realtime (tự động cập nhật)

## 🚀 Bước 1: Tạo Project Firebase

### 1.1. Truy cập Firebase Console
- Link: https://console.firebase.google.com
- Đăng nhập bằng Gmail

### 1.2. Tạo Project mới
1. Bấm **"Add project"** (Thêm dự án)
2. Đặt tên: `QuanLyChiTieu` (hoặc tên bạn thích)
3. Bấm **Continue**
4. Tắt Google Analytics (không cần) → **Continue**
5. Đợi 30 giây → Bấm **Continue**

## 🔑 Bước 2: Lấy Config Key

### 2.1. Tạo Web App
1. Trong Firebase Console, bấm biểu tượng **</>** (Web)
2. Đặt nickname: `QuanLyChiTieu Web`
3. **KHÔNG** tick "Firebase Hosting"
4. Bấm **Register app**

### 2.2. Copy Config
Bạn sẽ thấy đoạn code giống như:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",
  authDomain: "quanlychitieu-xxx.firebaseapp.com",
  databaseURL: "https://quanlychitieu-xxx-default-rtdb.firebaseio.com",
  projectId: "quanlychitieu-xxx",
  storageBucket: "quanlychitieu-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**📋 Copy toàn bộ đoạn này!**

### 2.3. Paste vào code
1. Mở file `script.js`
2. Tìm dòng:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  ...
};
```
3. **THAY THẾ** bằng config bạn vừa copy

## 🔓 Bước 3: Bật Authentication

### 3.1. Vào mục Authentication
1. Trong Firebase Console, menu bên trái → **Authentication**
2. Bấm **Get started**

### 3.2. Bật Email/Password
1. Tab **Sign-in method**
2. Tìm **Email/Password** → Bấm vào
3. Bật **Enable** (toggle màu xanh)
4. Bấm **Save**

## 🗄️ Bước 4: Bật Realtime Database

### 4.1. Tạo Database
1. Menu bên trái → **Realtime Database**
2. Bấm **Create Database**
3. Chọn vị trí: **United States (us-central1)**
4. Bấm **Next**

### 4.2. Chọn Security Rules
1. Chọn **Start in test mode** (để test)
2. Bấm **Enable**

### 4.3. Cập nhật Rules (Quan trọng!)
Sau khi tạo xong, vào tab **Rules**, thay thế bằng:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

Bấm **Publish** để lưu.

**Giải thích:** 
- Mỗi user chỉ đọc/ghi được dữ liệu của chính mình
- Bảo mật tốt hơn

## ✅ Bước 5: Test thử

### 5.1. Chạy ứng dụng
1. Mở Live Server
2. Bạn sẽ thấy form Đăng nhập/Đăng ký

### 5.2. Đăng ký tài khoản
1. Tab **Đăng ký**
2. Nhập email: `test@example.com`
3. Nhập mật khẩu: `123456`
4. Bấm **Đăng ký**

### 5.3. Kiểm tra
1. Vào Firebase Console → **Authentication** → **Users**
2. Bạn sẽ thấy user vừa tạo!

## 📱 Bước 6: Test đồng bộ

### 6.1. Đăng nhập trên máy tính
1. Đăng nhập bằng tài khoản vừa tạo
2. Thêm vài giao dịch

### 6.2. Đăng nhập trên điện thoại
1. Truy cập website trên điện thoại
2. Đăng nhập cùng tài khoản
3. **Dữ liệu tự động xuất hiện!** 🎉

### 6.3. Test realtime sync
1. Thêm giao dịch trên điện thoại
2. Xem máy tính → **Tự động cập nhật!**

## 🔒 Bảo mật

### Dữ liệu có an toàn không?

✅ **RẤT AN TOÀN**:
- Mỗi người chỉ xem được dữ liệu của mình
- Mật khẩu được mã hóa bởi Google
- Firebase Rules bảo vệ dữ liệu
- HTTPS mã hóa kết nối

## 💰 Chi phí

### Miễn phí bao nhiêu?

**Gói Spark (FREE):**
- ✅ 10,000 lượt đăng nhập/tháng
- ✅ 1GB lưu trữ
- ✅ 10GB download/tháng
- ✅ 50,000 lượt đọc/ngày
- ✅ 20,000 lượt ghi/ngày

**Với 1 người dùng:**
- Dùng cả năm vẫn FREE 100%!

## ❓ Xử lý lỗi

### Lỗi: "Firebase not defined"
- **Nguyên nhân:** Chưa load Firebase SDK
- **Giải pháp:** Kiểm tra thẻ `<script>` trong `index.html`

### Lỗi: "Permission denied"
- **Nguyên nhân:** Rules chưa đúng
- **Giải pháp:** Xem lại Bước 4.3

### Lỗi: "Invalid email"
- **Nguyên nhân:** Email không đúng định dạng
- **Giải pháp:** Nhập đúng format: `name@domain.com`

### Lỗi: "Weak password"
- **Nguyên nhân:** Mật khẩu < 6 ký tự
- **Giải pháp:** Dùng mật khẩu tối thiểu 6 ký tự

## 🎯 Tính năng đã có

### ✅ Đã hoạt động:
- [x] Đăng ký/Đăng nhập
- [x] Đồng bộ tự động
- [x] Realtime update
- [x] Hoạt động offline (LocalStorage backup)
- [x] Bảo mật dữ liệu cá nhân
- [x] Đăng xuất

### 📋 Workflow:
1. **Đăng nhập** → Load dữ liệu từ Firebase
2. **Thêm/Sửa/Xóa** → Tự động sync lên Firebase
3. **Mất mạng** → Vẫn dùng được (LocalStorage)
4. **Có mạng trở lại** → Tự động sync

## 💡 Mẹo hay

### 1. Đổi mật khẩu
- Vào Firebase Console → Authentication → Users
- Bấm 3 chấm → Reset password

### 2. Xem dữ liệu
- Vào Realtime Database → Data
- Thấy cây dữ liệu: `users → [uid] → transactions`

### 3. Backup dữ liệu
- Vào Realtime Database → Data
- Bấm 3 chấm → Export JSON

### 4. Xóa tài khoản
- Authentication → Users → Xóa user
- Dữ liệu tự động xóa theo

## 🚀 Deploy lên GitHub Pages

Sau khi setup Firebase xong:

```bash
git add .
git commit -m "Thêm tính năng đăng nhập và đồng bộ Firebase"
git push
```

Website sẽ tự động cập nhật tại:
`https://canhnguyen04.github.io/QuanLyChiTieu/`

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Console (F12) → xem lỗi
2. Xem lại config trong `script.js`
3. Kiểm tra Authentication và Database đã bật chưa
4. Xem Rules có đúng không

---

**🎉 Chúc mừng! Bạn đã có app quản lý chi tiêu chuyên nghiệp với đồng bộ đa thiết bị!**
