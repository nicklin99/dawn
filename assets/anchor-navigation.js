// Anchor Navigation - active state tracking on scroll
// Click handling is left to the browser's native anchor behavior.
class AnchorNavigation {
  constructor() {
    this.links = document.querySelectorAll('.anchor-navigation__link');
    this.nav = document.querySelector('.anchor-navigation');
    this.init();
  }

  init() {
    if (!this.links.length) return;

    // Sync the sticky offset into a CSS custom property so :target scroll-margin-top is accurate
    this.updateOffsetVar();
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    this.handleScroll();
  }

  updateOffsetVar() {
    const offset = this.getStickyOffset();
    document.documentElement.style.setProperty('--anchor-offset', offset + 'px');
  }

  getStickyOffset() {
    let offset = 0;

    // Site header
    const header = document.querySelector('.shopify-section-header-sticky') ||
                   document.querySelector('.header-wrapper') ||
                   document.querySelector('[data-anchor-nav-offset]');
    if (header) offset += header.offsetHeight;

    // Anchor navigation section wrapper (when sticky)
    if (this.nav) {
      const sectionId = this.nav.dataset.sectionId;
      if (sectionId) {
        const sectionEl = document.getElementById('shopify-section-' + sectionId);
        if (sectionEl && window.getComputedStyle(sectionEl).position === 'sticky') {
          offset += sectionEl.offsetHeight;
        }
      }
    }

    return offset;
  }

  handleScroll() {
    const offset = this.getStickyOffset();
    const scrollPosition = window.scrollY + offset + 20;

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
}

document.addEventListener('DOMContentLoaded', () => {
  new AnchorNavigation();
});
