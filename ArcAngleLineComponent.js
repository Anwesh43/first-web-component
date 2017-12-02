const size = Math.min(w,h)/3
class ArcAngleLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n')||6
        this.container = new ArcAngleLineContainer(this.n)
        this.animator = new ArcAngleLineAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.click = ()=>{
            this.animator.startAnimating()
        }
    }
    update(stopcb) {
        this.container.update(stopcb)
    }
    startUpdating(startcb) {
        this.container.startUpdating(startcb)
    }
}
class ArcAngle {
    constructor(i) {
        this.i = i
        this.state = new ArcLineState()
    }
    draw(context,deg) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(deg*this.i*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=deg;i++) {
            const px = ((size/2)*this.state.scale)+(size/4)*Math.cos(i*Math.PI/180), py = (size/4)*Math.sin(i*Math.PI/180)
            context.lineTo(px,py)
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
class ArcLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale = this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = 0
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
class ArcAngleLineContainer {
    constructor(n) {
        this.arcs = []
        this.state = new ArcAngleLineContainer(n)
        this.init(n)
    }
    init(n) {
        for(var i=0;i<n;i++) {
            this.arcs.push(new ArcAngle(i))
        }
    }
    draw(context) {
        const n = this.arcs.length,deg = (n>0)?(360/n):0
        context.fillStyle = '#673ab7'
        this.arcs.forEach((arc)=>{
            arc.draw(context,deg)
        })
        context.strokeStyle = '#4caf50'
        this.executeFuncOnCurrentJ((j)=>{
            const arc = this.arcs[j]
            const scale = arc.state.scale
            context.beginPath()
            context.moveTo(size/10,size/10)
            context.lineTo(9*size/10,size/10)
            context.stroke()
        })
    }
    update(stopcb) {
        this.executeFuncOnCurrentJ((j)=>{
            this.arcs[j].update(()=>{
                stopcb()
                this.state.incrementCounter()
            })
        })
    }
    startUpdating(startcb) {
        this.executeFuncOnCurrentJ((j)=>{
            this.arcs[j].startUpdating(startcb)
        })
    }
    executeFuncOnCurrentJ(cb) {
        const j = this.state.j
        if(j < this.arcs.length) {
            cb(j)
        }
    }
}
class ArcAngleLineContainerState {
    constructor(n) {
        this.dir = 1
        this.j = 0
        this.n = n
    }
    incrementCounter() {
        this.j += this.dir
        if(this.j == this.n || this.j == -1) {
            this.dir *= -1
            this.j += this.dir
        }
    }
}
class ArcAngleLineAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimating() {
        if(!this.animated) {
            this.component.startUpdating(()=>{
                this.startInterval()
            })
        }
    }
    startInterval() {
        this.animated = true
        const interval = setInterval(()=>{
            this.component.render()
            this.component.update(()=>{
                this.animated = false
                clearInterval(interval)
            })
        },50)
    }
}
