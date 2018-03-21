const w = window.innerWidth, h= window.innerHeight
class TicTacLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        this.ticTacLine = new TicTacLine()
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.ticTacLine.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.ticTacLine.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.ticTacLine.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class State {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = clearInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class TicTacLine {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        val size = Math.min(w, h) / 3
        context.strokeStyle = 'white'
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        for(var i = 0; i < 2; i ++) {
            context.save()
            context.translate(w/2, h/2)
            context.rotate(Math.PI/2 * i * this.state.scale)
            for(var j = 0; j < 2; j++) {
                context.save()
                context.translate(-size/2 * (1 - 2 * i), -size/2)
                context.beginPath()
                context.moveTo(0, 0)
                context.lineTo(0 , size)
                context.stroke()
                context.restore()
            }
            context.restore()
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('tic-tac-line', TicTacLineComponent)
