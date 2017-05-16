#!/usr/bin/env node

let fs = require('fs');

let filename = '../cad/submarine-shell.tobj';
let source = fs.readFileSync(filename, { encoding: 'utf-8' });
let lines = source.split(/\r\n?|\r/);

let counts = {
    comments: 0,
    emptyLines: 0,
    v: 0,
    vt: 0,
    vn: 0,
    f: 0,
    s: 0,
    g: 0,
    mtllib: 0,
    usemtl: 0
};

let result = {
    vertices: [],
    normals: [],
    textureCoordinates: [],
    faces: []
}

function toNumber(value) {
    return value === undefined ? value : +value;
}

lines.forEach((line) => {
    if (/^\s*#.*$/.test(line)) {
        // ignore comments
        counts.comments++;
    }
    else if (/^\s*$/.test(line)) {
        // ignore empty lines
        counts.emptyLines++;
    }
    else {
        parts = line.trim().split(/\s+/);
        let cmd = parts[0];
        let args = parts.slice(1);

        counts[cmd]++;

        switch (cmd) {
            case "v":
                result.vertices.push(args.map(toNumber));
                break;

            case "vn":
                result.normals.push(args.map(toNumber));
                break;

            case "vt":
                result.textureCoordinates.push(args.map(toNumber));
                break;

            case "f":
                result.faces.push(args.map((value) => {
                    return value.split("/").map(toNumber);
                }));
                break;

            // ignoring these for now
            case "s":
                break;

            case "g":
                break;

            case "mtllib":
                break;

            case "usemtl":
                break;

            default:
                console.error("unknown command:", cmd);
                break;
        }
    }
});

result.filename = filename;
result.counts = counts;
console.log(JSON.stringify(result));
