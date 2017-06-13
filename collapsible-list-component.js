const w = window.innerWidth
const h = window.innerHeight
class CollapsibleListComponent  extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.elements = []
        for(var index = 0;index<this.children.length;index++) {
              const child = this.children[index]
              this.elements.push(child.innerHTML)
        }
        this.listContainer = new ListContainer()
        this.collapButton = new CollapsibleButton()
        this.animationHandler = new AnimationHandler(this)
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            if(this.collapButton.handleTap(x,y) == true) {
                this.animationHandler.start()
            }
        }
    }
    update(dir) {
        this.collapButton(dir)
        this.listContainer.update(dir)
    }
    setEdgeValue(dir) {
        this.collapButton.setEdgeValue(dir)
        this.listContainer.setEdgeValue(dir)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth/3
        const fontSize = h/20
        canvas.height = (fontSize*2)*(this.elements.length+1)
        const context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,`${fontSize}`)
        context.fillStyle = '#E0E0E0'
        context.fillRect(0,0,canvas.width,2*fontSize)
        this.collapButton.draw(context,0.8*canvas.width,fontSize,fontSize/2)
        this.listContainer.draw(context,fontSize*2,canvas.width,fontSize,this.elements)
        this.img.src = canvas.toDataURL()
    }
}
class CollapsibleButton {
    constructor() {
        this.rot = 0
    }
    draw(context,x,y,r) {
        if(!this.x && !this.y && !this.r) {
            this.x = x
            this.y = y
            this.r = r
        }
        context.lineWidth = r/6
        context.lineCap = 'round'
        context.strokeStyle = 'black'
        context.save()
        context.translate(x,y)
        context.rotate(this.rot*Math.PI/180)
        for(var i=0;i<2;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.beginPath()
            context.moveTo(0,-r)
            context.lineTo(0,r)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    setEdgeValue(dir) {
        this.rot = 0
        if(dir == 1) {
            this.rot = 90
        }
    }
    update(dir) {
        this.rot += 18*dir
    }
    handleTap(x,y) {
       return x >= this.x -this.r && x <= this.x + this.r && y>= this.y - this.r && y <= this.y + this.r
    }
}
class ListContainer {
    constructor() {
        this.scale = 0
        this.listItems = []
    }
    draw(context,y,w,fontSize,elements) {
        if(this.listItems.length == 0) {
            this.listItems = elements.map((element)=>new ListItem(element))
        }
        context.save()
        context.translate(0,y)
        context.scale(1,this.scale)
        context.fillRect(0,0,w,fontSize*2*elements.length)
        this.listItems.forEach((listItem,index)=>{
            listItem.draw(context,w/2,(2*fontSize)*index+2*fontSize+fontSize)
        })
        context.restore()
    }
    setEdgeValue(dir) {
        this.scale = 0
        if(dir == 1) {
            this.scale = 1
        }
    }
    update(dir) {
        this.scale += 0.2*dir
    }
}
class ListItem {
    constructor(text) {
        this.text = text
    }
    draw(context,x,y) {
        const tw = context.measureText(this.text).width
        context.fillStyle = 'black'
        context.fillText(this.text,x-tw/2,y)
    }
}
class AnimationHandler {
    constructor(component) {
        this.time = 0
        this.dir = 0
        this.prevDir = -1
        this.component = component
    }
    start() {
        if(this.dir == 0) {
            this.dir = -1*this.prevDir
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update(this.dir)
                this.time++
                if(this.time == 6) {
                    clearInterval(interval)
                    this.component.setEdgeValue(this.dir)
                    this.prevDir = this.dir
                    this.dir == 0
                }
          },100)
        }
    }
}
customElements.define('collap-list',CollapsibleListComponent)
