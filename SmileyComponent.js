const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/2
class SmileyComponent extends HTMLElement {
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
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.prevScale = this.scale
            this.dir = 0
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class Smiley {
    constructor() {
        this.state = new State()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    draw(context) {
        context.fillStyle = '#F9A825'
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.arc(0,0,size/3,0,2*Math.PI)
        context.fill()
        DegArc.draw(context,0,-size/4,0,180,size/8,size/20,0)
        for(var i=0;i<2;i++) {
            const eye_x = (size/8)*(i*2-1), eye_y = -size/5
            DegArc.draw(context,eye_x,eye_y,0,360,size/20,size/20*this.state.scale,1)
        }
        context.restore()
    }
}
class DegArc {
    draw(context,x,y,start,sweep,rx,ry,mode) {
        context.fillStyle = 'black'
        context.strokeStyle = 'black'
        context.lineWidth = r/15
        context.save()
        context.translate(x,y)
        for(var i=start;i<=start+sweep;i++) {
            const x = rx*Math.cos(i*Math.PI/180), y = ry*Math.sin(i*Math.PI/180)
            if(i === start) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        if(mode == 0) {
            context.stroke()
        }
        else {
            context.fill()
        }
        context.restore()
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            })
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
