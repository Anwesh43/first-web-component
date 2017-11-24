const w = window.innerWidth,h = window.innerHeight
class TextScreenComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.container = new TextScreenContainer()
        this.animator = new TextScreenAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        //context.fillRect(0,0,w,h)
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onclick = (event) => {
            this.animator.startAnimating()
        }
    }
    update() {
        console.log(this.container.queue.queue.length)
        this.container.update()
    }
    stopped() {
        return this.container.stopped()
    }
    startUpdating() {
        return this.container.startUpdating()
    }
}
class TextScreen {
    constructor(texts,color,queue) {
        this.x = -w
        queue.push((scale)=>{
            this.x = -w + w*scale
        })
        this.initTextContainer(texts,queue)
        queue.push((scale)=>{
            this.x = w*scale
        })
        this.color = color
    }
    initTextContainer(texts,queue) {
        console.log(texts)
        this.textContainer = new TextContainer(texts,queue)
    }
    draw(context) {
        context.fillStyle = this.color
        context.fillRect(this.x,0,w,h)
        this.textContainer.draw(context)
    }
}
class TextContainer {
    constructor(texts,queue) {
        this.textParts = []
        this.y = h/2
        this.initTextParts(texts,queue)
        this.initAnimation(queue)
    }
    initAnimation(queue) {
        queue.push((scale)=>{
            this.y = h/2 - (h/2+(h/15+(h/15)*(this.textParts.length)/2))*scale
        })
    }
    initTextParts(texts,queue) {
        var y = -h/15*(1+texts.length)/2
        texts.forEach((text)=>{
            const textPart = new TextPart(text,y)
            textPart.addAnimation(queue)
            this.textParts.push(textPart)
            y += 2*h/15
        })
    }
    draw(context) {
        context.save()
        context.translate(w/2,this.y)
        this.textParts.forEach((textPart)=>{
            textPart.draw(context)
        })
        context.restore()
    }
}
class TextPart{
  constructor(text,y) {
      this.text = text
      this.x = w/2
      this.y = y
      this.px = this.x
      this.time = 0
      console.log(this.x)
  }
  addAnimation(queue) {
      queue.push((scale)=>{
          this.x = this.px - (w/2)*scale
          console.log(this.px)
          console.log(this.x)
      })
  }
  draw(context) {
      const tw = context.measureText(this.text).width
      if(this.time == 0) {
          this.x += tw/2
          this.px = this.x
      }
      context.font = context.font.replace(/\d{2}/,`${h/15}`)
      console.log(context.font)
      context.fillStyle = 'white'
      context.fillText(this.text,this.x-tw/2,this.y)
      this.time++
  }
}
class TextScreenContainer {
    constructor() {
        this.queue = new AnimationQueue()
        this.textScreen = new TextScreen(["hello world","hello world 1","hello world 2"],"#00ACC1",this.queue)
    }
    draw(context) {
        this.textScreen.draw(context)
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
class TextScreenAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimating() {
        if(!this.animated && this.component.startUpdating()) {
            this.animated = true
            console.log("start")
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    this.animated = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('text-screen-comp',TextScreenComponent)
