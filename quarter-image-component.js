class QuarterImageComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render() {
        const w = this.image.width , h = this.image.height
        const r = Math.min(w,h)/2
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.save()
        context.beginPath()
        context.arc(w/2,h/2,r,0,2*Math.PI)
        context.clip()
        context.drawImage(this.image,0,0)
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
customElements.define('quarter-image',QuarterImageComponent)
