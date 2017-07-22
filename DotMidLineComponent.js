const w = window.innerWidth,h = window.innerHeight
class DotMidLineComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {

    }
    connectedCallback(){

    }
}
