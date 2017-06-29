const w = window.innerWidth,h = window.innerHeight
class PieImageCompoent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = ((this.image.height)/this.image.width)*(w/3)
        const context = canvas.getContext('2d')
        context.save()
        context.beginPath()
        context.arc(canvas.width/2,canvas.height/2,Math.min(canvas.width,canvas.height)/2,0,2*Math.PI)
        context.clip()
        context.drawImage(this.image,0,0,canvas.width,canvas.height)
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
