const w = window.innerWidth,h = window.innerHeight
class RectLoaderComponent extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.height = h/10
        canvas.width = 3*w/5
        const context = canvas.getContext('2d')
        document.body.appendChild(canvas)
    }
}
class RectLoader {
    draw(w,h,color,scale) {
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = w/50
        context.lineCap = 'round'
        context.fillRect(0,0,w*scale,h)
        context.strokeRect(0,0,w,h)
    }
}
