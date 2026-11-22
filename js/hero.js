/* Hero preview toggle: Schedule view / Glow only, plus glow-state picker. No scroll handling. */
(function () {
  var fig = document.getElementById("hero-screen");
  if (!fig) return;
  var viewBtns = document.querySelectorAll(".seg [data-view]");
  var glowBtns = document.querySelectorAll(".glow-pick [data-glow]");
  var pick = document.querySelector(".glow-pick");
  var note = document.getElementById("view-note");
  var order = ["split", "wander", "present", "flow"];
  var names = { split: "Split — attention is split", wander: "Wander — drifting", present: "Present — on task", flow: "Flow — deep in it" };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timer = null, userPicked = false;

  function setGlow(g) {
    fig.dataset.glow = g;
    glowBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.glow === g)); });
    if (fig.dataset.view === "glow") note.textContent = "Screen edge: " + names[g] + ".";
  }
  function stopCycle() { if (timer) { clearInterval(timer); timer = null; } }
  function startCycle() {
    stopCycle();
    if (reduce.matches || userPicked) return;
    timer = setInterval(function () {
      var i = order.indexOf(fig.dataset.glow);
      setGlow(order[(i + 1) % order.length]);
    }, 2600);
  }
  function setView(v) {
    fig.dataset.view = v;
    viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.view === v)); });
    pick.hidden = v !== "glow";
    if (v === "glow") {
      setGlow(fig.dataset.glow === "present" ? "split" : fig.dataset.glow);
      startCycle();
    } else {
      stopCycle(); userPicked = false; setGlow("present");
      note.textContent = "Your day, see-through, on top of whatever you’re working in.";
    }
  }
  viewBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.view); }); });
  glowBtns.forEach(function (b) { b.addEventListener("click", function () { userPicked = true; stopCycle(); setGlow(b.dataset.glow); }); });
  // expose for screenshots
  window.__modoiHero = { setView: setView, setGlow: function (g) { userPicked = true; stopCycle(); setGlow(g); } };
})();
