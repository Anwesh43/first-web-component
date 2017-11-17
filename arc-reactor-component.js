const w = window.innerWidth,h = window.innerHeight
class ArcReactorComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new ArcReactorAnimator(this)
        this.arcReactor = new ArcReactor(this)
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startUpdating()
        }
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
    update() {
        this.arcReactor.update()
    }
    stopped() {
        return this.arcReactor.stopped()
    }
    startUpdating() {
        this.arcReactor.startUpdating()
    }
}
class ArcReactor {
    constructor() {
        this.state = new ArcReactorState()
    }
    draw(context) {
        context.fillStyle = '#311B92'
        context.strokeStyle = '#311B92'
        const kr = Math.min(w,h)/2
        context.save()
        context.translate(w/2,h/2)
        context.rotate(this.state.deg)
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
        context.scale(this.state.scale,this.state.scale)
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
        this.state.update()
    }
    startUpdating() {
        this.state.startUpdating()
    }
    stopped() {
        return false
    }
}
class ArcReactorState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
        this.prevDeg = 0
        this.d = 0
    }
    update() {
        this.d += (3*dir)
        this.scale = Math.sin(this.d*Math.PI/180)
        this.deg = this.prevDeg + (Math.PI/2)*((this.d)/180)
        if(this.scale >= 1) {
            this.scale = 0
            this.dir = 0
            this.d = 0
            this.deg = this.prevDeg + Math.PI/2
            this.prevDeg = this.deg
        }
    }
    startUpdating() {
        this.dir = 1
        this.scale = 0
        this.d = 0
    }
    stopped() {
        return this.dir == 0
    }
}
class ArcReactorAnimator {
    constructor(component){
        this.animated = false
        this.component = component
    }
    startUpdating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    clearInterval(interval)
                }
            },50)
        }
    }
}
