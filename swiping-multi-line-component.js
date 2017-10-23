const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class SwipingMultiLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.n = this.getAttribute('n')||4
        this.img = document.createElement('img')
        this.line = new SwipingMultiLine()
        this.animator = new Animator()
        shadow.appendChild(this.img)
    }
    render(stopcb) {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.lineWidth = size/50
        context.lineCap = 'round'
        this.line.draw(context,this.n)
        this.line.update()
        if(this.line.stopped()) {
            stopcb()
        }
        this.img.src = canvas.toDataURL()
    }
    startUpdating() {
        this.ball.startUpdating()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.animator.startAnimation()
        }
    }
}
class SwipingMultiLine {
    constructor() {
        this.state = new SwipingMultiLineState()
    }
    draw(context,n) {
        const deg = (2*Math.PI)/n
        for(var i=0;i<n;i++) {
            context.save()
            context.translate(size/2,size/2)
            context.rotate(deg*i*this.state.scale)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(size/3,0)
            context.stroke()
            context.beginPath()
            context.arc(size/3+size/10,0,size/10,0,2*Math.PI)
            context.fill()
            context.restore()
        }
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
class SwipingMultiLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += 0.1*dir
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render(()=>{
                    this.animated = false
                    clearInterval(interval)
                })
            },100)
        }
    }
}
customElements.define('swiping-multi-line',SwipingMultiLineComponent)
