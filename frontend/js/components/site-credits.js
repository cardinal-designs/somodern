export default class SiteCredits extends HTMLElement {
  constructor() {
    super();
    
    this.credits = this.querySelector('.site-credits')
    this.creditsTriggers = document.querySelectorAll('[data-open-credits]');
    this.creditsClose = this.querySelector('[data-close-credits]');

    this.creditsTriggers.forEach(button => {
      button.addEventListener('click', this.open.bind(this));
    });

    this.creditsClose.addEventListener('click', this.close.bind(this));
  }

  open() {
    this.credits.setAttribute('aria-hidden', false);
  }

  close() {
    this.credits.setAttribute('aria-hidden', true);
  }
}

window.customElements.define('site-credits', SiteCredits);