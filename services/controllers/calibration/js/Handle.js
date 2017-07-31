class Handle {
    constructor(parent, x, y) {
        this.parent = parent;
        this._x = x;
        this._y = y;
        this.bounds = null;
        this.radius = 4;
        this.rootNode;

        this.dragNode;
        this.lastX,
        this.lastY;

        this.dragX = x;
        this.dragY = y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        if (value !== this._x) {
            if (this.bounds !== null && this.bounds !== undefined) {
                let right = this.bounds.x + this.bounds.width;

                if (this.bounds.x <= value && value < right) {
                    this._x = value;
                }
                else {
                    this._x = Math.max(this.bounds.x, Math.min(value, right));
                }
            }
            else {
                this._x = value;
            }

            this.rootNode.setAttributeNS(null, "cx", this._x);
        }
    }

    get y() {
        return this._y;
    }

    set y(value) {
        if (value !== this._y) {
            if (this.bounds !== null && this.bounds !== undefined) {
                let bottom = this.bounds.y + this.bounds.height;

                if (this.bounds.y <= value && value < bottom) {
                    this._y = value;
                }
                else {
                    this._y = Math.max(this.bounds.y, Math.min(value, bottom));
                }
            }
            else {
                this._y = value;
            }

            this.rootNode.setAttributeNS(null, "cy", this._y);
        }
    }

    attach(node) {
        this.createDragNode(node);

        let handle = document.createElementNS(svgns, "circle");

        handle.setAttributeNS(null, "cx", this.x);
        handle.setAttributeNS(null, "cy", this.y);
        handle.setAttributeNS(null, "r", 4);
        handle.setAttributeNS(null, "pointer-events", "fill");

        handle.setAttributeNS(null, "class", "handle");

        handle.addEventListener("mousedown", this);

        this.rootNode = handle;
        node.appendChild(this.rootNode);
    }

    detach() {
        if (this.rootNode !== null) {
            this.rootNode.removeEventListener("mousedown", this);
            this.rootNode.parentNode.removeChild(this.rootNode);
            this.rootNode = null;
        }

        if (this.dragNode !== null) {
            this.dragNode.parentNode.removeChild(this.dragNode);
            this.dragNode = null;
        }
    }

    createDragNode(node) {
        let dragger = document.createElementNS(svgns, "circle");

        dragger.setAttributeNS(null, "cx", this.x);
        dragger.setAttributeNS(null, "cy", this.y);
        dragger.setAttributeNS(null, "r", 50);
        dragger.setAttributeNS(null, "fill", "none");
        // dragger.setAttributeNS(null, "fill", "white");
        // dragger.setAttributeNS(null, "fill-opacity", 0.25);
        dragger.setAttributeNS(null, "pointer-events", "none");

        this.dragNode = dragger;
        node.appendChild(this.dragNode);
    }

    handleEvent(e) {
        this[e.type](e);
    }

    mousedown(e) {
        if (e.shiftKey) {
            // TODO: this should be another event type on Handles that the parent
            // listens for
            this.parent.onhandleremove(this);
            return;
        }

        this.lastX = e.x;
        this.lastY = e.y;

        this.dragX = this.x;
        this.dragY = this.y;
        this.dragNode.setAttributeNS(null, "cx", this.dragX);
        this.dragNode.setAttributeNS(null, "cy", this.dragY);

        this.rootNode.setAttributeNS(null, "class", "handle-selected");

        this.rootNode.removeEventListener("mousedown", this);
        this.rootNode.setAttributeNS(null, "pointer-events", "none");

        this.dragNode.setAttributeNS(null, "pointer-events", "fill");
        this.dragNode.addEventListener("mousemove", this);
        this.dragNode.addEventListener("mouseup", this);
    }

    mousemove(e) {
        let dx = e.x - this.lastX;
        let dy = e.y - this.lastY;

        this.lastX = e.x;
        this.lastY = e.y;

        this.x += dx;
        this.y += dy;
        this.dragX += dx;
        this.dragY += dy

        this.dragNode.setAttributeNS(null, "cx", this.dragX);
        this.dragNode.setAttributeNS(null, "cy", this.dragY);

        // NOTE: this should be another event type on Handles that the parent
        // listens for
        this.parent.onhandlemove(this);
    }

    mouseup(e) {
        // NOTE: we don't really need to do this here, but its useful to have
        // the drag area reset its position during debugging
        this.dragX = this.x;
        this.dragY = this.y;

        this.mousemove(e);

        this.rootNode.setAttributeNS(null, "class", "handle");

        this.dragNode.removeEventListener("mousemove", this);
        this.dragNode.removeEventListener("mouseup", this);
        this.dragNode.setAttributeNS(null, "pointer-events", "none");

        this.rootNode.addEventListener("mousedown", this);
        this.rootNode.setAttributeNS(null, "pointer-events", "fill");
    }
}
