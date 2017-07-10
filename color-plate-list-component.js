const w = window.innerWidth,h = window.innerWidth,size = Math.min(w,h)/2
class ColorPlateListComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.initColors()
    }
    initColors() {
        this.colors = []
        const children = this.children
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            if(child.tagName == "COLOR") {
                this.colors.push(child.innerHTML)
            }
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size/2
        canvas.height = size/2
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallbac() {
        this.render()
    }
}
customElements.define('color-plate-list',ColorPlateListComponent)
