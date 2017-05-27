class RippleLoaderComponent extends HTMLElement {
    constructor() {
        super()
        this.color = this.getAttribute('color')||'#00ACC1'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.state = {dir:1,scale:0.5}
        this.img.style.position = 'absolute'
        this.img.style.top = window.innerHeight/4
        this.img.style.left = window.innerWidth/4
    }
    drawArc(context,r) {
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.stroke()
    }
    draw(w) {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = w
        const context = canvas.getContext('2d')
        const r = w/2
        context.lineWidth = r/4
        context.clearRect(0,0,w,w)
        context.save()
        context.translate(w/2,w/2)
        context.scale(this.state.scale,this.state.scale)
        context.beginPath()
        context.strokeStyle = this.color
        this.drawArc(context,r/2)
        context.restore()
        this.update()
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.state.scale += (0.1*(this.state.dir))
        if(this.state.scale >= 1) {
            this.state.dir = -1
        }
        if(this.state.scale <= 0.5) {
            this.state.dir = 1
        }
    }
    connectedCallback(){
        const w = window.innerWidth/10,h = window.innerWidth/10
        setInterval(()=>{
          this.draw(w)
        },100)
    }
}
customElements.define('ripple-loader',RippleLoaderComponent)
