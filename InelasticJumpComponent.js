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
    initRenderer() {
        this.renderer = new InelasticRenderer(parseInt(this.div.style.top),h/2)
    }
    update() {
        this.renderer.update()
        this.div.style.top = this.renderer.y
    }
    stopped() {
        return this.renderer.stopped()
    }
    connectedCallback() {
        this.initDiv()
        this.animator = new Animator(this)
        this.div.onmousedown = () =>{
            this.animator.startAnimation()
        }
    }
}
class InelasticRenderer {
    constructor(y,a) {
        this.initY = y
        this.y = y
        this.a = a
        this.afact = a/6
        this.deg = 0
    }
    update() {
        this.y = this.initY - this.a*Math.abs(Math.sin(this.deg*Math.PI/180))
        this.deg += 4.5
        if(this.deg %180 == 0) {
            this.a -= this.afact
        }
    }
    stopped() {
        return this.a <= 0
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.initRenderer()
            const interval = setInterval(()=>{
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('inelastic-jump-comp',InelasticJumpComponent)
