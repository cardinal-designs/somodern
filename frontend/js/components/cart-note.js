import { debounce, fetchConfig } from '../helpers';

export default class CartNote extends HTMLElement {
  constructor() {
    super();

    this.cartNote = this.querySelector('.cart-note');
    this.input = this.querySelector('textarea');
    
    // Open
    document.body.addEventListener('click', event => {
      const button = event.target.closest('[data-open-cart-note]');
      if (button) {
        event.preventDefault();
        this.open();
      }
    });

    // Close
    document.body.addEventListener('click', event => {
      const button = event.target.closest('[data-close-cart-note]');
      if (button) {
        event.preventDefault();
        this.close();
      }
    });

    // On change
    this.input.addEventListener('change', debounce((event) => {
      event.preventDefault();
      const body = JSON.stringify({ note: event.target.value });
      fetch('/cart/update.js', {...fetchConfig(), ...{ body }});
    }, 300))
  }

  open() {
    event.preventDefault();
    this.opener = event.currentTarget;

    setTimeout(() => {
      this.input.focus();
      this.input.setSelectionRange(this.input.value.length, this.input.value.length);
    }, 300);

    this.opener.classList.add('active');
    this.cartNote.classList.add('active');
  }

  close() {
    event.preventDefault();

    this.opener.classList.remove('active');
    this.cartNote.classList.remove('active');
  }
}

window.customElements.define('cart-note', CartNote);