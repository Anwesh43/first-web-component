const w = window.innerWidth,h = window.innerHeight
class CircleArrangedBallComponent extrnds HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/3
        canvas.height = w/3
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class CircleArrangedBall {
    constructor(n,w,h) {
        this.n = n
        this.w = w
        this.h = h
    }
    draw(context) {
        var r = Math.min(w,h)/3
        context.fillStyle = "#f44336"
        for(var i=0;i<this.n;i++) {

        }
    }
}
