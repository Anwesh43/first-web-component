const w = window.innerWidth,h = window.innerHeight
class JumpRotateButtonComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3
        const context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
    }
}
