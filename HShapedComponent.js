const w = window.innerWidth, h = window.innerHeight
class HShapedComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.animator = new HShapeAnimator()
        this.hShape = new HShape()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.hShape.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.hShape.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.hShape.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class HShapeState {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
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
class HShapeAnimator {
    constructor() {
        this.animated = false
    }
    start (updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class HShape {
    constructor() {
        this.state = new HShapeState()
    }
    draw(context) {
        context.strokeStyle = 'white'
        context.strokeWidth = Math.min(w, h) / 60
        context.strokeCap = 'round'
        const Hw = Math.min(w,h)/15, Hh = Math.min(w, h)/5
        context.save()
        context.translate(w/2, h/2)
        context.rotate(Math.PI * this.state.scales[2])
        for(var i = 0; i < 2; i++) {
            const Hx = -Hw * this.state.scales[1] * (1 - 2 * i), Hy = Hh/2  * (this.state.scales[0])
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(Hx, 0)
            context.stroke()
            context.beginPath()
            context.moveTo(Hx, -Hy)
            context.lineTo(Hx, Hy)
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
customElements.define('hshaped-comp', HShapedComponent)
