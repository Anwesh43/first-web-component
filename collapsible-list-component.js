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
        this.collapButton = new CollapsibleButton()
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth/3
        const fontSize = h/20
        canvas.height = (fontSize*2)*(this.elements.length+1)
        const context = canvas.getContext('2d')
        context.fillStyle = '#E0E0E0'
        context.fillRect(0,0,canvas.width,2*fontSize)
        this.collapButton.draw(context,0.8*canvas.width,fontSize,fontSize/2)
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
customElements.define('collap-list',CollapsibleListComponent)
