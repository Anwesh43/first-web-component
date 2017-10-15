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
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeRect(-size/10,-size/10,size/5,size/5)
        context.save()
        context.scale(1,1)
        context.fillRect(-size/10,-size/10,size/5,size/5)
        context.restore()
        context.restore()
        context.beginPath()
        context.moveTo(this.x,this.y)
        if(this.next) {
            context.lineTo(this.next.x,this.next.y)
        }
        else {
            context.lineTo(this.x+2*size/3,this.y)
        }
        context.stroke()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {
        
    }
}
