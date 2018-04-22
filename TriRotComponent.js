const w = window.innerWidth, h = window.innerHeight, n = 5, size = Math.min(w,h)/(2 * n)

const attachDrawLine = (context) => {
    context.drawVerticalLine = (y1, y2) => {
        context.beginPath()
        context.moveTo(0, y1)
        context.lineTo(0, y2)
        context.stroke()
    }
}

class TriWaveRotComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        attachDrawLine(context)
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        context.strokeStyle = '#2ecc71'
        context.lineWidth = size/10
        context.lineCap = 'round'
        this.img.src = canvas.toDataURL()
    }
}

class TRCState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
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

class TRCAnimator {
    constructor() {
        this.animated = false
    }

    start (updatecb) {
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

class TriRot {

    static draw(context, i, scales) {
        context.save()
        context.translate((i * 2 * size + size) * scales[0], h/2)
        context.drawVerticalLine(-size, size)
        for (j = 0; j < 2; j++) {
            context.save()
            context.translate(0, size * (1 - 2 * j))
            context.rotate(Math.PI/2 * scales[1])
            context.drawLine(0, -2 * size * (1 - 2 * j))
            context.restore()
        }
        context.restore()
    }
}

class TriRotWave {

    constructor() {
        this.state = new TRCState()
    }

    draw(context) {
        for(var i = 0; i < n; i++) {
            TriRot.draw(context, i, this.state.scales)
        }
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

customElements.define('tri-wave-rot', TriWaveRotComponent)
