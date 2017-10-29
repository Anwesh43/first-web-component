var w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const drawCircle = (context,x,y,r) => {
    context.beginPath()
    context.arc(x,y,r,0,2*Math.PI)
    context.fill()
}
class DividingCircleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
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
class DividingCircle {
    constructor() {
        this.state = new DividingCircleState()
    }
    drawLine(context,scale) {
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(scale*(size/6),0)
        context.stroke()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
            this.drawLine(context,this.state.scales[0])
            context.save()
            context.translate(size/6*(this.state.scales[0]),0)
            for(var j=0;j<2;j++) {
                context.save()
                context.rotate(Math.PI/4*(1-2*j))
                this.drawLine(context,this.state.scales[1])
                drawCircle(size/6,0,size/20)
                context.restore()
            }
            context.restore()
            context.restore()
        }
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
}
class DividingCircleState {
    constructor() {
        this.scales = [0,0]
        this.currDir = 0
        this.dir = 0
        this.prev = 0
        this.j = 0
    }
    update() {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j] - this.prev) > 1) {
            this.scales[this.j] = (this.prev+1)%2
            this.j+=this.dir
            if(this.j == this.scales.length) {
                this.dir = 0
                this.currDir *= -1
                this.j += this.currDir
            }
            this.prev = this.scales[this.j]
        }
    }
    startUpdating() {
        this.dir = this.currDir
    }
    stopped() {
        return this.dir == 0
    }
}
