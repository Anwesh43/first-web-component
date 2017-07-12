const w = window.innerWidth,h = window.innerHeight
class CircularCollapseDiv extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.img = document.createElement('img')
        this.color = this.getAttribute('color') || '#3F51B5'
    }
    renderDiv() {
        const canvas = document.createElement('canvas')
        canvas.width = w/5
        canvas.height = w/5
        const context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    renderImg() {
        const canvas = document.createElement('canvas')
        canvas.width = w/15
        canvas.height = w/15
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    render() {
        this.renderImg()
        this.renderDiv()
    }
    update() {

    }
    stopped() {
        return true
    }
    startUpdating() {

    }
    connectedCallback() {
        this.render()
    }
}
class StateContainer {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.updateCbs= []
    }
    update() {
        this.updateCbs.forEach((cb)=>{
            cb(this.scale)
        })
        this.scale += 0.15*this.dir
        if(this.scale > 1) {
            this.dir = 0
        }
        if(this.scale < 0) {
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating() {
        if(this.scale <= 0) {
            this.dir = 1
        }
        if(this.scale >= 1) {
            this.dir = -1
        }
    }
}
