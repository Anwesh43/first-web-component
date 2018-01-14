const w = window.innerWidth, h = window.innerHeight
class SineWaveComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animatorQueue = new AnimatorQueue(this)
        this.sineWave = new SineWave()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.heigh = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.sineWave.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = () => {
            this.animatorQueue.addAnimation(()=>{
                this.sineWave.addPoints()
            },()=>{
                return this.sineWave.stoppedAddingPoints()
            })
            this.animatorQueue.addAnimation(()=>{
                this.sineWave.removePoints()
            },()=>{
                return this.sineWave.stoppedRemovingPoints()
            })
            this.animatorQueue.startUpdating()
        }
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
    addAnimation(updatecb,stopcb) {
        this.queues.push(new Animation(updatecb,stopcb))
    }
    startUpdating() {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                this.component.render()
                if(this.queues.length > 0) {
                    const animation = this.queues[0]
                    animation.animate()
                    if(animation.stopped()) {
                        this.queues.splice(0,1)
                        if(this.queues.length == 0) {
                            this.stop()
                        }
                    }
                }
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class Animation  {
    constructor(updatecb,stopcb) {
        this.updatecb = updatecb
        this.stopcb = stopcb
    }
    animate() {
        this.updatecb()
    }
    stopped() {
        return this.stopcb()
    }
}
customElements.define('sine-wave-comp',SineWaveComponent)
