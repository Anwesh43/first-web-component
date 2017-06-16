const size = Math.max(window.innerWidth,window.innerHeight)/20
class OpaqueColoredButton extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.color = this.getAttribute('color')||'blue'
        shadow.appendChild(this.img)
        this.scale = 0
        this.animationHandler = new AnimationHandler(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.save()
        context.translate(size/2,size/2)
        context.globalAlpha = 0.5
        context.fillStyle = 'black'
        context.beginPath()
        context.arc(0,0,size/2,0,2*Math.PI)
        context.fill()
        context.fillStyle =
        context.save()
        context.scale(this.scale,this.scale)
        context.beginPath()
        context.arc(0,0,size/2,0,2*Math.PI)
        context.fill()
        context.restore()
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    setEdgeValue(dir) {
        if(dir == 1) {
            this.scale = 1
        }
        else if(dir == -1){
            this.scale = 0
        }
    }
    update(dir) {
        this.scale += dir*0.2
    }
    connectedCallback() {
        this.render()
        var out = false,over = false
        this.img.onmouseout = () => {
            if(out == false) {
                out = true
                over = false
                this.animationHandler.start(-1)
            }
        }
        this.img.onmouseover = () => {
            if(over == false) {
                out = false
                over = true
                this.animationHandler.start(1)
            }

        }
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
    }
    start(dir) {
        var count = 0
        const interval = setInterval(()=>{
            this.component.render()
            this.component.update(dir)
            count++
            if(count == 6) {
                this.component.setEdgeValue(dir)
                clearInterval(interval)
                this.component.render()
            }
        },50)
    }
}
customElements.define('opaque-button',OpaqueColoredButton)
