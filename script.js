/* ==========================================================================
   BECKETT MAZEAU — Portfolio Scripts
   Vanilla JS · No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Auto-fill copyright year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- Smooth-scroll navigation ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;                     // skip bare "#" links
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile nav if open
      closeMobileNav();

      // Calculate offset for fixed header
      var headerOffset = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h'), 10
      ) || 64;

      var top = target.getBoundingClientRect().top
              + window.pageYOffset
              - headerOffset;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // Update URL hash without jumping
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

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }


  /* ---------- Scroll-triggered reveal animations ---------- */
  // Add .reveal class to elements we want to animate in
  var revealSelectors = [
    '.about-photo-frame',
    '.about-text-col',
    '.project-card',
    '.footer-cta',
    '.footer-links'
  ];

  revealSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('reveal');
    });
  });

  // IntersectionObserver for .reveal elements
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);        // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      if (scrollY > 80) {
        header.style.borderBottomColor = 'rgba(212, 149, 42, 0.15)';
      } else {
        header.style.borderBottomColor = '';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

})();
