const w = canvas.width,h = canvas.height,size = Math.min(w,h)/2
class CenterToCornerRectComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement(img)
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#00BCD4'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class CenterToCornerRect {
    constructor() {

    }
    draw(context) {
        for(var i=0;i<4;i++) {
            const xgap = (i%2)*size/4,ygap = Math.floor(i/2)*size/4
            context.save()
            context.translate(size/2-xgap,size/2-ygap)
            context.fillRect(-size/4,-size/4,size/2,size/2)
            context.restore()
        }
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

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
    stopped() {
        return this.dir == 0
    }
}
