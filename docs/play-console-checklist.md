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

## 3. App content (Grow → App content)

Đây là các mục bắt buộc trước khi publish, kể cả lên Internal testing.

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

### 3c. Data safety form
Vào **App content → Data safety → Start**

Câu hỏi mở đầu:
- App có thu thập hoặc chia sẻ dữ liệu người dùng không? → **Yes**
- Dữ liệu có được mã hóa khi truyền không? → **Yes** (HTTPS qua Firebase)
- App có cách để người dùng yêu cầu xóa dữ liệu không? → **Yes**
  → Account deletion URL: `https://dongpv168-afk.github.io/daily-tracker/privacy-policy.html`
  (mục "Quyền của bạn" trong trang, có email liên hệ để yêu cầu xóa)

**Loại dữ liệu thu thập** — tick đúng các mục sau, còn lại để trống:

| Category | Type | Collected? | Shared? | Mục đích | Bắt buộc? |
|---|---|---|---|---|---|
| Personal info | Email address | ✅ | ❌ | App functionality, Account management | Có |
| Financial info | Other financial info (thu/chi người dùng nhập) | ✅ | ❌ | App functionality | Không (tính năng tùy chọn) |
| App activity | Other user-generated content (việc cần làm, thói quen) | ✅ | ❌ | App functionality | Không |

Tất cả dữ liệu: **"Data is encrypted in transit"** = Yes, **"Collected"**, gắn với danh tính
người dùng (linked, vì gắn theo tài khoản), **không** bán/chia sẻ cho bên thứ 3.

Các mục khác (Location, Photos/videos, Contacts, Web browsing history, Device IDs...) →
**không tick**, vì app không thu thập.

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
