
class SpiderTask {
    constructor(key) {
        this.taskStack = new Set();
    }
    add(spider) {
        this.taskStack.add(spider);
        return this.taskStack;
    }
    delete(spider) {
        this.taskStack.delete(spider);
    }
    run(spider) {
        if (spider) {
            spider.run();
        } else {
            this.taskStack.forEach((item) => {
                item.run();
            });
        }
    }
    pause(spider) {
        if (spider) {
            spider.pause();
        } else {
            this.taskStack.forEach((item) => {
                item.run();
            });
        }
    }
    restart(spider) {
        if (spider) {
            spider.restart();
        } else {
            this.taskStack.forEach((item) => {
                item.run();
            });
        }
    }
    status(spider){

    }
}
let task = new SpiderTask();
module.exports = task;
