import { addItemById } from '../helpers';

export default class ProductUpsell extends HTMLElement {
  constructor() {
    super();
    
    this.colorButtons = this.querySelectorAll('.color-button');
    if (this.colorButtons) {
      this.colorButtons.forEach( button => {
        button.addEventListener('click', this.onColorClick.bind(this));
      });
    }
    
    this.sizeDropdown = this.querySelector('.size-dropdown');
    if (this.sizeDropdown) {
      this.sizeDropdown.addEventListener('change', event => {
        event.stopPropagation();
        this.findVariant();
      });
    }

    this.atcButton = this.querySelector('[data-add-to-cart]');
    this.atcButton.addEventListener('click', this.handleSubmit.bind(this));
  }

  onColorClick(event) {
    event.preventDefault();

    // Change button state
    this.querySelector('.color-button.active').classList.remove('active');
    event.currentTarget.classList.add('active');

    // Update image
    const image = this.querySelector('.main-image')
    const newImage = this.querySelector(`.product-upsell-image[data-value="${event.currentTarget.dataset.value}"]`)
    if (newImage) {
      image.innerHTML = newImage.innerHTML
    }
 
    // Update available sizes
    if (this.sizeDropdown) {
      this.updateAvailability();
      this.findVariant();
    }
  }

  findVariant(size) {
    const variantData = JSON.parse(this.querySelector('[type="application/json"]').textContent);
    const color = this.querySelector('.color-button.active');
    const colorLabel = color?.dataset.value;
    const colorOptionPosition = color?.dataset.position;

    let selectedVariant = '';

    if (this.sizeDropdown) {
      const sizeLabel = this.sizeDropdown.value;
      const sizeOptionPosition = this.sizeDropdown.dataset.position;

      for (let variant of variantData) {
        const sizeOption = 'option' + sizeOptionPosition;
        const colorOption = 'option' + colorOptionPosition;

        if ((color && (variant[sizeOption] == sizeLabel && variant[colorOption] == colorLabel)) || (!color && variant[sizeOption] == sizeLabel)) {
          this.handleButtonAvailability(variant);
          selectedVariant = variant.id;
        }
      }
    } else {
      for (let variant of variantData) {
        const colorOption = 'option' + colorOptionPosition;

        if (variant[colorOption] == colorLabel) {
          this.handleButtonAvailability(variant);
          selectedVariant = variant.id;
        }
      }
    }

    return selectedVariant;
  }

  updateAvailability() {
    const variantData = JSON.parse(this.querySelector('[type="application/json"]').textContent);
    const option = 'option' + this.querySelector('.size-dropdown').dataset.position;

    const listOfAvailableOptions = variantData
      .filter((variant) => this.querySelector('.color-button.active').dataset.value === variant.option1 && variant.available)
      .map((variantOption) => variantOption[option]);

    this.querySelectorAll('.size-dropdown option').forEach(option => {
      if (listOfAvailableOptions.includes(option.value)) {
        option.removeAttribute('disabled');
      } else {
        option.setAttribute('disabled', true);
      }
    });
  }

  handleButtonAvailability(variant) {
    const isAvailable = variant.available;

    if (!isAvailable) {
      this.atcButton.setAttribute('disabled', true);
      this.atcButton.textContent = 'Sold Out';
    } else {
      this.atcButton.removeAttribute('disabled');
      this.atcButton.textContent = 'Add';
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const id = event.currentTarget.dataset.variantId || this.findVariant();
    addItemById(id);
  }
}

customElements.define('product-upsell', ProductUpsell);