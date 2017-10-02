const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/3
const color = '#FF8F00'
class BarPieArcFillComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.animator = new BarPieFillAnimator(this)
        this.barPieFillArc = new BarPieArcFill()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.animator.startAnimation()
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.barPieFillArc.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class BarPieArcFill {
    constructor() {
        this.state = new BarPieArcFillState()
    }
    draw(context) {
        context.strokeStyle = color
        context.fillStyle = color
        context.lineWidth = size/30
        context.save()
        context.translate(size/2,size/10)
        context.beginPath()
        context.arc(0,0,size/12,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=360*this.state.scale;i++) {
            const x = (size/12)*Math.cos(i*Math.PI/180),y = (size/12)*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
        const w_rect = size/10
        context.save()
        context.translate(0,size/5)
        for(var i=0;i<10;i++) {
            var h_rect = (size*0.8)*this.state.scale,y_rect = (size*0.8-h_rect)*(i%2)
            context.fillRect(w_rect*i,y_rect,w_rect,h_rect)
        }
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
}
class BarPieArcFillState {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg += 3
        this.scale = (Math.sin(this.deg*Math.PI/180))
        if(this.deg > 180) {
            this.deg = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
class BarPieFillAnimator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startAnimation() {
        if(!this.animated) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.component.barPieFillArc.update()
                if(this.component.barPieFillArc.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('bar-pie-fill',BarPieArcFillComponent)
