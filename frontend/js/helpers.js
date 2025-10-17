export function addItemById(id) {
  const cartDrawer = document.querySelector('cart-drawer');
  const body = JSON.stringify({
    items:  [{
      id: id,
      quantity: 1
    }],
    sections: getSectionsToRender().map((section) => section.section),
    sections_url: window.location.pathname
  });

  if (cartDrawer) cartDrawer.enableLoading();

  fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
    .then((response) => response.json())
    .then((parsedState) => {
      getSectionsToRender().forEach((section => {
        const elementToReplace =
          document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

        elementToReplace.innerHTML =
          getSectionInnerHTML(parsedState.sections[section.section], section.selector);

      }));
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      // dispatchCustomEvent("cart:updated", {
      //   cart: sortCart(cart)
      // });
      reInitUpsellSliders();
      if (cartDrawer) cartDrawer.disableLoading();
    });
}

export function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

export function fadeIn(target, duration = 500) {
  target.style.display = '';
  target.style.opacity = 0;
  var last = +new Date();
  var tick = function() {
    target.style.opacity = +target.style.opacity + (new Date() - last) / duration;
    last = +new Date();
    if (+target.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };
  tick();
}

export function fadeOut(target, duration = 500) {
  target.style.display = '';
  target.style.opacity = 1;
  let last = +new Date();
  let tick = function() {
    target.style.opacity = Number(+target.style.opacity - (new Date() - last) / duration).toFixed(4);
    last = +new Date();
    if (-target.style.opacity <= 0) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else{
        target.style.opacity = 0;
    }
  };
  tick();
}

export function getSectionsToRender() {
  if (isCartPage()) {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'header',
        selector: '#cart-icon-bubble'
      },
      {
        id: 'main-cart-items',
        section: 'main-cart',
        selector: '#main-cart-items'
      },
      {
        id: 'cart-item-count',
        section: 'main-cart',
        selector: '#cart-item-count'
      }
    ];
  } else {
    return [
      {
        id: 'cart-drawer__inner',
        section: 'cart-drawer',
        selector: '#cart-drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'header',
        selector: '#cart-icon-bubble'
      },
      {
        id: 'cart-count',
        section: 'cart-drawer',
        selector: '#cart-count',
      }
    ];
  }
}

export function getSectionInnerHTML(html, selector) {
  return new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector(selector).innerHTML;
}

export function handleTab() {
  let tabHandler = null;
  const formElments = ['INPUT', 'TEXTAREA', 'SELECT'];
  // Determine if the user is a mouse or keyboard user
  function handleFirstTab(e) {
    if (e.keyCode === 9 && !formElments.includes(document.activeElement.tagName)) {
      document.body.classList.add('user-is-tabbing');
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }
  function handleMouseDownOnce() {
    document.body.classList.remove('user-is-tabbing');
    window.addEventListener('keydown', handleFirstTab);
  }
  window.addEventListener('keydown', handleFirstTab);
}

export function isCartPage() {
  return window.location.href.includes('/cart');;
}

export function preloadImage(src) {
  const image = new Image();
  image.src = src;
}

export function reInitUpsellSliders(openCart = true) {
  if (isCartPage()) {
    const cartItems = document.querySelector('cart-items');
    const upsellSlider = cartItems.querySelector('.cart-upsells-slider');

    if (upsellSlider) cartItems.initUpsellSlider();
  } else {
    const cartDrawer = document.querySelector('cart-drawer');
    const upsellSlider = cartDrawer.querySelector('.cart-upsells-slider');

    if (upsellSlider) cartDrawer.initUpsellSlider();
    if (openCart) cartDrawer.open();
  }
}

export function serializeForm(form) {
  var arr = [];
  Array.prototype.slice.call(form.elements).forEach(function (field) {
    if (!field.name || field.disabled || ["file", "reset", "submit", "button"].indexOf(field.type) > -1) {
      return;
    }
    if (field.type === "select-multiple") {
      Array.prototype.slice.call(field.options).forEach(function (option) {
        if (!option.selected) return;
        arr.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(option.value));
      });
      return;
    }
    if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked) {
      return;
    }
    arr.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
  });
  return arr.join("&");
}