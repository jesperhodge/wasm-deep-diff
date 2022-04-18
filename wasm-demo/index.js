import {diff} from "deep-object-diff";

import("./node_modules/wasm-deep-diff/wasm_deep_diff.js").then((js) => {
    js.greet("WebAssembly with NPM");
});

async function constructLargerObject(original) {
    const result = Object.assign({}, original);
    let counter = 1;
    while (counter < 10000) {
        result['prop' + counter.toString()] = original["Aidan Gillen"];
        counter++;
    }
    return result;
}

async function calcPerformance(lhs, rhs, results, diffRes) {
    let counter = 0;
    while (counter < 10) {
        const mark1 = performance.now();
        const res = diff(lhs, rhs)
        const final = performance.now() - mark1;
        results.push(final);
        if (!diffRes) diffRes = res;
        counter++;
    }
    return diffRes;
}

async function alertPerformance() {
    const lhsOriginal = {
        "Aidan Gillen": {
            "array": ["Game of Thron\"es", "The Wire"],
            "string": "some string",
            "int": 2,
            "aboolean": true,
            "boolean": true,
            "object": {
                "foo": "bar",
                "object1": {"new prop1": "new prop value"},
                "object2": {"new prop1": "new prop value"},
                "object3": {"new prop1": "new prop value"},
                "object4": {"new prop1": "new prop value"}
            }
        },
        "Amy Ryan": {"one": "In Treatment", "two": "The Wire"},
        "Annie Fitzgerald": ["Big Love", "True Blood"],
        "Anwan Glover": ["Treme", "The Wire"],
        "Alexander Skarsgard": ["Generation Kill", "True Blood"],
        "Clarke Peters": null
    }

    const rhsOriginal = {
        "Aidan Gillen": {
            "array": ["Game of Thrones", "The Wire"],
            "string": "some string",
            "int": "2",
            "otherint": 4,
            "aboolean": "true",
            "boolean": false,
            "object": {"foo": "bar"}
        },
        "Amy Ryan": ["In Treatment", "The Wire"],
        "Annie Fitzgerald": ["True Blood", "Big Love", "The Sopranos", "Oz"],
        "Anwan Glover": ["Treme", "The Wire"],
        "Alexander Skarsg?rd": ["Generation Kill", "True Blood"],
        "Alice Farmer": ["The Corner", "Oz", "The Wire"]
    }

    const lhs = await constructLargerObject(lhsOriginal);
    const rhs = await constructLargerObject(rhsOriginal);

    console.log("lhs: ", lhs);
    console.log("rhs: ", rhs);
    const results = [];

    let diffRes = null;
    diffRes = await calcPerformance(lhs, rhs, results, diffRes);

    const sum = results.reduce((a, b) => a + b, 0);
    const avg = (sum / results.length) || 0;

    console.log('diff: ', diffRes);
    console.log('performance: ', avg)
    alert(`Measured with npm module deep-object-diff, average performance was: ${avg}ms`)
}

alertPerformance();