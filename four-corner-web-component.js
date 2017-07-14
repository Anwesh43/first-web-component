const w = window.innerWidth,h = window.innerHeight
class FourCornerWebComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.color = this.getAttribute('color')||'#01579B'
        this.stateHandler = new StateHandler()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/4
        canvas.height = w/4
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.stateHandler.update()
    }
    stopped() {
        return this.stateHandler.stopped()
    }
    connectedCallback() {
        this.render()
    }
}
class StateHandler {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir *0.2
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        if(this.scale <= 0) {
            this.dir = 1
        }
    }
    stopped() {
        return dir == 0
    }
}
class FourCorner {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
    }
    draw(context,color,scale) {
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = 5
        context.save()
        context.translate(this.x,this.y)
        context.save()
        context.beginPath()
        context.arc(0,0,size/10,0,2*Math.PI)
        context.stroke()
        context.save()
        context.scale(scale,scale)
        context.beginPath()
        context.arc(0,0,size/10,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
        for(var i=0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2+45)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,(this.size/2)*scale)
            context.stroke()
            context.save()
            context.translate(0,this.size/2)
            context.beginPath()
            context.arc(0,0,size/10,0,2*Math.PI)
            context.stroke()
            context.save()
            context.scale(scale,scale)
            context.beginPath()
            context.arc(0,0,size/10,0,2*Math.PI)
            context.fill()
            context.restore()
            context.restore()
            context.restore()
        }
        context.restore()
    }
}
