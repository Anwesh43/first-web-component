const w = window.innerWidth,h = window.innerHeight
class InelasticJumpComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
    }
    initDiv() {
        this.div.style.width = w/12
        this.div.style.height = w/12
        this.div.style.background = "#e53935"
        this.div.style.borderRadius = "50%"
        this.div.style.position = "absolute"
        this.div.style.left = w/2-w/24
        this.div.style.top = h-w/12
    }
    update() {
        this.div.style.top = 100
    }
    connectedCallback() {
        this.initDiv()
    }
}
