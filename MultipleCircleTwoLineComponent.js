const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/3
class MultipleCircleTwoLineComponent extends HTMLElement {
    constructor() {
        super()
    }

    render() {
        const canvas = documen.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.img.src = canvas.toDataURL()
    }

    connectedCallback() {
        this.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

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
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.size || this.j == -1) {
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
        const color = '#9C27B0'
        context.strokeStyle = color
        context.fillStyle = color
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, h/2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.translate(0, h/6 * this.state.scales[2] * (1 - 2 * i))
            context.beginPath()
            context.moveTo(-size/2 * this.state.scales[0], 0)
            context.lineTo(size/2 * this.state.scales[0], 0)
            context.stroke()
            const k = 6
            const gap = size/6, r = size/20
            for (var i = 0; i < 6; i++) {
                const xCircle = i * gap + gap/2
                context.save()
                context.translate(xCircle, 0)
                context.beginPath()
                context.arc(xCircle, 0, r * this.state.scales[1], 0, 2 * Math.PI)
                context.fill()
                context.beginPath()
                context.moveTo(0, -(h/6 * this.state.scales[2] * (1 - 2 * i)))
                context.lineTo(0, 0)
                context.stroke()
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)s
    }
}
customElements.define('multiple-circ-two-line', MultipleCircleTwoLineComponent)
