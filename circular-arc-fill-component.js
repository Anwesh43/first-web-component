const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const drawArc = (context,x,y,r,deg) => {
    context.save()
    context.translate(x,y)
    context.beginPath()
    context.moveTo(0,0)
    for(var i=0;i<=deg;i+=2) {
        context.lineTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
    }
    context.fill()
    context.restore()
}
class CircularArcFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class CircularArc {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(x,y)

        context.restore()
    }
}
