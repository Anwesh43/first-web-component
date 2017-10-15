const w = window.innerWidth,h = window.innerHeight, size = Math.min(w,h)/2
const color = '#6A1B9A'
const dirs = [0,1,3,2]
class EdgesSquareComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new Animator(this)
        this.edgeSquareLinkedList = new EdgeSquareLinkedList()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = size/40
        context.lineCap = 'round'
        this.edgeSquareLinkedList.draw(context)
        this.edgeSquareLinkedList.update(this.animator.stopAnimation)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            this.edgeSquareLinkedList.handleTap(x,y,this.animator.startAnimation)
        }
    }
}
class EdgeSquare {
    constructor(i) {
        this.i = dirs[i]
        this.x = size/2 + (-size/3+(size/3)*(this.i%2))
        this.y = size/2 + (-size/3+(size/3)*Math.floor(this.i/2))
        if(i < 3) {
            this.next = new EdgeSquare(i+1)
        }
        this.state = new EdgeSquareState()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeRect(-size/20,-size/20,size/10,size/10)
        context.save()
        context.scale(this.state.scale,this.state.scale)
        context.fillRect(-size/20,-size/20,size/10,size/10)
        context.restore()
        context.beginPath()
        context.moveTo(0,0)
        if(this.next) {
            const diffX = this.next.x-this.x,diffY = this.next.y-this.y
            context.lineTo(diffX*this.state.scale,diffY*this.state.scale)
        }
        else {
            context.lineTo(0,-(size/3)*this.state.scale)
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
    handleTap(x,y) {
        return x>=this.x-size/20 && x<=this.x+size/20 && y>=this.y-size/20 && y<=this.y+size/20 && this.state.dir == 0
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
    startUpdating(startcb) {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class EdgeSquareLinkedList {
    constructor() {
        this.root = new EdgeSquare(0)
        this.squares = []
    }
    drawEdge(context,root) {
        root.draw(context)
        if(root.next) {
            this.drawEdge(context,root.next)
        }
    }
    draw(context) {
        this.drawEdge(context,this.root)
    }
    update(stopcb) {
        this.squares.forEach((square,i)=>{
            square.update()
            if(square.stopped()) {
                this.squares.splice(i,1)
                if(this.squares.length == 0) {
                    stopcb()
                }
            }
        })
    }
    handleTapEdge(x,y,startcb,root) {
        if(root.handleTap(x,y)) {
            root.startUpdating()
            console.log(root)
            this.squares.push(root)
            if(this.squares.length == 1) {
                startcb()
            }
            return
        }
        if(root.next) {
            this.handleTapEdge(x,y,startcb,root.next)
        }
    }
    handleTap(x,y,startcb) {
        this.handleTapEdge(x,y,startcb,this.root)
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
        this.startAnimation = this.startAnimation.bind(this)
        this.stopAnimation = this.stopAnimation.bind(this)
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                this.component.render()
            },75)
        }
    }
    stopAnimation() {
        this.animated = false
        clearInterval(this.interval)
    }
}
customElements.define('edge-square-compos',EdgesSquareComponent)
