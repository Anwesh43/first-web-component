const w = window.innerWidth, h = window.innerHeight
class MultipleSquareComponent extends HTMLElement {
    constructor() {
        super()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
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
