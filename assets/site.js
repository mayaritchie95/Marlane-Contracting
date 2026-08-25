/* MarLane Contracting — shared site scripts */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Gallery filtering */
  var filterBar = document.querySelector(".gallery-filters");
  if (filterBar) {
    var tiles = document.querySelectorAll(".gallery .tile");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      tiles.forEach(function (t) {
        var cats = (t.getAttribute("data-cat") || "").split(" ");
        t.style.display = (f === "all" || cats.indexOf(f) > -1) ? "" : "none";
      });
    });
  }

  /* Contact / project form — client-side validation + mailto fallback */
  var form = document.querySelector("#project-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var d = new FormData(form);
      var subject = "New project enquiry — " + (d.get("name") || "MarLane website");
      var body =
        "Name: " + (d.get("name") || "") + "\n" +
        "Email: " + (d.get("email") || "") + "\n" +
        "Phone: " + (d.get("phone") || "") + "\n" +
        "Location / town: " + (d.get("location") || "") + "\n" +
        "Service of interest: " + (d.get("service") || "") + "\n" +
        "Approximate budget: " + (d.get("budget") || "") + "\n\n" +
        "Dream project / vision:\n" + (d.get("vision") || "") + "\n";
      var status = form.querySelector(".form-status");
      if (status) {
        status.classList.add("ok");
        status.textContent = "Thanks — opening your email app to send this to our team. If it doesn't open, email sales@marlanesupply.com directly.";
      }
      window.location.href =
        "mailto:sales@marlanesupply.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* Stat count-up when the band scrolls into view */
  var statNums = document.querySelectorAll(".stat .n[data-count]");
  if (statNums.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        countIO.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1100, start = null;
        function tick(t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    statNums.forEach(function (el) { countIO.observe(el); });
  }

  /* Testimonial carousel */
  var track = document.querySelector("#t-track");
  if (track) {
    var slides = track.querySelectorAll(".t-slide");
    var dotsWrap = document.querySelector(".t-dots");
    var prevBtn = document.querySelector(".t-prev");
    var nextBtn = document.querySelector(".t-next");
    var idx = 0, n = slides.length;

    for (var i = 0; i < n; i++) {
      var d = document.createElement("button");
      d.className = "t-dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Testimonial " + (i + 1));
      d.setAttribute("data-i", i);
      dotsWrap.appendChild(d);
    }
    var dots = dotsWrap.querySelectorAll(".t-dot");

    function go(i) {
      idx = (i + n) % n;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      dots.forEach(function (dot, j) {
        dot.setAttribute("aria-selected", j === idx ? "true" : "false");
      });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(idx + 1); });
    dotsWrap.addEventListener("click", function (e) {
      var b = e.target.closest(".t-dot");
      if (b) go(parseInt(b.getAttribute("data-i"), 10));
    });

    // basic swipe support
    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      startX = null;
    });

    go(0);
  }

  /* Footer year */
  var y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
