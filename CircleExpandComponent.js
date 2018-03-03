const w = window.innerWidth, h = window.innerHeight
class CircleExpandComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.container = new CircleExpandContainer()
        this.animator = new Animator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.container.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.container.update(() => {
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
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                this.prevScale = this.scales[this.j]
                if(this.dir == 1) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 60)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class CircleExpandContainer {
    constructor() {
        this.state = new State()
    }
    drawArc(context, x, r) {
      context.beginPath()
      context.arc(x, 0, r, 0, 2 * Math.PI)
      context.stroke()
    }
    draw(context) {
        const r = w/20
        context.strokeStyle = '#009688'
        context.lineWidth = r / 10
        context.save()
        context.translate(w/2, h/2)
        context.rotate(Math.PI * this.state.scales[2])
        for(var i = 0; i < 3; i++) {
            this.drawArc(context, -i * (2 * r) * this.state.scales[1], r * this.state.scales[0])
            this.drawArc(context, i * (2 * r) * this.state.scales[1], r * this.state.scales[0])
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
customElements.define('circle-expand-comp', CircleExpandComponent)
