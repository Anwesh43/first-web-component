const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class CornerImageFilterScalerComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.src = this.getAttribute('src')
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
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
class CornerImageFilterScaler {
    constructor(i) {
        this.i = i
        this.x = (size/3)*Math.cos(i*Math.PI/2)
        this.y = (size/3)*Math.sin(i*Math.PI/2)
    }
    draw(context,image) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.restore()
    }
    drawCircle(context) {
        const r = size/15
        context.moveTo(0,0)
        for(var i=0;i<=360;i+=10) {
            const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    clipImage(context,image) {

    }
}
