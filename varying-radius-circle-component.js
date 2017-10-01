const lw = canvas.width,lh = canvas.height, size = Math.min(lw,lh)/4
class VaryingRadiusCircleComponent extends HTMLElement {
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
class VaryingRadiusCircle {
    draw(context) {
        context.strokeStyle = '#FF8F00'
        context.lineWidth = size/30
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        var r = size/5,maxR = 2*size/5-r
        for(var i=0;i<=360;i+=60) {
            n = 10
            var deg = 0
            for(var j=i;j<=i+60;j+=60/n) {
                const currR = r+maxR*Math.sin(18*deg*Math.PI/180)
                const x = currR*Math.cos(j*Math.PI/180),y = currR*Math.sin(j*Math.PI/180)
                if(j == 0) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
                deg+=18
            }
        }
        context.stroke()
        context.restore()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
class VaryingRadiusState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
