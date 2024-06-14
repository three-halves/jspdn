import { ImageDataWrapper } from "./image_data_wrapper.js";

export class Layer {
    constructor(state, name, hidden=false, opacity = 1.0) {
        this.state = state;
        this.idw = new ImageDataWrapper(this.state);
        this.name = name;
        // display in layer list hidden
        this.hidden = hidden;
        // content of layer hidden
        this.disabled = false;
        this.opacity = opacity;
    }
}