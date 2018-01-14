const w = window.innerWidth, h = window.innerHeight
class SineWaveComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animatorQueue = new AnimatorQueue(this)
        this.sineWave = new SineWave()
        console.log(this.sineWave)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.sineWave.draw(context)
        this.img.src = canvas.toDataURL()
        console.log(canvas.width)
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
        this.n = 0
        this.maxN = 10
        this.deg = 0
    }
    draw(context) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w,h)/40
        context.strokeStyle = '#FF5722'
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        this.points.forEach((point,i) => {
            if(i == 0) {
                context.moveTo(point.x,point.y)
            }
            else {
                context.lineTo(point.x,point.y)
            }
        })
        context.stroke()
        context.restore()
    }
    addPoints() {
        if(this.n < this.maxN) {
            this.deg += 90/this.maxN
            this.points.push(SineWavePoint.createSineWavePoint(h/3,this.deg,w/12))
            this.n++
        }
    }
    stoppedAddingPoints() {
        return this.n == this.maxN
    }
    stoppedRemovingPoints() {
        return this.n == 0
    }
    removePoints() {
        if(this.n >= 1 && this.points.length > 0) {
            var lastPoints = this.points.splice(0,1)
            this.n --
            console.log(this.n)
            if(this.n == 0 && lastPoints.length == 1 && this.deg >= 360) {
                this.x += lastPoints[0].x
                this.deg = 0
            }
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
        console.log(this.queues)
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
                        console.log(this.queues.length)
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
