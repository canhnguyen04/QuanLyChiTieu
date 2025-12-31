# 📱 Hướng Dẫn Deploy Ứng Dụng Lên Web

## 🚀 Cách 1: Deploy lên GitHub Pages (MIỄN PHÍ - Dễ nhất)

### Bước 1: Tạo tài khoản GitHub
- Truy cập: https://github.com
- Đăng ký tài khoản miễn phí

### Bước 2: Tạo Repository mới
1. Bấm nút **"New Repository"** (góc trên bên phải)
2. Đặt tên: `QuanLyChiTieu`
3. Chọn **Public**
4. Bấm **Create Repository**

### Bước 3: Upload code lên GitHub
**Cách A: Dùng Git (Nếu đã cài Git)**
```bash
cd "d:\CANH\THONG TIN NV A CHAU\BOT 2\QuanLyChiTieu"
git init
git add .
git commit -m "First commit"
git branch -M main
git remote add origin git@github.com:canhnguyen04/QuanLyChiTieu.git
git push -u origin main
```

**Lưu ý:** Nếu chưa cài Git, tải tại: https://git-scm.com/download/win

**Cách B: Upload thủ công (Dễ hơn)**
1. Vào repository vừa tạo trên GitHub
2. Bấm **"Add file"** → **"Upload files"**
3. Kéo thả tất cả file trong thư mục QuanLyChiTieu
4. Bấm **"Commit changes"**

### Bước 4: Bật GitHub Pages
1. Vào **Settings** của repository
2. Tìm mục **Pages** (menu bên trái)
3. Tại **Source**, chọn **main** branch
4. Bấm **Save**
5. Đợi 1-2 phút, link website sẽ hiện ra:
   `https://canhnguyen04.github.io/QuanLyChiTieu/`

### ✅ Xong! Giờ bạn có thể:
- Mở trên điện thoại: Truy cập link trên
- Cài đặt như App: Trên điện thoại, bấm menu trình duyệt → **"Thêm vào màn hình chính"**
- Hoạt động OFFLINE: Nhờ PWA, app vẫn chạy khi mất mạng

---

## 🌐 Cách 2: Deploy lên Netlify (MIỄN PHÍ - Nhanh hơn)

### Bước 1: Truy cập Netlify
- Link: https://www.netlify.com
- Đăng nhập bằng GitHub

### Bước 2: Deploy
1. Kéo thả thư mục `QuanLyChiTieu` vào Netlify
2. Website tự động được tạo: `https://tên-ngẫu-nhiên.netlify.app`
3. Có thể đổi tên miễn phí

---

## 🌐 Cách 3: Deploy lên Vercel (MIỄN PHÍ)

### Bước 1: Truy cập Vercel
- Link: https://vercel.com
- Đăng nhập bằng GitHub

### Bước 2: Deploy
1. Bấm **"New Project"**
2. Import repository từ GitHub
3. Bấm **Deploy**
4. Website sẵn sàng: `https://tên-project.vercel.app`

---

## 📱 Cách cài đặt App trên điện thoại

### Trên Android:
1. Mở link website bằng Chrome
2. Bấm menu ⋮ → **"Thêm vào màn hình chính"** (Add to Home screen)
3. Icon app xuất hiện như app thật
4. Có thể dùng OFFLINE!

### Trên iPhone:
1. Mở link website bằng Safari
2. Bấm nút Share 📤 → **"Thêm vào Màn hình chính"**
3. Icon app xuất hiện
4. Có thể dùng OFFLINE!

---

## 🔧 Lưu ý quan trọng

### Để PWA hoạt động tốt:
- ✅ File `manifest.json` đã có
- ✅ Service Worker đã có
- ✅ Icon đã có
- ⚠️ **Cần icon PNG để hiển thị tốt hơn**

### Tạo icon PNG từ SVG:
**Cách 1:** Dùng tool online
- Truy cập: https://cloudconvert.com/svg-to-png
- Upload `icon-192.svg` và `icon-512.svg`
- Tải về file PNG
- Đổi tên thành `icon-192.png` và `icon-512.png`

**Cách 2:** Dùng Canva (miễn phí)
- Tạo design 192x192 và 512x512
- Thêm emoji 💰 hoặc thiết kế riêng
- Export PNG

---

## 🎯 Khuyến nghị cho bạn

**Nên dùng: GitHub Pages**
- ✅ Miễn phí mãi mãi
- ✅ Có thể tùy chỉnh domain
- ✅ Tốc độ nhanh
- ✅ Dễ cập nhật code (chỉ cần push lên GitHub)

**Lệnh cập nhật code sau này:**
```bash
git add .
git commit -m "Cập nhật tính năng mới"
git push
```

---

## 💡 Mẹo hay

1. **Dùng domain riêng miễn phí:**
   - Đăng ký domain .me, .tech miễn phí tại Freenom
   - Trỏ DNS về GitHub Pages

2. **Bảo mật:**
   - Dữ liệu lưu LOCAL trên trình duyệt
   - Không ai thấy được dữ liệu của bạn

3. **Backup dữ liệu:**
   - Mở Console (F12) → Application → Local Storage
   - Copy data để backup

---

## 📞 Có vấn đề?

Nếu gặp lỗi, kiểm tra:
1. File `manifest.json` có đúng vị trí không?
2. Service Worker có đăng ký thành công không? (xem Console)
3. Icon có đúng định dạng không?

**Kiểm tra PWA:**
- Mở DevTools (F12) → Tab **Lighthouse**
- Chạy test PWA → Xem điểm số
