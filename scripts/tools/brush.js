import Tool from '../core/tool.js';

class Pencil extends Tool {
    constructor() {
        super();
        this.name = "brush";
        this.point = undefined;
        this.lastPoint = undefined;
        this.optionsElement = document.getElementById("tool-options");

        this.changeWidth = this.changeWidth.bind(this);
        this.width = 4;
    }

    initTool() {
        this.point = undefined;
        this.lastPoint = undefined;

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

        this.point = {x: x - this.width / 2, y: y - this.width / 2};
        state.currentLayer().idw.setRect(this.point.x, this.point.y, this.width, this.width, state.primaryColor);
        this.lastPoint = {x: x - this.width / 2, y: y - this.width / 2};
    }

    handleMouseUp(event, state, x, y) {
        this.point = undefined;
        this.lastPoint = undefined;

        state.history.push();
        state.document.draw();
    }

    handleMouseMove(event, state, x, y) {
        if (state.mouseEnter <= 0) return;
        this.point = {x: x - this.width / 2, y: y - this.width / 2};

        // place pixel
        if (this.lastPoint !== undefined) 
        {
            state.currentLayer().idw.setLine(this.lastPoint.x, this.lastPoint.y, this.point.x, this.point.y, state.primaryColor, this.width);
        }
        this.lastPoint = {x: x - this.width / 2, y: y - this.width / 2};
    }

    changeWidth(e) {
        this.width = e.target.value;
    }
}

export default new Pencil();