import { interpColor } from "../utils.js";
import { ImageDataWrapper } from "./image_data_wrapper.js";

export class Layer {
    constructor(state, name, hidden=false, alpha = 1.0) {
        this.state = state;
        this.idw = new ImageDataWrapper(this.state);
        this.name = name;
        // display in layer list hidden
        this.hidden = hidden;
        // content of layer hidden
        this.disabled = false;
        this.alpha = alpha;

        this.merge = this.mergeWith.bind(this);
        this.isValidPixel = this.isValidPixel.bind(this);
    }

    mergeWith(other, keepHistory = true) {
        this.state.history.new();
        for (var x = 1; x < this.idw.width; x++) {
            for (var y = 1; y < this.idw.height; y++) {
                var otherColor = other.idw.getPixel(x, y);
                if (otherColor.a === 0) continue;

                if (keepHistory) {
                    var d = {x: x, y: y, old: {}, new: {}};
                    var old = this.idw.getPixel(x, y);
                    d.old = {r: old.r, g: old.g, b: old.b, a: old.a};
                    d.new = {r: otherColor.r, g: otherColor.g, b: otherColor.b, a: otherColor.a};
            
                    this.state.history.add(d);
                }

                var c = interpColor(otherColor, this.idw.getPixel(x, y));
                var p = (x + y * this.idw.width) * 4;
                this.idw.imgData.data[p] = c.r;
                this.idw.imgData.data[p + 1] = c.g;
                this.idw.imgData.data[p + 2] = c.b;
                this.idw.imgData.data[p + 3] = c.a;
            }
        }

        this.state.history.push();
    }

    isValidPixel(x, y) {
        return (!(x < 0 || y < 0 || x >= this.idw.width || y > this.idw.height));
    }
}