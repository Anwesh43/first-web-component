class AnimationQueue {
    constructor() {
        this.queue = []
    }
    update() {
        if(this.curr) {
            this.curr.update()
        }
    }
    push(cb) {
        this.queue.push(new Animation(cb))
    }
    startUpdating() {
        if(this.queue.length > 0) {
            this.curr = this.queue[0]
            this.curr.startUpdating()
            return true
        }
        return false
    }
    stopped() {
        const stop_condition = this.curr.stopped()
        if(stop_condition) {
            this.queue.splice(0,1)
        }
        return stop_condition
    }
}
class Animation {
    constructor(cb) {
        this.cb = cb
        this.scale = 0
        this.dir = 0
    }
    update() {
        this.scale += this.dir * 0.1
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.cb) {
            this.cb(this.scale)
        }
    }
    startUpdating() {
        this.dir = 1
    }
    stopped() {
        return this.dir == 0
    }
}
