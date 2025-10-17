export default class VideoSection extends HTMLElement {
  constructor() {
    super();

    this.playButton = this.querySelector('[data-play]');
    this.placeholder = this.querySelector('[data-placeholder]');
    this.external = this.dataset.external;

    this.playButton.addEventListener('click', this.onButtonClick.bind(this));
  }

  onButtonClick() {
    this.placeholder.remove();
    if (this.external == 'false') {
      this.querySelector('video').play();
    } else {
      const iframe = this.querySelector('iframe');
      const src = iframe.getAttribute('src');
      const symbol = iframe.src.indexOf("?") > -1 ? "&" : "?";

      iframe.setAttribute('src', src + symbol + 'autoplay=1');
    }
  }
}

window.customElements.define('video-section', VideoSection);