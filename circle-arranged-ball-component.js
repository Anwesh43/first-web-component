const w = window.innerWidth,h = window.innerHeight

class CircleArrangedBallComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.n = this.getAttribute('n')||6
        shadow.appendChild(this.img)
    }
    removeBall(curr_ball) {
        if(this.cab) {
            this.cab.balls = this.cab.balls.filter((ball)=>ball.i != curr_ball.i)
            console.log(this.cab.balls)
        }
    }
    render() {
        const size = w/3
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        if(!this.cab) {
            this.cab = new CircleArrangedBall(this.n,size,size,this.animController)
        }
        this.cab.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.animController = new AnimController(this)
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            if(this.cab) {
                this.cab.handleTap(x,y)
            }
        }
    }
}
class CircleArrangedBall {
    constructor(n,w,h,controller) {
        this.n = n
        this.w = w
        this.h = h
        this.controller = controller
        this.initBalls()
    }
    initBalls() {
        this.balls = []
        var r = Math.min(this.w,this.h)
        var deg = (2*Math.PI)/this.n
        for(var i=0;i<this.n;i++) {
            this.balls.push(new Ball(this.w/2,this.h/2,r/6,2*r/3,deg*i,r/20,i))
        }
    }
    draw(context) {
        var r = Math.min(w,h)/3
        this.balls.forEach((ball)=>{
            ball.draw(context)
        })
    }
    handleTap(x,y) {
        this.balls.forEach((ball)=>{
            if(ball.handleTap(x,y)) {
                ball.startUpdating()
                this.controller.startAnimation(ball)
            }
        })
    }
}
class Ball {
    constructor(cx,cy,r,rmax,deg,size,i) {
        this.cx = cx
        this.cy = cy
        this.deg = deg
        this.rmax = rmax
        this.r = r
        this.rinit = this.r
        this.size = size
        this.scale = 0
        this.rmax = rmax
        this.dir = 0
        this.updateXY()
        this.i = i
    }
    updateXY() {
        this.x = this.cx+this.r*Math.cos(this.deg)
        this.y = this.cy+this.r*Math.sin(this.deg)
    }
    startUpdating() {
        this.dir = 1
    }
    update() {
        this.scale += 0.2*this.dir
        this.r = this.rinit+(this.rmax-this.rinit)*this.scale
        this.updateXY()
        if(this.scale > 1) {
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    draw(context) {
        context.fillStyle = "#f44336"
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.size/2,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    handleTap(x,y) {
        return x>=this.x-this.size/2 && x<=this.x+this.size/2 && y>=this.y -this.size/2 && y<=this.y+this.size/2
    }
}
class AnimController {
    constructor(component) {
        this.component = component
        this.animated = false
        this.tappedBalls = []
    }
    startAnimation(ball) {
        this.tappedBalls.push(ball)
        if(this.tappedBalls.length == 1) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.tappedBalls.forEach((tappedBall,index)=>{
                    tappedBall.update()
                    if(tappedBall.stopped()) {
                        this.tappedBalls.splice(index,1)
                        this.component.removeBall(tappedBall)
                        if(this.tappedBalls.length == 0) {
                            clearInterval(interval)
                            this.animated = false
                        }
                    }
                })
            },50)
        }
    }
}
customElements.define('circle-arrange-ball',CircleArrangedBallComponent)
