import Swiper from 'swiper/bundle';

export default class ProductSlider extends HTMLElement {
  constructor() {
    super();

    this.desktopStyle = this.dataset.desktopStyle;
    this.mobileStyle = this.dataset.mobileStyle;
    
    this.swiperEl = this.querySelector('.product-slider');
    this.paginationEl = this.querySelector('.swiper-pagination');

    if (this.desktopStyle == 'thumbnails') {
      this.thumbsEl = this.querySelector('.product-thumbs');
      this.thumbsInstance = {}
      
      this.initThumbnails();
    }

    this.swiperInstance = {};
    this.settings = this.getSliderSettings();
    this.initSlider();
  }

  initSlider() {
    window.addEventListener('load', this.onLoadOrResize.bind(this));
    window.addEventListener('resize', this.onLoadOrResize.bind(this));
  }

  getSliderSettings() {
    let settings = {
      slidesPerView: 1.3,
      spaceBetween: 8,
      loop: false,
      centeredSlides: false,
      pagination: {
        el: this.paginationEl,
        clickable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
          centeredSlides: false,
          loop: false
        }
      }
    }

    if (this.desktopStyle == 'thumbnails') {
      settings.thumbs = {
        swiper: this.thumbsInstance
      }
      settings.breakpoints[768].loop = true;
    }

    if (this.mobileStyle == 'center') {
      settings.slidesPerView = 1;
      settings.spaceBetween = 4;
      settings.loop = true;
      settings.centeredSlides = true;
    }

    return settings;
  }

  onLoadOrResize() {
    if (this.desktopStyle == 'thumbnails') {
      // Thumbnail setting
      if (!this.swiperEl.classList.contains('swiper-initialized')) {
        this.settings.initialSlide = this.querySelector('[data-initial-slide="true"]') ? this.querySelector('[data-initial-slide="true"]').getAttribute("data-media-index") : 0
        this.swiperInstance = new Swiper(this.swiperEl, this.settings);
      }
    } else {
      // Grid setting (no slider on desktop)
      if (window.innerWidth > 767) {
        if (this.swiperEl.classList.contains('swiper-initialized')) {
          this.swiperInstance.destroy({
            deleteInstance: true,
            cleanStyles: true
          });
        }
      } else {
        if (!this.swiperEl.classList.contains('swiper-initialized')) {
          this.swiperInstance = new Swiper(this.swiperEl, this.settings);
        }
      }
    }
  }

  changeSlide(i) {
    if(this.swiperEl.classList.contains('swiper-initialized')) this.swiperInstance.slideToLoop(i)
  }

  initThumbnails() {
    this.thumbsInstance = new Swiper(this.thumbsEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      direction: 'vertical',
      freeMode: true,
      watchSlidesProgress: true,
      grabCursor: true,
      mousewheel: {
        enabled: true,
        forceToAxis: true,
      },
    });
  }
}

window.customElements.define('product-slider', ProductSlider);