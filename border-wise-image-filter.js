class BorderWiseImageFilterComponent extends HTMLElement{
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.image = new Image()
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image.src = this.src
        this.image.onload = () => {
            this.render()
        }
    }
}
