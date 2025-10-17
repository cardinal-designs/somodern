export default class ImageZoom extends HTMLElement {
	constructor() {
		super()

		this.image = this.querySelector("img")
		this.lens = this.querySelector('[data-zoom-area]')
		this.zoomWindow = this.querySelector('[data-zoom-window]')
		this.handleMouseEvent = this.handleMouseMove.bind(this)

		this.mediaQuery = window.matchMedia("(min-width: 768px)")

		this.onLoadOrResize()

		window.addEventListener('resize', this.onLoadOrResize.bind(this));

		// this.addEventListener('mousemove', this.handleMouseMove.bind(this))

		this.cx = this.zoomWindow.offsetWidth / this.lens.offsetWidth
		this.cy = this.zoomWindow.offsetHeight / this.lens.offsetHeight

		this.zoomWindow.style.backgroundSize = (this.image.width * this.cx) + "px " + (this.image.height * this.cy) + "px";
	}

	onLoadOrResize() {
		if (this.mediaQuery.matches) {
			this.addEventListener('mousemove', this.handleMouseEvent)
		} else {
			this.removeEventListener('mousemove', this.handleMouseEvent)
		}
	}

	handleMouseMove(event) {
		let pos, x, y;

		pos = this.getCursorPosition(event)

		x = pos.x - (this.lens.offsetWidth / 2)
		y = pos.y - (this.lens.offsetHeight / 2)

		if ( x > this.image.width - this.lens.offsetWidth) { x = this.image.width - this.lens.offsetWidth}
		if (x < 0) {x = 0;}
		if (y > this.image.height - this.lens.offsetHeight) {y = this.image.height - this.lens.offsetHeight;}
		if (y < 0) {y = 0;}

			/* Set the position of the zoom window */
		this.lens.style.left = x + "px";
		this.lens.style.top = y + "px";
		
		/* Display what the zoom window "sees": */
		this.zoomWindow.style.backgroundPosition = "-" + (x * this.cx) + "px -" + (y * this.cy) + "px";
	}

	getCursorPosition(event) {
		let a, x=0, y=0;

		event = event || window.event;

		a = this.image.getBoundingClientRect()

		x = event.pageX - a.left
		y = event.pageY - a.top

		x = x - window.scrollX
		y = y - window.scrollY

		return {x: x, y: y}
	}
}

customElements.define('image-zoom', ImageZoom);