/* ============================================================
   Beckett Mazeau — portfolio runtime
   Static, no build. Renders nav/footer + data-driven grids,
   handles theme toggle, mobile nav, gallery lightbox, reveals.
   ============================================================ */
(function () {
  "use strict";
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "";
  var PAGE = body.getAttribute("data-page") || "home";
  var SLUG = body.getAttribute("data-slug") || "";
  var S = window.SITE;
  function r(p) { return ROOT + p; }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return (s == null ? "" : String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

  /* ---------------- THEME ---------------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("bm-theme"); } catch (e) {}
    var theme = saved || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("bm-theme", next); } catch (e) {}
  }
  initTheme();

  var SUN = '<svg class="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/></svg>';
  var MOON = '<svg class="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';

  /* ---------------- NAV + FOOTER ---------------- */
  function navLink(label, href, active) {
    return '<a href="' + href + '"' + (active ? ' class="active"' : "") + '>' + label + "</a>";
  }
  function buildNav() {
    var p = S.profile;
    var workActive = (PAGE === "projects" || PAGE === "project");
    var upActive = (PAGE === "update");
    var nav = el(
      '<header class="nav"><div class="inner">' +
        '<a class="brand" href="' + r("index.html") + '"><span class="dot"></span>' + esc(p.name) + "</a>" +
        '<div class="right">' +
          '<nav class="links">' +
            navLink("Work", r("projects.html"), workActive) +
            navLink("Updates", r("index.html") + "#updates", upActive) +
          "</nav>" +
          '<div class="tools">' +
            '<button class="toggle" id="themeBtn" aria-label="Toggle theme">' + SUN + MOON + "</button>" +
            '<a class="cta" href="mailto:' + esc(p.email) + '">Get in touch</a>' +
            '<button class="hamburger" id="hamBtn" aria-label="Menu"><span></span><span></span><span></span></button>' +
          "</div>" +
        "</div>" +
      "</div></header>"
    );
    var slot = document.getElementById("nav");
    if (slot) slot.replaceWith(nav); else body.insertBefore(nav, body.firstChild);

    // mobile menu
    var mm = el(
      '<div class="mobile-menu" id="mobileMenu">' +
        '<div class="mhead"><a class="brand" href="' + r("index.html") + '"><span class="dot"></span>' + esc(p.name) + '</a>' +
          '<button class="toggle" id="mClose" aria-label="Close">✕</button></div>' +
        '<nav class="mlinks">' +
          '<a href="' + r("index.html") + '"><span class="n">01</span>Home</a>' +
          '<a href="' + r("projects.html") + '"><span class="n">02</span>Work</a>' +
          '<a href="' + r("index.html") + '#updates"><span class="n">03</span>Updates</a>' +
          '<a href="mailto:' + esc(p.email) + '"><span class="n">04</span>Contact</a>' +
        "</nav>" +
        '<div class="mfoot mono">' + p.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + " ↗</a>"; }).join("") + "</div>" +
      "</div>"
    );
    body.appendChild(mm);
    document.getElementById("themeBtn").addEventListener("click", toggleTheme);
    var ham = document.getElementById("hamBtn");
    function openM() { mm.classList.add("open"); }
    function closeM() { mm.classList.remove("open"); }
    if (ham) ham.addEventListener("click", openM);
    document.getElementById("mClose").addEventListener("click", closeM);
    mm.querySelectorAll(".mlinks a").forEach(function (a) { a.addEventListener("click", closeM); });
  }

  function buildFooter() {
    var p = S.profile;
    var links = p.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + " ↗</a>"; }).join(" · ");
    var foot = el(
      '<footer class="foot"><div class="inner wrap">' +
        '<div class="big">Let\u2019s build something <span class="em">real.</span><br/>' +
          '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + " →</a></div>" +
        '<div class="c"><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + "</a><br/>" + links + "<br/>© 2026 " + esc(p.name) + "</div>" +
      "</div></footer>"
    );
    var slot = document.getElementById("foot");
    if (slot) slot.replaceWith(foot); else body.appendChild(foot);
  }

  /* ---------------- CARD ---------------- */
  function cardHTML(proj, idx) {
    var n = ("0" + (idx + 1)).slice(-2);
    return (
      '<a class="card reveal' + (proj.contain ? " contain" : "") + '" href="' + r("projects/" + proj.slug + ".html") + '">' +
        '<div class="frame"><img src="' + r(proj.thumb) + '" alt="' + esc(proj.title) + '" loading="lazy"/></div>' +
        '<div class="body">' +
          '<div class="top"><span class="num">' + n + "</span><span>" + esc(proj.role) + " · " + esc(proj.year) + "</span></div>" +
          "<h3>" + esc(proj.title) + "</h3>" +
          '<p class="desc">' + esc(proj.summary) + "</p>" +
          '<span class="arrow">View case study →</span>' +
        "</div>" +
      "</a>"
    );
  }
  function bySlug(slug) { return S.projects.filter(function (p) { return p.slug === slug; })[0]; }

  function updateRowHTML(u) {
    return (
      '<a class="urow reveal" href="' + r("updates/" + u.slug + ".html") + '">' +
        '<span class="ud mono">' + esc(u.date) + "</span>" +
        '<span class="ut">' + esc(u.title) + "</span>" +
        '<span class="ua">↗</span>' +
      "</a>"
    );
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    var p = S.profile;
    var hero = document.getElementById("hero");
    hero.innerHTML =
      "<div>" +
        '<span class="status mono"><span class="led"></span>' + esc(p.status) + "</span>" +
        "<h1>" + esc(p.name) + '<span class="tag">' + esc(p.tagline) + "</span></h1>" +
        "<p>" + esc(p.blurb) + "</p>" +
        '<div class="actions">' +
          '<a class="btn primary" href="' + r("projects.html") + '">View work →</a>' +
          '<a class="btn ghost" href="mailto:' + esc(p.email) + '">Get in touch</a>' +
        "</div>" +
      "</div>" +
      '<aside class="spec reveal">' +
        '<div class="sh"><span>// focus.areas</span><span>0' + p.focus.length + "</span></div>" +
        p.focus.map(function (f) { return '<div class="srow"><span>' + esc(f.k) + '</span><span class="v">' + esc(f.v) + "</span></div>"; }).join("") +
      "</aside>";

    var sel = S.home.map(bySlug).filter(Boolean);
    document.getElementById("workGrid").innerHTML = sel.map(function (pr, i) { return cardHTML(pr, i); }).join("");
    document.getElementById("updatesList").innerHTML = S.updates.map(updateRowHTML).join("");
  }

  /* ---------------- ALL PROJECTS ---------------- */
  function renderProjects() {
    document.getElementById("allGrid").innerHTML = S.projects.map(function (pr, i) { return cardHTML(pr, i); }).join("");
  }

  /* ---------------- PROJECT DETAIL ---------------- */
  function galleryItemHTML(g, i) {
    var span = g.span === "wide" ? " wide" : g.span === "tall" ? " tall" : "";
    return (
      '<figure class="gitem reveal' + span + (g.contain ? " contain" : "") + '" data-i="' + i + '">' +
        '<img src="' + r(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy"/>' +
        '<span class="zoom"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></svg></span>' +
      "</figure>"
    );
  }
  function renderProject() {
    var pr = bySlug(SLUG);
    if (!pr) return;
    document.title = pr.title + " — Beckett Mazeau";
    var head = document.getElementById("ph");
    head.innerHTML =
      '<a class="crumb" href="' + r("projects.html") + '">← All projects</a>' +
      "<h1>" + esc(pr.title) + "</h1>" +
      "<p>" + esc(pr.summary) + "</p>" +
      '<div class="detail-meta">' + pr.meta.map(function (m) {
        return '<div class="m"><div class="k">' + esc(m.k) + '</div><div class="vv">' + esc(m.v) + "</div></div>";
      }).join("") + "</div>";

    document.getElementById("bodySections").innerHTML = pr.sections.map(function (b) {
      var inner = (b.html != null) ? b.html : (b.body || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
      return '<div class="blk">' + (b.h ? "<h2>" + esc(b.h) + "</h2>" : "") + inner + "</div>";
    }).join("");

    document.getElementById("gallery").innerHTML = pr.gallery.map(galleryItemHTML).join("");
    setupLightbox(pr.gallery);

    // prev / next
    var idx = S.projects.findIndex(function (x) { return x.slug === SLUG; });
    var prev = S.projects[(idx - 1 + S.projects.length) % S.projects.length];
    var next = S.projects[(idx + 1) % S.projects.length];
    document.getElementById("pnNav").innerHTML =
      '<a class="pn prev" href="' + r("projects/" + prev.slug + ".html") + '"><div class="lbl">← Previous</div><div class="t">' + esc(prev.title) + "</div></a>" +
      '<a class="pn next" href="' + r("projects/" + next.slug + ".html") + '"><div class="lbl">Next →</div><div class="t">' + esc(next.title) + "</div></a>";
  }

  /* ---------------- UPDATE DETAIL ---------------- */
  function renderUpdate() {
    var u = S.updates.filter(function (x) { return x.slug === SLUG; })[0];
    if (!u) return;
    document.title = u.title + " — Beckett Mazeau";
    var figs = (u.figures || []).map(function (f) {
      return '<figure class="' + (f.contain ? "contain " : "") + 'lbfig"><div class="ph"><img src="' + r(f.src) + '" alt="' + esc(f.caption) + '"/></div>' +
        '<figcaption class="cap">' + esc(f.caption) + "</figcaption></figure>";
    }).join("");
    document.getElementById("post").innerHTML =
      '<a class="crumb" href="' + r("index.html") + '#updates">← Updates</a>' +
      '<div class="date">' + esc(u.date) + "</div>" +
      "<h1>" + esc(u.title) + "</h1>" +
      (u.lede ? '<p class="lede">' + esc(u.lede) + "</p>" : "") +
      '<div class="content">' + ((u.html != null) ? u.html : u.content.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("")) + figs + "</div>";
    // lightbox for update figures
    var gal = (u.figures || []).map(function (f) { return { src: f.src, caption: f.caption, contain: f.contain }; });
    var nodes = document.querySelectorAll("#post .lbfig");
    nodes.forEach(function (fig, i) {
      fig.querySelector(".ph").style.cursor = "zoom-in";
      fig.querySelector(".ph").addEventListener("click", function () { openLB(gal, i); });
    });
  }

  /* ---------------- LIGHTBOX ---------------- */
  var LB = null, lbData = [], lbIdx = 0;
  function ensureLB() {
    if (LB) return;
    LB = el(
      '<div class="lightbox" id="lightbox">' +
        '<div class="lb-count mono" id="lbCount"></div>' +
        '<button class="lb-close" id="lbClose" aria-label="Close">✕</button>' +
        '<button class="lb-btn lb-prev" id="lbPrev" aria-label="Previous">‹</button>' +
        '<button class="lb-btn lb-next" id="lbNext" aria-label="Next">›</button>' +
        '<div class="lb-stage"><div class="lb-imgwrap" id="lbWrap"><img id="lbImg" alt=""/></div>' +
        '<div class="lb-cap mono" id="lbCap"></div></div>' +
      "</div>"
    );
    body.appendChild(LB);
    document.getElementById("lbClose").addEventListener("click", closeLB);
    document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    LB.addEventListener("click", function (e) { if (e.target === LB || e.target.classList.contains("lb-stage")) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!LB.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
  function paintLB() {
    var g = lbData[lbIdx];
    document.getElementById("lbImg").src = r(g.src);
    document.getElementById("lbWrap").classList.toggle("contain", !!g.contain);
    document.getElementById("lbCap").innerHTML = esc(g.caption || "") + '<span class="idx">' + (lbIdx + 1) + " / " + lbData.length + "</span>";
    document.getElementById("lbCount").textContent = ("0" + (lbIdx + 1)).slice(-2) + " / " + ("0" + lbData.length).slice(-2);
    var multi = lbData.length > 1;
    document.getElementById("lbPrev").style.display = multi ? "grid" : "none";
    document.getElementById("lbNext").style.display = multi ? "grid" : "none";
  }
  function openLB(data, i) { ensureLB(); lbData = data; lbIdx = i; paintLB(); LB.classList.add("open"); body.style.overflow = "hidden"; }
  function closeLB() { if (LB) LB.classList.remove("open"); body.style.overflow = ""; }
  function step(d) { lbIdx = (lbIdx + d + lbData.length) % lbData.length; paintLB(); }
  function setupLightbox(gallery) {
    document.querySelectorAll("#gallery .gitem").forEach(function (item) {
      item.addEventListener("click", function () { openLB(gallery, parseInt(item.getAttribute("data-i"), 10)); });
    });
  }

  /* ---------------- REVEAL ---------------- */
  function setupReveal() {
    // Entrance motion disabled for reliability: the preview/render engine
    // does not consistently tick CSS animations/transitions, which can pin
    // content at a hidden keyframe. Content is visible by default; motion is
    // limited to user-triggered hover + theme transitions.
  }

  /* ---------------- BOOT ---------------- */
  function boot() {
    buildNav();
    if (PAGE === "home") renderHome();
    else if (PAGE === "projects") renderProjects();
    else if (PAGE === "project") renderProject();
    else if (PAGE === "update") renderUpdate();
    buildFooter();
    setupReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
