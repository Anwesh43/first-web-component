const w = window.innerWidth,h = window.innerHeight
class FourCornerWebComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.color = this.getAttribute('color')||'#01579B'
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/4
        canvas.height = w/4
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    update() {

    }
    stopped() {

    }
    connectedCallback() {
        this.render()
    }
}
