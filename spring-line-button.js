var w = window.innerWidth,h = window.innerHeight
class SpringLineButton extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        var canvas = document.createElement('canvas')
        canvas.width = w/6
        canvas.height = h/25
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    componentDidMount() {
        this.render()
    }
}
