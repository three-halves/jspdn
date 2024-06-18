import { over } from "../utils.js";
import { LayerManager } from "./layer_manager.js";

export class JspdnDocument {
    constructor(state) {
        this.state = state;

        this.name = "new document";
        this.layerManager = new LayerManager(this.state);

        this.width = 800;
        this.height = 600;

        this.finalImgData = this.state.ctx.createImageData(this.width, this.height);

        this.draw = this.draw.bind(this);
    }

    getCompositeColor(x, y) {
        var comColor = {r: 0, g: 0, b: 0, a: 0};
        var layers = [];
        layers.push(...this.layerManager.layers);
        if (this.layerManager.scratchLayer !== undefined) layers.push(this.layerManager.scratchLayer);

        layers.forEach((layer) => {
            var curColor = layer.idw.getPixel(x, y);

            if (curColor.a !== 0) comColor = over(curColor, comColor);
        });

        return comColor;
    }
    

    draw() {
        for (var x = 1; x < this.width; x++) {
            for (var y = 1; y < this.height; y++) {
                // console.log(x,y);
                var c = this.getCompositeColor(x, y);
                var p = (x + y * this.width - 1) * 4;
                this.finalImgData.data[p] = c.r;
                this.finalImgData.data[p + 1] = c.g;
                this.finalImgData.data[p + 2] = c.b;
                this.finalImgData.data[p + 3] = c.a;
            }
        }

        this.state.ctx.putImageData(this.finalImgData, 1, 0);
    }
}