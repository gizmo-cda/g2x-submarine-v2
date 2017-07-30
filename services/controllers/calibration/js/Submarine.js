class Submarine {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.rootNode = null;

        this.thrusters = [];
        this._activeThruster = 0;
        this.color = "rgb(255, 128, 0)";

        this.onchange = null;
    }

    get activeThruster() {
        return this._activeThruster;
    }
    
    set activeThruster(value) {
        value = Math.max(0, Math.min(value, this.thrusters.length - 1));

        if (value !== this._activeThruster) {
            this.thrusters[this._activeThruster].setAttributeNS(null, "fill", "none");
            this._activeThruster = value;
            this.thrusters[this._activeThruster].setAttributeNS(null, "fill", this.color);

            if (this.onchange) {
                this.onchange(this);
            }
        }
    }

    attach(node) {
        this.rootNode = document.createElementNS(svgns, "g");
        this.rootNode.setAttributeNS(null, "transform", `translate(${this.x}, ${this.y})`);

        // create background
        let bbox = this.thrusterBoundingBox();
        let rect = document.createElementNS(svgns, "rect");

        rect.setAttributeNS(null, "x", bbox.x);
        rect.setAttributeNS(null, "y", bbox.y);
        rect.setAttributeNS(null, "width", bbox.width);
        rect.setAttributeNS(null, "height", bbox.height);

        rect.setAttributeNS(null, "class", "submarine-background");

        this.rootNode.appendChild(rect);

        // create thrusters
        this.thrusters = [
            this.createThruster(0, 0),
            this.createThruster(1, 1),
            this.createThruster(1, 2),
            this.createThruster(1, 3),
            this.createThruster(0, 4)
        ];

        this.thrusters.forEach((thruster, index) => {
            thruster.setAttributeNS(null, "class", "thruster");
            thruster.setAttributeNS(null, "pointer-events", "fill");
            thruster.setAttributeNS(null, "fill", (index === this._activeThruster) ? this.color : "none");

            thruster.addEventListener("mousedown", this);

            this.rootNode.appendChild(thruster)
        });

        node.appendChild(this.rootNode);
    }

    createThruster(type, position) {
        let bbox = this.thrusterBoundingBox();
        let padding = 3;

        let columnWidth = bbox.width / 5;
        let columnStart = bbox.x + columnWidth * position;
        let columnEnd = columnStart + columnWidth;

        switch (type) {
            case 0:
                let rect = document.createElementNS(svgns, "rect");
                
                rect.setAttributeNS(null, "x", columnStart + padding);
                rect.setAttributeNS(null, "y", bbox.y + padding);
                rect.setAttributeNS(null, "width", columnWidth - 2 * padding);
                rect.setAttributeNS(null, "height", columnWidth - 2 * padding);

                return rect;
                break;

            case 1:
                let circle = document.createElementNS(svgns, "circle");
                let r = (columnWidth - 2 * padding) * 0.5

                circle.setAttributeNS(null, "cx", (columnStart + columnEnd) * 0.5);
                circle.setAttributeNS(null, "r", r);

                // hack for vertical-center
                if (position === 2) {
                    circle.setAttributeNS(null, "cy", bbox.y + bbox.height - padding - r);
                }
                else {
                    circle.setAttributeNS(null, "cy", bbox.y + padding + r);
                }

                return circle;
                break;

            default:
                throw new Error("Unknown thruster type: " + type);
        }
    }

    thrusterBoundingBox() {
        let padding = 6;

        return {
            x: padding,
            y: padding,
            width: this.width - 2 * padding,
            height: this.height - 2 * padding
        }
    }

    handleEvent(e) {
        var target = null;

        for (var i = 0; i < this.thrusters.length; i++) {
            if (this.thrusters[i] === e.target) {
                this.activeThruster = i;
                break;
            }
        }
    }
}