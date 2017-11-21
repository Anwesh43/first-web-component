const w = window.innerWidth,h = window.innerHeight
class RightAngleToSquareComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.rightAngleToSquareContainer = new RightAngleToSquareContainer(10)
        this.animator = new RightAngleToSquareAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.rightAngleToSquareContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) =>{
            this.animator.startUpdating()
        }
    }
    update() {
        this.rightAngleToSquareContainer.update()
    }
    stopped() {
        return this.rightAngleToSquareContainer.stopped()
    }
    startUpdating() {
        return this.rightAngleToSquareContainer.startUpdating()
    }
}
class RightAngleToSquare {
    constructor(size) {
        this.size = size
        this.deg = 0
        this.scale = 0
        this.updateFns = [(scale)=>{
            this.scale = scale
            console.log(this.scale)
        },(scale)=>{
            this.deg = Math.PI*scale
            console.log(this.deg)
        }]
    }
    addToAnimQueue(queue) {
        this.updateFns.forEach((updateFn)=>{
            queue.push(updateFn)
        })
    }
    draw(context) {
        const size = this.size
        context.strokeStyle = '#f44336'
        context.save()
        context.translate(w/2,h/2)
        context.lineWidth = size/10
        context.lineCap = "round"
        for(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*this.deg)
            for(var j=0;j<2;j++) {
                context.save()
                context.translate(size/2,size/2)
                context.rotate(-j*Math.PI/2)
                if(this.scale > 0) {
                    context.beginPath()
                    context.moveTo(0,0)
                    context.lineTo(0,-size*this.scale)
                    context.stroke()
                }
                context.restore()
            }
            context.restore()
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
        const size = 20*Math.min(w,h)/21
        for(var i=0;i<n;i++) {
            const rightAngleToSquare = new RightAngleToSquare(size/(n-i))
            rightAngleToSquare.addToAnimQueue(this.queue)
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
class RightAngleToSquareAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startUpdating() {
        if(!this.animated && this.component.startUpdating()) {
            console.log("coming here")
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
customElements.define('right-angle-to-square-comp',RightAngleToSquareComponent)
