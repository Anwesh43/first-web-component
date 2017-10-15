const w = window.innerWidth,h = window.innerHeight, size = Math.min(w,h)/2
class EdgesSquareComponent extends HTMLElement {
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
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class EdgeSquare {
    constructor(i) {
        this.i = i
        this.x = size/2 + (-size/3+(size/3)*(i%2))
        this.y = size/2 + (-size/3+(size/3)*Math.floor(i/2))
        if(i < 3) {
            this.next = new EdgeSquare(i+1)
        }
        this.state = new EdgeSquareState()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeRect(-size/10,-size/10,size/5,size/5)
        context.save()
        context.scale(this.state.scale,this.state.scale)
        context.fillRect(-size/10,-size/10,size/5,size/5)
        context.restore()
        context.beginPath()
        context.moveTo(0,0)
        if(this.next) {
            const diffX = this.next.x-this.x,diffy = this.next.y-this.y
            context.lineTo(diffX*this.state.scale,diffY*this.state.scale)
        }
        else {
            context.lineTo((2*size/3)*this.state.scale,0)
        }
        context.stroke()
        context.restore()
    }
    update() {
        this.state.update()
    }
    startUpdating() {
        this.state.startUpdating()
    }
    stopped() {
        return this.state.stopped()
    }
}
class EdgeSquareState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0)  {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.state.scale
    }
    stopped() {
        return this.dir == 0
    }
}
