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
