const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/8
class SideListComponent extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.img = document.createElement('img')
        shadow.appendChild(this.div)
        shadow.appendChild(this.img)
    }
    createStyle() {
        this.img.style.position = 'absolute'
        this.img.style.top = h/2-size/2
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
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
        this.update(scale)
    }
}
class Arrow {
    static create(context,scale) {
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.lineWidth = size/20
        context.save()
        context.translate(size/2,size/2)
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
    update() {
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
}
