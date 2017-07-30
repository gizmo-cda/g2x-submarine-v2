class InterpolatorEditor {
    constructor(xMin, xMax, yMin, yMax, bbox) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.bbox = bbox;

        this._interpolator = null;
        this.rootNode;
        this.currentHandle = null;
        this.handles = [];

        this.onchange = null;
    }

    set interpolator(value) {
        if (this._interpolator !== value) {
            this._interpolator = value;
            this.createHandles();
        }
    }

    get interpolator() {
        return this._interpolator;
    }

    attach(node) {
        this.rootNode = document.createElementNS(svgns, "g");

        let rect = document.createElementNS(svgns, "rect");
        rect.setAttributeNS(null, "x", this.bbox.x);
        rect.setAttributeNS(null, "y", this.bbox.y);
        rect.setAttributeNS(null, "width", this.bbox.width);
        rect.setAttributeNS(null, "height", this.bbox.height);
        rect.setAttributeNS(null, "fill", "none");
        rect.setAttributeNS(null, "pointer-events", "fill");
        rect.addEventListener("mousedown", this);
        node.appendChild(rect);

        this.createHandles();

        node.appendChild(this.rootNode);
    }

    createHandles() {
        if (this.rootNode !== null && this.rootNode !== undefined) {
            if (this.handles.length > 0) {
                this.handles.forEach(handle => {
                    handle.detach();
                });

                this.handles = [];
            }

            if (this._interpolator !== null && this._interpolator !== undefined) {
                let right = this.bbox.x + this.bbox.width;
                let bottom = this.bbox.x + this.bbox.height;

                this._interpolator.data.forEach(entry => {
                    let x = map(entry.index, this.xMin, this.xMax, this.bbox.x, right);
                    let y = map(entry.value, this.yMin, this.yMax, bottom, this.bbox.y);
                    let handle = new Handle(this, x, y);

                    handle.bounds = this.bbox;

                    this.handles.push(handle);
                    handle.attach(this.rootNode);
                });
            }
        }
    }

    onhandlemove(handle) {
        var entryIndex = -1;

        for (var i = 0; i < this.handles.length; i++) {
            if (this.handles[i] === handle) {
                entryIndex = i;
                break;
            }
        }
        
        if (entryIndex != -1) {
            this._interpolator.data.splice(entryIndex, 1);

            let right = this.bbox.x + this.bbox.width;
            let bottom = this.bbox.x + this.bbox.height;
            let index = map(handle.x, this.bbox.x, right, this.xMin, this.xMax);
            let value = map(handle.y, bottom, this.bbox.y, this.yMin, this.yMax);

            this._interpolator.addIndexValue(index, value);

            if (this.onchange !== null && this.onchange !== undefined) {
                this.onchange();
            }
        }
    }

    handleEvent(e) {
        this[e.type](e);
    }

    mousedown(e) {
        let right = this.bbox.x + this.bbox.width;
        let bottom = this.bbox.x + this.bbox.height;

        // TODO: using iGraph directly here, which is wrong
        // need to use CTM instead
        let index = map(e.clientX - iGraph.x, this.bbox.x, right, this.xMin, this.xMax);
        let value = map(e.clientY - iGraph.y, bottom, this.bbox.y, this.yMin, this.yMax);

        this._interpolator.addIndexValue(index, value);

        this.createHandles();

        if (this.onchange !== null && this.onchange !== undefined) {
            this.onchange();
        }
    }
}
