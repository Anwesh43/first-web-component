const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 3
class LeftRightBallComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
customElements.define('left-right-ball', LeftRightBallComponent)
