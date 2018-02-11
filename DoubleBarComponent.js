const w = window.innerWidth, h = window.innerHeight, size = Math.min(w,h)/2
class DoubleBarComponent extends HTMLElement {
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
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class DoubleBar {
    constructor() {

    }
    update(stopcb) {

    }
    draw(context) {
        const bar_size = size/2
        for(var i=0; i<2; i++) {
            context.save()
            context.translate(size/2,size)
            context.fillStyle = '#E0E0E0'
            context.fillRect((bar_size/2) * (i * 2 - 1), -bar_size, bar_size/2, bar_size)
            context.restore()
        }
    }
    startUpdating(startcb) {

    }
}
