const maxDimension = Math.max(window.innerWidth,window.innerHeight)
class RippleButtonLinkComponent extends HTMLElement{
    constructor() {
        super()
        this.color = this.getAttribute('color') || 'teal'
        this.text = this.getAttribute('text') || 'test'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const fontSize = maxDimension/30
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/, `${fontSize}`)
        const tw = context.measureText(this.text).width
        canvas.width = 2*tw
        canvas.height = fontSize*2
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/, `${fontSize}`)
        context.fillStyle = 'white'
        context.fillText(this.text,tw/2,fontSize)
    }
}
