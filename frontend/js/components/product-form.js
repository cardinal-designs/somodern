import { fetchConfig, getSectionInnerHTML, getSectionsToRender, reInitUpsellSliders, serializeForm } from '../helpers';

export default class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
  }

  onSubmitHandler(event) {
    event.preventDefault();

    const submitButton = this.querySelector('[type="submit"]');
    submitButton.classList.add('loading');

    this.clearErrorMessage();
    this.errors = false;

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);

    if (this.cartDrawer) {
      formData.append(
        'sections',
        getSectionsToRender().map((section) => section.section)
      );
      formData.append('sections_url', window.location.pathname);
    }

    config.body = formData;

    fetch('/cart/add.js', config)
      .then((response) => response.json())
      .then((parsedState) => {
        if (parsedState.status) {
          this.errors = parsedState.message;
          this.handleErrorMessage(parsedState.message);
          return;
        }

        getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        let openCart = !this.errors;

        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');

        reInitUpsellSliders(openCart);
      });
  }

  handleErrorMessage(errors = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error');
    this.errorMessageText = this.errorMessageText || this.querySelector('.product-form__error-message');
    let errorText = errors.replace('Send on Send on', 'Send on').replace('Validation failed: ', '');

    if (this.errorMessageWrapper && this.errorMessageText && errorText) {
      this.errorMessageWrapper.setAttribute('aria-hidden', false);
      this.errorMessageText.innerHTML = errorText;
    }
  }

  clearErrorMessage() {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error');
    if (this.errorMessageWrapper) this.errorMessageWrapper.setAttribute('aria-hidden', true);
  }
};

customElements.define('product-form', ProductForm);