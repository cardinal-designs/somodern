export default class FaqSection extends HTMLElement {
  constructor() {
    super();

    this.links = this.querySelectorAll('.faq-link');
    this.headerGroupHeight = document.querySelector('.header-group').offsetHeight;

    // Highlight on scroll
    window.addEventListener('scroll', this.onScroll.bind(this));

    // Scroll to link
    this.links.forEach(link => {
      link.addEventListener('click', this.onLinkClick.bind(this));
    });
  }

  onScroll() {
    const fromTop = window.scrollY + 90;

    this.links.forEach(link => {
      const section = document.querySelector(`.faq-component[data-section="${link.dataset.section}"]`);

      if (section) {
        if (section.offsetTop <= fromTop && section.offsetTop + section.clientHeight > fromTop) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  onLinkClick() {
    event.preventDefault();
    const section = this.querySelector(`.faq-component[data-section="${event.currentTarget.dataset.section}"]`)

    window.scrollTo({
      top: section.offsetTop - this.headerGroupHeight,
      behavior: "smooth"
    });
  }
}

customElements.define('faq-section', FaqSection); 