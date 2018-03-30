const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 3
class LeftRightBallComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class LRBState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
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
class LRBAnimator {
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
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class LeftRightBall {
    constructor() {
        this.state = new LRBState()
    }
    draw(context) {
        const r = size / 3
        context.lineWidth = size/30
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.save()
        context.translate(r + (w - 2 * r) * this.state.scale, size/2)
        context.fillStyle = '#283593'
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.save()
        context.rotate(Math.PI * this.state.scale)
        for (var i = 0; i < 2; i++) {
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-size/10, -size/10 * (1 - 2 * i))
            context.stroke()
        }
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('left-right-ball', LeftRightBallComponent)
