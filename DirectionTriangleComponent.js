const size = Math.min(window.innerWidth,window.innerHeight)/3
const n = 5
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
        this.animator.draw(context)
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
        var gap = size/n
        const oy = (i%2)*(size+gap/2)
        const diff = size/2 - oy
        context.fillStyle = '#2979FF'
        context.save()
        context.translate(this.i*gap,oy+diff*state.scale)
        context.rotate((i%2)*Math.PI)
        context.beginPath()
        context.moveTo(-gap/2,gap/2)
        context.lineTo(0,-gap/2)
        context.lineTo(gap/2,gap/2)
        context.fill()
        context.restore()
    }
    update(stopcb) {
        state.update(stopcb)
    }
    startUpdating(startcb) {
        state.startUpdating(startcb)
    }
}
class DirectionTriangleContainer {
    constructor(n) {
        this.n = n
        this.triangles = []
        this.init(n)
        this.state = new DirectionTriangleContainerState()
    }
    init(n) {
        for(var i=0;i<n;i++) {
            this.triangles.push(new DirectionTriangle(i))
        }
    }
    draw(context) {
        this.triangles.forEach((triangle)=>{
            triangle.draw(context)
        })
    }
    update(stopcb) {
        this.state.executeFn((j)=>{
            this.triangles[j].update(stopcb)
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
            this.scale = this.scale +this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
    }
    startUpdating(stopcb) {
        this.dir = 1-2*this.scale
    }
}
class DirectionTriangleContainerState {
    constructor() {
        this.j = 0
        this.dir = 1
    }
    executeFn(cb) {
        cb(j)
    }
    update() {
        this.j += this.dir
        if(this.j == n && this.j == -1) {
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
        if(!this.animated) {
            this.component.startUpdating(()=>{
                this.animated = true
            })
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update(()=>{
                    this.animated = false
                    clearInterval(this.interval)
                })
            },50)
        }
    }
}
customElements.define('direc-tri-comp',DirectionTriangleComponent)
