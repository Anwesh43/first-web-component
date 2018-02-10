class LinksListComponent extends HTMLElement {
    constructor() {
        super()
        this.words = (this.getAttribute('words')||"hello world").split(" ")
        const shadow = this.attachShadow({mode:'open'})
        this.container = new LinkContainer(this.words)
        this.animator = new Animator()
        this.container.addToParent(shadow)
    }
    connectedCallback() {
        this.container.startUpdating(() => {
            this.animator.start(() => {
                this.container.update(() => {
                    this.animator.stop()
                })
            })
        })
    }
}
class Link {
    constructor(word) {
        this.a = document.createElement('span')
        this.div = document.createElement('div')
        this.div.style.width = 0
        this.div.style.height = 0
        this.div.style.position = 'absolute'
        this.div.style.borderRadius = '2px'
        this.a.style.marginLeft = '20px'
        this.a.innerHTML = word
    }
    addToParent(shadow) {
        shadow.appendChild(this.a)
        this.w = this.a.offsetWidth
        this.x = this.a.offsetLeft + this.w/2
        this.div.style.left = this.a.offsetLeft + this.a
        this.div.style.top = this.a.offsetTop + this.a.offsetHeight
        shadow.appendChild(this.div)
        this.div.style.border = '5px solid teal'
    }
    update(scale) {
        this.div.style.width = this.w*scale
        this.div.style.left = this.x - (this.w/2)*scale
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
            this.links.push(new Link(words[i]))
        }
    }
    addToParent(shadow) {
        this.links.forEach((link) => {
            link.addToParent(shadow)
        })
    }
    update(stopcb) {
      this.curr.update(this.state.scale)
      if(this.prev) {
          this.prev.update(1-this.state.scale)
      }
        this.state.update(() => {
            this.prev = this.curr
            stopcb()
        })

    }
    startUpdating(startcb) {
        this.links.forEach((link)=>{
            link.handleTap(()=>{
                this.curr = link
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
            this.scale = 1
            this.dir = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.scale = 0
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
customElements.define('links-list-comp',LinksListComponent)
