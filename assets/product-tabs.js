/**
 * Product Tabs — Anchor-style
 *
 * All panels are always visible. Clicking a tab scrolls smoothly to
 * the corresponding panel and highlights that tab. Scrolling through
 * panels auto-highlights the matching tab (scroll spy).
 */
class ProductTabs extends HTMLElement {
  connectedCallback() {
    requestAnimationFrame(() => this._init());
  }

  disconnectedCallback() {
    if (this._scrollHandler)
      window.removeEventListener('scroll', this._scrollHandler);
    clearTimeout(this._scrollEndTimer);
  }

  /* ── Init ── */

  _init() {
    if (!this.isConnected) return;

    this.tabs = [...this.querySelectorAll('[role="tab"]')];
    this.panels = [...this.querySelectorAll('[data-tab-panel]')];
    this.headerWrapper = this.querySelector('[data-tabs-header]');
    this.header = this.querySelector('.product-tabs__header');
    this.isSticky = this.getAttribute('data-enable-sticky') === 'true';
    this._isScrolling = false;

    if (!this.tabs.length || !this.panels.length) return;

    this._highlightTab(this.tabs[0]);

    this._bindTabClicks();
    this._setupScrollSpy();
  }

  /* ── Tab click: scroll to panel + highlight ── */

  _bindTabClicks() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this._highlightTab(tab);
        this._scrollToPanel(tab);
      });
    });
  }

  _scrollToPanel(tab) {
    const panelId = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const offset = this._getScrollOffset() + 10;
    const top = panel.getBoundingClientRect().top + window.scrollY - offset;

    // Lock scroll spy during animation; each subsequent scroll event
    // extends a debounce timer that only releases 80ms after the last
    // scroll event — ensuring the animation has truly settled.
    this._isScrolling = true;
    this._debounceScrollEnd();

    window.scrollTo({ top, behavior: 'smooth' });
  }

  _debounceScrollEnd() {
    clearTimeout(this._scrollEndTimer);
    this._scrollEndTimer = setTimeout(() => {
      if (window.scrollY !== this._lastScrollY) {
        this._lastScrollY = window.scrollY;
        this._debounceScrollEnd();
        return;
      }
      this._isScrolling = false;
      // Don't call _syncActiveTab here — the manual scroll may not land
      // exactly on the header-bottom boundary, causing it to pick the
      // previous panel. Let the user's next physical scroll trigger sync.
    }, 80);
  }

  _highlightTab(tab) {
    this.tabs.forEach((t) => {
      t.classList.remove('product-tabs__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('product-tabs__tab--active');
    tab.setAttribute('aria-selected', 'true');
    this._ensureTabVisible(tab);
  }

  /* ── Scroll spy via scroll + rAF ── */

  _setupScrollSpy() {
    if (this.panels.length < 2) return;

    this._cachedOffset = this._getScrollOffset();
    this._applyOffsetVar();

    this._scrollHandler = () => {
      this._lastScrollY = window.scrollY;
      if (this._isScrolling) {
        this._debounceScrollEnd(); // Extend debounce during animation
        return;
      }
      if (this._rafId) return;
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        this._syncActiveTab();
      });
    };
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._syncActiveTab();
  }

  _syncActiveTab() {
    if (!this.panels.length || !this.tabs.length || this._isScrolling) return;

    const headerBottom = this._getScrollOffset();

    let currentPanel = null;

    for (const panel of this.panels) {
      if (panel.getBoundingClientRect().top <= headerBottom) {
        currentPanel = panel;
      }
    }

    if (currentPanel) {
      const tab = this.tabs.find(
        (t) => t.getAttribute('aria-controls') === currentPanel.id
      );
      if (tab && !tab.classList.contains('product-tabs__tab--active')) {
        this._highlightTab(tab);
      }
    }
  }

  _applyOffsetVar() {
    document.documentElement.style.setProperty(
      '--product-tabs-offset',
      this._cachedOffset + 'px'
    );
  }

  /* ── Helpers ── */

  _getScrollOffset() {
    let offset = 0;
    if (this.headerWrapper && this.isSticky) {
      offset += this.headerWrapper.offsetHeight;
    }
    return offset;
  }

  _ensureTabVisible(tab) {
    if (!this.header) return;
    const cr = this.header.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    if (tr.left < cr.left) {
      this.header.scrollLeft -= cr.left - tr.left + 8;
    } else if (tr.right > cr.right) {
      this.header.scrollLeft += tr.right - cr.right + 8;
    }
  }
}

customElements.define('product-tabs', ProductTabs);
