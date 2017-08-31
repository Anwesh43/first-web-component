const w = window.innerWidth
class ColorPieSquareComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement(img)
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ColorPie {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
    }
    draw(context,scale) {
        context.fillStyle = '#E65100'
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<Math.floor(360*this.scale);i+=10) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
    handleTap(x,y) {
        return x>=this.x-this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
    }
}
