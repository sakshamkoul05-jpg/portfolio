/* Saksham Koul — portfolio
   One motion vocabulary: masked hero lines on load, quiet
   staggered reveals on scroll. Nothing else moves. */

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year + local (IST) clock */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata"
      }).format(new Date());
    } catch (e) { clock.textContent = ""; }
  }
  tick();
  setInterval(tick, 30000);

  /* Reveals */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduced || !("IntersectionObserver" in window)) {
    document.documentElement.classList.add("no-anim");
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  /* Small stagger inside each list so rows arrive like a ledger
     being written, not a uniform fade. Capped so long lists stay quick. */
  document.querySelectorAll(".index-list, .chapter").forEach(function (group) {
    var kids = group.querySelectorAll(":scope [data-reveal]");
    kids.forEach(function (el, i) {
      el.style.setProperty("--d", Math.min(i * 0.05, 0.35) + "s");
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  items.forEach(function (el) { io.observe(el); });
})();
