class CollapsibleTextComponent extends HTMLElement {
    constructor() {
        this.text = this.getAttribute('text')
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.state = {wx:140,dir:0}
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w*1.5
        canvas.height = 90
        const context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,30)
        const w = context.measureText(this.text).width
        context.clearRect(0,0,canvas.width,canvas.height)
        context.fillStyle = 'gray'
        context.fillRect(0,0,canvas.width,canvas.height)
    }
    connectedCallback() {
        this.render()
    }
}
