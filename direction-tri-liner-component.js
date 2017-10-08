const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class DirectionTriLinerComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.dtl = new DirectionTriLiner()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.dtl.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class DirectionTriLiner {
    constructor(j) {
        this.j = 0
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.rotate((Math.PI/2)*this.j*this.state.scale)
        context.beginPath()
        context.moveTo(-size/15,size/15)
        context.lineTo(size/15,size/15)
        context.lineTo(0,size/15)
        context.fill()
        context.restore()
        for(var i=0;i<Math.floor(4);i++) {
            this.drawLine(i,1)
        }
        this.drawLine(this.j,this.state.scale)
        context.restore()
    }
    drawLine(index,scale) {
        context.save()
        context.rotate((Math.PI/2)*index)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo((size/3)*scale,0)
        context.stroke()
        context.restore()
    }
    stopped() {
        return this.state.stopped()
    }
    update() {
        this.state.update()
    }
    startUpdating() {
        this.state.startUpdating()
    }
}
class State {
    constructor(scale,dir) {
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
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
class DirectionTriLinerAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startUpdating() {
        if(this.animated) {
            this.component.dtl.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.dtl.update()
                if(this.component.dtl.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
