class LinksListComponent extends HTMLElement {
    constructor() {
        super()
        this.words = this.getAttribute('words').split(" ")
        const shadow = this.attachShadow({mode:'open'})
    }
    addElements(shadow,words) {

    }
    connectedCallback() {

    }
}
