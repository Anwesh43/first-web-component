const w = window.innerWidth,h = window.innerHeight
class RectLoaderComponent extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.height = h/10
        canvas.width = 3*w/5
        const context = canvas.getContext('2d')
        document.body.appendChild(canvas)
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
