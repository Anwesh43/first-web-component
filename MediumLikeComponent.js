const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class MediumLikeComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        this.animator = new Animator()
        this.button = new MediumLikeButton()
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.button.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            this.animator.startAnimating(()=>{
              this.button.incrementCount()
            },()=>{
                this.render()
                this.button.update()
            })
        }
    }
}
class MediumLikeButton {
    constructor() {
        this.count = 0
        this.state = new State()
    }
    incrementCount() {
        this.count++
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        const gap = (size/4-size/8)/20
        var r = size/8+gap
        var alpha = 1
        context.fillStyle = 'teal'
        context.save()
        for(var i=0;i<Math.floor(20*this.state.scale);i++) {
            context.globalAlpha = alpha
            context.beginPath()
            context.arc(0,0,r,0,2*Math.PI)
            context.fill()
            r += gap
            alpha -= 0.05
        }
        context.restore()
        context.globalAlpha = 1
        context.fillStyle = 'white'
        context.beginPath()
        context.arc(0,0,size/8,0,2*Math.PI)
        context.fill()
        context.strokeStyle = 'teal'
        context.stroke()
        LikeCount.draw(context,this.state.scale,this.count)
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class LikeCount  {
    static draw(context,scale,count) {
        context.fillStyle = 'teal'
        context.save()
        context.globalAlpha = scale
        context.translate(0,-2*size/5*scale)
        context.beginPath()
        context.arc(0,0,size/20,0,2*Math.PI)
        context.fill()
        context.fillStyle='white'
        context.font = context.font.replace(/\d{2}/,size/25)
        context.fillText(`${count}`,0,0)
        context.restore()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update(stopcb) {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += 10
        if(this.deg > 180) {
            this.deg = 0
            this.scale = 0
            stopcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    startAnimating(startcb,updatecb) {
        if(!this.animated) {
            startcb()
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
