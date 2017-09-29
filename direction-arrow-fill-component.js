const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
class DirectionArrowFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = document.createElement('shadow')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#2122121'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
