const size = Math.min(window.innerWidth,window.innerHeight)/2
class FoldingLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'true'})
        this.img = document.createElement('img')
        this.n = this.getAttibute('n')||5
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('img')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
