class Joystick {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._showPosition = true;
        this.xPosition = 0;
        this.yPosition = 0;
        this.controlRadius = 3.5;

        this.positionNode = null;
    }

    set showPosition(value) {
        if (this._showPosition !== value) {
            this._showPosition = value;

            this.positionNode.setAttributeNS(null, "display", value ? "inline" : "none");
        }
    }

    attach(node) {
        // create container
        let g = document.createElementNS(svgns, "g");

        g.setAttributeNS(null, "transform", `translate(${this.x}, ${this.y})`);

        // draw border
        let border = document.createElementNS(svgns, "circle");
        let halfWidth = this.width * 0.5;
        let halfHeight = this.height * 0.5;
        let radius = Math.min(halfWidth, halfHeight);

        border.setAttributeNS(null, "cx", halfWidth);
        border.setAttributeNS(null, "cy", halfHeight);
        border.setAttributeNS(null, "r", radius);

        border.setAttributeNS(null, "class", "joystick-border");

        g.appendChild(border);

        // draw position
        let position = document.createElementNS(svgns, "circle");
        let cx = halfWidth + this.xPosition * (radius - this.controlRadius);
        let cy = halfWidth + this.yPosition * (radius - this.controlRadius);

        position.setAttributeNS(null, "cx", cx);
        position.setAttributeNS(null, "cy", cy);
        position.setAttributeNS(null, "r", this.controlRadius);

        position.setAttributeNS(null, "class", "joystick-handle");
        position.setAttributeNS(null, "display", this._showPosition ? "inline" : "none");

        this.positionNode = position;
        g.append(this.positionNode);

        // attach everything to specified node
        node.appendChild(g);
    }
}
