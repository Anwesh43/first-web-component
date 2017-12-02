const size = Math.min(w,h)/3
class ArcAngleLineComponent extends HTMLElement {
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
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ArcAngle {
    constructor(i) {
        this.i = i
        this.state = new ArcLineState()
    }
    draw(context,size,deg) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(deg*this.i*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=deg;i++) {
            const px = (size/2)+((size/2)*this.state.scale)*Math.cos(i*Math.PI/180), py = (size/2)*Math.sin(i*Math.PI/180)
            context.lineTo(px,py)
        }
        context.fill()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class ArcLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale = this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
