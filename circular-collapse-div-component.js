const w = window.innerWidth,h = window.innerHeight
class CircularCollapseDiv extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.img = document.createElement('img')
        this.color = this.getAttribute('color') || '#3F51B5'
    }
    renderDiv() {
        const canvas = document.createElement('canvas')
        canvas.width = w/5
        canvas.height = w/5
        const context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    renderImg() {
        const canvas = document.createElement('canvas')
        canvas.width = w/15
        canvas.height = w/15
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    render() {
        this.renderImg()
        this.renderDiv()
    }
    update() {

    }
    stopped() {
        return true
    }
    startUpdating() {

    }
    connectedCallback() {
        this.render()
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.updateCbs= []
    }
    update() {
        this.updateCbs.forEach((cb)=>{
            cb(this.scale)
        })
        this.scale += 0.15*this.dir
        if(this.scale > 1) {
            this.dir = 0
        }
        if(this.scale < 0) {
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        if(this.scale <= 0) {
            this.dir = 1
        }
        if(this.scale >= 1) {
            this.dir = -1
        }
    }
}
class CircularColor {
    constructor(color) {
        this.deg = 0
        this.color = this.color
    }
    draw(context,size) {
        context.fillStyle = this.color
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=this.deg;i+=10) {
            const x = (size/2)*(Math.cos(i*Math.PI/180)),y = (size/2)*(Math.sin(i*Math.PI/180))
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
    update(scale) {
        this.deg = 360*scale
    }
}
class Collapser {
    constructor() {
        this.deg = 0
    }
    draw(context,size) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(this.deg*Math.PI/180)
        context.beginPath()
        context.arc(0,0,size/2,0,2*Math.PI)
        context.fill()
        context.strokeStyle = 'black'
        context.lineWidth = 5
        fot(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.beginPath()
            context.moveTo(0,size/3)
            context.lineTo(0,-size/3)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(scale) {
        this.deg = 360*scale
    }
}
class AnimationHandler  {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(this.animated == false) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped() == true) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
