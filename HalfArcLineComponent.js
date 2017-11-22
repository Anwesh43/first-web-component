const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/2
const drawArc = (context,r,start_deg,end_deg) {
    context.beginPath()
    for(var i=start_deg;i<=end_deg;i++) {
        const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
        if(i == start_deg) {
            context.moveTo(x,y)
        }
        else {
            context.lineTo(x,y)
        }
        context.stroke()
    }
}
class HalfArcLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.halfArcLine = new HalfArcLine()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
    update() {
        this.halfArcLine.update()
    }
    stopped() {
        return this.halfArcLine.stopped()
    }
    startUpdating() {
        this.halfArcLine.startUpdating()
    }
}
class HalfArcLine {
    constructor() {
        this.scale = 0
        this.queue = new AnimationQueue()
        this.queue.push((scale)=>{
            this.scale = scale
        })
        this.queue.push((scale)=>{
            this.scale = 1-scale
        })
    }
    update() {
        this.queue.update()
    }
    stopped() {
        return this.queue.stopped()
    }
    startUpdating() {
        this.queue.startUpdating()
    }
    draw(context) {
        context.lineWidth = size/40
        context.lineCap = 'round'
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(w/2,h/2)
            context.save()
            context.rotate(this.scale*Math.PI/2)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,size/3)
            context.stroke()
            context.restore()
            drawArc(context,size/3,0,90*this.scale)
            context.restore()
        }
    }
}
class HalfArcLineAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startUpdating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
