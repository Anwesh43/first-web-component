const w = window.innerWidth,h = window.innerWidth,size = Math.min(w,h)/2
class ColorPlateListComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animationHandler = new AnimationHandler(this)
        this.initColors()
    }
    initColors() {
        this.colors = []
        const children = this.children
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            if(child.tagName == "COLOR") {
                this.colors.push(child.innerHTML)
            }
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        if(!this.colorPlates) {
            this.colorPlates = this.colors.map((color)=>new ColorPlate(color))
        }
        this.colorPlates.forEach((colorPlate)=>{
            colorPlate.draw(context)
        })
        this.img.src = canvas.toDataURL()
    }
    update() {
        if(this.colorPlates.length > 0) {
            this.colorPlates[this.colorPlates.length-1].update()
        }
    }
    stopped() {
        const condition = this.colorPlates[this.colorPlates.length-1].stopped()
        if(condition == true) {
            this.colorPlates.splice(this.colorPlates.length-1,1)
        }
        return condition
    }
    startUpdating() {
        if(this.colorPlates.length > 0) {
            this.colorPlates[this.colorPlates.length-1].startUpdating()
        }
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            if(this.colorPlates && this.colorPlates.length > 0) {
                this.animationHandler.startAnimation()
            }
        }
    }
}
class ColorPlate {
    constructor(color) {
        this.color = color
        this.dir = 0
        this.deg = 360
    }
    draw(context) {
        context.fillStyle = this.color
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=this.deg;i+=10) {
            context.lineTo((size/4)*Math.cos(i*Math.PI/180),(size/4)*Math.sin(i*Math.PI/180))
        }
        context.fill()
        context.restore()
    }
    update() {
        this.deg -= this.dir*20
        if(this.deg < 0) {
            this.deg = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        this.dir = 1
    }
}
class AnimationHandler {
    constructor(component) {
        this.animated = false
        this.component = component
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
customElements.define('color-plate-list',ColorPlateListComponent)
