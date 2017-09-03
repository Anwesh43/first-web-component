const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class CornerDotColorComponent extends HTMLElement {
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
//This the logic to create that four circles
class CornerDotColor {
    constructor() {
        this.x = size/2
        this.y = size/2
        this.r = size/10
    }
    drawStrokeCircle(context) {
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
    }
    drawFillCircle(context) {
        context.save()
        context.scale(0,0)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    drawArc(context) {
        context.beginPath()
        context.moveTo(0,0)
        for(var deg=0;deg<=360;deg+=5) {
            const x = this.r*Math.cos(deg*Math.PI/180),y = this.r*Math.sin(deg*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.lineWidth = size/40
        context.strokeStyle = 'blue'
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

    }
    stopUpdating() {

    }
    startUpdating() {

    }
}
// This about the webcomponent
