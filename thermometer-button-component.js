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
class ThermometerButton {
	draw(context){
		context.beginPath()
		context.rect(0,0,size/5,size)
		context.clip()
		context.beginPath()
		context.moveTo(size/5,0.9*size)
		context.arc(size/10,0.9*size,0.1*size,0,Math.PI)
		context.lineTo(0,size/10)
		context.arc(size/10,size/10,size/10,Math.PI,2*Math.PI)
		context.lineTo(size/5,0.9*size)
		context.fill()
	}
	update() {
	}
	startUpdating() {
	}
	stopped() {
		return false
	}
}
