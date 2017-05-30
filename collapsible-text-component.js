const maxW = window.innerWidth/10,currW = window.innerWidth/20
class CollapsibleTextComponent extends HTMLElement {
    constructor() {
        this.text = this.getAttribute('text')
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.state = {wx:currW,dir:0}
        this.collapsibleButton = new CollapsibleButton()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.state.wx
        canvas.height = window.innerHeight/10
        const context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,30)
        const w = context.measureText(this.text).width
        context.clearRect(0,0,canvas.width,canvas.height)
        context.fillStyle = 'gray'
        context.fillRect(0,0,canvas.width,canvas.height)
        collapsibleButton.draw(context,this.wx,this.dir)
        this.wx += this.dir * currW/5
        if(this.wx >= maxW) {
            this.wx = maxW
            this.dir= 0
        }
        if(this.wx <= currW) {
            this.wx = currW
            this.dir = 0
        }
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
          if(this.dir == 0) {
              const interval = setInterval(()=>{
                  if(this.wx <= currW) {
                      this.dir = 1
                  }
                  else if(this.wx >= maxW){
                      this.dir = -1
                  }
              },100)
           }
       }
    }
}
class CollapsibleButton {
    constructor() {
        this.rot = 0
    }
    draw(context,w,dir) {
        const r = currW/2
        context.fillStyle = 'white'
        context.strokeStyle = 'black'
        context.lineWidth = r/10
        context.save()
        context.translate(w-r,r)
        context.rotate(this.rot)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        for(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.beginPath()
            context.moveTo(0,-r/2)
            context.lineTo(0,r/2)
            context.stroke()
            context.restore()
        }
        context.restore()
        this.rot += 9*dir
    }
}
