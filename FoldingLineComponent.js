const size = Math.min(window.innerWidth,window.innerHeight)/2
class FoldingLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'true'})
        this.img = document.createElement('img')
        this.n = this.getAttibute('n')||5
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('img')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
class State {
    constructor() {
        this.dir = 0
        this.scale = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.prevScale = this.scale + this.dir
            this.dir = 0
            this.scale = this.prevScale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class FoldingLine {
    constructor(i) {
        this.i = i
        this.state = new State()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    draw(context,gap) {
        const i = this.i
        const state = this.state
        context.strokeStyle = '#4527A0'
        context.lineWidth = size/15
        context.lineCap = 'round'
        context.save()
        context.translate(gap*i,0)
        context.rotate(180*(1-state.scale))
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(gap,0)
        context.stroke()
        context.restore()
    }
}
