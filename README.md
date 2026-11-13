# modoi web

## Get for Mac → Google Sheet

On-site form: [`get.html`](get.html). Answers POST to a Google Apps Script web app that appends a row to your Sheet; then the Mac DMG downloads directly (no Google Forms).

### One-time setup

1. **Sheet** — create a Google Sheet. Optional header row:
   `Timestamp | Email | First name | Last name | Product | Email updates | Value worth | Comments | Source | User agent`
2. **Script** — open the Sheet → Extensions → Apps Script. Paste [`scripts/get-for-mac-apps-script.js`](scripts/get-for-mac-apps-script.js). Save.
3. **Deploy** — Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. **Wire the site** — copy the Web app URL into `SHEETS_ENDPOINT` in [`js/get-for-mac.js`](js/get-for-mac.js).
5. **DMG** — `DOWNLOAD_URL` in the same file points at the GitHub release from `appcast.xml`. Swap it when you ship a new build, or put a file under `assets/` and point there.

If `SHEETS_ENDPOINT` is empty, the form still downloads the app and shows a soft warning. Sheet POST failures never block the download.

After editing the Apps Script, redeploy with a **new version** or the live endpoint will keep the old code.
