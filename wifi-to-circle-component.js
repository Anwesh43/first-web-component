const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/4
class WifiToCircleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        const img = document.createElement('img')
        shadow.appendChild(img)
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
class WifiToCircle {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.lineWidth = size/40
        const r = size/3
        for(var i=0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            for(var j=1;j<=4;j++) {
                const deg = 15+30
                this.drawStrokedArc(context,-deg,deg,r/j)
            }
            context.restore()
        }
        context.restore()
    }
    drawStrokedArc(context,start,end,r) {
        context.beginPath()
        for(var i=start;i<=end;i++) {
            const x = r*Math.cos(i*Math.PI/180), y = r*Math.sin(i*Math.PI/180)
            if(i == start) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
            context.stroke()
        }
    }
    update() {

    }
    stopped() {

    }
    startUpdating() {

    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1)  {
            this.scale = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1-2*this.state.scale
    }
}
