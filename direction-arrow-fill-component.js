const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class DirectionArrowFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = document.createElement('shadow')
        shadow.appendChild(this.img)
        this.animator = new DirectionFillAnimator(this)
        this.directionFill = new DirectionArrowFill()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#2122121'
        this.directionFill.draw(context)
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
        this.points = [new Point(size/2,size-size/20),new Point(size/3,size-size/20),new Point(size/3,size/3),new Point(size/20,size/3),new Point(size/2,size/20)]
    }
    draw(context) {
        context.beginPath()
        context.rect(0,0,size,size)
        context.clip()
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(size/2,size/2)
            context.scale(1-2*i,1)
            Point.drawPoints(context,this.points)
            context.restore()
        }
    }
    update() {
        this.state.update()
    }
    stopUpdating() {
        return this.state.stopUpdating()
    }
    startUpdating() {
        this.startUpdating()
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
        points.forEach((point,index){
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
            this.scale = 1
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
                component.render()
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
