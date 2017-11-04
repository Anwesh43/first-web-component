const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const drawArc = (context,x,y,r,deg) => {
    context.save()
    context.translate(x,y)
    context.beginPath()
    context.moveTo(0,0)
    for(var i=0;i<=deg;i+=2) {
        context.lineTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
    }
    context.fill()
    context.restore()
}
class CircularArcFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.circularArc = new CircularArc()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.circularArc.draw(context)
        this.circularArc.update()
        this.img.src = canvas.toDataURL()
    }
    stopped() {
        return this.circularArc.stopped()
    }
    connectedCallback() {
        this.render()
    }
}
class CircularArc {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        drawArc(context,0,0,size/10,360)
        context.restore()
    }
    update() {

    }
    stopped() {
        return true
    }
    startUpdating() {

    }
    handleTap(x,y) {
        return x>=size/2-size/10 && x<=size/2+size/10 && y>=size/2-size/10 && y<=size/2+size/10
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update() {
        this.scale += dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = (this.prevScale + 1)%2
            this.prevScale = scale
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimating() {
        if(!this.animated) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
