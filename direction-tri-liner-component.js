const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class DirectionTriLinerComponent extends HTMLElement {
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
}
class DirectionTriLiner {
    constructor(j) {
        this.j = 0
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.rotate((Math.PI/2)*this.j)
        context.beginPath()
        context.moveTo(-size/15,size/15)
        context.lineTo(size/15,size/15)
        context.lineTo(0,size/15)
        context.fill()
        context.restore()
        for(var i=0;i<Math.floor(4);i++) {
            this.drawLine(i)
        }
        this.drawLine(this.j)
        context.restore()
    }
    drawLine(index) {
      context.save()
      context.rotate((Math.PI/2)*index)
      context.beginPath()
      context.moveTo(0,0)
      context.lineTo(size/3,0)
      context.stroke()
      context.restore()
    }
    stopped() {

    }
    update() {

    }
    startUpdating() {

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
