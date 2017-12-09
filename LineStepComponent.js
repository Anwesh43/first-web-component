const size = Math.min(window.innerWidth,window.innerHeight)/3
class LineStepView extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.container = new LineStepContainer()
        this.animator = new LineStepAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        context.lineWidth = size/30
        context.lineCap = 'round'
        context.strokeStyle = '#283593'
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = () => {
            this.animator.startUpdating()
        }
    }
    update(stopcb) {
        this.container.update(stopcb)
    }
    startUpdating(startcb) {
        this.container.startUpdating(startcb)
    }
}
class LineStep {
    draw(context,scale) {
        for(var i=0;i<2;i++) {
            const factor = 1-2*i
            context.save()
            context.scale(factor,factor)
            this.drawStepLine(context,scale)
            context.restore()
        }
    }
    drawStepLine(context,scale) {
        const py = (-size/3)*scale
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,py)
        context.stroke()
        context.beginPath()
        context.moveTo(0,py)
        context.lineTo(-size/3,py)
        context.stroke()
    }
}
class LineStepContainer{
    constructor() {
        this.lineStep = new LineStep()
        this.state = new LineStepContainerState()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.lineCap = 'round'
        context.fillStyle = context.strokeStyle
        context.beginPath()
        context.arc(0,0,(size/10)*this.state.scale,0,2*Math.PI)
        context.fill()
        this.lineStep.draw(context,this.state.scale)
        context.restore()
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class LineStepContainerState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        this.dir = 1-2*this.scale
        startcb()
    }
}
class LineStepAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startUpdating(startcb) {
        if(!this.animated) {
            this.component.startUpdating(()=>{
                this.animated = true
            })
            console.log("started")
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update(()=>{
                    this.animated = false
                    clearInterval(interval)
                })
            },50)
        }
    }
}
customElements.define('line-step-view',LineStepView)
