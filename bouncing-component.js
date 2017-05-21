class BouncingComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        const shadow = this.attachShadow({mode:'open'})
        this.div.style.background='yellow'
        this.div.style.position = 'absolute'
        this.div.style.width = window.innerWidth/12
        this.div.style.height = window.innerWidth/12
        this.div.style.left = window.innerWidth/2 - window.innerWidth/24
        this.div.style.borderRadius = '50%'
        this.div.style.top = window.innerHeight/2 - window.innerWidth/24
        shadow.appendChild(this.div)
    }
    connectedCallback() {
        var animating = false
        var y = parseFloat(this.div.style.top)
        var dir = 0
        const initY = y
        const h = window.innerWidth/4
        this.div.onmousedown = () => {
            console.log("tapped")
            if(animating == false) {
                console.log("start")
                dir = -1
                animating = true
                const interval = setInterval(()=>{
                    y += (dir * h/8)

                    if(y <= initY - h) {
                        dir = 1
                        console.log(dir)
                        console.log(y)
                    }
                    if(y > initY) {
                        dir = 0
                        y = initY
                        animating = false
                    }
                    this.div.style.top = y
                    if(this.animating == false) {
                        clearInterval(interval)
                    }

                },100)
            }
        }
    }
}
customElements.define('bouncing-component',BouncingComponent)
