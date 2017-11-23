var w = window.innerWidth, h = window.innerHeight
class StepsComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n')||6
        this.container = new StepsContainer(this.n)
        this.animator = new StepsAnimator(this)
        this.color = this.getAttribute('color')||'#E65100'
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        context.strokeStyle = this.color
        context.fillStyle = this.color
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.container.update()
    }
    startUpdating() {
        return this.container.startUpdating()
    }
    stopped() {
        return this.container.stopped()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = () => {
            this.animator.startUpdating()
        }
    }
}
class Step {
    constructor(x,y,w,h) {
        this.deg_scale = 0
        this.x_scale = 0
        this.y_scale = 0
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    draw(context) {
        context.lineWidth = this.w/25
        context.lineCap = 'round'
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.w/10,0,2*Math.PI)
        context.stroke()
        this.drawArc(context,this.w/10,361*this.deg_scale)
        if(this.x_scale > 0) {
            this.drawLine(context,0,0,this.w*this.x_scale,0)
        }
        if(this.y_scale > 0) {
            this.drawLine(context,this.w,0,this.w,this.h*this.y_scale)
        }
        context.restore()
    }
    drawLine(context,x1,y1,x2,y2) {
        context.beginPath()
        context.moveTo(x1,y1)
        context.lineTo(x2,y2)
        context.stroke()
    }
    drawArc(context,r,deg){
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=deg;i++) {
            const x = r*Math.cos(i*Math.PI/180)
            const y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
    }
    addToAnimQueue(queue) {
        queue.push((scale)=>{
            this.deg_scale = scale
        })
        queue.push((scale)=>{
            this.x_scale = scale
        })
        queue.push((scale)=>{
            this.y_scale = scale
        })
    }
}
class StepsContainer {
    constructor(n) {
        this.steps = []
        this.xaxis_scale = 0
        this.yaxis_scale = 0
        this.queue = new AnimationQueue()
        this.initSteps(n)
    }
    initSteps(n) {
        if(n > 0) {
          const x_gap = w/(n+1),y_gap = h/(n+1)
          var x = x_gap/2,y = y_gap/2
          this.x_pivot = x_gap/2
          this.y_pivot = y_gap/2+y_gap*(n)
          this.wx = x_gap*n
          this.hy = y_gap*(n)
          for(var i=0;i<n;i++) {
              const step = new Step(x,y,x_gap,y_gap)
              step.addToAnimQueue(this.queue)
              this.steps.push(step)
              x+=x_gap
              y+=y_gap
          }
          this.queue.push((scale)=>{
              this.xaxis_scale = scale
              this.yaxis_scale = scale
          })
        }
    }
    draw(context) {
        this.steps.forEach((step)=>{
            step.draw(context)
        })
        this.drawAxis(context,this.x_pivot+this.wx*this.xaxis_scale,this.y_pivot)
        this.drawAxis(context,this.x_pivot,this.y_pivot - (this.yaxis_scale*this.hy))
    }
    drawAxis(context,x,y) {
        context.beginPath()
        context.moveTo(this.x_pivot,this.y_pivot)
        context.lineTo(x,y)
        context.stroke()
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
}
class StepsAnimator{
    constructor(component) {
        this.animated = false
        this.component = component
    }
    startUpdating() {
        if(!this.animated && this.component.startUpdating()) {
            this.animated = true
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            })
        }
    }
}
customElements.define('steps-comp',StepsComponent)
