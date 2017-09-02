var w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class WifiPieComponent extends Component {
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
        this.img.onmousedown = (event) => {
            if(this.wifiPie.handleTap(event.offsetY,event.offsetY)) {
                this.wifiPie.startUpdating()
            }
        }
    }
}
class WifiPie {
    constructor() {
        this.x = size/2
        this.y = 0.9*size
        this.r = 0.1*size
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context,beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<Math.floor(360*this.scale);i+=10) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        var radius = 0
        for(var i=0;i<Math.floor(5*this.scale);i++) {
            context.save()
            context.translate(this.x,this.y-this.r)
            context.beginPath()
            for(var j=-120;j<=60;j+=5) {
                const x = radius*Math.cos(j*Math.PI/180),y = radius*Math.sin(j*Math.PI/180)
                if(j == -120) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
                radius += 0.12*h
            }
            context.stroke()
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
    handleTap(x,y) {
        return this.x>=x -this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
    }
}
class State {
    constructor() {
        this.dir = 0
        this.state = 0
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
