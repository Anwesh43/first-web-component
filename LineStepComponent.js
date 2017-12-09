const size = Math.min(window.innerWidth,window.innerHeight)/3
class LineStepView extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.lineWidth = size/30
        context.lineCap = 'round'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class LineStep {
    draw(context,scale) {
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
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
    }
    draw(context) {
        this.lineStep.draw(context)
    }
    startUpdating(startcb) {

    }
    update(stopcb) {

    }
}
