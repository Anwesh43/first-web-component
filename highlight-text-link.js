const w = window.innerWidth,h = window.innerHeight
class HighlightTextLinkComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.div)
        this.initTextElements()
    }
    initTextElements() {
        const children = this.children
        this.textElems = []
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.textElems.push({text:child.getAttribute('text'),href:child.getAttribute('href')})
        }
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHandler(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,h/20)
        const tw = this.textElems.reduce((l1,elem)=>{
            const l2 = context.measureText(elem.text).width
            if(l1 > l2) {
                return l1
            }
            return l2
        },0)
        canvas.width = 2*tw
        canvas.height = h/10*(this.textElems.length)
        this.div.style.width = canvas.width
        this.div.style.height = canvas.height
        if(!this.highlightTextElems) {
            this.highlightTextElems = this.textElems.map((textElem,index)=>new HighlightText(textElem,tw/2,h/20+index*(h/10)))
        }
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,h/20)
        this.highlightTextElems.forEach((textElem)=>{
            textElem.draw(context)
        })
        this.div.style.background = `url(${canvas.toDataURL()})`
        this.div.onmousedown = (event) => {
            this.highlightTextElems.forEach((textElem)=>{
                if(textElem.handleTap(event.offsetY)) {
                    this.animationHandler.startAnimation(textElem)
                }
            })
        }
    }
}
class HighlightText {
    constructor(textElem,x,y) {
        this.textElem = textElem
        this.x = x
        this.y = y
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        const tw = context.measureText(this.textElem.text).width
        context.fillStyle = '#212121'
        context.fillText(this.textElem.text,this.x-tw/2,this.y)
        context.strokeStyle = 'teal'
        context.lineWidth = 5
        for(var i=0;i<2;i++) {
            context.beginPath()
            context.moveTo(this.x,this.y+h/40)
            context.lineTo(this.x+(tw/2)*(1-2*i)*this.scale,this.y+h/40)
            context.stroke()
        }
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
                textElem.update()
                if(textElem.stopped() == true) {
                    clearInterval(interval)
                }
            },75)
        }
    }
}
customElements.define('highlight-text-elem',HighlightTextLinkComponent)
