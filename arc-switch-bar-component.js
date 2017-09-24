const w = window.innerWidth,h = window.innerHeight
const color = "#FFC107"
class ArcSwitchBarComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(w,h)/2
        canvas.height = Math.min(w,h)/2
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ArcSwitchBar {
    constructor(i,w,h) {
        this.index
        this.x = w/10 + (this.w*9/10)*i
        this.y = h*0.95
        this.oy = this.y
        this.cx = w/2
        this.cy = h/2
        this.r = Math.min(w,h)/20
        this.cr = Math.min(w,h)/5
        this.maxH = 0.9*h
        this.state = new State()
    }
    draw(context) {
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = this.r/6
        this.y = this.oy - this.maxH*this.state.scale
        const deg = this.index*180
        context.save()
        context.translate(this.cx,this.cy)
        context.beginPath()
        for(var i=deg;i<deg+180*this.state.scale;i+=5) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            if(i == deg) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
        context.beginPath()
        context.arc(this.x,this.y,this.r,0,2*Math.PI)
        context.fill()
        context.beginPath()
        context.moveTo(this.x,this.y)
        context.lineTo(this.x,this.oy)
        context.stroke()
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
        return x>=this.x-this.r && x<=this.x+this.r && y>=this.y - this.r && y<=this.y+this.r && this.state.dir == 0
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir*0.1
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
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class ArcSwithBarAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
        this.switchBars = []
    }
    startAnimation(arcSwitchBar) {
        arcSwitchBar.startUpdating()
        if(!this.animated) {
            this.animated = true
            this.switchBars.push(arcSwitchBar)
            const interval = setInterval(()=>{
                this.component.render()
                this.switchBars.forEach((switchBar,index)=>{
                    switchBar.update()
                    if(switchBar.stopped()) {
                        this.animated = false
                        this.switchBars.splice(index,1)
                        if(this.switchBars.length == 0) {
                            this.animated = false
                            clearInterval(interval)
                        }
                    }
                })
            },50)
        }
        else {
            this.switchBars.push(arcSwitchBar)
        }
    }
}
