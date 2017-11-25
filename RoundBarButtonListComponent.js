const w = window.innerWidth,h = window.innerHeight
class RoundBarButtonListComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        const n = this.getAttribute('n') || 6
        this.queue = new AnimationQueue()
        this.container = new RoundBarContainer(this.queue,n)
        this.animator = new RoundBarAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        context.fillStyle = '#FFC107'
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.queue.update()
    }
    startUpdating() {
        return this.queue.startUpdating()
    }
    stopped() {
        return this.queue.stopped()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            this.animator.startAnimation()
        }
    }
}
class RoundBar {
    constructor(y,h) {
        this.y = y
        this.w_scale = 0
        this.h = h
    }
    addToAnimQueue(queue) {
        queue.push((scale)=>{
            this.w_scale = scale
        })
    }
    addReverseAnimQueue(queue) {
        queue.push((scale)=>{
            this.w_scale = 1-scale
        })
    }
    draw(context) {
        const new_x = (w/2-this.h/2)*this.w_scale
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(w/2,this.y)
            context.scale(1-2*i,1)
            context.fillRect(-w/2,-this.h/2,new_x,this.h)
            context.beginPath()
            context.arc(-w/2+new_x,0,this.h/2,0,2*Math.PI)
            context.fill()
            context.restore()
        }
    }
}
class RoundBarContainer {
    constructor(queue,n) {
        this.roundBars = []
        this.scale = 0
        this.initRoundBars(n)
        this.addAnimation(queue)
        this.addReverseAnimation(queue)
    }
    initRoundBars(n) {
        if(n > 0) {
            const h_gap = (3*h/5)/(2*n+1)
            var y = 2*h/5
            for(var i=0;i<n;i++) {
                this.roundBars.push(new RoundBar(y,h_gap))
                y+=2*h_gap
            }
        }
    }
    addAnimation(queue) {
        this.roundBars.forEach((roundBar)=>{
            roundBar.addToAnimQueue(queue)
        })
        queue.push((scale)=>{
            this.scale = scale
        })
    }
    addReverseAnimation(queue) {
        queue.push((scale)=>{
            this.scale = 1-scale
        })
        this.roundBars.forEach((roundBar)=>{
            roundBar.addReverseAnimQueue(queue)
        })
    }
    draw(context) {
        this.roundBars.forEach((roundBar)=>{
            roundBar.draw(context)
        })
        this.drawArc(context)
    }
    drawArc(context) {
        const r = Math.min(w,h)/10
        context.save()
        context.translate(w/2,h/5 - r)
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i <= 365*this.scale;i+=10) {
            const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
}
class RoundBarAnimator {
    constructor(component){
        this.animated = false
        this.component = component
    }
    startAnimation() {
        console.log("started")
        console.log(this.animated)
        if(!this.animated && this.component.startUpdating()) {
            this.animated = true
            console.log(this.component.queue.queue.length)
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                console.log(this.component.queue.queue.length)
                if(this.component.stopped()) {
                    clearInterval(interval)
                    this.animated = false
                }
            },10)
        }
    }
}
customElements.define('round-bar-button-list',RoundBarButtonListComponent)
