const w = window.innerWidth, h = window.innerHeight
class SineWaveComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.heigh = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class SineWave {
    constructor() {
        this.x = 0
        this.y = h/2
        this.points = []
        this.n = 1
        this.maxN = 10
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.moveTo()
        context.lineTo()
        cotntext.stroke()
        context.restore()
    }
    addPoints() {
        if(this.n < this.maxK) {
            this.points.push(SineWavePoint.createSineWavePoint(h/3,this.n*(90/this.maxK),w/5))
            this.n++
        }
    }
    stoppedAddingPoints() {
        return this.n == this.maxK
    }
    stoppedRemovingPoints() {
        return this.n == 1
    }
    removePoints() {
        if(this.n > 1 && this.points.size > 0) {
            this.points.splice(0,1)
            this.n --
        }
    }
}
class SineWavePoint {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    static createSineWavePoint(a,deg,x) {
        return new SineWavePoint(x*(deg/90),a*Math.sin(deg*Math.PI/180))
    }
}
class AnimatorQueue {
    constructor(component) {
        this.queues = []
        this.animated = false
        this.component = component
    }
    addingAnimation(updatecb,stopcb) {

    }
    startUpdating() {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                this.component.render()
            },50)
        }
    }
}
