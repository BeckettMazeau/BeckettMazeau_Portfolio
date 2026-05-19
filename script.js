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
  function fetchMeta(url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(function (html) {
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
  function buildComingSoonNode(message) {
    var card = document.createElement('div');
    card.className = 'coming-soon-card';

    var icon = document.createElement('div');
    icon.className = 'coming-soon-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\u2699';
    card.appendChild(icon);

    var title = document.createElement('h3');
    title.className = 'coming-soon-title';
    title.textContent = 'More Coming Soon';
    card.appendChild(title);

    var text = document.createElement('p');
    text.className = 'coming-soon-text';
    text.textContent = message;
    card.appendChild(text);

    return card;
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
  function buildProjectCardNode(meta) {
    var title   = meta.title   || 'Untitled Project';
    var excerpt = meta.excerpt || '';
    var image   = meta.image   || 'https://placehold.co/720x480/111/333?text=Project';
    var tag     = meta.tag     || '';
    var techs   = meta.techs   ? meta.techs.split(',') : [];

    var article = document.createElement('article');
    article.className = 'project-card';

    var link = document.createElement('a');
    link.href = meta._url || '#';
    link.className = 'project-card-link';

    var imgContainer = document.createElement('div');
    imgContainer.className = 'project-image';
    var imgNode = document.createElement('img');
    imgNode.src = image;
    imgNode.alt = title;
    imgNode.width = 720;
    imgNode.height = 480;
    imgNode.loading = 'lazy';
    imgContainer.appendChild(imgNode);

    if (tag) {
      var tagNode = document.createElement('span');
      tagNode.className = 'project-tag';
      tagNode.textContent = tag;
      imgContainer.appendChild(tagNode);
    }
    link.appendChild(imgContainer);

    var infoContainer = document.createElement('div');
    infoContainer.className = 'project-info';
    var titleNode = document.createElement('h3');
    titleNode.textContent = title;
    infoContainer.appendChild(titleNode);

    if (excerpt) {
      var excerptNode = document.createElement('p');
      excerptNode.textContent = excerpt;
      infoContainer.appendChild(excerptNode);
    }

    if (techs.length) {
      var ul = document.createElement('ul');
      ul.className = 'project-tech';
      techs.forEach(function(t) {
        var li = document.createElement('li');
        li.textContent = t.trim();
        ul.appendChild(li);
      });
      infoContainer.appendChild(ul);
    }

    var caseStudy = document.createElement('span');
    caseStudy.className = 'project-link';
    caseStudy.innerHTML = 'View Case Study &rarr;';
    infoContainer.appendChild(caseStudy);

    link.appendChild(infoContainer);
    article.appendChild(link);
    return article;
  }

  /**
   * Build an update card from metadata.
   */
  function buildUpdateCardNode(meta) {
    var title   = meta.title   || 'Untitled Update';
    var excerpt = meta.excerpt || '';
    var date    = meta.date    || '';

    var article = document.createElement('article');
    article.className = 'update-card';

    var link = document.createElement('a');
    link.href = meta._url || '#';
    link.className = 'update-card-link';

    if (date) {
      var time = document.createElement('time');
      time.className = 'update-date';
      time.setAttribute('datetime', date);
      time.textContent = formatDate(date);
      link.appendChild(time);
    }

    var titleNode = document.createElement('h3');
    titleNode.className = 'update-title';
    titleNode.textContent = title;
    link.appendChild(titleNode);

    if (excerpt) {
      var excerptNode = document.createElement('p');
      excerptNode.className = 'update-excerpt';
      excerptNode.textContent = excerpt;
      link.appendChild(excerptNode);
    }

    var readMore = document.createElement('span');
    readMore.className = 'update-read-more';
    readMore.innerHTML = 'Read more &rarr;';
    link.appendChild(readMore);

    article.appendChild(link);
    return article;
  }


  /**
   * Generic loader: takes a list of filenames, a folder prefix, a card
   * builder function, a container element, and a fallback message.
   * Fetches metadata for each file, builds cards, injects into container.
   */
  function loadSection(filenames, folder, cardBuilderNode, container, fallbackMsg, onSuccess) {
    if (!container) return;

    if (!filenames || filenames.length === 0) {
      container.innerHTML = '';
      container.appendChild(buildComingSoonNode(fallbackMsg));
      initRevealObserver();
      return;
    }

    Promise.all(
      filenames.map(function (file) {
        return fetchMeta(BASE + folder + file);
      })
    ).then(function (metas) {
      var valid = metas.filter(function (m) { return m !== null; });

      container.innerHTML = '';
      if (valid.length === 0) {
        container.appendChild(buildComingSoonNode(fallbackMsg));
        initRevealObserver();
        return;
      }

      valid.forEach(function (meta) {
        container.appendChild(cardBuilderNode(meta));
      });

      if (onSuccess) onSuccess();
      initRevealObserver();
    });
  }


  /* ---------- Load manifest and populate all sections ---------- */
  fetch(BASE + 'site-manifest.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Manifest not found');
      return res.json();
    })
    .then(function (manifest) {

      // Selected Projects (home page grid)
      loadSection(
        manifest.selectedProjects,
        'projects/',
        buildProjectCardNode,
        document.getElementById('selected-projects-grid'),
        'Project case studies are currently being documented. Check back soon to see detailed breakdowns of engineering work.',
        function () {
          var btn = document.getElementById('projects-view-all');
          if (btn) btn.style.display = '';
        }
      );

      // All Projects (all-projects.html page)
      loadSection(
        manifest.allProjects,
        'projects/',
        buildProjectCardNode,
        document.getElementById('all-projects-grid'),
        'Project case studies are being prepared. Check back soon for detailed engineering breakdowns.'
      );

      // Updates (home page feed)
      loadSection(
        manifest.updates,
        'updates/',
        buildUpdateCardNode,
        document.getElementById('updates-feed'),
        'Updates are on the way. Check back soon for progress notes, design decisions, and lessons from the workbench.'
      );

    })
    .catch(function (err) {
      console.warn('site-manifest.json not found or invalid:', err);

      var selGrid = document.getElementById('selected-projects-grid');
      var allGrid = document.getElementById('all-projects-grid');
      var updFeed = document.getElementById('updates-feed');

      if (selGrid) {
        selGrid.innerHTML = '';
        selGrid.appendChild(buildComingSoonNode('Project case studies are currently being documented. Check back soon.'));
      }
      if (allGrid) {
        allGrid.innerHTML = '';
        allGrid.appendChild(buildComingSoonNode('Project case studies are currently being documented. Check back soon.'));
      }
      if (updFeed) {
        updFeed.innerHTML = '';
        updFeed.appendChild(buildComingSoonNode('Updates are on the way. Check back soon.'));
      }
      initRevealObserver();
    });

})();
