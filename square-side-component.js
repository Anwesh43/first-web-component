const size = Math.min(window.innerWidth,window.innerHeight)/2
class SquareSideComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectecCallback() {
        this.render()
    }
}
class SquareSide {
    draw(context) {
        context.fillStyle = '#f44336'
        context.save()
        context.translate(size,size)
        for(var i=0;i<4;i++) {
            context.save()
            context.translate(0,-size/3)
            var x = -size/3,y = -size/3
            for(var j=0;j<5;j++) {
                context.save()
                context.translate(x+size/30,y+size/30)
                context.fillRect(-size/30,-size/30,size/15,size/15)
                context.restore()
                x+=size/15
            }
            context.restore()
        }
        context.restore()
    }
    update() {

    }
    stopped() {

    }
}
class SquareSideState {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg+=9
        this.scale = Math.sin(this.deg*Math.PI/180)
        if(this.deg > 180) {
            this.deg = 0
            this.scale = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
