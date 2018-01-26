const w = Math.min(window.innerWidth,window.innerHeight)
const alternatingBarColors = ['#673AB7','#FF5722']
class AlternateBarComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.container = new AlternateBarContainer()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.container.startUpdating(()=>{
                this.animator.animate(()=>{
                    this.render()
                    console.log("rendered")
                    this.container.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = w
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,w)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class AlternateBar {
    constructor(i) {
        this.i = i
    }
    draw(context,x_size,y_size,scale) {
        const x = x_size * this.i
        const y = y_size*(1-scale)*(this.i%2)
        const h = y_size*scale
        context.fillStyle = alternatingBarColors[this.i%2]
        context.fillRect(x,y,x_size,h)
    }
}
class AlternateBarContainer {
    constructor() {
        this.n = 10
        this.init()
        this.state = new AlternateBarState()
    }
    init() {
        this.bars = []
        for(var i=0;i<this.n;i++) {
            this.bars.push(new AlternateBar(i))
        }
    }
    draw(context) {
        context.save()
        context.translate(w/2,w/2)
        context.rotate(Math.PI/2*this.state.scales[1])
        context.save()
        context.translate(-w/2,-w/2)
        this.bars.forEach((bar)=>{
            bar.draw(context,w/10,w,this.state.scales[0])
        })
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class AlternateBarState{
    constructor() {
        this.scales = [0,0]
        this.dir = 1
        this.scaleDir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.scaleDir*0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.scaleDir
            this.j += this.dir
            if(this.j == 2 || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                this.prevScale = this.scales[this.j]
                this.scaleDir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.scaleDir == 0) {
            this.scaleDir = 1 - 2*this.prevScale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    animate(updatecb) {
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
customElements.define('alternate-bar',AlternateBarComponent)
