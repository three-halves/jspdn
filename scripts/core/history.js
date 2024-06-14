export class DeltaHistory {
    constructor(state) {
        this.state = state;
        this.data = [];
        this.nextEvent = [];
        // distance from front
        this.position = 0;
    }

    new() {
        this.nextEvent = [];
    }

    add(delta) {
        // don't add if canvas not changed
        if (JSON.stringify(delta.new) === JSON.stringify(delta.old)) return;
        this.nextEvent.push(delta); 
    }

    push() {
        // working tree clean
        if (this.nextEvent.length === 0) return;

        // rebase
        if (this.position > 0) {
            for (var i = 0; i < this.position; i++) {
                this.data.pop();
            }
            this.position = 0;
        }

        this.data.push({ev: this.nextEvent,  layer: this.state.currentLayer()});
        // console.log(this.data);
    }
}
