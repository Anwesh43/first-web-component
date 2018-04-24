const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h), NUM_LINES = 4

class CrossLinkedLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.cll = new CrossLinkedLine()
        this.animator = new CLLAnimator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.cll.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.cll.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.cll.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class CLLState {
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

class CLLAnimator {
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

class CLLNode {
    constructor(i) {
        this.state = new CLLState()
        this.i = 0
        if (i) {
            this.i = i
        }
    }

    addNeighbor() {
        if (this.i < NUM_LINES - 1) {
            const NODE = new CLLNode(this.i+1)
            this.next = NODE
            NODE.prev = this
            NODE.addNeighbor()
        }
    }

    draw(context) {
        const gap = (size/2)/NUM_LINES
        context.lineCap = 'round'
        context.lineWidth = size/50
        context.strokeStyle = '#e74c3c'
        context.beginPath()
        context.moveTo(this.i * gap + gap * this.state.scales[1], 0)
        context.lineTo(this.i * gap + gap * this.state.scales[0], 0)
        context.stroke()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    move(dir, cb) {
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

class CrossLinkedLine {

    constructor() {
        this.init()
        this.dir = 1
    }

    init() {
        this.nodes = []
        for (var i = 0; i < 4; i++) {
            const root = new CLLNode()
            root.addNeighbor()
            this.nodes.push(root)
        }
    }

    draw(context) {
        context.save()
        context.translate(size/2, size/2)
        for (var i = 0; i < 4; i++) {
            context.save()
            context.rotate(Math.PI/2 * i)
            this.nodes[i].draw(context)
            context.restore()
        }
        context.restore()
    }

    update(stopcb) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].update(() => {
                this.nodes[i] = this.nodes[i].move(this.dir, () => {
                    if (i == this.nodes.length - 1) {
                        this.dir *= -1
                    }
                })
                if (i == this.nodes.length - 1) {
                    stopcb()
                }
            })
        }
    }

    startUpdating(startcb) {
        this.nodes.forEach((node, index) => {
            node.startUpdating(() => {
                if (index == this.nodes.length - 1) {
                    startcb()
                }
            })
        })
    }
}

customElements.define('cross-linked-line', CrossLinkedLineComponent)
