const w = window.innerWidth,h = window.innerHeight
class TextScreenComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class TextScreen {
    constructor(texts,color,queue) {
        this.x = -w
        queue.push((scale)=>{
            this.x = -w + w*scale
        })
        this.initTextContainer(texts,queue)
        queue.push((scale)=>{
            this.x = w*scale
        })
    }
    initTextContainer(texts,queue) {

    }
    draw(context,color) {
        context.fillStyle = color
        context.fillRect(this.x,0,w,h)
    }
}
