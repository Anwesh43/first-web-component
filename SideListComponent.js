const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/12
class SideListComponent extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.img = document.createElement('img')
        shadow.appendChild(this.div)
        shadow.appendChild(this.img)
        this.state = new State()
        this.animator = new Animator()
        this.createStyle()
    }
    createStyle() {
        this.img.style.position = 'absolute'
        this.img.style.top = h/2-size
        this.img.style.left = 0
        this.div.style.width = w/4
        this.div.style.height = h
        this.div.style.background = '#212121'
        this.div.style.position = 'absolute'
        this.div.style.left = -w/4
        this.div.style.top = 0
    }
    update(scale) {
        this.div.style.left = -w/4+w/4*scale
        this.img.style.left = w/4*scale
    }
    render(scale) {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = 2*size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        HalfArc.draw(context)
        Arrow.draw(context,scale)
        this.img.src = canvas.toDataURL()
        this.update(scale)
    }
    connectedCallback() {
        this.render(0)
        this.img.onclick = () => {
            this.animator.startUpdating(()=>{
                this.state.startUpdating()
            },()=>{
                this.state.update(()=>{
                    this.animator.stop()
                })
                this.render(this.state.scale)
                console.log(this.state.scale)
            })
        }
    }
}
class Arrow {
    static draw(context,scale) {
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.lineWidth = size/20
        context.save()
        context.translate(2*size/5,size)
        context.rotate(Math.PI*scale)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1,1-2*i)
            context.beginPath()
            context.moveTo(size/3,0)
            context.lineTo(0,-size/3)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    startUpdating(startcb,updatecb) {
        if(!this.animated) {
            this.animated = true
            startcb()
            console.log("started")
            this.interval = setInterval(()=>{
                updatecb()
            },30)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class HalfArc {
    static draw(context) {
        context.beginPath()
        context.arc(0,size,size,-Math.PI/2,Math.PI/2)
        context.fill()
    }
}
customElements.define('side-list',SideListComponent)
