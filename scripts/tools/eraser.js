import Tool from '../core/tool.js';

class Pencil extends Tool {
    constructor() {
        super();
        this.name = "eraser";
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
        state.currentLayer().idw.setRect(this.point.x, this.point.y, this.width, this.width, {r: 0, g: 0, b: 0, a: 0}, true, false);
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
            state.document.draw(state.currentLayer().idw.setLine(this.lastPoint.x, this.lastPoint.y, this.point.x, this.point.y, {r: 0, g: 0, b: 0, a: 0}, this.width, true, true));
        }
        this.lastPoint = {x: x - this.width / 2, y: y - this.width / 2};
    }

    changeWidth(e) {
        this.width = e.target.value;
    }
}

export default new Pencil();