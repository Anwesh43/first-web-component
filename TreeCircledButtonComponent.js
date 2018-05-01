const w = window.innerWidth, h = window.innerHeight,r = Math.min(w, h)/20, size = Math.min(w, h)/7, n = 2

class TreeCircledButtonComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }

    render() {
        const canvas = document.createElement('canvas')
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
}

class TCBState {
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
                this.prevScale = 1 - 2 * this.scales[this.j]
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

class TCBAnimator {
    constructor() {
        this.animated = false
    }

    start(updatecb) {
        if (!this.aniamted) {
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

class TCBNode {
    constructor(i) {
        this.state = new TCBState()
        this.neighbors = []
        this.i = i
        this.addNeighbors()
    }

    addNeighbors() {
        if (this.i < n - 1) {

            for (var i = 0; i < 6; i++) {
                this.neighbors.push(new TCBNode(this.i + 1))
            }
        }
    }

    drawCircle(context, scale) {
        context.beginPath()
        context.arc(0, 0, r * scale, 0, 2 * Math.PI)
        context.fill()
    }

    draw(context) {
        this.drawCircle(context, 1 - this.state.scales[0])
        this.neighbors.forEach((neighbor, index) => {
            const deg = (2 * Math.PI)/this.neighbors.length
            context.beginPath()
            context.moveTo(size * this.state.scales[1], 0)
            context.lineTo(size * this.state.scales[0], 0)
            context.stroke()
            context.save()
            context.rotate(deg)
            neighbor.drawCircle()
            context.restore()
        })
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

customElements.define('tree-circle-button', TreeCircledButtonComponent)
