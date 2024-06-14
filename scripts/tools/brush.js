import Tool from '../core/tool.js';

class Pencil extends Tool {
    constructor() {
        super();
        this.name = "brush";
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
        if (this.lastPoint !== undefined) 
        {
            for (var dx = 0; dx < 4; dx++) {
                for (var dy = 0; dy < 4; dy++) {
                    state.currentLayer().idw.setLine(this.lastPoint.x + dx, this.lastPoint.y + dy, this.point.x + dx, this.point.y + dy, state.primaryColor);
                }
            }
        }
        this.lastPoint = { x, y };
    }
}

export default new Pencil();