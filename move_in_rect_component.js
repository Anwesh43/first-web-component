var w = window.innerWidth,h = window.innerHeight,r = Math.min(w,h)/40,size = Math.min(w,h)/8,color = "#FF9800"
class MoveInRectComponent extends HTMLElement{
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.graph = new InRectMoverGraph(2*r,2*r)
        this.animator = new InRectMoverAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        context.lineCap = "round"
        context.lineWeight = Math.min(w,h)/40
        context.fillStyle = color
        context.strokeStyle = color
        this.graph.draw(context)
        this.graph.update()
        this.img.src = canvas.toDataURL()
    }
    startUpdating() {
        this.graph.startUpdating()
    }
    stopped() {
        return this.graph.stopped()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimating()
        }
    }
}
class InRectMoverGraph {
    constructor(x,y) {
        this.root = new InRectMoverNode(x,y,0)
        this.curr = this.root
        this.deg = 0
    }
    drawNode(context,node) {
        node.draw(context)
        if(node.neighbor) {
            this.drawNode(context,node.neighbor)
        }
    }
    draw(context) {
        this.drawNode(context,this.root)
    }
    update() {
        this.curr.update()
    }
    stopped() {
        const condition =  this.curr.stopped()
        if(condition) {
            this.deg++
            this.deg%=4
        }
        return condition
    }
    startUpdating() {
        const node = new InRectMoverNode(this.curr.x,this.curr.y,this.deg)
        this.curr.neighbor = node
        this.curr = this.curr.neighbor
        this.curr.startUpdating()
        //console.log(node)
    }
}
class InRectMoverNode {
    constructor(x,y,deg) {
        this.x = x
        this.y = y
        this.ox = x
        this.oy = y
        this.deg = deg
        this.state = new InRectMoverNodeState()
    }
    draw(context) {
        //console.log(size)
        const ax = size*Math.cos(this.deg*Math.PI/2),ay = size*Math.sin(this.deg*Math.PI/2)
        //console.log(ax)
        //console.log(ay)
        this.x = this.ox+Math.abs(ax*this.state.scale)
        this.y = this.oy+ay*this.state.scale
        //console.log(this.x)
        //console.log(this.y)
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.restore()
        if(this.neighbor) {
            context.beginPath()
            context.moveTo(this.x,this.y)
            context.lineTo(this.neighbor.x,this.neighbor.y)
            context.stroke()
        }
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    startUpdating() {
        this.state.startUpdating()
    }
}
class InRectMoverNodeState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update() {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = (this.prevScale+1)%2
            this.dir = 0
            this.prevScale = this.scale
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
class InRectMoverAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                if(this.component.stopped()) {
                    //console.log("stopped")
                    clearInterval(interval)
                    this.animated = false
                }
            },50)
        }
    }
}
customElements.define('move-in-rect-comp',MoveInRectComponent)
