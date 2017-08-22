const w = window.innerWidth,h = window.innerHeight
class PieColorBoxComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('div')
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    startUpdating() {
        this.pieColorBox.startUpdating()
    }
    update() {
        this.pieColorBox.update()
    }
    stopped() {
        return this.pieColorBox.stopped()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/5
        canvas.height = w/5
        const context = canvas.getContext('2d')
        if(!this.pieColorBox) {
            this.pieColorBox = new PieColorBox(canvas.width,canvas.height)
        }
        this.pieColorBox.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class PieColorBox {
    constructor(w,h) {
        this.w = w
        this.h = h
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        context.save()
        context.translate(this.w/2,this.h/2)
        context.save()
        context.scale(this.scale,1)
        context.fillStyle = '#1565C0'
        context.fillRect(-this.w/2,-this.h/2,this.w,this.h)
        context.restore()
        context.strokeStyle = '#d32f2f'
        context.fillStyle = '#d32f2f'
        context.strokeWidth = Math.min(this.w,this.h)/40
        const r = Math.min(this.w,this.h)/5
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        const finalDeg = Math.floor(360*this.scale)
        context.moveTo(0,0)
        for(var i=0;i<Math.floor(360*this.scale);i++) {
            const x = r*Math.cos(i*Math.PI/180), y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
    update() {
        this.scale += this.dir*0.2
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startAnimating() {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.scale
        }
    }
    handleTap(x,y) {
        const r = Math.min(this.w,this.h)/5
        return x>=this.w/2-r && x<=this.w/2+r && y>=this.h/2 - r && y<=this.h/2 +r && this.dir == 0
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    start() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
