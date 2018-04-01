const w = window.innerWidth, h = window.innerHeight
class HShapedComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
