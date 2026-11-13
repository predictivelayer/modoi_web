/**
 * Modoi Get for Mac — form → Google Sheet (Apps Script) → DMG download.
 *
 * Zach: paste your deployed Apps Script Web app URL below.
 * Deploy steps are in get.html (HTML comment) and README.md.
 */
(function () {
  var SHEETS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbw5qwNAqsX0T5_1YOQ4qd3nHna4g0kow_eFp98PeQTc_2g6GsvWLcZKPJh8lIdllA9oFQ/exec";

  // From appcast.xml (v0.1.1 thin). Replace when you ship a fuller build.
  // Alternate Drive link from the old form (view page, not direct):
  // https://drive.google.com/file/d/1Iwgy8_pJmx9hcTPl08m222RbE2wXrXpF/view?usp=sharing
  // Local placeholder if you host the file in-repo: "assets/modoi.dmg"  // #TODO-dmg
  var DOWNLOAD_URL =
    "https://github.com/predictivelayer/modoi_web/releases/download/v0.1.1/modoi-0.1.1-thin.dmg";

  var form = document.getElementById("get-form");
  var statusEl = document.getElementById("get-status");
  var doneStatusEl = document.getElementById("get-done-status");
  var submitBtn = document.getElementById("get-submit");
  var doneEl = document.getElementById("get-done");
  var downloadAgain = document.getElementById("get-download-again");
  var otherRadio = document.getElementById("value-other");
  var otherText = document.getElementById("value-other-text");

  if (!form) return;

  var EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  var BLOCKED_EMAIL_DOMAINS = {
    "example.com": true,
    "example.org": true,
    "example.net": true,
    "test.com": true,
    "test.test": true,
    "localhost": true,
    "mailinator.com": true,
    "guerrillamail.com": true,
    "guerrillamail.net": true,
    "sharklasers.com": true,
    "yopmail.com": true,
    "tempmail.com": true,
    "throwaway.email": true,
    "getnada.com": true,
    "maildrop.cc": true,
    "dispostable.com": true,
  };

  var BLOCKED_EMAIL_LOCALS = {
    asdf: true,
    asdfasdf: true,
    test: true,
    fake: true,
    foo: true,
    bar: true,
    xxx: true,
  };

  var NAME_FORMAT = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;

  function fieldWrap(input) {
    return input && input.closest(".get-field");
  }

  function fieldErrorEl(input) {
    var wrap = fieldWrap(input);
    if (!wrap) return null;
    var el = wrap.querySelector(".get-field-error");
    if (!el) {
      el = document.createElement("p");
      el.className = "get-field-error";
      el.hidden = true;
      wrap.appendChild(el);
    }
    return el;
  }

  function clearFieldError(input) {
    var wrap = fieldWrap(input);
    if (wrap) wrap.classList.remove("is-invalid");
    var el = wrap && wrap.querySelector(".get-field-error");
    if (el) {
      el.hidden = true;
      el.textContent = "";
    }
  }

  function setFieldError(input, message) {
    var wrap = fieldWrap(input);
    if (wrap) wrap.classList.add("is-invalid");
    var el = fieldErrorEl(input);
    if (el) {
      el.textContent = message;
      el.hidden = !message;
    }
  }

  function clearAllFieldErrors() {
    form.querySelectorAll(".get-field input").forEach(clearFieldError);
  }

  function emailDomain(email) {
    var at = email.lastIndexOf("@");
    if (at < 0) return "";
    return email.slice(at + 1).toLowerCase();
  }

  function isAllDigitLocal(local) {
    return local.length >= 6 && /^\d+$/.test(local);
  }

  function domainHostLabels(domain) {
    var host = domain.replace(/^www\./, "");
    var parts = host.split(".").filter(Boolean);
    if (parts.length < 2) return parts;
    return parts.slice(0, -1);
  }

  function isGibberishDomainLabel(label) {
    var lower = label.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (lower.length < 6) return false;

    if (lower.length >= 8 && !/[aeiou]/.test(lower)) return true;

    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(lower)) return true;

    if (/(.)\1{3,}/.test(lower)) return true;

    if (lower.length >= 10 && /(.{2,5})\1+/.test(lower)) return true;

    if (lower.length >= 10) {
      var seen = {};
      for (var i = 0; i < lower.length; i++) seen[lower.charAt(i)] = true;
      if (Object.keys(seen).length <= 3) return true;
    }

    return false;
  }

  function isGibberishDomain(domain) {
    var labels = domainHostLabels(domain);
    for (var i = 0; i < labels.length; i++) {
      if (isGibberishDomainLabel(labels[i])) return true;
    }
    return false;
  }

  function validateEmailValue(email) {
    if (!email) return "Enter your email address.";
    if (!email.includes("@")) return "Email must include @ and a domain (e.g. you@company.com).";
    if (!EMAIL_FORMAT.test(email)) {
      return "Use a valid email with a domain and extension (e.g. you@company.com).";
    }
    var local = email.slice(0, email.indexOf("@")).toLowerCase();
    var domain = emailDomain(email);
    if (BLOCKED_EMAIL_LOCALS[local]) {
      return "That email looks like a placeholder. Use your real work or personal address.";
    }
    if (isAllDigitLocal(local)) {
      return "Use letters in the part before @ — an all-number address isn’t allowed.";
    }
    if (BLOCKED_EMAIL_DOMAINS[domain]) {
      return "That email domain is not allowed. Use your real work or personal address.";
    }
    var baseDomain = domain.replace(/^www\./, "");
    if (BLOCKED_EMAIL_DOMAINS[baseDomain]) {
      return "That email domain is not allowed. Use your real work or personal address.";
    }
    if (isGibberishDomain(domain)) {
      return "That email domain does not look valid. Use a real address (e.g. you@gmail.com or work email).";
    }
    return "";
  }

  function validateNameValue(value, label, required) {
    if (!value) {
      return required ? "Enter your " + label + "." : "";
    }
    if (!NAME_FORMAT.test(value)) {
      return label + " can use letters only (spaces, hyphens, and apostrophes are OK).";
    }
    return "";
  }

  function validateFormFields() {
    clearAllFieldErrors();
    var emailInput = form.querySelector('input[name="email"]');
    var firstInput = form.querySelector('input[name="firstName"]');
    var lastInput = form.querySelector('input[name="lastName"]');
    var email = emailInput ? emailInput.value.trim() : "";
    var first = firstInput ? firstInput.value.trim() : "";
    var last = lastInput ? lastInput.value.trim() : "";
    var firstError = validateEmailValue(email);
    var secondError = validateNameValue(first, "First name", true);
    var thirdError = validateNameValue(last, "Last name", false);
    var focusInput = null;
    if (firstError && emailInput) {
      setFieldError(emailInput, firstError);
      focusInput = emailInput;
    }
    if (secondError && firstInput) {
      setFieldError(firstInput, secondError);
      if (!focusInput) focusInput = firstInput;
    }
    if (thirdError && lastInput) {
      setFieldError(lastInput, thirdError);
      if (!focusInput) focusInput = lastInput;
    }
    return {
      ok: !firstError && !secondError && !thirdError,
      focusInput: focusInput,
    };
  }

  function paintStatus(el, message, kind) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.classList.remove("is-warn", "is-error");
    if (kind === "warn") el.classList.add("is-warn");
    if (kind === "error") el.classList.add("is-error");
  }

  function setStatus(message, kind) {
    paintStatus(statusEl, message, kind);
  }

  function setDoneStatus(message, kind) {
    paintStatus(doneStatusEl, message, kind);
  }

  function syncOther() {
    var on = !!(otherRadio && otherRadio.checked);
    if (!otherText) return;
    otherText.disabled = !on;
    if (on) otherText.focus();
    else otherText.value = "";
  }

  form.querySelectorAll('input[name="valueWorth"]').forEach(function (el) {
    el.addEventListener("change", syncOther);
  });
  syncOther();

  function startDownload() {
    var a = document.createElement("a");
    a.href = DOWNLOAD_URL;
    a.setAttribute("download", "");
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function showDone() {
    form.hidden = true;
    if (doneEl) doneEl.hidden = false;
    if (downloadAgain) {
      downloadAgain.href = DOWNLOAD_URL;
      downloadAgain.setAttribute("download", "");
    }
  }

  function payloadFromForm() {
    var fd = new FormData(form);
    var worth = fd.get("valueWorth") || "";
    if (worth === "Other") {
      var custom = (fd.get("valueWorthOther") || "").toString().trim();
      worth = custom ? "Other: " + custom : "Other";
    }
    return {
      email: (fd.get("email") || "").toString().trim(),
      firstName: (fd.get("firstName") || "").toString().trim(),
      lastName: (fd.get("lastName") || "").toString().trim(),
      emailUpdates: (fd.get("emailUpdates") || "").toString(),
      valueWorth: worth,
      comments: (fd.get("comments") || "").toString().trim(),
      source: "get.html",
      userAgent: navigator.userAgent || "",
    };
  }

  function parseSheetResponse(text) {
    try {
      var parsed = JSON.parse(text);
      if (parsed && parsed.ok) return { ok: true };
    } catch (ignore) {}
    return { failed: true };
  }

  function postToSheet(data) {
    if (!SHEETS_ENDPOINT) {
      return Promise.resolve({ skipped: true });
    }
    // CORS + plain text/plain (no charset) so the browser can read {"ok":true}
    // after GAS's redirect. charset=utf-8 on no-cors used to look successful
    // while the POST never reached the sheet.
    return fetch(SHEETS_ENDPOINT, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        return res.text().then(parseSheetResponse);
      })
      .catch(function () {
        var body = new URLSearchParams({
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          emailUpdates: data.emailUpdates || "",
          valueWorth: data.valueWorth || "",
          comments: data.comments || "",
          source: data.source || "",
          userAgent: data.userAgent || "",
        });
        return fetch(SHEETS_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body,
        }).then(function () {
          return { ok: true, unverified: true };
        });
      });
  }

  form.querySelectorAll(".get-field input").forEach(function (input) {
    input.addEventListener("input", function () {
      clearFieldError(input);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus("");

    var fieldCheck = validateFormFields();
    if (!fieldCheck.ok) {
      setStatus("Fix the fields marked below, then try again.", "error");
      if (fieldCheck.focusInput) fieldCheck.focusInput.focus();
      return;
    }

    if (!form.reportValidity()) return;

    if (otherRadio && otherRadio.checked) {
      var custom = (otherText && otherText.value || "").trim();
      if (!custom) {
        setStatus("Enter an amount for Other, or pick $9 / $19 / $29.", "error");
        if (otherText) otherText.focus();
        return;
      }
    }

    var data = payloadFromForm();
    submitBtn.disabled = true;
    setStatus("Saving your answers…");

    postToSheet(data)
      .catch(function () {
        return { failed: true };
      })
      .then(function (result) {
      setStatus("");
      // Sheet POST first — a immediate cross-origin download click has been
      // flaky on some builds; the DMG still starts right after logging.
      startDownload();
      showDone();
      if (result && result.skipped) {
        setDoneStatus(
          "Download started. Sheet tracking is not configured yet (paste SHEETS_ENDPOINT in js/get-for-mac.js).",
          "warn"
        );
      } else if (result && result.failed) {
        setDoneStatus("Download started. We could not save your answers — that is OK.", "warn");
      } else if (result && result.unverified) {
        setDoneStatus(
          "Download started. Your answers may not have reached the sheet — tell support@modoi.ai if you do not hear from us.",
          "warn"
        );
      } else {
        setDoneStatus("");
      }
      submitBtn.disabled = false;
    });
  });
})();
