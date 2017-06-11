class SwitchComponent extends HTMLElement{
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {

    }
    render() {
    }
}
