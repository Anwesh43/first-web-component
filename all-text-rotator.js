class AllTextRotatorComponent extends HTMLElement {
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,"30")
        const tw = context.measureText(this.text)
        canvas.width = 2*tw
        canvas.height = 90
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,"30")
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
