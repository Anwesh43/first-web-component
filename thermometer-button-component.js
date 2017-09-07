const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class ThermometerButtonComponent extends HTMLElement {
	constructor() {
		super()
		this.img = document.createElement('img')
		const shadow = this.attachShadow({mode:'open'})
		shadow.appendChild(this.img)
	}
	connectedCallback() {
		this.render()
	}
	render() {
		const canvas = document.createElement('canvas')
		canvas.width = size
		canvas.height = size 
		const context = canvas.getContext('2d')
		this.img.src = canvas.toDataURL()
	}
}

