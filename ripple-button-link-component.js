const maxDimension = Math.max(window.innerWidth,window.innerHeight)
class RippleButtonLinkComponent extends HTMLElement{
    constructor() {
        super()
        this.color = this.getAttribute('color') || 'teal'
        this.text = this.getAttribute('text') || 'test'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.rippleButton = new RippleButton()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) =>{
            const x = event.offsetX, y = event.offsetY
            if(this.rippleButton.handleTap(x,y) == true && this.shouldUpdate() == true) {
                const interval =  setInterval(function () {
                    this.render()
                    this.rippleButton.update()
                    if(this.stopped() == true) {
                        clearInterval(interval)
                        this.render()
                    }
                }, 100);
            }
        }
    }
    render() {
        const fontSize = maxDimension/30
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/, `${fontSize}`)
        const tw = context.measureText(this.text).width
        canvas.width = 2*tw
        canvas.height = fontSize*2
        context = canvas.getContext('2d')
        context.fillStyle = 'gray'
        context.fillRect(0,0,canvas.width,canvas.height)
        context.font = context.font.replace(/\d{2}/, `${fontSize}`)
        this.rippleButton.draw(context,tw,fontSize,canvas.width,canvas.height,this.color)
        context.fillStyle = 'white'
        context.fillText(this.text,tw/2,fontSize)
        this.img.src = canvas.toDataURL()
    }
}
class RippleButton {
    constructor() {
        this.scale = 0
    }
    draw(context,x,y,w,h,color) {
        if(!this.handleTap) {
            this.handleTap = (mx,my) => {
                return mx >= x-w/2 && mx <= x+w/2 && my >= y-h/2 && my <= y+h/2
            }
        }
        context.save()
        context.translate(x,y)
        context.scale(this.scale,this.scale)
        context.fillStyle = color
        context.fillRect(-w/2,-h/2,w,h)
        context.restore()
    }
    shouldUpdate() {
        return this.scale == 0
    }
    stopped() {
        const condition =  this.scale > 1
        if(condition == true) {
            this.scale = 1
        }
        return condition
    }
    update() {
        this.scale += 0.2
    }
}
customElements.define('ripple-button',RippleButtonLinkComponent)
