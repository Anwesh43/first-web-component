const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
const color = '#FF8F00'
class BarPieArcFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
class BarPieArcFill {
    constructor() {
        this.state = new BarPieArcFillState()
    }
    draw(context) {
        context.strokeStyle = color
        context.fillStyle = color
        context.lineWidth = size/15
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.arc(0,0,size/12,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        for(var i=0;i<=360;i+=10) {
            const x = (size/12)*Math.cos(i*Math.PI/180),y = (size/12)*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
        const w_rect = size/10
        for(var i=0;i<10;i++) {
            var h_rect = size,y_rect = (size-h_rect)*(i%2)
            context.fillRect(w_rect*i,y_rect,w_rect,h_rect)
        }
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
}
class BarPieArcFillState {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg += 4.5
        this.scale = Math.abs(Math.sin(this.deg*Math.PI/180))
        if(this.deg > 180) {
            this.deg = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
