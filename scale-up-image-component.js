class ScaleUpImageComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render(scale) {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.onload = () => {
            this.render(0)
        }
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return dir == 0
    }
    update() {
        this.scale += 0.2*dir
        if(this.scale > 1 || this.scale < 0) {
            this.dir = 0
            if(this.scale > 1) {
                this.scale = 1
            }
            else {
                this.scale = 0
            }
        }
    }
}
class AnimationHandler {
    constructor(component) {
        this.animated = false
        this.component = component
        this.stateContainer = new StateContainer()
    }
    startAnimation() {
        if(this.animated == false) {
            this.stateContainer.startUpdating()
            const interval = setInterval(()=>{
                this.component.render(this.stateContainer.scale)
                this.stateContainer.update()
                if(this.stateContainer.stopped() == true) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
