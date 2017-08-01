class Graph {
    constructor(x, y, width, height, xMin, xMax, yMin, yMax, xMajorSub, yMajorSub, xMinorSub, yMinorSub, dataProvider) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;

        this.xMajorSub = xMajorSub;
        this.yMajorSub = yMajorSub;
        this.xMinorSub = xMinorSub;
        this.yMinorSub = yMinorSub;
        
        this.dataProvider = dataProvider;

        this.showHorizontalLines = true;
        this.showVerticalLines = true;

        this.showLabels = false;
        this.labelSize = 32;

        this.showJoysticks = true;
        this.joystickSize = 22;
        this.joysticks = [];

        this.rootNode = null;
        this.dataNode = null;
    }

    get graphBoundingBox() {
        let topPad = this.showLabels ? this.labelSize : 0;
        let bottomPad = this.showJoysticks ? this.joystickSize : 0;

        return {
            x: 0,
            y: topPad,
            width: this.width,
            height: this.height - topPad - bottomPad
        };
    }

    attach(node) {
        // create container
        this.rootNode = document.createElementNS(svgns, "g");
        this.rootNode.setAttributeNS(null, "transform", `translate(${this.x}, ${this.y})`);

        // draw grid
        if (this.showVerticalLines) {
            this.drawVerticalLines();
        }

        if (this.showHorizontalLines) {
            this.drawHorizontalLines();
        }

        // draw labels
        if (this.showLabels) {
        }

        // draw joysticks
        if (this.showJoysticks) {
            this.drawJoysticks();
        }

        if (this.dataProvider !== null && this.dataProvider !== undefined) {
            this.drawData();
        }

        // attach
        node.appendChild(this.rootNode);
    }

    drawVerticalLines() {
        let bbox = this.graphBoundingBox;

        for (var step = 0; step <= this.xMajorSub; step++) {
            let x = lerp(bbox.x, bbox.x + bbox.width, step / this.xMajorSub);
            let line = document.createElementNS(svgns, "line");

            line.setAttributeNS(null, "x1", x);
            line.setAttributeNS(null, "y1", bbox.y);
            line.setAttributeNS(null, "x2", x);
            line.setAttributeNS(null, "y2", bbox.y + bbox.height);

            line.setAttributeNS(null, "class", "x-major");

            this.rootNode.appendChild(line);
        }
    }

    drawHorizontalLines() {
        let bbox = this.graphBoundingBox;

        for (var step = 0; step <= this.yMajorSub; step++) {
            let y = lerp(bbox.y, bbox.y + bbox.height, step / this.yMajorSub);
            let line = document.createElementNS(svgns, "line");

            line.setAttributeNS(null, "x1", bbox.x);
            line.setAttributeNS(null, "y1", y);
            line.setAttributeNS(null, "x2", bbox.x + bbox.width);
            line.setAttributeNS(null, "y2", y);

            if (lerp(this.yMin, this.yMax, step / this.yMajorSub) === 0) {
                line.setAttributeNS(null, "class", "y-major-zero");
            }
            else {
                line.setAttributeNS(null, "class", "y-major");
            }

            this.rootNode.appendChild(line);
        }
    }

    drawJoysticks() {
        let bbox = this.graphBoundingBox;
        let factorY = bbox.height / 100;
        let width = this.joystickSize * 2;
        let power = 100;
        let margin = 2.5;

        for (var step = 0; step <= this.xMajorSub; step++) {
            let radians = lerp(0, 2.0 * Math.PI, step / this.xMajorSub);
            let x = lerp(bbox.x, bbox.x + bbox.width, step / this.xMajorSub);
            let y = bbox.y + power * factorY;

            // create left joystick
            let left = new Joystick(
                x - this.joystickSize + margin,
                y + margin,
                this.joystickSize - margin * 2, 
                this.joystickSize - margin * 2
            );

            left.xPosition = Math.cos(-radians);
            left.yPosition = Math.sin(-radians);

            left.attach(this.rootNode);

            // create right joystick
            let right = new Joystick(
                x + margin,
                y + margin,
                this.joystickSize - margin * 2,
                this.joystickSize - margin * 2
            );

            right.xPosition = Math.cos(-radians);
            right.yPosition = Math.sin(-radians);

            right.attach(this.rootNode);
            
            right.showPosition = false;     // NOTE: have to set after the joystick has been created

            this.joysticks.push([left, right]);
        }
    }

    drawData() {
        let bbox = this.graphBoundingBox;
        let steps = 50;
        let points = [];

        for (var step = 0; step <= this.xMinorSub; step++) {
            let x = lerp(bbox.x, bbox.x + bbox.width, step / this.xMinorSub);
            let index = lerp(this.xMin, this.xMax, step / this.xMinorSub);
            let value = this.dataProvider.valueAtIndex(index);
            let y = map(value, this.yMin, this.yMax, bbox.y + bbox.height, bbox.y);

            points.push(`${x},${y}`);
        }

        if (this.dataNode === null) {
            this.dataNode = document.createElementNS(svgns, "polyline");

            this.dataNode.setAttributeNS(null, "class", "data-line");
            // this.rootNode.appendChild(this.dataNode);
            this.rootNode.insertBefore(this.dataNode, this.rootNode.firstChild);
        }

        this.dataNode.setAttributeNS(null, "points", points.join(", "));
    }
}
