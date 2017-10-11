const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class WifiToCircleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new Animator(this)
        this.wifiToCircle = new WifiToCircle()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.wifiToCircle.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
}
class WifiToCircle {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        context.strokeStyle = '#FF5722'
        context.save()
        context.translate(size/2,size/2)
        context.lineWidth = size/40
        const r = size/3
        for(var i=0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            for(var j=1;j<=4;j++) {
                const deg = 15+30*this.state.scale
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
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    startUpdating() {
        this.state.startUpdating()
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
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            if(this.component.wifiToCircle) {
                this.component.wifiToCircle.startUpdating()
            }
            const interval = setInterval(()=>{
                this.component.render()
                if(this.component.wifiToCircle) {
                    this.component.wifiToCircle.update()
                    if(this.component.wifiToCircle.stopped()) {
                        this.animated = false
                        clearInterval(interval)
                    }
                }
            },50)
        }
    }
}
customElements.define('wifi-to-circle',WifiToCircleComponent)
