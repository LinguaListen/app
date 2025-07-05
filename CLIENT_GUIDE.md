# LinguaListen – Client Implementation & Operations Guide

_Last updated: July 2025_

---

## 1 · Subscription & Free-Trial Flow

| Item | Recommendation |
|------|----------------|
| Subscription provider | **Expo In-App Purchases (IAP)** for iOS/Android in combination with RevenueCat for unified back-end & analytics.<br/>• Apple / Google native paywalls<br/>• Handles receipts, renewals, upgrades, cancels |
| Trial length | Configure **introductory offer** of _3–7 days free_ in App Store Connect and Google Play Console. RevenueCat auto-validates trial status. |
| App integration | 1. Add RevenueCat SDK.<br/>2. Provide `PaywallScreen` (design ready) that fetches product JSON from RevenueCat.<br/>3. Gate premium features with `isSubscriber` flag from SDK.<br/>4. Surfacing: show paywall when trial ends or locked feature tapped. |
| Server-side | RevenueCat stores receipts; no custom server needed for MVP. |

> **Timeline:** 1–2 dev days to integrate SDK, build paywall UI, test sandbox.

---

## 2 · Product (Paywall) Page in the App

1. **Location** – Add a `PremiumScreen` accessible from Home header or Settings.
2. **Content** – 3-column feature list, price, CTA button, T&C links.
3. **State awareness** – If already subscribed → show _Thank-you_ message & Manage-subscription link.
4. **Deep Links** – Support `lingualisten://premium` for marketing campaigns.

_Design mockups supplied separately._

---

## 3 · Testing on Android

| Step | Tool |
|------|------|
| Local | `npx expo start`, press **a** for Android emulator. |
| Device | Install **Expo Go** → scan QR code. |
| Pre-release | Use **EAS Build** → `eas build -p android --profile preview`.<br/>Produces an `.apk` or `.aab` for internal testing tracks. |
| Subscription sandbox | Play Console → License-testing account list. RevenueCat sandbox auto-mirrors. |

---

## 4 · Mailing-List Storage & Opt-In

1. **Provider** – Mailchimp (quick) or ConvertKit (simpler tagging).<br/>2. **In App** – Add a _Newsletter_ checkbox to Sign-Up; on submit call provider’s REST endpoint via Cloud Function to avoid exposing API key.<br/>3. **GDPR** – Double opt-in email sent by provider.

> **Alternative:** store emails in Firestore collection `mailingList` and run Zapier → Mailchimp sync.

---

## 5 · CMS Training (Google Sheets)

| Action | How-To |
|--------|--------|
| Add phrase | Insert new row – `id`, `code`, `yoruba`, `english`, `audio_url`, `category`, `status`=`published`. |
| Edit copy | Update cell → app auto-refreshes after `pull-to-refresh` because the Sheet → JSON feed is fetched at runtime. |
| Draft vs Publish | Set `status` to `draft` to hide from production app while previewing in staging build. |
| Bulk import | Paste from Excel; ensure column headers unchanged. |
| Versioning | Google Sheets version history; for large edits export CSV & commit to Git for backup. |

Short Loom video recorded and linked here: _CMS_Walkthrough.mp4_.

---

## 6 · Updating In-App Copy (non-CMS sections)

| Section | Update Path |
|---------|-------------|
| Onboarding slides | `src/screens/App/OnboardingSlidesScreen.tsx` → `SLIDES` array. |
| Help / How-To | `src/screens/App/HowToUseScreen.tsx` → `steps` array. |
| Static legal pages | Markdown in `cms_integration_guide.md` (or future CMS field). |

Changes require a new OTA update via Expo EAS (no store resubmission if JS-only).

---

## 7 · Audio File Hosting & Caching

| Requirement | Recommendation |
|--------------|----------------|
| Storage | **Firebase Storage** (same project) – simple, CDN-backed, supports signed URLs if needed. |
| Naming | `audio/{code}/yoruba.mp3`, `audio/{code}/english.mp3` for easy lookup. |
| Size | ≤ 200 kB per clip to keep install size low. |
| Delivery | App uses streaming first; clips saved locally via `expo-file-system` (see `utils/audioCache.ts`) for offline playback. |
| Cost | First 10 GB free; after that ~$0.026/GB/month. |

> **Alternative:** AWS S3 + CloudFront if multi-region traffic grows.

---

## Appendix – Next Steps Checklist

1. [ ] Approve subscription provider (RevenueCat) & pricing tiers.  
2. [ ] Supply final paywall copy & assets.  
3. [ ] Create Mailchimp account & share API key.  
4. [ ] Grant editor access to Google Sheet.  
5. [ ] Upload audio clips to Firebase Storage bucket.  
6. [ ] Schedule CMS training session.  

---

**Questions?** Email dev@lingualisten.com or ping the Slack channel #project-lingualisten.
 