const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 2
class CircleToCircleComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
        this.jDir = 1
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.prevScale - this.scales[this.j]) > 1) {
            this.scales[this.j] = 0
            this.j += this.jDir
            if(this.j == this.scales.length || this.j == -1) {
                this.jDir *= -1
                this.dir = 0
                this.j += this.jDir
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
