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
        let padding = 3;
        let itemWidth = this.width / 5;
        let halfItemWidth = itemWidth * 0.5;
        let actualWidth = itemWidth - 2 * padding;

        switch (type) {
            case 0:
                let rect = document.createElementNS(svgns, "rect");
                
                rect.setAttributeNS(null, "x", padding + position * itemWidth);
                rect.setAttributeNS(null, "y", padding);
                rect.setAttributeNS(null, "width", actualWidth);
                rect.setAttributeNS(null, "height", actualWidth);

                return rect;
                break;

            case 1:
                let circle = document.createElementNS(svgns, "circle");

                circle.setAttributeNS(null, "cx", position * itemWidth + halfItemWidth);
                circle.setAttributeNS(null, "r", actualWidth * 0.5);

                // hack for vertical-center
                if (position === 2) {
                    circle.setAttributeNS(null, "cy", this.height - padding - halfItemWidth);
                }
                else {
                    circle.setAttributeNS(null, "cy", halfItemWidth);
                }

                return circle;
                break;

            default:
                throw new Error("Unknown thruster type: " + type);
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