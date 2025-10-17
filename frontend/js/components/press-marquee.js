export default class PressMarquee extends HTMLElement {
  constructor() {
    super();

    this.still = this.querySelector('.still');
    this.marquee = this.querySelector('.marquee');

    this.width = this.still.offsetWidth;

    this.handleMarquee(this.width);
    window.addEventListener('resize', this.handleMarquee.bind(this));
  }

  handleMarquee() {
    if (this.width >= window.innerWidth) {
      this.still.classList.add('hidden');
      this.marquee.classList.remove('hidden');
    } else {
      this.still.classList.remove('hidden');
      this.marquee.classList.add('hidden');
    }
  }
}

customElements.define('press-marquee', PressMarquee);