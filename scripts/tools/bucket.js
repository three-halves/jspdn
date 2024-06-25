import Tool from '../core/tool.js';
import { fourWayDeltas } from '../utils.js';

class Bucket extends Tool {
    constructor() {
        super();
        this.name = "bucket";
        // this.tolerance = 0;
        this.optionsElement = document.getElementById("tool-options");

        // this.changeTolerance = this.changeTolerance.bind(this);
    }

    initTool() {

    }

    handleMouseDown(event, state, x, y) {
        state.history.new();
        this.fillHelper(state, x, y, state.primaryColor, state.currentLayer().idw.getPixel(x, y))
        state.history.push();
        state.document.draw();
    }

    // span fill
    fillHelper(state, x, y, fillColor, checkColor) {
        if (!this.fillCheck(state, x, y, checkColor)) return;
        if (JSON.stringify(fillColor) === JSON.stringify(checkColor)) return;

        var s = [{x, y}];
        while (s.length > 0) {
            var px = s.pop();
            var lx = px.x;
            while (this.fillCheck(state, lx - 1, px.y, checkColor)) {
                state.currentLayer().idw.setRect(lx - 1, px.y, 1, 1, fillColor, true, false);
                lx--;
            }
            while (this.fillCheck(state, px.x, px.y, checkColor)) {
                state.currentLayer().idw.setRect(px.x, px.y, 1, 1, fillColor, true, false);
                px.x++;
            }
            this.scan(state, checkColor, lx, px.x - 1, px.y + 1, s);
            this.scan(state, checkColor, lx, px.x - 1, px.y - 1, s);
        }
    }

    scan(state, checkColor, lx, rx, y, s) {
        var added = false;
        for (var x = lx; x < rx; x++) {
            if (!this.fillCheck(state, x, y, checkColor)) {
                added = false
            }
            else if (!added) {
                s.push({x: x, y: y});
                added = true;
            }
        }
    }

    fillCheck(state, x, y, checkColor) {
        if (!state.currentLayer().isValidPixel(x, y)) return false;
        return (JSON.stringify(state.currentLayer().idw.getPixel(x, y)) === JSON.stringify(checkColor));
    }

    handleMouseUp(event, state, x, y) {

    }

    handleMouseMove(event, state, x, y) {

    }

    // changeTolerance(e) {
    //     this.tolerance = e.target.value;
    // }
}

export default new Bucket();