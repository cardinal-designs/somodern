export default class ProductBar extends HTMLElement {
  constructor() {
    super();

    this.inputs = this.querySelectorAll('input');
    this.addToCartButton = this.querySelector('[data-add-to-cart]');

    this.productFormATC = document.querySelector('product-section product-form').querySelector('.product-form-submit');

    // Sync with product form
    this.inputs.forEach(input => {
      input.addEventListener('click', this.handleInputClick.bind(this));
    });

    // On ATC
    this.addToCartButton.addEventListener('click', this.addToCart.bind(this));

     // Show on scroll
     this.onScroll();
     window.addEventListener('scroll', this.onScroll.bind(this));
  }

  handleInputClick(event) {
    event.stopPropagation();

    const selected = event.currentTarget.value;
    const dropdown = event.currentTarget.closest('dropdown-item');

    if (dropdown) {
      dropdown.querySelector('[data-selected-value]').innerHTML = selected;
      dropdown.close();
    }

    document.querySelector('product-section variant-radios').querySelector(`input[value="${selected}"]`).click();
  }

  addToCart() {
    this.addToCartButton.classList.add('loading');
    this.productFormATC.click();

    setTimeout(() => {
      this.addToCartButton.classList.remove('loading');
    }, 2000);
  }

  onScroll() {
    const buttonPos = this.productFormATC.getBoundingClientRect().top + this.productFormATC.scrollTop;

    if (buttonPos > 0) {
      this.classList.remove('active');
    } else {
      this.classList.add('active');
    }
  }
}

window.customElements.define('product-bar', ProductBar);