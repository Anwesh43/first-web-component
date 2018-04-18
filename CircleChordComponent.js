const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/2
class CircleChordComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode : 'open'})
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
    }
}
