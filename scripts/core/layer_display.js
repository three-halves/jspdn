export class LayerDisplay {
    constructor(layerManager) {
        this.manager = layerManager;
        this.container = document.getElementById("layer-list");

        this.refresh = this.refresh.bind(this);
        this.refresh();
    }

    refresh() {
        this.container.textContent = "";
        this.manager.layers.forEach((layer) => {
            if (layer.hidden) return;
            this.container.appendChild(this.makeDisplay(layer));
        });
    }

    makeDisplay(layer) {
        var display = document.createElement('div');
        if (this.manager.currentLayer === layer) display.classList.add('selected');

        var button = document.createElement('button');
        button.innerHTML = layer.name;
        display.classList.add('layer-display')
        button.onclick = () => this.manager.selectLayer(layer);
        display.appendChild(button);

        var upButton = document.createElement('button');
        upButton.innerHTML = "^";
        upButton.onclick = () => this.manager.moveLayerOrder(layer, -1);
        display.appendChild(upButton);

        var downButton = document.createElement('button');
        downButton.innerHTML = "v";
        downButton.onclick = () => this.manager.moveLayerOrder(layer, 1);
        display.appendChild(downButton);


        return display;
    }
}