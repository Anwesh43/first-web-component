const w = window.innerWidth,h = window.innerHeight
class CircleArrangedBallComponent extrnds HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class CircleArrangedBall {
    constructor(n,w,h) {
        this.n = n
        this.w = w
        this.h = h
        this.initBalls()
    }
    initBalls() {
        this.balls = []
        for(var i=0;i<this.n;i++) {
            this.balls.push(new Ball(this.w/2,this.h/2,Math.min(this.w,this.h)/3))
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
            }
        })
    }
}
class Ball {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1
    }
    update() {
        this.scale += 0.2*this.dir
    }
    stopped() {
        return dir == 0
    }
    draw(context) {
        context.fillStyle = "#f44336"
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    handleTap(x,y) {
        return x>=this.x-this.r && x<=this.x+r && y>=this.y -r && y<=this.y+this.r
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
