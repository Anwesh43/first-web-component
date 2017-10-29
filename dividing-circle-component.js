var w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const drawCircle = (context,x,y,r) => {
    context.beginPath()
    context.arc(x,y,r,0,2*Math.PI)
    context.fill()
}
class DividingCircleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
class DividingCircle {
    constructor() {

    }
    drawLine(context) {
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(size/6,0)
        context.stroke()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
            this.drawLine(context)
            context.save()
            context.translate(size/6,0)
            for(var j=0;j<2;j++) {
                context.save()
                context.rotate(Math.PI/4*(1-2*j))
                this.drawLine(context)
                drawCircle(size/6,0,size/20)
                context.restore()
            }
            context.restore()
            context.restore()
        }
        context.restore()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
