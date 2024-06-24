import Tool from '../core/tool.js';

class Line extends Tool {
    constructor() {
        super();
        this.name = "line";
        this.startPoint = undefined;
        this.endPoint = undefined;
        this.optionsElement = document.getElementById("tool-options");

        this.changeWidth = this.changeWidth.bind(this);
        this.width = 1;
    }

    initTool() {
        this.startPoint = undefined;
        this.endPoint = undefined;

        // make options bar for tool
        // TODO find better way to do this
        var el = document.createElement('p');
        el.innerHTML = 'width: ';
        this.optionsElement.appendChild(el);
        el = document.createElement('input');
        el.type = 'range';
        el.min = 1;
        el.max = 25;
        el.value = this.width;
        el.classList.add('slider');
        el.addEventListener('change', this.changeWidth);
        this.optionsElement.appendChild(el);
    }

    handleMouseDown(event, state, x, y) {
        state.history.new();

        this.startPoint = { x, y };
        // state.currentLayer().idw.setPixel(x, y, state.primaryColor);
    }

    handleMouseUp(event, state, x, y) {
        this.endPoint = { x, y };

        if (this.startPoint !== undefined) state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor, this.width, true);

        state.history.push();
        state.document.layerManager.applyScratchLayer();
        state.document.draw();
    }

    handleMouseMove(event, state, x, y) {
        if (state.mouseEnter <= 0) return;
        // clear last line preview
        if (this.endPoint !== undefined) state.document.draw(state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, {r: 0, g: 0, b: 0, a: 0}, this.width, false));
        this.endPoint = { x, y };

        state.document.layerManager.getScratchLayer().idw.setLine(this.endPoint.x, this.endPoint.y, this.startPoint.x, this.startPoint.y, state.primaryColor, this.width, false);
    }

    changeWidth(e) {
        console.log("change width: " + e.target.value);
        this.width = e.target.value;
    }
}

export default new Line();