class CircularLoaderComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.deg = 0
    }
    draw() {
        const w = window.innerWidth,h = window.innerHeight
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle  = 'black'
        context.fillRect(0,0,w,h)
        const n = 8
        const gapDeg = 360/n
        for(var i=0;i<n;i++) {
            const r = w/16,circR = (Math.PI*r)/16
            const x = w/2 +(r*Math.cos(gapDeg*i*Math.PI/180)),y = h/2 + (r*Math.sin(gapDeg*i*Math.PI/180))
            if(this.deg == i*gapDeg) {
                context.fillStyle = 'white'
            }
            else {
                context.fillStyle = 'gray'
            }
            context.beginPath()
            context.arc(x,y,circR,0,2*Math.PI)
            context.fill()
        }
        this.deg += gapDeg
        this.deg %= 360
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        setInterval(()=>{
            this.draw()
        },100)
    }
}
customElements.define('circular-loader',CircularLoaderComponent)
