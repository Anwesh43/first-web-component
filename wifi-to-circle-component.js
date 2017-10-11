const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/4
class WifiToCircleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        const img = document.createElement('img')
        shadow.appendChild(img)
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
