export default class QuantityDropdown extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.dropdown = this.querySelector('dropdown-item');
    this.overlay = document.querySelector('.page-overlay-popover');

    this.openButton = this.querySelector('[data-dropdown-toggle]');
    this.closeButton = this.querySelector('[data-close]');

    this.changeEvent = new Event('change', { bubbles: true });

    this.setListeners();
  }

  setListeners() {
    this.querySelectorAll('[data-number]').forEach(button => 
      button.addEventListener('click', this.onButtonClick.bind(this))
    );

    if (this.openButton) {
      this.openButton.addEventListener('click', event => {
        if (window.innerWidth < 768) {
          this.overlay.classList.remove('invisible', 'opacity-0');
          this.overlay.addEventListener('click', event => {
            this.close();
          });
        }
      });
    }

    this.closeButton.addEventListener('click', event => {
      event.preventDefault();
      this.close();
    });
  }

  onButtonClick(event) {
    event.preventDefault();
    const prevValue = this.input.value;
    const num = Number(event.currentTarget.dataset.number);

    this.querySelectorAll('[data-number]').forEach(button =>
      button.classList.remove('active')
    );
    event.currentTarget.classList.add('active');


    this.input.value = num;
    this.close();

    if (prevValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }

  close() {
    this.dropdown.close();

    if (window.innerWidth < 768) {
      this.overlay.classList.add('invisible', 'opacity-0');
    }
  }
}

customElements.define('quantity-dropdown', QuantityDropdown);