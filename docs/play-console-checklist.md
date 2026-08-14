# Checklist đưa Daily Tracker lên Play Store

Các bước dưới đây bạn tự làm trên [play.google.com/console](https://play.google.com/console)
vì đây là khai báo gắn với tài khoản nhà phát triển của bạn — nhưng mọi nội dung/câu trả lời
đã soạn sẵn, chỉ việc copy-paste.

## 1. Tạo app mới

**All apps → Create app**

- App name: `Daily Tracker`
- Default language: `Tiếng Việt`
- App or game: **App**
- Free or paid: **Free**
- Declarations: tick cả 2 ô (Developer Program Policies + US export laws)

## 2. Store listing (Grow → Store presence → Main store listing)

- **App name**: `Daily Tracker`
- **Short description**: xem `docs/play-store-listing.md` (66/80 ký tự)
- **Full description**: xem `docs/play-store-listing.md` (1574/4000 ký tự)
- **App icon** (512×512): `docs/play-store-icon-512.png`
- **Feature graphic** (1024×500): `docs/feature-graphic-1024x500.png`
- **Phone screenshots** (tối thiểu 2): cả 5 ảnh trong `docs/screenshots-cropped/`
  — thứ tự gợi ý: `01-thong-ke`, `02-hom-nay`, `03-viec-can-lam`, `04-thoi-quen`, `05-chi-tieu`
- **Category**: Productivity (Năng suất)
- **Contact details**:
  - Email: `dongpv168@gmail.com`
  - Website / Privacy policy: `https://dongpv168-afk.github.io/daily-tracker/privacy-policy.html`

## 2b. Developer page (Store settings → Developer page details)

Trang giới thiệu nhà phát triển (hiện ở đầu mọi listing app của bạn) — không bắt buộc để
publish nhưng nên điền cho chuyên nghiệp:

- **Developer icon** (512×512): `docs/dev-profile-icon-512.png`
- **Developer header image** (4096×2304): `docs/dev-header-4096x2304.png`
- **About**: có thể dùng đoạn ngắn, ví dụ:
  `Phát triển các ứng dụng năng suất gọn nhẹ, tập trung vào trải nghiệm đơn giản và riêng tư.`

## 3. App content (Grow → App content)

Đây là các mục bắt buộc trước khi publish, kể cả lên Internal testing.

### 3a0. App access
App yêu cầu đăng nhập (email/mật khẩu) nên chọn **"All or some functionality is
restricted"** và cung cấp tài khoản demo cho reviewer. Tài khoản đã tạo sẵn — xem file
`docs/reviewer-account.txt` (không commit vì chứa mật khẩu, chỉ có ở máy bạn).

### 3a. Privacy policy
URL: `https://dongpv168-afk.github.io/daily-tracker/privacy-policy.html`

### 3b. Content rating questionnaire (IARC)
Vào **App content → Content ratings → Start questionnaire**

- Email: `dongpv168@gmail.com`
- Category ứng dụng: **Utility, Productivity, Communication, or Other**
- Toàn bộ câu hỏi về nội dung (bạo lực, tình dục, ma túy, cờ bạc, ngôn từ tục tĩu, nội dung
  kinh dị...) → chọn **"No" / "None"** cho tất cả — app không có bất kỳ nội dung nào thuộc
  các mục này.
- Câu hỏi về chia sẻ vị trí người dùng → **No**
- Câu hỏi về tương tác người dùng (nhắn tin, chia sẻ nội dung với người dùng khác) → **No**
  (app không có tính năng mạng xã hội/chat)
- Kết quả dự kiến: **PEGI 3 / ESRB Everyone / Mọi lứa tuổi**

### 3c. An toàn dữ liệu (Data safety form)
Vào **Nội dung ứng dụng (App content) → An toàn dữ liệu (Data safety) → Bắt đầu**

**Trang "Thu thập dữ liệu và bảo mật"** (Data collection and security):
- "Ứng dụng của bạn có thu thập hoặc chia sẻ loại dữ liệu người dùng bắt buộc nào không?"
  → **Có**
- "Tất cả dữ liệu người dùng do ứng dụng thu thập có được mã hóa khi truyền đi không?"
  → **Có** (HTTPS qua Firebase)
- "Bạn có cung cấp cách để người dùng yêu cầu xóa dữ liệu của họ không?" → **Có**
  → URL: `https://dongpv168-afk.github.io/daily-tracker/data-deletion.html`
  (trang riêng, hướng dẫn xóa từng phần trong app + cách yêu cầu xóa toàn bộ tài khoản)
- Nếu có câu "Ứng dụng có cho phép người dùng xóa một phần hoặc toàn bộ dữ liệu ngay cả khi
  không xóa tài khoản không?" → **Có** (nút thùng rác xóa từng việc/thói quen/giao dịch,
  có hiệu lực ngay)

**Trang "Loại dữ liệu"** (Data types) — chỉ tick đúng 3 mục sau, còn lại **để trống hết**:
- **Thông tin cá nhân** (Personal info) → tick **Địa chỉ email** (Email address)
- **Thông tin tài chính** (Financial info) → tick **Thông tin tài chính khác**
  (Other financial info — là khoản thu/chi người dùng tự nhập)
- **Hoạt động trong ứng dụng** (App activity) → tick **Nội dung khác do người dùng tạo**
  (Other user-generated content — việc cần làm, thói quen)

**Với mỗi loại dữ liệu vừa tick**, trả lời các câu hỏi chi tiết:

| Câu hỏi | Địa chỉ email | Thông tin tài chính khác | Nội dung do người dùng tạo |
|---|---|---|---|
| Dữ liệu này được thu thập, chia sẻ, hay cả hai? | Chỉ thu thập | Chỉ thu thập | Chỉ thu thập |
| Dữ liệu này có được xử lý tạm thời không? (ephemerally) | Không | Không | Không |
| Việc thu thập là bắt buộc hay không bắt buộc? | **Bắt buộc** | **Không bắt buộc** | **Không bắt buộc** |
| Vì sao thu thập dữ liệu này? | Chức năng ứng dụng, Quản lý tài khoản | Chức năng ứng dụng | Chức năng ứng dụng |

Lý do Bắt buộc/Không bắt buộc: phải đăng nhập bằng email mới dùng được app, nhưng người dùng
không bắt buộc phải nhập khoản thu/chi hay việc/thói quen nào cả — đó là tính năng họ chủ
động dùng.

Tất cả dữ liệu: gắn với danh tính người dùng (liên kết — linked, vì gắn theo tài khoản),
**không** bán/chia sẻ cho bên thứ ba.

Các mục khác (Vị trí, Ảnh/video, Danh bạ, Lịch sử duyệt web, Mã thiết bị, Tin nhắn...) →
**không tick**, vì app không thu thập.

**Trang "Đánh giá bảo mật độc lập"** (Independent security review) → bỏ qua / chọn **Không**
(không bắt buộc, không áp dụng cho app nhỏ).

### 3d. Government apps / Ads / News apps / COVID-19 apps
Tất cả chọn **"No"** — app không thuộc các diện này. App **không có quảng cáo** nên phần
"Ads" chọn **"No, my app does not contain ads"**.

### 3e. Target audience and content
- Target age group: **18 tuổi trở lên** (hoặc chọn dải phù hợp nếu muốn mở rộng — app
  không có nội dung đặc thù cho trẻ em nên tránh chọn "chủ yếu hướng đến trẻ em" để không bị
  áp policy Play Families phức tạp hơn)
- App có hướng đến trẻ em (Play Families policy)? → **No**

## 4. Tạo release đầu tiên (Internal testing)

**Testing → Internal testing → Create new release**

1. Upload file `.aab` đã build (đã tải sẵn tại `docs/daily-tracker-1.0.0-build3.aab`,
   icon bản gốc, versionCode 3):
   `https://expo.dev/artifacts/eas/wXjydrBCOciqULsWpM1SVuuIMnEXBIDqw_1x5OHIEqo.aab`
   (hoặc dùng lệnh `eas submit` — xem mục 5)
2. Release name: tự động điền theo version (`1.0.0 (2)`)
3. Release notes (Tiếng Việt): ví dụ `Phiên bản đầu tiên của Daily Tracker.`
4. Thêm người test nội bộ (email Gmail của bạn hoặc người khác) ở tab **Testers**
5. Save → Review release → Start rollout to Internal testing

Sau khi test nội bộ ổn, vào **Production → Create new release**, chọn cùng file `.aab`
(hoặc build mới), điền release notes, rồi **Send for review** để Google duyệt và publish
chính thức (thường mất vài giờ đến vài ngày cho lần đầu).

## 5. (Tùy chọn) Tự động hóa submit bằng `eas submit`

Thay vì tải `.aab` về rồi upload tay, có thể dùng:

```powershell
npx eas submit --platform android --path <đường-dẫn-file.aab>
```

Việc này cần một **Google Cloud service account** có quyền trên Play Console (Setup → API
access trong Play Console → tạo service account → cấp quyền "Release manager"). Bước này có
thể làm sau, không bắt buộc cho lần đầu — upload thủ công qua trình duyệt vẫn hoạt động bình
thường và thường nhanh hơn cho lần đầu vì tài khoản mới có thể mất 24-48h để API access kích
hoạt.
