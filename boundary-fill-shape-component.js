const w = window.innerWidth,h = window.innerHeight
class BoundaryFillShapeComponent extends HTMLElement {
    constructor() {
        super()
        this.fillColor = this.getAttribute('color')||'black'
        this.strokeColor = this.getAttribute('color') || 'blue'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.state.index = 0
        this.state.curr = 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/10
        canvas.height = w/10
        const context = canvas.getContext('2d')
        drawShape(context,canvas.width)
        if(!this.boundaryPoints) {
            this.boundaryPoints = []
            this.
            this.boundaryPoints = getBoundaryPoints(canvas.width)
        }
        this.animate()
        this.img.src = canvas.toDataURL()
    }
    drawShape(context,size) {

    }
    stopped() {
        return this.boundaryPoints && this.boundaryPoints.length == this.state.index
    }
    animate() {
        if(this.boundaryPoints) {
            const currSize = this.boundaryPoints[this.state.index]
            this.state.curr+=currSize/5
            if(this.state.curr > currSize) {
                this.index++
                this.state.index = 0
            }
        }
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
