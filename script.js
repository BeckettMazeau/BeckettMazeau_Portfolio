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
     ==========================================================================

     Reads site-manifest.json from the project root. The manifest is just
     arrays of filenames — the order in each array is the display order.

     MANIFEST FORMAT (site-manifest.json):
     {
       "selectedProjects": ["project-1.html", "cool-robot.html"],
       "allProjects":      ["project-1.html", "cool-robot.html", "old-thing.html"],
       "updates":          ["week-5-pcb-arrived.html", "week-3-first-prototype.html"]
     }

     - selectedProjects → shown in the "Selected Work" grid on the home page
     - allProjects      → shown on the all-projects.html page
     - updates          → shown in the "Updates" feed on the home page

     Files can be named anything. The same file can appear in multiple arrays.
     Project files live in /projects/, update files live in /updates/.

     Each file needs these <meta> tags in its <head> for card content:
       <meta name="card-title"   content="Title">
       <meta name="card-excerpt" content="Short description.">
       <meta name="card-image"   content="../images/photo.jpg">    (projects)
       <meta name="card-tag"     content="Mechatronics">            (projects)
       <meta name="card-date"    content="2026-03-17">              (updates)
       <meta name="card-techs"   content="Arduino,KiCad,C++">      (projects, comma-sep)
  */


  /**
   * Determine the base path to the site root from the current page.
   */
  function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/projects/') !== -1 || path.indexOf('/updates/') !== -1) {
      return '../';
    }
    return '';
  }

  var BASE = getBasePath();

  /**
   * Fetch an HTML page and extract <meta name="card-*"> values.
   */
  async function fetchMeta(url) {
    try {
      var res = await fetch(url);
      if (!res.ok) throw new Error('Not found');
      var html = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var meta = {};
      doc.querySelectorAll('meta[name^="card-"]').forEach(function (tag) {
        var key = tag.getAttribute('name').replace('card-', '');
        meta[key] = tag.getAttribute('content') || '';
      });
      meta._url = url;
      return meta;
    } catch (err) {
      return null;
    }
  }

  /**
   * Build HTML for a "coming soon" placeholder.
   */
  function comingSoonHTML(message) {
    return '<div class="coming-soon-card">' +
      '<div class="coming-soon-icon" aria-hidden="true">\u2699</div>' +
      '<h3 class="coming-soon-title">More Coming Soon</h3>' +
      '<p class="coming-soon-text">' + message + '</p>' +
    '</div>';
  }

  /**
   * Format YYYY-MM-DD into readable form.
   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
  }

  /**
   * Build a project card from metadata.
   */
  function projectCardHTML(meta) {
    var title   = meta.title   || 'Untitled Project';
    var excerpt = meta.excerpt || '';
    var image   = meta.image   || 'https://placehold.co/720x480/111/333?text=Project';
    var tag     = meta.tag     || '';
    var techs   = meta.techs   ? meta.techs.split(',') : [];

    return '<article class="project-card">' +
      '<a href="' + meta._url + '" class="project-card-link">' +
        '<div class="project-image">' +
          '<img src="' + image + '" alt="' + title + '" width="720" height="480" loading="lazy">' +
          (tag ? '<span class="project-tag">' + tag + '</span>' : '') +
        '</div>' +
        '<div class="project-info">' +
          '<h3>' + title + '</h3>' +
          (excerpt ? '<p>' + excerpt + '</p>' : '') +
          (techs.length ? '<ul class="project-tech">' + techs.map(function (t) { return '<li>' + t.trim() + '</li>'; }).join('') + '</ul>' : '') +
          '<span class="project-link">View Case Study &rarr;</span>' +
        '</div>' +
      '</a>' +
    '</article>';
  }

  /**
   * Build an update card from metadata.
   */
  function updateCardHTML(meta) {
    var title   = meta.title   || 'Untitled Update';
    var excerpt = meta.excerpt || '';
    var date    = meta.date    || '';

    return '<article class="update-card">' +
      '<a href="' + meta._url + '" class="update-card-link">' +
        (date ? '<time class="update-date" datetime="' + date + '">' + formatDate(date) + '</time>' : '') +
        '<h3 class="update-title">' + title + '</h3>' +
        (excerpt ? '<p class="update-excerpt">' + excerpt + '</p>' : '') +
        '<span class="update-read-more">Read more &rarr;</span>' +
      '</a>' +
    '</article>';
  }


  /**
   * Generic loader: takes a list of filenames, a folder prefix, a card
   * builder function, a container element, and a fallback message.
   * Fetches metadata for each file, builds cards, injects into container.
   */
  async function loadSection(filenames, folder, cardBuilder, container, fallbackMsg, onSuccess) {
    if (!container) return;

    if (!filenames || filenames.length === 0) {
      container.innerHTML = comingSoonHTML(fallbackMsg);
      initRevealObserver();
      return;
    }

    var metas = await Promise.all(
      filenames.map(function (file) {
        return fetchMeta(BASE + folder + file);
      })
    );

    var valid = metas.filter(function (m) { return m !== null; });

    if (valid.length === 0) {
      container.innerHTML = comingSoonHTML(fallbackMsg);
      initRevealObserver();
      return;
    }

    container.innerHTML = valid.map(cardBuilder).join('');
    if (onSuccess) onSuccess();
    initRevealObserver();
  }


  /* ---------- Load manifest and populate all sections ---------- */
  async function initSections() {
    try {
      var res = await fetch(BASE + 'site-manifest.json');
      if (!res.ok) throw new Error('Manifest not found');
      var manifest = await res.json();

      // Selected Projects (home page grid)
      await loadSection(
        manifest.selectedProjects,
        'projects/',
        projectCardHTML,
        document.getElementById('selected-projects-grid'),
        'Project case studies are currently being documented. Check back soon to see detailed breakdowns of engineering work.',
        function () {
          var btn = document.getElementById('projects-view-all');
          if (btn) btn.style.display = '';
        }
      );

      // All Projects (all-projects.html page)
      await loadSection(
        manifest.allProjects,
        'projects/',
        projectCardHTML,
        document.getElementById('all-projects-grid'),
        'Project case studies are being prepared. Check back soon for detailed engineering breakdowns.'
      );

      // Updates (home page feed)
      await loadSection(
        manifest.updates,
        'updates/',
        updateCardHTML,
        document.getElementById('updates-feed'),
        'Updates are on the way. Check back soon for progress notes, design decisions, and lessons from the workbench.'
      );

    } catch (err) {
      console.warn('site-manifest.json not found or invalid:', err);

      var projMsg = comingSoonHTML('Project case studies are currently being documented. Check back soon.');
      var updMsg  = comingSoonHTML('Updates are on the way. Check back soon.');

      var selGrid = document.getElementById('selected-projects-grid');
      var allGrid = document.getElementById('all-projects-grid');
      var updFeed = document.getElementById('updates-feed');

      if (selGrid) selGrid.innerHTML = projMsg;
      if (allGrid) allGrid.innerHTML = projMsg;
      if (updFeed) updFeed.innerHTML = updMsg;
      initRevealObserver();
    }
  }

  initSections();

})();
