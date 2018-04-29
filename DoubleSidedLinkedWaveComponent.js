const w = window.innerWidth, h = window.innerHeight
class DoubleSidedLinkedWaveComponent extends HTMLElement {

    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode: 'open'})
        shadow.appendChild(this.img)
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        this.img.src = canvas.toDataURL()
    }

    connectedCallback() {
        this.render()
    }
}

customElements.define('dsl-wave', DoubleSidedLinkedWaveComponent)
