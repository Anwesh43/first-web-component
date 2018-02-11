const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/2
class DoubleBarComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new DoubleBarAnimator()
        this.doubleBar = new DoubleBar()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.doubleBar.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            this.doubleBar.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.doubleBar.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class DoubleBar {
    constructor() {
        this.state = new DoubleBarState()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    draw(context) {
        const bar_size = size/2
        for(var i=0; i<2; i++) {
            context.save()
            context.translate(size/2,size)
            context.fillStyle = '#E0E0E0'
            context.fillRect((bar_size/2) * (i * 2 - 1), -bar_size*this.state.scales[i], bar_size/2, bar_size*this.state.scales[i])
            context.restore()
        }
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class DoubleBarState {
    constructor() {
        this.scales = [0,0]
        this.prevScale = 0
        this.j = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.prevScale
            startcb()
        }
    }
}
class DoubleBarAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
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
customElements.define('double-bar-comp',DoubleBarComponent)
