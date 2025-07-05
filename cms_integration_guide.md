# CMS Integration Guide & Requirements

This document outlines the client's answers to key implementation questions. It will serve as the primary guide for integrating the Google Sheets CMS and implementing related backend logic.

---

## PHYSICAL FLASHCARDS

**1. What format do the codes on flashcards take?**
- **Answer:** Both alphanumeric (e.g., X7KD4) and QR codes.

**2. How are the codes generated and managed? Will the developer generate QR codes?**
- **Answer:** Codes will be generated automatically. The developer is responsible for generating the corresponding QR codes.

**3. Are codes unique per flashcard, or reused?**
- **Answer:** Codes are unique for each flashcard.

**4. How are flashcards distributed or printed?**
- **Answer:** No specific format required. Any method that works is acceptable.

**5. Do flashcards include visible categories/lessons?**
- **Answer:** No, the flashcards will only contain the necessary elements to get the text and audio. Category information is stored in the backend.

---

## AUDIO CLIPS & PHRASES

**1. How are audio files named and linked to codes?**
- **Answer:** Any naming convention can be used. We will link audio files to phrases via URLs in the CMS.

**2. What file format and average length are the audio clips?**
- **Answer:** MP3 or WAV. The length will vary depending on the phrase.

**3. Are there multiple languages?**
- **Answer:** Yes, the app will support Yoruba and English.

**4. Is there text content associated with each phrase?**
- **Answer:** Yes, each entry will have the Yoruba phrase and its English translation.

---

## CONTENT STRUCTURE

**1. How is content grouped?**
- **Answer:** Content is grouped by `Categories` (e.g., Greetings, Questions, etc.).

**2. Should users browse content manually, or only via code?**
- **Answer:** Users should be able to do both. This confirms the necessity of the `BrowseScreen`.

**3. Is content dynamic or static?**
- **Answer:** The content is dynamic and will be managed from the CMS.

---

## FLASHCARD–CONTENT MAPPING (Google Sheets Schema)

**1. What fields should each record include?**
- **Answer:** Each row in the Google Sheet will represent a phrase and must contain the following columns:
  - `id`: A unique identifier for the record.
  - `code`: The alphanumeric code for the flashcard.
  - `phrase_yoruba`: The phrase in Yoruba.
  - `phrase_english`: The English translation.
  - `audio_yoruba_url`: The URL to the Yoruba audio file.
  - `audio_english_url`: The URL to the English audio file.
  - `category`: The category the phrase belongs to.
  - `status`: The state of the content (e.g., `published`, `draft`).

**2. Can codes map to multiple audio versions?**
- **Answer:** Yes. The schema supports separate audio files for both Yoruba and English.

**3. What should happen with invalid/expired codes?**
- **Answer:** They should be deleted or recycled from the CMS. The app should handle a "Not Found" error gracefully.

---

## APP BEHAVIOR / UX FLOW

**1. Expected flow after code entry/scan?**
- **Answer:** The app should navigate to the `ContentDisplayScreen`, showing the phrase text with an option to play the audio. This matches the current implementation.

**2. Can users save/bookmark content?**
- **Answer:** Yes. A "Favorites" or bookmarking feature needs to be implemented.

**3. Is there any history or progress tracking?**
- **Answer:** The app should track history (e.g., "Recent Activity"). It does not need to track progress (e.g., lesson completion).

**4. Should audio stream or cache for offline use?**
- **Answer:** The app should support downloading content for offline use.

---

## ADMIN BACKEND (CONTENT MGMT)

**1. Where will content be stored?**
- **Answer:** Google Sheets.

**2. What fields will be tracked per record?**
- **Answer:** A unique ID (`id`) will be the primary key for each record.

**3. Will flashcard codes also be managed in this backend?**
- **Answer:** Yes, the `code` for each flashcard will be in the Google Sheet.

**4. Should draft/published states be supported?**
- **Answer:** Yes, a `status` column will manage this. The app should only fetch records with a `published` status.

**5. How should syncing work?**
- **Answer:** The app should support both real-time fetching on load and a manual refresh mechanism (e.g., pull-to-refresh). 

---

## GOOGLE SHEETS SET-UP & MAINTENANCE WORKFLOW

> The following steps explain **exactly** how to prepare, publish, and maintain the Google Sheet that powers LinguaListen’s in-app content. They mirror the logic found in `src/services/contentService.ts` so please follow them **to the letter**.

### 1  Create / Configure the Spreadsheet

1. Create a new Google Sheet and name it **`LinguaListen CMS`** (or any name you like).
2. In **row 1** add the **header columns – **spelled *exactly* as below and in this order:**

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | `id` | `code` | `phrase_yoruba` | `phrase_english` | `audio_yoruba_url` | `audio_english_url` | `category` | `status` |
3. Freeze row 1 (`View → Freeze → 1 row`) so the headers stay visible while editing.
4. (Optional but recommended) **Data-validate** the `category` column with the allowed slug list below to avoid typos:

   `greetings`, `questions`, `directions`, `food`, `numbers`, `shopping`, `emergencies`, `social`, `family`, `misc`
5. (Optional) Add conditional formatting to the `status` column so `draft` rows appear greyed-out.

### 2  Populate Rows

| Column | Guideline |
|--------|-----------|
| **id** | A unique, stable string. Can be an incremental number (`1, 2, 3…`) or UUID. Must never change once printed on a card. |
| **code** | The alphanumeric code printed or QR-encoded on the physical flashcard (e.g., `A1B2-C3D4`). Must be **unique** and **case-insensitive**. |
| **phrase_yoruba** | Yoruba text shown in the app. No quotation marks necessary. |
| **phrase_english** | English translation. |
| **audio_yoruba_url / audio_english_url** | Publicly accessible HTTPS links to MP3/WAV files. (Google Drive links must be set to *Anyone with the link – Viewer* and converted to the direct download URL format.) |
| **category** | One of the validated slugs listed above. The app maps this to a human-friendly label (see code in `src/constants/categories.ts`). |
| **status** | Leave blank **or** set to `published` when the row is ready. Set to `draft` to hide the row from the app without deleting it. `contentService` ignores rows where `status` =`draft` (case-insensitive). |

### 3  Publish the Sheet as CSV

1. Open the sheet → `File → Share → Publish to web`.
2. In the dialog:
   - **Link** tab
   - **Entire Document**
   - **Comma-separated values (.csv)**
3. Click **Publish** and copy the generated URL (it ends with `output=csv`).

> **Keep this URL secret but not private.** Anyone with the link can view the raw CSV, but it contains no personal data.

### 4  Expose the URL to the App

1. Create (or update) an **`.env`** file in the project root:

   ```bash
   # .env
   EXPO_PUBLIC_GOOGLE_SHEETS_URL="https://docs.google.com/spreadsheets/d/…/export?format=csv"
   ```
2. Commit **`.env.example`** with the *placeholder* key so teammates know what to supply.
3. For EAS Build/CI, add the same variable in the dashboard → **Project → Build → Environment Variables** or in `eas.json` under the appropriate profile:

   ```json
   "build": {
     "preview": {
       "env": {
         "EXPO_PUBLIC_GOOGLE_SHEETS_URL": "https://docs.google.com/…output=csv"
       }
     }
   }
   ```

### 5  Update & Release Workflow

1. **Edit** the sheet – add new rows, tweak text, replace audio links, etc.
2. Ensure the `status` is `published` for rows you want live.
3. Changes are live immediately (the CSV endpoint updates within seconds).
4. The app:
   - Caches the CSV in AsyncStorage.
   - Automatically refreshes in the background on next launch.
   - Users can **pull-to-refresh** on *Browse* to force an update (`contentService.refresh()`).

### 6  Troubleshooting Checklist

| Symptom | Possible Cause | Fix |
|---------|----------------|-----|
| "Content not found" after entering a code | Code typo / not unique / set to `draft` | Confirm the `code` cell matches the printed code *exactly* and `status` ≠ `draft`. |
| New phrase doesn’t appear in app | CSV not refreshed yet / app uses cache | Wait 30 sec, then restart the app or pull-to-refresh. |
| App shows "Missing EXPO_PUBLIC_GOOGLE_SHEETS_URL" error | Env variable not set in build profile | Add the URL to the env vars in EAS dashboard or `eas.json`. |
| Audio fails to play | Broken or private audio URL | Paste the link in a browser – it must download immediately without auth. |

---

**That’s it!** Following this guide ensures non-technical editors can manage LinguaListen content safely while the mobile app stays in sync. 