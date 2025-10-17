export default class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.changeUrl = this.dataset.changeUrl;
    this.renderInfo = this.dataset.renderInfo;
    this.productBar = this.closest('product-section').querySelector('product-bar');

    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange(event) {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(this.currentVariant.available);
    this.updateVariantStatuses();
    this.updateSelectedValues();

    if (!this.currentVariant) {
      this.toggleAddButton(this.currentVariant.available);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateVariantInput();
      if (this.changeUrl == 'true') this.updateURL();
      if (this.renderInfo != 'false') this.renderProductInfo();

      if (this.productBar) this.syncProductBar(event);
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (this.getAttribute('data-section') == 'product-bar') return
    const slider = this.closest('product-section').querySelector('product-slider') || this.closest('quick-view')
    if (!slider) return
    const newVariantImage = slider.querySelector(`[data-image-variants*="${this.currentVariant.id}"]`)
    
    if (newVariantImage) {
      const slideToIndex = newVariantImage.getAttribute('data-swiper-slide-index') || newVariantImage.getAttribute('data-media-index')
      slider.changeSlide(slideToIndex)
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
      });
  }

  toggleAddButton(available) {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    
    if (button) {
      const addButton = button.querySelector('[name="add"]');
      if (available && addButton) {
        addButton.removeAttribute('disabled');
      } else {
        addButton.setAttribute('disabled', 'disabled');
      }
    }
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(':checked').value === variant.option1
    );
    const inputWrappers = [...this.querySelectorAll('.product-form-input')];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.nextElementSibling.classList.remove('opacity-50');
      } else {
        input.nextElementSibling.classList.add('opacity-50');
      }
    });
  }

  updateSelectedValues() {
    if (event.target.name == 'Color') {
      const value = event.target.value;
      event.target.closest('fieldset').querySelector('[data-selected-value]').innerHTML = value;
    }
  }

  syncProductBar(event) {
    const selected = event.target.value;
    const productBarButton = this.productBar.querySelector('[data-add-to-cart]');

    this.productBar.querySelector(`input[value="${selected}"]`).click();

    if (this.currentVariant.available) {
      productBarButton.removeAttribute('disabled');
    } else {
      productBarButton.setAttribute('disabled', 'disabled');
    }
  }
}

customElements.define('variant-selects', VariantSelects);

var VariantRadios = class extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }
}

customElements.define('variant-radios', VariantRadios);