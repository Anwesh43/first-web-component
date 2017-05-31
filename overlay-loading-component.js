class OverlayLoadingComponent extends HTMLElement{
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.state = {index:0}
    }
    render() {
        const n = 12
        const canvas = document.createElement('canvas')
        const w = window.innerWidth,h = window.innerHeight
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.save()
        context.fillStyle = 'black'
        context.globalAlpha = 0.3
        context.fillRect(0,0,w,h)
        context.restore()
        context.save()
        context.translate(w/2,h/2)
        const r = w/30
        const deg = 360/n
        context.lineWidth = 2
        for(var i = 0;i<n;i++) {
            context.strokeStyle = '#BDBDBD'
            if(i == this.state.index) {
                context.strokeStyle = 'white'
            }
            context.save()
            context.rotate((deg*i)*Math.PI/180)
            context.beginPath()
            context.moveTo(0,-r/3)
            context.lineTo(0,-r)
            context.stroke()
            context.restore()
        }
        context.restore()
        this.state.index++
        this.state.index %= n
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        const interval = setInterval(()=>{
            this.render()
        },50)
    }
}
customElements.define('overlay-loading-component',OverlayLoadingComponent)
