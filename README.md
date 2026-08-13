# Daily Tracker

App di động (Android & iOS, React Native + Expo) để quản lý việc cần làm hàng ngày, theo dõi thói quen (habit streak), và ghi chép chi tiêu/thu nhập — kèm thống kê theo ngày/tuần/tháng. Dữ liệu đồng bộ qua Firebase (Firestore + Auth) nên dùng chung một tài khoản trên nhiều thiết bị.

## Tính năng

- **Việc cần làm**: thêm/sửa/xóa, đặt ngày đến hạn, nhắc giờ qua thông báo local, lọc theo Hôm nay/Sắp tới/Tất cả/Đã xong.
- **Thói quen**: check-off theo ngày, tính streak hiện tại & dài nhất, nhắc nhở hàng ngày, dải 7 ngày gần nhất.
- **Chi tiêu/thu nhập**: ghi giao dịch theo danh mục, lọc Hôm nay/7 ngày/Tháng này/Tất cả, thẻ tổng thu-chi-số dư.
- **Thống kê**: tổng hợp cả 3 mục trên theo Hôm nay/7 ngày/Tháng này.
- **Tài khoản**: đăng ký/đăng nhập email+mật khẩu, dữ liệu đồng bộ theo tài khoản trên mọi thiết bị.

## Công nghệ

- [Expo](https://expo.dev) (React Native, TypeScript) + [expo-router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- [Firebase](https://firebase.google.com): Firestore (dữ liệu) + Authentication (email/password)
- [zustand](https://github.com/pmndrs/zustand) (state auth) · [date-fns](https://date-fns.org) (xử lý ngày/streak)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) (nhắc việc/thói quen — local notifications, không cần server)

## Yêu cầu môi trường

- Node.js LTS + npm
- App **Expo Go** trên điện thoại (Android/iOS) — dùng để chạy thử app mà không cần build native.
- Một project Firebase (miễn phí) đã bật **Firestore** và **Authentication (Email/Password)**.

> **Lưu ý phiên bản**: project này đang ở Expo SDK 54 để khớp với phiên bản Expo Go hiện có trên store. Gói npm `expo` đôi khi phát hành SDK mới hơn Expo Go client — nếu quét QR báo "cần cập nhật Expo Go" mà store đã là bản mới nhất, nghĩa là SDK npm đã vượt SDK Expo Go hỗ trợ; khi đó chạy `npx expo install expo@<sdk-tương-thích>` rồi `npx expo install --fix` để hạ xuống.

## Cài đặt lần đầu

```powershell
cd daily-tracker
npm install
```

### 1. Tạo Firebase project

1. Vào [console.firebase.google.com](https://console.firebase.google.com) → tạo project mới.
2. Thêm **Web app** (`</>`) để lấy `firebaseConfig` (không cần Firebase Hosting).
3. **Firestore Database** → Create database → Production mode → publish rules trong `firestore.rules` (đã có sẵn trong repo).
4. **Authentication** → Sign-in method → bật **Email/Password**.

### 2. Cấu hình biến môi trường

```powershell
copy .env.example .env
```

Điền các giá trị từ `firebaseConfig` (bước 1) vào `.env`. File này đã được gitignore, không commit key thật.

## Chạy app

```powershell
npx expo start
```

Quét mã QR bằng app Expo Go trên điện thoại (cùng mạng Wi-Fi với máy tính). Nếu mạng chặn LAN, dùng `npx expo start --tunnel`.

## Cấu trúc thư mục

```
app/                  # Màn hình & điều hướng (expo-router, file-based)
  (auth)/             # Đăng nhập / đăng ký
  (tabs)/             # 6 tab chính: Hôm nay, Việc cần làm, Thói quen, Chi tiêu, Thống kê, Cài đặt
  todo|habit|transaction/[id].tsx   # Modal thêm/sửa (id === 'new' để tạo mới)
src/
  components/         # UI dùng chung (common/) và theo tính năng (todos/, habits/, expenses/)
  services/           # Gọi Firebase (firebase.ts, *.service.ts) + expo-notifications
  hooks/              # useAuth, useTodos, useHabits, useHabitLogs, useTransactions...
  store/              # zustand (authStore)
  types/              # Kiểu dữ liệu Firestore
  utils/              # date, currency, streaks, period, errors
  constants/           # colors, categories chi tiêu
firestore.rules        # Rules cần publish lên Firebase Console
```

## Model dữ liệu Firestore

```
users/{uid}
users/{uid}/todos/{todoId}
users/{uid}/habits/{habitId}
users/{uid}/habitLogs/{habitId_date}   # id ghép để check-off là upsert
users/{uid}/transactions/{txId}
```

Mỗi user chỉ đọc/ghi được dữ liệu của chính mình (xem `firestore.rules`).

## Giới hạn hiện tại (MVP)

- Chưa có "quên mật khẩu" — nếu quên, xóa tài khoản test trong Firebase Console rồi đăng ký lại.
- Thói quen chỉ tính theo tần suất hàng ngày (chưa hỗ trợ "3 lần/tuần" v.v.).
- Icon/splash screen vẫn dùng ảnh mặc định của Expo — thay bằng ảnh riêng trong `assets/` nếu muốn.
- Build bản chính thức lên Play Store/App Store (qua EAS Build) chưa nằm trong phạm vi này — hiện chỉ chạy qua Expo Go.
