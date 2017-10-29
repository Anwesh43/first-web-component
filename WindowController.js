class WindowController {
    constructor(cb) {
        this.setSize()
    }
    setSize() {
      this.w = window.innerWidth
      this.h = window.innerHeight
    }
    adjustOnResize(cb) {
        window.onresize = ()=>{
            this.setSize()
            cb()
        }
    }
}
