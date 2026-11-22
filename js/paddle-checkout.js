/**
 * Modoi pricing — Paddle Billing overlay checkout (pricing.html).
 */
(function () {
  var PADDLE_JS = "https://cdn.paddle.com/paddle/v2/paddle.js";
  var PADDLE_CLIENT_TOKEN = "live_61142e6a267937bb56b3ffa4074";
  var MODOI_PRICE_ID = "pri_01m80za2kpt67cqx4pz57esepb";
  var CHECKOUT_SUCCESS_URL = "https://modoi.ai/get.html?checkout=success";
  var DOWNLOAD_FALLBACK_URL = "get.html";

  var trialBtn = document.getElementById("paddle-start-trial");
  var paddleFailed = false;

  function warn(message) {
    console.warn("[modoi/paddle]", message);
  }

  function checkoutSettings() {
    return {
      displayMode: "overlay",
      theme: "light",
      successUrl: CHECKOUT_SUCCESS_URL,
    };
  }

  function goFallback(reason) {
    warn(reason);
    window.location.href = DOWNLOAD_FALLBACK_URL;
  }

  function paddleAvailable() {
    return typeof window.Paddle !== "undefined" && !paddleFailed;
  }

  function initializePaddle() {
    if (typeof window.Paddle === "undefined") {
      paddleFailed = true;
      warn("Paddle is not defined after paddle.js loaded.");
      return;
    }
    try {
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        checkout: {
          settings: checkoutSettings(),
        },
      });
      // Default payment links (?_ptxn=txn_...) open checkout after Initialize.
    } catch (err) {
      paddleFailed = true;
      warn("Paddle.Initialize failed: " + err);
    }
  }

  function openModoiCheckout() {
    if (!paddleAvailable()) {
      goFallback("Paddle unavailable; redirecting to free download.");
      return;
    }
    try {
      window.Paddle.Checkout.open({
        items: [{ priceId: MODOI_PRICE_ID, quantity: 1 }],
        settings: checkoutSettings(),
      });
    } catch (err) {
      goFallback("Paddle.Checkout.open failed: " + err);
    }
  }

  function loadPaddleScript() {
    if (typeof window.Paddle !== "undefined") {
      initializePaddle();
      return;
    }
    if (document.querySelector('script[src="' + PADDLE_JS + '"]')) {
      return;
    }
    var tag = document.createElement("script");
    tag.src = PADDLE_JS;
    tag.async = true;
    tag.onload = initializePaddle;
    tag.onerror = function () {
      paddleFailed = true;
      warn("paddle.js failed to load.");
    };
    document.head.appendChild(tag);
  }

  if (trialBtn) {
    trialBtn.addEventListener("click", function (event) {
      event.preventDefault();
      openModoiCheckout();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPaddleScript);
  } else {
    loadPaddleScript();
  }
})();