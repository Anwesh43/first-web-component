const size = Math.min(window.innerWidth,window.innerHeight)/2
class YShapedComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.yShaped = new YShaped()
        this.animator = new YShapedAnimator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.yShaped.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.yShaped.startUpdating(()=>{
                this.animator.start(()=>{
                    this.render()
                    this.yShaped.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class YShaped {
    constructor() {
        this.state = new YShapedState()
    }
    draw(context) {
        context.lineWidth = size/40
        context.lineCap = 'round'
        context.strokeStyle = '#FDD835'
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,2*size/5)
        context.stroke()
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(0,0)
            const deg =3*Math.PI/4*(2*i-1)
            context.rotate(deg*this.state.scale)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,size/4)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class YShapedState {
    constructor() {
        this.dir = 0
        this.scale = 0
        this.deg = 0
    }
    update(stopcb) {
        this.deg += this.dir*5
        this.scale = Math.sin(this.deg*Math.PI/180)
        if(this.deg > 180) {
            this.deg = 0
            this.dir = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class YShapedAnimator {
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
customElements.define('y-shaped-comp',YShapedComponent)
