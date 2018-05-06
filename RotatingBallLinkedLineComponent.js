const w = window.innerWidth, h = window.innerHeight, RBLL_NODES = 5
class RotatingBallLinkedLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }

    connectedCallback() {
        this.render()
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.img.src = canvas.toDataURL()
    }

    handleTap() {
        this.img.onmousedown = () => {

        }
    }

}
