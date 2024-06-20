// pixel buffer with helper functions
export class ImageDataWrapper {
    constructor(state) {
        this.state = state;
        this.ctx = state.ctx;
        this.imgData = this.ctx.createImageData(800, 600);
        this.width = this.imgData.width;
        this.height = this.imgData.height;
        this.px = this.ctx.createImageData(1, 1);
        this.pxd = this.px.data;

        this.getPixel = this.getPixel.bind(this);
        this.setRect = this.setRect.bind(this);
    }

    // returns true on success, false if fail
    setRect(x, y = undefined, width = 1, height = 1, color, keepHistory = true) {
        x = Math.floor(x);
        var p = x;
        if (y !== undefined) {
            y = Math.floor(y);
            p = (x + y * this.width ) * 4;
        }

        if (x < 0 || y < 0 || x >= this.width || y > this.height) return false;

        for (var w = 0; w < width; w++) {
            for (var h = 0; h < height; h++) {
                if (keepHistory) {
                    var d = {x: x + w, y: y + h, old: {}, new: {}};
                    var old = this.getPixel(x + w, y + h);
                    d.old = {r: old.r, g: old.g, b: old.b, a: old.a};
                    d.new = {r: color.r, g: color.g, b: color.b, a: color.a};
            
                    this.state.history.add(d);
                }

                var p = ((x + w) + (y + h) * this.width) * 4;
                this.imgData.data[p] = color.r;
                this.imgData.data[p + 1] = color.g;
                this.imgData.data[p + 2] = color.b;
                this.imgData.data[p + 3] = color.a;
            }
        }

        // preview drawing before canvas is redrawn
        this.ctx.fillStyle = `rgba(${color.r} ${color.g} ${color.b})`;
        // this.ctx.globalAlpha = color.a;
        this.ctx.fillRect(x, y, width, height);
        return true;
    }

    getPixel(x, y = undefined) {
        x = Math.floor(x);
        var p = x;
        if (y !== undefined) {
            y = Math.floor(y);
            p = (x + y * this.width) * 4;
        }
        // console.log('getting', {r: this.imgData.data[p], g: this.imgData.data[p + 1], b: this.imgData.data[p + 2], a: this.imgData.data[p + 3]});
        return {r: this.imgData.data[p], g: this.imgData.data[p + 1], b: this.imgData.data[p + 2], a: this.imgData.data[p + 3]};
    }

    // bresenham
    setLine(x0, y0, x1, y1, color, width = 1, keepHistory = true) {
        var pxs = [] 
        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
            if (x0 > x1) {
                pxs = this.setLineLow(x1, y1, x0, y0, color, width, keepHistory);
            }
            else {
                pxs = this.setLineLow(x0, y0, x1, y1, color, width, keepHistory);
            }
        }
        else {
            if (y0 > y1) {
                pxs = this.setLineHigh(x1, y1, x0, y0, color, width, keepHistory);
            }
            else {
                pxs = this.setLineHigh(x0, y0, x1, y1, color, width, keepHistory);
            }
        }
        return pxs;
    }

    setLineLow(x0, y0, x1, y1, color, width, keepHistory = true){
        var pxs = [];
        var dx = x1 - x0;
        var dy = y1 - y0;
        var yi = 1;
        if (dy < 0) {
            yi = -1;
            dy = -dy;
        }

        var D = 2 * dy - dx;
        var y = y0;

        for (var x = x0; x < x1; x++) {
            this.setRect(x, y, width, width, color, keepHistory);
            pxs.push({x: x, y: y});
            if (D > 0) {
                y += yi;
                D += 2 * (dy - dx);
            }
            else {
                D += 2 * dy;
            }
        }
        return pxs;
    }

    setLineHigh(x0, y0, x1, y1, color, width, keepHistory = true){
        var pxs = [];
        var dx = x1 - x0;
        var dy = y1 - y0;
        var xi = 1;
        if (dx < 0) {
            xi = -1;
            dx = -dx;
        }

        var D = 2 * dx - dy;
        var x = x0;

        for (var y = y0; y < y1; y++) {
            this.setRect(x, y, width, width, color, keepHistory);
            pxs.push({x: x, y: y});
            if (D > 0) {
                x += xi;
                D += 2 * (dx - dy);
            }
            else {
                D += 2 * dx;
            }
        }
        return pxs;
    }

    revertDelta(delta) {
        for (var i = 0; i < delta.length; i++) {
            var p = delta[i];
            this.setRect(p.x, p.y, 1, 1, p.old, false);
        }
    }

    applyDelta(delta) {
        for (var i = 0; i < delta.length; i++) {
            var p = delta[i];
            this.setRect(p.x, p.y, 1, 1, p.new, false);
        }
    }
}