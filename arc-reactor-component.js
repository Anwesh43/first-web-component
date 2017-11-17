const w = window.innerWidth,h = window.innerHeight
class ArcReactorComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.img.src = canvas.toDataURL()
    }
}
class ArcReactor {
    draw(context) {
        context.fillStyle = '#311B92'
        context.strokeStyle = '#311B92'
        const kr = Math.min(w,h)/2
        context.save()
        context.translate(w/2,h/2)
        context.rotate(Math.PI/2)
        context.lineWidth = kr/10
        context.lineCap = 'round'
        for(var i=0;i<8;i++) {
            context.save()
            context.rotate(i*Math.PI/4)
            this.strokeArc(context,0,0,kr,0,20)
            context.restore()
        }
        this.strokeArc(context,0,0,kr/1.5,0,360)
        context.save()
        context.scale(1,1)
        context.beginPath()
        context.arc(0,0,kr/1.5,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
    }
    strokeArc(context,cx,cy,cr,a,b) {
        context.save()
        context.translate(cx,cy)
        context.beginPath()
        for(var i=a;i<=b;i++) {
            x = cx+Math.cos(i*Math.PI/180)
            y = cy+Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
            context.stroke()
        }
        context.restore()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {
        return false
    }
}
