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
        this.animator = new Animator(this)
    }
    render() {
        const w = this.image.width,h = this.image.height
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.drawImage(this.image,0,0,w,h)
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
        this.img.onmousedown = (event) => {
            if(this.filters) {
                for(let filter of this.filters) {
                    if(filter.handleTap(event.offsetX,event.offsetY)) {
                        this.animator.startAnimation(filter)
                        break
                    }
                }
            }
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
        const color = colors[this.index]
        context.save()
        context.fillStyle = color
        context.translate(x_factor*w,y_factor*h)
        context.save()
        context.scale(this.state.scale,this.state.scale)
        context.globalAlpha = 0.55
        context.fillRect(-w*(x_factor),-h*(y_factor),w,h)
        context.restore()
        const offset = (factor,r)=> (1 - 2*factor)*r
        const r = w/20,offset_x = offset(x_factor,r),offset_y = offset(y_factor,r)
        context.save()
        context.translate(offset_x,offset_y)
        context.fillStyle = '#212121'
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.strokeStyle = 'white'
        context.lineWidth = r/6
        for(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*Math.PI/2+Math.PI/4*this.state.scale)
            context.beginPath()
            context.moveTo(0,-r)
            context.lineTo(0,r)
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
        this.scale += (this.dir * 0.1)
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
        this.dir = 1 - 2*this.scale
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
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('border-wise-image-filter-comp',BorderWiseImageFilterComponent)
