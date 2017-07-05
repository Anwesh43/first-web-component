class ColorFilterWrapperComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        const children = this.children
        this.imgs = []
        for(var i=0;i<children.length;i++) {
            const tag = children[i].tagName
            if(tag && tag == "IMG") {
                this.imgs.push(new ColorFilterImage(children[i]))
                shadow.appendChild(children[i])
            }
        }
    }
    render() {
        this.imgs.forEach((img)=>{
            img.draw(this.getAttribute('color') || 'red')
        })
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHanlder(this)
    }
}
class ColorFilterImage {
    constructor(img) {
        this.img = img
        this.scale = 0
        this.dir = 0

    }
    draw(color) {
        const canvas =  document.createElement('canvas')
        canvas.width = this.img.width
        canvas.height = this.img.height
        const context = canvas.getContext('2d')
        context.drawImage(this.img,0,0)
        context.save()
        context.translate(canvas.width/2,canvas.height/2)
        context.fillStyle = color
        context.globalAlpha = 0.6
        context.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height)
        context.restore()
        this.img,src = canvas.toDataURL()
    }
    update() {
        this.scale += 0.2
        if(this.scale >1) {
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
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
