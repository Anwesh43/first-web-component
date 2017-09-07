const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class ThermometerButtonComponent extends HTMLElement {
	constructor() {
		super()
		this.animator = new Animator(this)
		this.img = document.createElement('img')
		const shadow = this.attachShadow({mode:'open'})
		shadow.appendChild(this.img)
		this.thermo = new ThermometerButton()
	}
	connectedCallback() {
		this.render()
		this.img.onmousedown = (event)=>{
				this.animator.startAnimation()
		}
	}
	render() {
		const canvas = document.createElement('canvas')
		canvas.width = size
		canvas.height = size
		const context = canvas.getContext('2d')
		this.thermo.draw(context)
		this.img.src = canvas.toDataURL()
	}
	update() {
		this.thermo.update()
	}
	startUpdating() {
		this.thermo.startUpdating()
	}

	stopped() {
		return this.thermo.stopped()
	}

}
class ThermometerButton {
	constructor() {
			this.state = new ThermometerState()
	}
	draw(context){
		context.fillStyle = '#FFD600'
		context.beginPath()
		context.rect(0,size*(1-this.state.scale),size/5,size*this.state.scale)
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
		this.state.update()
	}
	startUpdating() {
		this.state.startUpdating()
	}
	stopped() {
		return this.state.stopped()
	}
}
class ThermometerState {
	constructor() {
			this.scale = 0
			this.dir = 0
	}
	update() {
		this.scale += this.dir * 0.1
		if(this.scale > 1) {
				this.dir = 0
				this.scale = 1
		}
		if(this.scale < 0) {
				this.scale =0
				this.dir = 0
		}
	}
	startUpdating(){
			this.dir = 1-2*this.scale
	}
	stopped() {
		return this.dir == 0
	}
}
class Animator {
	constructor(component){
			this.component = component
			this.animated = false
	}
	startAnimation() {
		if(!this.animated){
			this.animated = true
			this.component.startUpdating()
			const interval = setInterval(()=>{
				this.component.render()
				this.component.update()
				if(this.component.stopped()){
					this.animated = false
					clearInterval(interval)
				}
			},50)
		}
	}
}
customElements.define('thermo-meter-button-comp',ThermometerButtonComponent)
