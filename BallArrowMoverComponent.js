const w = window.innerWidth, h = window.innerHeight
class BallArrowMoverComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadpw({mode : 'open'})
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
class BAMState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class BAMTransformState {
    constructor(o, d, executecb) {
        this.state = new State()
        this.o = o
        this.d = d
        this.executecb = executecb
    }
    update(stopcb) {
        this.state.update(stopcb)
        this.executecb(this.o + (this.d - this.o) * this.state.scale)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('ball-arrow-mover', BallArrowMoverComponent)
