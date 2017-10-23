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
        context.lineWidth = size/50
        context.lineCap = 'round'
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class SwipingMultiLine {
    constructor() {
        this.state = new SwipingMultiLineState()
    }
    draw(context,n) {
        const deg = (2*Math.PI)/n
        for(var i=0;i<n;i++) {
            context.save()
            context.translate(size/2,size/2)
            context.rotate(deg*i*this.state.scale)
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
        this.state.update()
    }
    startUpdating() {
        this.state.startUpdating()
    }
    stopped() {
        return this.state.stopped()
    }
}
class SwipingMultiLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += 0.1*dir
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
