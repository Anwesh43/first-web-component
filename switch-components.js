const maxDimension = Math.max(w,h)
class SwitchComponent extends HTMLElement{
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,maxDimension/20)
        const w = context.measureText(this.text).width
        const r = maxDimension/20
        canvas.width = 2*w + 4*r
        canvas.height = 2*r

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'black'
        context.font = ctx.font
        context.fillText(this.text,w/10,r)
        if(!this.switch) {
            this.switch = new Switch(1.3*w,r,r,2.5*r)
        }
    }
}
class Switch {
    constructor(x,y,r,w) {
        this.x = x
        this.y = y
        this.r = r
        this.w = w
        this.l = 0
        this.dir = 0
    }
    draw(context) {
        context.fillStyle = 'gray'
        this.drawShape()
        context.save()
        context.beginPath()
        context.rect(this.x-this.r,this.y-this.r,this.x-this.r+this.l,this.y+this.r)
        context.clip()
        context.fillStyle = 'blue'
        this.drawShape(context)
        context.restore()
    }
    drawArc(context,gap,start) {
      for(var i=0;i<180;i++) {
          const x = this.x+this.r*Math.cos((i+gap)*Math.PI/180),y = this.y+this.r*Math.sin((i+gap)*Math.PI/180)
          if(i == 0 && start == true){
              context.move(x,y)
          }
          else {
              context.lineTo(x,y)
          }
      }
    }
    drawShape(context) {
        context.beginPath()
        this.drawArc(context,90,true)
        context.lineTo(this.x+this.w,this.y-this.r)
        this.drawArc(context,270,false)
        context.lineTo(this.x,this.y+this.r)
        context.fill()

    }
    stopped() {
        return this.dir == 0
    }
    startAnimating() {
        if(this.l >= this.w) {
            this.dir = -1
        }
        if(this.l <= 0) {
            this.dir = 1
        }
    }
    update() {
        this.l += this.dir * this.w/5
        if(this.l >= this.w) {
            this.dir = 0
        }
        if(this.l <= 0) {
            this.dir = 0
        }
    }
}
