export default class CountrySelector extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('form');
    this.countries = this.querySelectorAll('.currency-selector-option');
    this.dropdown = this.querySelector('dropdown-item');
    this.current = this.querySelector('.currency-selector-current');
    this.input = this.querySelector('#CurrencySelector');

    this.countries.forEach(country => {
      country.addEventListener('click', this.onCountryClick.bind(this));
    });
  }

  onCountryClick(event) {
    event.preventDefault();
    const country = event.currentTarget.dataset.value;
    const replacementText = event.currentTarget.dataset.replacement;

    this.input.value = country;
    this.current.innerHTML = replacementText;

    this.dropdown.close();
    this.submitForm();
  }
  
  submitForm() {
    if (this.form) this.form.submit();
  }
}

customElements.define('country-selector', CountrySelector);