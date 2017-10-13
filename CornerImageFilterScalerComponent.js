const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class CornerImageFilterScalerComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.src = this.getAttribute('src')
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
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
class CornerImageFilterScaler {
    constructor(i) {
        this.i = i
        this.x = (size/3)*Math.cos(i*Math.PI/2)
        this.y = (size/3)*Math.sin(i*Math.PI/2)
    }
    draw(context,image) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        this.drawCircle(context)
        this.drawAlphaRect(context)
        context.restore()
    }
    drawCircle(context) {
        const r = size/10
        context.moveTo(0,0)
        for(var i=0;i<=360;i+=10) {
            const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    drawAlphaRect(context) {
        const midx = (this.x)/2,midy = (this.y)/2
        context.save()
        context.translate(midx,midy)
        context.scale(1,1)
        context.fillStyle = '#03A9F4'
        context.globalAlpha = 0.4
        context.fillRect(-size/6,-size/6,size/3,size/3)
        context.restore()
    }
    handleTap(x,y) {
        return x>=this.x - size/10 && x<=this.x+size/10 && y>=this.y-size/10 && y<=this.y+size/10
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.state.scale
    }
    stopped() {
        return this.dir == 0
    }
}
