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

    }
    startUpdating(startcb) {

    }
}
