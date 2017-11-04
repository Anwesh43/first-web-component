const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const color = '#3F51B5'
const drawArc = (context,x,y,r,deg,stroke) => {
    context.save()
    context.translate(x,y)
    context.beginPath()
    if(!stroke) {
        context.moveTo(0,0)
    }
    for(var i=0;i<=deg;i+=2) {
        if(i == 0 && stroke) {
            context.moveTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
        }
        else {
            context.lineTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
        }
    }
    if(stroke) {
        context.stroke()
    }
    else {
        context.fill()
    }
    context.restore()
}
class CircularArcFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.circularArc = new CircularArc()
        this.animator = new Animator(this)
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
    startUpdating() {
        this.circularArc.startUpdating()
    }
    stopped() {
        return this.circularArc.stopped()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            if(this.circularArc.handleTap(event.clientX,event.clientY)) {
                console.log("clicked")
                this.animator.startAnimating()
            }
        }
    }
}
class CircularArc {
    constructor() {
        this.state = new State()
    }
    draw(context) {

        context.lineWidth = size/40
        context.strokeStyle = color
        context.fillStyle = color
        context.save()
        context.translate(size/2,size/2)
        drawArc(context,0,0,size/10,360,true)
        drawArc(context,0,0,size/10,360*this.state.scale)
        for(var i=0;i<6;i++) {
            context.save()
            context.rotate(i*Math.PI/3)
            drawArc(context,size/3,0,size/10,360,true)
            drawArc(context,size/3,0,size/10,360*this.state.scale)
            drawArc(context,0,0,size/3,60*this.state.scale,true)
            context.restore()
        }
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    startUpdating() {
        this.state.startUpdating()
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
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = (this.prevScale + 1)%2
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
        this.animated = false
        this.component = component
    }
    startAnimating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
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
customElements.define('circular-arc-fill',CircularArcFillComponent)
