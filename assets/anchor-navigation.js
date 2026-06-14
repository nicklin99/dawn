// Anchor Navigation - active state tracking on scroll
// NOTE: Click handling is left to the browser's native anchor behavior.
// Use `scroll-margin-top` on target elements to offset sticky headers.
class AnchorNavigation {
  constructor() {
    this.links = document.querySelectorAll('.anchor-navigation__link');
    this.init();
  }

  init() {
    if (!this.links.length) return;

    // Track active section on scroll (desktop only)
    if (window.innerWidth >= 750) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      this.handleScroll();
    }
  }

  handleScroll() {
    const scrollPosition = window.scrollY + this.getHeaderHeight() + 100;

    let currentLink = null;

    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      if (scrollPosition >= target.offsetTop) {
        currentLink = link;
      }
    });

    if (currentLink) {
      this.setActiveLink(currentLink);
    }
  }

  setActiveLink(activeLink) {
    this.links.forEach(link => {
      link.classList.remove('anchor-navigation__link--active');
    });
    activeLink.classList.add('anchor-navigation__link--active');
  }

  getHeaderHeight() {
    const header = document.querySelector('.shopify-section-header-sticky') ||
                   document.querySelector('.header-wrapper') ||
                   document.querySelector('[data-anchor-nav-offset]');
    return header ? header.offsetHeight : 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AnchorNavigation();
});
