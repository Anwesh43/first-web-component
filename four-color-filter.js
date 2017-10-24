const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
const colors = ["#00838F","#E65100","#6A1B9A","#e53935"]
class FourColorFilterComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.src  = this.getAttribute('src')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
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
