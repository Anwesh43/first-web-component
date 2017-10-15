const w = window.innerWidth,h = window.innerHeight, size = Math.min(w,h)/2
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
    handleTap(x,y) {
        return x>=this.x-size/10 && x<=this.x+size/10 && y>=this.y-size/10 && y<=this.y+size/10
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
        this.dir = 1-2*this.state.scale
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
            drawEdge(context,root.next)
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
                stopcb()
            }
        })
    }
    handleTapEdge(x,y,startcb,root) {
        if(root.handleTap(x,y)) {
            this.squares.push(root)
            return
        }
        if(!root.next) {
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
