class PingPongComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.pingPong = new PingPong()
        this.pingPong.addToShadow(shadow)
    }
    startLoop() {
        const interval = setInterval(()=>{
            this.pingPong.move()
        },100)
    }
    connectedCallback() {
        this.startLoop()
    }
}
class PingPong {
    constructor() {
        this.x = window.innerWidth/2
        this.y = window.innerHeight/2
        this.sx = 1
        this.sy = 1
        this.div = document.createElement('div')
    }
    addToShadow(shadow) {
        this.defineDiv()
        shadow.appendChild(this.div)
    }
    defineDiv() {
        this.div.style.background = 'red'
        this.div.style.width = Math.min(window.innerWidth,window.innerHeight)/10
        this.div.style.height = Math.min(window.innerWidth,window.innerHeight)/10
        this.div.style.position = 'absolute'
        this.div.style.left = this.x
        this.div.style.top = this.y
        this.div.style.border = '1px solid black'
        this.div.style.borderRadius = '50%'
    }
    move() {
        const w = parseFloat(this.div.style.width), h = parseFloat(this.div.style.height)
        this.x += (w/2*this.sx)
        this.y += (w/2*this.sy)
        if(this.x+w > window.innerWidth) {
            this.sx = -1
            console.log(window.innerWidth)
        }
        if(this.x < 0) {
            this.sx = 1
            console.log(this.x)
        }
        if(this.y+w >= window.innerHeight) {
            this.sy = -1
            console.log(this.y)
        }
        if(this.y < 0) {
            this.sy = 1
            console.log(this.y)
        }
        this.div.style.left = this.x
        this.div.style.top = this.y
        // console.log(this.x)
        // console.log(this.y)
    }
}
customElements.define('ping-pong',PingPongComponent)
