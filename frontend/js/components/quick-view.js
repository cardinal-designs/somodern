import Swiper from 'swiper/bundle';

export default class QuickView extends HTMLElement {
  constructor() {
    super();

    this.buttons = document.querySelectorAll('[data-quick-view]');
    this.quickViewContent = this.querySelector('[data-quickview-content]');

    this.slider,
    this.thumbs;

    // Handle quick view click
    document.body.addEventListener('click', event => {
      const button = event.target.closest('[data-quick-view]');
      
      if (button) {
        event.preventDefault();
        button.classList.add('loading');
        this.handleQuickView(button);
      }
    });
  }

  open() {
    MicroModal.show('quickview', {
      onShow: () => {document.body.classList.add('overflow-hidden')},
      onClose: () => {document.body.classList.remove('overflow-hidden')}
    });
    // document.body.classList.add('overflow-hidden')
  }

  close() {
    MicroModal.close('quickview');
    document.body.classList.remove('overflow-hidden');
  }

  handleQuickView(button) {
    // Remove any parameters from url
    const href = button.dataset.href;
    let url = href.includes('?') ? href.substring(0, href.indexOf('?')) : href;
    url = url + '?view=quickview'

    this.swapOutView(url, button);
  }

  swapOutView(url, opener) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
        this.productElement = responseHTML.querySelector('.product-quickview');
        this.quickViewContent.innerHTML = this.productElement.innerHTML;
      
        this.initSliders();

        setTimeout(() => {
          this.open();
          if (opener) opener.classList.remove('loading');
        }, 150);


        // this.preventVariantURLSwitching();
      })
      .finally(() => {
        const submitButton = this.querySelector('.product-form-submit');
        if (submitButton) {
          submitButton.addEventListener('click', event => {
            if (!event.target.disabled) {
              this.close();
            }
          });
        }
      });
  }

  initSliders() {
    this.thumbs = new Swiper(this.querySelector('.product-thumbs'), {
      slidesPerView: 'auto',
      spaceBetween: 10,
      direction: 'vertical',
      freeMode: true,
      watchSlidesProgress: true,
      grabCursor: true
    });
    
    this.slider = new Swiper(this.querySelector('.product-slider'), {
      slidesPerView: 1,
      spaceBetween: 8,
      loop: false,
      initialSlide: this.querySelector('[data-initial-slide="true"]') ? this.querySelector('[data-initial-slide="true"]').getAttribute("data-media-index") : 0,
      pagination: {
        el: this.querySelector('.swiper-pagination'),
        clickable: true
      },
      thumbs: {
        swiper: this.thumbs
      }
    });
  }

  changeSlide(i) {
    this.slider.slideToLoop(i)
  }
}

customElements.define('quick-view', QuickView);