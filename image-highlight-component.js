const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/2
class ImageHighlightComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
        this.animator = new Animator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.imageHighlight.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        const r = new Image()
        r.src = this.src
        r.onload = () => {
            this.imageHighlight = new ImageHighlight(r)
            this.render()
        }
        this.img.onmousedown = () => {
            this.imageHighlight.startUpdating(()=>{
                this.animator.start(()=>{
                    this.render()
                    this.imageHighlight.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class ImageHighlight {
    constructor(img) {
        this.img = img
        this.n = 4
        this.w = 0
        this.j = 0
        this.dir = 1
        this.state = new ImageHighlightState()
    }
    draw(context) {
        const gap = (this.img.width)/this.n
        this.w = gap * this.j + gap*this.state.scale
        console.log(this.w)
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
        this.state.update(()=>{
            this.j += this.dir
            if(this.j == this.n || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                this.state.setScale()
            }
            stopcb()
        })
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
            this.dir = 0
            this.scale = this.prevScale
            stopcb()
        }
    }
    setScale() {
        this.scale = (this.scale+1)%2
        this.prevScale = this.scale
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            console.log("start")
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('image-highlight-comp',ImageHighlightComponent)
