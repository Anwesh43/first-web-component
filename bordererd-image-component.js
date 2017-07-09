class BorderedImageComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(img)
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width*1.1
        canvas.height = this.image.height*1.1
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = ()=>{
            this.render()
        }
    }
}
