class LinksListComponent extends HTMLElement {
    constructor() {
        super()
        this.words = this.getAttribute('words').split(" ")
        const shadow = this.attachShadow({mode:'open'})
    }
    addElements(shadow,words) {

    }
    connectedCallback() {

    }
}
class Link {
    constructor(word) {
        this.a = document.createElement('span')
        this.a.innerHTML = word
        this.a.style.borderLeftWidth = 0
        this.a.style.borderRightHeight = 0
    }
    addToParent(shadow) {
        shadow.appendChild(this.a)
        this.w = this.a.offsetWidth
    }
    update(scale) {
        this.a.style.borderLeftWidth = this.w/2*scale
        this.a.style.borderRightWidth = this.w/2*scale
    }
    handleTap(cb) {
        this.a.onclick = (event) => {
            cb()
        }
    }
}
class LinkContainer {
    constructor(words) {
        this.links = []
        this.addLinks(words)
        this.state = new LinkState()
    }
    addLinks(words) {
        for(var i=0;i<words.length;i++) {
            this.links.push(words[i])
        }
    }
    addToParent(shadow) {
        this.links.forEach((link) => {
            link.addToParent(shadow)
        })
    }
    update(stopcb) {
        this.state.update(startcb)
        this.curr.update(this.state.scale)
        this.prev.update(1-this.state.scale)
    }
    startUpdating(startcb) {
        this.links.forEach((link)=>{
            link.handleTap(()=>{
                this.state.startUpdating(startcb)
            })
        })
    }
}
class LinkState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(this.scale > 1) {
            this.scale = 0
            this.dir = 0
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
