class PacManComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.state = {deg:0,x:window.innerWidth/5,y:window.innerHeight/5,lx:0,ly:0,a:0,dir:1}
    }
    update() {
        this.state.x += this.state.lx*20
        this.state.y += this.state.ly*20
        this.state.a += 10 * (this.state.dir)
        if(this.state.a == 40 || this.state.a < 0) {
            this.state.dir *= -1
            console.log(`updated ${this.state.dir}`)
        }
        this.img.style.position = 'absolute'
        this.img.style.left = this.state.x
        this.img.style.top = this.state.y
    }
    draw() {
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth/10
        canvas.height = window.innerWidth/10
        const context = canvas.getContext('2d')
        context.fillStyle = '#FF5722'
        context.clearRect(0,0,canvas.width,canvas.height)
        context.save()
        context.translate(canvas.width/2,canvas.height/2)
        context.rotate(this.state.deg*Math.PI/180)
        context.beginPath()
        const r = canvas.width/2
        context.moveTo(0,0)
        for(var i=this.state.a;i<=360-this.state.a;i++) {
            const x = r*Math.cos(i*Math.PI/180),y = r*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.lineTo(0,0)
        context.fill()
        context.restore()
        this.update()
        this.img.src = canvas.toDataURL()
    }
    setState(obj) {
        this.state = Object.assign({},this.state,obj)
    }
    connectedCallback() {
        window.onkeydown = (event)=>{
            switch(event.keyCode) {
                case 38:
                    this.setState({deg:-90,lx:0,ly:-1})
                    break
                case 40:
                    this.setState({deg:90,lx:0,ly:1})
                    break
                case 37:
                    this.setState({deg:180,lx:-1,ly:0})
                    break
                case 39:
                    this.setState({deg:0,lx:1,ly:0})
                    break
                default:
                    break
            }
        }
        setInterval(()=>{
            this.draw()
        },100)
    }
}
customElements.define('pac-man',PacManComponent)
