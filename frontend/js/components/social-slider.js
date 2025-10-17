import Swiper from 'swiper/bundle';

export default class SocialSlider extends HTMLElement {
  constructor() {
    super();

    this.slider = this.querySelector('.social-slider');
    this.columns = Number(this.dataset.columns);

    this.playButtons = this.querySelectorAll('[data-play]');
    this.playButtons.forEach(button => {
      button.addEventListener('click', this.handlePlay.bind(this));
    });

    this.videos = this.querySelectorAll('video');
    this.videos.forEach(video => {
      video.addEventListener('click', this.handlePause.bind(this));
    });

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
        },
        1024: {
          slidesPerView: 2.3,
          spaceBetween: 20,
        }
      }
    }

    if (this.columns == 4) {
      settings.breakpoints[1024].slidesPerView = 4.6;
      settings.breakpoints[768].slidesPerView = 3.6;
    } else if (this.columns == 3) {
      settings.breakpoints[1024].slidesPerView = 3.6;
      settings.breakpoints[768].slidesPerView = 3.6;
    }

    const socialSlider = new Swiper(this.slider, settings);
  }

  handlePlay(event) {
    const slide = event.target.closest('.swiper-slide');

    this.playButtons.forEach(button => {
      button.classList.remove('hidden');
    });

    this.videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    slide.querySelector('[data-play]').classList.add('hidden');
    slide.querySelector('video').play();
  }

  handlePause(event) {
    const slide = event.target.closest('.swiper-slide');

    slide.querySelector('[data-play]').classList.remove('hidden');
    event.currentTarget.pause();
  }
}

window.customElements.define('social-slider', SocialSlider);