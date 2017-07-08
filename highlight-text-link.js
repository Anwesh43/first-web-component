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
