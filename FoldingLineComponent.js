const size = Math.min(window.innerWidth,window.innerHeight)/2
class FoldingLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'true'})
        this.img = document.createElement('img')
        this.n = this.getAttibute('n')||5
        this.foldingLineContainer = new FoldingLineContainer(this.n)
        this.animator = new Animator()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.foldingLineContainer.startUpdating(() => {
                this.animator.start(() => {
                    this.foldingLineContainer.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
    render() {
        const canvas = document.createElement('img')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.foldingLineContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class State {
    constructor() {
        this.dir = 0
        this.scale = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.prevScale = this.scale + this.dir
            this.dir = 0
            this.scale = this.prevScale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
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
class FoldingLine {
    constructor(i) {
        this.i = i
        this.state = new State()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    draw(context,gap) {
        const i = this.i
        const state = this.state
        context.save()
        context.translate(gap*i,0)
        context.rotate(180*(1-state.scale))
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(gap,0)
        context.stroke()
        context.restore()
    }
}
class FoldingLineContainerState {
    constructor(n) {
        this.j = n - 1
        this.n = n
        this.l = 1
        this.dir = -1
    }
    increment() {
        this.j += this.dir
        if(this.j < this.l || this.j == this.n) {
            this.dir*=-1
            this.j += this.dir
        }
    }
    execute(cb) {
        if(this.j < this.n) {
            cb(this.j)
        }
    }
}
class FoldingLineContainer {
    constructor(n) {
        this.state = new FoldingLineContainerState(n)
        this.lines = []
        this.initLines(n)
    }
    initLines(n) {
        for(var i=0;i<n;i++) {
            this.lines.push(new FoldingLine(i))
        }
    }
    update(stopcb) {
        this.state.execute((j)=>{
            this.lines[j].update(stopcb)
        })
    }
    startUpdating(startcb) {
        this.state.execute((j)=>{
            this.lines[j].startUpdating(startcb)
        })
    }
    draw(context) {
        context.strokeStyle = '#4527A0'
        context.lineWidth = size/35
        context.lineCap = 'round'
        this.state.execute((j)=>{
            for(var i=0;i<=j;i++) {
                const line = this.lines[i]
                line.draw(context)
            }
        })
    }
}
customElements.define('folding-line-comp',FoldingLineComponent)
