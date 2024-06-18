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
        // state.currentLayer().idw.setPixel(x, y, state.primaryColor);
    }

    handleMouseUp(event, state, x, y) {
        this.endPoint = { x, y };

        if (this.startPoint !== undefined) state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor, true);

        state.history.push();
        state.document.layerManager.applyScratchLayer();
        state.document.draw();
    }

    handleMouseMove(event, state, x, y) {
        if (state.mouseEnter <= 0) return;
        if (this.endPoint !== undefined) state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, {r: 0, g: 0, b: 0, a: 0}, false);
        this.endPoint = { x, y };

        state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor, false);
        state.document.draw();
    }
}

export default new Line();