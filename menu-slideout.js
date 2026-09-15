/* This Code is Licensed by schwartz-edmisten.com */
function desktopMobileMenu(options = {}) {
  if (window.desktopMobileMenuInitialized) return;
  window.desktopMobileMenuInitialized = true;

  const config = {
    menuClass: 'cse-menu-enabled',
  };

  const hasCustomBreakpoint = options.hasOwnProperty('breakpoint');
  config.breakpoint = hasCustomBreakpoint ? options.breakpoint : '1000000px';

  function closeMenu() {
    const burgerButton = document.querySelector('.cse-burger button');
    if (burgerButton) burgerButton.classList.remove('burger--active');
    document.body.classList.remove('cse--menu-open');
    document.body.focus();
  }

  function initBurgerMenu() {
    function setup() {
      const header = document.getElementById('header');
      if (!header) return;

      const original = header.querySelector('.header-display-desktop .header-burger');
      if (original) {
        const container = original.parentNode;
        const clone = original.cloneNode(true);
        clone.classList.add('cse-burger');
        container.appendChild(clone);
        clone.querySelector('button').addEventListener('click', function() {
          this.classList.toggle('burger--active');
          document.body.classList.toggle('cse--menu-open');
          document.body.focus();
        });
      }

      const overlay = document.createElement('div');
      overlay.className = 'cse-menu-overlay';
      header.appendChild(overlay);
      overlay.addEventListener('click', closeMenu);

      const menu = header.querySelector('.header-menu');
      if (menu) {
        menu.addEventListener('click', function(e) {
          const link = e.target.closest('a[href]');
          if (!link) return;
          if (link.hasAttribute('data-folder-id')) return;
          if (link.closest('.header-menu-controls')) return;
          if (link.target === '_blank') return;

          const isSamePage =
            link.hash &&
            link.host === window.location.host &&
            link.pathname === window.location.pathname;

          if (isSamePage) closeMenu();
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  function applyBreakpoint() {
    const sqspMobileQuery = '(pointer: coarse) and (max-width: 1024px), (max-width: 799px)';

    const shouldActivate = () => {
      const isSqspMobile = window.matchMedia(sqspMobileQuery).matches;
      const isBelowBreakpoint = window.matchMedia('(max-width: ' + config.breakpoint + ')').matches;

      if (isSqspMobile) {
        document.documentElement.classList.remove(config.menuClass);
      } else if (isBelowBreakpoint) {
        document.documentElement.classList.add(config.menuClass);
      } else {
        document.documentElement.classList.remove(config.menuClass);
      }
    };

    shouldActivate();

    const sqspMql = window.matchMedia(sqspMobileQuery);
    const customMql = window.matchMedia('(max-width: ' + config.breakpoint + ')');

    sqspMql.addEventListener('change', shouldActivate);
    customMql.addEventListener('change', shouldActivate);
  }

  initBurgerMenu();
  applyBreakpoint();
  return config;
}
