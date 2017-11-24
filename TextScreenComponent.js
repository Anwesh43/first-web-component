const w = window.innerWidth,h = window.innerHeight
class TextScreenComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
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
    }
    initTextContainer(texts,queue) {

    }
    draw(context,color) {
        context.fillStyle = color
        context.fillRect(this.x,0,w,h)
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
            this.y = h/2 - (h/2+(h/30+(h/30)*(this.textParts.length)/2))*scale
        })
    }
    initTextParts(texts,queue) {
        var y = -h/30*(1+texts.length)/2
        texts.forEach((text)=>{
            const textPart = new TextPart(text,y)
            textPart.addAnimation(queue)
            this.textParts.push(textPart)
            y += h/15
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
      this.px = x
      this.time = 0
  }
  addAnimation(queue) {
      queue.push((scale)=>{
          this.x = this.px - (w/2)*scale
      })
  }
  draw(context) {
      const tw = context.measureText(this.text).w
      if(this.time == 0) {
          this.x += tw
      }
      context.font = context.replace(/\d{2}/,`${h/30}`)
      context.fillStyle = 'white'
      context.fillText(this.text,this.x-tw/2,this.y,paint)
      this.time++
  }
}
class TextScreenContainer {
    constructor() {
        this.queue = new AnimationQueue()
        this.textScreen = new TextScreen(["hello world","hello world 1","hello world 2"],"#00ACC1",queue)
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
