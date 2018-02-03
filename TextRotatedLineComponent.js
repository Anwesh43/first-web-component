const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class TextRotatedLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        super.render()
    }
}
class State {
    constructor() {
        this.scales = [0,0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir*0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += Math.floor(this.dir)
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= Math.floor(this.dir)
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb(this.prevScale) 
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.prevScale
            startcb()
        }
    }
}
