const w = window.innerWidth,h = window.innerHeight
class BoundaryFillShapeComponent extends HTMLElement {
    constructor() {
        super()
        this.fillColor = this.getAttribute('color')||'black'
        this.strokeColor = this.getAttribute('color') || 'blue'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.state = {}
        this.state.index = 0
        this.state.curr = 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/10
        canvas.height = w/10
        const context = canvas.getContext('2d')
        this.drawShape(context,canvas.width)
        if(!this.boundaryPoints) {
            this.boundaryPoints = this.getBoundaryPoints(canvas.width)
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
                if(this.component.stopped() == true) {
                    this.animated = false
                }
            },50)
        }
    }
}
class CircleShapeComponent extends BoundaryFillShapeComponent {
    constructor() {
        super()
    }
    getBoundaryPoints(size) {
        return [360]
    }
    drawShape(context,size) {
        context.fillStyle = this.fillColor
        context.beginPath()
        context.arc(size/2,size/2,size/2,0,2*Math.PI)
        context.fill()
        context.strokeStyle = this.strokeColor
        context.beginPath()
        context.moveTo(size/2,0)
        for(var i=0;i<this.state.curr;i+=10) {
            const x = size/2 + (size/2)*Math.cos((i-90)*Math.PI/180),y = (size/2)*(Math.sin((i-90)*Math.PI/180))
            context.lineTo(x,y)
        }
        context.stroke()
    }
}
customElements.define('boundary-fill',BoundaryFillShapeComponent)
customElements.define('circle-boundary-fill',CircleShapeComponent)
