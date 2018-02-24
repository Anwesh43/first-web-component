const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 2
class CircleToCircleComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.circleToCircle = new CircleToCircle()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.circleToCircle.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const diff = event.offsetX - this.circleToCircle.x
            const dir = (diff != 0) ? diff/Math.abs(diff) : 1
            this.circleToCircle.startUpdating(dir, () => {
                this.animator.start(() => {
                    this.render()
                    this.circleToCircle.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
        this.jDir = 1
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.prevScale - this.scales[this.j]) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.jDir
            if(this.j == this.scales.length) {
                this.jDir *= -1
                this.dir = 0
                this.j += this.jDir
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.scales = [0,0]
            this.j = 0
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
        if( !this.animated ) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if( this.animated ) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class CircleToCircle {
    constructor() {
        this.state = new State()
        this.x = size/2
        this.y = size/2
        this.r = size/8
        this.dir = 0
    }
    drawArc(context, start, end) {
      context.beginPath()
      for(var i = start; i <= end; i++) {
          const x = this.r * Math.cos(i * Math.PI/180), y = this.r * Math.sin(i * Math.PI/180)
          if(i == start) {
              context.moveTo(x, y)
          }
          else {
              context.lineTo(x, y)
          }
      }
      context.stroke()
    }
    draw(context) {
        const startDeg1 = 90 * (1 - this.dir), startDeg2 = 90 * (1 + this.dir)
        const sweep1 = 360 * (1 - this.state.scales[0]), sweep2 = 360 * this.state.scales[1]
        context.strokeStyle = '#009688'
        context.lineWidth = this.r/20
        context.save()
        context.translate(this.x, this.y)
        this.drawArc(context, startDeg1, startDeg1 + sweep1)
        context.save()
        context.translate(2 * this.r * this.dir , 0)
        this.drawArc(context, startDeg2, startDeg2 + sweep2)
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.x += 2 * this.r * this.dir
            this.dir = 0
            stopcb()
        })
    }
    startUpdating(dir, startcb) {
        if(this.dir == 0) {
            this.dir = dir
            this.state.startUpdating(startcb)
        }
    }
}
customElements.define('circ-to-circ', CircleToCircleComponent)
