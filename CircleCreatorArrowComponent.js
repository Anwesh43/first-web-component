const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class CircleCreatorArrowComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.arrow = CircleCreatorArrow()
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
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
        const deg = -90+360*this.state.scale
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.rotate(deg*Math.PI/180)
        this.drawTriangle(context)
        context.restore()
        context.beginPath()
        for(var i=0;i<deg;i+=20) {
            this.drawPointInCircle(context,i)
        }
        context.stroke()
        context.restore()
    }
    drawPointInCircle(context,deg) {
        const x = (size/3)*Math.cos(deg*Math.PI/180),y = (size/3)*Math.sin(deg*Math.PI/180)
        if(deg == 0) {
            context.moveTo(x,y)
        }
        else {
            context.lineTo(x,y)
        }
    }
    drawTriangle(context) {
        context.save()
        context.translate(0,-size/3)
        context.scale(this.state.currDir,1)
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
        this.currDir = 1
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
            this.currDir = -1
        }
        if(this.scale < 0) {
            this.currDir = 1
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = -this.currDir
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
            const interval = setInterval(()=>{
                this.component.render()
                if(this.component.arrow) {
                    this.component.arrow.startUpdating()
                }
                if(this.component.arrow) {
                    this.component.arrow.update()
                    if(this.component.arrow.stopped()) {
                        this.animated = false
                        clearInterval(interval)
                    }
                }
            },50)
        }
    }
}
