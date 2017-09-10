const size = Math.min(window.innerWidth,window.innerHeight)/3
class MultiArcFillButtonComponent extends HTMLElement {
    constructor() {
        super()
        this.n = this.getAttribute('n')||4
        this.n = parseInt(this.n)
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
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
