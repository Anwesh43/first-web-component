var w = window.innerWidth,h = window.innerHeight,r = Math.min(w,h)/20
class MoveInRectComponent extends HTMLElement{
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class InRectMoverGraph {
    constructor() {

    }
    draw(context) {

    }
    update() {

    }
    stopped() {

    }
    startUpdating() {

    }
}
class InRectMoverNode {
    constructor(x,y,r) {
        this.x = x
        this.y = y
    }
    draw(context,ax,ay) {
        context.save()
        context.translate(this.x+ax,this.y+ay)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    update() {

    }
    stopped() {

    }
    startUpdating() {

    }
}
