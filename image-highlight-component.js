const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/2
class ImageHighlightComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ImageHighlight {
    constructor() {
        this.image = img
        this.n = 4
        this.w = 0
        this.j = 0
        this.dir = 1
        this.state = new ImageHighlightState()
    }
    draw(context) {
        const gap = this.img.width/this.n
        this.w = gap * this.j + gap
        context.save()
        context.drawImage(this.img,0,0)
        context.restore()
        context.save()
        context.globalAlpha = 0.6
        context.fillStyle = '#212121'
        context.fillRect(this.w,0,this.img.width-this.w,this.img.height)
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class ImageHighlightState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    animate(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
}
