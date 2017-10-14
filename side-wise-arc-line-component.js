const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class SideWiseArcLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class SideWiseArcLine {
    constructor(i) {
        this.i = i
        this.x = (this.i%2)*(0.8*size)+size*0.1
        this.y = i*0.2*size+0.1*size
    }
    draw(context) {
        context.beginPath()
        for(var i=0;i<=360;i++) {
            const x = 0.1*size*Math.cos(i*Math.PI/180), y = 0.1*size*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
    }
    update() {

    }
    startUpdating() {

    }
    stopped() {

    }
}
