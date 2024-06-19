import { interpColor } from "../utils.js";
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

        this.merge = this.merge.bind(this);
    }

    merge(other) {
        for (var x = 1; x < this.idw.width; x++) {
            for (var y = 1; y < this.idw.height; y++) {
                var otherColor = other.idw.getPixel(x, y);
                if (otherColor.a === 0) continue;

                var c = interpColor(this.idw.getPixel(x, y), otherColor);
                var p = (x + y * this.idw.width) * 4;
                this.idw.imgData.data[p] = c.r;
                this.idw.imgData.data[p + 1] = c.g;
                this.idw.imgData.data[p + 2] = c.b;
                this.idw.imgData.data[p + 3] = c.a;
            }
        }
    }
}