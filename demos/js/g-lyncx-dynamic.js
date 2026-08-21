(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktopDay = window.matchMedia("(min-width: 861px)");

  /* Chapter progress dots */
  var chapters = Array.prototype.slice.call(document.querySelectorAll("[data-chapter]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".chapter-dots [data-dot]"));

  function setActiveChapter(id) {
    dots.forEach(function (dot) {
      var on = dot.getAttribute("data-dot") === id;
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && chapters.length) {
    var chapterObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
        if (visible) setActiveChapter(visible.target.getAttribute("data-chapter"));
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.15, 0.4, 0.7] }
    );
    chapters.forEach(function (ch) { chapterObserver.observe(ch); });
  }

  /* Entrance reveals */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-reveal");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-reveal");
    });
  }

  /* Sticky day beats — scroll progress through 4 scenes */
  var track = document.getElementById("day-track");
  var copyPanels = Array.prototype.slice.call(document.querySelectorAll(".day-panel-copy"));
  var visualPanels = Array.prototype.slice.call(document.querySelectorAll(".day-panel-visual"));
  var beatDots = Array.prototype.slice.call(document.querySelectorAll("[data-beat-dot]"));
  var currentBeat = 0;

  function setBeat(index) {
    if (index === currentBeat) return;
    currentBeat = index;
    copyPanels.forEach(function (p) {
      p.classList.toggle("is-active", Number(p.getAttribute("data-beat")) === index);
    });
    visualPanels.forEach(function (p) {
      p.classList.toggle("is-active", Number(p.getAttribute("data-beat")) === index);
    });
    beatDots.forEach(function (d) {
      var n = Number(d.getAttribute("data-beat-dot"));
      d.classList.toggle("is-on", n <= index);
    });
  }

  function updateDayBeat() {
    if (!track || !desktopDay.matches) return;
    var rect = track.getBoundingClientRect();
    var stickyTop = 56;
    var viewH = window.innerHeight - stickyTop;
    var scrolled = stickyTop - rect.top;
    var range = Math.max(1, rect.height - viewH);
    var progress = Math.min(1, Math.max(0, scrolled / range));
    var beat = Math.min(3, Math.floor(progress * 4));
    if (progress >= 0.98) beat = 3;
    setBeat(beat);
  }

  /* Scroll-linked text fade — nav + hero copy (not hero media) */
  var hero = document.getElementById("hero");
  var nav = document.getElementById("nav");
  var heroCopy = document.querySelector(".hero-copy");

  function updateTextFade() {
    if (!hero) return;
    if (reduceMotion) {
      if (nav) nav.style.setProperty("--nav-fade", "1");
      if (heroCopy) heroCopy.style.setProperty("--hero-copy-fade", "1");
      return;
    }
    var rect = hero.getBoundingClientRect();
    var heroH = Math.max(1, rect.height);
    var progress = Math.min(1, Math.max(0, -rect.top / heroH));
    /* Nav: 1 at top → ~0.45 once past hero */
    var navOpacity = 1 - progress * 0.55;
    /* Hero copy: fade out as the section leaves the viewport */
    var visibleRatio = Math.min(1, Math.max(0, rect.bottom / heroH));
    var copyOpacity = Math.max(0.15, visibleRatio);

    if (nav) nav.style.setProperty("--nav-fade", String(navOpacity));
    if (heroCopy) heroCopy.style.setProperty("--hero-copy-fade", String(copyOpacity));
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateDayBeat();
      updateTextFade();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  desktopDay.addEventListener("change", function () {
    if (!desktopDay.matches) {
      copyPanels.forEach(function (p) { p.classList.add("is-active"); });
    } else {
      updateDayBeat();
    }
  });

  updateDayBeat();
  updateTextFade();
})();
