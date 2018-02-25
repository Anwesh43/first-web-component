const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 3
class FillPlusComponent extends HTMLElement {
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
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
        this.jDir = 1
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.jDir
            if(this.j == this.scales.length || this.j == -1) {
                this.jDir *= -1
                this.j += this.jDir
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
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
        if(!this.anmimated) {
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
class FillPlus {
    constructor() {
        this.state = new State()
    }
    drawPlus(context, scale) {
      for(var i = 0; i < 2; i++) {
          context.save()
          context.rotate(i * Math.PI/2)
          context.beginPath()
          context.moveTo(0, -(size / 4) * scale)
          context.lineTo(0, (size / 4) * scale)
          context.stroke()
          context.restore()
      }
    }
    draw(context) {
        const scales = this.state.scales
        context.save()
        context.tranlsate(size / 2, size / 2)
        context.rotate(Math.PI/4 * scales[1])
        context.save()
        context.strokeStyle = '#757575'
        this.drawPlus(context, 1)
        context.strokeStyle = '#e53935'
        this.drawPlus(context, scales[0])
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
