const maxDimension = Math.max(window.innerWidth,window.innerHeight)
class SwitchComponent extends HTMLElement{
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    animate() {
        const interval = setInterval(()=>{
            this.render()
            if(this.switch) {
                this.switch.update()
                if(this.switch.stopped()  == true) {
                    clearInterval(interval)
                }
            }
        },100)
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            if(this.switch && this.switch.handleTap(x,y) == true) {
                this.animate()
            }
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const r = maxDimension/60,wSwitch = maxDimension/20
        context.font = context.font.replace(/\d{2}/,r)
        const w = context.measureText(this.text).width
        canvas.width = 2*w + 4*wSwitch
        canvas.height = 3*r

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.font = ctx.font.replace(/\d{2}/,r)
        ctx.fillText(this.text,w/10,3*r/2)
        if(!this.switch) {
            this.switch = new Switch(1.3*w,3*r/2,r,2.5*wSwitch)
        }
        this.switch.draw(ctx)
        this.img.src = canvas.toDataURL()
    }
}
class Switch {
    constructor(x,y,r,w) {
        this.x = x
        this.y = y
        this.r = r
        this.w = w
        console.log(this.w)
        this.l = 0
        this.dir = 0
    }
    draw(context) {
        context.fillStyle = 'gray'
        this.drawShape(context)
        context.save()
        context.beginPath()
        context.rect(this.x-this.r,this.y-this.r,this.l,2*this.r)
        context.clip()
        context.fillStyle = 'blue'
        this.drawShape(context)
        context.restore()
        context.fillStyle = '#757575'
        context.beginPath()
        context.arc(this.x+this.l-this.r,this.y,1.25*this.r,0,2*Math.PI)
        context.fill()
    }
    drawArc(context,gap,start) {
      var offset = 0
      if(start == false) {
          offset = this.w
      }
      for(var i=0;i<180;i++) {
          const x = (this.x+offset)+this.r*Math.cos((i+gap)*Math.PI/180),y = this.y+this.r*Math.sin((i+gap)*Math.PI/180)
          if(i == 0 && start == true){
              context.moveTo(x,y)
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
        if(this.l >= (this.w+2*this.r)) {
            this.dir = -1
        }
        if(this.l <= 0) {
            this.dir = 1
        }
    }
    update() {
        this.l += (this.dir * (this.w+2*this.r)/5)
        if(this.l > (this.w+2*this.r)) {
            this.dir = 0
            this.l = this.w+2*this.r
        }
        if(this.l < -this.r) {
            this.dir = 0
            this.l = -this.r
        }
    }
    handleTap(x,y) {
        const condtion = x>=this.x-1.25*this.r && x<=this.x+1.25*this.w && y>=this.y-1.25*this.r && y<=this.y+1.25*this.r && this.dir == 0
        if(condtion == true) {
            this.startAnimating()
        }
        return condtion
    }
}
customElements.define('custom-switch',SwitchComponent)
