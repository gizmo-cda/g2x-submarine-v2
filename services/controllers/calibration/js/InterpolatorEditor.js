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

            // TODO: these should not be called from here
            if (this.onchange !== null && this.onchange !== undefined) {
                this.onchange();
            }
        }
    }
}
