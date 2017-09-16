const colors = ["#00BCD4","#009688","#f44336","#E65100"]
const x_factors = [0,1,0,1],y_factors = [0,0,1,1]
class BorderWiseImageFilterComponent extends HTMLElement{
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.image = new Image()
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        if(!this.filters) {
            this.filters = colors.map((color,index)=>new BorderWiseImageFilterRect(index))
        }
        this.filters.forEach((filter)=>{
            filter.draw(context,w,h)
        })
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
class BorderWiseImageFilterRect {
    constructor(index) {
        this.index = index
        this.state = new State()
    }
    draw(context,w,h) {
        const x_factor = x_factors[this.index],y_factor = y_factors[this.index]
        context.save()
        context.globalAlpha = 0.55
        context.fillStyle = color
        context.translate(x_factor*w,y_factor*h)
        context.scale(this.state.scale,this.state.scale)
        context.fillRect(-this.w*(x_factor),-this.h*(y_factor),this.w,this.h)
        const offset = (factor,r)=> (1 - 2*factor)*r
        const r = w/10,offset_x = offset(x_factor,r),offset_y = offset(y_factor,r)
        context.save()
        context.translate(offset_x,offset_y)
        for(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*Math.PI/2+Math.PI/4)
            context.beginPath()
            context.moveTo(0,-2*r/3)
            context.lineTo(0,2*r/3)
            context.stroke()
            context.restore()
        }
        context.restore()
        context.restore()
        if(!this.x && !this.y) {
            this.x = x_factor*w + offset_x
            this.y = y_factor*h + offset_y
            this.r = r
        }
    }
    handleTap(x,y) {
        return x >= this.x - this.r && x <= this.x+this.r && y >= this.y - this.r && y <= this.y + this.r
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
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.scale = 1 - 2*this.dir
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation(filter) {
        if(!this.animated) {
            this.animated = true
            filter.startUpdating()
            const interval = setInterval(()=> {
                this.component.render()
                filter.update()
                if(filter.stopped()) {
                    this.animated = false
                }
            },50)
        }
    }
}
