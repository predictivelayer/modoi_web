/**
 * Modoi Get for Mac → Google Sheet
 *
 * Setup:
 * 1. Bind to your submission Sheet (e.g. "Modoi Customer Submission").
 *    Row 1 headers (optional but recommended — add cols F–I if you only have A–E):
 *    Timestamp | Email | First name | Last name | Email updates | Value worth | Comments | Source | User agent
 *
 * Zach: after ANY change here → Deploy → Manage deployments → Edit → New version → Deploy.
 * 2. Extensions → Apps Script. Delete the stub and paste this file.
 * 3. Save. Deploy → New deployment → type: Web app
 *    - Description: Modoi get-for-mac
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Authorize when prompted. Copy the Web app URL.
 * 5. Paste that URL into js/get-for-mac.js as SHEETS_ENDPOINT.
 *
 * Re-deploy (Manage deployments → Edit → New version) after any script change.
 */

function parsePayload(e) {
  var params = (e && e.parameter) || {};
  if (params.email || params.firstName || params.lastName) {
    return params;
  }
  var raw = (e && e.postData && e.postData.contents) || "";
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function doPost(e) {
  try {
    var data = parsePayload(e);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      new Date().toISOString(),
      data.email || "",
      data.firstName || "",
      data.lastName || "",
      data.emailUpdates || "",
      data.valueWorth || "",
      data.comments || "",
      data.source || "",
      data.userAgent || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "modoi-get-for-mac",
    hint: "POST JSON from get.html",
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
