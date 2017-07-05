class ColorFilterWrapperComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        const color = this.getAttribute('color') || 'red'
        const children = this.children
        this.imgs = []
        for(var i=0;i<children.length;i++) {
            const tag = children[i].tagName
            if(tag && tag == "IMG") {
                this.imgs.push(children[i])
                shadow.appendChild(children[i])
            }
        }
    }
    render() {
        
    }
    connectedCallback() {
        this.render()
    }
}
customElements.define('color-filter-wrapper',ColorFilterWrapperComponent)
