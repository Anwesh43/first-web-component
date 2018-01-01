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
