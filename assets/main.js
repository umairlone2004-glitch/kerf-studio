/* Kerf — site behaviour. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- theme ---------- */
  var themeBtn = document.getElementById("theme");
  var stored = null;
  try { stored = localStorage.getItem("kerf-theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("kerf-theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#131209" : "#efebe3");
    });
  }

  /* ---------- nav shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  var menuBtn = document.getElementById("menuBtn");
  var drawerOpen = false;

  function setDrawer(open) {
    if (!drawer || !menuBtn) return;
    drawerOpen = open;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      drawer.hidden = false;
      window.requestAnimationFrame(function () {
        drawer.setAttribute("data-open", "true");
      });
    } else {
      drawer.setAttribute("data-open", "false");
      window.setTimeout(function () {
        if (!drawerOpen) drawer.hidden = true;
      }, 520);
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setDrawer(!drawerOpen); });
  }
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawerOpen) setDrawer(false);
  });

  /* ---------- clock (IST) ---------- */
  var clocks = [document.getElementById("clock"), document.getElementById("clock2")].filter(Boolean);
  function tick() {
    var t = new Date().toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    clocks.forEach(function (el) { el.textContent = t + " IST"; });
  }
  if (clocks.length) { tick(); window.setInterval(tick, 20000); }

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- count up ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
    var start = null;
    var duration = 1300;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) window.requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    window.requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(animate);
  }

  /* ---------- scroll spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute("href") === "#" + entry.target.id;
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
