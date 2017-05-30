const maxW = window.innerWidth/4,currW = window.innerWidth/20
class CollapsibleTextComponent extends HTMLElement {
    constructor() {
        super()
        this.text = this.getAttribute('text')||"dummytext"
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.state = {wx:currW,dir:0}
        this.collapsibleButton = new CollapsibleButton()
        // const x = parseFloat(this.getAttribute('x')||"100"),y = parseFloat(this.getAttribute('y')||"100")
        // this.img.style.position = 'absolute'
        // this.img.style.left = x
        // this.img.style.top = y
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.state.wx
        canvas.height = currW
        const context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,currW/2)
        const w = context.measureText(this.text).width
        if(!this.maxW) {
            this.maxW = Math.max(w+2*currW+w/5,2*w)
        }
        context.clearRect(0,0,canvas.width,canvas.height)
        context.fillStyle = 'gray'
        context.fillRect(0,0,canvas.width,canvas.height)
        this.collapsibleButton.draw(context,this.state.wx,this.state.dir)
        context.fillStyle = 'white'
        context.fillText(this.text,currW+w/40,currW/2)
        this.state.wx += this.state.dir * currW/5
        if(this.state.wx > this.maxW) {
            this.state.wx = this.maxW
            this.state.dir= 0
            //console.log(this.state.dir)
            this.collapsibleButton.reset(1)

        }
        if(this.state.wx < currW) {
            this.state.wx = currW
            this.state.dir = 0
            this.collapsibleButton.reset(-1)
            //clearInterval(this.interval)
        }
        this.img.src = canvas.toDataURL()
        //console.log("rendering")
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
          if(this.state.dir == 0) {
            if(this.state.wx <= currW) {
                this.state.dir = 1
                //console.log("start +")
            }
            else if(this.state.wx >= this.maxW){
                this.state.dir = -1
                //console.log("start -")
            }
              const interval = setInterval(()=>{
                  if(this.state.dir == 0) {
                      clearInterval(interval)
                  }
                  this.render()
              },20)
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
        context.rotate(this.rot*Math.PI/180)
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
    reset(dir) {
        this.rot = dir == 1?45:0
    }
}
customElements.define('collapsible-text',CollapsibleTextComponent)
