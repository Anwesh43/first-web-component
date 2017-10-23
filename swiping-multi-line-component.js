const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class SwipingMultiLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.n = this.getAttribute('n')||4
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class SwipingMultiLine {
    constructor() {

    }
    draw(context,n) {
        const deg = (2*Math.PI)/n
        for(var i=0;i<n;i++) {
            context.save()
            context.translate(size/2,size/2)
            context.rotate(deg*i)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(size/3,0)
            context.stroke()
            context.beginPath()
            context.arc(size/3+size/10,0,size/10,0,2*Math.PI)
            context.fill()
            context.restore()
        }
    }
    update() {
        
    }
    startUpdating() {

    }
    stopped() {
        return false
    }
}
