import 'vite/modulepreload-polyfill';

import MicroModal from 'micromodal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { handleTab } from '../js/helpers';
import { initLoadingAnimations } from '../js/animations';

// Add components
const components = import.meta.glob('../js/components/*.js',{ eager: true });

// Initialize animations
gsap.registerPlugin(ScrollTrigger);

// Initialize Micromodal
MicroModal.init({
  onClose: () => console.log("CLOSING"),
  openClass: 'is-open',
  disableScroll: true,
  disableFocus: true,
  awaitOpenAnimation: true,
  awaitCloseAnimation: true
});

// a11y tab handler
handleTab();

// Initialize animations
if (document.documentElement.classList.contains('enable-animations')) initLoadingAnimations();