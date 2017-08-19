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
    }
    draw(context) {
        var r = Math.min(w,h)/3
        for(var i=0;i<this.n;i++) {

        }
    }
}
class Ball {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
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
