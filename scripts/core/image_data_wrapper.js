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
        this.setPixel = this.setPixel.bind(this);
    }

    // returns true on success, false if fail
    setPixel(x, y, color, keepHistory = true) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || y < 0 || x > this.width || y > this.height) return false;

        this.pxd[0] = color.r;
        this.pxd[1] = color.g;
        this.pxd[2] = color.b;
        this.pxd[3] = color.a;
        // console.log(this.imgData.data);
        if (keepHistory) {
            var d = {x: x, y: y, old: {}, new: {}};
            var old = this.getPixel(x, y);
            d.old = {r: old.r, g: old.g, b: old.b, a: old.a};
            d.new = {r: color.r, g: color.g, b: color.b, a: color.a};
    
            this.state.history.add(d);
        }

        var p = (x + y * this.width - 1) * 4;
        this.imgData.data[p] = color.r;
        this.imgData.data[p + 1] = color.g;
        this.imgData.data[p + 2] = color.b;
        this.imgData.data[p + 3] = color.a;

        this.ctx.putImageData(this.px, x, y);
        return true;
    }

    // swap() {
    //     // console.log('swap');
    //     this.ctx.putImageData(this.imgData, 1, 0);
    // }

    getPixel(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        var p = (x + y * this.width - 1) * 4;
        // console.log('getting', {r: this.imgData.data[p], g: this.imgData.data[p + 1], b: this.imgData.data[p + 2], a: this.imgData.data[p + 3]});
        return {r: this.imgData.data[p], g: this.imgData.data[p + 1], b: this.imgData.data[p + 2], a: this.imgData.data[p + 3]};
    }

    // bresenham
    setLine(x0, y0, x1, y1, color, keepHistory = true) {
        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
            if (x0 > x1) {
                this.setLineLow(x1, y1, x0, y0, color, keepHistory);
            }
            else {
                this.setLineLow(x0, y0, x1, y1, color, keepHistory);
            }
        }
        else {
            if (y0 > y1) {
                this.setLineHigh(x1, y1, x0, y0, color, keepHistory);
            }
            else {
                this.setLineHigh(x0, y0, x1, y1, color, keepHistory);
            }
        }
    }

    setLineLow(x0, y0, x1, y1, color, keepHistory = true){
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
            this.setPixel(x, y, color, keepHistory);
            if (D > 0) {
                y += yi;
                D += 2 * (dy - dx);
            }
            else {
                D += 2 * dy;
            }
        }
    }

    setLineHigh(x0, y0, x1, y1, color, keepHistory = true){
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
            this.setPixel(x, y, color, keepHistory);
            if (D > 0) {
                x += xi;
                D += 2 * (dx - dy);
            }
            else {
                D += 2 * dx;
            }
        }
    }

    revertDelta(delta) {
        for (var i = 0; i < delta.length; i++) {
            var p = delta[i];
            this.setPixel(p.x, p.y, p.old, false);
        }
    }

    applyDelta(delta) {
        for (var i = 0; i < delta.length; i++) {
            var p = delta[i];
            this.setPixel(p.x, p.y, p.new, false);
        }
    }
}