export default class MobileMenu extends HTMLElement {
  constructor() {
    super();

    this.drawer = document.getElementById('mobile-menu');
    this.header = document.getElementById('.header');

    this.trigger = document.querySelector('.mobile-menu-trigger');

    this.dropdownButtons = this.querySelectorAll('.dropdown-button');
    
    this.drawer.addEventListener('keydown', (evt) => evt.code === 'Escape' && this.close());
    this.bindEvents();
  }

  bindEvents() {
    this.trigger.addEventListener('click', event => {
      this.trigger.classList.contains('open') ? this.close() : this.open();
    });

    this.dropdownButtons.forEach(dropdownBtn => dropdownBtn.addEventListener('click', this.handleButtonClick.bind(this)));
  }

  open() {
    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    this.trigger.classList.add('open');
    document.documentElement.classList.add('scrolled');

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.removeAttribute('aria-expanded', true);

    this.trigger.classList.remove('open');
    if (window.scrollY < 6) document.documentElement.classList.remove('scrolled');

    document.body.classList.remove('overflow-hidden');
  }

  handleButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const dropdown = button.nextElementSibling;
    const back = dropdown.querySelector('.dropdown-back');

    if (dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
    } else {
      dropdown.classList.add('active');
      back.addEventListener('click', event => {
        dropdown.classList.remove('active');
      });
    }
  }
}

customElements.define('mobile-menu', MobileMenu);