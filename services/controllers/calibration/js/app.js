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

    // setup interpolator editor
    editor = new InterpolatorEditor(
        iGraph.xMin,
        iGraph.xMax,
        iGraph.yMin,
        iGraph.yMax,
        iGraph.graphBoundingBox
    );
    editor.interpolator = iGraph.dataProvider;
    editor.attach(iGraph.rootNode);
    editor.onchange = () => {
        iGraph.drawData();
        iwsGraph.drawData();
    }
}

function saveSettings() {
    Data.sendData({
        version: 1,
        sensitivity: {
            strength: sensitivity.t,
            power: sensitivity.power
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
    let chart = document.getElementById("chart");

    let margin = 35;
    let padding = 15;
    let width = 600;
    let height = 300;
    let joyStickHeight = 22;
    let subWidth = height - joyStickHeight;

    chart.setAttributeNS(null, "width", margin + subWidth + padding + width + + joyStickHeight + margin);
    chart.setAttributeNS(null, "height", margin + height + padding + height + margin);

    submarine = new Submarine(
        margin,
        margin,
        subWidth,
        subWidth
    );
    submarine.onchange = updateActiveThruster;

    iGraph = new Graph(
        margin + subWidth + 2 * padding,    // x
        margin + 0 * (height + padding),    // y
        width,                              // width
        height,                             // height
        0, 360,                             // xMin, xMax 
        -1, 1,                              // yMin, yMax
        4,                                  // xMajorSubdivisions
        10,                                 // yMajorSubdivisions
        360,                                // xMinorSubdivisions
        10                                  // yMinorSubdivisions
    );

    sGraph = new Graph(
        margin,
        margin + 1 * (height + padding),
        subWidth,
        subWidth,
        -1, 1,
        -1, 1,
        4,
        4,
        360,
        10
    );
    sGraph.showJoysticks = false;

    iwsGraph = new Graph(
        margin + subWidth + 2 * padding,
        margin + 1 * (height + padding),
        width,
        height,
        0, 360,
        -1, 1,
        4,
        10,
        360,
        10
    );

    iGraph.attach(chart);
    sGraph.attach(chart);
    iwsGraph.attach(chart);
    submarine.attach(chart);
}

function createInterpolator() {
    let interpolator = new Interpolator();

    interpolator.addIndexValue(0.0, -1.0)
    interpolator.addIndexValue(90.0, 1.0)
    interpolator.addIndexValue(180.0, 1.0)
    interpolator.addIndexValue(270.0, -1.0)
    interpolator.addIndexValue(360.0, -1.0)

    return interpolator;
}

function handleKey(e) {
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
                updateCharts();
            }
            break;

        case 39:
            // right arrow
            if (activeThruster < data.thrusters.length - 1) {
                activeThruster++;
                updateCharts();
            }
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
