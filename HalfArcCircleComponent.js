const w = window.innerWidth, h = window.innerHeight
class HalfArcCircleComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class HalfArcCircle {
    constructor() {
        this.x = w/2
        this.y = h/2
        this.r = Math.min(w,h)/2
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1,1-2*i)
            this.drawArc(context,this.r*(1-2*i))
            context.restore()
        }
        context.restore()
    }
    drawArc(context,px) {
        context.beginPath()
        for(var i=0;i<=180;i++) {
            const x = px+this.r*Math.cos(i*Math.PI/180), y = this.r*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.stroke()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
