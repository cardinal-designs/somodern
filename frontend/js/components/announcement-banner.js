import Swiper from 'swiper/bundle';

export default class AnnouncementBanner extends HTMLElement {
  constructor() {
    super();

    this.slider = this.querySelector('.announcement-banner-slider');
    if (this.slider) this.initSlider();
  }

  initSlider() {
    const announcementBanner = new Swiper(this.slider, {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 10,
      watchOverflow:  true,
      allowTouchMove: true,
      autoplay: {
        delay: 3000,
      },
    });
  }
}

window.customElements.define('announcement-banner', AnnouncementBanner);