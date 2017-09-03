const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class RedToGreenBoxComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
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
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
class RedToGreenBox {
    constructor() {
        this.x = w/2
        this.y = h/2
        this.r = size/5
    }
    drawPie(context,scale) {
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<Math.floor(360);i++) {
            const x = this.r*Math.cos(i*Math.PI/180), y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.fillStyle = 'red'
        this.drawPie(context,1)
        context.fillStyle = 'green'
        this.drawPie(context,0)

        for(var i = 0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.strokeStyle = 'red'
            context.beginPath()
            context.moveTo(-2*w/5,-2*h/5)
            context.lineTo(2*w/5,-2*h/5)
            context.stroke()
            context.strokeStyle = 'blue'
            context.beginPath()
            context.moveTo(-2*w/5,-2*h/5)
            context.lineTo(2*w/5,-2*h/5)
            context.stroke()
            for(var j=0;j<2;j++) {
                const x1 = (4*w/5)*j,gap = (2*w/5)*(1-2*j)
                context.beginPath()
                context.moveTo(x1,-2*h/5)
                context.lineTo(x1+gap,-2*h/5)
                context.stroke()
            }
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
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = 1 - 2*this.scale
    }
    stopped() {
        return dir == 0
    }
}
