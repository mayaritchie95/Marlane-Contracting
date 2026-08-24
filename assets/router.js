/* MarLane Contracting — single-page router
   Shows one .page section at a time based on the URL hash. */
(function () {
  "use strict";
  var pages = document.querySelectorAll(".page");
  if (!pages.length) return;

  function show(id, anchor) {
    var found = false;
    pages.forEach(function (pg) {
      var on = pg.id === "page-" + id;
      pg.style.display = on ? "block" : "none";
      if (on) found = true;
    });
    if (!found) {
      id = "home";
      pages.forEach(function (pg) {
        pg.style.display = pg.id === "page-home" ? "block" : "none";
      });
    }
    document.querySelectorAll("[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // reveal-on-scroll elements: mark visible for the now-shown page
    document.querySelectorAll(".page .reveal").forEach(function (el) {
      el.classList.add("in");
    });
    if (anchor) {
      var t = document.getElementById(anchor);
      if (t) { t.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-page]");
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute("data-page");
    var anchor = a.getAttribute("data-anchor") || "";
    history.replaceState(null, "", "#" + id);
    show(id, anchor);
    var menu = document.getElementById("menu");
    if (menu) menu.classList.remove("open");
  });

  window.addEventListener("hashchange", function () {
    show((location.hash || "#home").replace("#", ""), "");
  });

  show((location.hash || "#home").replace("#", ""), "");
})();
