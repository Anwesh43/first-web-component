const w = window.innerWidth,h = window.innerHeight, size = Math.min(w,h)/3
class RotatingTextComponent extends HTMLElement {
    constructor(){
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n') || 6
        this.text = this.getAttribute('text')||"hello"
        this.text = this.text.split(' ')[0]
        this.rotatingText = new RotatingText(this.text,this.n)
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.rotatingText.drawRotatingText(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.rotatingText.update(()=>{
                this.animator.stop()
            })
        }
    }
}
class RotatingText {
    constructor(text,n) {
        this.text = text
        this.n = n
        this.state = new RotatingTextState()
    }
    drawRotatingText(context) {
        this.draw(context,this.state.scale)
    }
    draw(context,scale) {
        var deg = 0
        const scale
        if(n > 0) {
            deg = 360/n
        }
        for(var i=0;i<this.n;i++) {
            context.save()
            context.translate(size/2,size/2)
            context.rotate(((i*deg)*Math.PI/180)*scale)
            context.fillStyle = 'white'
            context.font = context.font.replace(/\d{2}/,size/8)
            context.fillText(this.text,0,0)
            context.restore()
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class RotatingTextState {
    constructor() {
        this.deg = 0
        this.scale = 0
    }
    update(stopcb) {
        this.deg += 10
        this.scale = Math.sin(this.deg*Math.PI/180)
        if(this.deg > 180) {
            this.deg = 0
            this.scale = 0
            stopcb()
        }
    }
}
class Animator {
    constructor(component) {
        this.animated = false
        this.component = component
    }
    start(updatecb) {
        if(!this.animated) {
            this.interval = setInterval(()=>{
                this.component.render()
                updatcb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = true
            clearInterval(interval)
        }
    }

}
