export default {
    input: "build/ts/index.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "latinstudier",
        file: "build/bundle.js",
    },
}