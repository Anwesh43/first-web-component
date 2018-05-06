const w = window.innerWidth, h = window.innerHeight, RBLL_NODES = 5
class RotatingBallLinkedLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.rbll = new RBLL()
        this.animator = new RBLLAnimator()
    }

    connectedCallback() {
        this.render()
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.rbll.draw(context)
        this.img.src = canvas.toDataURL()
    }

    handleTap() {
        this.img.onmousedown = () => {
            this.rbll.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.rbll.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class RBLLState {
    constructor() {
        this.scales = [0, 0, 0, 0, 0]
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
                this.scales[this.j] = this.prevScale
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

class RBLLAnimator {
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

class RBLLNode {
    constructor(i) {
        this.state = new RBLLState()
        this.i = 0
        if (i) {
            this.i = i
        }
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < RBLL_NODES - 1) {
            const curr = new RBLLNode(this.i + 1)
            this.next = curr
            curr.prev = this
        }
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context) {
        const size = w / RBLL_NODES
        const deg = -45 + 90 * this.state.scales[2]
        context.save()
        context.translate(size/2, h/2 + size/2)
        context.rotate(deg * Math.PI/180)
        context.save()
        context.translate(0, -size/2 * Math.sqrt(2))
        context.beginPath()
        context.arc(0, 0, size/15 * (this.state.scales[0] + 1 - this.state.scales[4]), 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, -size/2 * Math.sqrt(2) * (this.state.scales[1] + 1 - this.state.scales[3]))
        context.stroke()
        context.restore()
        context.restore()
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

class RBLL {

    constructor() {
        this.curr = new RBLLNode()
        this.dir = 1
    }

    draw(context) {

    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
