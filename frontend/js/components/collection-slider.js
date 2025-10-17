import Swiper from 'swiper/bundle';
import { fadeIn, fadeOut } from '../helpers';

export default class CollectionSlider extends HTMLElement {
  constructor() {
    super();

    this.container = this.querySelector('.collection-slider-container');
    this.tabs = this.querySelectorAll('.collection-slider-tab');
    this.tabs.forEach(tab => {
      tab.addEventListener('click', this.onTabClick.bind(this));
    });

    this.desktopColumns = Number(this.dataset.desktopColumns);
    this.mobileColumns = Number(this.dataset.mobileColumns);

    this.initSliders();
  }

  onTabClick(event) {
    const newTab = event.currentTarget;
    const id = newTab.dataset.id;

    if (!newTab.classList.contains('active')) {
      fadeOut(this.container, 300);

      setTimeout(() => {
        // Tab state
        this.querySelector('.collection-slider-tab.active').classList.remove('active');
        newTab.classList.add('active');

        // Slider wrapper state
        this.querySelector('.collection-slider-wrapper:not(.hidden)').classList.add('hidden');
        this.querySelector(`.collection-slider-wrapper[data-id="${id}"]`).classList.remove('hidden');

        // Button state
        this.querySelector('.swiper-buttons:not(.hidden)').classList.add('hidden');
        this.querySelector(`.swiper-buttons[data-id="${id}"]`).classList.remove('hidden');

        fadeIn(this.container, 300);
      }, 300);
    }
  }

  initSliders() {
    let collectionSliders = [];
    [...document.querySelectorAll('.collection-slider')].forEach((el, i) => {
      const id = el.dataset.id;
      const prevArrow = this.querySelector(`.swiper-buttons[data-id="${id}"] .swiper-button-prev`);
      const nextArrow = this.querySelector(`.swiper-buttons[data-id="${id}"] .swiper-button-next`);

      collectionSliders[i] = new Swiper(el, {
        slidesPerView: this.mobileColumns,
        loop: false,
        spaceBetween: 20,
        watchOverflow:  true,
        watchSlidesVisibility: true,
        allowTouchMove: true,
        navigation: {
          prevEl: prevArrow,
          nextEl: nextArrow,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: this.desktopColumns,
          }
        }
      });
    });
  }
}

customElements.define('collection-slider', CollectionSlider);