const w = window.innerWidth, h = window.innerHeight
class MultiArrowMoverComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        this.mover = new MultiArrowMover()
        this.animator = new MAMAnimator()
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        context.strokeStyle = '#ecc371'
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        this.mover.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.mover.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.mover.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }
}

class MAMState {
    constructor() {
        this.deg = 0
        this.scale = 0
        this.dir = 0
    }

    update(stopcb) {
        this.deg += this.dir * Math.PI/30
        this.scale = Math.sin(this.deg)
        if (this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            this.dir = 0
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}

class MAMAnimator {
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

class MultiArrowMover {
    constructor() {
        this.state = new MAMState()
    }
    draw(context) {
        context.save()
        context.translate(w/10 + 0.9 * w * this.state.scale, h/2)
        for(var i = 0; i < 3; i++) {
            context.save()
            context.rotate((-Math.PI/4 + Math.PI/4 * i ) * this.state.scale)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-w/10, 0)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

customElements.define('multi-arrow', MultiArrowMoverComponent)
