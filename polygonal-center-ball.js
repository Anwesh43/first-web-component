const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)*0.4
const attachCustomFunctionality = (context) {
    context.fillCircle = function(x,y,r) {
        context.beginPath()
        context.arc(x,y,r,0,2*Math.PI)
        context.fill()
    }
}
class PolygonalCenterBallComponent extends HTMLElement {
    constructor() {
        super()
        this.n = this.getAttribute('n')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        attachCustomFunctionality(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class PolygonalCenterBall {
    draw(context,n) {
        context.save()
        context.translate(size/2,size/2)

        context.restore()
    }
    drawBalls(context,n) {
        for(var i=0;i<n;i++) {
            const x = (size/3)*Math.cos(i*(2*Math.PI/n)),y = (size/3)*Math.sin(i*(2*Math.PI/n))
            context.fillCircle(x,y,size/20)
        }
    }
}
