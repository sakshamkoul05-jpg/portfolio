/* Saksham Koul — portfolio
   Motion vocabulary: a fast intro curtain with an index counter,
   masked hero lines, quiet staggered reveals — and one living
   detail: a poster that follows the cursor across the index. */

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Live clocks — Chandigarh (Asia/Kolkata) + Sydney, ticking */
  var fmtInH = null, fmtInS = null, fmtSydH = null, fmtSydS = null;
  try {
    fmtInH = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    fmtInS = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" });
    fmtSydH = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Australia/Sydney" });
    fmtSydS = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Australia/Sydney" });
  } catch (e) { /* Intl timeZone unsupported — clocks stay as dashes */ }
  var hdrIn = document.getElementById("hdrIn"), hdrSyd = document.getElementById("hdrSyd");
  var clockIn = document.getElementById("clockIn"), clockSyd = document.getElementById("clockSyd");
  function tick() {
    if (!fmtInS) return;
    var now = new Date();
    if (hdrIn) hdrIn.textContent = fmtInH.format(now);
    if (hdrSyd) hdrSyd.textContent = fmtSydH.format(now);
    if (clockIn) clockIn.textContent = fmtInS.format(now);
    if (clockSyd) clockSyd.textContent = fmtSydS.format(now);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Intro: counter 00 → 19 + rule draw, <1.2s, skippable ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    if (reduced) {
      intro.remove();
    } else {
      var introNum = document.getElementById("introNum");
      var ruleFill = document.getElementById("introRuleFill");
      var done = false;
      document.documentElement.classList.add("intro-lock");
      function finish() {
        if (done) return;
        done = true;
        intro.classList.add("done");
        document.documentElement.classList.remove("intro-lock");
        setTimeout(function () { if (intro.parentNode) intro.remove(); }, 700);
      }
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
        window.addEventListener(ev, finish, { passive: true });
      });
      var start = null, DUR = 650;
      function step(ts) {
        if (done) return;
        if (!start) start = ts;
        var p = Math.min((ts - start) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        if (introNum) introNum.textContent = ("0" + Math.round(eased * 19)).slice(-2);
        if (ruleFill) ruleFill.style.transform = "scaleX(" + p + ")";
        if (p < 1) requestAnimationFrame(step);
        else setTimeout(finish, 130);
      }
      requestAnimationFrame(step);
      setTimeout(finish, 1400); /* hard cap — never trap the visitor */
    }
  }

  /* ---------- Hover preview: a poster that follows the cursor ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var pv = document.getElementById("preview");
  if (pv && fine && !reduced) {
    var pvNo = pv.querySelector(".pv-no"), pvSector = pv.querySelector(".pv-sector"),
        pvMid = pv.querySelector(".pv-mid"), pvName = pv.querySelector(".pv-name"),
        pvType = pv.querySelector(".pv-type"), pvCta = pv.querySelector(".pv-cta");
    var PW = 300, PH = 384;
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty, lastTx = tx, rot = 0;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.querySelectorAll(".row[data-pv]").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        pv.setAttribute("data-variant", row.getAttribute("data-variant") || "a");
        pvNo.textContent = "No. " + row.getAttribute("data-no");
        pvSector.textContent = row.getAttribute("data-sector") || "";
        pvMid.textContent = (row.getAttribute("data-variant") === "d")
          ? (row.getAttribute("data-word") || row.getAttribute("data-short") || "")
          : (row.getAttribute("data-short") || "");
        pvName.textContent = row.getAttribute("data-name") || "";
        pvType.textContent = row.getAttribute("data-type") || "";
        pvCta.textContent = row.getAttribute("data-cta") || "";
        x = tx; y = ty; /* enter under the cursor — no flying in from afar */
        pv.classList.add("on");
      });
      row.addEventListener("mouseleave", function () { pv.classList.remove("on"); });
    });
    (function frame() {
      var nx = tx + 30;
      if (nx + PW > window.innerWidth - 14) nx = tx - PW - 30;
      var ny = ty - PH / 2;
      ny = Math.max(12, Math.min(ny, window.innerHeight - PH - 12));
      x += (nx - x) * 0.13;
      y += (ny - y) * 0.13;
      var targetRot = Math.max(-6, Math.min(6, (tx - lastTx) * 0.32));
      rot += (targetRot - rot) * 0.1;
      lastTx = tx;
      pv.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg)";
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- Reveals ---------- */
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
