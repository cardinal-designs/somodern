import Swiper from 'swiper/bundle';

export default class ImageSlider extends HTMLElement {
  constructor() {
    super();

    this.slider = this.querySelector('.image-slider');
    this.columns = Number(this.dataset.columns);

    this.initSlider();
  }

  initSlider() {
    let settings = {
      slidesPerView: 1.25,
      loop: false,
      spaceBetween: 10,
      watchOverflow:  true,
      allowTouchMove: true,
      navigation: {
        prevEl: this.querySelector('.swiper-button-prev'),
        nextEl: this.querySelector('.swiper-button-next'),
      },
      breakpoints: {
        768: {
          slidesPerView: 2.3,
          spaceBetween: 20,
          allowTouchMove: false,
        },
        1024: {
          slidesPerView: 2.3,
          spaceBetween: 20,
          allowTouchMove: false,
        }
      }
    }

    if (this.columns == 4) {
      settings.breakpoints[1024].slidesPerView = 4.3;
      settings.breakpoints[768].slidesPerView = 3.3;
    } else if (this.columns == 3) {
      settings.breakpoints[1024].slidesPerView = 3.3;
      settings.breakpoints[768].slidesPerView = 3.3;
    }

    const imageSlider = new Swiper(this.slider, settings);
  }
}

window.customElements.define('image-slider', ImageSlider);