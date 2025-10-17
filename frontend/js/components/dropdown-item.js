export default class DropdownItem extends HTMLElement {
  constructor() {
    super();

    this.parent = this.querySelector('[data-dropdown]');
    this.toggle = this.querySelector('[data-dropdown-toggle');
    this.content = this.querySelector('[data-dropdown-content]');

    this.isOpen = this.parent.classList.contains('active');
    this.isOverlay = this.dataset.isOverlay;

    this.toggle.addEventListener('click', this.onDropdownClick.bind(this));

    if (this.isOverlay == 'true') {
      document.addEventListener('click', this.handleFocusOut.bind(this));
      this.addEventListener('keyup', this.handleKeyup.bind(this));
    }
  }

  onDropdownClick() {
    event.preventDefault();
    
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;

    this.parent.classList.add('active');
    this.parent.setAttribute('aria-expanded', true);
    this.content.focus();
  }
  
  close() {
    this.isOpen = false;

    this.parent.classList.remove('active');
    this.parent.setAttribute('aria-expanded', false);
  }

  handleFocusOut(event) {
    const parent = event.target.closest('[data-dropdown]');
    if (parent == null && this.isOpen) this.close();
  }

  handleKeyup(event) {
    if (event.keyCode !== 27) return;

    this.close();
    this.toggle.focus();
  }
}

customElements.define('dropdown-item', DropdownItem);