let svgns = "http://www.w3.org/2000/svg";

var interpolator, sensitivity, iWithS;
var iGraph, sGraph, iwsGraph;

function go() {
  let interpolator = createInterpolator();
  sensitivity = new Sensitivity();
  iWithS = new InterpolatorWithSensitivity(interpolator, sensitivity);

  let chart = document.getElementById("chart");

  let margin = 35;
  let padding = 15;
  let width = 600;
  let height = 200;

  iGraph = new Graph(
    margin,
    margin + 0 * (200 + padding),
    width,
    height,
    0, 360,
    -1, 1,
    4,
    10,
    360,
    10,
    interpolator
  );

  sGraph = new Graph(
    margin,
    margin + 1 * (200 + padding),
    width,
    height,
    -1, 1,
    -1, 1,
    4,
    8,
    360,
    10,
    sensitivity
  );

  iwsGraph = new Graph(
    margin,
    margin + 2 * (200 + padding),
    width,
    height,
    0, 360,
    -1, 1,
    4,
    8,
    360,
    10,
    iWithS
  );

  iGraph.attach(chart);
  sGraph.attach(chart);
  iwsGraph.attach(chart);
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