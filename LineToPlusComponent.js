const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)
class LineToPlusComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.lineToPlus = new LineToPlus()
        this.animator = new LineToPlusAnimator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.lineToPlus.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.lineToPlus.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lineToPlus.update(() => {
                        this.animator.stop()
                    })
               })
            })
        }
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
        console.log(this.scales)
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
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
        context.strokeStyle = '#673AB7'
        context.lineWidth = 8
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.rotate(Math.PI/2 * this.state.scales[2] * (i))
            for (var j = 0; j < 2; j++) {
                  context.save()
                  context.translate(0, (0.4 * size) * (1 - 2 * i) * (1 - this.state.scales[1]))
                  context.beginPath()
                  context.moveTo( - (size/3) * Math.floor(this.state.scales[1]) * (1 - 2 * i), 0)
                  context.lineTo((size/3) * this.state.scales[0] * (1 - 2 * i), 0)
                  context.stroke()
                  context.restore()
            }
            context.restore()
        }
        context.strokeStyle = '#283593'
        context.save()
        context.translate(-0.45 * w, 0.45 * h)
        var sf = 0
        const n = this.state.scales.length
        for (var i = 0; i < this.state.scales.length; i++) {
            sf += this.state.scales[i]
        }
        if (n > 0) {
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo( ((0.9 * w)/n) * sf, 0)
            context.stroke()
        }

        context.restore()
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
