const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)
class SquareToTriangleComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.sqtTri = new SquareToTriangle()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.sqtTri.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = ()=>{
            this.sqtTri.startUpdating(()=>{
                this.animator.update(()=>{
                    this.render()
                    this.sqtTri.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class SquareToTriangle {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        context.beginPath()
        context.moveTo(size/4,3*size/4)
        context.lineTo(3*size/4,3*size/4)
        for(var i=0;i<2;i++) {
            context.lineTo(size/2+size/4*(i*2-1),size/4)
        }
        context.fill()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class State {
    constructor() {
        this.deg = 0
        this.dir = 0
        this.scale = 0
    }
    update(stopcb) {
        this.deg += (Math.PI/20)*this.dir
        this.scale = Math.sin(this.deg*Math.PI/180)
        if(this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    update(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('sqt-tri-comp',SquareToTriangleComponent)
