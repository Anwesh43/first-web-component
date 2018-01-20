const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class ChordArcComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.container = new ChordArcContainer()
    }
    render() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.container.startUpdating(()=>{
                this.animator.startAnimation(()=>{
                    this.render()
                    this.container.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class ChordArc {
    constructor(i) {
        this.i = i
        this.state = new ChordArcState()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(i*Math.PI/2+(Math.PI/2)*this.state.scale)
        context.beginPath()
        for(var i = -45;i<=45;i++) {
            const x = (size/3)*Math.cos(i*Math.PI/180),y = (size/3)*Math.sin(i*Math.PI/180)
            if(i == -45) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class ChordArcState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class ChordArcContainer {
    constructor() {
        this.chordArcs = []
        this.state = new ChordArcContainerState()
        for(var i=0;i<4;i++) {
            this.chordArcs.push(new ChordArc(i))
        }
    }
    draw(context) {
        for(var i=0;i<4;i++) {
            this.chordArcs.forEach((chordArc) => {
                chordArc.draw(context)
            })
        }
    }
    update(stopcb) {
        if(this.j <= 4 || this.j >= 1) {
            this.chordArc[this.j - 1].update(()=>{
                this.state.incrementJ()
                stopcb()
            })
        }
    }
    startUpdating(startcb) {
      if(this.j <= 4 || this.j >= 1) {
          this.chordArc[this.j - 1].startUpdating(startcb)
      }
    }
}
class ChordArcContainerState {
    constructor() {
        this.j = 0
        this.dir = 0
    }
    incrementJ() {
        this.j+=this.dir
        if(this.j == 4 || this.j == 0) {
            this.dir = -1
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    startAnimation(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            }),50
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
