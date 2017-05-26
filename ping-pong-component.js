class PingPongComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
    }
    startLoop() {
        const interval = setInterval(()=>{

        },100)
    }
    connectedCallback() {
        this.startLoop()
    }
}
customElements.define('ping-pong',PingPongComponent)
