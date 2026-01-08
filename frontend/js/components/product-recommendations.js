import Swiper from 'swiper/bundle';

export default class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          const productSlider = new Swiper('.recommendation-slider', {
            slidesPerView: 1.5,
            loop: true,
            spaceBetween: 20,
            watchOverflow:  true,
            watchSlidesVisibility: true,
            allowTouchMove: true,
            navigation: {
              nextEl: '.recommendation-slider-button',
            },
            breakpoints: {
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              }
            }
          });
          _swat.initializeActionButtons("body");
        })
        .catch(e => {
          console.error(e);
        });
    }

    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 200px 0px'}).observe(this);
  }
}

customElements.define('product-recommendations', ProductRecommendations);