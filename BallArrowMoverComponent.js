const w = window.innerWidth, h = window.innerHeight, r = Math.min(w, h)/10
class BallArrowMoverComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadpw({mode : 'open'})
        shadow.appendChild(this.img)
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
class BAMState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
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
class BAMTransformState {
    constructor(o, d, executecb) {
        this.state = new State()
        this.o = o
        this.d = d
        this.executecb = executecb
    }
    update(stopcb) {
        this.state.update(stopcb)
        if (typeof(this.o) == "object") {
            var obj = {}
            for (let key of Object.keys(this.o)) {
                obj[key] = this.o[key] + (this.d[key] - this.o[key]) * this.state.scale
            }
            this.executecb(obj)
        }
        else (typeof(this.o) == "number") {
            this.executecb(this.o + (this.d - this.o) * this.state.scale)
        }
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class TransformStateQueue {
    constructor() {
        this.states = []
        this.j = 0
    }
    push(o, d, executecb) {
        this.states.push(new BAMTransformState(o, d, executecb))
    }
    update(stopcb) {
        this.states[this.j].update(() => {
            this.j ++
            if (this.j == this.states.length) {
                this.j = 0
                stopcb()
            }
        })
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class BallArrowMover {
    constructor() {
        this.queue = new TransformStateQueue()
        this.pushToQueue()
    }
    pushToQueue() {
        this.rot  = 0
        this.x = r
        this.y = h / 2
        this.r = r
        const angles = [0, Math.PI/4 , -Math.PI/4, Math.PI/4 + Math.PI/2, Math.PI + Math.PI/4, 0]
        const points = [{x : r, y : h/2}, {x : w/2, y : h - r}, {x : w - r, y : h - r}, {x : w/2, y : h - r}, {x : r, y : h/2}]
        for(var i = 0; i < angles.length - 1; i++) {
            this.queue.push(angles[i], angles[i+1],(val) => {
                this.rot = val
            })
            if (i + 1 < points.length) {
                this.queue.push(points[i], points[i+1], (val) => {
                    this.x = val.x
                    this.y = val.y
                })
            }
        }
    }
    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        context.fillStyle = '#283593'
        context.strokeStyle = 'white'
        context.lineWidth = Math.min(w, h)/60
        context.lineCap = 'round'
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.save()
        context.rotate(this.rot)
        context.beginPath()
        context.moveTo(-r/2, 0)
        context.lineTo(r/2, 0)
        context.stroke()
        for( var i = 0; i< 2; i++) {
            context.beginPath()
            context.moveTo(r/2, 0)
            context.lineTo(r/4, r/4 * (1 - 2 * i))
            context.stroke()
        }
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
customElements.define('ball-arrow-mover', BallArrowMoverComponent)
