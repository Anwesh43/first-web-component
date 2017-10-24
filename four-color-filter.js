const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const colors = ["#00838F","#E65100","#6A1B9A","#e53935"]
const attachFunctionalityToContext = (context) => {
    context.fillCircleOnScale = function(x,y,r,scale) {
        context.save()
        context.save(x,y)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=360*scale;i+=5) {
            context.lineTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
        }
        context.fill()
        context.restore()
    }
}
class FourColorFilterComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.src  = this.getAttribute('src')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        attachFunctionalityToContext(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
class ColorFilter {
    constructor(i) {
        this.i = i
        this.color = colors[i]
        this.x = (size/3)*Math.cos(i*Math.PI/2+Math.PI/4)
        this.y = (size/3)*Math.sin(i*Math.PI/2+Math.PI/4)
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.fillCircleOnScale(0,0,size/12,1)
        context.fillRect(-this.x,-this.y,size/3,size/3)
        context.restore()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
