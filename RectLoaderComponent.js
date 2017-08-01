const w = window.innerWidth,h = window.innerHeight
class RectLoaderComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.color = this.getAttribute('color') || '#e53935'
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render(0)
        this.animHandler = new AnimHandler(this)
        this.img.onmousedown = (event) => {
            this.animHandler.startAnimation()
        }
    }
    render(scale) {
        const canvas = document.createElement('canvas')
        const imw = canvas.width,imh = canvas.height
        canvas.height = imw
        canvas.width = imh
        const context = canvas.getContext('2d')
        if(!this.rectLoader) {
            this.rectLoader = new RectLoader()
        }
        this.rectLoader.draw(w,h,this.color,scale)
        this.img.src = canvas.toDataURL()
    }
}
class RectLoader {
    draw(w,h,color,scale) {
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = w/50
        context.lineCap = 'round'
        context.fillRect(0,0,w*scale,h)
        context.strokeRect(0,0,w,h)
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += 4.5
    }
    stopped() {
        const condition = this.deg > 180
        if(condition) {
            this.deg = 0
        }
        return condition
    }
}
class AnimHandler {
    constructor(component) {
        this.component = component
        this.stateContainer = new StateContainer()
        this.animated = false
    }
    startAnimation() {
        if(this.animated == false) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render(this.stateContainer.scale)
                this.stateContainer.update()
                if(this.stateContainer.stopped() == true) {
                    clearInterval(interval)
                    this.animated = false
                }
            },75)
        }
    }
}
customElements.define('rect-loader-comp',RectLoaderComponent)
