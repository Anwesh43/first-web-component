const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/3
class RedToGreenBoxComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.redToGreenBox = new RedToGreenBox()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.redToGreenBox.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.animator = new Animator(this)
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
    update() {
        this.redToGreenBox.update()
    }
    startUpdating() {
        this.redToGreenBox.startUpdating()
    }
    stopped() {
        return this.redToGreenBox.stopped()
    }
}
class RedToGreenBox {
    constructor() {
        this.x = w/2
        this.y = h/2
        this.r = size/5
        this.state = new State()
    }
    drawPie(context,a,b) {
        context.beginPath()
        context.moveTo(0,0)
        for(var i=a;i<=b;i++) {
            const x = this.r*Math.cos(i*Math.PI/180), y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.fillStyle = 'red'
        this.drawPie(context,360*(this.state.scale),360)
        context.fillStyle = 'green'
        this.drawPie(context,0,360*(this.state.scale))

        for(var i = 0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.strokeStyle = 'red'
            context.beginPath()
            context.moveTo(-2*w/5,-2*h/5)
            context.lineTo(2*w/5,-2*h/5)
            context.stroke()
            context.strokeStyle = 'blue'
            context.beginPath()
            context.moveTo((-2*w/5)*this.state.scale,-2*h/5)
            context.lineTo((2*w/5)*this.state.scale,-2*h/5)
            context.stroke()
            for(var j=0;j<2;j++) {
                const x1 = (4*w/5)*j,gap = (2*w/5)*(1-2*j)*this.state.scale
                context.beginPath()
                context.moveTo(x1,-2*h/5)
                context.lineTo(x1+gap,-2*h/5)
                context.stroke()
            }
            context.restore()
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
        return this.state.stopped()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
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
        this.dir = 1 - 2*this.scale
    }
    stopped() {
        return dir == 0
    }
}
class Animator  {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
