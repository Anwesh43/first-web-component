const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/4
class LineToTriRotComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.lineToTriRot = new LineToTriRot()
        this.animator = new Animator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        context.strokeStyle = '#e74c3c'
        context.lineWidth = Math.min(w, h)/50
        context.lineCap = 'round'
        this.lineToTriRot.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.lineToTriRot.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lineToTriRot.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class State {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class LineToTriRot {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(w/2 - size/2, h/2)
        this.drawLine(context, 0, 0, 1)
        for(var i = 0; i < 2; i++) {
            this.drawLine(context, i, 300 * this.state.scale, this.state.scale)
        }
        context.restore()
    }
    drawLine(context, i, deg, scale) {
        context.save()
        context.translate(size * i, 0)
        context.rotate(deg * (1 - 2 * i) * Math.PI/180)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo((size/2 + size/2 * scale) * (1 - 2 * i), 0)
        context.stroke()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('line-to-tri-rot', LineToTriRotComponent)
