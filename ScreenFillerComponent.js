const w = window.innerWidth,h = window.innerHeight
const createCircularDiv = (div) => {
    div.style.position = 'absolute'
    div.style.left = w/2-w/15
    div.style.top = 4*h/5
    div.style.borderRadius = '50%'
}
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
class Circle {
    constructor(shadow) {
        this.createDom(shadow)
    }
    createDom(shadow) {
        this.div = document.createElement('div')
        this.backDiv = document.createElement('div')
        createCircularDiv(this.div)
        createCircularDiv(this.backDiv)
        this.div.style.background = 'yellow'
        this.backDiv.style.border = '5px solid yellow'
        this.backDiv.style.width = 2*w/15
        this.backDiv.style.height = 2*w/15
        this.div.style.height = 0
        this.div.style.width = 0
        shadow.appendChild(this.div)
        shadow.appendChild(this.backDiv)
    }
    update(scale) {
        this.div.style.width = (2*w/15)*scale
        this.div.style.height = (2*w/15)*scale
    }
}
