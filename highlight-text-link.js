const w = window.innerWidth,h = window.innerHeoght
class HighlightTextLinkComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('canvas')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appenChild(this.div)
        this.initTextElements()
    }
    initTextElements() {
        const children = this.children
        this.textElems = []
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.textElems.push({text:child.innerHTML})
        }
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,h/20)
        const tw = this.textElems.reduce((l1,l2)=>{
            if(l1.length > l2.length) {
                return l1.length
            }
            return l2.length
        })
        canvas.width = 2*tw
        canvas.height = h/10*(this.textElems.length)
        context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
}
class HighlightText {
    constructor(text,x,y) {
        this.text = text
        this.x = x
        this.y = y
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        const tw = context.measureText(this.text).width
        context.fillStyle = '#212121'
        context.fillText(this.text,this.x-tw/2,this.y)
        context.fillStyle = 'teal'
        context.lineWidth = 8
        context.beginPath()
        context.moveTo(this.x,this.y)
        context.lineTo(this.x+(tw/2)*this.scale,this.y)
        context.stroke()
    }
    update() {
        this.scale+=this.dir *0.2
        if(this.scale > 1) {
            this.dir = 0
        }
    }
    startUpdating() {
        if(this.scale == 0 && this.dir == 0) {
            this.dir = 1
        }
    }
    stopped() {
        return this.dir == 0
    }
    handleTap(y) {
        const condition = y>=this.y-h/20 && y<=this.y+h/20
        if(condition) {
            this.startUpdating()
        }
        return condition
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation(textElem) {
        if(this.animated == false) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                if(textElem.stopped() == true) {
                    clearInterval(interval)
                }
            },75)
        }
    }
}
