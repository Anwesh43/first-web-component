class BorderedImageComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(img)
        this.src = this.getAttribute('src')
        this.color = this.getAttribute('color') || 'red'
    }
    update() {
        this.borderedImage.update()
    }
    startUpdating() {
        this.borderedImage.startUpdating()
    }
    stopped() {
        return this.borderedImage.stopped()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width*1.1
        canvas.height = this.image.height*1.1
        const context = canvas.getContext('2d')
        this.borderedImage.draw(context,cavas.width/2,canvas.height/2,this.color)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = ()=>{
            this.borderedImage = new BorderedImage(this.image)
            this.render()
        }
    }
}
class BorderedImage {
    constructor(image) {
        this.image = image
        this.scale = 0
        this.dir = 0
    }
    draw(context,x,y,color) {
        const imw = this.image.width,imw = this.image.height
        context.strokeStyle = color
        context.lineWidth = Math.min(imw,imh)/50
        context.drawImage(image,x-imw/2,y-imh/2)
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(x,y)
            context.rotate(i*180)
            for(var j=0;j<2;j++) {
                context.save()
                context.beginPath()
                context.moveTo(imw/2,0)
                context.lineTo(imw/2,imh/2*this.scale*j)
                context.stroke()
                context.restore()
                context.save()
                context.beginPath()
                context.moveTo(0,imh/2)
                context.lineTo(imw/2*this.scale*j,imh/2)
                context.stroke()
                context.restore()
            }
            context.restore()
        }
    }
    update() {
        this.scale += this.dir*0.2
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
        if(this.scale == 0) {
            this.dir = 1
        }
        else {
            this.dir = -1
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class AnimationHandler {
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
customElements.define('bordered-image-comp',BorderedImageComponent)
