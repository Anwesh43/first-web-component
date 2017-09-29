const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class DirectionArrowFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new DirectionFillAnimator(this)
        this.direction  = this.getAttribute('direction')||0
        console.log(this.direction)
        this.directionFill = new DirectionArrowFill()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#2122121'
        context.fillRect(0,0,size,size)
        context.fillStyle = '#009688'
        this.directionFill.draw(context,this.direction)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = ()=>{
            this.animator.startAnimation(this.directionFill)
        }
    }
}
class DirectionArrowFill {
    constructor() {
        this.state = new DirectionFillState()
        this.points = [new Point(size/2,size-size/20),new Point(size/3,size-size/20),new Point(size/3,size/3),new Point(size/10+size/20,size/3),new Point(size/2,size/20)]
    }
    draw(context,direction) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(direction*Math.PI/2)
        context.beginPath()
        context.rect(-size/2,-size/2+size-(size*this.state.scale),size,size*this.state.scale)
        context.clip()
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
            context.save()
            context.translate(-size/2,-size/2)
            Point.drawPoints(context,this.points)
            context.restore()
            context.restore()
        }
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    startUpdating() {
        this.state.startUpdating()
    }
}
class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    static moveTo(context,point) {
        context.moveTo(point.x,point.y)
    }
    static lineTo(context,point) {
        context.lineTo(point.x,point.y)
    }
    static drawPoints(context,points) {
        context.beginPath()
        points.forEach((point,index)=>{
            if(index == 0) {
                Point.moveTo(context,point)
            }
            else {
                Point.lineTo(context,point)
            }
        })
        context.fill()
    }
}
class DirectionFillState {
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
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class DirectionFillAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation(directionFill) {
        if(!this.animated) {
            this.animated = true
            directionFill.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                directionFill.update()
                if(directionFill.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
customElements.define('direction-arrow-fill',DirectionArrowFillComponent)
