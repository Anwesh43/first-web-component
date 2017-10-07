const w = canvas.width,h = canvas.height,size = Math.min(w,h)/2
class FourDirectionButtonScalerComponent extends HTMLElement{
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
class DirectionButtonScaler {
    constructor(i) {
        this.x = w/2
        this.y = h/2
        this.r = size/15
        this.maxH = size/3
        this.x += (this.maxH+this.r)*(Math.cos(i*Math.PI/2))
        this.y += (this.maxH+this.r)*(Math.sin(i*Math.PI/2))
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        this.drawArc(context)
        context.fillRect(-this.r,this.r,2*this.r,this.maxH)
        context.restore()
    }
    drawArc(context) {
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<360;i+=5) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    update() {

    }
    stopped() {
        return false
    }
}
class DirectionButtonScalerState {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += 4.5
        if(this.deg > 180) {
            this.deg = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
