class CropImageComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.image = new Image()
        this.img.src = this.getAttribute('src')
        this.image.src = this.img.src
        this.img.draggable = 'false'
        this.color = this.getAttribute('color') || '#2196F3'
    }
    render(scale) {
        const canvas = document.createElement('canvas')
        const w = this.img.width,h = this.img.height
        canvas.width = this.img.width
        canvas.height = this.img.height
        const context = canvas.getContext('2d')
        context.save()
        context.fillStyle = this.color
        context.globalAlpha = 0.7
        context.fillRect(0,0,w,h)
        context.restore()
        context.beginPath()
        context.rect(w/2-scale*w/2,h/2-scale*h/2,w*scale,h*(scale))
        context.clip()
        context.drawImage(this.image,0,0)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        var isDown = false
        var points = []
        var started = false
        this.img.onmousedown = ()=>{
            if(!started) {
            started = true
            var dir = 1,scale = 1
            const interval = setInterval(()=>{
                this.render(scale)
                scale -= 0.2*dir
                if(scale < 0) {
                    dir = -1
                }
                if(scale > 1) {
                    scale  = 1
                    dir = 0
                    started = false
                    clearInterval(interval)
                }
            },40)
          }
        }
    }
}
customElements.define('crop-image',CropImageComponent)
