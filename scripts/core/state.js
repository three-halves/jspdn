import { ImageDataWrapper } from './image_data_wrapper.js';
import { DeltaHistory } from './history.js';
import { Toolbar } from './toolbar.js';
import { JspdnDocument } from './document.js';

// state for the application as a whole
export class State {
    constructor(ctx) {
        // default tool now set by toolbar
        // this.currentTool = pencil;
        this.primaryColor = {r: 0, g: 0, b: 0, a: 255};
        this.secondaryColor = {r: 255, g: 255, b: 255, a: 255};
        this.mouseEnter = 0;
        this.ctx = ctx;
        this.idw = new ImageDataWrapper(this);
        this.history = new DeltaHistory(this);
        this.toolbar = new Toolbar(this);
        this.document = new JspdnDocument(this);
        
        this.currentLayer = this.currentLayer.bind(this);
    }

    // shorthand for tools
    currentLayer() {
        return this.document.layerManager.currentLayer;
    }
}