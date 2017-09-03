const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class CornerDotColorComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        this.cornerDotColor = new CornerDotColor()
        this.animator = new Animator(this)
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#AD1457'
        context.strokeStyle = context.fillStyle
        this.cornerDotColor.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
    update() {
        this.cornerDotColor.update()
    }
    startUpdating() {
        this.cornerDotColor.startUpdating()
    }
    stopped() {
        return this.cornerDotColor.stopped()
    }
}
//This the logic to create that four circles
class CornerDotColor {
    constructor() {
        this.x = size/2
        this.y = size/2
        this.r = size/10
        this.state = new State()
    }
    drawStrokeCircle(context) {
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
    }
    drawFillCircle(context) {
        context.save()
        context.scale(this.state.scale,this.state.scale)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    drawArc(context) {
        context.beginPath()
        context.moveTo(0,0)
        for(var deg=0;deg<=Math.floor(360*this.state.scale);deg+=5) {
            const x = this.r*Math.cos(deg*Math.PI/180),y = this.r*Math.sin(deg*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.lineWidth = size/40
        this.drawStrokeCircle(context)
        this.drawFillCircle(context)
        for(var i=0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.save()
            context.translate(-size/3,-size/3)
            this.drawStrokeCircle(context,-size/3,-size/3)
            this.drawArc(context)
            context.restore()
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
}
class State  {
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
            this.dir = 0
            this.scale = 0
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
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()){
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
// This about the webcomponent
customElements.define('corner-dot-color-comp',CornerDotColorComponent)
