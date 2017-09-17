const w = window.innerWidth,h = window.innerHeight
const delay = 150
class ContinuosLineGraphComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.looper = new Looper()
    }
    render() {
        const cw = w/3,ch = h/2
        const canvas = document.createElement('canvas')
        canvas.width  = cw
        canvas.height = ch
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,cw,ch)
        LineContainer.draw(context,cw,ch,100)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.looper.start(this.render.bind(this))
    }
}
class Line {
    static draw(context,yEnd,x,y) {
        context.beginPath()
        context.moveTo(x,y)
        context.lineTo(x,yEnd)
        context.stroke()
    }
}
class LineContainer {
    static draw(context,w,h,n) {
      context.strokeStyle = '#0277BD'
      context.lineWidth = w/30
      var x = 0
      const y = h
      for(var i=0;i<n;i++) {
          var yEnd = y-(h*Math.random())
          Line.draw(context,yEnd,x,y)
          x += w/30
      }
    }
}
class Looper {
    start(cb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(cb,delay)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('continuos-line-graph-comp',ContinuosLineGraphComponent)
