const fontSize = 60
class TextUtil {
    static changeFont(context,font) {
        context.font = context.font.replace(/\d{2}/,font)
    }
    static getTextSize(context,text) {
        return context.measureText(text).width
    }
}
class AllTextRotatorComponent extends HTMLElement {
    constructor() {
        super()
        this.text = this.getAttribute('text')||'Hello World'
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.textRotator = new AllTextRotator(this.text)
        this.animator = new AllTextRotatingAnimator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        TextUtil.changeFont(context,fontSize)
        const tw = TextUtil.getTextSize(context,this.text)
        canvas.width = 2*tw
        canvas.height = 2*fontSize
        context = canvas.getContext('2d')
        TextUtil.changeFont(context,fontSize)
        this.textRotator.draw(context,canvas.width,canvas.height)
        this.img.src = canvas.toDataURL()
    }
    update(stopcb) {
        this.textRotator.update(stopcb)
    }
    startUpdating(startcb) {
        this.textRotator.startUpdating(startcb)
    }
    connectedCallback() {
        this.render()
        this.img.onclick = () => {
            this.animator.startAnimation()
        }
    }
}
class AllTextRotator {
    constructor(text) {
        this.text = text
        this.j = 0
        this.dir = 1
        this.init()
        this.setCurrentText()
    }
    init() {
        this.iTexts = []
        for(var i=0;i<this.text.length;i++) {
            this.iTexts.push(new IndividualText(this.text.charAt(i)))
        }
    }
    setCurrentText() {
        this.curr = this.iTexts[this.j]
    }
    draw(context,w,h) {
        context.fillStyle = '#212121'
        const currText = this.text.substr(0,this.j)
        const tw = TextUtil.getTextSize(context,currText)
        console.log(currText)
        console.log(context.measureText(currText))
        context.fillText(currText,w/2-(tw)/2,h/2)
        console.log(`${w/2-tw/2},${tw/2+w/2},${w/2},${tw}`)
        if(this.curr.state.scale != 0) {
            this.curr.draw(context,w/2+(tw/2),h/2)
        }
    }
    update(stopcb) {
        this.curr.update()
        if(this.curr.stopped()) {
            this.j += this.dir
            if(this.j ==  this.text.length || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
            }
            this.setCurrentText()
            stopcb()
        }
    }
    startUpdating(startcb) {
        this.curr.startUpdating()
        startcb()
    }
}
class IndividualText {
    constructor(text) {
        this.text = text
        this.state = new IndividualTextState()
    }
    draw(context,x,y) {
        const tw = TextUtil.getTextSize(context,this.text)
        console.log(`${x},${y}`)
        console.log(tw)
        context.save()
        context.translate(x+tw/2,y-fontSize/4)
        context.rotate(2*Math.PI*(this.state.scale))
        context.fillText(this.text,-tw/2,fontSize/4)
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    startUpdating() {
        this.state.startUpdating()
    }
}
class IndividualTextState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prev_scale = 0
    }
    update() {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prev_scale) > 1) {
            this.scale = this.prev_scale + this.dir
            this.dir = 0
            this.prev_scale = this.scale
            console.log(this.scale)
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
    }
    stopped() {
        return this.dir == 0
    }
}
class AllTextRotatingAnimator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation() {
        if(!this.animated) {
            this.component.startUpdating(()=>{
                this.animated = true
            })
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update(()=>{
                    this.animated = false
                    clearInterval(interval)
                    this.component.render()
                })
            },50)
        }
    }
}
customElements.define('all-text-rotator-comp',AllTextRotatorComponent)
