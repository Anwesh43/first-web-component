const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class MediumLikeComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
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
class MediumLikeButton {
    constructor() {

    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        const gap = (size/3-size/8)/20
        var r = size/8+gap
        var alpha = 1
        context.fillStyle = 'teal'
        context.save()
        for(var i=0;i<20;i++) {
            context.globalAlpha = alpha
            context.beginPath()
            context.arc(0,0,r,0,2*Math.PI)
            context.fill()
            r += gap
            alpha -= 0.05
        }
        context.restore()
        context.globalAlpha = 1
        context.fillStyle = 'white'
        context.beginPath()
        context.arc(0,0,size/8,0,2*Math.PI)
        context.fill()
        context.strokeStyle = 'teal'
        context.stroke()
        context.restore()
    }
}
