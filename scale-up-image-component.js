class ScaleUpImageComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render(scale) {
        const canvas = document.createElement('canvas')
        const imw = this.image.width,imh = this.image.height
        canvas.width = imw
        canvas.height = imh
        if(!this.scaleUpImage) {
            this.scaleUpImage = new ScaleUpImage()
        }
        const context = canvas.getContext('2d')
        this.scaleUpImage.draw(context,this.image,imw,imh,scale)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.onload = () => {
            this.render(0)
        }
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return dir == 0
    }
    update() {
        this.scale += 0.2*dir
        if(this.scale > 1 || this.scale < 0) {
            this.dir = 0
            if(this.scale > 1) {
                this.scale = 1
            }
            else {
                this.scale = 0
            }
        }
    }
}
class AnimationHandler {
    constructor(component) {
        this.animated = false
        this.component = component
        this.stateContainer = new StateContainer()
    }
    startAnimation() {
        if(this.animated == false) {
            this.stateContainer.startUpdating()
            const interval = setInterval(()=>{
                this.component.render(this.stateContainer.scale)
                this.stateContainer.update()
                if(this.stateContainer.stopped() == true) {
                    this.animated = false
                    clearInterval(interval)
                }
            },75)
        }
    }
}
class ScaleUpImage {
    draw(context,image,w,h,scale) {
        context.save()
        context.beginPath()
        context.rect(0,0,w,h)
        context.clipPath()
        context.save()
        context.translate(w/2,h/2)
        context.scale(1+0.5*scale,1+0.5*scale)
        context.drawImage(image,-image.width/2,-image.height/2)
        context.restore()
        context.globalAlpha = 0.7
        context.fillStyle = 'red'
        context.fillRect(0,0,w,h)
        context.restore()
    }
}
customElements.define('scale-up-image',ScaleUpImageComponent)
