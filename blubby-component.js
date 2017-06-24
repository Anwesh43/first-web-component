const w = window.innerWidth,h = window.innerHeight
class BlubbyComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/5
        canvas.height = w/5
        const context = canvas.getContext('2d')
        context.fillStyle = 'orange'
        context.save()
        context.translate(w/10,w/10)
        context.beginPath()
        for(var i=0;i<360;i+=30) {
            var r = w/20+Math.random()*(w/20)
            const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        setInterval(()=>{
            this.render()
        },200)
    }
}
customElements.define('blubby-comp',BlubbyComponent)
