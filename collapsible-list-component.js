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
        context.fillRect(0,0,canvas.width,canvas.height)
        this.img.src = canvas.toDataURL()
    }
}
customElements.define('collap-list',CollapsibleListComponent)
