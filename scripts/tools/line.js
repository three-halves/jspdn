import Tool from '../core/tool.js';

class Line extends Tool {
    constructor() {
        super();
        this.name = "line";
        this.startPoint = undefined;
        this.endPoint = undefined;
    }

    initTool() {
        this.startPoint = undefined;
        this.endPoint = undefined;
    }

    handleMouseDown(event, state, x, y) {
        state.history.new();

        this.startPoint = { x, y };
        state.currentLayer().idw.setPixel(x, y, state.primaryColor);
    }

    handleMouseUp(event, state, x, y) {
        this.endPoint = { x, y };

        if (this.startPoint !== undefined) state.currentLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor);

        state.history.push();
        state.document.draw();
    }

    handleMouseMove(event, state, x, y) {
        if (state.mouseEnter <= 0) return;
        this.endPoint = { x, y };

        // state.idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor);
    }
}

export default new Line();