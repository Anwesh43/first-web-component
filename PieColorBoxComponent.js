const w = window.innerWidth,h = window.innerHeight
class PieColorBoxComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('div')
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/5
        canvas.height = w/5
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
