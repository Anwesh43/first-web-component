const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/5
class TickCircleBoxComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
