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
        this.renderer = new InelasticRenderer()
    }
    update() {
        this.renderer.update()
        this.div.style.top = this.renderer.y
    }
    connectedCallback() {
        this.initDiv()
    }
}
class InelasticRenderer {
    constructor(y,a) {
        this.initY = y
        this.y = y
        this.a = a
        this.afact = a/10
        this.deg = 0
    }
    update() {
        this.y = this.initY - this.a*Math.abs(Math.sin(this.deg*Math.PI/180))
        this.deg += 20
        if(this.deg %180 == 0) {
            this.a -= this.afact
        }
    }
}
