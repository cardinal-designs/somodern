export default class CollectionFilters extends HTMLElement {
  constructor() {
    super();
    
    this.grid = document.querySelector('#product-grid');
    this.form = document.querySelector('.filters-form');
    this.filters = document.querySelector('#filter-dropdowns');
    this.pageOverlay = document.querySelector('.page-overlay');
    this.gridToggles = this.querySelectorAll('[data-grid-toggle]');

    this.drawer = this.querySelector('.filters-slideout');
    this.dropdownButtons = document.querySelectorAll('.dropdown-header');
    this.filterButtons = document.querySelectorAll('.filter-button');

    this.sortForm = this.querySelector('.sort-form');
    this.sortBy = this.dataset.currentSort;

    this.openFilterButtons = document.querySelectorAll('[data-open-filters]');
    this.closeFilterButtons = document.querySelectorAll('[data-close-filters]');

    this.setListeners();
  }

  setListeners() {
    // Handle Dropdown Click
    this.dropdownButtons.forEach(item => {
      item.addEventListener('click', this.handleDropdownClick);
    });

    // Handle Form Change
    this.form.addEventListener('change', event => {
      this.handleFilterClick(event.target);
    });

    // Handle Sort form 
    this.sortForm.addEventListener('change', event => {
      event.preventDefault();
      
      this.handleSortClick(event.target);
    });

    // Remove Filters
    this.addEventListener('click', event => {
      const button = event.target.closest('[data-remove-filter]');
      if (button) {
        event.preventDefault();
        if (button.classList.contains('price-range')) {
          this.clearPriceRange();
          this.reloadSections();
        } else {
          this.removeSelectedFilter(button.dataset.filter);
        }
      }
    });

    // Clear Category Filters
    this.addEventListener('click', event => {
      const button = event.target.closest('[data-clear-category-filters]');
      if (button) {
        event.preventDefault();
        this.clearCategoryFilters();
      }
    });

    // Clear All Filters
    this.addEventListener('click', event => {
      const button = event.target.closest('[data-clear-all-filters]');
      if (button) {
        event.preventDefault();
        this.clearAllFilters();
      }
    });

    // Open
    this.openFilterButtons.forEach(filter => {
      filter.addEventListener('click', event => {
        this.open();
      });
    });

    // Close
    this.closeFilterButtons.forEach(filter => {
      filter.addEventListener('click', event => {
        this.close();
      });
    });

    // Grid Toggles
    this.gridToggles.forEach(toggle => {
      toggle.addEventListener('click', event => {
        this.handleGridToggle(toggle);
      });
    });
  }

  open() {
    event.preventDefault();

    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    document.body.classList.add('overflow-hidden');
    this.pageOverlay.classList.remove('invisible', 'opacity-0');

    this.pageOverlay.addEventListener('click', event => {
      this.close();
    });
  }

  close() {
    event.preventDefault();
  
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.setAttribute('aria-expanded', false);

    document.body.classList.remove('overflow-hidden');
    this.pageOverlay.classList.add('invisible', 'opacity-0');

    this.dropdownButtons.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  handleDropdownClick(event) {
    event.preventDefault();

    if (this.classList.contains('active')) {
      this.classList.remove('active');
    } else {
      this.classList.add('active');
    }
  }

  handleFilterClick() {
    this.reloadSections();
  }

  removeSelectedFilter(filter) {
    document.querySelector(`.filter-button[data-filter="${filter}"]:checked`).checked = false;

    this.reloadSections();
  }

  handleSortClick(target) {
    const sort = target.value;
    const displayText = target.dataset.display;
    this.sortBy = sort;

    this.querySelector('.sort-by-current').innerHTML = displayText;
    target.closest('dropdown-item').close();
    
    this.reloadSections();
  }

  clearCategoryFilters() {
    event.preventDefault();
    event.stopImmediatePropagation();

    event.target.parentElement.querySelectorAll('.filter-button').forEach(item => {
      item.removeAttribute('checked');
    });

    this.reloadSections();
  }

  clearAllFilters() {
    event.preventDefault();
    event.stopImmediatePropagation();

    document.querySelectorAll('.filter-button').forEach(item => {
      item.removeAttribute('checked');
    });

    this.clearPriceRange();

    this.reloadSections();
    this.close();
  }

  clearPriceRange() {
    const priceRange = this.querySelector('.price-range');

    if (priceRange) {
      this.querySelector('.price-range__input-field--min').value =  '';
      this.querySelector('.price-range__input-field--max').value =  '';
    }
  }

  handleGridToggle(toggle) {
    if (!toggle.classList.contains('active')) {
      const toggleContainer = this.querySelector('.grid-toggle-container');
      const gridContainer = this.grid.querySelector('.product-grid-container');
      const name = toggle.dataset.gridToggle;

      toggle.parentElement.querySelector('.active').classList.remove('active');
      toggle.classList.add('active');

      const desktopCols = toggleContainer.querySelector('.toggle-desktop.active').dataset.gridToggle;
      const mobileCols = toggleContainer.querySelector('.toggle-mobile.active').dataset.gridToggle;

      gridContainer.dataset.desktop = desktopCols;
      gridContainer.dataset.mobile = mobileCols;
    }
  }

  reloadSections() {
    let url = '';
    
    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData).toString();
    let sortByText = searchParams ? '&sort_by=' : 'sort_by=';
    
    url = location.pathname + '?' + searchParams + sortByText + this.sortBy;

    if (history.replaceState) {
      window.history.pushState({ path: url }, '', url);
    }

    // Fetch and replace sections
    this.enableLoading();
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        const htmlContent = new DOMParser().parseFromString(html, 'text/html');

        // Replace sections
        this.getSectionsToRender().forEach((section => {
          document.getElementById(section.id).innerHTML = htmlContent.getElementById(section.id).innerHTML;
        }));

        // Replace dropdown button text
        const dropdownButtonContents = this.querySelectorAll('.filter-dropdown');
        dropdownButtonContents.forEach(content => {
          const newContent = htmlContent.getElementById(content.id).innerHTML;
          content.innerHTML = newContent;
        });

        // Replace dropdown filters
        const dropdownContents = this.querySelectorAll('.filter-dropdown__content-container');
        dropdownContents.forEach(content => {
          const newContent = htmlContent.getElementById(content.id).innerHTML;
          content.innerHTML = newContent;
        });
      
        this.disableLoading();
      })
      .catch(() => {
        this.disableLoading();
      })
      .finally(() => {

      });
  }

  getSectionsToRender() {
    return [
      { id: 'product-grid' },
      { id: 'active-filters' },
      { id: 'active-filters-slideout' },
      { id: 'product-count' }
    ]
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading() {
    // this.grid.classList.add('loading');
  }

  disableLoading() {
    // this.grid.classList.remove('loading');
  }
}

customElements.define('collection-filters', CollectionFilters);