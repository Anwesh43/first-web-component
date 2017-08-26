class ClickableColorFilterImageComponent extends HTMLElement {
    constructor() {
        super()
        this.src = this.getAttribute('src')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.color = this.getAttribute('color') || '#00838F'
        this.image = new Image()
        this.state = new State()
        this.animationHandler = new AnimationHandler(this)
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    render() {
        var w = this.image.width,h = this.image.height
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        ClickableColorFilterImage.draw(context,this.image,this.color,w,h,this.state.scale)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image.src = this.src
        this.image.onload = ()=>{
            this.render()
        }
        this.img.onclick = ()=>{
            this.animationHandler.startAnimation()
        }
    }
}
class ClickableColorFilterImage {
    static draw(context,image,color,w,h,scale) {
        context.globalAlpha = 1
        context.save()
        context.translate(w/2,h/2)
        context.beginPath()
        context.arc(0,0,Math.min(w,h)/2,0,2*Math.PI)
        context.clip()
        context.drawImage(image,-w/2,-h/2)
        context.globalAlpha = 0.7
        context.fillStyle = color
        context.save()
        context.scale(scale,scale)
        context.beginPath()
        context.arc(0,0,Math.min(w,h)/2,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg += 3
        this.scale = Math.abs(Math.sin(this.deg*Math.PI/180))
        if(this.deg > 180) {
            this.deg = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    clearInterval(interval)
                    this.animated = false
                }
            },30)
        }
    }
}
customElements.define('clickable-color-filter-image',ClickableColorFilterImageComponent)
