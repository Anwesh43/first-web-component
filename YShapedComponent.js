const size = Math.min(window.innerWidth,window.innerHeight)/2
class YShapedComponent extends HTMLElement {
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
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class YShaped {
    constructor() {

    }
    draw(context) {
        context.strokeStyle = '#FDD835'
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,2*size/5)
        context.stroke()
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(0,0)
            context.rotate(2*Math.PI/3*(i%2-1))
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,size/4)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
