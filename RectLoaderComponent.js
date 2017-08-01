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
