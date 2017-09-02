class WifiPieComponent extends Component {
    constructor() {

    }
    render() {

    }
    connectedCallback() {

    }
}
class WfiPie {
    constructor(w,h) {
        this.w = w
        this.h = h
        this.x = w/2
        this.y = 0.9*h
        this.r = 0.1*h
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<Math.floor(360*this.scale);i+=10) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        var radius = 0
        for(var i=0;i<Math.floor(5*this.scale);i++) {
            context.save()
            context.translate(this.x,this.y-this.r)
            context.beginPath()
            for(var j=-120;j<=60;j+=5) {
                const x = radius*Math.cos(j*Math.PI/180),y = radius*Math.sin(j*Math.PI/180)
                if(j == -120) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
            }
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update() {
        this.scale += 0.2*this.dir
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
