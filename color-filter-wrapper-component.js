class ColorFilterWrapperComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        const children = this.children
        this.imgs = []
        for(var i=0;i<children.length;i++) {
            const tag = children[i].tagName
            if(tag && tag == "IMG") {
                this.imgs.push(new ColorFilterImage(children[i],(this.getAttribute('color') || 'red')))
                shadow.appendChild(children[i])
            }
        }
    }
    render() {
        this.imgs.forEach((img)=>{
            img.draw()
        })
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHandler(this)
        this.imgs.forEach((img)=>{
            img.handleTap(()=>{
                this.animationHandler.startAnimation(img)
            })
        })
    }
}
class ColorFilterImage {
    constructor(img,color) {
        this.img = img
        this.scale = 0
        this.dir = 0
        this.color = color
        this.image = new Image()
        this.image.src = this.img.src
        this.image.onload = () => {
            this.imgLoaded = true
            this.draw()
        }
    }
    draw() {
        if(this.imgLoaded) {
            const canvas =  document.createElement('canvas')
            canvas.width = this.img.width
            canvas.height = this.img.height
            const context = canvas.getContext('2d')
            context.drawImage(this.image,0,0)
            context.save()
            context.translate(canvas.width/2,canvas.height/2)
            context.scale(this.scale,this.scale)
            context.fillStyle = this.color
            context.globalAlpha = 0.6
            context.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height)
            context.restore()
            this.img.src = canvas.toDataURL()
        }

    }
    update() {
        this.scale += 0.2 * this.dir
        if(this.scale >1) {
            this.scale = 1
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    handleTap(cb) {
        this.img.onmousedown = ()=> {
            if(this.scale == 0 && this.dir == 0) {
                this.dir = 1
                cb()
            }
        }
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
        this.images = []
        this.animated = false
    }
    startAnimation(image) {
        this.images.push(image)
        if(this.animated == false) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.images.forEach((image,index)=>{
                    image.update()
                    if(image.stopped() == true) {
                        this.images.splice(index,1)
                        if(this.images.length == 0) {
                            this.animated = false
                        }
                    }
                })
            },50)
        }
    }
}
customElements.define('color-filter-wrapper',ColorFilterWrapperComponent)
