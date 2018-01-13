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
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(i*2-1,1)
            this.drawArc(context)
            context.restore()
        }
        context.restore()
    }
    drawArc(context) {
        context.beginPath()
        for(var i=0;i<=180;i++) {
            const x = this.r*Math.cos(i*Math.PI/180), y = this.r*Math.sin(i*Math.PI/180)
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
