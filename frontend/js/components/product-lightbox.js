import Swiper from 'swiper/bundle';

export default class ProductLightbox extends HTMLElement {
  constructor() {
    super();

    this.zoomButtons = document.querySelectorAll('[data-open-zoom]');
    this.zoomButtons.forEach(button => {
      button.addEventListener('click', this.onZoomClick.bind(this));
    });

    this.closeButton = this.querySelector('[data-close]');
    this.closeButton.addEventListener('click', this.close.bind(this));

    this.sliderInstance = {};
    
    this.initSliders();
  }

  onZoomClick(event) {
    event.preventDefault();
    const index = Number(event.currentTarget.dataset.index);

    this.sliderInstance.slideTo(index, 0);
    setTimeout(() => {
      this.classList.add('active');
    });
  }

  close() {
    this.classList.remove('active');
  }

  initSliders() {
    const thumbs = new Swiper(this.querySelector('.lightbox-thumbs'), {
      slidesPerView: 'auto',
      spaceBetween: 10,
      direction: 'vertical',
      freeMode: true,
      watchSlidesProgress: true,
      grabCursor: true
    }); 

    this.sliderInstance = new Swiper(this.querySelector('.lightbox-slider'), {
      slidesPerView: 1,
      spaceBetween: 20,
      thumbs: {
        swiper: thumbs
      },
      navigation: {
        prevEl: this.querySelector('.swiper-button-prev'),
        nextEl: this.querySelector('.swiper-button-next'),
      },
    }); 
  }
}

window.customElements.define('product-lightbox', ProductLightbox);