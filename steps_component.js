var w = window.innerWidth, h = window.innerHeight
class StepsComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n')||6
        this.container = new StepsContainer(this.n)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
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
        this.drawArc(context,this.w/10,360*this.deg_scale)
        this.drawLine(context,0,0,w*this.x_scale,0)
        this.drawLine(context,w,0,w,h*this.y_scale)
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
        this.initSteps(n)
        this.queue = new AnimationQueue()
    }
    initSteps(n) {
        if(n > 0) {
          const x_gap = w/(n+1),y_gap = h/(n+1)
          var x = x_gap/2,y = y_gap/2
          for(var i=0;i<n;i++) {
              const step = new Step(x,y,x_gap,y_gap)
              step.addToAnimQueue(this.queue)
              this.steps.push(step)
              x+=x_gap
              y+=y_gap
          }
        }
    }
    draw(context) {
        this.steps.forEach((step)=>{
            step.draw(context)
        })
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
