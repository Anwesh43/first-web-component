var w = window.innerWidth,h = window.innerHeight
class SpringLineButton extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render(scale) {
        var canvas = document.createElement('canvas')
        canvas.width = w/6
        canvas.height = h/10
        const context = canvas.getContext('2d')
        if(!this.springLine) {
            this.springLine = new SpringLine()
        }
        this.springLine.draw(context,canvas.width,canvas.height,scale)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render(0)
        this.animHandler = new AnimHandler(this)
        this.img.onmousedown = ()=>{
            this.animHandler.startAnimation()
        }
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
        context.arc(0,0,h/3,0,2*Math.PI)
        context.stroke()
        context.save()
        context.scale(scale,scale)
        context.beginPath()
        context.arc(0,0,h/3,0,2*Math.PI)
        context.fill()
        context.restore()
        for(var i=0;i<2;i++) {
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo((1-2*i)*scale*w/3,0)
            context.stroke()
            context.save()
            context.translate((1-2*i)*w/3,0)
            context.arc(0,0,(h/3)*scale,0,2*Math.PI)
            context.fill()
            context.restore()
        }

        context.restore()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
        this.dir = 0
    }
    update() {
        this.deg += 20
        this.scale = Math.abs(Math.sin(this.deg*Math.PI/180))
        if(this.deg > 180) {
            this.deg = 0
            this.dir = 0
        }
    }
    startUpdating() {
        if(this.dir == 0) {
            this.dir = 1
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class AnimHandler {
    constructor(component) {
        this.animated = false
        this.state = new State()
        this.component = component
    }
    startAnimation() {
        if(this.animated == false) {
            this.animated = true
            this.state.startUpdating()
            const interval = setInterval(()=>{
                this.component.render(this.state.scale)
                this.state.update()
                if(this.state.stopped() == true) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
customElements.define('spring-line-button-component',SpringLineButton)
