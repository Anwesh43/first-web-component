const w = window.innerWidth,h = window.innerHeight
class ScreenFillerComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
    }
    render() {

    }
    connectedCallback() {
        this.render()
    }
}
class ScreenFiller {
    constructor(shadow) {
        this.createDom(shadow)
    }
    createDom(shadow) {
        this.div = document.createElement('div')
        this.div.style.width = 0
        this.div.style.position = 'absolute'
        this.div.style.top = 0
        this.div.style.left = 0
        this.div.style.height = 3*h/5
        this.div.style.background = 'yellow'
        shadow.appendChild(this.div)
    }
    update(scale) {
        this.div.style.width = w*scale
    }
}
