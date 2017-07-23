class ScaleUpImageComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.src = this.getAttribute('src')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.onload = () => {
            this.render()
        }
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return dir == 0
    }
    update() {
        this.scale += 0.2*dir
        if(this.scale > 1 || this.scale < 0) {
            this.dir = 0
            if(this.scale > 1) {
                this.scale = 1
            }
            else {
                this.scale = 0
            }
        }
    }
}
