const w = window.innerWidth, h = window.innerHeight
class HalfArcCircleComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new HalfArcCircleAnimator(this)
        this.halfArcCircle = new HalfArcCircle()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.halfArcCircle.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            this.halfArcCircle.startUpdating(()=>{
                this.animator.start(()=>{
                    this.halfArcCircle.update(()=>{
                        this.animator.stop()
                    })
                    this.render()
                })
            })
        }
    }
}
class HalfArcCircle {
    constructor() {
        this.x = w/2
        this.y = h/2
        this.r = Math.min(w,h)/3
        this.state = new HalfArcCircleState()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1,1-2*i)
            this.drawArc(context,this.r*(1-2*i)*this.state.scale)
            context.restore()
        }
        context.restore()
    }
    drawArc(context,px) {
        context.beginPath()
        for(var i=0;i<=180;i++) {
            const x = px+this.r*Math.cos(i*Math.PI/180), y = this.r*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.strokeStyle = '#FF9800'
        context.stroke()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class HalfArcCircleState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.scale
            startcb()
        }
    }
}
class HalfArcCircleAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('half-arc-circle-comp',HalfArcCircleComponent)
