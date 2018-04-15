const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/2
class LineToPlusComponent extends HTMLElement {
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
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}

class LineToPlusState {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale)) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == -1 || this.j == this.scales.length) {
                this.j -= this.dir
                this.prevScale = this.scales[this.j]
                this.dir = 0
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

class LineToPlusAnimator {
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
    stop () {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LineToPlus {
    constructor() {
        this.state = new LineToPlusState()
    }
    draw(context) {
        context.save()
        context.translate(size/2, size/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.rotate(Math.PI/2 * this.state.scales[2] * (1 - 2 * i))
            for (var j = 0; j < 2; j++) {
                  context.save()
                  context.translate(0, (0.8 * size) * (1 - 2 * i) * (1 - this.state.scales[1]))
                  context.beginPath()
                  context.moveTo(0, 0)
                  context.lineTo((size/3) * this.state.scales[0] * (1 - 2 * j), 0)
                  ccontext.stroke()
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
        this.state.startUpdating(startcb)
    }
}
customElements.define('line-to-plus', LineToPlusComponent)
