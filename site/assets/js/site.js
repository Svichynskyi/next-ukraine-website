/* Next Ukraine Foundation — site behaviour.
   Progressive enhancement only: with JavaScript disabled the nav is a plain
   list of links and every section of the page is still reachable. */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  function isCollapsed() {
    return getComputedStyle(toggle).display !== 'none';
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  /* Following a link inside the collapsed menu should close it — otherwise an
     in-page anchor scrolls behind an open panel. */
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') && isCollapsed()) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Widening past the breakpoint reveals the nav via CSS; drop the open state
     so the toggle does not come back already expanded. */
  window.addEventListener('resize', function () {
    if (!isCollapsed()) setOpen(false);
  });
}());
