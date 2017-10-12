const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class CircleCreatorArrowComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.arrow = new CircleCreatorArrow()
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.strokeStyle = '#00ACC1'
        context.fillStyle = context.strokeStyle
        this.arrow.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
}
class CircleCreatorArrow {
    constructor() {
        this.state = new CircleCreatorArrowState()
    }
    draw(context) {
        const deg = 360*this.state.scale
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.rotate(deg*Math.PI/180)
        this.drawTriangle(context)
        context.restore()
        context.beginPath()
        for(var i=-90;i<=-90+deg;i+=5) {
            this.drawPointInCircle(context,i)
        }
        context.stroke()
        context.restore()
    }
    drawPointInCircle(context,deg) {
        const x = (size/3)*Math.cos(deg*Math.PI/180),y = (size/3)*Math.sin(deg*Math.PI/180)
        if(deg == -90) {
            context.moveTo(x,y)
        }
        else {
            context.lineTo(x,y)
        }
    }
    drawTriangle(context) {
        context.save()
        context.translate(0,-size/3)
        context.rotate(Math.PI*this.state.scale)
        context.beginPath()
        context.moveTo(-size/20,-size/20)
        context.lineTo(-size/20,size/20)
        context.lineTo(size/20,0)
        context.fill()
        context.restore()
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
class CircleCreatorArrowState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
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
            console.log("starting animation")
            if(this.component.arrow) {
                this.component.arrow.startUpdating()
            }
            const interval = setInterval(()=>{
                console.log("animating")
                this.component.render()
                if(this.component.arrow) {
                    this.component.arrow.update()
                    if(this.component.arrow.stopped()) {
                        this.animated = false
                        this.component.render()
                        clearInterval(interval)
                    }
                }
            },100)
        }
    }
}
customElements.define('circle-creator-arrow',CircleCreatorArrowComponent)
