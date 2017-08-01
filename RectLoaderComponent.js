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
        const imw = 3*w/5,imh = h/10
        canvas.height = imh
        canvas.width = imw
        const context = canvas.getContext('2d')
        if(!this.rectLoader) {
            this.rectLoader = new RectLoader()
        }
        this.rectLoader.draw(context,imw*0.05,imh*0.05,imw*0.9,imh*0.9,this.color,scale)
        this.img.src = canvas.toDataURL()
    }
}
class RectLoader {
    draw(context,x,y,bw,bh,color,scale) {
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = 5
        context.lineCap = 'round'
        context.fillRect(x,y,bw*scale,bh)
        context.strokeRect(x,y,bw,bh)
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
                    this.component.render(0)
                    console.log("stopped")
                }
            },50)
        }
    }
}
customElements.define('rect-loader-comp',RectLoaderComponent)
