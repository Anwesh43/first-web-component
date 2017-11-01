const w = canvas.width,h = canvas.height,size = Math.min(w,h)/2
class CenterToCornerRectComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement(img)
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.centerToCorner = new CenterToCornerRect()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#00BCD4'
        this.centerToCorner.draw(context)
        this.centerToCorner.update()
        this.img.src = canvas.toDataURL()
    }
    stopped() {
        return this.centerToCorner.stopped()
    }
    startUpdating() {
        this.centerToCorner.startUpdating()
    }
    connectedCallback() {
        this.render()
    }
}
class CenterToCornerRect {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        for(var i=0;i<4;i++) {
            const xgap = (i%2)*size/4,ygap = Math.floor(i/2)*size/4
            context.save()
            context.translate(size/2-xgap*this.state.scale,size/2-ygap*this.state.scale)
            context.fillRect(-size/4,-size/4,size/2,size/2)
            context.restore()
        }
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
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = (this.prevScale+1)%2
            this.prevScale = this.scale
            this.dir = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class Animator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            })
        }
    }
}
