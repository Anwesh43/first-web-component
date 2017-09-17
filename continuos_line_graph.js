const w = window.innerWidth,h = window.innerHeight
class ContinuosLineGraphComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const cw = w/3,ch = h/2
        const canvas = document.createElement('canvas')
        canvas.width  = cw
        canvas.height = ch
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,cw,ch)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
customElements.define('continuos-line-graph-comp',ContinuosLineGraphComponent)
