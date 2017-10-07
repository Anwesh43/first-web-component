const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class FourDirectionButtonScalerComponent extends HTMLElement{
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.animator = new Animator(this)
        this.container = new DirectionButtonScalerContainer()
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            this.container.handleTap(x,y,()=>{
                this.animator.startAnimation(this.container)
            })
        }
    }
    render() {
        console.log()
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        const color = this.getAttribute('color') || '#F57C00'
        context.lineWidth = size/60
        context.strokeStyle = color
        context.fillStyle = color
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class DirectionButtonScaler {
    constructor(i) {
        this.r = size/30
        this.maxH = size*0.4
        this.x = (this.maxH+this.r)*(Math.cos(i*Math.PI/2))
        this.y = (this.maxH+this.r)*(Math.sin(i*Math.PI/2))
        this.i = i
        this.state = new DirectionButtonScalerState()
    }
    draw(context) {
        context.save()
        context.translate(this.r+this.maxH,0)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        this.drawArc(context)
        context.fillRect(-this.r,-this.r,-this.maxH*this.state.scale,2*this.r)
        context.restore()
    }
    drawArc(context) {
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=360*this.state.scale;i+=5) {
            const x = this.r*Math.cos(i*Math.PI/180),y = this.r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    handleTap(x,y) {
        const condition =  x>=this.x-this.r && x<=this.x+this.r && y>=this.y-this.r && y<=this.y+this.r
        console.log(`${this.i} tapped:${condition} ${this.x} ${this.y}`)
        return condition
    }
}
class DirectionButtonScalerState {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += 4.5
        if(this.deg > 180) {
            this.deg = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
class DirectionButtonScalerContainer {
    constructor() {
        this.buttons = []
        this.animatedBtns = []
        this.init()
    }
    init() {
        for(var i=0;i<4;i++) {
            this.buttons.push(new DirectionButtonScaler(i))
        }
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        this.buttons.forEach((button,index)=>{
            context.save()
            context.rotate(index*Math.PI/2)
            button.draw(context)
            context.restore()
        })
        context.restore()
    }
    update(stopcb) {
        this.animatedBtns.forEach((btn,index)=>{
            btn.update()
            if(btn.stopped()) {
                this.animatedBtns.splice(index,1)
                if(this.animatedBtns.length == 0) {
                    stopcb()
                }
            }
        })
    }
    handleTap(x,y,startcb) {
        console.log(`main ${x-size/2} ${y-size/2}`)
        this.buttons.forEach((button)=>{
            if(button.handleTap(x-size/2,y-size/2)) {
                this.animatedBtns.push(button)
                startcb()
            }
        })
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation(container) {
        if(!this.animated) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                container.update(()=>{
                    clearInterval(interval)
                    this.animated = false
                    this.component.render()
                })
            },75)
        }
    }
}
customElements.define('four-direc-button',FourDirectionButtonScalerComponent)
