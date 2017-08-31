const w = window.innerWidth
const n = 4
class ColorPieSquareComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3+canvas.width/4
        const context = canvas.getContext('2d')
        this.colorPieSquareContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.animator = new CPSAnimator(this)
        this.colorPieSquareContainer = new ColorPieSquareContainer(w/3)
        this.render()
        this.cpsAnimator = new CPSAnimator(this)
        this.img.onmousedown = (event) => {
            const colorPieSquare = this.colorPieSquareContainer.handleTap(event.offsetX,event.offsetY)
            if(colorPieSquare) {
                this.cpsAnimator.startAnimation(colorPieSquare)
            }
        }
    }
}
class ColorPie {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
    }
    draw(context,scale) {
        context.fillStyle = '#E65100'
        context.strokeStyle = context.fillStyle
        context.strokeWidth = this.r/10
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        const deg = Math.floor(360*scale)
        console.log(deg)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=Math.floor(360*scale);i+=10) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
    handleTap(x,y) {
        return x>=this.x-this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
    }
}
class ColorSquare {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    draw(context,scale) {
        context.fillStyle = '#3949AB'
        context.save()
        context.translate(this.x+this.w/2,this.y+this.h/2)
        context.scale(scale,scale)
        context.fillRect(-this.w/2,-this.h/2,this.w,this.h)
        context.restore()
    }
}
class ColorPieSquare  {
    constructor(i,w) {
        this.init(i,w)
    }
    init(i,w) {
        this.i = i
        var gap = w/(2*n+1)
        this.colorPie = new ColorPie((2*gap*i)+3*gap/2,w+w/8,gap/2)
        this.colorSquare = new ColorSquare((i%2)*w/2,Math.floor(i/2)*w/2,w/2,w/2)
        this.state = new State()
    }
    draw(context) {
        this.colorPie.draw(context,this.state.scale)
        this.colorSquare.draw(context,this.state.scale)
        console.log("drawn")
    }
    startUpdating() {
        this.state.startUpdating()
    }
    stopped() {
        return this.state.stopped()
    }
    update() {
        console.log("updating")
        this.state.update()
    }
    handleTap(x,y) {
        return this.colorPie.handleTap(x,y)
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
}
class ColorPieSquareContainer {
    constructor(w) {
        this.init(w)
    }
    init(w) {
        this.colorPieSquares = []
        for(var i=0;i<4;i++) {
            this.colorPieSquares.push(new ColorPieSquare(i,w))
        }
    }
    draw(context) {
        this.colorPieSquares.forEach((colorPieSquare)=>{
            colorPieSquare.draw(context)
        })
    }
    handleTap(x,y) {
        const tappedColorPies = this.colorPieSquares.filter((colorPieSquare)=>colorPieSquare.handleTap(x,y))
        console.log(tappedColorPies)
        if(tappedColorPies.length == 1) {
            return tappedColorPies[0]
        }
    }
}
class CPSAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
        this.tappedSquares = []
    }
    startAnimation(colorPieSquare) {
        colorPieSquare.startUpdating()
        this.tappedSquares.push(colorPieSquare)

        if(!this.animated) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.tappedSquares.forEach((tappedSquare,i)=>{
                    tappedSquare.update()
                    if(tappedSquare.stopped()) {
                        this.tappedSquares.splice(i,1)
                        if(this.tappedSquares.size == 0) {
                            clearInterval(interval)
                            this.animated = false
                        }
                    }
                })
            },50)
        }
    }
}
customElements.define('color-pie-square-comp',ColorPieSquareComponent)
