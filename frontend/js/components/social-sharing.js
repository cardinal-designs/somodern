export default class SocialSharing extends HTMLElement {
  constructor() {
    super();

    this.copyButton = this.querySelector('[data-copy]');
    this.dropdown = this.querySelector('dropdown-item');
    this.successMessage = this.querySelector('[data-success]');

    this.url = this.dataset.url;

    this.copyButton.addEventListener('click', this.handleCopy.bind(this));
  }

  handleCopy() {
    navigator.clipboard.writeText(this.url)

    this.successMessage.classList.add('active');
    setTimeout(() => {
      this.successMessage.classList.remove('active');
    }, 2000);
  }
}

window.customElements.define('social-sharing', SocialSharing);