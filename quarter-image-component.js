class AnimationHandler {
    constructor(drawingCb) {
        this.isAnimated = false
        this.animatedQuarters = []
        this.drawingCb = drawingCb
    }
    addQuarter(quarter) {
        this.animatedQuarters.push(quarter)
        if(this.animatedQuarters.length == 1) {
            this.isAnimated = true
            this.interval = setInterval(()=>{
                this.animate()
            },100)
        }
    }
    animate() {
        if(this.isAnimated == true) {
            this.drawingCb()
            this.animatedQuarters.forEach((quarter)=>{
                quarter.update()
                if(quarter.stopUpdating() == true) {
                    this.animatedQuarters.splice(0,1)
                    if(this.animatedQuarters.length == 0) {
                        this.isAnimated = false
                        clearInterval(this.interval)
                    }
                }
            })
        }
    }
}
class QuarterImageComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
        this.color = this.getAttribute('color') || 'green'
    }
    render() {
        const w = this.image.width , h = this.image.height
        const r = Math.min(w,h)/2
        if(!this.quarters) {
            this.quarters = []
            const lowerX = [w/2,0,0,w/2],upperX = [w,w/2,w/2,w],lowerY = [h/2,h/2,0,0],upperY = [h,h,h/2,h/2]
            for(var i=0;i<4;i++) {
                this.quarters.push(new Quarter(i,(x,y)=>{
                    console.log(i)
                    const condition =  x>=lowerX[i] && x<=upperX[i] && y>=lowerY[i] && y<=upperY[i]
                    console.log(`${i} ${condition}`)
                    return condition
                }))
            }

        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.save()
        context.beginPath()
        context.arc(w/2,h/2,r,0,2*Math.PI)
        context.clip()
        context.drawImage(this.image,0,0)
        context.restore()
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(w/2,h/2)
            context.rotate(i*Math.PI/2)
            context.strokeStyle = this.color
            context.lineWidth = Math.max(w,h)/80
            context.beginPath()
            context.moveTo(0,-h/2)
            context.lineTo(0,h/2)
            context.stroke()
            context.restore()
        }
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.animationHandler = new AnimationHandler(()=>{this.render})
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            this.quarters.forEach((quarter,index)=>{
                if(quarter.handleTap(x,y) == true) {
                    console.log(index)
                    this.animationHandler.addQuarter(quarter)
                }
            })
        }
        this.image.onload = () => {
            this.render()
        }
    }
}
customElements.define('quarter-image',QuarterImageComponent)
class Quarter  {
    constructor(i,boundsCb) {
        this.deg = 90*i
        this.a = 0
        this.dir = 0
        this.boundsCb = boundsCb
        console.log(this.deg)
    }
    draw(context,x,y,r,color)  {
        console.log(`${this.deg/90} updating`)
        context.save()
        context.fillStyle = color
        context.globalAlpha = 0.5
        context.translate(x,y)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=this.deg;i<=this.deg+this.a;i++) {
            const x = r*Math.cos(i*Math.PI/180), y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
    update() {
        this.a += 18*this.dir
        if(this.a > 90) {
            this.a = 90
            this.dir = 0
        }
        else if(this.a < 0) {
            this.a = 0
            this.dir = 0
        }
    }
    handleTap(x,y) {
        if(this.boundsCb(x,y) == true && this.dir == 0) {
            this.dir = 1
            if(this.a == 90) {
                this.dir = -1
            }
            return true
        }
    }
    stopUpdating() {
        return this.dir == 0
    }
}
class Bound {
    constructor(x1,y1,x2,y2)  {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }
    insideBounds(x,y) {
        return x>=this.x1 && x<=this.x2 && y>=this.y1 && y<=this.y2
    }
}
