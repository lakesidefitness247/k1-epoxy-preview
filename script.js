/* K1 Epoxy — interactions: nav, reveal, stats count-up, lightbox, form */
(function () {
  "use strict";

  /* ---- year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var closeMenu = function () {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll(
    ".section__head, .card, .tile, .step, .quote, .contact__inner, .stat"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add("is-in"); }, (el.dataset.delay || 0) * 1);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    // stagger siblings
    document.querySelectorAll(".grid, .steps, .stats__inner").forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.dataset.delay = i * 80;
      });
    });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- stats count-up ---- */
  var counted = false;
  var statsSection = document.querySelector(".stats");
  var runCount = function () {
    if (counted) return; counted = true;
    document.querySelectorAll(".stat__num").forEach(function (el) {
      var target = parseInt(el.dataset.count, 10) || 0;
      var dur = 1400, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
  };
  if ("IntersectionObserver" in window && statsSection) {
    var sObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { runCount(); sObs.disconnect(); }
    }, { threshold: 0.5 });
    sObs.observe(statsSection);
  } else { runCount(); }

  /* ---- lightbox (gallery) ---- */
  var lb = document.getElementById("lightbox");
  var lbStage = document.getElementById("lightboxStage");
  var lbCap = document.getElementById("lightboxCap");
  var lbClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".tile").forEach(function (tile) {
    tile.addEventListener("click", function () {
      var style = window.getComputedStyle(tile);
      lbStage.style.backgroundImage = style.backgroundImage;
      lbCap.textContent = (tile.getAttribute("data-cap") || "").replace(/&amp;/g, "&");
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });
  var closeLb = function () { lb.hidden = true; document.body.style.overflow = ""; };
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  /* ---- demo form ---- */
  var form = document.getElementById("quoteForm");
  var success = document.getElementById("formSuccess");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    success.hidden = false;
    form.querySelector("button[type=submit]").textContent = "Request Received ✓";
  });
})();
