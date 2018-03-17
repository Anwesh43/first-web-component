const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/3
class TextUnderOverLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.text = this.getAttribute('text')
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    startUpdatig(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1){
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.lenght || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
}
