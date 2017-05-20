class CounterComponent extends HTMLElement {
    constructor() {
        super()

    }
    connectedCallback() {
        var i = 0
        setInterval(()=>{
              this.textContent = ""+i
              i++
        },1000)
    }
}
customElements.define('counter-comp',CounterComponent)
