import Swiper from 'swiper/bundle';

export default class InteractiveHero extends HTMLElement {
  constructor() {
    super();

    this.buttons = this.querySelectorAll('.interactive-hero__button');
    this.buttons.forEach(button => {
      button.addEventListener('click', this.onButtonClick.bind(this));
    });

    this.slider = this.querySelector('.interactive-hero__slider');
    if (this.slider) this.initSlider();
  }

  onButtonClick() {
    const parent = event.target.closest('.interactive-hero__item');
    if (!parent) return;

    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
    } else {
      const activeItem = this.querySelector('.interactive-hero__item.active');
      if (activeItem) activeItem.classList.remove('active');

      parent.classList.add('active');
    }
  }

  initSlider() {
    const interactiveHeroSlider = new Swiper(this.slider, {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 20,
      watchOverflow:  true,
      allowTouchMove: true,
      navigation: {
        prevEl: this.querySelector('.swiper-button-prev'),
        nextEl: this.querySelector('.swiper-button-next'),
      }
    });
  }
}

window.customElements.define('interactive-hero', InteractiveHero);