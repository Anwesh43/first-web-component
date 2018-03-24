const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/25
class CircleBallRotComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new CBRAnimator()
        this.circleBallRot = new CircleBallRot()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.circleBallRot.startUpdating(() => {
              this.animator.start(() => {
                  this.render()
                  this.circleBallRot.update(() => {
                      this.animator.stop()
                  })
              })
            })

        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.circleBallRot.draw(context)
        this.img.src = canvas.toDataURL()

    }
}
class CBRState {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.j = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class CBRAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
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
class CircleBallRot {
    constructor() {
        this.state = new CBRState()
    }
    draw(context) {
        context.save()
        context.translate(w/2, -size + (h/2 - size) * this.state.scales[0])
        context.rotate(Math.PI/2 * this.state.scales[2])
        for(var i = 0; i< 6; i++) {
            context.save()
            context.rotate(i * Math.PI/3)
            context.beginPath()
            context.arc(Math.min(w, h)/3 * this.state.scales[1], 0, size, 0, 2 * Math.PI)
            context.fill()
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
customElements.define('circle-ball-rot', CircleBallRotComponent)
