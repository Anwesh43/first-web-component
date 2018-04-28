const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/2
class EyeWithGlassComponent extends HTMLElement {

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
        this.img.onmousedown = () => {

        }
    }
}

class EWGState {
    constructor() {
        this.scales = [0, 0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scaes.length || this.j == -1) {
                this.j -= this.dir
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

class EWGAnimator {
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

class EyeWithGlass {
    constructor() {
        this.state = new EWGState()
    }

    draw(context) {
        context.lineWidth = size/32
        context.lineCap = 'round'
        context.strokeStyle = '#0D47A1'
        context.save()
        context.translate(size/2, size)
        context.restore()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

class EyeShape {
    static draw(context, scale1, scale2) {
        for (var i = 0; i < 2; i++) {
            context.save()
            context.translate(size/4 * scale2 * (1 - 2 * i), 0)
            context.beginPath()
            for (var i = 0; i <= 360; i++) {
                const x = (size/15) * Math.cos(i * Math.PI/180), y = (size/25) * Math.sin(i * Math.PI/180) * scale1
                if (i == 0) {
                    context.moveTo(x, y)
                }
                else {
                    context.lineTo(x, y)
                }
            }
            context.stroke()
            context.beginPath()
            context.arc(0, 0, size/40 * scale1, 0, 2 * Math.PI)
            context.restore()
        }
    }
}

customElements.define('eye-with-glass', EyeWithGlassComponent)
