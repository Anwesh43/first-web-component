const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/3
class MultipleCircleTwoLineComponent extends HTMLElement {
    constructor() {
        super()
    }

    render() {
        const canvas = documen.createElement('canvas')
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

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
}

class MCTLState {
    constructor() {
        this.scales = [0, 0, 0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.size || this.j == -1) {
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
customElements.define('multiple-circ-two-line', MultipleCircleTwoLineComponent)
