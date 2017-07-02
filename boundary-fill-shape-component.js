const w = window.innerWidth,h = window.innerHeight
class BoundaryFillShapeComponent extends HTMLElement {
    constructor() {
        super()
        this.fillColor = this.getAttribute('color')||'black'
        this.strokeColor = this.getAttribute('color') || 'blue'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/10
        canvas.height = w/10
        const context = canvas.getContext('2d')
        drawShape(context,canvas.width)
        this.animate(getBoundaryPoints(canvas.width))
        this.img.src = canvas.toDataURL()
    }
    drawShape(context,size) {

    }
    animate(boundaryPoints) {

    }
    getBoundaryPoints(size) {
        return []
    }
    stopped() {
        return false
    }
    connectedCallback() {
        this.render()
    }
}
class AnimationHandler {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimating() {
        if(this.animated == false) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
            },50)
        }
    }
}
