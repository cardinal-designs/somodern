export default class SiteHeader extends HTMLElement {
  constructor() {
    super();

    this.header = this.querySelector('header');
    this.headerHeight = this.header.offsetHeight; 
    this.headerGroupHeight = document.querySelector('.header-group').offsetHeight;

    // Check position on load
    this.onScroll();
    document.documentElement.style.setProperty('--header-height', (this.headerHeight + 1) + 'px');
    document.documentElement.style.setProperty('--header-group-height', (this.headerGroupHeight - 1) + 'px');

    // Watch for window changes
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onScroll(event) {
    if (window.scrollY > 5) {
      document.documentElement.classList.add('scrolled');
    } else {
      document.documentElement.classList.remove('scrolled');
    }
  }

  onWindowResize() {
    const resizeHeight = this.header.offsetHeight;
    const headerGroupHeight = document.querySelector('.header-group').offsetHeight;

    document.documentElement.style.setProperty('--header-height', (resizeHeight + 1) + 'px');
    document.documentElement.style.setProperty('--header-group-height', headerGroupHeight + 'px');
  }
}

window.customElements.define('site-header', SiteHeader);