const size = Math.min(window.innerWidth, window.innerHeight)/2
class CircleExpandComponent extends HTMLElement {
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
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
