const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/5
class TickCircleBoxComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.tickCircleBox = new TickCircleBox()
        this.animator = new TickCircleBoxAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.tickCircleBox.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }

    }
}
class TickCircleBox {
    constructor() {
        this.state = new TickCircleBoxState()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.strokeStyle = 'white'
        context.beginPath()
        context.lineWidth = size/30
        context.lineCap = 'round'
        context.arc(0,0,2*size/5,0,2*Math.PI)
        context.stroke()
        context.strokeStyle = '#1DE9B6'
        context.save()
        context.translate(-size/20,size/10)
        this.drawTickLines(context,size/6,-30*this.state.scale)
        this.drawTickLines(context,size/3,60*this.state.scale)
        context.restore()
        this.drawCircleArc(context,2*size/5)
        context.restore()
    }
    drawTickLines(context,h,rot) {
        context.save()
        context.rotate(rot*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,-h)
        context.stroke()
        context.restore()
    }
    drawCircleArc(context,r) {
        context.beginPath()
        for(var i=0;i<=(360*this.state.scale);i++) {
            const deg = -90 + i
            const x =  r*Math.cos(deg*Math.PI/180),y = r*Math.sin(deg*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.stroke()
    }
    update() {
        this.state.update()
    }
    startUpdating() {
        this.state.startUpdating()
    }
    stopped() {
        return this.state.stopped()
    }
}
class TickCircleBoxState {
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
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class TickCircleBoxAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.tickCircleBox.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.tickCircleBox.update()
                if(this.component.tickCircleBox.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('tick-circle-box',TickCircleBoxComponent)
