const size = Math.min(window.innerWidth,window.innerHeight)/2
const n = 8
class DirectionTriangleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.container = new DirectionTriangleContainer()
        this.animator = new DirectionTriangleAnimator(this)
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
    update(stopcb) {
        this.container.update(stopcb)
    }
    startUpdating(startcb) {
        this.container.startUpdating(startcb)
    }
    connectedCallback() {
        this.render()
        this.img.onclick = ()=>{
            this.animator.startAnimation()
        }
    }
}
class DirectionTriangle {
    constructor(i) {
        this.i = i
        this.state = new DirectionTriangleState()
    }
    draw(context) {
        const i = this.i
        var gap = size/(n+1)
        const oy = -gap/2+(i%2)*(size+gap)
        const diff = size/2 - oy
        context.fillStyle = '#2979FF'
        context.save()
        context.translate(gap/2+this.i*gap,oy+diff*this.state.scale)
        context.rotate(((i+1)%2)*Math.PI)
        context.beginPath()
        context.moveTo(-gap/2,gap/2)
        context.lineTo(0,-gap/2)
        context.lineTo(gap/2,gap/2)
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
class DirectionTriangleContainer {
    constructor() {
        this.triangles = []
        this.init()
        this.state = new DirectionTriangleContainerState()
    }
    init() {
        for(var i=0;i<n;i++) {
            console.log(n)
            this.triangles.push(new DirectionTriangle(i))
        }
        console.log(this.triangles)
    }
    draw(context) {
        this.triangles.forEach((triangle)=>{
            triangle.draw(context)
        })
    }
    update(stopcb) {
        this.state.executeFn((j)=>{
            this.triangles[j].update(()=>{
              this.state.update()
              stopcb()
            })
        })
    }
    startUpdating(startcb) {
        this.state.executeFn((j)=>{
            this.triangles[j].startUpdating(startcb)
        })
    }
}
class DirectionTriangleState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(startcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale +this.dir
            this.dir = 0
            this.prevScale = this.scale
            console.log(`scale is ${this.scale}`)
            startcb()
        }
    }
    startUpdating(stopcb) {
        this.dir = 1-2*this.scale
        stopcb()
    }
}
class DirectionTriangleContainerState {
    constructor() {
        this.j = 0
        this.dir = 1
    }
    executeFn(cb) {
        cb(this.j)
    }
    update() {
        this.j += this.dir
        if(this.j == n || this.j == -1) {
            this.dir *= -1
            this.j += this.dir
        }
    }
}
class DirectionTriangleAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        console.log(this.animated)
        if(!this.animated) {
            this.component.startUpdating(()=>{
                this.animated = true
            })
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update(()=>{
                    this.animated = false
                    clearInterval(interval)
                })
            },50)
        }
    }
}
customElements.define('direc-tri-comp',DirectionTriangleComponent)
