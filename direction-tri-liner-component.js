const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class DirectionTriLinerComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new DirectionTriLinerAnimator(this)
        this.dtl = new DirectionTriLiner()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.dtl.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
}
class DirectionTriLiner {
    constructor(j) {
        this.j = 0
        this.state = new State()
    }
    draw(context) {
        context.lineWidth = size/50
        context.lineCap = 'round'
        context.fillStyle = '#FF5722'
        context.strokeStyle = '#FF5722'
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.rotate(-Math.PI/2+this.j*Math.PI/2+(Math.PI/2)*this.state.scale)
        context.beginPath()
        context.moveTo(-size/15,size/15)
        context.lineTo(size/15,0)
        context.lineTo(-size/15,-size/15)
        context.fill()
        context.restore()
        for(var i=0;i<this.j;i++) {
            this.drawLine(context,i,1)
        }
        this.drawLine(context,this.j,this.state.scale)
        context.restore()
    }
    drawLine(context,index,scale) {
        context.save()
        context.rotate((Math.PI/2)*index)
        context.beginPath()
        context.moveTo(size/3-(size/3)*scale,0)
        context.lineTo((size/3),0)
        context.stroke()
        context.restore()
    }
    stopped() {
        const condition =  this.state.stopped()
        if(condition) {
            this.j+=this.state.currDir
            if(this.j == 4 || this.j == -1) {
                this.state.changeDir()
                this.j += this.state.currDir
            }
        }
        return condition
    }
    update() {
        this.state.update()
    }
    startUpdating() {
        console.log(this.j)
        this.state.startUpdating()
    }
}
class State {
    constructor(scale,dir) {
        this.scale = 0
        this.currDir = 1
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1 && this.dir == 1) {
            this.scale = 0
            this.dir = 0
        }
        else if(this.dir == -1 && this.scale < 0) {
            this.scale = 1
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = this.currDir
    }
    changeDir() {
        this.scale += this.currDir
        this.currDir *= -1
    }
}
class DirectionTriLinerAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.dtl.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.dtl.update()
                if(this.component.dtl.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
customElements.define('direc-tri-liner',DirectionTriLinerComponent)
