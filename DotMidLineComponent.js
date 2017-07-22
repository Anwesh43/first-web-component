const w = window.innerWidth,h = window.innerHeight
class DotMidLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {

    }
    connectedCallback(){
        this.render()
    }
}
class DotMidLine {
    draw(context,x,y,size,scale) {
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(x,y)
            context.scale(2*i-1,1)
            context.lineWidth = size/60
            this.drawCircle(4*size/5,0,size/5,1)
            context.stroke()
            this.drawCircle(4*size/5,0,size/5,scale)
            context.fill()
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo((3*size/5)*scale,0)
            context.stroke()
            context.restore()
        }
    }
    drawCircle(x,y,r,scale) {
        context.beginPath()
        context.arc(x,y,r*scale,0,2*Math.PI)
    }
}
