const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/2
class CircleChordComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode : 'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.circleChord = new CircleChord()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.circleChord.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.circleChord.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.circleChord.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class CCState {
    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
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

class CCAnimator {
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

class CircleChord {
    constructor() {
        this.state = new CCState()
    }
    draw(context) {
        context.strokeStyle = '#e74c3c'
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(size/2, size/2)
        context.rotate(Math.PI/2 * this.state.scales[2])
        context.beginPath()
        context.arc(0, 0, (size/6) * this.state.scales[0], 0, 2 * Math.PI)
        context.stroke()
        for (var i = 0; i < 2; i++) {
            const r = (size/6) * this.state.scales[1], x = r * Math.cos(Math.PI/3), y = (1 - 2 * i) * r * Math.sin(Math.PI/3)
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(-x, y)
            context.stroke()
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

customElements.define('circle-chord', CircleChordComponent)
