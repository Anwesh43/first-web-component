const size = Math.min(window.innerWidth,window.innerHeight)/3
const n = 5
class DirectionTriangleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class DirectionTriangle {
    constructor(i) {
        this.i = i
    }
    draw(context) {
        var gap = size/n
        const oy = (i%2)*(size+gap/2)
        const diff = size/2 - oy
        context.fillStyle = '#2979FF'
        context.save()
        context.translate(this.i*gap,oy+diff)
        context.rotate((i%2)*Math.PI)
        context.beginPath()
        context.moveTo(-gap/2,gap/2)
        context.lineTo(0,-gap/2)
        context.lineTo(gap/2,gap/2)
        context.fill()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
class DirectionTriangleContainer {
    constructor(n) {
        this.n = n
        this.triangles = []
        this.init(n)
    }
    init(n) {
        for(var i=0;i<n;i++) {
            this.triangles.push(new DirectionTriangle(i))
        }
    }
    draw(context) {

    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
