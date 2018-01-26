const w = window.innerWidth
class AlternateBarComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(w,h)
        canvas.height = Math.min(w,h)
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,w)
        this.img.src = canvas.toDataURL()
    }
}
