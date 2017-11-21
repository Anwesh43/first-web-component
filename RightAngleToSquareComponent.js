const w = window.innerWidth,h = window.innerHeight
class RightAngleToSquareComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
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
}
class RightAngleToSquare {
    constructor(size) {
        this.size = size
        this.deg = 0
        this.scale = 0
        this.updateFns = [(scale)=>{
            this.scale = scale
        },(scale)=>{
            this.deg = Math.PI*scale
        }]
    }
    addToAnimQueue(queue) {
        this.updateFns.forEach((updateFn)=>{
            queue.push(updateFn)
        })
    }
    draw(context) {
        context.save()
        context.translate(w/2,h/2)
        context.lineWidth = size/10
        context.lineCap = "round"
        for(var i=0;i<2;i++) {
            canvas.save()
            canvas.rotate(i*this.deg)
            for(var j=0;j<2;j++) {
                context.save()
                context.translate(size/2,size/2)
                context.rotate(-j*Math.PI/2)
                context.beginPath()
                context.moveTo(0,0)
                context.lineTo(0,-size*this.scale)
                context.stroke()
                context.restore()
            }
            canvas.restore()
        }
        context.restore()
    }
}
class RightAngleToSquareContainer {
    constructor(n) {
        this.rightAngles = []
        this.queue = new AnimationQueue()
        this.init(n)
    }
    init(n) {
        const size = Math.min(w,h)/2
        for(var i=0;i<n;i++) {
            const rightAngleToSquare = new RightAngleToSquare(size/(n-i))
            rightAngleToSquare.addToAnimQueue(queue)
            this.rightAngles.push(rightAngleToSquare)
        }
    }
    draw(context) {
        this.rightAngles.forEach((rightAngle)=>{
            rightAngle.draw(context)
        })
    }
    update() {
        this.queue.update()
    }
    startUpdating() {
        return this.queue.startUpdating()
    }
    stopped() {
        return this.queue.stopped()
    }
}
