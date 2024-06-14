import Tool from '../core/tool.js';

class Pencil extends Tool {
    constructor() {
        super();
        this.name = "pencil";
        this.point = undefined;
        this.lastPoint = undefined;
    }

    initTool() {
        this.point = undefined;
        this.lastPoint = undefined;
    }

    handleMouseDown(event, state, x, y) {
        state.history.new();

        this.point = { x, y };
        state.currentLayer().idw.setPixel(x, y, state.primaryColor);
        // console.log(state.currentLayer);

    }

    handleMouseUp(event, state, x, y) {
        this.point = undefined;
        this.lastPoint = undefined;

        state.history.push();
        state.document.draw();
    }

    handleMouseMove(event, state, x, y) {
        if (state.mouseEnter <= 0) return;
        this.point = { x, y };

        // place pixel
        if (this.lastPoint !== undefined) state.currentLayer().idw.setLine(this.lastPoint.x, this.lastPoint.y, this.point.x, this.point.y, state.primaryColor);

        this.lastPoint = { x, y };
    }
}

export default new Pencil();