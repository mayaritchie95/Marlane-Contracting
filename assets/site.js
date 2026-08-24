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

  /* Footer year */
  var y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
