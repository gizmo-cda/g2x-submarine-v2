let svgns = "http://www.w3.org/2000/svg";

var sensitivity, iWithS;
var iGraph, sGraph, iwsGraph;
var submarine;
var activeThruster = 0;
var editor;

var data;

let names = [
    "Horizontal Left",
    "Vertical Left",
    "Vertical Center",
    "Vertical Right",
    "Horizontal Right",
];
let assignedJoystick = [
    0,
    1,
    1,
    1,
    0
];

function go() {
    document.onkeydown = handleKey;
    createCharts();

    // NOTE: need to call this last since it is async
    Data.getData(processNewData);
}

function processNewData(error, newData) {
    if (newData.version !== 1) {
        console.error(`Unsupported data version number '${newData.version}'`);
        return;
    }

    data = newData;

    // create sensitivity data provider
    sensitivity = new Sensitivity(data.sensitivity.strength, data.sensitivity.power);

    // convert thruster data providers
    data.thrusters = data.thrusters.map(values => {
        let interpolator = new Interpolator();

        for (var i = 0; i < values.length; i += 2) {
            interpolator.addIndexValue(values[i], values[i+1]);
        }

        return interpolator;
    });

    // draw charts
    updateCharts();

    // update range elements
    document.getElementById("t").value = data.sensitivity.strength;
    document.getElementById("tLabel").innerHTML = data.sensitivity.strength;
    document.getElementById("power").value = data.sensitivity.power;
    document.getElementById("powerLabel").innerHTML = data.sensitivity.power;
}

function loadSettings() {
    let name = document.getElementById("filename").value;

    Data.getNamedData(name, processNewData);
}

function saveSettings() {
    var filename = document.getElementById("filename").value;

    Data.sendData({
        version: 1,
        name: filename,
        sensitivity: {
            strength: sensitivity.t - 0,
            power: sensitivity.power - 0
        },
        thrusters: [
            data.thrusters[0].to_array(),
            data.thrusters[1].to_array(),
            data.thrusters[2].to_array(),
            data.thrusters[3].to_array(),
            data.thrusters[4].to_array()
        ]
    }, function(error) {
        if (error) {
            console.error(error);
        }
    })
}

function createCharts() {
    let margin        = 50;
    let padding       = 15;
    let width         = 600;
    let height        = 300;
    let joyStickSize  = 22;
    let submarineSize = Math.min(width, height) - joyStickSize;

    let chart = document.getElementById("chart");
    chart.setAttributeNS(null, "width", margin + submarineSize + padding + width + + joyStickSize + margin);
    chart.setAttributeNS(null, "height", margin + height + padding + height + margin);

    // top-left
    submarine = new Submarine(
        margin,
        margin,
        submarineSize,
        submarineSize
    );
    submarine.onchange = updateActiveThruster;

    // top-right
    iGraph = new Graph(
        margin + submarineSize + 2 * padding,   // x
        margin + 0 * (height + padding),        // y
        width,                                  // width
        height,                                 // height
        0, 360,                                 // xMin, xMax 
        -1, 1,                                  // yMin, yMax
        4,                                      // xMajorSubdivisions
        20,                                     // yMajorSubdivisions
        360,                                    // xMinorSubdivisions
        10                                      // yMinorSubdivisions
    );

    // bottom-left
    sGraph = new Graph(
        margin,
        margin + 1 * (height + padding),
        submarineSize,
        submarineSize,
        -1, 1,
        -1, 1,
        4,
        4,
        360,
        10
    );
    sGraph.showJoysticks = false;

    // bottom-right
    iwsGraph = new Graph(
        margin + submarineSize + 2 * padding,
        margin + 1 * (height + padding),
        width,
        height,
        0, 360,
        -1, 1,
        4,
        20,
        360,
        10
    );

    // interpolator editor
    editor = new InterpolatorEditor(
        iGraph.xMin,
        iGraph.xMax,
        iGraph.yMin,
        iGraph.yMax,
        iGraph.graphBoundingBox
    );
    editor.onchange = () => {
        iGraph.drawData();
        iwsGraph.drawData();
    }

    // initial render
    submarine.attach(chart);
    iGraph.attach(chart);
    sGraph.attach(chart);
    iwsGraph.attach(chart);
    editor.attach(iGraph.rootNode);
}

function handleKey(e) {
    let lastIndex = data.thrusters.length - 1;

    switch (e.keyCode) {
        case 38:
            // up arrow
            break;

        case 40:
            // down arrow
            break;

        case 37:
            // left arrow
            if (activeThruster > 0) {
                activeThruster--;
            }
            else {
                activeThruster = lastIndex;
            }
            updateCharts();
            break;

        case 39:
            // right arrow
            if (activeThruster < lastIndex) {
                activeThruster++;
            }
            else {
                activeThruster = 0;
            }
            updateCharts();
            break;
    }
}

function updateCharts() {
    // create thruster with sensitivity provider
    iWithS = new InterpolatorWithSensitivity(data.thrusters[activeThruster], sensitivity);

    // apply data providers to graphs
    iGraph.dataProvider = data.thrusters[activeThruster];
    sGraph.dataProvider = sensitivity;
    iwsGraph.dataProvider = iWithS;

    // update editor provider
    editor.interpolator = iGraph.dataProvider;

    // update active joysticks
    var activeJoystick = assignedJoystick[activeThruster];

    iGraph.joysticks.forEach((pair) => {
        pair[0].showPosition = activeJoystick === 0;
        pair[1].showPosition = activeJoystick === 1;
    });
    iwsGraph.joysticks.forEach((pair) => {
        pair[0].showPosition = activeJoystick === 0;
        pair[1].showPosition = activeJoystick === 1;
    });

    // update all graphs
    iGraph.drawData();
    sGraph.drawData();
    iwsGraph.drawData();

    // update submarine graphic
    submarine.activeThruster = activeThruster;

    document.getElementById("thruster").innerHTML = names[activeThruster];
}

function updateT(value) {
    sensitivity.t = value;

    document.getElementById("tLabel").innerHTML = value;

    sGraph.drawData();
    iwsGraph.drawData();
}

function updatePower(value) {
    sensitivity.power = value;

    document.getElementById("powerLabel").innerHTML = value;

    sGraph.drawData();
    iwsGraph.drawData();
}

function updateActiveThruster(submarine) {
    activeThruster = submarine.activeThruster;
    updateCharts();
}
