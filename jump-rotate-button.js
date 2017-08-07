const w = window.innerWidth,h = window.innerHeight
class JumpRotateButtonComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3
        const context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
    }
}
class JumpRotateShape {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.deg = 0
    }
    draw(context) {
        context.strokeStyle = '#01579B'
        context.lineWidth = this.r/10
        context.lineCap = "round"
        context.save()
        context.translate(this.x,this.y)
        context.rotate(this.deg*Math.PI/180)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,-2*this.r/3)
        context.stroke()
        context.restore()
    }
    update(scale) {
        this.deg = 360*scale
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg += 4.5
        if(this.deg > 180) {
            this.deg = 0
        }
        this.scale = Math.abs(Math.sin(this.deg*Math.PI/180))
    }
    stopped() {
        return this.deg == 0
    }
}
