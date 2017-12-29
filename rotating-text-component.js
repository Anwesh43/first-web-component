const w = window.innerWidth,h = window.innerHeight, size = Math.min(w,h)/3
class RotatingTextComponent extends HTMLElement {
    constructor(){
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n') || 6
        this.text = this.getAttribute('text')||"hello"
        this.text = this.text.split(' ')[0]
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class RotatingText {
    constructor(text,n) {
        this.text = text
        this.n = n
    }
    draw(context,scale) {
        var deg = 0
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
