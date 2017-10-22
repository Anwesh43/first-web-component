const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)*0.4
class PolygonalCenterBallComponent extends HTMLElement {
    constructor() {
        super()
        this.n = this.getAttribute('n')
        this.img = document.createElement('img')
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
