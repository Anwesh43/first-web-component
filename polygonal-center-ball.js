const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)*0.4
const attachCustomFunctionality = (context) {
    context.fillCircle = function(x,y,r) {
        context.beginPath()
        context.arc(x,y,r,0,2*Math.PI)
        context.fill()
    }
}
class PolygonalCenterBallComponent extends HTMLElement {
    constructor() {
        super()
        this.n = this.getAttribute('n')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.ball = new PolygonalCenterBall()
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        attachCustomFunctionality(context)
        this.ball.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = ()=>{
            this.animator.startAnimation()
        }
    }
}
class PolygonalCenterBall {
    constructor() {
        this.state = new State()
    }
    draw(context,n) {
        context.save()
        context.translate(size/2,size/2)
        this.drawBalls(context,n)
        context.restore()
    }
    drawBalls(context,n) {
        const r = (size/3)*this.state.scale
        for(var i=0;i<n;i++) {
            const x = (r)*Math.cos(i*(2*Math.PI/n)),y = (r)*Math.sin(i*(2*Math.PI/n))
            context.fillCircle(x,y,size/20)
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class State {
    constructor() {
        this.deg = 0
        this.scale = 0
    }
    update(stopcb) {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += Math.PI/10
        if(this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            stopcb()
        }
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            const ball = this.component.ball
            this.animated = true

            const interval = setInterval(()=>{
                this.component.render()
                if(ball) {
                    ball.update(()=>{
                        this.animated = false
                        clearInterval(interval)
                    })
                }
            },100)
        }
    }
}
