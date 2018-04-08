const w = window.innerHeight, h = window.innerHeight , size = Math.min(w, h) * 0.8
class FullTComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.fullT = new FullT()
        this.animator = new Animator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.fullT.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.fullT.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.fullT.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class State {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        console.log(this.scales[this.j])
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

class Animator {
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

class FullT {
    constructor() {
        this.state = new State()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    draw(context) {
        const tSize = size/5
        const l = (tSize/2) * this.state.scales[0]
        context.strokeStyle = 'teal'
        context.lineWidth = size/20
        context.lineCap = 'round'
        context.save()
        context.translate(size/2, size/2)
        context.rotate(Math.PI * this.state.scales[2])
        context.beginPath()
        context.moveTo(0, -l)
        context.lineTo(0, l)
        context.stroke()
        for (var i = 0; i < 2 * Math.floor(this.state.scales[0]); i++) {
            context.save()
            context.translate(0, tSize/2)
            context.rotate(Math.PI/2 * (1 - 2 * i) * this.state.scales[1])
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0, -tSize/2)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
}

customElements.define('fullt-comp', FullTComponent)
