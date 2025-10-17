export default class PriceRange extends HTMLElement {
  connectedCallback() {
    this.rangeLowerBound = this.querySelector('.price-range__range-group input:first-child');
    this.rangeHigherBound = this.querySelector('.price-range__range-group input:last-child');
    this.textInputLowerBound = this.querySelector('.price-range__input:first-child input');
    this.textInputHigherBound = this.querySelector('.price-range__input:last-child input');
    this.textInputLowerBound.addEventListener('focus', () => this.textInputLowerBound.select());
    this.textInputHigherBound.addEventListener('focus', () => this.textInputHigherBound.select());
    this.textInputLowerBound.addEventListener('change', (event) => {
      event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(this.textInputHigherBound.value || event.target.max) - 1), event.target.min);
      this.rangeLowerBound.value = event.target.value;
      this.rangeLowerBound.parentElement.style.setProperty('--range-min', `${parseInt(this.rangeLowerBound.value) / parseInt(this.rangeLowerBound.max) * 100}%`);
    });
    this.textInputHigherBound.addEventListener('change', (event) => {
      event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(this.textInputLowerBound.value || event.target.min) + 1), event.target.max);
      this.rangeHigherBound.value = event.target.value;
      this.rangeHigherBound.parentElement.style.setProperty('--range-max', `${parseInt(this.rangeHigherBound.value) / parseInt(this.rangeHigherBound.max) * 100}%`);
    });
    this.rangeLowerBound.addEventListener('change', (event) => {
      this.textInputLowerBound.value = event.target.value;
      this.textInputLowerBound.dispatchEvent(new Event('change', { bubbles: true }));
    });
    this.rangeHigherBound.addEventListener('change', (event) => {
      this.textInputHigherBound.value = event.target.value;
      this.textInputHigherBound.dispatchEvent(new Event('change', { bubbles: true }));
    });
    this.rangeLowerBound.addEventListener('input', (event) => {
      event.target.value = Math.min(parseInt(event.target.value), parseInt(this.textInputHigherBound.value || event.target.max) - 1);
      event.target.parentElement.style.setProperty('--range-min', `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      this.textInputLowerBound.value = event.target.value;
    });
    this.rangeHigherBound.addEventListener('input', (event) => {
      event.target.value = Math.max(parseInt(event.target.value), parseInt(this.textInputLowerBound.value || event.target.min) + 1);
      event.target.parentElement.style.setProperty('--range-max', `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      this.textInputHigherBound.value = event.target.value;
    });
  }
};

window.customElements.define('price-range', PriceRange);