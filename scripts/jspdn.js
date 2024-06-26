import { hexToRgb } from './utils.js';
import { State } from './core/state.js';

console.log('there i am');

let ctx = undefined;
let state = undefined;

function init() {
    const canvas = document.getElementById('canvas');
    console.log(document.getElementById('canvas'))
    ctx = canvas.getContext('2d');
    state = new State(ctx);
    console.log(state.idw);

    document.addEventListener('mousedown', function(e) {
        handleMouseDown(canvas, e);
    })

    document.addEventListener('mouseup', function(e) {
        handleMouseUp(canvas, e);
    })

    document.addEventListener('mousemove', function(e) {
        handleMouseMove(canvas, e);
    })

    document.getElementById("primaryColor").addEventListener('input', function(e) {
        setColor(this.value);
    });

    document.getElementById("undo").addEventListener('click', function(e) {
        undo(state);
    });

    document.getElementById("redo").addEventListener('click', function(e) {
        redo(state);
    });

    // hotkeys
    document.addEventListener("keydown", function(e) {
        // console.log(e.key);
        switch((e.key).toLowerCase()) {
            case 'z': undo(state); break;
            case 'x': redo(state); break;
        }
    });

}

window.addEventListener('load', function(e) {
    init();
});

function handleMouseDown(canvas, event) {
    let pos = getCursorPosOnCanvas(canvas, event);

    state.mouseEnter = 1;

    state.currentTool.handleMouseDown(event, state, pos.x, pos.y);
}

function handleMouseUp(canvas, event) {
    let pos = getCursorPosOnCanvas(canvas, event);

    state.mouseEnter = 0;

    state.currentTool.handleMouseUp(event, state, pos.x, pos.y);
}

function handleMouseMove(canvas, event) {
    let pos = getCursorPosOnCanvas(canvas, event);

    state.currentTool.handleMouseMove(event, state, pos.x, pos.y);
}

function getCursorPosOnCanvas(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    return {x, y};
}

function setColor(color) {
    color = hexToRgb(color);
    state.primaryColor.r = color.r;
    state.primaryColor.g = color.g;
    state.primaryColor.b = color.b;
    state.primaryColor.a = 255;
    
}

function undo(state) {
    if (state.history.position > (state.history.data.length - 1)) return;
    
    state.history.position += 1;
    var d = state.history.data[state.history.data.length - state.history.position];
    d.layer.idw.revertDelta(d.ev);
    state.document.draw();
}

function redo(state) {
    if (state.history.position === 0) return;

    state.history.position -= 1;
    var d = state.history.data[state.history.data.length - state.history.position - 1];
    d.layer.idw.applyDelta(d.ev);
    state.document.draw();
}
