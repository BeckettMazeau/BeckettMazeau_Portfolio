/* ==========================================================================
   BECKETT MAZEAU — Portfolio Scripts
   Vanilla JS · No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Auto-fill copyright year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- Smooth-scroll navigation ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeMobileNav();

      var headerOffset = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h'), 10
      ) || 64;

      var top = target.getBoundingClientRect().top
              + window.pageYOffset
              - headerOffset;

      window.scrollTo({ top: top, behavior: 'smooth' });
      history.pushState(null, '', targetId);
    });
  });


  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav   = document.querySelector('.main-nav');

  function closeMobileNav() {
    if (navToggle && mainNav) {
      navToggle.classList.remove('open');
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }


  /* ---------- Scroll-triggered reveal animations ---------- */
  var revealSelectors = [
    '.about-photo-frame',
    '.about-text-col',
    '.project-card',
    '.footer-cta',
    '.footer-links',
    '.proj-overview-text',
    '.proj-sidebar',
    '.proj-gallery-item',
    '.process-step',
    '.takeaway-card',
    '.proj-nav-link',
    '.specs-table',
    '.coming-soon-card'
  ];

  function initRevealObserver() {
    revealSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
        }
      });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal').forEach(function (el) {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // Initial pass
  initRevealObserver();


  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      if (scrollY > 80) {
        header.style.borderBottomColor = 'rgba(212, 149, 42, 0.15)';
      } else {
        header.style.borderBottomColor = '';
      }
    }, { passive: true });
  }


  /* ---------- Lightbox for project gallery images ---------- */
  var lightbox    = document.getElementById('lightbox');
  var lbImg       = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  var lbCaption   = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  var lbClose     = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  if (lightbox && lbImg) {
    document.querySelectorAll('.gallery-img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lbImg.src = this.src;
        lbImg.alt = this.alt;

        var fig = this.closest('figure');
        var cap = fig ? fig.querySelector('figcaption') : null;
        if (lbCaption) {
          lbCaption.textContent = cap ? cap.textContent : '';
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lbClose) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  /* ==========================================================================
     DYNAMIC CONTENT LOADING — Projects & Updates
     ========================================================================== */

  /*
   * File naming conventions:
   *
   * UPDATES (in /updates/ folder):
   *   update1-done.html, update2-done.html, update3-done.html, ...
   *   Higher number = more recent. Only files matching "update#-done" are shown.
   *
   * PROJECTS (in /projects/ folder):
   *   For the "Selected Work" grid (up to 4 cards on the home page):
   *     project1-selected1-done.html  (project#=recency, selected#=grid position 1–4)
   *     project2-selected3-done.html
   *   For the "All Projects" page:
   *     project1-done.html, project2-done.html, ...
   *     Higher number = more recently completed.
   *
   * Each HTML file must contain these <meta> tags in its <head> for metadata:
   *   <meta name="card-title"   content="Project or Update Title">
   *   <meta name="card-excerpt" content="Short description for the card.">
   *   <meta name="card-image"   content="../images/your-image.jpg">
   *   <meta name="card-tag"     content="Mechatronics">
   *   <meta name="card-date"    content="2026-03-17">
   *   <meta name="card-techs"   content="Arduino,KiCad,C++">  (projects only, comma-separated)
   */

  var MAX_PROBE = 50; // max number to probe for each type

  /**
   * Check if a file exists at the given URL using a HEAD request.
   * Returns a promise that resolves to true/false.
   */
  function fileExists(url) {
    return fetch(url, { method: 'HEAD' })
      .then(function (res) { return res.ok; })
      .catch(function () { return false; });
  }

  /**
   * Fetch an HTML page and extract <meta name="card-*"> values.
   * Returns a promise that resolves to an object of metadata, or null on failure.
   */
  function fetchMeta(url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) return null;
        return res.text();
      })
      .then(function (html) {
        if (!html) return null;
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var meta = {};
        doc.querySelectorAll('meta[name^="card-"]').forEach(function (tag) {
          var key = tag.getAttribute('name').replace('card-', '');
          meta[key] = tag.getAttribute('content') || '';
        });
        meta._url = url;
        return meta;
      })
      .catch(function () { return null; });
  }

  /**
   * Build HTML for a "coming soon" placeholder.
   */
  function comingSoonHTML(message) {
    return '<div class="coming-soon-card">' +
      '<div class="coming-soon-icon" aria-hidden="true">⚙</div>' +
      '<h3 class="coming-soon-title">More Coming Soon</h3>' +
      '<p class="coming-soon-text">' + message + '</p>' +
    '</div>';
  }

  /**
   * Format a date string (YYYY-MM-DD) into a readable form.
   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    return months[m - 1] + ' ' + d + ', ' + parts[0];
  }


  /* ---------- Load Updates ---------- */
  function loadUpdates() {
    var container = document.getElementById('updates-feed');
    if (!container) return;

    // Probe for update files: update1-done.html, update2-done.html, ...
    var probes = [];
    for (var i = 1; i <= MAX_PROBE; i++) {
      probes.push({ num: i, url: 'updates/update' + i + '-done.html' });
    }

    // Check existence of all probes in parallel
    Promise.all(
      probes.map(function (p) {
        return fileExists(p.url).then(function (exists) {
          return exists ? p : null;
        });
      })
    ).then(function (results) {
      // Filter to found files
      var found = results.filter(function (r) { return r !== null; });

      if (found.length === 0) {
        // No updates found — show coming soon
        container.innerHTML = comingSoonHTML(
          'Updates are on the way. Check back soon for progress notes, design decisions, and lessons from the workbench.'
        );
        initRevealObserver();
        return;
      }

      // Sort by number descending (higher = more recent first)
      found.sort(function (a, b) { return b.num - a.num; });

      // Fetch metadata for each
      return Promise.all(
        found.map(function (p) {
          return fetchMeta(p.url).then(function (meta) {
            if (meta) meta._num = p.num;
            return meta;
          });
        })
      );
    }).then(function (metas) {
      if (!metas) return; // already handled (coming soon)

      var validMetas = metas.filter(function (m) { return m !== null; });

      if (validMetas.length === 0) {
        container.innerHTML = comingSoonHTML(
          'Updates are on the way. Check back soon for progress notes, design decisions, and lessons from the workbench.'
        );
        initRevealObserver();
        return;
      }

      // Build update cards
      var html = '';
      validMetas.forEach(function (meta) {
        var title   = meta.title   || 'Update #' + meta._num;
        var excerpt = meta.excerpt || '';
        var date    = meta.date    || '';
        var dateDisplay = formatDate(date);

        html += '<article class="update-card">' +
          '<a href="' + meta._url + '" class="update-card-link">' +
            (date ? '<time class="update-date" datetime="' + date + '">' + dateDisplay + '</time>' : '') +
            '<h3 class="update-title">' + title + '</h3>' +
            (excerpt ? '<p class="update-excerpt">' + excerpt + '</p>' : '') +
            '<span class="update-read-more">Read more &rarr;</span>' +
          '</a>' +
        '</article>';
      });

      container.innerHTML = html;
      initRevealObserver();
    });
  }


  /* ---------- Load Selected Projects (home page) ---------- */
  function loadSelectedProjects() {
    var container = document.getElementById('selected-projects-grid');
    var viewAllBtn = document.getElementById('projects-view-all');
    if (!container) return;

    // Probe for selected project files:
    // project{P}-selected{S}-done.html where P=1..MAX, S=1..4
    var probes = [];
    for (var p = 1; p <= MAX_PROBE; p++) {
      for (var s = 1; s <= 4; s++) {
        probes.push({
          projectNum: p,
          selectedNum: s,
          url: 'projects/project' + p + '-selected' + s + '-done.html'
        });
      }
    }

    Promise.all(
      probes.map(function (probe) {
        return fileExists(probe.url).then(function (exists) {
          return exists ? probe : null;
        });
      })
    ).then(function (results) {
      var found = results.filter(function (r) { return r !== null; });

      if (found.length === 0) {
        container.innerHTML = comingSoonHTML(
          'Project case studies are currently being documented. Check back soon to see detailed breakdowns of engineering work.'
        );
        initRevealObserver();
        return;
      }

      // Sort by selectedNum (grid position: 1=top-left, 4=bottom-right)
      found.sort(function (a, b) { return a.selectedNum - b.selectedNum; });

      // Fetch metadata for each
      return Promise.all(
        found.map(function (probe) {
          return fetchMeta(probe.url).then(function (meta) {
            if (meta) {
              meta._projectNum  = probe.projectNum;
              meta._selectedNum = probe.selectedNum;
            }
            return meta;
          });
        })
      );
    }).then(function (metas) {
      if (!metas) return; // already handled (coming soon)

      var validMetas = metas.filter(function (m) { return m !== null; });

      if (validMetas.length === 0) {
        container.innerHTML = comingSoonHTML(
          'Project case studies are currently being documented. Check back soon to see detailed breakdowns of engineering work.'
        );
        initRevealObserver();
        return;
      }

      // Re-sort by selectedNum
      validMetas.sort(function (a, b) { return a._selectedNum - b._selectedNum; });

      // Build project cards
      var html = '';
      validMetas.forEach(function (meta) {
        var title   = meta.title   || 'Project #' + meta._projectNum;
        var excerpt = meta.excerpt || '';
        var image   = meta.image   || 'https://placehold.co/720x480/111/333?text=Project';
        var tag     = meta.tag     || '';
        var techs   = meta.techs   ? meta.techs.split(',') : [];

        html += '<article class="project-card">' +
          '<a href="' + meta._url + '" class="project-card-link">' +
            '<div class="project-image">' +
              '<img src="' + image + '" alt="' + title + '" width="720" height="480" loading="lazy">' +
              (tag ? '<span class="project-tag">' + tag + '</span>' : '') +
            '</div>' +
            '<div class="project-info">' +
              '<h3>' + title + '</h3>' +
              (excerpt ? '<p>' + excerpt + '</p>' : '') +
              (techs.length ? '<ul class="project-tech">' + techs.map(function(t){ return '<li>' + t.trim() + '</li>'; }).join('') + '</ul>' : '') +
              '<span class="project-link">View Case Study &rarr;</span>' +
            '</div>' +
          '</a>' +
        '</article>';
      });

      container.innerHTML = html;

      // Show the "View All Projects" button
      if (viewAllBtn) viewAllBtn.style.display = '';
      initRevealObserver();
    });
  }


  /* ---------- Load All Projects (all-projects.html page) ---------- */
  function loadAllProjects() {
    var container = document.getElementById('all-projects-grid');
    if (!container) return;

    // Probe for project files: project1-done.html, project2-done.html, ...
    var probes = [];
    for (var i = 1; i <= MAX_PROBE; i++) {
      probes.push({ num: i, url: 'projects/project' + i + '-done.html' });
    }

    Promise.all(
      probes.map(function (p) {
        return fileExists(p.url).then(function (exists) {
          return exists ? p : null;
        });
      })
    ).then(function (results) {
      var found = results.filter(function (r) { return r !== null; });

      if (found.length === 0) {
        container.innerHTML = comingSoonHTML(
          'Project case studies are being prepared. Check back soon for detailed engineering breakdowns.'
        );
        initRevealObserver();
        return;
      }

      // Sort descending (higher number = more recent)
      found.sort(function (a, b) { return b.num - a.num; });

      return Promise.all(
        found.map(function (p) {
          return fetchMeta(p.url).then(function (meta) {
            if (meta) meta._num = p.num;
            return meta;
          });
        })
      );
    }).then(function (metas) {
      if (!metas) return;

      var validMetas = metas.filter(function (m) { return m !== null; });

      if (validMetas.length === 0) {
        container.innerHTML = comingSoonHTML(
          'Project case studies are being prepared. Check back soon for detailed engineering breakdowns.'
        );
        initRevealObserver();
        return;
      }

      var html = '';
      validMetas.forEach(function (meta) {
        var title   = meta.title   || 'Project #' + meta._num;
        var excerpt = meta.excerpt || '';
        var image   = meta.image   || 'https://placehold.co/720x480/111/333?text=Project';
        var tag     = meta.tag     || '';
        var techs   = meta.techs   ? meta.techs.split(',') : [];

        html += '<article class="project-card">' +
          '<a href="' + meta._url + '" class="project-card-link">' +
            '<div class="project-image">' +
              '<img src="' + image + '" alt="' + title + '" width="720" height="480" loading="lazy">' +
              (tag ? '<span class="project-tag">' + tag + '</span>' : '') +
            '</div>' +
            '<div class="project-info">' +
              '<h3>' + title + '</h3>' +
              (excerpt ? '<p>' + excerpt + '</p>' : '') +
              (techs.length ? '<ul class="project-tech">' + techs.map(function(t){ return '<li>' + t.trim() + '</li>'; }).join('') + '</ul>' : '') +
              '<span class="project-link">View Case Study &rarr;</span>' +
            '</div>' +
          '</a>' +
        '</article>';
      });

      container.innerHTML = html;
      initRevealObserver();
    });
  }


  /* ---------- Initialize dynamic content ---------- */
  loadUpdates();
  loadSelectedProjects();
  loadAllProjects();

})();
