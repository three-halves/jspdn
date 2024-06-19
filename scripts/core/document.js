import { interpColor } from "../utils.js";
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
        this.drawPx = this.drawPx.bind(this);

    }

    getCompositeColor(x, y = undefined) {
        var p = x;
        if (y !== undefined) {
            p = (x + y * this.width - 1) * 4; 
        }

        var comColor = {r: 0, g: 0, b: 0, a: 0};
        var layers = [];
        layers.push(...this.layerManager.layers);
        if (this.layerManager.scratchLayer !== undefined) layers.push(this.layerManager.scratchLayer);

        layers.forEach((layer) => {
            var curColor = layer.idw.getPixel(p);

            if (curColor.a !== 0) comColor = interpColor(curColor, comColor);
        });

        return comColor;
    }    

    draw(pxs = []) {
        // draw full canvas if pixels not given
        if (pxs.length === 0) {
            for (var x = 1; x < this.width; x++) {
                for (var y = 1; y < this.height; y++) {
                    this.drawPx(x, y);
                }
            }
        }
        else {
            pxs.forEach((px) => {
                this.drawPx(px.x, px.y);
            });
        }

        this.state.ctx.putImageData(this.finalImgData, 1, 0);
    }

    drawPx(x, y = undefined) {
        var p = x;
        if (y !== undefined) {
            p = (x + y * this.width - 1) * 4; 
        }
        var c = this.getCompositeColor(p);
        this.finalImgData.data[p] = c.r;
        this.finalImgData.data[p + 1] = c.g;
        this.finalImgData.data[p + 2] = c.b;
        this.finalImgData.data[p + 3] = c.a;
    }
}