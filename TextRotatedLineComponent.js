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
class TextRotatedLine {
    constructor(text) {
        this.state = new State()
        this.text = text
    }
    draw(context) {
        context.font = context.font.replace(/\d{2}/,size/10)
        context.strokeStyle = '#1565C0'
        context.fillStyle = 'white'
        context.save()
        context.translate(size/2,size/10)
        for(var i=0;i<2;i++) {
            const deg = (Math.PI/2)*this.state.scales[0]
            context.save()
            context.rotate(deg*(i*2-1))
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,2*size/5)
            context.restore()
        }
        const th = (size/5)*this.state.scales[1]
        context.save()
        context.beginPath()
        context.moveTo(-2*size/5,0)
        context.lineTo(2*size/5,0)
        context.lineTo(2*size/5,th)
        context.lineTo(-2*size/5,th)
        context.clipPath()
        const tw = context.measureText(this.text).width
        context.fillText(this.text,-tw/2,size/10)
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
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
            })
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
