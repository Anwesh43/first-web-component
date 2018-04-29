const w = window.innerWidth, h = window.innerHeight, NODES = 5
class DoubleSidedLinkedWaveComponent extends HTMLElement {

    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode: 'open'})
        shadow.appendChild(this.img)
        this.doubleSidedLinkedWave = new DoubleSidedLinkedWave()
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.doubleSidedLinkedWave.draw(context)
        this.img.src = canvas.toDataURL()
    }

    connectedCallback() {
        this.render()
    }
}

class DSWLState {
    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
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

class DSLNode {
    constructor(i) {
        this.i = 0
        if (i) {
            this.i = i
        }
        this.state = new DSLState()
        this.addNeighbor()
    }
    addNeighbor() {
        if (this.i < NODES - 1) {
            const NODE = new DSLNode(this.i+1)
            this.next = NODE
            NODE.prev = this.next
            NODE.addNeighbor()
        }
    }
    draw(context) {
        const size = w / NODES
        context.strokeStyle = '#2ecc71'
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(this.i * size + size/2, h/2)
        const size1 = size/2 * this.state.scales[0], size2 = size/2 * this.state.scales[1], size3 = size/2 * this.state.scales[2]
        for (var i = 0; i < 2; i++) {
            context.save()
            context.scale(1, 1 - 2 * i)
            context.save()
            context.translate(-size/2, 0)
            context.beginPath()
            context.moveTo(size2 + size3, -size2 + size3)
            context.lineTo(size1+size2, -size1 + size2)
            context.stroke()
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

    getNext(dir, cb) {
        var curr = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class DoubleSidedLinkedWave {
    constructor() {
        this.curr = new DSLNode()
        this.dir = 1
    }

    draw(context) {
        this.curr.draw(context)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir*=-1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}

class DSLAnimator {

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
customElements.define('dsl-wave', DoubleSidedLinkedWaveComponent)
