const w = window.innerWidth, h = window.innerHeight, size = 0.6 * Math.min(w, h)
class MultipleCircleTwoLineComponent extends HTMLElement {
    constructor() {
        super()
        this.mctl = new MultCircTl()
        this.animator = new MCTLAnimator()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.mctl.draw(context)
        this.img.src = canvas.toDataURL()
    }

    connectedCallback() {
        this.render()
        this.handleTap()
    }

    handleTap() {
        this.img.onmousedown = () => {
            this.mctl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.mctl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class MCTLState {
    constructor() {
        this.scales = [0, 0, 0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        console.log(this.scales)
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class MCTLAnimator {
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

class MultCircTl {
    constructor() {
        this.state = new MCTLState()
    }
    draw(context) {
        const color = '#4CAF50'
        context.strokeStyle = color
        context.fillStyle = color
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, h/2)
        for(var i = 0; i < 2; i++) {
            const yUpd = (size/2) * this.state.scales[2] * (1 - 2 * i)
            context.save()
            context.translate(0, yUpd)
            context.beginPath()
            context.moveTo(-size/2 * this.state.scales[0], 0)
            context.lineTo(size/2 * this.state.scales[0], 0)
            context.stroke()
            const k = 6
            const gap = size/6, r = size/20
            context.save()
            context.translate(-size/2, 0)
            for (var j = 0; j < 6 * Math.floor(this.state.scales[0]); j++) {
                const xCircle = j * gap + gap/2
                context.save()
                context.translate(xCircle, 0)
                context.beginPath()
                context.arc(0, 0, r * this.state.scales[1], 0, 2 * Math.PI)
                context.fill()
                context.beginPath()
                context.moveTo(0, -yUpd)
                context.lineTo(0, 0)
                context.stroke()
                context.restore()
            }
            context.restore()
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
customElements.define('multiple-circ-two-line', MultipleCircleTwoLineComponent)
