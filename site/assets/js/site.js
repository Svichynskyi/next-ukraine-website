/* Next Ukraine Foundation — site behaviour.

   Progressive enhancement only. With JavaScript disabled the page is fully
   readable: the nav is a plain list of links, all three 3R panels render
   expanded (see the no-js rule applied below), and the contact form falls
   back to the email address printed next to the submit button. */
(function () {
  'use strict';

  var NARROW = 860; // the design's own breakpoint — see site.css header
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var isNarrow = function () { return window.innerWidth < NARROW; };

  /* ---------------------------------------------------------------- nav -- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
      mobileNav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    /* Widening past the breakpoint reveals the desktop nav via CSS; drop the
       open state so the burger does not come back already expanded. */
    window.addEventListener('resize', function () {
      if (!isNarrow()) setMenu(false);
    });
  }

  /* ----------------------------------------------------------- 3R panels -- */
  var strip = document.querySelector('[data-r3]');

  if (strip) {
    var panels = [].slice.call(strip.querySelectorAll('[data-r3-panel]'));
    var hoverTimer = null;

    var open = function (panel) {
      panels.forEach(function (p) {
        var on = p === panel;
        p.classList.toggle('is-open', on);
        p.setAttribute('aria-expanded', String(on));
      });
    };

    panels.forEach(function (panel) {
      /* Below the breakpoint every panel is expanded by CSS and the strip is
         a static stack, so the click/hover behaviour must stay out of the way. */
      panel.addEventListener('click', function () {
        if (!isNarrow()) open(panel);
      });

      panel.addEventListener('mouseenter', function () {
        if (isNarrow()) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { open(panel); }, 140);
      });

      /* Keyboard users land here by tabbing — no 140ms intent delay for them. */
      panel.addEventListener('focus', function () {
        if (!isNarrow()) open(panel);
      });
    });

    strip.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
  }

  /* ------------------------------------------------------------ hero wave -- */
  var wave = document.querySelector('.hero__wave');

  if (wave && reduced) {
    /* SMIL cannot be switched off from CSS, so honour the preference here:
       show every line already drawn, then stop the clock. */
    [].forEach.call(wave.querySelectorAll('clipPath rect'), function (r) {
      r.setAttribute('width', '1200');
    });
    if (wave.pauseAnimations) wave.pauseAnimations();
  }

  /* --------------------------------------------------------------- form -- */
  var form = document.querySelector('[data-contact-form]');
  var slot = document.getElementById('toast-slot');

  if (form && slot) {
    var toastTimer = null;

    var dismiss = function () {
      clearTimeout(toastTimer);
      slot.innerHTML = '';
    };

    var toast = function (message) {
      slot.innerHTML = '';

      var box = document.createElement('div');
      box.className = 'toast';
      box.setAttribute('role', 'status');

      var bar = document.createElement('span');
      bar.className = 'toast__bar';
      bar.setAttribute('aria-hidden', 'true');

      var text = document.createElement('span');
      text.className = 'toast__text';
      text.textContent = message;

      var close = document.createElement('button');
      close.className = 'toast__close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Закрити');
      close.textContent = '×';
      close.addEventListener('click', dismiss);

      box.appendChild(bar);
      box.appendChild(text);
      box.appendChild(close);
      slot.appendChild(box);

      clearTimeout(toastTimer);
      toastTimer = setTimeout(dismiss, 6000);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* The form has no backend yet — see the TODO block in index.html. It
         confirms receipt visually, exactly as the design does, and the live
         email link beside the button is the route that actually reaches us. */
      toast('Дякуємо. Поки що надішліть лист на contact@nextukraine.org — форма запрацює найближчим часом.');
    });
  }
}());
