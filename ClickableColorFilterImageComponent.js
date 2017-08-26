class ClickableColorFilterImageComponent extends HTMLElement {
    constructor() {
        super()
        this.src = this.getAttribute('src')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.color = this.getAttribute('color') || '#00838F'
        this.image = new Image()
    }
    render() {
        var w = this.image.width,h = this.image.height
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image.src = this.src
        this.image.onload = ()=>{
            this.render()
        }
    }
}
