class Joystick {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.showPosition = true;
        this.xPosition = 0;
        this.yPosition = 0;

        this.positionNode = null;
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
        if (this.showPosition) {
            let position = document.createElementNS(svgns, "circle");
            let controlRadius = 6;
            let cx = halfWidth + this.xPosition * (radius - controlRadius);
            let cy = halfWidth + this.yPosition * (radius - controlRadius);

            position.setAttributeNS(null, "cx", cx);
            position.setAttributeNS(null, "cy", cy);
            position.setAttributeNS(null, "r", controlRadius);

            position.setAttributeNS(null, "class", "joystick-handle");

            this.positionNode = position;
            g.append(this.positionNode);
        }

        // attach everything to specified node
        node.appendChild(g);
    }
}
