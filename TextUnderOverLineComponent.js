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
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class TextUnderOverLine {
    constructor(text) {
        this.text = text
        this.state = new State()
    }
    draw(context) {
        context.fillStyle = 'white'
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.font = context.font.replace(/\d{2}/,size/5)
        const tw = context.measureText(this.text).width
        context.save()
        context.translate(w/2, h/2)
        context.save()
        context.beginPath()
        context.rect(-tw * this.state.scales[0], -size/5, 2 * tw * this.state.scales[0], 2*size/5)
        context.clipPath()
        context.fillText(this.text,-tw/2,0)
        context.restore()
        for(var i = 0; i < 2; i++) {
            context.save()
            const sc = 1 - 2 * i
            context.scale(sc, sc)
            context.beginPath()
            context.moveTo(-tw/2, size/5)
            context.lineTo(-tw/2 + tw * this.state.scales[1], size/5)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
