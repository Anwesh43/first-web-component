const size = Math.min(window.innerWidth,window.innerHeight)/3
class MultiArcFillButtonComponent extends HTMLElement {
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
class MultiArcFillButton {
    constructor() {
        this.x = size/2
        this.y = size/2
        this.r = size/6
    }
    draw(context) {
        const colors = ["#00BCD4","#303F9F","#512DA8","#AD1457","#004D40","#DD2C00"]
        const deg = (360/colors.length)
        context.save()
        context.translate(this.x,this.y)
        context.strokeStyle = 'white'
        context.lineWidth = this.r/6
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        colors.forEach((color,index)=>{
            const midDeg = deg*index+ deg/2,start = midDeg - deg/2 ,end = midDeg + deg/2
            context.fillStyle = color
            context.beginPath()
            context.moveTo(0,0)
            for(var i=start;i<=end;i+=deg/10) {
                const ox = this.r*Math.cos(i*Math.PI/180),oy = this.r*Math.sin(i*Math.PI/180)
                context.lineTo(ox,oy)
            }
            context.fill()
        })
        context.restore()
    }
    handleTap(x,y) {
        return x>= this.x - this.r && x<=this.x + this.r && y>=this.y - this.r && y<=this.y + this.r
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {
        return false
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale = this.dir * 0.1
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1 - 2*this.scale
    }
}
