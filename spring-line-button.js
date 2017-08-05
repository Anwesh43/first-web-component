var w = window.innerWidth,h = window.innerHeight
class SpringLineButton extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        var canvas = document.createElement('canvas')
        canvas.width = w/6
        canvas.height = h/10
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    componentDidMount() {
        this.render()
    }
}
class SpringLine {
    draw(context,w,h,scale) {
        context.save()
        context.translate(w/2,h/2)
        context.fillStyle = '#F57F17'
        context.strokeStyle = context.fillStyle
        context.lineWidth = h/5
        context.beginPath()
        context.arc(0,0,h/2,0,2*Math.PI)
        context.stroke()
        context.save()
        context.scale(scale,scale)
        context.beginPath()
        context.arc(0,0,h,0,2*Math.PI)
        context.fill()
        context.restore()
        for(var i=0;i<2;i++) {
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo((1-2*i)*scale*w/3),0
            context.stroke()
            context.save()
            context.translate((1-2*i)*w/3,0)
            context.arc(0,0,(h/2)*scale,0,2*Math.PI)
            context.fill()
            context.restore()
        }

        context.restore()
    }
}
