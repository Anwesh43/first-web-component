const w = window.innerWidth, h = window.innerHeight, n = 5, size = Math.min(w,h)/(2 * n)
class TriWaveRotComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
customElements.define('tri-wave-rot', TriWaveRotComponent)
