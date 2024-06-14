import { Layer } from "./layer.js";
import { LayerDisplay } from "./layer_display.js";

export class LayerManager {
    constructor(state) {
        this.state = state;
        this.layers = [new Layer(this.state, 'base')];

        this.currentLayer = this.layers[0];
        this.display = new LayerDisplay(this);

        this.layerCount = 1;

        document.getElementById("add-layer-button").onclick = () => { 
            this.addLayer()
            this.selectLayer(this.layers[this.layers.length - 1]);
        };
        document.getElementById("remove-layer-button").onclick = () => this.removeLayer(this.currentLayer);
    }

    // TODO Optimize refresh calls
    addLayer(name = '') {
        if (this.layerCount > 10) return;
        
        if (name === '') name = 'layer ' + this.layerCount;
        var l = new Layer(this.state, name);
        this.layers.push(l);
        this.layerCount++;
        this.display.refresh();
    }

    removeLayer(layer) {
        if (this.layerCount <= 1) return;

        var i = this.layers.indexOf(layer);
        this.layers.splice(i, 1);
        this.layerCount--;
        this.selectLayer(this.layers[Math.min(i, this.layers.length - 1)]);
        this.display.refresh();
    }

    selectLayer(layer) {
        this.currentLayer = layer;
        this.display.refresh();
        this.state.document.draw();
    }

    moveLayerOrder(layer, diff)
    {
        var i = this.layers.indexOf(layer);

        if (i + diff < 0 || i + diff > this.layers.length - 1) return;

        this.layers.splice(i, 1);
        this.layers.splice(i + diff, 0, layer);

        this.display.refresh();
        this.state.document.draw();
    }


}