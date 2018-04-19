const w = window.innerWidth, h = window.innerHeight
class MultipleSquareComponent extends HTMLElement {
    constructor() {
        super()
        this.multipleSquare = new MultipleSquare()
        this.animator = new MSAnimator()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.multipleSquare.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.multipleSquare.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.multipleSquare.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class MSState {
  constructor() {
      this.scales = [0, 0, 0]
      this.dir = 0
      this.j = 0
      this.prevScale = 0
  }
  update(stopcb) {
      this.scales[this.j] += this.dir * 0.1
      if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
          this.scales[this.j] = this.prevScale + this.dir
          this.j += this.dir
          if (this.j == this.scales.length || this.j == -1) {
              this.j += this.dir
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

class MSAnimator {
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

class MultipleSquare {
    constructor() {
        this.state = new MSState()
    }
    draw(context) {
        context.strokeStyle = '#f44336'
        context.lineWidth = Math.min(w,h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, 0)
        const size = h/4, gap = h/3
        var y = gap/2
        for (var i = 0; i < 3; i++) {
            const x = (size/2) * this.state.scales[0], oy = h/2 + (y - h/2) * this.state.scales[1]
            const dy1 = y - size/2, dy2 = y + size/2
            const newY1 = oy + (dy1 - oy) * this.state.scales[2], newY2 = oy + (dy2 - oy) * this.state.scales[2]
            context.beginPath()
            context.moveTo(-x, newY1)
            context.lineTo(x, newY1)
            context.lineTo(x, newY2)
            context.lineTo(-x, newY2)
            context.lineTo(-x, newY1)
            context.stroke()
            y += gap
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

customElements.define('mult-square', MultipleSquareComponent)
