import Swiper from 'swiper/bundle';

export default class ImageProducts extends HTMLElement {
  constructor() {
    super();

    this.slider = this.querySelector('.product-slider');
    this.columns = Number(this.dataset.columns);

    this.initSlider();
  }

  initSlider() {
    let pagination = {
      el: this.querySelector('.swiper-pagination'),
      clickable: true
    }

    if (this.dataset.pagination == 'true') {
      pagination = {
        el: this.querySelector('.swiper-pagination'),
        type: 'fraction',
        formatFractionCurrent: function (number) {
          return ('0' + number).slice(-2);
        },
        formatFractionTotal: function (number) {
          return ('0' + number).slice(-2);
        }
      }
    }

    const productSlider = new Swiper(this.slider, {
      slidesPerView: this.columns,
      loop: true,
      spaceBetween: 20,
      watchOverflow:  true,
      allowTouchMove: true,
      navigation: {
        prevEl: this.querySelector('.swiper-button-prev'),
        nextEl: this.querySelector('.swiper-button-next'),
      },
      pagination: pagination
    });
  }
}

customElements.define('image-products', ImageProducts); 