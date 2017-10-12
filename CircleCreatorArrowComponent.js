const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class CircleCreatorArrowComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class CircleCreatorArrow {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        this.drawTriangle(context)
        context.beginPath()
        for(var i=0;i<360;i+=20) {
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
        context.scale(1,1)
        context.beginPath()
        context.moveTo(-size/20,-size/20)
        context.lineTo(-size/20,size/20)
        context.lineTo(size/20,0)
        context.fill()
        context.restore()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {
        return false
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
