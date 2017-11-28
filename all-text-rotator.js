const fontSize = 40
class TextUtil {
    changeFont(context,font) {
        context.font = context.font.replace(/d{2}/,font)
    }
    getTextSize(context,text) {
        return context.measureText(this.text).width
    }
}
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
        TextUtil.changeFont(context,fontSize)
        const tw = TextUtil.getTextSize(context,this.text)
        canvas.width = 2*tw
        canvas.height = 2*fontSize
        context = canvas.getContext('2d')
        TextUtil.changeFont(context,fontSize)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class AllTextRotator {
    constructor(text) {
        this.text = text
        this.j = 0
    }
    draw(context,w,h) {
        context.fillStyle = '#212121'
        const currText = this.text.substr(0,this.j)
        const tw = TextUtil.getTextSize(context,currText)
        context.fillText(currText,w/2-(tw)/2,h/2+fontSize/2)
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {
        
    }
}
