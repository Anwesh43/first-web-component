var w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3,gapDeg = 30
class WifiPieComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.wifiPie = new WifiPie()
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.height = size
        canvas.width = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#0277BD'
        context.strokeStyle = context.fillStyle
        context.lineWidth = size/30
        this.wifiPie.draw(context)
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.wifiPie.update()
    }
    stopped() {
        return this.wifiPie.stopped()
    }
    startUpdating() {
        this.wifiPie.startUpdating()
    }
    connectedCallback() {
        this.render()
        const animator = new WifiPieAnimator(this)
        this.img.onmousedown = (event) => {
            if(this.wifiPie.handleTap(event.offsetX,event.offsetY)) {
                animator.startAnimating()
            }
        }
    }
}
class WifiPie {
    constructor() {
        this.x = size/2
        this.y = 0.9*size
        this.r = 0.08*size
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=Math.floor(360*this.state.scale);i+=10) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
        var radius = 0.02*size
        context.save()
        context.translate(this.x,this.y-0.1*size)
        const midDeg = -90,startDeg = midDeg - gapDeg*this.state.scale,endDeg = midDeg + gapDeg*this.state.scale
        for(var i=1;i<=5;i++) {
            context.beginPath()
            for(var j=startDeg;j<=endDeg;j+=5) {
                const x = radius*Math.cos(j*Math.PI/180),y = radius*Math.sin(j*Math.PI/180)
                if(j == 0) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
            }
            context.stroke()
            radius += 0.12*size
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
    handleTap(x,y) {
        return x>=this.x -this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
    }
}
class State {
    constructor() {
        this.dir = 0
        this.scale = 0
    }
    update() {
        this.scale += 0.2*this.dir
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class WifiPieAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
customElements.define('wifi-pie-comp',WifiPieComponent)
