const w = window.innerWidth,h = window.innerHeight
class DotMidLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        const wc = w/5
        canvas.width = wc
        canvas.height = wc
        const context = canvas.getContext('2d')
        if(!this.dotMidLine) {
            this.dotMidLine = new DotMidLine()
        }
        this.dotMidLine.draw(context,wc/2,wc/2,wc/2,1)
        this.img.src = canvas.toDataURL()
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
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.2
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
        if(this.dir == 0){
            this.dir = 1-2*this.scale
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class AnimationHandler {
    constructor(component) {
        this.stateContainer = new StateContainer()
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(this.animated == false) {
            this.animated = true
            this.stateContainer.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.stateContainer.update()
                if(this.stateContainer.stopped() == true) {
                    this.animated = true
                    clearInterval(interval)
                }
            },75)
        }
    }
}
