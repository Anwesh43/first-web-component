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
        this.screen = new ScreenFiller(shadow)
        this.circle = new Circle(shadow)
        this.animator = new FillingAnimator()
    }
    update(scale) {
        this.screen.update(scale)
        this.circle.update(scale)
    }
    connectedCallback() {
        this.circle.handleMouseEvent(()=>{
            this.animator.startUpdating()
        },()=>{
            this.animator.changeDir()
        })
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
    handleMouseEvent(cbdown,cbup)  {
        this.isDown = false
        this.backDiv.onmousedown = () => {
            if(!this.isDown) {
                this.isDown = true
                cbdown()
            }
        }
        this.backDiv.onmouseup = () => {
            if(this.isDown) {
                this.isDown = false
                cbup()
            }
        }
    }
}
class FillingAnimator {
    constructor() {
        this.animated = false
        this.dir = 0
        this.scale = 0
    }
    startUpdating(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.dir = 1
            this.interval = setInterval(()=>{
                this.scale += 0.04*this.dir
                updatecb(this.scale)
                if(this.scale == 0) {
                    this.stop()
                }
            },50)
        }
    }
    changeDir() {
        if(this.animated) {
            this.dir = -1
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(interval)
        }
    }
}
