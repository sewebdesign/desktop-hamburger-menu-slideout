function desktopMobileMenu(options = {}) {
  // Check if already initialized and skip if true
  if (window.desktopMobileMenuInitialized) {
    return;
  }
  
  // Mark as initialized
  window.desktopMobileMenuInitialized = true;
  
  // Default configuration
  const config = {
    menuClass: 'cse-menu-enabled',
    lowerBreakpoint: '800px',
  };
  
  // Check if breakpoint was explicitly provided
  const hasCustomBreakpoint = options.hasOwnProperty('breakpoint');
  
  // Set breakpoint (either custom or a very large value)
  config.breakpoint = hasCustomBreakpoint ? options.breakpoint : '1000000px';
  
  // Function to initialize the burger menu
  function initBurgerMenu() {
     document.addEventListener('DOMContentLoaded', function() {
      const header = document.getElementById('header');
      if (!header) return;
      
      // Original burger code
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
      
      // Add overlay
      const overlay = document.createElement('div');
      overlay.className = 'cse-menu-overlay';
      header.appendChild(overlay);
      
      // Add click event to overlay
      overlay.addEventListener('click', function() {
        // Find the burger button and remove its active class
        const burgerButton = document.querySelector('.cse-burger button');
        if (burgerButton) {
          burgerButton.classList.remove('burger--active');
        }
        
        // Remove the menu open class from the body
        document.body.classList.remove('cse--menu-open');
        document.body.focus();
      });
    });
  }

   function applyBreakpoint() {
    // Convert breakpoint string to pixels for comparison
    function convertToPixels(value) {
      if (typeof value !== 'string') return value;    
      if (value.includes('px')) {
        return parseFloat(value);
      }
      return parseFloat(value); // fallback
    }
    
    // Check window width against breakpoints
    const breakpointInPx = convertToPixels(config.breakpoint);
    const lowerBreakpointInPx = convertToPixels(config.lowerBreakpoint);
    const windowWidth = window.innerWidth;
    
    // Apply class only if width is between lower and upper breakpoints
    if (windowWidth >= lowerBreakpointInPx && windowWidth <= breakpointInPx) {
      document.documentElement.classList.add(config.menuClass);
    } else {
      document.documentElement.classList.remove(config.menuClass);
    }
    
    // Set up the media query for screen resizing
    const mediaQueryList = window.matchMedia(
      `(min-width: ${config.lowerBreakpoint}) and (max-width: ${config.breakpoint})`
    );
    
    // Function to handle screen resize
    function handleMediaQueryChange(e) {
      if (e.matches) {
        document.documentElement.classList.add(config.menuClass);
      } else {
        document.documentElement.classList.remove(config.menuClass);
      }
    }
    
    // Add listener for screen size changes
    mediaQueryList.addEventListener('change', handleMediaQueryChange);
  }
  
  // Initialize the burger menu functionality
  initBurgerMenu();
  
  // Apply the breakpoint functionality
  applyBreakpoint();
  
  // Return the config for potential later use
  return config;
}
