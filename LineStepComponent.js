const size = Math.min(window.innerWidth,window.innerHeight)/3
class LineStepView extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.lineWidth = size/30
        context.lineCap = 'round'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
