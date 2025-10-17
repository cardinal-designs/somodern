import { preloadImage } from '../helpers';

export default class ProductCard extends HTMLElement {
  constructor() {
    super();

    this.colorButtons = this.querySelectorAll('.color-button');
    this.image = this.querySelector('.product-card-image');
    this.quickViewButton = this.querySelector('[data-quick-view]');

    if (this.colorButtons) {
      this.colorButtons.forEach(button => {
        button.addEventListener('click', this.onColorClick.bind(this));

        const image = button.dataset.image;
        if (image) preloadImage(image);
      });
    }
  }

  onColorClick() {
    const newColor = event.currentTarget;

    this.colorButtons.forEach(button => {
      button.classList.remove('active');
    });
    newColor.classList.add('active');

    this.quickViewButton.dataset.id = newColor.dataset.id;

    if (newColor.dataset.image) this.updateImage(newColor.dataset.image);
  }

  updateImage(image) {
    const sizes = [150, 200, 240, 280, 300, 360, 400, 450, 500, 550, 600];
    const imageData = image.match(/(.*)_\d+x\.(jpg|png|webp)(\?.*)?$/);
    const [, o, s, i = ""] = imageData;
    const srcset = sizes.map((t => `${o}_${t}x.${s}${i} ${t}w`)).join(",");

    this.image.setAttribute('sizes', 'auto');
    this.image.setAttribute('src', image);
    this.image.setAttribute('srcset', srcset);
  }
}

customElements.define('product-card', ProductCard);