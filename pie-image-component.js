const w = window.innerWidth,h = window.innerHeight
class PieImageCompoent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
        this.color = this.getAttribute('color')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = ((this.image.height)/this.image.width)*(w/3)
        const context = canvas.getContext('2d')
        context.save()
        context.beginPath()
        context.arc(canvas.width/2,canvas.height/2,Math.min(canvas.width,canvas.height)/2,0,2*Math.PI)
        context.clip()
        context.drawImage(this.image,0,0,canvas.width,canvas.height)
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            if(!this.pies) {
                this.pies = []
                for(var i=0;i<4;i++) {
                    this.pies.push(new PieImage(i))
                }
            }
            this.animationHandler = new AnimationHandler(this)
            this.render()
        }
        this.img.onmousedown = (event) => {
            this.animationHandler.startAnimation()
        }
    }
}
class PieImage {
    constructor(index) {
        this.index = index
        this.dir = 0
        this.deg = 0
    }
    draw(context,color,r) {
        context.save()
        context.fillStyle = color
        context.globalAlpha = 0.5
        context.beginPath()
        for(var i=0;i<this.deg;i++) {
            const angle = i+this.index*90
            const x = r*Math.cos(angle*Math.PI/180),y = r*Math.sin(angle*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
    }
    update() {
        this.deg = 18*this.dir
        if(this.deg > 90) {
            this.dir = 0
            this.deg = 90
        }
        if(this.deg < 0) {
            this.dir = 0
            this.deg = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating(dir) {
        this.dir = dir
    }
}
class AnimationHandler {
    startAnimation() {
        if(this.animating == false && this.index < this.component.pies.length) {
            this.animating = true
            if(this.prev) {
                this.prev.startUpdating(-1)
            }
            var curr = this.component.pies[this.index]
            const interval = setInterval(()=>{
                if(this.prev) {
                    this.prev.update()
                }
                if(curr) {
                    curr.update()
                    if(curr.stopped() == true) {
                        clearInterval(interval)
                        this.index++
                        this.index %= this.component.pies.length
                        this.animating = false
                        this.prev = curr
                        this.render()
                    }
                }
            },50)
        }
    }
    constructor(component) {
        this.component = component
        this.animating = false
        this.index = 0
    }
}
