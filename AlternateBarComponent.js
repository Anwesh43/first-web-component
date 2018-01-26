const w = window.innerWidth
const alternatingBarColors = ['#673AB7','#FF5722']
class AlternateBarComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(w,h)
        canvas.height = Math.min(w,h)
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,w)
        this.img.src = canvas.toDataURL()
    }
}
class AlternateBar {
    constructor(i) {
        this.i = i
    }
    draw(context,x_size,y_size,scale) {
        const x = x_size * this.i
        const y = y_size*(1-scale)*(i%2)
        const h = y_size*scale
        context.fillStyle = alternatingBarColors[i%2]
        context.fillRect(x,y,x_size,h)
    }
}
class AlternateBarContainer {
    constructor() {
        this.n = 10
        this.init()
    }
    init() {
        this.bars = []
        for(var i=0;i<this.n;i++) {
            this.bars.push(new AlternateBar(i))
        }
    }
    draw(context) {
        context.save()
        context.translate(w/2,w/2)
        context.rotate(Math.PI/2)
        context.save()
        context.translate(-w/2,-w/2)
        this.bars.forEach((bar)=>{
            bar.draw(context,w/10,w,1)
        })
        context.restore()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
