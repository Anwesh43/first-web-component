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
class StateHandler {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir *0.2
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        if(this.scale <= 0) {
            this.dir = 1
        }
    }
    stopped() {
        return dir == 0
    }
}
