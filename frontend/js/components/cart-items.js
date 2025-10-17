import Swiper from 'swiper/bundle';
import { debounce, fetchConfig, getSectionInnerHTML, getSectionsToRender } from '../helpers';

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('form');

    // Handle upsell slider
    this.upsellSlider = this.querySelector('.cart-upsells-slider');
    if (this.upsellSlider) this.initUpsellSlider();

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.form.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  updateQuantity(line, quantity, name) {
    // this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: getSectionsToRender(true).map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);

        getSectionsToRender(true).forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));

        const lineItem =  document.getElementById(`CartItem-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
        // this.disableLoading();
      }).finally(() => {
        this.initUpsellSlider();
      }).catch((error) => {
        console.log(error)
        // this.disableLoading();
      });
    }

  enableLoading(line) {

  }

  disableLoading() {

  }

  initUpsellSlider() {
    this.upsellSlider = this.querySelector('.cart-upsells-slider');
    
    let sliderSettings = {
      slidesPerView: 1.25,
      loop: false,
      spaceBetween: 20,
      watchOverflow:  true,
      allowTouchMove: true,
      pagination: {
        el: this.querySelector('.swiper-pagination'),
        clickable: true
      },
      navigation: {
        prevEl: this.querySelector('.swiper-button-prev'),
        nextEl: this.querySelector('.swiper-button-next'),
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          allowTouchMove: false,
        }
      }
    }

    const upsellSlider = new Swiper(this.upsellSlider, sliderSettings);
  }
}

customElements.define('cart-items', CartItems);
