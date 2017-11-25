const w = canvas.width,h = canvas.height
class RoundBarButtonListComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        context.fillStyle = '#FFC107'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class RoundBar {
    constructor(x,y,h) {
        this.x = x
        this.y = y
        this.w_scale = 0
        this.h = h
    }
    addToAnimQueue(queue) {
        queue.push((scale)=>{
            this.w_scale = scale
        })
    }
    draw(context) {
        const new_x = (9*w/20)*this.w_scale,
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(w/2,this.y)
            context.scale(1,1-2*i)
            context.fillRect(-w/2,-this.h/2,new_x,h)
            context.beginPath()
            context.arc(-w/2+new_x,0,w/20,0,2*Math.PI)
            context.fill()
            context.restore()
        }
    }
}
