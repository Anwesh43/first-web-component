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
customElements.define('multiple-circ-two-line', MultipleCircleTwoLineComponent)
