const w = window.innerWidth, h = window.innerHeight
class MultiArrowMoverComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
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

class MAMState {
    constructor() {
        this.deg = 0
        this.scale = 0
        this.dir = 0
    }

    update(stopcb) {
        this.deg += this.dir * Math.PI/10
        this.scale = Math.sin(this.deg)
        if (this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }

}
customElements.define('multi-arrow', MultiArrowMover)
