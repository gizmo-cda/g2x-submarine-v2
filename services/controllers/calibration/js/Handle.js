class Handle {
    constructor(parent, x, y) {
        this.parent = parent;
        this.x = x;
        this.y = y;

        this.radius = 4;

        this.rootNode;
        this.dragNode;
        this.lastX,
        this.lastY;
    }

    attach(node) {
        this.createDragNode(node);

        let handle = document.createElementNS(svgns, "circle");

        handle.setAttributeNS(null, "cx", this.x);
        handle.setAttributeNS(null, "cy", this.y);
        handle.setAttributeNS(null, "r", 4);
        handle.setAttributeNS(null, "pointer-events", "none");

        handle.setAttributeNS(null, "class", "handle");

        this.rootNode = handle;
        node.appendChild(this.rootNode);
    }

    createDragNode(node) {
        let dragger = document.createElementNS(svgns, "circle");

        dragger.setAttributeNS(null, "cx", this.x);
        dragger.setAttributeNS(null, "cy", this.y);
        dragger.setAttributeNS(null, "r", 40);
        dragger.setAttributeNS(null, "fill", "none");
        dragger.setAttributeNS(null, "pointer-events", "fill");

        dragger.addEventListener("mousedown", this);

        this.dragNode = dragger;
        node.appendChild(this.dragNode);
    }

    handleEvent(e) {
        this[e.type](e);
    }

    mousedown(e) {
        this.lastX = e.x;
        this.lastY = e.y;

        this.rootNode.setAttributeNS(null, "class", "handle-selected");

        this.dragNode.removeEventListener("mousedown", this);
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

        this.rootNode.setAttributeNS(null, "cx", this.x);
        this.rootNode.setAttributeNS(null, "cy", this.y);
        this.dragNode.setAttributeNS(null, "cx", this.x);
        this.dragNode.setAttributeNS(null, "cy", this.y);

        this.parent.onhandlemove(this);
    }

    mouseup(e) {
        this.mousemove(e);

        this.rootNode.setAttributeNS(null, "class", "handle");

        this.dragNode.removeEventListener("mousemove", this);
        this.dragNode.removeEventListener("mouseup", this);
        this.dragNode.addEventListener("mousedown", this);
    }
}
