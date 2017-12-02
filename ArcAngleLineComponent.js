const size = Math.min(w,h)/3
class ArcAngleLineComponent extends HTMLElement {
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
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ArcAngle {
    constructor(i) {
        this.i = i
    }
    draw(context,size,deg) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(deg*this.i*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=deg;i++) {
            const px = (size/2)+(size/2)*Math.cos(i*Math.PI/180), py = (size/2)*Math.sin(i*Math.PI/180)
            context.lineTo(px,py)
        }
        context.fill()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
