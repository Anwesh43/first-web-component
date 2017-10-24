const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const colors = ["#00838F","#E65100","#6A1B9A","#e53935"]
const attachFunctionalityToContext = (context) => {
    context.fillCircleOnScale = function(x,y,r,scale) {
        context.save()
        context.translate(x,y)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=365*scale;i+=5) {
            context.lineTo(r*Math.cos(i*Math.PI/180),r*Math.sin(i*Math.PI/180))
        }
        context.fill()
        context.restore()
    }
}
class FourColorFilterComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.src  = this.getAttribute('src')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.container = new ColorFilterContainer()
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        attachFunctionalityToContext(context)
        context.drawImage(this.image,size/4,size/4,size/2,size/2)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            this.container.handleTap(x-size/2,y-size/2,this.animator.startAnimation)
        }
    }
}
class ColorFilter {
    constructor(i) {
        this.i = i
        this.color = colors[i]
        this.x = (size/3)*Math.cos(i*Math.PI/2+Math.PI/4)
        this.y = (size/3)*Math.sin(i*Math.PI/2+Math.PI/4)
        console.log(this.x)
        console.log(this.y)
        this.state = new ColorFilterState()
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.save()
        context.translate(this.x,this.y)
        context.fillStyle = this.color
        context.strokeStyle = this.color
        context.lineWidth = size/60
        context.fillCircleOnScale(0,0,size/12,this.state.scale)
        context.save()
        context.globalAlpha = 0.6
        context.scale(this.state.scale,this.state.scale)
        context.fillRect(-this.x-size/4,-this.y-size/4,size/2,size/2)
        context.restore()
        context.restore()
        context.restore()
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
    handleTap(x,y) {
        return x>=this.x-size/12 && x<=this.x+size/12 && y>=this.y-size/12 && y<=this.y+size/12 && this.state.dir == 0
    }
}
class ColorFilterState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir*0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class ColorFilterContainer {
    constructor() {
        this.filters = []
        this.init()
        this.animating = false
    }
    init() {
        for(var i=0;i<4;i++) {
            this.filters.push(new ColorFilter(i))
        }
    }
    draw(context) {
        this.filters.forEach((filter)=>{
            filter.draw(context)
        })
    }
    update(stopcb) {
        if(this.curr) {
            this.curr.update()
        }
        if(this.prev) {
            this.prev.update()
        }
        if((this.curr && this.curr.stopped())) {
            stopcb()
            this.animating = false
            this.prev = this.curr
        }
    }
    handleTap(x,y,startcb) {
        if(!this.animating) {
            const tappedFilters = this.filters.filter((cf)=>cf.handleTap(x,y))
            console.log(tappedFilters)
            if(tappedFilters.length == 1) {
                if(this.prev && this.prev == tappedFilters[0]) {
                    return
                }
                console.log("coming here")
                if(this.prev) {
                    this.prev.startUpdating()
                }
                this.animating = true
                this.curr = tappedFilters[0]
                this.curr.startUpdating()
                console.log(this.curr)
                startcb()
            }
        }

    }
}
class Animator {
    constructor(component) {
        this.component = component
        this.startAnimation = this.startAnimation.bind(this)
    }
    startAnimation() {
        this.interval = setInterval(()=>{
            this.component.render()
            if(this.component.container) {
                this.component.container.update(()=>{
                    clearInterval(this.interval)
                })
            }
        },75)
    }
}
customElements.define('four-color-filter-comp',FourColorFilterComponent)
