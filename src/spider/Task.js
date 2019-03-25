const { netease } = require('./sites/netease');
const { chinanews } = require('./sites/chinanews');
const { people } = require('./sites/people');
const { sina } = require('./sites/sina');
const { xinhuanet } = require('./sites/xinhuanet');
class SpiderTask {
    constructor() {
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
let spiders = [netease, people, sina, xinhuanet, chinanews];
spiders.forEach((spider) => {
    task.add(spider);
});
task.run();

module.exports = task;